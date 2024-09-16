import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
      message: 'Please use a valid email address',
    },
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
},
  {
  timestamps: true
});

/**
 * Middleware `pre` para hashear a senha antes de salvar
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  console.log('Hashing password before save'); // Verificação de debug

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully'); // Verificação de debug
    next();
  } catch (err) {
    console.error('Error hashing password:', err); // Tratamento de erro
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  console.log('Comparing password'); // Verificação de debug
  try {
    // Compara a senha usando bcrypt
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', isMatch); // Verificação de debug
    return isMatch; // Retorna true ou false
  } catch (err) {
    console.error('Error comparing password:', err); // Tratamento de erro
    throw err; // Lança o erro para ser tratado onde a função for chamada
  }
};

const User = mongoose.model('User', UserSchema);

export default User;
