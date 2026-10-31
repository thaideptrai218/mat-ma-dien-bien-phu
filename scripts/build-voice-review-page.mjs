// npm run voice:review — writes a local, never-deployed listening page: every line with its player, display text, TTS text and a
// Đạt/Sai + note column. Marks are kept in the browser (localStorage) and can be exported as CSV for regeneration.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {MANIFEST_PATH} from './voice/voice-manifest.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '.cache/voice-review.html');
const {lines} = JSON.parse(fs.readFileSync(path.join(root, MANIFEST_PATH), 'utf8'));
const esc = value => String(value).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const rows = lines.map((line, index) => `<tr data-id="${line.id}"><td>${index + 1}</td><td>${esc(line.rooms.join(' '))}</td>` +
  `<td class="v-${line.voice}">${esc(line.speaker)}</td><td>${esc(line.text)}<div class="tts">${esc(line.ttsText)}</div></td>` +
  `<td><audio controls preload="none" src="../public/${line.file}"></audio></td>` +
  `<td><select><option></option><option>Đạt</option><option>Sai</option></select></td><td><input placeholder="Ghi chú phát âm"></td></tr>`).join('\n');

fs.writeFileSync(out, `<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8"><title>Duyệt lồng tiếng — Mật mã Điện Biên Phủ</title>
<style>body{font:14px system-ui;margin:16px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:4px;vertical-align:top}
.tts{color:#777;font-size:12px;margin-top:2px}.v-system{color:#0a5}.v-narrator{color:#a50}audio{width:220px}tr.bad{background:#fee}tr.ok{background:#efe}</style></head>
<body><h1>Duyệt lồng tiếng (${lines.length} câu)</h1>
<p>Nghe từng câu, chọn Đạt/Sai, ghi cách đọc đúng nếu sai. Lựa chọn tự lưu trong trình duyệt. <button id="export">Xuất CSV câu Sai</button></p>
<table><thead><tr><th>#</th><th>Phòng</th><th>Người nói</th><th>Câu (xám: câu gửi TTS)</th><th>Nghe</th><th>Đạt?</th><th>Ghi chú</th></tr></thead><tbody>
${rows}
</tbody></table>
<script>
const KEY='mat-ma-dien-bien-phu:voice-review:v1',marks=JSON.parse(localStorage.getItem(KEY)||'{}');
for(const tr of document.querySelectorAll('tr[data-id]')){const id=tr.dataset.id,[sel,note]=[tr.querySelector('select'),tr.querySelector('input')];
  const paint=()=>{tr.className=sel.value==='Sai'?'bad':sel.value==='Đạt'?'ok':''};
  if(marks[id]){sel.value=marks[id].mark;note.value=marks[id].note;}paint();
  const save=()=>{marks[id]={mark:sel.value,note:note.value};localStorage.setItem(KEY,JSON.stringify(marks));paint();};
  sel.onchange=save;note.oninput=save;}
document.getElementById('export').onclick=()=>{const rows=[...document.querySelectorAll('tr.bad')].map(tr=>[tr.dataset.id,tr.cells[3].firstChild.textContent,tr.querySelector('input').value]);
  const csv='\\uFEFF'+[['id','text','note'],...rows].map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\\r\\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='voice-review-sai.csv';a.click();};
</script></body></html>
`);
console.log(`→ .cache/voice-review.html (open locally; not deployed) (${lines.length} lines)`);
