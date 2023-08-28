exports.middlewareGlobal = (req, res, next) => {
  // Salvando as msgs no locals.erros e locals.sucess para uso do flash messages
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  // Salvando sessão atual
  res.locals.user = req.session.user;
  res.locals.contato = req.session.contato;
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.render('404');
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'Você precisa fazer login.');
    req.session.save(() => res.redirect('/'));
    return;
  }
  next();
};
