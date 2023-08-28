const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    nome: { type: String, required: true },
  },
  { collection: 'users' }
);

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.validaSignin();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida.');
      this.user = null;
      return;
    }
  }

  async register() {
    this.validaSignup();
    if (this.errors.length > 0) return;

    await this.userExists();

    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }
  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user)
      this.errors.push('Este e-mail já está sendo usado por outro usuário.');
  }

  validaSignup() {
    this.cleanUp();
    // Nome precisa ser preenchido
    if (!this.body.nome) this.errors.push('Nome precisa ser preenchido');
    // O email precisa ser válido
    if (!validator.isEmail(this.body.email))
      this.errors.push('E-mail inválido');

    // A senha precisa ter 6 - 20 caracteres
    if (this.body.password.length < 6 || this.body.password.length > 20)
      this.errors.push('A senha precisa ter entre 6 e 20 caracteres.');
  }
  validaSignin() {
    this.cleanUp();
    // E-mail precisa ser preenchido e válido
    if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido');
  }
  cleanUp() {
    for (let key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      nome: this.body.nome,
      email: this.body.email,
      password: this.body.password,
    };
  }
}
module.exports = Login;
