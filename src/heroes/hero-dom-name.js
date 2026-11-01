// Game text is authored with the canonical hero name "Long". When the player picked another hero, this keeps
// everything on screen (text nodes and accessible attributes, including late-rendered panels and Room 2's
// byte-locked donor view) in that hero's name. Nothing to do for Long, so the observer is only live for others.
import {activeHero, heroText} from './hero-profiles.js';

const ATTRIBUTES = ['aria-label', 'alt', 'title', 'placeholder'];
let observer = null;

function rewrite(node, hero) {
  if (node.nodeType === 3) {
    const next = heroText(node.nodeValue, hero);
    if (next !== node.nodeValue) node.nodeValue = next;
    return;
  }
  if (node.nodeType !== 1) return;
  for (const name of ATTRIBUTES) {
    const value = node.getAttribute(name), next = heroText(value, hero);
    if (value !== null && next !== value) node.setAttribute(name, next);
  }
  for (const child of node.childNodes) rewrite(child, hero);
}

/** (Re)applies the active hero's name to the page and keeps it applied. Safe to call repeatedly. */
export function syncHeroDomName(doc = globalThis.document) {
  observer?.disconnect(); observer = null;
  const hero = activeHero();
  if (!doc?.body || hero.name === 'Long') return;
  doc.title = heroText(doc.title, hero);
  rewrite(doc.body, hero);
  observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') rewrite(record.target, hero);
      else if (record.type === 'attributes') rewrite(record.target, hero);
      else record.addedNodes.forEach(node => rewrite(node, hero));
    }
  });
  observer.observe(doc.body, {childList: true, characterData: true, attributes: true, subtree: true, attributeFilter: ATTRIBUTES});
}
