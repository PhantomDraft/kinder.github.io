/**
 * Input masks: TimeMask formats as HH:MM:SS, CommaMask splits numbers by comma+space
 */

class InputMask {
  constructor(input) { this.input = input; }
  attach() {}
}

export class TimeMask extends InputMask {
  attach() {
    this.input.addEventListener('input', () => {
      const pos = this.input.selectionStart;
      const oldLen = this.input.value.length;
      let d = this.input.value.replace(/\D/g, '').slice(0,6);
      const parts = [];
      if (d.length >= 2) {
        parts.push(d.slice(0,2));
        if (d.length >= 4) {
          parts.push(d.slice(2,4));
          if (d.length > 4) parts.push(d.slice(4));
        } else {
          parts.push(d.slice(2));
        }
      } else {
        parts.push(d);
      }
      this.input.value = parts.join(':');
      const newLen = this.input.value.length;
      this.input.selectionStart = this.input.selectionEnd = pos + (newLen - oldLen);
    });
  }
}

export class CommaMask extends InputMask {
  attach() {
    // on each input keep only digits and commas/spaces, normalize to "X, Y"
    this.input.addEventListener('input', () => {
      const pos = this.input.selectionStart;
      const oldLen = this.input.value.length;

      // leave only digits and commas
      let val = this.input.value.replace(/[^\d,]/g, '');
      // split & trim
      let parts = val.split(',').map(s => s.trim());
      // if trailing comma, preserve empty segment
      if (val.endsWith(',')) parts.push('');
      this.input.value = parts.join(', ');

      const newLen = this.input.value.length;
      this.input.selectionStart = this.input.selectionEnd = pos + (newLen - oldLen);
    });

    // on blur — если после ввода нет запятой, добавляем ", "
    this.input.addEventListener('blur', () => {
      const v = this.input.value.trim();
      if (/^\d+$/.test(v)) {
        this.input.value = v + ', ';
      }
    });
  }
}