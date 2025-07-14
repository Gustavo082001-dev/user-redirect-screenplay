import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  LogOut,
  TrendingUp,
  Activity,
  UserCheck,
  Wrench
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  // Dados simulados do dashboard
  const estatisticas = {
    totalChamados: 156,
    chamadosAbertos: 23,
    chamadosAndamento: 8,
    chamadosConcluidos: 125,
    usuariosAtivos: 45,
    executoresAtivos: 12,
    tempoMedioResolucao: "2.5 horas"
  };

  const chamadosRecentes = [
    {
      id: "001",
      titulo: "Computador não liga",
      solicitante: "Maria Silva",
      executor: "João Técnico",
      status: "Em andamento",
      prioridade: "Alta",
      categoria: "Hardware",
      dataAbertura: "2024-01-16 09:30",
    },
    {
      id: "002",
      titulo: "Configuração de email",
      solicitante: "Carlos Oliveira",
      executor: "Ana Suporte",
      status: "Concluído",
      prioridade: "Média",
      categoria: "Software",
      dataAbertura: "2024-01-16 08:15",
    },
    {
      id: "003",
      titulo: "Problema na rede WiFi",
      solicitante: "Pedro Santos",
      executor: "Não atribuído",
      status: "Aguardando",
      prioridade: "Alta",
      categoria: "Rede",
      dataAbertura: "2024-01-16 07:45",
    },
    {
      id: "004",
      titulo: "Acesso ao sistema",
      solicitante: "Ana Costa",
      executor: "Carlos Admin",
      status: "Concluído",
      prioridade: "Baixa",
      categoria: "Acesso",
      dataAbertura: "2024-01-15 16:20",
    },
  ];

  const usuarios = [
    {
      id: 1,
      nome: "Maria Silva",
      tipo: "Solicitante",
      departamento: "Financeiro",
      chamadosAbertos: 2,
      ultimoAcesso: "2024-01-16 10:30",
      status: "Ativo"
    },
    {
      id: 2,
      nome: "João Técnico",
      tipo: "Executor",
      departamento: "TI",
      chamadosAtribuidos: 5,
      ultimoAcesso: "2024-01-16 11:15",
      status: "Ativo"
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      tipo: "Solicitante",
      departamento: "RH",
      chamadosAbertos: 1,
      ultimoAcesso: "2024-01-16 09:45",
      status: "Ativo"
    },
    {
      id: 4,
      nome: "Ana Suporte",
      tipo: "Executor",
      departamento: "TI",
      chamadosAtribuidos: 3,
      ultimoAcesso: "2024-01-16 10:50",
      status: "Ativo"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "Em andamento":
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-success/10 text-success border-success/20";
      case "Em andamento":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Média":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-success/10 text-success border-success/20";
    }
  };

  const getTipoUsuarioColor = (tipo: string) => {
    switch (tipo) {
      case "Executor":
        return "bg-primary/10 text-primary border-primary/20";
      case "Administrador":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-accent/50 text-accent-foreground border-accent";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-accent/10">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Painel Administrativo</h1>
                <p className="text-sm text-muted-foreground">Visão geral dos chamados e usuários</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-medium border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Chamados</p>
                  <p className="text-2xl font-bold text-foreground">{estatisticas.totalChamados}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                  <p className="text-2xl font-bold text-foreground">{estatisticas.chamadosAndamento}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold text-foreground">{estatisticas.chamadosConcluidos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Users className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-foreground">{estatisticas.usuariosAtivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="chamados" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-soft border-0">
            <TabsTrigger value="chamados" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Gerenciar Chamados
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Gerenciar Usuários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chamados" className="space-y-6">
            <Card className="shadow-medium border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Chamados Recentes</span>
                </CardTitle>
                <CardDescription>
                  Visão geral dos chamados mais recentes no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chamadosRecentes.map((chamado, index) => (
                    <div key={chamado.id} className={`p-4 rounded-lg border bg-background/30 ${index < chamadosRecentes.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              #{chamado.id}
                            </span>
                            <Badge variant="outline" className={getStatusColor(chamado.status)}>
                              {getStatusIcon(chamado.status)}
                              <span className="ml-1">{chamado.status}</span>
                            </Badge>
                            <Badge variant="outline" className={getPrioridadeColor(chamado.prioridade)}>
                              {chamado.prioridade}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-foreground mb-1">
                            {chamado.titulo}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <span>Solicitante: {chamado.solicitante}</span>
                            <span>Executor: {chamado.executor}</span>
                            <span>Categoria: {chamado.categoria}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Aberto em {chamado.dataAbertura}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-6">
            <Card className="shadow-medium border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  <span>Usuários do Sistema</span>
                </CardTitle>
                <CardDescription>
                  Gerenciamento de usuários e suas permissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usuarios.map((usuario, index) => (
                    <div key={usuario.id} className={`p-4 rounded-lg border bg-background/30 ${index < usuarios.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-foreground">
                              {usuario.nome}
                            </h4>
                            <Badge variant="outline" className={getTipoUsuarioColor(usuario.tipo)}>
                              {usuario.tipo === "Executor" ? <Wrench className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                              {usuario.tipo}
                            </Badge>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              {usuario.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <span>Departamento: {usuario.departamento}</span>
                            <span>
                              {usuario.tipo === "Executor" 
                                ? `Chamados atribuídos: ${usuario.chamadosAtribuidos}` 
                                : `Chamados abertos: ${usuario.chamadosAbertos}`
                              }
                            </span>
                            <span>Último acesso: {usuario.ultimoAcesso}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;