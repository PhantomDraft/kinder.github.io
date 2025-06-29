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

  /** Renders tasks: [{text, dataAnswer, options}] */
  load(tasks) {
    this.formEl.innerHTML = '';
    tasks.forEach((task, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'mb-3';

      // ----- Checkbox style -----
      if (task.options) {
        const q = document.createElement('div');
        q.className = 'form-label';
        q.textContent = `${i + 1}. ${task.text}`;
        wrapper.appendChild(q);

        const groupId = `${this.formEl.id}_${i}`;
        wrapper.setAttribute('data-checkbox-group', groupId);

        task.options.forEach((opt, j) => {
          const formCheck = document.createElement('div');
          formCheck.className = 'form-check form-check-inline';

          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.className = 'form-check-input';
          cb.id = `${groupId}_${j}`;
          cb.dataset.group = groupId;
          if (opt.correct) cb.dataset.correct = 'true';
          cb.addEventListener('change', () => {
            this.validateCheckboxGroup(wrapper);
            this.toggleCheckButton();
          });

          const lbl = document.createElement('label');
          lbl.className = 'form-check-label';
          lbl.htmlFor = cb.id;
          lbl.textContent = opt.text || opt;

          formCheck.append(cb, lbl);
          wrapper.appendChild(formCheck);
        });

        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = 'Incorrect answer';
        wrapper.appendChild(feedback);
        this.formEl.appendChild(wrapper);
        return;
      }

      // ----- Text input style -----
      const label = document.createElement('label');
      label.className = 'form-label';
      label.htmlFor = `${this.formEl.id}_${i}_0`;

      const answers = (task.dataAnswer || '').split(/[;,]/).map(s => s.trim());
      let ansIdx = 0;

      const addInput = () => {
        const container = document.createElement('span');
        container.className = 'd-inline-flex align-items-center mx-1';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.style.width = 'auto';
        input.id = `${this.formEl.id}_${i}_${ansIdx}`;
        input.setAttribute('data-answer', answers[ansIdx] || '');
        input.placeholder = task.showPlaceholder ? (answers[ansIdx] || '') : '';

        if ((answers[ansIdx] || '').includes(':')) {
          new TimeMask(input).attach();
        } else if ((answers[ansIdx] || '').includes(',')) {
          new CommaMask(input).attach();
        }

        input.addEventListener('blur', () => this.validate(input));
        input.addEventListener('input', () => this.toggleCheckButton());

        container.appendChild(input);

        if (Array.isArray(task.signs)) {
          task.signs.forEach(s => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-outline-secondary btn-sm ms-1';
            btn.textContent = s;
            btn.addEventListener('click', () => {
              input.value = s;
              input.dispatchEvent(new Event('input'));
              input.focus();
            });
            container.appendChild(btn);
          });
        }

        ansIdx++;
        return container;
      };

      const lines = task.text.split('\n');
      lines.forEach((line, li) => {
        if (li > 0) label.appendChild(document.createElement('br'));
        const parts = line.split(/(_{2,})/);
        parts.forEach(part => {
          if (/^_{2,}$/.test(part)) {
            label.appendChild(addInput());
          } else {
            label.appendChild(document.createTextNode(part));
          }
        });
      });

      wrapper.appendChild(label);

      // If no placeholders were processed, append single input below
      if (ansIdx === 0) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.id = `${this.formEl.id}_${i}_0`;
        input.setAttribute('data-answer', task.dataAnswer);
        if (task.dataAnswer.includes(':')) {
          new TimeMask(input).attach();
        } else if (task.dataAnswer.includes(',')) {
          new CommaMask(input).attach();
        }
        input.placeholder = '';
        input.addEventListener('blur', () => this.validate(input));
        input.addEventListener('input', () => this.toggleCheckButton());
        wrapper.appendChild(input);
      }

      if (task.hint) {
        const hint = document.createElement('div');
        hint.className = 'form-text text-muted';
        hint.textContent = task.hint;
        wrapper.appendChild(hint);
      }

      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = 'Incorrect answer';
      wrapper.appendChild(feedback);
      this.formEl.appendChild(wrapper);
    });

    this.btn.disabled = true;
  }

  validateCheckboxGroup(wrapper) {
    const boxes = wrapper.querySelectorAll('input[type="checkbox"]');
    let ok = true;

    // First pass: figure out overall correctness
    boxes.forEach(box => {
      const shouldBeChecked = box.dataset.correct === 'true';
      if (box.checked !== shouldBeChecked) ok = false;
    });

    // Second pass: style each box only if they actually clicked it
    boxes.forEach(box => {
      const shouldBeChecked = box.dataset.correct === 'true';
      // correct & checked → green, incorrect & checked → red
      box.classList.toggle('is-valid', box.checked && shouldBeChecked);
      box.classList.toggle('is-invalid', box.checked && !shouldBeChecked);
    });

    // show or hide the “Incorrect answer” message
    const feedback = wrapper.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.style.display = ok ? 'none' : 'block';
    }

    return ok;
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
    const textInputs = this.formEl.querySelectorAll('input[type="text"][data-answer]');
    const textOk = Array.from(textInputs).every(input => this.validate(input));

    const groups = this.formEl.querySelectorAll('[data-checkbox-group]');
    const cbOk = Array.from(groups).every(g => this.validateCheckboxGroup(g));

    return textOk && cbOk;
  }

  /** Enable the check button only when all fields are non-empty */
  toggleCheckButton() {
    const textInputs = this.formEl.querySelectorAll('input[type="text"][data-answer]');
    const textFilled = Array.from(textInputs).every(input => input.value.trim() !== '');

    const groups = this.formEl.querySelectorAll('[data-checkbox-group]');
    const cbFilled = Array.from(groups).every(g => {
      const boxes = g.querySelectorAll('input[type="checkbox"]');
      return Array.from(boxes).some(b => b.checked);
    });

    this.btn.disabled = !(textFilled && cbFilled);
  }
}