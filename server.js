import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();

// Configuração de CORS
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Função para inicializar usuários padrão no banco
async function initializeDefaultUsers() {
    const defaultUsers = [
        { usuario: 'solicitante', senha: 'solicitante123', userType: 'solicitante', userName: 'Solicitante Demo' },
        { usuario: 'executor', senha: 'executor123', userType: 'executor', userName: 'Executor Demo' },
        { usuario: 'admin', senha: 'admin123', userType: 'admin', userName: 'Administrador' }
    ];

    for (const user of defaultUsers) {
        try {
            // Verificar se o usuário já existe
            const [existing] = await pool.promise().query(
                'SELECT id FROM usuarios WHERE usuario = ?', 
                [user.usuario]
            );

            if (existing.length === 0) {
                // Criptografar a senha
                const hashedPassword = await bcrypt.hash(user.senha, 10);
                
                // Inserir usuário
                await pool.promise().query(
                    'INSERT INTO usuarios (usuario, senha, userType, userName) VALUES (?, ?, ?, ?)',
                    [user.usuario, hashedPassword, user.userType, user.userName]
                );
                
                console.log(`Usuário ${user.usuario} criado com sucesso`);
            }
        } catch (error) {
            console.error(`Erro ao criar usuário ${user.usuario}:`, error);
        }
    }
}

// Rota para listar chamados
app.get('/api/chamados', (req, res) => {
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
app.post('/api/login', async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
        }

        // Buscar usuário no banco
        const [users] = await pool.promise().query(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [usuario]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }

        const user = users[0];

        // Verificar senha
        const isValidPassword = await bcrypt.compare(senha, user.senha);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }

        res.json({
            userType: user.userType,
            userName: user.userName
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Endpoint para alteração de senha
app.post('/api/change-password', async (req, res) => {
    try {
        console.log('Requisição recebida para alteração de senha:', req.body);
        
        const { usuario, senhaAtual, novaSenha } = req.body;

        if (!usuario || !senhaAtual || !novaSenha) {
            return res.status(400).json({ 
                message: 'Todos os campos são obrigatórios' 
            });
        }

        // Buscar usuário no banco
        const [users] = await pool.promise().query(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [usuario]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                message: 'Utilizador não encontrado' 
            });
        }

        const user = users[0];

        // Verificar senha atual
        const isValidCurrentPassword = await bcrypt.compare(senhaAtual, user.senha);

        if (!isValidCurrentPassword) {
            return res.status(401).json({ 
                message: 'Senha atual incorreta' 
            });
        }

        // Verificar se a nova senha é diferente
        const isSamePassword = await bcrypt.compare(novaSenha, user.senha);
        
        if (isSamePassword) {
            return res.status(400).json({ 
                message: 'A nova senha deve ser diferente da senha atual' 
            });
        }

        // Criptografar nova senha
        const hashedNewPassword = await bcrypt.hash(novaSenha, 10);

        // Atualizar senha no banco
        await pool.promise().query(
            'UPDATE usuarios SET senha = ? WHERE usuario = ?',
            [hashedNewPassword, usuario]
        );
        
        console.log(`Senha alterada com sucesso para o usuário: ${usuario}`);
        
        res.json({ 
            message: 'Senha alterada com sucesso' 
        });

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Endpoint para logout
app.post('/api/logout', (req, res) => {
    console.log('Logout realizado');
    
    res.json({ 
        message: 'Logout realizado com sucesso' 
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    // Inicializar usuários padrão
    await initializeDefaultUsers();
    console.log('Usuários padrão inicializados');
});