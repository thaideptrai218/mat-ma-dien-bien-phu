// Dev-only harness (not an entry in vite.config.js). Exposes window.__demo for manual/puppeteer checks.
import Phaser from 'phaser';
import {createTokenBins, sum} from '../src/ui/tactile/token-bins-model.js';
import {createTokenBinsView} from '../src/ui/tactile/token-bins-view.js';
import {createCombinationDial} from '../src/ui/tactile/combination-dial.js';
import {LETTERS} from '../src/ui/tactile/dial-model.js';
import {createRangeRuler} from '../src/ui/tactile/range-ruler.js';
import {RoomOneScene} from '../src/room-one/scene.js';
import {lockedGateIds} from '../src/core/area-gates.js';

const out = (id, text) => { document.getElementById(id).textContent = text; };
const demo = window.__demo = {events: []};

const weights = [20, 20, 10, 10, 10, 5, 5, 2, 2].map((value, i) => ({id: `w${i}`, label: `${value} tiểu đoàn`, value}));
const bins = createTokenBinsView({
  state: createTokenBins({tokens: weights, bins: [{id: 'north'}, {id: 'rest'}]}),
  labels: {north: 'Đồng bằng Bắc Bộ', rest: 'Các chiến trường khác'}, trayLabel: 'Khay quả cân',
  onChange: state => out('bins-out', `Bắc ${sum(state, 'north')} · khác ${sum(state, 'rest')}`),
});
document.getElementById('bins').append(bins.root); demo.bins = bins;

const dial = createCombinationDial({wheels: 4, label: 'Khóa 4 bánh chữ', alphabet: LETTERS, onChange: v => out('dial-out', v)});
document.getElementById('dial').append(dial.element); demo.dial = dial;

const ruler = createRangeRuler({min: 1, max: 17, value: 1, label: 'Cột', onChange: v => out('ruler-out', `Cột ${v}`)});
document.getElementById('ruler').append(ruler.element); demo.ruler = ruler;

const GATES = [{id: 'demo-bars', style: 'bars', notice: 'demo',
  rects: [[1000, 1340, 30, 140]], unlockedBy: s => s.open === true}]; // west of the entry point
let state = {open: false};
const scene = new RoomOneScene({onGateBlocked: id => { demo.events.push(['blocked', id]); out('gate-out', `blocked: ${id}`); },
  onGateOpened: id => { demo.events.push(['opened', id]); out('gate-out', `opened: ${id}`); },
  onReady: s => s.setLockedGates(lockedGateIds(GATES, state))}, {areaGates: GATES});
demo.scene = scene;
demo.game = new Phaser.Game({type: Phaser.AUTO, parent: 'game', width: 640, height: 360, backgroundColor: '#171d18',
  physics: {default: 'arcade', arcade: {debug: false}}, scene});
document.getElementById('toggle-gate').addEventListener('click', () => {
  state = {open: !state.open}; scene.setLockedGates(lockedGateIds(GATES, state));
});
