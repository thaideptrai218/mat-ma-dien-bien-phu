// Builds the voice manifest (what to record and where the file lives) and the review CSV.
import {collectVoiceLines} from './collect-voice-lines.mjs';
import {toTtsText} from './tts-pronunciation.mjs';

export const MANIFEST_PATH = 'public/audio/voice/manifest.json';
export const REVIEW_CSV_PATH = 'plans/261031-1312-game-audio-voice-sfx/reports/voice-script.csv';

// Fields owned by the build; later phases may add per-line fields (e.g. durationMs) that are carried over.
// Hệ Thống, Quang (mck clone, user decision 2026-11-01) and the narrator are voiced.
export const VOICED = new Set(['system', 'quang', 'narrator']);
export function buildManifestLines() {
  return collectVoiceLines().filter(line => VOICED.has(line.voice)).map(line => ({
    id: line.id, voice: line.voice, speaker: line.speaker, rooms: line.rooms, groups: line.groups,
    text: line.text, ttsText: toTtsText(line.text), file: `audio/voice/${line.id}.mp3`,
  }));
}

export function mergeManifest(previous, lines) {
  const kept = new Map((previous?.lines || []).map(line => [line.id, line]));
  return {version: 1, lines: lines.map(line => ({...kept.get(line.id), ...line}))};
}

const csvCell = value => `"${String(value).replace(/"/g, '""')}"`;
export function toReviewCsv(lines) {
  const header = ['STT', 'Mã', 'Phòng', 'Nhóm', 'Người nói', 'Câu hiển thị', 'Câu đọc (TTS)', 'Đạt?', 'Ghi chú'];
  const rows = lines.map((line, index) => [index + 1, line.id, line.rooms.join(' '), line.groups.join(' '), line.speaker, line.text, line.ttsText, '', '']);
  // BOM so Excel opens the Vietnamese text as UTF-8.
  return '﻿' + [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
