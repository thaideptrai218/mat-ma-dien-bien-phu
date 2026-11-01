import {activeHero, heroDialogueText} from '../heroes/hero-profiles.js';
import {beats} from './system-guidance.js';

// Bảo's donor narrative view (src/room-two/bao/**, byte-locked by hash) hard-codes the original name "Quang",
// so Room 2 renames it to the hero chosen for this run (Long or Quang) in what that view renders.
export const renameHero = text => {
  if (typeof text !== 'string') return text;
  const {name, upper} = activeHero();
  return text.replace(/QUANG/g, upper).replace(/Quang/g, name);
};

export function renameHeroIn(root) {
  if (!root) return;
  const walker = root.ownerDocument.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const renamed = renameHero(node.nodeValue);
    if (renamed !== node.nodeValue) node.nodeValue = renamed;
  }
}

// Instance-level wrap of the donor NarrativeView: every rendered line gets the chosen hero's name, portrait and alt text.
export function installHeroName(narrative) {
  const renderLine = narrative.renderLine.bind(narrative);
  narrative.renderLine = (...args) => {
    renderLine(...args);
    renameHeroIn(narrative.copy);
    const beat = narrative.active && beats[narrative.active.beatId];
    const sourceLines = beat?.lines || [];
    const shownLines = narrative.wholeScene ? sourceLines : [sourceLines[narrative.active?.lineIndex]].filter(Boolean);
    narrative.copy.querySelectorAll('.vn-text p').forEach((paragraph, index) => {
      const line = shownLines[index];
      if (line) paragraph.textContent = heroDialogueText(line.text, line.speakerId === 'quang' ? 'Long' : 'Hệ Thống');
    });
    const portrait = narrative.portrait;
    if (!portrait) return;
    // The donor view always shows its built-in hero portrait for the hero's lines; show the chosen hero's face instead.
    if (portrait.alt === 'Chân dung Quang') portrait.src = activeHero().portrait;
    portrait.alt = renameHero(portrait.alt);
  };
}
