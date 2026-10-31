// Small DOM helpers shared by the Room 2 tactile stations. The donor view stays untouched: stations talk to it
// only through its own inputs/selects (set the value, fire the event the donor already listens to).
export function hide(node) {
  if (!node) return;
  node.hidden = true;
  node.style.display = 'none';
}

// Writes a form control and fires `type` so the donor handler updates its draft exactly like typing would.
export function setControl(control, value, type = 'input') {
  const text = String(value);
  if (control.value === text) return false;
  control.value = text;
  control.dispatchEvent(new Event(type, {bubbles: true}));
  return true;
}

export function focusToken(root, tokenId) {
  const selector = tokenId ? `[data-token="${CSS.escape(tokenId)}"]` : '.tb-token';
  (root.querySelector(selector) || root.querySelector('.tb-token'))?.focus();
}
