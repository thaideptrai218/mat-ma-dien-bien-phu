import { element, button, heading, sourceText } from './ui-elements.js';

const artifactKinds = new Set(['letter', 'journal', 'report']);
const kindLabels = { letter: 'LÁ THƯ', journal: 'TRANG NHẬT KÝ', report: 'BẢN GHI CHÉP' };

function envelope(doc) {
  const node = element('div', 'r1-letter-envelope');
  // The address is repeated on the actual sheet; this is only a material detail.
  node.setAttribute('aria-hidden', 'true');
  node.append(element('span', 'r1-envelope-label', 'Gửi'), element('span', 'r1-envelope-address', doc.recipient));
  return node;
}

function artifactPaper(doc) {
  const sheet = element('article', `r1-artifact-sheet r1-artifact-sheet--${doc.kind}`);
  sheet.setAttribute('aria-label', `Toàn văn: ${doc.title || 'Tư liệu'}`);
  if (doc.date) sheet.append(element('p', 'r1-letter-date', doc.date));
  if (doc.kind === 'report') sheet.append(element('h3', 'r1-report-title', doc.title));
  if (doc.recipient && !doc.salutation) sheet.append(element('p', 'r1-letter-recipient', `Gửi ${doc.recipient},`));
  if (doc.salutation) sheet.append(element('p', 'r1-letter-salutation', doc.salutation));
  const prose = element('div', 'r1-artifact-prose');
  for (const paragraph of doc.paragraphs || []) prose.append(element('p', '', paragraph));
  sheet.append(prose);
  if (doc.closing || doc.signature || doc.author) {
    const signoff = element('footer', 'r1-letter-signoff');
    if (doc.closing) signoff.append(element('p', 'r1-letter-closing', doc.closing));
    signoff.append(element('p', 'r1-letter-signature', doc.signature || doc.author));
    sheet.append(signoff);
  }
  return sheet;
}

function archiveTag(doc) {
  if (!doc.archiveMark && !doc.archiveLabel) return null;
  const archive = element('aside', 'r1-letter-archive');
  archive.setAttribute('aria-label', 'Dấu lưu hồ sơ, ngoài nội dung lá thư');
  if (doc.archiveMark) archive.append(element('strong', 'r1-archive-mark', doc.archiveMark));
  archive.append(element('p', '', doc.archiveLabel || 'Dấu lưu hồ sơ'));
  return archive;
}

/** Full native text reader. Reaching the bottom only enables a deliberate action. */
export function documentPanel(data, emit) {
  const doc = data.document || {};
  const isArtifact = artifactKinds.has(doc.kind);
  const body = element('section', `r1-document${isArtifact ? ` r1-document--artifact r1-document--${doc.kind}` : ''}`);
  const header = element('header', 'r1-document-heading');
  const label = isArtifact ? [kindLabels[doc.kind], doc.code !== kindLabels[doc.kind] ? doc.code : ''].filter(Boolean).join(' · ') : `HỒ SƠ ${doc.code || doc.id || ''}`;
  header.append(heading(doc.title || 'Tư liệu', label));
  if (!isArtifact) {
    const metadata = [doc.date, doc.author].filter(Boolean).join(' · ');
    if (metadata) header.append(element('p', 'r1-document-meta', metadata));
  }
  body.append(header);
  const source = sourceText(doc.source);
  if (isArtifact || doc.fictionDisclosure) {
    const context = element('aside', 'r1-document-context');
    context.setAttribute('aria-label', 'Thông tin về văn bản');
    context.append(element('p', 'r1-fiction-disclosure', doc.fictionDisclosure || 'Văn bản sáng tác cho trò chơi, không phải hiện vật lịch sử.'));
    if (source) context.append(element('p', 'r1-document-source', source));
    body.append(context);
  } else if (source) body.append(element('p', 'r1-source-badge', source));

  const scroll = element('div', `r1-paper-scroll${isArtifact ? ' r1-artifact-scroll' : ''}`);
  scroll.tabIndex = 0;
  scroll.setAttribute('aria-label', 'Toàn văn tư liệu — cuộn xuống để đọc tiếp');
  if (isArtifact) {
    if (doc.kind === 'letter' && doc.recipient) scroll.append(envelope(doc));
    scroll.append(artifactPaper(doc));
    const archive = archiveTag(doc);
    if (archive) scroll.append(archive);
  } else {
    for (const paragraph of doc.paragraphs || []) scroll.append(element('p', '', paragraph));
  }
  scroll.append(element('p', 'r1-document-end', '— Hết tư liệu —'));

  const footer = element('div', 'r1-document-footer');
  const hint = element('p', 'r1-muted', data.readOnly ? 'Bản đầy đủ đã lưu trong sổ tay.' : 'Đọc đến cuối tư liệu để cùng Long suy luận.');
  hint.setAttribute('role', 'status');
  const finish = button(data.readOnly ? 'Đóng tư liệu' : 'Cùng Long suy luận', () => emit(data.readOnly ? 'ui-close' : data.finishAction || 'document-finish', { id: doc.id }), 'r1-primary');
  finish.disabled = !data.readOnly;
  footer.append(hint, finish);
  body.append(scroll, footer);
  const check = () => {
    if (data.readOnly || !scroll.isConnected || !scroll.clientHeight) return;
    if (scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 8) {
      finish.disabled = false;
      hint.textContent = 'Đã tới cuối tư liệu. Tiếp tục với suy luận của Long.';
    }
  };
  scroll.addEventListener('scroll', check, { passive: true });
  let resize;
  return {
    node: body,
    afterOpen: () => {
      check();
      if (typeof ResizeObserver !== 'undefined') { resize = new ResizeObserver(check); resize.observe(scroll); }
      document.fonts?.ready.then(check);
    },
    cleanup: () => resize?.disconnect(),
  };
}
