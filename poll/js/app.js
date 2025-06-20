import { randInt, shuffle } from './utils.js';
import { Worksheet }     from './worksheet.js';

/**
 * Default-config generators for each screen
 * Each returns an array of { text, dataAnswer } with appropriate random ranges
 */
function genStandard() {
  const t = [];
  // 1) Sum of two one-digit
  const X = randInt(1,9), Y = randInt(1,9);
  t.push({ text:`Первое слагаемое ${X}, второе слагаемое ${Y}. Запиши сумму.`, dataAnswer:`${X+Y}` });
  // 2) Tens/units
  const A = randInt(1,9), B = randInt(0,9);
  t.push({ text:`Запиши число, в котором ${A} десятков и ${B} единиц.`, dataAnswer:`${A*10+B}` });
  // 3) Increment
  const C = randInt(1,20), D = randInt(1,10);
  t.push({ text:`Число ${C} увеличь на ${D}.`, dataAnswer:`${C+D}` });
  // 4) Roles subtraction
  const E = randInt(5,20), F = randInt(1,E-1);
  t.push({ text:`Уменьшаемое ${E}, вычитаемое ${F}. Запиши разность.`, dataAnswer:`${E-F}` });
  // 5) Neighbors
  const G = randInt(2,98);
  t.push({ text:`Запиши соседей числа ${G}.`, dataAnswer:`${G-1}, ${G+1}` });
  // 6) Smallest two-digit
  t.push({ text:`Наименьшее двузначное число.`, dataAnswer:`10` });
  // 7) Subtract+add
  const H = randInt(20,99), I = randInt(1,9), J = randInt(1,9);
  t.push({ text:`Разность двузначных чисел ${H} и ${I} прибавь ${J}.`, dataAnswer:`${H-I+J}` });
  // 8) Missing addend (both K and M are single-digit)
  const K = randInt(1,9);
  const M = randInt(1,9);
  t.push({
    text: `Какое число нужно взять из ${K}, чтобы получить ${K + M}?`,
    dataAnswer: `${M}`
  });
  // 9) Time add
  const sec = randInt(1,59);
  const h = randInt(0,23), m = randInt(0,59), s = randInt(0,59);
  const now = new Date(); now.setHours(h,m,s);
  const later = new Date(now.getTime()+sec*1000);
  const pad = n => String(n).padStart(2,'0');
  t.push({
    text:`Если игра начнётся через ${sec} секунд, а текущее время ${pad(h)}:${pad(m)}:${pad(s)}, во сколько стартует игра?`,
    dataAnswer:`${pad(later.getHours())}:${pad(later.getMinutes())}:${pad(later.getSeconds())}`
  });
  return t;
}

function genAdvanced() {
  const t = [];
  // 1) Next number
  const N = randInt(1,98);
  t.push({ text:`Заполни пропуск: ${N}, ___, ${N+2}. Как называется число, которое идёт сразу после ${N}?`, dataAnswer:`${N+1}` });
  // 2) Previous
  const Q = randInt(2,99);
  t.push({ text:`Заполни пропуск: ___, ${Q}, ${Q+1}. Какое число находится непосредственно перед ${Q}?`, dataAnswer:`${Q-1}` });
  // 3) Middle neighbor
  const S = randInt(1,98);
  t.push({ text:`В последовательности: ${S}, ___, ${S+2} – какое число должно стоять между ${S} и ${S+2}?`, dataAnswer:`${S+1}` });
  // 4) Digitness
  const d1 = randInt(1,9), d2 = randInt(10,99), d3 = randInt(100,999);
  t.push({
    text:`Запиши три числа: одно однозначное, другое двузначное и третье трёхзначное. Какому числу соответствует каждое описание?`,
    dataAnswer:`однозначное – ${d1}; двузначное – ${d2}; трёхзначное – ${d3}`
  });
  // 5) Addition
  const V = randInt(0,9), W = randInt(0,9);
  t.push({ text:`Выполни: ${V} + ${W} = ?`, dataAnswer:`${V+W}` });
  // 6) Series fill
  const X1 = randInt(1,20), Y1 = randInt(1,5);
  t.push({
    text:`Последовательность: ${X1}, ___, ${X1+2*Y1}, ___, ${X1+4*Y1}. Какое число идёт после ${X1} при прибавлении ${Y1}?`,
    dataAnswer:`${X1+Y1}`
  });
  // 7) Compare three
  let set = new Set();
  while(set.size<3) set.add(randInt(1,20));
  const [C1,C2,C3] = [...set];
  const lo = Math.min(C1,C2,C3), hi = Math.max(C1,C2,C3);
  t.push({ text:`Даны числа: ${C1}, ${C2}, ${C3}. Какое из них наименьшее, а какое – наибольшее?`, dataAnswer:`наименьшее – ${lo}; наибольшее – ${hi}` });
  // 8) Notebooks
  const D1 = randInt(1,10);
  t.push({ text:`Купили ${D1} тетрадей в клетку, а в линейку – на 1 больше. Сколько тетрадей купили всего?`, dataAnswer:`${D1+(D1+1)}` });
  // 9) Sign
  const E1 = randInt(1,20), E2 = randInt(1,E1);
  const sign = Math.random()<0.5? '+' : '-';
  const E3 = sign==='+'? E1+E2 : E1-E2;
  t.push({ text:`${E1} __ ${E2} = ${E3}. Какой знак (+ или –) нужно поставить?`, dataAnswer:sign });
  // 10) Evenness
  const Fe = 2*randInt(1,9);
  let Fo; do { Fo=randInt(1,19); } while(Fo%2===0);
  t.push({
    text:`Определи, какое из чисел ${Fe}, ${Fo}, ${randInt(1,9)*2} является чётным. Какой признак?`,
    dataAnswer:`${Fe}; оно делится на 2 без остатка`
  });
  // 11) Steps count
  const G1 = randInt(1,10), H1 = randInt(1,5);
  t.push({
    text:`Заполни пропуски: ${G1}, ___, ${G1+2*H1}, ___, ${G1+4*H1}, если каждое число увеличивается на ${H1}.`,
    dataAnswer:`${G1+H1}, ${G1+3*H1}`
  });
  // 12) Mental addition
  const I1 = randInt(1,9);
  const delta = 10 - (I1%10);
  const I2 = delta + randInt(1,8);
  t.push({
    text:`Как быстро вычислить сумму ${I1} + ${I2}, если сначала довести ${I1} до круглого числа? Опиши алгоритм.`,
    dataAnswer:`${I1}+${delta}=${I1+delta}, затем +${I2-delta}=${I1+I2}`
  });
  // 13) Time diff
  const secDiff = randInt(10,300);
  const h2 = randInt(0,23), m2 = randInt(0,59), s2 = randInt(0,59);
  const now2 = new Date(); now2.setHours(h2,m2,s2);
  const later2 = new Date(now2.getTime()+secDiff*1000);
  t.push({
    text:`Если запуск назначен на ${later2.getHours().toString().padStart(2,'0')}:${later2.getMinutes().toString().padStart(2,'0')}:${later2.getSeconds().toString().padStart(2,'0')}, а текущее время ${h2.toString().padStart(2,'0')}:${m2.toString().padStart(2,'0')}:${s2.toString().padStart(2,'0')}, сколько секунд осталось?`,
    dataAnswer:`${secDiff}`
  });
  // 14) Odd one out
  const base = randInt(1,10), step = randInt(1,5);
  const seq = [0,1,2,3,4].map(i=>base+i*step);
  const idx = randInt(0,4);
  const wrong = seq[idx] + step + 1;
  seq[idx] = wrong;
  t.push({
    text:`В последовательности: ${seq.join(', ')} одно число выбивается. Найди лишнее и обоснуй.`,
    dataAnswer:`${wrong}; остальные с шагом ${step}`
  });
  // 15) Figures compare
  t.push({
    text:`Сравни и поставь верный знак (меньше или больше): треугольник (3 стороны) __ прямоугольник (4 стороны).`,
    dataAnswer:`<`
  });
  // 16) More than
  const L1 = randInt(1,10), K2 = randInt(1,9);
  t.push({
    text:`У Кати на ${K2} предмета больше, чем у Васи. Если у Васи ${L1}, сколько у Кати? Как записать?`,
    dataAnswer:`${L1+K2}; ${L1}+${K2}=${L1+K2}`
  });
  return t;
}

document.addEventListener('DOMContentLoaded', () => {
  const standardSheet = new Worksheet('standardForm', 'checkStandard', () => {
    document.getElementById('advanced-tab').removeAttribute('disabled');
    new bootstrap.Tab(document.getElementById('advanced-tab')).show();
  });
  const advancedSheet = new Worksheet('advancedForm', 'checkAdvanced');

  document.getElementById('configFileInput').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return alert('No file selected.');
    const r = new FileReader();
    r.onload = ev => {
      try {
        const cfg = JSON.parse(ev.target.result);
        if (!cfg.standard || !cfg.advanced) {
          return alert('Invalid config format.');
        }
        shuffle(cfg.standard); shuffle(cfg.advanced);
        standardSheet.load(cfg.standard);
        advancedSheet.load(cfg.advanced);
        alert('Config loaded.');
      } catch (err) {
        alert('Error parsing JSON: ' + err.message);
      }
    };
    r.readAsText(f);
  });

  document.getElementById('loadDefault').addEventListener('click', () => {
    const std = genStandard();
    const adv = genAdvanced();
    shuffle(std); shuffle(adv);
    standardSheet.load(std);
    advancedSheet.load(adv);
    alert('Default tasks generated.');
  });
});