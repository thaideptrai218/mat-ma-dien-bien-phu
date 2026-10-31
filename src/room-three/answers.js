import {PREPARATION_CARDS,CARGO_ITEMS,TELEGRAMS,OPENING_EVENTS} from './puzzle-data.js';

export const normalizeAnswer=value=>String(value??'').replace(/[đĐ]/g,'D').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/gi,'').toUpperCase();
const record=value=>Boolean(value&&typeof value==='object'&&!Array.isArray(value));
export const sameSet=(value,expected)=>Array.isArray(value)&&value.length===expected.length&&new Set(value).size===value.length&&value.every(id=>expected.includes(id));
export function parseDate(value){
  const text=String(value??'').trim().replace(/\s+/g,'');
  let match=text.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
  if(match)return [Number(match[1]),Number(match[2]),Number(match[3])];
  match=text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match?[Number(match[3]),Number(match[2]),Number(match[1])]:null;
}
const sameDate=(a,b)=>{const first=parseDate(a),second=parseDate(b);return Boolean(first&&second&&first.every((v,i)=>v===second[i]));};
export function preparationCorrect(p={}){
  return record(p)&&record(p.groups)&&PREPARATION_CARDS.every(card=>p.groups[card.id]===card.group)&&sameSet(p.supplies,['food','weapons','ammunition','medical'])&&p.purpose==='sustain';
}
export function cargoCorrect(p={}){
  return record(p)&&record(p.matches)&&CARGO_ITEMS.every(item=>p.matches[item.id]===item.id)&&p.reason==='terrain-load'&&sameSet(p.contributors,['civilians','youth']);
}
export function telegramCorrect(order,words){
  if(!sameSet(order,words.map(word=>word.id)))return false;
  // Identical NHANH/CHẮC cards are interchangeable; their hidden IDs are not history.
  const phrase=order.map(id=>words.find(word=>word.id===id).text).join(' ');
  return normalizeAnswer(phrase)===normalizeAnswer(words.map(word=>word.text).join(' '));
}
export function strategyCorrect(p={}){
  return record(p)&&telegramCorrect(p.initial,TELEGRAMS.initial)&&telegramCorrect(p.final,TELEGRAMS.final)&&p.reason==='sure-victory'&&sameSet(p.insights,['assess-reality','careful-command','victory-first']);
}
export function openingCorrect(p={}){
  return record(p)&&Array.isArray(p.order)&&p.order.join(',')===OPENING_EVENTS.map(event=>event.id).join(',')&&record(p.dates)&&OPENING_EVENTS.every(event=>sameDate(p.dates[event.id],event.date))&&p.target==='him-lam'&&p.surrender==='ban-keo'&&sameSet(p.implications,['break-north','expand-control','next-offensives']);
}
export const finalCorrect=date=>sameDate(date,'13/03/1954');
export const EVALUATORS=Object.freeze({preparation:preparationCorrect,cargo:cargoCorrect,strategy:strategyCorrect,opening:openingCorrect});
