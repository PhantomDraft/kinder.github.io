import { TimeMask, CommaMask } from './masks.js';

/**
 * Worksheet handles rendering, masking, validation and checking
 */
export class Worksheet {
  /**
   * @param {string} formId
   * @param {string} buttonId
   * @param {Function|null} onSuccess
   */
  constructor(formId, buttonId, onSuccess = null) {
    this.formEl = document.getElementById(formId);
    this.btn   = document.getElementById(buttonId);
    this.onSuccess = onSuccess;

    // Disable check button until all inputs are filled
    this.btn.disabled = true;

    this.btn.addEventListener('click', () => {
      if (this.checkAll()) {
        alert('Все ответы верные!');
        if (this.onSuccess) this.onSuccess();
      } else {
        alert('Некоторые ответы неверны. Пожалуйста, просмотрите.');
      }
    });
  }

  /** Renders tasks: [{text, dataAnswer, answerParts?}] */
  load(tasks) {
    this.formEl.innerHTML = '';
    tasks.forEach((task,i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'mb-3';

      // label
      const label = document.createElement('label');
      label.className = 'form-label';
      label.htmlFor = `${this.formEl.id}_${i}`;
      label.textContent = task.text;
      wrapper.append(label);

      // 1) Checkbox widget
      if (task.widget === 'checkbox') {
        task.options.forEach(opt => {
          const div = document.createElement('div');
          div.className = 'form-check';
          const inp = document.createElement('input');
          inp.type = 'checkbox';
          inp.className = 'form-check-input';
          inp.value = opt;
          inp.id = `${this.formEl.id}_${i}_opt_${opt}`;
          div.append(inp, document.createTextNode(opt));
          wrapper.append(div);
          inp.addEventListener('change', () => this.toggleCheckButton());
        });
        this.formEl.append(wrapper);
        return;
      }

      // 2) Inline blanks
      if (task.answerParts) {
        task.answerParts.forEach((part, idx) => {
          if (part.beforeText) wrapper.append(document.createTextNode(part.beforeText));
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.className = 'form-control d-inline-block w-auto mx-1';
          inp.setAttribute('data-answer', part.correct);
          inp.placeholder = part.placeholder || '';
          wrapper.append(inp);
          inp.addEventListener('blur', () => this.validate(inp));
          inp.addEventListener('input', () => this.toggleCheckButton());
        });
        this.formEl.append(wrapper);
        return;
      }

      // 3) Single input
      const inp = document.createElement('input');
      inp.type='text';
      inp.className='form-control';
      inp.setAttribute('data-answer', task.dataAnswer);
      wrapper.append(inp);
      inp.addEventListener('blur',()=>this.validate(inp));
      inp.addEventListener('input',()=>this.toggleCheckButton());

      this.formEl.append(wrapper);
    });

    this.btn.disabled = true;
  }

  /** Validate single input */
  validate(input) {
    const userAnswer    = input.value.trim();
    const correctAnswer = input.getAttribute('data-answer').trim();
    let ok;

    if (correctAnswer.includes(',')) {
      if (!userAnswer.includes(',')) {
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
        return false;
      }
      const correctArr = correctAnswer.split(',').map(s => s.trim());
      const userArr    = userAnswer.split(',').map(s => s.trim());
      ok = correctArr.length === userArr.length
        && correctArr.every((v, i) => v === userArr[i]);
    } else {
      ok = (userAnswer === correctAnswer);
    }

    input.classList.toggle('is-valid', ok);
    input.classList.toggle('is-invalid', !ok);
    return ok;
  }

  /** Check all fields */
  checkAll() {
    const inputs = this.formEl.querySelectorAll('input[data-answer]');
    return Array.from(inputs).every(input => this.validate(input));
  }

  /** Enable the check button only when all fields are non-empty */
  toggleCheckButton() {
    const inputs = this.formEl.querySelectorAll('input[data-answer]');
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
    this.btn.disabled = !allFilled;
  }
}