import authHelper from '../helpers/authHelper.js';

export const saveUser = async (newUser, req, res, next) => {
  try {
    newUser.email = newUser.email.trim().toLowerCase();

    const user = await newUser.save();

    res.json({
      ok: true,
      valid: true,
      user,
      token: authHelper.buildToken(user),
    });

  } catch (err) {
    if (typeof err === 'object' && (err.code === 11000 || err.code === 11001)) {
      err.message = `${req.body.email.trim().toLowerCase()} already in use`;
    }

    next(err);
  }
};