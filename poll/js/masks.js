/**
 * Input mask classes.
 * TimeMask formats time as HH:MM:SS,
 * CommaMask separates numbers with a comma and space.
 */
class InputMask {
	constructor(input) { this.input = input; }
	attach() {}
}

export class TimeMask extends InputMask {
	attach() {
		let prevDigits = 0;
		this.input.addEventListener('input', e => {
			const pos = this.input.selectionStart;
			const oldLen = this.input.value.length;
			const deleting = e.inputType === 'deleteContentBackward';

			let d = this.input.value.replace(/\D/g, '').slice(0,6);
			let result = '';

			if (d.length <= 2) {
				result = d;
				if (d.length === 2 && !deleting && prevDigits < d.length) result += ':';
			} else if (d.length <= 4) {
				result = d.slice(0,2) + ':' + d.slice(2);
				if (d.length === 4 && !deleting && prevDigits < d.length) result += ':';
			} else {
				result = d.slice(0,2) + ':' + d.slice(2,4) + ':' + d.slice(4);
			}

			this.input.value = result;
			const newLen = this.input.value.length;
			this.input.selectionStart = this.input.selectionEnd = pos + (newLen - oldLen);
			prevDigits = d.length;
		});
	}
}

export class CommaMask extends InputMask {
	attach() {
		const correct = this.input.getAttribute('data-answer') || '';
		const [p1, p2] = correct.split(',');
		const firstLen = (p1 || '').trim().length;
		const secondLen = (p2 || '').trim().length;

		this.input.addEventListener('input', e => {
			const pos = this.input.selectionStart;
			const oldLen = this.input.value.length;

			let digits = this.input.value.replace(/\D/g, '').slice(0, firstLen + secondLen);
			const part1 = digits.slice(0, Math.min(firstLen, digits.length));
			const part2 = digits.slice(firstLen);

			let result = part1;
			if (part2.length > 0) result += ', ' + part2;

			this.input.value = result;
			const newLen = this.input.value.length;
			this.input.selectionStart = this.input.selectionEnd = pos + (newLen - oldLen);
		});
	}
}
