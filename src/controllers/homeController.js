const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
  if (req.session.user) {
    const contatos = await Contato.buscaContatos(req.session.user.email);
    res.render('index', { contatos });
    return;
  }
  res.render('login');
};
