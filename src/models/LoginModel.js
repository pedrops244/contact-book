const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

// Criação do Schema (Dados e regras para os dados)
const LoginSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    nome: { type: String, required: true },
  },
  { collection: 'users' }
);

// Criação do model.
const LoginModel = mongoose.model('Login', LoginSchema);

// Classe construtora que tratará os dados.
class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  /**
   * Método de login do usuário em async por se tratar de gravação em Bando de Dados.
   * Em caso de erro (errors.length > 0): Não permite a gravação no BD.
   * Usa do método validaSignin para limpar e validar os dados.
   * Decriptação da senha e comparação da mesma salva no BD.
   * Caso o usuário exista no BD, ele é salvo na chave 'this.user'.
   */
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

  /**
   * Método de registro do usuário em async por se tratar de gravação em Bando de Dados.
   * Em caso de erro (errors.length > 0): Não permite a gravação no BD.
   * Usa do método validaSignin para limpar e validar os dados.
   * Usa o método userExists para checar se o usuário existe.
   * Adiciona hash a senha criada pelo usuário através do genSaltSync (bcrypt).
   * Caso todas as validações retornem true, o usuário é criado e salvo no BD.
   */
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

  /**
   * Método que valida se os campos enviados no cadastro do usuário estão respeitando suas respectivas regras.
   */
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

  /**
   * Método que valida se o campo enviado no login está respeitando sua respectiva regra.
   */
  validaSignin() {
    this.cleanUp();
    // E-mail precisa ser preenchido e válido
    if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido');
  }

  /**
   * Método que percorre cada chave e valida se os valores enviados são strings.
   * Garante que seja enviado somente os campos necessários para validação do model e exclui os outros dados como csrf token.
   */
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
