import express from 'express';
import validate from 'express-validation';

import AuthController from './auth.controller.js';
import authMiddleware from './auth.middleware.js';
import { login } from './auth.validation.js';

const authCtrl = new AuthController();
const router = express.Router();

/** 
 * @route POST /api/auth/login 
 * @description Verifica o email e a senha fornecidos pelo usuário.
 *              Retorna um token JWT se as credenciais estiverem corretas.
 * @access Public
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {object} - Informações do usuário e token JWT
 */
router.route('/login')
  .post(validate(login), authCtrl.login.bind(authCtrl));

/** 
 * @route GET /api/auth/random-number Protected route,
 * @description rota protegida que retorna um número aleatório.
 *              Requer um token JWT no cabeçalho de autorização da requisição.
 * @access Protected
 * @header {string} Authorization - Token JWT
 * @returns {Object}
 */
router.route('/random-number')
  .get(authMiddleware.hasAuthorization, authCtrl.getRandomNumber);

/**
 * @route POST /api/auth/token/decode
 * @description Decodifica um token JWT e retorna as informações do usuário.
 * @access Protected
 * @header {string} Authorization - Token JWT
 * @returns {Object}
 */
router.route('/token/decode')
  .post(authMiddleware.hasAuthorization, authCtrl.tokenDecode);


export default router;
