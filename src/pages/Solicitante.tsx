import { useState } from "react";
import { useLocation } from "react-router-dom";
import ChamadosPanel from "@/components/ChamadosPanel";
import ChamadoForm from "@/components/ChamadoForm";

interface Chamado {
  id: string;
  nomePaciente: string;
  localOrigemm: string;
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
  const location = useLocation();
  const usuarioLogado = location.state?.userName || "Usuário";
  
  const [tela, setTela] = useState<"painel" | "formulario">("painel");
  const [chamados, setChamados] = useState<Chamado[]>([
    // Dados de exemplo
    {
      id: "1703001234567",
      nomePaciente: "Maria Santos",
      localOrigemm: "uti",
      localDestino: "centro-cirurgico",
      leito: "15A",
      tipoTransporte: "maca",
      precisaPrecaucao: "sim",
      tipoPrecaucao: "Isolamento por contato",
      observacoes: "Paciente com mobilidade reduzida",
      status: "Pendente",
      dataCriacao: "20/12/2024 14:30",
      solicitante: usuarioLogado
    },
    {
      id: "1703001234568",
      nomePaciente: "João Silva",
      localOrigemm: "enfermaria",
      localDestino: "radiologia",
      leito: "203B",
      tipoTransporte: "cadeira-rodas",
      precisaPrecaucao: "nao",
      observacoes: "Exame de rotina",
      status: "Em Transporte",
      dataCriacao: "20/12/2024 13:15",
      solicitante: usuarioLogado
    },
    {
      id: "1703001234569",
      nomePaciente: "Ana Costa",
      localOrigemm: "pronto-socorro",
      localDestino: "laboratorio",
      leito: "01",
      tipoTransporte: "maca",
      precisaPrecaucao: "sim",
      tipoPrecaucao: "Isolamento respiratório",
      observacoes: "Urgente - coleta de exames",
      status: "Concluído",
      dataCriacao: "20/12/2024 12:00",
      solicitante: "Dr. Carlos"
    }
  ]);

  const handleNovoChamado = () => {
    setTela("formulario");
  };

  const handleVoltarPainel = () => {
    setTela("painel");
  };

  const handleChamadoCriado = (novoChamado: Chamado) => {
    setChamados(prev => [novoChamado, ...prev]);
  };

  const handleCancelarChamado = (id: string) => {
    setChamados(prev => 
      prev.map(chamado => 
        chamado.id === id 
          ? { ...chamado, status: "Cancelado" }
          : chamado
      )
    );
  };

  if (tela === "formulario") {
    return (
      <ChamadoForm 
        onVoltar={handleVoltarPainel}
        onChamadoCriado={handleChamadoCriado}
        usuarioLogado={usuarioLogado}
      />
    );
  }

  return (
    <ChamadosPanel 
      chamados={chamados}
      onNovoChamado={handleNovoChamado}
      onCancelarChamado={handleCancelarChamado}
      usuarioLogado={usuarioLogado}
    />
  );
};

export default Solicitante;