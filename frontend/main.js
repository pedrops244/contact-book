import './assets/css/style.css';

import Login from './modules/Login';
const login = new Login('.form-login');
login.init();

import Cadastro from './modules/Cadastro';
const cadastro = new Cadastro('.form-cadastro');
cadastro.init();

import Contato from './modules/Contato';
const contato = new Contato('.contato');
contato.init();
