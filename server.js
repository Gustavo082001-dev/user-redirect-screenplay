import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Rota para listar chamados
app.get('/api/chamados', (req, res) => {
    // Rota GET /api/chamados
    pool.query('SELECT * FROM chamados ORDER BY dataCriacao DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar chamados:', err);
            res.status(500).json({ error: 'Erro ao buscar chamados' });
            return;
        }
        res.json(results);
    });
});

// Rota para criar chamado
app.post('/api/chamados', (req, res) => {
    const chamado = req.body;
    pool.query('INSERT INTO chamados SET ?', chamado, (err, results) => {
        if (err) {
            console.error('Erro ao criar chamado:', err);
            res.status(500).json({ error: 'Erro ao criar chamado' });
            return;
        }
        res.status(201).json({ message: 'Chamado criado com sucesso', id: results.insertId });
    });
});

// Rota para atualizar status do chamado
app.put('/api/chamados/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    pool.query('UPDATE chamados SET status = ? WHERE id = ?', [status, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar chamado:', err);
            res.status(500).json({ error: 'Erro ao atualizar chamado' });
            return;
        }
        res.json({ message: 'Chamado atualizado com sucesso' });
    });
});

// Rota de login
app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body;

    // Usuários de demonstração
    const users = {
        'solicitante': { senha: 'solicitante123', userType: 'solicitante', userName: 'Solicitante Demo' },
        'executor': { senha: 'executor123', userType: 'executor', userName: 'Executor Demo' },
        'admin': { senha: 'admin123', userType: 'admin', userName: 'Administrador' }
    };

    const user = users[usuario];

    if (!user || user.senha !== senha) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    res.json({
        userType: user.userType,
        userName: user.userName
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});