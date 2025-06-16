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
    this.input.addEventListener('input', () => {
      const pos = this.input.selectionStart;
      const oldLen = this.input.value.length;
      const parts = this.input.value.split(/\D+/).filter(v => v);
      this.input.value = parts.join(', ');
      const newLen = this.input.value.length;
      this.input.selectionStart = this.input.selectionEnd = pos + (newLen - oldLen);
    });
  }
}