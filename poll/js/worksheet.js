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
    // Clear existing content
    this.formEl.innerHTML = '';

    tasks.forEach((task, i) => {
      // Create a wrapper for each question
      const wrapper = document.createElement('div');
      wrapper.className = 'mb-3';

      // 1) Question label
      const label = document.createElement('label');
      label.className = 'form-label';
      label.htmlFor = `${this.formEl.id}_${i}`;
      label.textContent = `${i + 1}. ${task.text}`;
      wrapper.append(label);

      // 2) If answerParts is defined, render multiple inline inputs
      if (task.answerParts && Array.isArray(task.answerParts)) {
        task.answerParts.forEach((part, idx) => {
          // Insert any text that should appear before this input
          if (part.beforeText) {
            wrapper.append(document.createTextNode(part.beforeText));
          }

          // Create the individual input field
          const subInput = document.createElement('input');
          subInput.type = 'text';
          subInput.className = 'form-control d-inline-block w-auto mx-1';
          subInput.id = `${this.formEl.id}_${i}_${idx}`;
          subInput.setAttribute('data-answer', part.correct);
          subInput.placeholder = part.placeholder || '';
          wrapper.append(subInput);

          // Feedback element for this input
          const subFeedback = document.createElement('div');
          subFeedback.className = 'invalid-feedback';
          subFeedback.textContent = 'Incorrect';
          wrapper.append(subFeedback);

          // Attach masks if needed
          if (part.correct.includes(':')) {
            new TimeMask(subInput).attach();
          } else if (part.correct.includes(',')) {
            new CommaMask(subInput).attach();
          }

          // Validation on blur
          subInput.addEventListener('blur', () => this.validate(subInput));
          // Enable/disable check button on input
          subInput.addEventListener('input', () => this.toggleCheckButton());
        });

        // Insert any text that should appear after the last input
        const lastPart = task.answerParts[task.answerParts.length - 1];
        if (lastPart.afterText) {
          wrapper.append(document.createTextNode(lastPart.afterText));
        }

        // Append the completed wrapper and move to next task
        this.formEl.appendChild(wrapper);
        return;
      }

      // 3) Fallback single-input variant
      // Optionally show hint (though not displayed in this mode)
      if (task.hint) {
        const hint = document.createElement('div');
        hint.className = 'form-text text-muted';
        hint.textContent = task.hint;
        wrapper.append(hint);
      }

      // Create a standard single input
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-control';
      input.id = `${this.formEl.id}_${i}`;
      input.setAttribute('data-answer', task.dataAnswer);
      input.placeholder = 'Enter answer here';

      // Attach masks for time or comma-separated values
      if (task.dataAnswer.includes(':')) {
        new TimeMask(input).attach();
      } else if (task.dataAnswer.includes(',')) {
        new CommaMask(input).attach();
      }

      // Validation on blur
      input.addEventListener('blur', () => this.validate(input));
      // Enable/disable check button on input
      input.addEventListener('input', () => this.toggleCheckButton());

      // Feedback element
      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = 'Incorrect';

      wrapper.append(input, feedback);
      this.formEl.appendChild(wrapper);
    });

    // Disable the check button until all fields are filled
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