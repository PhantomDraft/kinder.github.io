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
    this.btn.addEventListener('click', () => {
      if (this.checkAll()) {
        alert('All answers correct!');
        if (this.onSuccess) this.onSuccess();
      } else {
        alert('Some answers are incorrect. Please review.');
      }
    });
  }

  /** Renders tasks: [{text, dataAnswer}] */
  load(tasks) {
    this.formEl.innerHTML = '';
    tasks.forEach((task, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'mb-3';

      const label = document.createElement('label');
      label.className = 'form-label';
      label.htmlFor = `${this.formEl.id}_${i}`;
      label.textContent = `${i+1}. ${task.text}`;

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-control';
      input.id = `${this.formEl.id}_${i}`;
      input.setAttribute('data-answer', task.dataAnswer);
      input.placeholder = 'Enter answer here';

      // Attach masks
      if (task.dataAnswer.includes(':')) {
        new TimeMask(input).attach();
      } else if (task.dataAnswer.includes(',')) {
        new CommaMask(input).attach();
      }

      // Live validation
      input.addEventListener('blur', () => this.validate(input));

      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = 'Incorrect answer';

      wrapper.append(label, input, feedback);
      this.formEl.appendChild(wrapper);
    });
  }

  /** Validate single input */
  validate(input) {
    const userAnswer    = input.value.trim();
    const correctAnswer = input.getAttribute('data-answer').trim();
    let ok;

    if (correctAnswer.includes(',')) {
      // дождёмся хотя бы одной запятой, прежде чем валидировать
      if (!userAnswer.includes(',')) {
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
        return false;
      }
      // сравниваем массивы
      const correctArr = correctAnswer.split(',').map(s => s.trim());
      const userArr    = userAnswer.split(',').map(s => s.trim());
      ok = correctArr.length === userArr.length
        && correctArr.every((v, i) => v === userArr[i]);
    } else {
      // одиночный ответ
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
}