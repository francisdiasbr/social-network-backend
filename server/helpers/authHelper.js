import jwt from 'jsonwebtoken';

import config from './../config/config.js';

const authHelper = {
  buildToken: $user => {
    // console.log('user', $user);
    const user = $user._doc ? $user._doc : $user;
    const {picture, ...otherUserProps} = (user || {});
    return jwt.sign({
      ...otherUserProps
    }, config.jwtSecret, {
      expiresIn: '48h'
    });
  },
  generatePassCode: () => {
    return (Math.floor(Math.random() * 10000000) + 1) + ''
  }
};

export default authHelper;
