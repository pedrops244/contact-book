const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    idUser: { type: String, required: false },
    criadoEm: { type: Date, default: Date.now },
  },
  { collection: 'contatos' }
);

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body, idUser) {
  this.body = body;
  this.user = idUser;
  this.errors = [];
  this.contato = null;
}

Contato.prototype.register = async function () {
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function () {
  this.cleanUp();

  // Campo nome é obrigatório
  if (!this.body.nome) this.errors.push('O campo nome é obrigatório.');
  // Email ou telefone precisam ser enviados
  if (!this.body.email && !this.body.telefone)
    this.errors.push('O campo e-mail ou telefone é obrigatório.');
  // O email precisa ser válido
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push('E-mail inválido');
};

Contato.prototype.cleanUp = function () {
  for (let key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }
  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    telefone: this.body.telefone,
    email: this.body.email,
    idUser: this.user,
  };
};

Contato.prototype.edit = async function (id) {
  if (typeof id !== 'string') return;
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Métodos estáticos
Contato.buscaPorId = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
};

Contato.buscaContatos = async function (userEmail) {
  const contatos = await ContatoModel.find({ idUser: userEmail }).sort({
    criadoEm: -1,
  });
  return contatos;
};

Contato.delete = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id });
  return contato;
};

module.exports = Contato;
