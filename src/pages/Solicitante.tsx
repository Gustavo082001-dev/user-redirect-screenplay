import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChamadosPanel from '../components/ChamadosPanel';
import ChamadoForm from '../components/ChamadoForm';

interface Chamado {
  id: string;
  nomePaciente: string;
  localOrigem: string;
  localDestino: string;
  leito: string;
  tipoTransporte: string;
  precisaPrecaucao: string;
  tipoPrecaucao?: string;
  observacoes: string;
  status: string;
  dataCriacao: string;
  solicitante: string;
}

const Solicitante = () => {
    const { userName, userKey } = useAuth();
    const [tela, setTela] = useState<"painel" | "formulario">("painel");
    const [chamados, setChamados] = useState<Chamado[]>([]);

    const carregarChamados = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/chamados');
            const data = await response.json();
            setChamados(data);
        } catch (error) {
            console.error('Erro ao carregar chamados:', error);
        }
    };

    useEffect(() => {
        carregarChamados();
    }, []);

    const handleChamadoCriado = async (novoChamado: Chamado) => {
        try {
            const response = await fetch('http://localhost:3001/api/chamados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoChamado),
            });

            if (response.ok) {
                carregarChamados();
                setTela("painel");
            }
        } catch (error) {
            console.error('Erro ao criar chamado:', error);
        }
    };

    const handleCancelarChamado = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/chamados/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'Cancelado' }),
            });

            if (response.ok) {
                carregarChamados();
            }
        } catch (error) {
            console.error('Erro ao cancelar chamado:', error);
        }
    };

    const handleNovoChamado = () => {
        setTela("formulario");
    };

    const handleVoltarPainel = () => {
        setTela("painel");
    };

    if (tela === "formulario") {
        return (
            <ChamadoForm 
                onVoltar={handleVoltarPainel}
                onChamadoCriado={handleChamadoCriado}
                usuarioLogado={userName || "Usuário"}
            />
        );
    }

    return (
        <ChamadosPanel 
            chamados={chamados}
            onNovoChamado={handleNovoChamado}
            onCancelarChamado={handleCancelarChamado}
            usuarioLogado={userName || "Usuário"}
            userKey={userKey || "solicitante"}
        />
    );
};

export default Solicitante;