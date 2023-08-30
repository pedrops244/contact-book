const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
  if (req.session.user) return res.render('contato', { contato: {} });
  return res.render('login');
};

/**
 *  Cria a instância 'register' e envia o body.
 *  Chama o método de validação dos dados.
 *  Em caso de erro: Salva em flash message os erros, volta para página de cadastro e exibe os erros, salvando a sessão.
 *  Caso a validação retorne true, cria o contato e exibe pro cliente o sucesso do registro.
 */
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
    req.session.save(() => res.redirect('/'));
    return idUser;
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

/**
 *  Cria a instância 'editIndex' se o usuário estiver logado.
 *  Localiza os dados do contato pelo id do usuário.
 *  Em caso de erro: É exibido uma página 404 de erro.
 *  Caso a validação retorne true, o usuário é redirecionado para página de edição.
 */
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

/**
 *  Cria a instância 'edit' com o body coletado no post.
 *  Chama o método de 'edit' do model que atualizará os dados no BD.
 *  Localiza os dados do contato pelo id do usuário.
 *  Em caso de erro: Salva em flash message os erros, volta para página do contato em edição sem modificar os dados já salvos e exibe os erros, salvando a sessão.
 *  Caso seja localizado, o usuário edita o contato, o sucesso da edição é exibido e é redirecionado para a página de contato.
 */
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

/**
 *  Cria a instância 'delete' se o usuário estiver logado.
 *  Localiza os dados do contato pelo id do usuário.
 *  Em caso de erro: É exibido uma página 404 de erro.
 *  Caso seja localizado, o usuário deleta o contato selecionado.
 */
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
