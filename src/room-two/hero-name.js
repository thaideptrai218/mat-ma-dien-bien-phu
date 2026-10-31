// The hero is now named Long. Bảo's donor narrative view (src/room-two/bao/**, byte-locked by hash) still
// hard-codes the old name, so Room 2 renames it in what that view renders instead of editing the donor body.
export const renameHero = text => typeof text === 'string' ? text.replace(/QUANG/g, 'LONG').replace(/Quang/g, 'Long') : text;

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
