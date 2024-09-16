import jwt from 'jsonwebtoken';

import config from './../config/config.js';

const authHelper = {
  buildToken: $user => {
    const userData = $user._doc ? $user._doc : $user;

    const tokenPayload = {
      _id: userData._id,
      email: userData.email,
      isActive: userData.isActive,
    };

    return jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '48h' });
  },
  generatePassCode: () => {
    return (Math.floor(Math.random() * 10000000) + 1) + ''
  }
};

export default authHelper;
