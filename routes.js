import express from 'express';
const router = express.Router();
import chamados from './database.js';

// Endpoint de Autenticação
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
  }

  let userType = 'admin';
  if (usuario.toLowerCase().includes('solicitante') || usuario.toLowerCase().includes('user')) {
    userType = 'solicitante';
  } else if (usuario.toLowerCase().includes('executor')) {
    userType = 'executor';
  }

  res.status(200).json({ userName: usuario, userType });
});

// Endpoint para obter todos os chamados
router.get('/chamados', (req, res) => {
  res.status(200).json(chamados);
});

// Endpoint para criar um novo chamado
router.post('/chamados', (req, res) => {
  const { nomePaciente, localOrigem, localDestino, leito, tipoTransporte, precisaPrecaucao, tipoPrecaucao, observacoes, solicitante } = req.body;

  const novoChamado = {
    id: Date.now().toString(), // ID único baseado no timestamp
    nomePaciente,
    localOrigem,
    localDestino,
    leito,
    tipoTransporte,
    precisaPrecaucao,
    tipoPrecaucao: precisaPrecaucao === 'sim' ? tipoPrecaucao : '',
    observacoes,
    status: 'Pendente',
    dataCriacao: new Date().toISOString(),
    solicitante
  };

  chamados.push(novoChamado);
  res.status(201).json(novoChamado);
});

// Endpoint para cancelar um chamado
router.put('/chamados/:id/cancelar', (req, res) => {
  const { id } = req.params;
  const chamado = chamados.find(c => c.id === id);

  if (!chamado) {
    return res.status(404).json({ message: 'Chamado não encontrado.' });
  }

  chamado.status = 'Cancelado';
  res.status(200).json(chamado);
});

export default router;