/**
 * Input masks: TimeMask formats as HH:MM:SS, CommaMask splits numbers by comma+space
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
    // calculate length of first correct part
    const correct = this.input.getAttribute('data-answer') || '';
    const firstLen = (correct.split(',')[0]||'').trim().length;

    let last = '';

    this.input.addEventListener('input', e => {
      const pos = this.input.selectionStart;
      const oldLen = this.input.value.length;
      const increasing = this.input.value.length > last.length && e.inputType !== 'deleteContentBackward';

      // keep only digits and commas
      let val = this.input.value.replace(/[^\d,]/g, '');

      // split & trim
      const rawParts = val.split(',');
      let parts = rawParts.map(s => s.trim());

      // if user has just typed exactly firstLen digits and hasn't typed comma yet,
      // auto-insert comma segment
      if (!val.includes(',') && val.length === firstLen && increasing) {
        parts = [ parts[0], '' ];
      }

      // if they did type a comma at end, preserve empty second segment
      if (val.endsWith(',')) {
        parts = parts.length === 1 ? [ parts[0], '' ] : parts;
      }

      if (val.length < firstLen) {
        parts = [ parts[0] ];
      }

      this.input.value = parts.join(', ');

      const newLen = this.input.value.length;
      this.input.selectionStart = this.input.selectionEnd = pos + (newLen - oldLen);
      last = this.input.value;
    });
  }
}