// Pure helpers for sliding rulers.
export function snapValue(raw, {min = 0, max = 100, step = 1} = {}) {
  if (!(max > min) || !(step > 0)) throw new RangeError('range needs max>min and step>0');
  const number = Number(raw);
  if (!Number.isFinite(number)) return min;
  const clamped = Math.min(max, Math.max(min, number));
  const snapped = min + Math.round((clamped - min) / step) * step;
  return Math.min(max, Number(snapped.toFixed(10)));
}
export const fractionOf = (value, {min = 0, max = 100} = {}) => (Math.min(max, Math.max(min, value)) - min) / (max - min);
export const stepValue = (value, delta, range) => snapValue(value + delta * (range.step ?? 1), range);
