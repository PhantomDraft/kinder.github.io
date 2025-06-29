import Utils from './utils.js';
import { Worksheet } from './worksheet.js';

/**
 * Main application module. Contains the task generator and
 * sets up the interaction with the interface.
 */
class ConfigGenerator {
        /** Generates the standard set of tasks. */
	generateStandard() {
		const t = [];
		const X = Utils.randInt(1, 9), Y = Utils.randInt(1, 9);
		t.push({
			text: `Первое слагаемое ${X}, второе слагаемое ${Y}. Запишите сумму.`,
			dataAnswer: `${X + Y}`
		});
		const A = Utils.randInt(1, 9), B = Utils.randInt(0, 9);
		t.push({
			text: `Запишите число, в котором ${A} десятков и ${B} единиц.`,
			dataAnswer: `${A * 10 + B}`
		});
		const C = Utils.randInt(1, 20), D = Utils.randInt(1, 10);
		t.push({
			text: `Число ${C} увеличьте на ${D}.`,
			dataAnswer: `${C + D}`
		});
		const E = Utils.randInt(5, 20), F = Utils.randInt(1, E - 1);
		t.push({
			text: `Уменьшаемое ${E}, вычитаемое ${F}. Запишите разность.`,
			dataAnswer: `${E - F}`
		});
		const G = Utils.randInt(2, 98);
		t.push({
			text: `Запишите соседей числа ${G}.`,
			dataAnswer: `${G - 1}, ${G + 1}`,
			hint: `Разделитель между цифрами будет выставлен автоматически`
		});
		t.push({
			text: `Наименьшее двузначное число.`,
			dataAnswer: `10`
		});
		const H = Utils.randInt(20, 99), I = Utils.randInt(1, 9), J = Utils.randInt(1, 9);
		t.push({
			text: `К разности чисел ${H} и ${I} прибавьте ${J}.`,
			dataAnswer: `${H - I + J}`
		});
		const K = Utils.randInt(1, 9);
		const L = Utils.randInt(K + 1, 18);
		t.push({
			text: `Какое слагаемое нужно прибавить к ${K}, чтобы получить ${L}?`,
			dataAnswer: `${L - K}`
		});
		const sec = Utils.randInt(1, 59);
		const h = Utils.randInt(0, 23), m = Utils.randInt(0, 59), s = Utils.randInt(0, 59);
		const now = new Date();
		now.setHours(h, m, s);
		const later = new Date(now.getTime() + sec * 1000);
		const pad = n => String(n).padStart(2, '0');
		t.push({
			text: `Если игра начнётся через ${sec} секунд, а текущее время ${pad(h)}:${pad(m)}:${pad(s)}, во сколько стартует игра?`,
			dataAnswer: `${pad(later.getHours())}:${pad(later.getMinutes())}:${pad(later.getSeconds())}`,
			hint: `Разделитель между цифрами будет выставлен автоматически`
		});
		return t;
	}

        /** Generates the "Advanced" task set. */
        generateAdvanced() {
		const t = [];
		const N = Utils.randInt(1, 98);
		t.push({
			text: `Укажите последующее ${N}.
___`,
			dataAnswer: `${N + 1}`
		});
		const Q = Utils.randInt(2, 99);
		t.push({
			text: `Заполните пропуск: ___, ${Q}, ${Q + 1}. Какое число находится непосредственно перед ${Q}?
___`,
			dataAnswer: `${Q - 1}`
		});
		const S = Utils.randInt(1, 98);
		t.push({
			text: `В последовательности: ${S}, ___, ${S + 2} – какое число должно стоять между ${S} и ${S + 2}?
___`,
			dataAnswer: `${S + 1}`
		});
		t.push({
			text: `Наименьшее трёхзначное число.`,
			dataAnswer: `100`
		});
		const V = Utils.randInt(0, 9), W = Utils.randInt(0, 9);
		t.push({
			text: `Сколько будет ${V} + ${W}?`,
			dataAnswer: `${V + W}`
		});
		const X1 = Utils.randInt(1, 20), Y1 = Utils.randInt(1, 5);
		t.push({
			text: `Последовательность: ${X1}, ___, ${X1 + 2 * Y1}, ${X1 + 3 * Y1}, ${X1 + 4 * Y1}. Какое число идёт после ${X1} при прибавлении ${Y1}?`,
			dataAnswer: `${X1 + Y1}`
		});
		let set = new Set();
		while (set.size < 3) set.add(Utils.randInt(1, 20));
		const [C1, C2, C3] = [...set];
		const lo = Math.min(C1, C2, C3), hi = Math.max(C1, C2, C3);
		t.push({
			text: `Даны числа: ${C1}, ${C2}, ${C3}. Укажите:
Наименьшее
___
Наибольшее
___`,
			dataAnswer: `${lo}; ${hi}`
		});
		const D1 = Utils.randInt(1, 10);
		t.push({
			text: `Купили ${D1} тетрадей в клетку, а в линейку – на 1 больше. Сколько тетрадей купили всего?`,
			dataAnswer: `${D1 + (D1 + 1)}`
		});
		const E1 = Utils.randInt(1, 20), E2 = Utils.randInt(1, E1);
		const sign = Math.random() < 0.5 ? '+' : '-';
		const E3 = sign === '+' ? E1 + E2 : E1 - E2;
		t.push({
			text: `${E1} __ ${E2} = ${E3}. Какой знак (+ или –) нужно поставить?`,
			dataAnswer: sign,
			signs: ['+', '-']
		});
		const Fe = 2 * Utils.randInt(1, 9);
		let Fo;
		do {
			Fo = Utils.randInt(1, 19);
		} while (Fo % 2 === 0);
		const F3 = Utils.randInt(1, 9) * 2;
		t.push({
			text: `Какие из чисел ${Fe}, ${Fo}, ${F3} чётные?`,
			options: [
				{ text: `${Fe}`, correct: true },
				{ text: `${Fo}`, correct: false },
				{ text: `${F3}`, correct: true }
			]
		});
		const G1 = Utils.randInt(1, 10), H1 = Utils.randInt(1, 5);
		t.push({
			text: `Заполните пропуски: ${G1}, ___, ${G1 + 2 * H1}, ___, ${G1 + 4 * H1}, если каждое число увеличивается на ${H1}.
___, ___`,
			dataAnswer: `${G1 + H1}, ${G1 + 3 * H1}`
		});
		const base = Utils.randInt(1, 10), step = Utils.randInt(1, 5);
		const seq = [0,1,2,3,4].map(i => base + i * step);
		const idx = Utils.randInt(0, 4);
		let wrong = seq[idx] + step + 1;
		while (seq.includes(wrong)) wrong++;
		seq[idx] = wrong;
		t.push({
			text: `В последовательности: ${seq.join(', ')} одно число выбивается. Найдите лишнее.`,
			options: seq.map(n => ({ text: `${n}`, correct: n === wrong }))
		});
		t.push({
			text: `Треугольник (3 стороны) __ прямоугольник (4 стороны). Сравните и поставьте верный знак (меньше или больше):`,
			dataAnswer: '<',
			signs: ['<', '>']
		});
		const L1 = Utils.randInt(1, 10), K2 = Utils.randInt(1, 9);
		t.push({
			text: `У Кати на ${K2} предмета больше, чем у Васи. Если у Васи ${L1}, сколько у Кати?`,
			dataAnswer: `${L1 + K2}`
		});
		return t;
	}
}

class App {
	constructor() {
		this.generator = new ConfigGenerator();
		this.standardSheet = new Worksheet('standardForm', 'checkStandard', () => {
			const advTabBtn = document.getElementById('advanced-tab');
			advTabBtn.removeAttribute('disabled');
			new bootstrap.Tab(advTabBtn).show();
			document.getElementById('taskTabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
			advTabBtn.classList.add('highlight');
			setTimeout(() => advTabBtn.classList.remove('highlight'), 1000);
		});
		this.advancedSheet = new Worksheet('advancedForm', 'checkAdvanced');
		this.addListeners();
	}

	addListeners() {
		document.getElementById('configFileInput').addEventListener('change', e => this.handleFile(e));
		document.getElementById('loadDefault').addEventListener('click', () => this.loadDefault());
	}

	handleFile(e) {
		const f = e.target.files[0];
		if (!f) return alert('Файл не выбран.');
		const r = new FileReader();
		r.onload = ev => {
			try {
				const cfg = JSON.parse(ev.target.result);
				if (!cfg.standard || !cfg.advanced) {
					return alert('Неверный формат конфигурации.');
				}
				Utils.shuffle(cfg.standard);
				Utils.shuffle(cfg.advanced);
				this.standardSheet.load(cfg.standard);
				this.advancedSheet.load(cfg.advanced);
				alert('Конфигурация загружена.');
			} catch (err) {
				alert('Ошибка при разборе JSON: ' + err.message);
			}
		};
		r.readAsText(f);
	}

	loadDefault() {
		const std = this.generator.generateStandard();
		const adv = this.generator.generateAdvanced();
		Utils.shuffle(std);
		Utils.shuffle(adv);
		this.standardSheet.load(std);
		this.advancedSheet.load(adv);
		document.getElementById('standard-tab').click();
		alert('Загружена стандартная конфигурация. Сначала решите и проверьте её.');
	}
}

document.addEventListener('DOMContentLoaded', () => new App());