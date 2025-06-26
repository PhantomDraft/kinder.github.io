import { randInt, shuffle } from './utils.js';
import { Worksheet } from './worksheet.js';

/**
 * Default-config generators for each screen
 * Each returns an array of { text, dataAnswer } with appropriate random ranges
 */
function genStandard() {
  const t = [];
  // 1) Sum of two one-digit
  const X = randInt(1, 9), Y = randInt(1, 9);
  t.push({
    text: `Первое слагаемое ${X}, второе слагаемое ${Y}. Запиши сумму.`,
    dataAnswer: `${X + Y}`
  });
  // 2) Tens/units
  const A = randInt(1, 9), B = randInt(0, 9);
  t.push({
    text: `Запиши число, в котором ${A} десятков и ${B} единиц.`,
    dataAnswer: `${A * 10 + B}`
  });
  // 3) Increment
  const C = randInt(1, 20), D = randInt(1, 10);
  t.push({
    text: `Число ${C} увеличь на ${D}.`,
    dataAnswer: `${C + D}`
  });
  // 4) Roles subtraction
  const E = randInt(5, 20), F = randInt(1, E - 1);
  t.push({
    text: `Уменьшаемое ${E}, вычитаемое ${F}. Запиши разность.`,
    dataAnswer: `${E - F}`
  });
  // 5) Neighbors
  const G = randInt(2, 98);
  t.push({
    text: `Запиши соседей числа ${G}.`,
    dataAnswer: `${G - 1}, ${G + 1}`
  });
  // 6) Smallest two-digit
  t.push({
    text: `Наименьшее двузначное число.`,
    dataAnswer: `10`
  });
  // 7) Subtract+add
  const H = randInt(20, 99), I = randInt(1, 9), J = randInt(1, 9);
  t.push({
    text: `К разности двузначных чисел ${H} и ${I} прибавь ${J}.`,
    dataAnswer: `${H - I + J}`
  });
  // 8) Missing addend
  const K = randInt(1, 9);
  const L = randInt(K + 1, 18);
  t.push({
    text: `Какое слагаемое нужно прибавить к ${K}, чтобы получить ${L}?`,
    dataAnswer: `${L - K}`
  });
  // 9) Time add
  const sec = randInt(1, 59);
  const h = randInt(0, 23), m = randInt(0, 59), s = randInt(0, 59);
  const now = new Date();
  now.setHours(h, m, s);
  const later = new Date(now.getTime() + sec * 1000);
  const pad = n => String(n).padStart(2, '0');
  t.push({
    text: `Если игра начнётся через ${sec} секунд, а текущее время ${pad(h)}:${pad(m)}:${pad(s)}, во сколько стартует игра?`,
    dataAnswer: `${pad(later.getHours())}:${pad(later.getMinutes())}:${pad(later.getSeconds())}`
  });
  return t;
}

/**
 * Advanced-config generator for the “Дополнительно” screen
 * Теперь возвращает { text, answerParts?, widget? }
 */
function genAdvanced() {
  const t = [];

  // 1) Next number (inline blank)
  {
    const N = randInt(1, 98);
    t.push({
      text: `Заполни пропуск: ${N}, ___, ${N + 2}. Как называется число, которое идёт сразу после ${N}?`,
      answerParts: [
        { beforeText: '',          correct: `${N+1}`, placeholder: `${N+1}` }
      ]
    });
  }

  // 2) Previous number (inline blank)
  {
    const Q = randInt(2, 99);
    t.push({
      text: `Заполни пропуск: ___, ${Q}, ${Q + 1}. Какое число находится непосредственно перед ${Q}?`,
      answerParts: [
        { beforeText: '',          correct: `${Q-1}`, placeholder: `${Q-1}` }
      ]
    });
  }

  // 3) Middle neighbor (inline blank)
  {
    const S = randInt(1, 98);
    t.push({
      text: `В последовательности: ${S}, ___, ${S + 2} – какое число должно стоять между ${S} и ${S + 2}?`,
      answerParts: [
        { beforeText: '',          correct: `${S+1}`, placeholder: `${S+1}` }
      ]
    });
  }

  // 4) Minimal three-digit (один ввод)
  t.push({
    text: `Наименьшее трёхзначное число.`,
    dataAnswer: `100`
  });

  // 5) Simple addition (один ввод)
  {
    const V = randInt(0,9), W = randInt(0,9);
    t.push({
      text: `Выполни: ${V} + ${W} = ?`,
      dataAnswer: `${V+W}`
    });
  }

  // 6) Series fill: поля прямо вместо "__"
  {
    const X1 = randInt(1,20), Y1 = randInt(1,5);
    t.push({
      text: `Заполни пропуски: ${X1}, ___, ${X1+2*Y1}, ___, ${X1+4*Y1}, если каждое число увеличивается на ${Y1}.`,
      answerParts: [
        { beforeText: '',          correct: `${X1+Y1}`,       placeholder: `${X1+Y1}` },
        { beforeText: ', ',        correct: `${X1+3*Y1}`,     placeholder: `${X1+3*Y1}` }
      ]
    });
  }

  // 7) Compare three numbers → два inline-поля, новый строкой
  {
    let set=new Set();
    while(set.size<3) set.add(randInt(1,20));
    const [C1,C2,C3]=[...set], lo=Math.min(C1,C2,C3), hi=Math.max(C1,C2,C3);
    t.push({
      text: `\nДаны числа: ${C1}, ${C2}, ${C3}.\nНаименьшее – ___\nНаибольшее – ___`,
      answerParts: [
        { beforeText: '',          correct: `${lo}`, placeholder: `${lo}` },
        { beforeText: '',          correct: `${hi}`, placeholder: `${hi}` }
      ]
    });
  }

  // 8) Notebooks situational (один ввод — без inline-полей)
  {
    const D1 = randInt(1,10);
    t.push({
      text: `Купили ${D1} тетрадей в клетку, а в линейку – на 1 больше. Сколько тетрадей купили всего?`,
      dataAnswer: `${D1 + (D1+1)}`
    });
  }

  // 9) Correct arithmetic sign (один ввод)
  {
    const E1=randInt(1,20), E2=randInt(1,E1);
    const sign=Math.random()<.5?'+':'-';
    const E3 = sign==='+'?E1+E2:E1-E2;
    t.push({
      text: `${E1} __ ${E2} = ${E3}. Какой знак (+ или –) нужно поставить?`,
      dataAnswer: sign
    });
  }

  // 10) Odd one out → чекбоксы
  {
    const seq=[2,5,8,11,18]; // фиксируем для примера
    t.push({
      text: `В последовательности: ${seq.join(', ')} одно число выбивается. Найди лишнее и обоснуй.`,
      widget: 'checkbox',            // переключаемся на чекбоксы
      options: seq.map(n=>`${n}`),   // варианты
      correct: [`18`]                // только 18 — правильный checkbox
    });
  }

  // 11) “More than” problem — убираем запись, только число
  {
    const L1=4, K2=2;
    t.push({
      text: `У Кати на ${K2} предмета больше, чем у Васи. Если у Васи ${L1}, сколько у Кати?`,
      dataAnswer: `${L1+K2}`
    });
  }

  // 12) Mental addition strategy — две строки и два inline-поля
  {
    const I1=2, I2=13;
    const delta=10-(I1%10);
    // first part: доведение до 10
    // second part: остаток
    t.push({
      text: `\nЗапоминай:\nДоводим до 10: ___\nДалее: ___`,
      answerParts: [
        { beforeText:'', correct:`${I1+delta}`,   placeholder:`${I1+delta}` },
        { beforeText:'', correct:`+${I2-delta}=${I1+I2}`, placeholder:`+${I2-delta}=${I1+I2}` }
      ]
    });
  }

  // 13) Evenness check → чекбоксы без объяснения
  {
    const nums=[18,7,4];
    t.push({
      text: `Какое из чисел ${nums.join(', ')} чётное? Отметь правильный вариант.`,
      widget:'checkbox',
      options: nums.map(n=>`${n}`),
      correct: [`18`,`4`]  // оба чётные
    });
  }

  // 14) More tasks (например Compare figures) — оставляем без изменений
  {
    t.push({
      text: `Сравни: треугольник (3) __ прямоугольник (4).`,
      dataAnswer: '<'
    });
  }

  return t;
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize worksheets
  const standardSheet = new Worksheet('standardForm', 'checkStandard', () => {
    const advTabBtn = document.getElementById('advanced-tab');
    advTabBtn.removeAttribute('disabled');                    // разблокировать вкладку
    new bootstrap.Tab(advTabBtn).show();                      // переключиться на неё
    document.getElementById('taskTabs').scrollIntoView({      // прокрутить к вкладкам
      behavior: 'smooth',
      block: 'start'
    });
    advTabBtn.classList.add('highlight');                     // подсветить
    setTimeout(() => advTabBtn.classList.remove('highlight'), 1000);
  });
  const advancedSheet = new Worksheet('advancedForm', 'checkAdvanced');

  // Config file loader
  document.getElementById('configFileInput').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return alert('Файл не выбран.');
    const r = new FileReader();
    r.onload = ev => {
      try {
        const cfg = JSON.parse(ev.target.result);
        if (!cfg.standard || !cfg.advanced) {
          return alert('Неверный формат конфигурации.');
        }
        shuffle(cfg.standard);
        shuffle(cfg.advanced);
        standardSheet.load(cfg.standard);
        advancedSheet.load(cfg.advanced);
        alert('Конфигурация загружена.');
      } catch (err) {
        alert('Ошибка при разборе JSON: ' + err.message);
      }
    };
    r.readAsText(f);
  });

  // Default Config button handler
  document.getElementById('loadDefault').addEventListener('click', () => {
    // 1) Generate default arrays
    const std = genStandard();
    const adv = genAdvanced();

    // 2) Shuffle and load into standard and advanced forms
    shuffle(std);
    shuffle(adv);
    standardSheet.load(std);
    advancedSheet.load(adv);

    // 3) Остаёмся на вкладке Standard и просим сначала решить её
    document.getElementById('standard-tab').click();
    alert('Загружена стандартная конфигурация. Сначала решите и проверьте её.');
  });
});