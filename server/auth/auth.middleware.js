import jwt from 'jsonwebtoken';

import config from '../config/config.js';

  function hasAuthorization(param, req, res, next, requiresAdmin) {
    console.log('Autorização iniciada com o token:', param); // Log inicial
  
    if (param) {
      jwt.verify(param, config.jwtSecret, (err, decoded) => {
        if (err) {
          console.error('Erro na verificação do token JWT:', err);
          return res.sendStatus(403);
        }
  
        if (requiresAdmin && decoded && !decoded.isAdmin) {
          console.warn('Token JWT válido, mas o usuário não é administrador.');
          return res.sendStatus(403);
        }
  
        console.log('Token JWT verificado com sucesso:', decoded);
        req.user = decoded;
        next();
      });
    } else {
      console.warn('Token JWT ausente.');
      return res.sendStatus(403);
    }
  }
  

const authMiddleware = {

  hasAuthorization(req, res, next) {
    return hasAuthorization(req.headers.authorization, req, res, next);
  },

  hasBodyAuthorization(req, res, next) {
    return hasAuthorization(req.body.token, req, res, next);
  },

  isAdministrator(req, res, next) {
    return hasAuthorization(req.headers.authorization, req, res, next, true);
  },

  removeFrameguard(req, res, next) {
    res.removeHeader('X-Frame-Options');
    next();
  }
};

export default authMiddleware;
