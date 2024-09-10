import bcrypt from 'bcrypt';
import User from './users.model.js';

// Função para registrar um novo usuário
export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).send('Usuário já existe!');

        // Gera o hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria um novo usuário
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).send('Usuário registrado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao registrar o usuário.');
    }
};

// Função para fazer login de um usuário
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Busca o usuário no banco de dados
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('Usuário não encontrado!');

        // Compara a senha fornecida com o hash armazenado
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Senha incorreta!');

        res.send('Login bem-sucedido!');
    } catch (error) {
        res.status(500).send('Erro ao fazer login.');
    }
};
