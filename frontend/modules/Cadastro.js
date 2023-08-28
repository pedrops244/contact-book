import validator from 'validator';
export default class Cadastro {
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
    const emailInput = el.querySelector('input[name="email"]');
    const nomeInput = el.querySelector('input[name="nome"]');
    const passInput = el.querySelector('input[name="password"]');
    let valid = true;
    if (!validator.isEmail(emailInput.value)) {
      this.criaErro(emailInput, 'Email inválido');
      valid = false;
    }
    if (!nomeInput.value) {
      this.criaErro(nomeInput, 'Nome precisa ser preenchido');
      valid = false;
    }
    if (passInput.value.length < 6 || passInput.value.length > 20) {
      this.criaErro(passInput, 'A senha precisa ter entre 6 e 20 caracteres');
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
