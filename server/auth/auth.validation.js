import Joi from 'joi';

export const login = {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }