const mongoose = require('mongoose');
const validator = require('validator');

// Criação do Schema (Dados e regras para os dados)
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

// Criação do model.
const ContatoModel = mongoose.model('Contato', ContatoSchema);

// Função construtora que tratará os dados.
function Contato(body, idUser) {
  this.body = body;
  this.user = idUser;
  this.errors = [];
  this.contato = null;
}

/**
 * Método que cadastra e valida o contato em async por se tratar de gravação em Bando de Dados.
 * Em caso de erro (errors.length > 0): Não permite a gravação no BD.
 * Caso não tenha erros, retorna para a chave this.contato: a criação do contato em await.
 */
Contato.prototype.register = async function () {
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

/**
 * Método que verifica se os campos enviados estão respeitando suas respectivas regras.
 */
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

/**
 * Método que percorre cada chave e valida se os valores enviados são strings.
 * Garante que seja enviado somente os campos necessários para validação do model e exclui os outros dados como csrf token.
 */
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

/**
 * Método de edição do contato
 * Se o ID for diferente de uma string não é realizado a busca e/ou edição.
 * Em caso de erro (errors.length > 0): Não permite gravação em BD.
 * Realiza as validações através do método valida().
 * Caso o ID seja localizado no BD, ele é editado na chave 'contato' através do método findByIdAndUpdate.
 */
Contato.prototype.edit = async function (id) {
  if (typeof id !== 'string') return;
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Métodos estáticos

/**
 * Método que recebe e localiza o contato pelo paramêtro id do contatoController.
 * Se o ID for diferente de uma string não é realizado a busca.
 * Caso o ID seja localizado no BD, ele é salvo na chave 'id' através do método findById.
 */
Contato.buscaPorId = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
};

/**
 * Método que localiza e lista os contatos ordenados por data de criação.
 */
Contato.buscaContatos = async function (userEmail) {
  const contatos = await ContatoModel.find({ idUser: userEmail }).sort({
    criadoEm: -1,
  });
  return contatos;
};

/**
 * Se o ID for diferente de uma string não é realizado a busca e/ou exclusão.
 * Caso o ID seja localizado no BD, ele é deletado através do método findOneAndDelete.
 */
Contato.delete = async function (id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id });
  return contato;
};

module.exports = Contato;
