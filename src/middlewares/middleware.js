exports.middlewareGlobal = (req, res, next) => {
  // Salvando as msgs no locals.erros e locals.sucess para uso do flash messages.
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  // Salvando sessão atual.
  res.locals.user = req.session.user;
  res.locals.contato = req.session.contato;
  next();
};

// Verificando o token csrf.
exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.render('404');
  }
  next();
};

// Enviando o csrf token a todas as rotas.
exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

// Verificando se o usuário está logado, caso contrário é exibido um erro e é redirecionado para página de login.
exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'Você precisa fazer login.');
    req.session.save(() => res.redirect('/'));
    return;
  }
  next();
};
