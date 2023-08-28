const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
  if (req.session.user) return res.render('contato', { contato: {} });
  return res.render('login');
};

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body, req.session.user.email);
    await contato.register();
    let idUser = null;

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() =>
        res.render('contato', {
          body: req.body,
          errors: contato.errors,
        })
      );
      return;
    }
    req.flash('success', 'Contato registrado com sucesso.');
    idUser = contato.contato._id;
    req.session.save(() =>
      res.redirect(`/contato/index/${contato.contato._id}`)
    );
    return idUser;
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.editIndex = async (req, res) => {
  try {
    if (req.session.user) {
      if (!req.params.id) res.render('404');
      const contato = await Contato.buscaPorId(req.params.id);
      if (!contato) res.render('404');
      idUser = contato._id;
      req.session.contato = {
        _id: idUser || '',
        nome: contato.nome,
        sobrenome: contato.sobrenome,
        telefone: contato.telefone,
        email: contato.email,
        idUser: contato.idUser,
      };

      return res.render('contato', { contato });
    }
    return res.render('login');
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.edit = async function (req, res) {
  try {
    if (req.session.user) {
      if (!req.params.id) res.render('404');
      const contato = new Contato(req.body, req.session.user.email);
      await contato.edit(req.params.id);
      idUser = req.params.id;

      if (contato.errors.length > 0) {
        req.flash('errors', contato.errors);
        req.session.contato = {
          _id: idUser,
          nome: contato.nome,
          sobrenome: contato.sobrenome,
          telefone: contato.telefone,
          email: contato.email,
          idUser: contato.idUser,
        };

        req.session.save(() =>
          res.render('contato/index', {
            body: req.session.contato,
            errors: contato.errors,
          })
        );
        req.session.contato._id = idUser;
        return;
      }
      req.flash('success', 'Contato editado com sucesso');
      idUser = contato.contato._id;
      req.session.save(() =>
        res.redirect(`/contato/index/${contato.contato._id}`)
      );
      return;
    }
    return res.render('login');
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.delete = async function (req, res) {
  try {
    if (req.session.user) {
      if (!req.params.id) res.render('404');

      const contato = await Contato.delete(req.params.id);
      if (!contato) res.render('404');

      req.flash('success', 'Contato exluído com sucesso');
      req.session.save(() => res.redirect(`back`));
      return;
    }
    return res.render('login');
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};
