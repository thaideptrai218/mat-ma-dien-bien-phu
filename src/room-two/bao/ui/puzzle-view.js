import { chapters, clues, puzzles, sources } from '../content/story-data.js';
import { checkFistMove, currentPuzzleId } from '../core/game-rules.js';
import { element, button, paragraph, field, actions } from '../../../ui/dom-elements.js';

const scramble = items => items.length === 4 ? [items[1], items[3], items[0], items[2]] : [items.at(-1), ...items.slice(0, -1)];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const announce = text => { document.querySelector('#game-announcement').textContent = text; };

// SVG nodes take attributes verbatim; text children still enter as text nodes.
function svg(tag, attributes = {}, ...children) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) if (value !== undefined && value !== null) node.setAttribute(key, String(value));
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

// A solved step reopens on its solution, even after a reload cleared the drafts.
function newDraft(puzzle, solved) {
  const spec = puzzle.answerSpec;
  if (puzzle.type === 'balance') return solved ? { cardSteps: { ...spec.cardSteps }, northWeights: spec.northWeights } : { cardSteps: {}, northWeights: puzzle.totalWeights / 2 };
  if (puzzle.type === 'interleave') return { ...Object.fromEntries(puzzle.channels.map(channel => [channel.id, solved ? channel.word : ''])), highlight: false };
  if (puzzle.type === 'fist') return { moves: solved ? spec.moves.map(({ card, region }) => ({ card, region })) : [], card: '', region: '' };
  if (puzzle.type === 'fold') return solved ? { target: spec.target, code: spec.code } : { target: '', code: '' };
  const items = puzzle.stages || puzzle.fragments;
  const order = solved ? spec.orderedStageIds || spec.orderedFragmentIds : puzzle.initialOrder || puzzle.scramble || scramble(items.map(item => item.id));
  return { order: [...order], date: solved ? spec.date || '' : '' };
}

function answerFor(puzzle, draft) {
  if (puzzle.type === 'sequence') return { orderedStageIds: [...draft.order] };
  if (puzzle.type === 'telegram') return { orderedFragmentIds: [...draft.order], date: draft.date };
  if (puzzle.type === 'balance') return { cardSteps: { ...draft.cardSteps }, northWeights: draft.northWeights };
  if (puzzle.type === 'interleave') return Object.fromEntries(puzzle.channels.map(channel => [channel.id, draft[channel.id]]));
  if (puzzle.type === 'fist') return { moves: draft.moves.map(move => ({ ...move })) };
  return { target: draft.target, code: draft.code };
}

// The Việt Bắc telegram: its four blurred words are the flags raised on the sand table.
function telegramCard(telegram, revealed) {
  const words = telegram.words.map((word, index) => index < revealed ? element('b', {}, word.toLowerCase()) : element('span', { className: 'blurred', role: 'img', 'aria-label': 'chữ bị nhòe' }, '▒▒▒'));
  return element('figure', { className: 'telegram-card' }, element('figcaption', {}, 'Bức điện Việt Bắc'),
    element('p', {}, telegram.text, ' ', words.map((word, index) => [index ? ' – ' : '', word]), '.'),
    paragraph('Văn bản biên soạn cho trò chơi, dựa trên chủ trương Đông – Xuân 1953–1954.', 'form-help'));
}

function balanceScale(total) {
  const pan = (label, anchor) => {
    const count = svg('text', { x: 0, y: 38, 'text-anchor': 'middle', class: 'scale-count' });
    const group = svg('g', {}, svg('line', { x1: 0, y1: 0, x2: -26, y2: 44, class: 'scale-string' }), svg('line', { x1: 0, y1: 0, x2: 26, y2: 44, class: 'scale-string' }),
      svg('path', { d: 'M-36 44 Q0 68 36 44 Z', class: 'scale-pan' }), count, svg('text', { x: 0, y: 86, 'text-anchor': anchor, class: 'scale-label' }, label));
    return { group, count };
  };
  const north = pan('Đồng bằng Bắc Bộ', 'middle'), rest = pan('Các chiến trường khác', 'middle');
  const beam = svg('line', { class: 'scale-beam' });
  const node = svg('svg', { viewBox: '0 0 360 200', class: 'balance-scale', role: 'img' },
    svg('rect', { x: 150, y: 176, width: 60, height: 12, class: 'scale-base' }), svg('rect', { x: 176, y: 60, width: 8, height: 118, class: 'scale-pillar' }),
    beam, north.group, rest.group, svg('circle', { cx: 180, cy: 60, r: 7, class: 'scale-pivot' }));
  return { node, update(weights) {
    // Schematic tilt: every weight of difference turns the beam 1.5°, capped at 18°.
    const angle = clamp((weights - (total - weights)) * 1.5, -18, 18) * Math.PI / 180, arm = 112;
    const left = [180 - arm * Math.cos(angle), 60 + arm * Math.sin(angle)], right = [180 + arm * Math.cos(angle), 60 - arm * Math.sin(angle)];
    beam.setAttribute('x1', left[0]); beam.setAttribute('y1', left[1]); beam.setAttribute('x2', right[0]); beam.setAttribute('y2', right[1]);
    north.group.setAttribute('transform', `translate(${left[0]} ${left[1]})`); rest.group.setAttribute('transform', `translate(${right[0]} ${right[1]})`);
    north.count.textContent = weights; rest.count.textContent = total - weights;
    node.setAttribute('aria-label', `Cán cân: đĩa Đồng bằng Bắc Bộ ${weights} quả, đĩa Các chiến trường khác ${total - weights} quả.`);
  } };
}

// Sand-table layout (schematic, relative directions only): where each region, flag and finger sits.
const FIST_LAYOUT = {
  regions: { 'tay-bac': [150, 36, 200, 112], 'thuong-lao': [16, 168, 196, 110], 'trung-lao': [226, 230, 200, 96], 'tay-nguyen': [404, 300, 220, 90] },
  flags: { dbp: [262, 108], 'luang-prabang': [118, 240], seno: [338, 290], pleiku: [520, 350] },
  fingers: { dbp: [470, 56], 'luang-prabang': [470, 92], seno: [486, 118], pleiku: [590, 118] },
};
function fistBoard(puzzle, moves) {
  const opened = puzzle.answerSpec.moves.slice(0, moves.length).map(move => move.flag);
  const board = svg('svg', { viewBox: '0 0 640 400', class: 'fist-board', role: 'img',
    'aria-label': `Sa bàn Đông Dương, sơ đồ học tập. ${opened.length} trên 4 ngón tay sắt đã mở${opened.length ? `: ${opened.map(id => puzzle.flags.find(flag => flag.id === id).label).join(', ')}` : ''}.` },
  svg('rect', { x: 2, y: 2, width: 636, height: 396, class: 'board-paper' }), svg('text', { x: 16, y: 26, class: 'board-north' }, 'BẮC ↑'));
  for (const region of puzzle.regions) {
    const [x, y, w, h] = FIST_LAYOUT.regions[region.id];
    board.append(svg('rect', { x, y, width: w, height: h, rx: 8, class: 'board-region' }), svg('text', { x: x + 10, y: y + 20, class: 'board-region-label' }, region.label));
  }
  board.append(svg('rect', { x: 470, y: 34, width: 150, height: 84, rx: 18, class: 'fist-palm' }), svg('rect', { x: 598, y: 96, width: 18, height: 34, rx: 8, class: 'fist-thumb' }),
    svg('text', { x: 545, y: 70, 'text-anchor': 'middle', class: 'fist-title' }, 'NẮM ĐẤM THÉP'), svg('text', { x: 545, y: 90, 'text-anchor': 'middle', class: 'fist-sub' }, 'Đồng bằng Bắc Bộ · nơi thứ 1'));
  puzzle.answerSpec.moves.forEach((move, index) => {
    const open = index < moves.length, [ax, ay] = FIST_LAYOUT.fingers[move.flag], [fx, fy] = FIST_LAYOUT.flags[move.flag];
    const length = Math.hypot(fx - ax, fy - 34 - ay), dx = (fx - ax) / length, dy = (fy - 34 - ay) / length, reach = open ? 44 : 14;
    const flag = puzzle.flags.find(item => item.id === move.flag), region = FIST_LAYOUT.regions[move.region];
    board.append(svg('line', { x1: ax + dx * reach, y1: ay + dy * reach, x2: fx, y2: fy - 34, class: open ? 'fist-chain taut' : 'fist-chain' }),
      svg('line', { x1: ax, y1: ay, x2: ax + dx * reach, y2: ay + dy * reach, class: open ? 'fist-finger open' : 'fist-finger' }),
      svg('text', { x: ax + dx * (reach + 16), y: ay + dy * (reach + 16) + 4, 'text-anchor': 'middle', class: 'fist-finger-number' }, index + 1),
      svg('line', { x1: fx, y1: fy, x2: fx, y2: fy - 34, class: 'flag-pole' }),
      svg('path', { d: open ? `M${fx} ${fy - 34}L${fx + 30} ${fy - 27}L${fx} ${fy - 20}Z` : `M${fx} ${fy - 4}L${fx + 26} ${fy - 1}L${fx} ${fy + 2}Z`, class: open ? 'flag raised' : 'flag' }),
      svg('text', { x: fx, y: fy + 16, 'text-anchor': 'middle', class: 'flag-label' }, flag.label),
      svg('text', { x: fx, y: fy + 31, 'text-anchor': 'middle', class: open ? 'flag-word' : 'flag-word hidden' }, open ? flag.word : '? ? ?'));
    if (open) {
      // The arrow runs from just under the region name toward the flag, clear of the place label.
      const card = puzzle.cards.find(item => item.id === move.card), [rx, ry] = region;
      board.append(svg('text', { x: rx + 10, y: ry + 38, class: 'attack-label' }, `${'①②③④'[index]} ${card.short}`),
        svg('line', { x1: rx + 22, y1: ry + 48, x2: fx - 14, y2: fy - 12, class: 'attack-arrow', 'marker-end': 'url(#attack-head)' }));
    }
  });
  board.prepend(svg('defs', {}, svg('marker', { id: 'attack-head', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, svg('path', { d: 'M0 0L10 5L0 10Z', class: 'attack-head' }))));
  return board;
}

// Fold-in: every character sits in a fixed cell; the flap keeps the even cells, each target strip the odd ones,
// so the two strips only read as a line when the flap lands on the strip that completes it.
const FOLD = { width: 150, height: 120, baselines: [60, 96] };
function foldText(lines, parity) {
  return lines.map((line, row) => {
    const chars = [...line], cell = Math.min(13, 136 / chars.length), start = FOLD.width / 2 - cell * chars.length / 2;
    const shown = chars.map((char, index) => index % 2 === (parity === 'even' ? 0 : 1) && char !== ' ' ? char : '\u00a0').join('');
    return svg('text', { x: chars.map((_, index) => (start + cell * (index + .5)).toFixed(1)).join(' '), y: FOLD.baselines[row], 'text-anchor': 'middle', class: 'fold-text' }, shown);
  });
}
function foldStrip(puzzle) {
  const node = svg('svg', { viewBox: `0 0 ${160 * (puzzle.targets.length + 1) - 10} ${FOLD.height + 10}`, class: 'fold-strip', role: 'img',
    'aria-label': `Tấm bản đồ dài: mép nắm đấm bên trái, rồi các lá cờ ${puzzle.targets.map(target => target.label).join(', ')}. Mỗi đoạn chỉ còn những chữ cái rời rạc, đọc riêng không ra.` });
  node.append(svg('g', {}, svg('rect', { x: 0, y: 0, width: FOLD.width, height: FOLD.height, class: 'fold-flap' }), svg('text', { x: 10, y: 20, class: 'fold-label' }, '✊ Mép nắm đấm'), foldText(puzzle.foldText, 'even')));
  puzzle.targets.forEach((target, index) => {
    const x = 160 * (index + 1);
    node.append(svg('line', { x1: x - 5, y1: 0, x2: x - 5, y2: FOLD.height + 10, class: 'fold-crease' }),
      svg('g', { transform: `translate(${x} 0)` }, svg('rect', { x: 0, y: 0, width: FOLD.width, height: FOLD.height, class: 'fold-panel' }), svg('text', { x: 10, y: 20, class: 'fold-label' }, `⚑ ${target.label}`), foldText(target.text, 'odd')));
  });
  return node;
}
function foldPreview(puzzle, target) {
  return svg('svg', { viewBox: `0 0 ${FOLD.width + 20} ${FOLD.height + 10}`, class: 'fold-result', 'aria-hidden': 'true' },
    svg('g', { transform: 'translate(10 0)' }, svg('rect', { x: 0, y: 0, width: FOLD.width, height: FOLD.height, class: 'fold-panel' }), svg('text', { x: 10, y: 20, class: 'fold-label' }, `⚑ ${target.label}`),
      foldText(target.text, 'odd'), svg('g', { class: 'fold-flap-layer' }, svg('rect', { x: 0, y: 26, width: FOLD.width, height: FOLD.height - 26, class: 'fold-flap-sheet' }), foldText(puzzle.foldText, 'even'))),
    svg('line', { x1: 8, y1: 0, x2: 8, y2: FOLD.height + 10, class: 'fold-crease strong' }));
}

export class PuzzleView {
  constructor({ dialog, getState, onIntent }) {
    this.dialog = dialog; this.getState = getState; this.onIntent = onIntent;
    this.drafts = new Map(); this.activeId = null; this.hintUsed = null;
  }

  show(puzzleId, { focus } = {}) {
    if (puzzleId === 'peace') { this.showPeace(); return; }
    const puzzle = puzzles[puzzleId];
    if (!puzzle) return;
    this.activeId = puzzleId; this.hintUsed = null;
    const state = this.getState();
    const solved = state.completedPuzzleIds.includes(puzzle.id);
    if (!this.drafts.has(puzzleId)) this.drafts.set(puzzleId, newDraft(puzzle, solved));
    const draft = this.drafts.get(puzzleId);
    const missing = puzzle.requiredClueIds.filter(id => !state.collectedClueIds.includes(id));
    const before = puzzle.requiresPuzzleId && !state.completedPuzzleIds.includes(puzzle.requiresPuzzleId) ? puzzles[puzzle.requiresPuzzleId] : null;
    const locked = solved || Boolean(before) || missing.length > 0;
    const steps = chapters[puzzle.chapterId].puzzleIds;
    const content = element('div', { className: 'puzzle-content' }, paragraph(puzzle.instruction));
    if (steps.length > 1) content.append(this.cluePanel(puzzle, state));
    const form = element('form', { id: 'puzzle-form', onSubmit: event => {
      event.preventDefault();
      if (!locked) this.onIntent({ type: 'submit-puzzle', puzzleId, answer: answerFor(puzzle, draft) });
    } });
    const view = { puzzle, draft, locked, solved };
    const renderers = { sequence: () => this.renderSequence(view), telegram: () => this.renderTelegram(view), balance: () => this.renderBalance(view),
      interleave: () => this.renderInterleave(view), fist: () => this.renderFist(view), fold: () => this.renderFold(view) };
    form.append(...renderers[puzzle.type]());
    form.append(paragraph(this.statusText(puzzle, state, { solved, before, missing }), 'puzzle-lock'));
    this.feedback = element('div', { id: 'puzzle-feedback', role: 'status', 'aria-live': 'polite' });
    const submit = puzzle.type === 'fist' ? null : element('button', { type: 'submit', className: 'primary-button', id: 'puzzle-submit', disabled: locked }, puzzle.type === 'fold' ? 'Mở hòm sắt →' : 'Đối chiếu hồ sơ →');
    form.append(this.feedback, actions(submit, button('Xem gợi ý', () => { this.onIntent({ type: 'use-hint', puzzleId }); this.hintUsed?.(); }), button('Đọc sổ tay', () => document.dispatchEvent(new CustomEvent('game-open-notebook')))));
    if (solved && puzzle.sourceIds?.length) form.append(element('p', { className: 'puzzle-sources' }, 'Đối chiếu tư liệu: ', puzzle.sourceIds.map((id, index) => [index ? ' · ' : '', element('a', { href: sources[id].url, target: '_blank', rel: 'noopener noreferrer' }, sources[id].title, ' ↗')])));
    content.append(form);
    this.dialog.show({ title: puzzle.title, kicker: steps.length > 1 ? `BƯỚC ${steps.indexOf(puzzle.id) + 1}/${steps.length} · HỒ SƠ KÝ ỨC` : 'HỒ SƠ KÝ ỨC', content, focus: focus ? content.querySelector(focus) : null });
  }

  // Every fact a step needs, read from the clues the player has recorded.
  cluePanel(puzzle, state) {
    const ready = puzzle.requiredClueIds.filter(id => state.collectedClueIds.includes(id)).length;
    const list = element('ul', { className: 'clue-checklist' });
    for (const id of puzzle.requiredClueIds) {
      const clue = clues[id], collected = state.collectedClueIds.includes(id), discovered = state.discoveredClueIds.includes(id);
      list.append(element('li', { className: collected ? 'collected' : '' }, element('span', { className: 'entry-state' }, collected ? '✓ ĐÃ GHI' : discovered ? '◇ ĐÃ THẤY · CHƯA GHI' : '◇ CHƯA TÌM THẤY'),
        element('strong', {}, clue.title), paragraph(collected ? clue.body : discovered ? 'Đọc lại lời kể và bấm Ghi manh mối ở câu cuối.' : clue.direction)));
    }
    return element('details', { className: 'clue-panel', open: true }, element('summary', {}, `Dữ kiện cho bước này · đã ghi ${ready}/${puzzle.requiredClueIds.length}`), list);
  }

  statusText(puzzle, state, { solved, before, missing }) {
    if (solved) return state.completedRoomIds.includes(puzzle.chapterId) ? '✓ Hồ sơ đã hoàn tất. Bạn có thể trở lại bản đồ và đi qua cửa.' : `✓ Bước này đã xong. Bước tiếp theo: ${puzzles[currentPuzzleId(state)].title}.`;
    if (before) return `Hãy hoàn thành bước trước: ${before.title}. Bạn vẫn có thể xem trước câu đố này.`;
    if (missing.length) return `Còn ${missing.length} manh mối chưa ghi. Sổ tay chỉ đường và giữ lời kể đã khám phá.`;
    return puzzle.type === 'fist' ? 'Đã có đủ manh mối. Đi nước đầu tiên khi bạn sẵn sàng.' : 'Đã có đủ manh mối. Đối chiếu khi bạn sẵn sàng.';
  }

  renderSequence({ puzzle, draft }) { return [this.orderedCards(puzzle.stages, draft, puzzle.id)]; }

  renderTelegram({ puzzle, draft }) {
    const select = element('select', { name: 'date', required: true, onChange: event => { draft.date = event.target.value; } }, element('option', { value: '' }, 'Chọn ngày theo tư liệu'));
    for (const option of puzzle.dateOptions) select.append(element('option', { value: option.id, selected: option.id === draft.date }, option.label));
    return [this.orderedCards(puzzle.fragments, draft, puzzle.id), field(puzzle.dateLabel, select)];
  }

  orderedCards(items, draft, puzzleId) {
    const list = element('ol', { className: 'sequence-cards', id: 'sequence-cards' });
    draft.order.forEach((id, index) => {
      const item = items.find(entry => entry.id === id);
      const card = element('li', { className: 'sequence-card', tabIndex: -1, dataset: { itemId: id } }, element('span', { className: 'sequence-number' }, index + 1), element('h3', {}, item.label));
      const move = direction => {
        const target = index + (direction === 'up' ? -1 : 1);
        if (target < 0 || target >= draft.order.length) return;
        [draft.order[index], draft.order[target]] = [draft.order[target], draft.order[index]];
        this.show(puzzleId);
        const movedCard = document.querySelector(`[data-item-id="${id}"]`);
        const sameDirection = movedCard.querySelector(`[data-move="${direction}"]`);
        (sameDirection.disabled ? movedCard : sameDirection).focus({ preventScroll: true });
        announce(`${item.label} ở vị trí ${target + 1}.`);
      };
      card.append(element('div', { className: 'sequence-moves' }, button('↑', () => move('up'), 'move-button', { disabled: index === 0, dataset: { move: 'up' }, 'aria-label': `Đưa ${item.label} lên` }), button('↓', () => move('down'), 'move-button', { disabled: index === draft.order.length - 1, dataset: { move: 'down' }, 'aria-label': `Đưa ${item.label} xuống` })));
      list.append(card);
    });
    return list;
  }

  renderBalance({ puzzle, draft, locked }) {
    const total = puzzle.totalWeights, scale = balanceScale(total);
    const readout = element('p', { className: 'balance-readout', id: 'balance-readout' });
    const update = () => { readout.textContent = `Đĩa Đồng bằng Bắc Bộ: ${draft.northWeights} quả · Đĩa Các chiến trường khác: ${total - draft.northWeights} quả.`; scale.update(draft.northWeights); };
    const input = element('input', { type: 'number', id: 'balance-weights', name: 'north-weights', min: 0, max: total, step: 1, required: true, inputMode: 'numeric', value: draft.northWeights, disabled: locked, 'aria-describedby': 'balance-readout',
      onInput: event => { if (Number.isFinite(event.target.valueAsNumber)) set(event.target.valueAsNumber); } });
    const set = value => { draft.northWeights = clamp(Math.round(value), 0, total); if (Number(input.value) !== draft.northWeights) input.value = draft.northWeights; update(); };
    const nudge = delta => { set(draft.northWeights + delta); this.onIntent({ type: 'play-cue', kind: 'weight' }); };
    update();
    const cards = element('fieldset', { className: 'balance-cards' }, element('legend', {}, 'Mỗi việc thuộc bước nào của kế hoạch?'));
    for (const card of puzzle.cards) {
      const select = element('select', { name: card.id, required: true, disabled: locked, onChange: event => { draft.cardSteps[card.id] = event.target.value; } }, element('option', { value: '' }, 'Chọn bước'));
      for (const step of puzzle.steps) select.append(element('option', { value: step.id, selected: draft.cardSteps[card.id] === step.id }, step.label));
      cards.append(field(card.label, select));
    }
    return [element('section', { className: 'balance-workspace' }, scale.node, element('div', { className: 'balance-controls' },
      element('label', { className: 'form-field', htmlFor: 'balance-weights' }, element('span', {}, 'Số quả cân trên đĩa Đồng bằng Bắc Bộ')),
      element('div', { className: 'balance-weights' }, button('−', () => nudge(-1), 'move-button', { disabled: locked, 'aria-label': 'Bớt một quả cân khỏi đĩa Bắc Bộ' }), input, button('+', () => nudge(1), 'move-button', { disabled: locked, 'aria-label': 'Thêm một quả cân vào đĩa Bắc Bộ' })),
      readout)), cards];
  }

  renderInterleave({ puzzle, draft, locked, solved }) {
    const letters = [...puzzle.tape];
    const tape = element('ol', { className: `radio-tape${draft.highlight ? ' highlight-odd' : ''}`, 'aria-label': `Băng điện báo ${letters.length} chữ: ${letters.join(' ')}` },
      letters.map((letter, index) => element('li', { className: index % 2 ? 'even' : 'odd', 'aria-hidden': 'true' }, element('b', {}, letter), element('span', {}, index + 1))));
    const label = () => draft.highlight ? 'Bỏ tô chữ lẻ' : 'Tô chữ ở vị trí lẻ';
    const toggle = button(label(), () => {
      draft.highlight = !draft.highlight; tape.classList.toggle('highlight-odd', draft.highlight);
      toggle.textContent = label(); toggle.setAttribute('aria-pressed', String(draft.highlight));
      announce(draft.highlight ? `Đã tô các chữ ở vị trí lẻ: ${letters.filter((_, index) => index % 2 === 0).join(' ')}.` : 'Đã bỏ tô chữ lẻ.');
    }, 'quiet-button', { 'aria-pressed': String(draft.highlight) });
    // The highlighter is the first hint's tool; it appears once that hint has been read.
    const refresh = () => { toggle.hidden = !(solved || (this.getState().hintLevels[puzzle.id] ?? 0) >= 1); };
    refresh(); this.hintUsed = refresh;
    const channels = element('div', { className: 'radio-channels' }, puzzle.channels.map(channel => field(`Tai nghe “${channel.label}” nghe được`,
      element('input', { type: 'text', name: channel.id, required: true, value: draft[channel.id], autocomplete: 'off', spellcheck: false, maxLength: 24, disabled: locked, onInput: event => { draft[channel.id] = event.target.value; } }))));
    return [element('section', { className: 'radio-workspace' }, tape, toggle), channels, solved ? telegramCard(puzzle.telegram, 0) : null];
  }

  renderFist({ puzzle, draft, locked }) {
    const done = draft.moves.length === puzzle.answerSpec.moves.length;
    const choose = (key, placeholder, items) => {
      const used = new Set(draft.moves.map(move => move[key]));
      const select = element('select', { id: `fist-${key}`, name: key, disabled: locked || done, onChange: event => { draft[key] = event.target.value; } }, element('option', { value: '' }, placeholder));
      for (const item of items) if (!used.has(item.id)) select.append(element('option', { value: item.id, selected: draft[key] === item.id }, item.label));
      return select;
    };
    const history = draft.moves.map((move, index) => {
      const flag = puzzle.flags.find(item => item.id === puzzle.answerSpec.moves[index].flag);
      return element('li', {}, `${puzzle.cards.find(card => card.id === move.card).short} → ${puzzle.regions.find(region => region.id === move.region).label}: ngón ${index + 1} mở, cờ ${flag.label} dựng, chữ ${flag.word}.`);
    });
    return [fistBoard(puzzle, draft.moves), paragraph('Sơ đồ học tập, không theo tỷ lệ; vị trí chỉ theo hướng tương đối trên bản đồ Đông Dương.', 'diagram-caption'),
      element('div', { className: 'fist-controls' }, field('Thẻ mũi tên', choose('card', 'Chọn thẻ mũi tên', puzzle.cards)), field('Đặt vào vùng', choose('region', 'Chọn vùng tiến công', puzzle.regions)),
        button('Đi nước này →', () => this.playFistMove(puzzle, draft), 'primary-button', { id: 'fist-play', disabled: locked || done })),
      history.length ? element('section', { className: 'fist-history' }, element('h3', {}, 'Các nước đã đi'), element('ol', {}, history)) : null,
      telegramCard(puzzle.telegram, draft.moves.length)];
  }

  playFistMove(puzzle, draft) {
    if (!draft.card || !draft.region) { this.showFeedback('Chọn một thẻ mũi tên và một vùng trước khi đi nước.', 'hint'); return; }
    const moves = [...draft.moves, { card: draft.card, region: draft.region }];
    const result = checkFistMove(puzzle.id, moves);
    draft.card = ''; draft.region = '';
    if (!result.ok) {
      // A wrong region only bounces this arrow; a right pair out of turn lets Nava close the whole hand.
      if (result.error === 'wrong-turn') draft.moves = [];
      this.onIntent({ type: 'play-cue', kind: 'error' });
      this.show(puzzle.id, { focus: '#fist-card' });
      this.showFeedback(puzzle.messages[result.error], 'error'); announce(puzzle.messages[result.error]);
      return;
    }
    draft.moves = moves;
    this.onIntent({ type: 'play-cue', kind: 'chain' });
    if (result.done) { this.onIntent({ type: 'submit-puzzle', puzzleId: puzzle.id, answer: answerFor(puzzle, draft) }); return; }
    this.show(puzzle.id, { focus: '#fist-card' });
    this.showFeedback(puzzle.moveTexts[moves.length - 1], 'success'); announce(puzzle.moveTexts[moves.length - 1]);
  }

  renderFold({ puzzle, draft, locked }) {
    const preview = element('div', { className: 'fold-preview' });
    const renderPreview = () => {
      const target = puzzle.targets.find(item => item.id === draft.target);
      if (!target) { preview.replaceChildren(paragraph('Chọn một lá cờ để gấp mép nắm đấm tới đó.', 'form-help')); return; }
      const matched = target.text.join('\n') === puzzle.foldText.join('\n');
      preview.replaceChildren(foldPreview(puzzle, target),
        element('p', { className: 'sr-only' }, matched ? `Các nét chữ ghép lại thành: ${puzzle.foldText.join(' – ')}.` : 'Các nét chữ ghép lại không thành chữ có nghĩa.'),
        paragraph(target.hint, `feedback ${matched ? 'success' : 'hint'}`));
    };
    const targets = element('fieldset', { className: 'fold-targets' }, element('legend', {}, 'Gấp mép nắm đấm tới lá cờ'));
    for (const target of puzzle.targets) {
      targets.append(element('label', { className: 'choice-row' }, element('input', { type: 'radio', name: 'fold-target', value: target.id, required: true, checked: draft.target === target.id, disabled: locked,
        onChange: () => { draft.target = target.id; renderPreview(); announce(`Đã gấp tới ${target.label}.`); this.onIntent({ type: 'play-cue', kind: 'fold' }); } }), element('span', {}, target.label)));
    }
    renderPreview();
    const code = element('input', { type: 'text', id: 'fold-code', name: 'code', inputMode: 'numeric', autocomplete: 'off', required: true, maxLength: 10, value: draft.code, disabled: locked, onInput: event => { draft.code = event.target.value; } });
    return [foldStrip(puzzle), paragraph('Sơ đồ học tập, không theo tỷ lệ. Mỗi đoạn bản đồ chỉ giữ một nửa số chữ cái.', 'diagram-caption'),
      element('div', { className: 'fold-workspace' }, targets, preview), field('Khóa hòm sắt: ngày và tháng (4 số)', code)];
  }

  showPeace() {
    this.activeId = 'peace';
    const reflection = element('textarea', { id: 'peace-reflection', rows: 3, maxLength: 1200, placeholder: 'Một điều mình muốn mang về… (có thể để trống)' });
    const choices = element('div', { className: 'peace-choices' });
    for (const label of ['Tìm hiểu thêm lịch sử', 'Lắng nghe và giúp đỡ', 'Giữ gìn không gian chung']) {
      choices.append(element('label', { className: 'choice-row' }, element('input', { type: 'checkbox' }), element('span', {}, label)));
    }
    this.dialog.show({ title: 'Điều mình muốn mang về', kicker: 'CÁNH CỬA HÒA BÌNH', content: element('div', {}, paragraph('Có thể đọc thêm những ký ức trong phòng, chọn một điều gần với mình, viết vài dòng, hoặc bước tiếp ngay. Không có đáp án đúng sai.'), choices, field('Một suy nghĩ riêng, không bắt buộc', reflection), paragraph('Những dòng này chỉ nằm trên trang đang mở, không được gửi hoặc lưu vào tiến độ.', 'form-help'), actions(button('Bước qua cánh cửa →', () => this.onIntent({ type: 'finish-peace' }), 'primary-button'), button('Đọc sổ tay', () => document.dispatchEvent(new CustomEvent('game-open-notebook'))))) });
  }

  showFeedback(text, tone = 'error') {
    if (!this.feedback?.isConnected) return;
    this.feedback.replaceChildren(paragraph(text, `feedback ${tone}`));
  }

  clearDrafts() { this.drafts.clear(); this.activeId = null; }
}
