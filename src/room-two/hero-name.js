import {activeHero} from '../heroes/hero-profiles.js';

const SYSTEM_ALT = 'Giọng nói của căn phòng ký ức'; // alt text the donor view gives Hệ Thống's portrait

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
    const portrait = narrative.portrait;
    if (!portrait) return;
    // The donor view always shows its built-in hero portrait for the hero's lines; show the chosen hero's face instead.
    if (/^Quang, /.test(portrait.alt)) portrait.src = activeHero().portrait;
    else if (portrait.alt === SYSTEM_ALT) portrait.src = activeHero().systemPortrait; // Hệ Thống's avatar follows the route too
    portrait.alt = renameHero(portrait.alt);
  };
}
