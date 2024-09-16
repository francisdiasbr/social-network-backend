import httpStatus from 'http-status';
import User from '../user/user.model.js';
import { saveUser } from '../user/user.service.js';
import authHelper from '../helpers/authHelper.js';
import APIError from '../helpers/APIError.js';

class AuthController {
  async authorizeLogin(err, user, req, res, next) {
    console.log('Iniciando a autorização de login');
  
    const apiError = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  
    if (err) {
      console.error('Erro ao buscar o usuário:', err);
      return next(err);
    }
  
    if (!user) {
      console.warn('Usuário não encontrado:', req.body.email);
      return next(apiError);
    }
  
    console.log('Usuário encontrado:', user.email);
  
    try {
      // Verifica a senha usando o método comparePassword
      const isMatch = await user.comparePassword(req.body.password);
      console.log('Comparando a senha para o user:', user.email);
  
      if (isMatch) {
        // Retorna a informação incluindo o token como JSON
        return res.json({
          valid: true,
          user: {
            _id: user._id,
            email: user.email,
            isActive: user.isActive,
          },
          token: authHelper.buildToken(user),
        });
      }
  
      // Senha não corresponde
      return next(apiError);
    } catch (errr) {
      console.error('Erro ao comparar a senha:', errr);
      return next(errr);
    }
  }

  async login(req, res, next) {
    try {
      const person = await User.findOne({
        email: req.body.email,
        isActive: true,
      });

      return this.authorizeLogin(null, person, req, res, next);
    } catch (err) {
      return this.authorizeLogin(err, null, req, res, next);
    }
  }

  getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
      user: req.user,
      num: Math.random() * 100
    });
  }

  tokenDecode(req, res) {
    return res.json({
      user: req.user
    });
  }

  savePerson(user, req, res, next) {
    const newUser = new User({
      ...user,
      isAdmin: false,
      isActive: true
    });

    return saveUser(newUser, req, res, next);
  }
}

export default AuthController;
