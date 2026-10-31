// HTTP clients for the local TTS services of F:\AI-auto-generate-video (override with VOICE_TOOL_ROOT).
// CapCut bridge: POST /tts {text, voiceKey, speed} + bearer token from the bridge runtime file → audio/mpeg.
// OmniVoice adapter: POST /tts {text, refAudio, refText, speed} → audio/mpeg (zero-shot clone).
import fs from 'node:fs';
import path from 'node:path';

export const TOOL_ROOT = process.env.VOICE_TOOL_ROOT || 'F:/AI-auto-generate-video';
const NARRATOR_PROFILE = '131af5c2-8d45-4733-8568-9e10166695ee';
const MCK_PROFILE = '3d2f2ab7-4c57-4979-b454-7221da30acb7';

// Voices chosen with the user on 2026-10-31.
export const VOICE_CONFIG = Object.freeze({
  system: {engine: 'capcut', voiceKey: 'capcut:d1c749e2fea5836aed206f5bdfb2ac64', name: 'Cô Gái Hoạt Ngôn', speed: 1.0},
  quang: {engine: 'omnivoice', profileId: MCK_PROFILE, name: 'mck (Long)', speed: 1.0},
  narrator: {engine: 'omnivoice', profileId: NARRATOR_PROFILE, name: 'Giọng đọc bài giảng', speed: 1.0},
});

function capcutBridge() {
  const runtime = JSON.parse(fs.readFileSync(path.join(TOOL_ROOT, '.studio/runtime/capcut-bridge.json'), 'utf8'));
  return {url: `http://${runtime.host}:${runtime.port}`, token: runtime.token};
}

function narratorReference(profileId) {
  const dir = path.join(TOOL_ROOT, '.studio/voices', profileId);
  const profile = JSON.parse(fs.readFileSync(path.join(dir, 'profile.json'), 'utf8'));
  return {refAudio: path.join(dir, profile.referenceAudio), refText: profile.referenceText};
}

async function post(url, body, headers = {}, timeoutMs = 180000) {
  const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json', ...headers},
    body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs)});
  if (!response.ok) throw new Error(`${response.status} ${(await response.text()).slice(0, 300)}`);
  return Buffer.from(await response.arrayBuffer());
}

export async function health() {
  const result = {};
  try {
    const {url, token} = capcutBridge();
    const response = await fetch(`${url}/health`, {headers: {Authorization: `Bearer ${token}`}, signal: AbortSignal.timeout(5000)});
    result.capcut = response.ok ? 'ready' : `HTTP ${response.status}`;
  } catch (error) { result.capcut = `offline (${error.message})`; }
  try {
    const response = await fetch('http://127.0.0.1:8123/health', {signal: AbortSignal.timeout(5000)});
    const body = await response.json();
    result.omnivoice = body.ok ? 'ready' : `${body.state}${body.error ? `: ${body.error}` : ''}`;
  } catch (error) { result.omnivoice = `offline (${error.message})`; }
  return result;
}

// Returns MP3 bytes for one line; retries transient failures twice without switching voice.
// `lineId` labels the CapCut operation (the bridge requires a 1–128 char operationId).
export async function synthesize(voice, text, lineId = 'line') {
  const config = VOICE_CONFIG[voice];
  if (!config) throw new Error(`Unknown voice ${voice}`);
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (config.engine === 'capcut') {
        const {url, token} = capcutBridge();
        const operationId = `mmdbp-${lineId}-${Date.now()}-${attempt}`;
        return await post(`${url}/tts`, {operationId, text, voiceKey: config.voiceKey, speed: config.speed}, {Authorization: `Bearer ${token}`});
      }
      return await post('http://127.0.0.1:8123/tts', {text, ...narratorReference(config.profileId), speed: config.speed});
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
  throw lastError;
}
