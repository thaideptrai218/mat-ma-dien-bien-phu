// Collects every spoken line of the campaign straight from the game content modules.
// Plain strings are Long's thoughts; {speaker, text} objects and Room 2 beats name their speaker.
// Document prose (letters, reports) is read on screen and is not voiced; only Long's reflections are.
import {voiceIdFor, voiceOf, framingLine, VOICES} from '../../src/audio/voice-id.js';
import {OPENING} from '../../src/campaign/framing.js';
import * as r1 from '../../src/room-one/content.js';
import {DOCUMENTS as R1_DOCUMENTS} from '../../src/room-one/documents.js';
import {LETTER_DOCUMENT} from '../../src/room-one/letter-document.js';
import {NAVA_CONTEXT_DOCUMENT} from '../../src/room-one/nava-context.js';
import {beats as R2_BEATS, PUZZLE_GUIDE, SYSTEM_HINTS as R2_HINTS} from '../../src/room-two/system-guidance.js';
import * as r3 from '../../src/room-three/content.js';
import {DOCUMENTS as R3_DOCUMENTS} from '../../src/room-three/documents.js';
import {CHALLENGES} from '../../src/room-three/puzzle-data.js';
import * as r4 from '../../src/room-four/content.js';
import {DOCUMENTS as R4_DOCUMENTS} from '../../src/room-four/documents.js';
import * as r5 from '../../src/room-five/content.js';

const BEAT_SPEAKERS = {system: 'Hệ Thống', quang: 'Long'};

// Walks arrays and plain objects in key order, emitting each string or {speaker, text} line.
function walk(value, group, emit) {
  if (typeof value === 'string' || (value && typeof value.text === 'string')) return emit(value, group);
  if (Array.isArray(value)) return value.forEach(item => walk(item, group, emit));
  if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) walk(item, `${group}.${key}`, emit);
}

// SYSTEM_HINTS are {open, hints[]} per puzzle; every line is spoken by Hệ Thống.
const hintLines = hints => Object.fromEntries(Object.entries(hints).map(([id, {open, hints: levels}]) =>
  [id, [open, ...levels].map(text => ({speaker: 'Hệ Thống', text}))]));

const reflections = documents => Object.fromEntries(documents.map(doc => [doc.id, doc.reflection || []]));

// [room, group, value] in playthrough order; groups are export names, so a line's origin is easy to find.
function sources() {
  return [
    ['museum', 'OPENING', OPENING.flatMap(frame => frame.paragraphs).map(framingLine)],
    ['r1', 'INTRO', r1.INTRO], ['r1', 'GUIDE', r1.GUIDE], ['r1', 'LINES', r1.LINES], ['r1', 'REACTIONS', r1.REACTIONS],
    ['r1', 'reflection', {...reflections(R1_DOCUMENTS), 'restored-letter': LETTER_DOCUMENT.reflection, 'nava-context': NAVA_CONTEXT_DOCUMENT.reflection}],
    ['r1', 'ENDING', r1.ENDING], ['r1', 'CAMPAIGN_ENDING', r1.CAMPAIGN_ENDING], ['r1', 'SYSTEM_HINTS', hintLines(r1.SYSTEM_HINTS)],
    ['r2', 'beats', Object.fromEntries(Object.entries(R2_BEATS).map(([id, beat]) =>
      [id, beat.lines.map(line => ({speaker: BEAT_SPEAKERS[line.speakerId], text: line.text}))]))],
    ['r2', 'PUZZLE_GUIDE', PUZZLE_GUIDE], ['r2', 'SYSTEM_HINTS', hintLines(R2_HINTS)],
    ['r3', 'INTRO', r3.INTRO], ['r3', 'CAMPAIGN_INTRO', r3.CAMPAIGN_INTRO], ['r3', 'GUIDE', r3.GUIDE],
    ['r3', 'rewards', CHALLENGES.map(challenge => challenge.reward)], ['r3', 'LINES', r3.LINES], ['r3', 'REACTIONS', r3.REACTIONS],
    ['r3', 'reflection', reflections(R3_DOCUMENTS)], ['r3', 'ENDING', r3.ENDING], ['r3', 'CAMPAIGN_ENDING', r3.CAMPAIGN_ENDING], ['r3', 'SYSTEM_HINTS', hintLines(r3.SYSTEM_HINTS)],
    ['r4', 'INTRO', r4.INTRO], ['r4', 'CAMPAIGN_INTRO', r4.CAMPAIGN_INTRO], ['r4', 'GUIDE', r4.GUIDE], ['r4', 'LINES', r4.LINES],
    ['r4', 'REACTIONS', r4.REACTIONS], ['r4', 'reflection', reflections(R4_DOCUMENTS)],
    ['r4', 'ENDING', r4.ENDING], ['r4', 'CAMPAIGN_ENDING', r4.CAMPAIGN_ENDING], ['r4', 'SYSTEM_HINTS', hintLines(r4.SYSTEM_HINTS)],
    ['r5', 'INTRO', r5.INTRO], ['r5', 'GUIDE', r5.GUIDE], ['r5', 'LINES', r5.LINES], ['r5', 'REFLECTION_SCRIPT', r5.REFLECTION_SCRIPT], ['r5', 'SYSTEM_HINTS', hintLines(r5.SYSTEM_HINTS)],
    ['museum', 'MUSEUM_RETURN', r5.MUSEUM_RETURN.map(text => ({speaker: 'Lời kể', text}))],
    ['museum', 'CLOSING_LINE', [{speaker: 'Lời kể', text: r5.CLOSING_LINE}]],
  ];
}

// Returns unique lines (first occurrence wins) with every room/group that uses them.
export function collectVoiceLines() {
  const lines = new Map();
  for (const [room, root, value] of sources()) {
    walk(value, root, (line, group) => {
      const voice = voiceOf(line), text = (typeof line === 'string' ? line : line.text).normalize('NFC');
      if (!voice) throw new Error(`Unknown speaker "${line.speaker}" in ${room}.${group}`);
      const id = voiceIdFor(voice, text);
      const entry = lines.get(id) || {id, voice, speaker: Object.keys(VOICES).find(name => VOICES[name] === voice), text, rooms: [], groups: []};
      if (!entry.rooms.includes(room)) entry.rooms.push(room);
      if (!entry.groups.includes(`${room}.${group}`)) entry.groups.push(`${room}.${group}`);
      lines.set(id, entry);
    });
  }
  return [...lines.values()];
}
