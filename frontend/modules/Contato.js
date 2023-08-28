import validator from 'validator';
export default class Contato {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }
  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const erros = document.querySelectorAll('.error-text');
    for (let p of erros) {
      p.remove();
    }

    const el = e.target;
    const nomeInput = el.querySelector('input[name="nome"]');
    const emailInput = el.querySelector('input[name="email"]');
    const telInput = el.querySelector('input[name="telefone"]');
    let valid = true;
    if (!validator.isEmail(emailInput.value)) {
      this.criaErro(emailInput, 'Email inválido');
      valid = false;
    }
    if (!nomeInput.value) {
      this.criaErro(nomeInput, 'Nome precisa ser preenchido');
      valid = false;
    }
    if (!telInput.value) {
      this.criaErro(telInput, 'Telefone precisa ser preenchido');
      valid = false;
    }

    // Se não houver erros, permite que o formulário seja enviado.
    if (valid) el.submit();
  }
  criaErro(campo, msg) {
    const p = document.createElement('p');
    p.innerHTML = msg;
    p.classList.add('error-text');
    campo.insertAdjacentElement('afterend', p);
  }
}
