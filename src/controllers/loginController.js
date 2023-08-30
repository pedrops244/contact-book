const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  if (req.session.user) return res.render('login-logado');
  return res.render('login');
};

/**
 *  Cria a instância 'register' e envia o body.
 *  Chama o método de validação dos dados.
 *  Em caso de erro: Salva em flash message os erros, volta para página de cadastro e exibe os erros, salvando a sessão.
 *  Caso a validação retorne true, cria o usuário e exibe pro cliente o sucesso do registro.
 */
exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('/login/index');
      });
      return;
    }

    req.flash('success', 'Seu usuário foi criado com sucesso');
    req.session.save(function () {
      return res.redirect('/login/index');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

/**
 *  Cria a instância 'login' e envia o body.
 *  Chama o método de validação dos dados.
 *  Em caso de erro: Salva em flash message os erros, volta para página de login e exibe os erros, salvando a sessão.
 *  Caso a validação retorne true, o usuário loga no sistema e é redirecionado para proxima página.
 */
exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('/login/index');
      });
      return;
    }

    req.flash('success', 'Você entrou no sistema.');
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect('/');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

/**
 *  Cria a instância 'logout'
 *  Quando usuário desloga, a sessão é destruida e o usuário é redirecionado para pagina de login novamente.
 */
exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/');
};
