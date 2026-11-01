// The two playable heroes. Everything that differs between them (name, face, sprite, voices) lives here;
// game content is written once with the canonical name "Long" and localized for the chosen hero.
// Pure data + a tiny selection holder: safe to import from Node scripts and from the browser.
const asset = name => new URL(`../../assets/images/${name}`, import.meta.url).href;

export const DEFAULT_HERO = 'long';
export const HERO_STORAGE_KEY = 'mat-ma-dien-bien-phu:hero:v1';

// voices: role → voice key. Keys name a TTS configuration (scripts/voice/tts-engines.mjs) and are part of every
// clip id, so a role that sounds different in each route gets a different key.
export const HERO_PROFILES = Object.freeze({
  long: Object.freeze({
    id: 'long', name: 'Long', upper: 'LONG', sprite: 'long',
    portrait: asset('long-portrait.png'), alt: 'Long, nhân vật hư cấu',
    systemPortrait: asset('system-avatar-tl36.png'), systemAlt: 'Hệ Thống, hình đại diện TL-36',
    voices: Object.freeze({system: 'system-v2', quang: 'quang', narrator: 'narrator'}),
    tagline: 'Cậu học sinh lười học, thích chơi game và chẳng mặn mà với sử.',
  }),
  quang: Object.freeze({
    id: 'quang', name: 'Quang', upper: 'QUANG', sprite: 'quang',
    portrait: asset('quang-portrait.png'), alt: 'Quang, nhân vật hư cấu',
    systemPortrait: asset('game-emblem.png'), systemAlt: 'Biểu tượng Hệ Thống',
    voices: Object.freeze({system: 'system', quang: 'quang', narrator: 'narrator-lecture'}),
    tagline: 'Sinh viên trẻ ham học hỏi, mê công nghệ, giải đố và những chuyện bí ẩn.',
  }),
});
export const HERO_IDS = Object.freeze(Object.keys(HERO_PROFILES));
export const isHeroId = id => typeof id === 'string' && Object.hasOwn(HERO_PROFILES, id);

let active = null;

function storedHero() {
  try { const value = globalThis.localStorage?.getItem(HERO_STORAGE_KEY); return isHeroId(value) ? value : null; }
  catch { return null; }
}

/** The hero of this run. Read lazily from storage so standalone room previews follow the campaign's choice. */
export function activeHero() {
  if (!active) active = HERO_PROFILES[storedHero() ?? DEFAULT_HERO];
  return active;
}

export function selectHero(id, {persist = true} = {}) {
  active = HERO_PROFILES[isHeroId(id) ? id : DEFAULT_HERO];
  if (persist) { try { globalThis.localStorage?.setItem(HERO_STORAGE_KEY, active.id); } catch { /* unavailable: session only */ } }
  return active;
}

export function resetHero() {
  active = null;
  try { globalThis.localStorage?.removeItem(HERO_STORAGE_KEY); } catch { /* ignore */ }
}

/** "Long"/"LONG" in canonical text become the active hero's name; every other word is untouched. */
export function heroText(text, hero = activeHero()) {
  if (typeof text !== 'string' || hero.name === 'Long') return text;
  return text.replace(/\bLONG\b/g, hero.upper).replace(/\bLong\b/g, hero.name);
}

/** Voice key for a role ('system' | 'quang' | 'narrator') in the active (or given) hero's route. */
export const heroVoiceKey = (role, hero = activeHero()) => hero.voices[role] ?? role;
