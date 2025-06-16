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
    // calculate length of first correct part
    const correct = this.input.getAttribute('data-answer') || '';
    const firstLen = (correct.split(',')[0]||'').trim().length;

    this.input.addEventListener('input', () => {
      const pos = this.input.selectionStart;
      const oldLen = this.input.value.length;

      // keep only digits and commas
      let val = this.input.value.replace(/[^\d,]/g, '');

      // split & trim
      const rawParts = val.split(',');
      let parts = rawParts.map(s => s.trim());

      // if user has just typed exactly firstLen digits and hasn't typed comma yet,
      // auto-insert comma segment
      if (!val.includes(',') && val.length === firstLen) {
        parts = [ parts[0], '' ];
      }

      // if they did type a comma at end, preserve empty second segment
      if (val.endsWith(',')) {
        parts = parts.length === 1 ? [ parts[0], '' ] : parts;
      }

      this.input.value = parts.join(', ');

      const newLen = this.input.value.length;
      this.input.selectionStart = this.input.selectionEnd = pos + (newLen - oldLen);
    });
  }
}