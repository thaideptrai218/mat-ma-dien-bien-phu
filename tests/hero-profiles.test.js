import test from 'node:test';
import assert from 'node:assert/strict';
import {HERO_IDS, HERO_PROFILES, activeHero, selectHero, heroText, heroVoiceKey, isHeroId} from '../src/heroes/hero-profiles.js';
import {voiceIdFor, heroLineId} from '../src/audio/voice-id.js';import {characterClips, characterIdleFrame, characterTexture, characterSpec} from '../src/game/character-atlas.js';
import {createCampaignState, sanitizeCampaign, phaseFor} from '../src/campaign/state.js';
import {collectVoiceLines} from '../scripts/voice/collect-voice-lines.mjs';

const as = (id, run) => { selectHero(id, {persist: false}); try { return run(); } finally { selectHero('long', {persist: false}); } };

test('two heroes, Long by default, with their own faces, sprites and voice keys', () => {
  assert.deepEqual([...HERO_IDS], ['long', 'quang']);
  assert.equal(activeHero().id, 'long');
  assert.ok(isHeroId('quang') && !isHeroId('minh') && !isHeroId(undefined));
  for (const hero of Object.values(HERO_PROFILES)) {
    assert.ok(hero.name && hero.portrait && hero.systemPortrait && hero.tagline, hero.id);
    assert.deepEqual(Object.keys(hero.voices).sort(), ['narrator', 'quang', 'system']);
  }
  assert.equal(heroVoiceKey('system', HERO_PROFILES.long), 'system-v2');
  assert.equal(heroVoiceKey('system', HERO_PROFILES.quang), 'system');
  assert.equal(heroVoiceKey('narrator', HERO_PROFILES.long), 'narrator');
  assert.equal(heroVoiceKey('narrator', HERO_PROFILES.quang), 'narrator-lecture');
  assert.equal(heroVoiceKey('quang', HERO_PROFILES.long), heroVoiceKey('quang', HERO_PROFILES.quang), 'both heroes speak with the mck voice');
});

test('heroText renames whole words only, and only for Quang', () => {
  assert.equal(heroText('Long đi tiếp. LONG!'), 'Long đi tiếp. LONG!');
  assert.equal(heroText('Long đi tiếp. LONG! Longitude', HERO_PROFILES.quang), 'Quang đi tiếp. QUANG! Longitude');
  assert.equal(heroText(undefined, HERO_PROFILES.quang), undefined);
});

test('a route resolves its own recording: Hệ Thống differs, name-free narration of one voice key is shared', () => {
  const system = {speaker: 'Hệ Thống', text: 'Ký Chủ, hãy bình tĩnh.'};
  const thought = 'Mình cần xem kỹ.';
  const longSystem = heroLineId(system, HERO_PROFILES.long), quangSystem = heroLineId(system, HERO_PROFILES.quang);
  assert.equal(longSystem, voiceIdFor('system-v2', system.text));
  assert.equal(quangSystem, voiceIdFor('system', system.text));
  assert.notEqual(longSystem, quangSystem);
  assert.equal(heroLineId(thought, HERO_PROFILES.long), heroLineId(thought, HERO_PROFILES.quang), 'same text + same voice key → one clip');
  const named = 'Long nhìn quanh.';
  assert.notEqual(heroLineId(named, HERO_PROFILES.long), heroLineId(named, HERO_PROFILES.quang), 'the name is spoken, so it needs its own clip');
});

test('every voice key the manifest needs has a TTS configuration and the manifest covers both routes', async () => {
  const {VOICE_CONFIG} = await import('../scripts/voice/tts-engines.mjs');
  const lines = collectVoiceLines();
  const {long, quang} = HERO_PROFILES;
  const routeVoices = hero => new Set(Object.values(hero.voices));
  const used = new Set(lines.map(line => line.voice));
  for (const voice of [...routeVoices(long), ...routeVoices(quang)]) assert.ok(used.has(voice), `${voice} has lines`);
  for (const line of lines) assert.ok(VOICE_CONFIG[line.voice], line.voice);
  // A voice key belongs to one route (mck is shared): its lines may only carry that route's hero name.
  const only = (hero, other) => lines.filter(line => routeVoices(hero).has(line.voice) && !routeVoices(other).has(line.voice));
  for (const line of only(quang, long)) assert.doesNotMatch(line.text, /\bLong\b|\bLONG\b/, `Quang route says Long: ${line.text}`);
  for (const line of only(long, quang)) assert.doesNotMatch(line.text, /\bQuang\b|\bQUANG\b/, `Long route says Quang: ${line.text}`);
  // The manifest ids are exactly what the runtime resolves for each route.
  const ids = new Set(lines.map(line => line.id));
  for (const hero of [long, quang]) for (const line of lines.filter(l => routeVoices(hero).has(l.voice) && !routeVoices(hero === long ? quang : long).has(l.voice)).slice(0, 40)) {
    assert.ok(ids.has(heroLineId({speaker: line.speaker, text: line.text}, hero)), line.text);
  }
});

test("each hero has a complete sprite configuration (Quang's sheet has 8 columns and idle in the first)", () => {
  as('quang', () => {
    assert.equal(characterTexture(), 'quang-hero');
    assert.equal(characterSpec().columns, 8);
    assert.equal(characterIdleFrame('left'), 8);
    const clips = characterClips();
    assert.equal(clips.length, 12);
    assert.deepEqual(clips.find(clip => clip.key === 'quang-hero-right-walk').frames, [17, 18, 19, 20]);
  });
  assert.equal(characterTexture(), 'long-hero');
  assert.equal(characterIdleFrame('down'), 16);
});

test('the campaign asks for the hero first; older saves were played as Long', () => {
  assert.equal(createCampaignState().hero, null);
  assert.equal(phaseFor(createCampaignState()), 'hero-select');
  assert.equal(phaseFor({...createCampaignState(), hero: 'quang'}), 'museum-intro');
  const old = sanitizeCampaign({version: 1, introSeen: true, rooms: {}, settings: {}});
  assert.equal(old.hero, 'long');
  assert.equal(phaseFor(old), 'room');
  assert.equal(sanitizeCampaign({version: 1, introSeen: false, hero: 'quang'}).hero, 'quang');
  assert.equal(sanitizeCampaign({version: 1, introSeen: false, hero: 'ai-do'}).hero, null);
});
