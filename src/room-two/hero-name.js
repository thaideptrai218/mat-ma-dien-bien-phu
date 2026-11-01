import {activeHero} from '../heroes/hero-profiles.js';

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

// Instance-level wrap of the donor NarrativeView: every rendered line gets the new name and portrait alt text.
export function installHeroName(narrative) {
  const renderLine = narrative.renderLine.bind(narrative);
  narrative.renderLine = (...args) => {
    renderLine(...args);
    renameHeroIn(narrative.copy);
    if (narrative.portrait) narrative.portrait.alt = renameHero(narrative.portrait.alt);
  };
}
