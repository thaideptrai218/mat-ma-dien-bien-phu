// Turns on-screen Vietnamese text into what the TTS engine should read aloud.
// Display text never changes; only the payload sent to CapCut/OmniVoice does.
const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const SCALES = ['', ' nghìn', ' triệu', ' tỷ'];

// Reads 0–999; `full` forces "không trăm"/"linh" when a higher group precedes it (1054 → một nghìn không trăm năm mươi tư).
function readTriple(n, full) {
  const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, u = n % 10, out = [];
  if (h || full) out.push(`${DIGITS[h]} trăm`);
  if (t === 0 && u) out.push((h || full) ? `linh ${DIGITS[u]}` : DIGITS[u]);
  else if (t === 1) out.push(u === 0 ? 'mười' : `mười ${u === 5 ? 'lăm' : DIGITS[u]}`);
  else if (t > 1) out.push(`${DIGITS[t]} mươi` + (u === 0 ? '' : ` ${u === 1 ? 'mốt' : u === 4 ? 'tư' : u === 5 ? 'lăm' : DIGITS[u]}`));
  return out.join(' ');
}

export function numberToWords(value) {
  let n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`Unsupported number: ${value}`);
  if (n === 0) return 'không';
  const groups = [];
  while (n > 0) { groups.push(n % 1000); n = Math.floor(n / 1000); }
  const words = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (!groups[i]) continue;
    words.push(readTriple(groups[i], i < groups.length - 1) + SCALES[i]);
  }
  return words.join(' ');
}

const digitByDigit = text => [...text].map(d => DIGITS[Number(d)]).join(' ');
const dayWords = day => (Number(day) <= 10 ? `mùng ${numberToWords(day)}` : numberToWords(day));
const monthWords = month => (Number(month) === 4 ? 'tư' : numberToWords(month));
const ROMAN = {I: 'một', II: 'hai', III: 'ba', IV: 'bốn'};
const LETTER_NAMES = {A: 'a', B: 'bê', C: 'xê', D: 'đê', E: 'e', F: 'ép', G: 'giê', H: 'hát', I: 'i', J: 'gi', K: 'ca', L: 'e-lờ', M: 'em-mờ',
  N: 'en-nờ', O: 'o', P: 'pê', Q: 'quy', R: 'e-rờ', S: 'ét', T: 'tê', U: 'u', V: 'vê', W: 'vê kép', X: 'ích', Y: 'i dài', Z: 'dét'};

// Ordered rules: specific phrases first, then codes, dates, numbers, casing and punctuation.
const RULES = [
  [/Henri Navarre/gu, 'Hăng-ri Na-va'], [/Navarre/gu, 'Na-va'], [/\bNAVA\b/gu, 'Na-va'],
  [/Genève/gu, 'Giơ-ne-vơ'], [/Paris/gu, 'Pa-ri'], [/Louise/gu, 'Lu-i-dơ'],
  [/WASD/gu, 'W, A, S, D'],
  [/(^|[.;,] |\. )([ENMQ]) (mở|xem|thu|để)/gu, (_, lead, key, verb) => `${lead}phím ${key} ${verb}`],
  [/nhấn ([EQNM])\b/gu, 'nhấn phím $1'],
  [/^(?:Long|Hệ Thống): /u, ''],
  [/thu\/mở/gu, 'thu hoặc mở'],
  [/T · I · M · T · V · A · L/gu, 'T, I, M, T, V, A, L'],
  [/\b([AVPN])-0(\d)\b/gu, (_, letter, digit) => `${letter} không ${DIGITS[Number(digit)]}`],
  [/\b(\d) · (\d) · (\d) · (\d)\b/gu, (_, ...d) => d.slice(0, 4).map(x => DIGITS[Number(x)]).join(', ')],
  [/([Mm]ã(?: ngăn kéo)?) (\d{4})\b/gu, (_, word, code) => `${word} ${digitByDigit(code)}`],
  [/(\d)\.(\d{3})\b/gu, '$1$2'],
  [/\b0\d+\b/gu, code => digitByDigit(code)],
  [/(ngày )?\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/gu, (_, lead, d, m, y) => `ngày ${dayWords(d)} tháng ${monthWords(m)} năm ${numberToWords(y)}`],
  [/(tháng )?\b(\d{1,2})\/(\d{4})\b/gu, (_, lead, m, y) => `tháng ${monthWords(m)} năm ${numberToWords(y)}`],
  [/(ngày )?\b(\d{1,2})\/(\d{1,2})\b/gu, (_, lead, d, m) => `${lead ? 'ngày ' : ''}${numberToWords(d)} tháng ${monthWords(m)}`],
  [/([Tt]háng) (\d{1,2})\b/gu, (_, word, m) => `${word} ${monthWords(m)}`],
  [/([Nn]gày) (\d{1,2})\b/gu, (_, word, d) => `${word} ${dayWords(d)}`],
  [/(\d{4})\s*[–-]\s*(\d{4})/gu, (_, a, b) => `${numberToWords(a)} đến ${numberToWords(b)}`],
  [/(mảnh(?: tranh)?(?: số)?|Mảnh(?: tranh)?(?: số)?) (IV|III|II|I)\b/gu, (_, word, roman) => `${word} ${ROMAN[roman]}`],
  [/\bI, II, III, IV\b/gu, 'một, hai, ba, bốn'],
  [/\b([A-Z])(\d)\b/gu, (_, letter, digit) => `${letter} ${DIGITS[Number(digit)]}`],
  [/\b\d+\b/gu, n => numberToWords(n)],
  [/\p{Lu}{2,}(?:\s+\p{Lu}{2,})*/gu, caps => caps.toLowerCase()],
  [/ \/ /gu, ' so với '],
  [/\s*—\s*/gu, ', '], [/\s+–\s+/gu, ' '], [/ · /gu, ', '], [/[“”"]/gu, ''],
  // Lone capital letters (codes, keys, hills, spelled clues): CapCut misreads them ("A"→"anh", "V"→"năm"), so use Vietnamese letter names.
  [/(^|[^\p{L}])([A-Z])(?=$|[^\p{L}])/gu, (_, lead, letter) => `${lead}${LETTER_NAMES[letter]}`],
  [/\s{2,}/gu, ' '],
];

export function toTtsText(text) {
  return RULES.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text.normalize('NFC')).trim();
}
