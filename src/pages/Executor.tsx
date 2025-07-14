import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  LogOut, 
  Settings, 
  MessageSquare,
  Play,
  Pause,
  Check
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Executor = () => {
  const navigate = useNavigate();
  const [comentario, setComentario] = useState("");

  // Simulação de chamados para execução
  const [chamados, setChamados] = useState([
    {
      id: "001",
      titulo: "Computador não liga",
      descricao: "Computador da sala 201 não está ligando. Já tentaram trocar o cabo de força.",
      solicitante: "Maria Silva",
      categoria: "Hardware",
      prioridade: "Alta",
      status: "Em andamento",
      dataAbertura: "2024-01-15",
      tempoEstimado: "2 horas",
    },
    {
      id: "002",
      titulo: "Configuração de email",
      descricao: "Novo funcionário precisa de configuração de email corporativo no Outlook.",
      solicitante: "João Santos",
      categoria: "Software",
      prioridade: "Média",
      status: "Aguardando",
      dataAbertura: "2024-01-16",
      tempoEstimado: "30 minutos",
    },
    {
      id: "003",
      titulo: "Problema na rede WiFi",
      descricao: "Funcionários relatam instabilidade na conexão WiFi do 3º andar.",
      solicitante: "Carlos Oliveira",
      categoria: "Rede",
      prioridade: "Alta",
      status: "Aguardando",
      dataAbertura: "2024-01-14",
      tempoEstimado: "1 hora",
    },
  ]);

  const handleIniciarChamado = (id: string) => {
    setChamados(prev => prev.map(chamado => 
      chamado.id === id 
        ? { ...chamado, status: "Em andamento" }
        : chamado
    ));
    toast({
      title: "Chamado iniciado",
      description: `Chamado #${id} foi marcado como em andamento.`,
    });
  };

  const handleConcluirChamado = (id: string) => {
    if (!comentario.trim()) {
      toast({
        variant: "destructive",
        title: "Comentário obrigatório",
        description: "Adicione um comentário sobre a resolução do chamado.",
      });
      return;
    }

    setChamados(prev => prev.map(chamado => 
      chamado.id === id 
        ? { ...chamado, status: "Concluído" }
        : chamado
    ));
    
    toast({
      title: "Chamado concluído",
      description: `Chamado #${id} foi marcado como concluído.`,
    });
    setComentario("");
  };

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

  const chamadosEmAndamento = chamados.filter(c => c.status === "Em andamento");
  const chamadosAguardando = chamados.filter(c => c.status === "Aguardando");
  const chamadosConcluidos = chamados.filter(c => c.status === "Concluído");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-accent/10">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Portal do Executor</h1>
                <p className="text-sm text-muted-foreground">Visualização e execução de chamados</p>
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
        <Tabs defaultValue="pendentes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-soft border-0">
            <TabsTrigger value="pendentes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Pendentes ({chamadosAguardando.length})
            </TabsTrigger>
            <TabsTrigger value="andamento" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Em Andamento ({chamadosEmAndamento.length})
            </TabsTrigger>
            <TabsTrigger value="concluidos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Concluídos ({chamadosConcluidos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes" className="space-y-4">
            {chamadosAguardando.map((chamado) => (
              <Card key={chamado.id} className="shadow-medium border-0 bg-gradient-card">
                <CardHeader className="pb-4">
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
                      <CardTitle className="text-lg">{chamado.titulo}</CardTitle>
                      <CardDescription className="mt-1">
                        Solicitante: {chamado.solicitante} • {chamado.categoria} • Tempo estimado: {chamado.tempoEstimado}
                      </CardDescription>
                    </div>
                    <Button
                      variant="default"
                      onClick={() => handleIniciarChamado(chamado.id)}
                      className="ml-4"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{chamado.descricao}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Aberto em {chamado.dataAbertura}
                  </p>
                </CardContent>
              </Card>
            ))}
            {chamadosAguardando.length === 0 && (
              <Card className="shadow-medium border-0 bg-gradient-card">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum chamado pendente</h3>
                    <p className="text-muted-foreground">Todos os chamados estão sendo processados!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="andamento" className="space-y-4">
            {chamadosEmAndamento.map((chamado) => (
              <Card key={chamado.id} className="shadow-medium border-0 bg-gradient-card border-l-4 border-l-warning">
                <CardHeader className="pb-4">
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
                      <CardTitle className="text-lg">{chamado.titulo}</CardTitle>
                      <CardDescription className="mt-1">
                        Solicitante: {chamado.solicitante} • {chamado.categoria}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground">{chamado.descricao}</p>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`comentario-${chamado.id}`}>
                        Adicionar comentário de resolução
                      </Label>
                      <Textarea
                        id={`comentario-${chamado.id}`}
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Descreva as ações realizadas para resolver o chamado..."
                        rows={3}
                        className="shadow-soft"
                      />
                    </div>
                    <Button
                      variant="hero"
                      onClick={() => handleConcluirChamado(chamado.id)}
                      className="w-full"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Concluir Chamado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {chamadosEmAndamento.length === 0 && (
              <Card className="shadow-medium border-0 bg-gradient-card">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Pause className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum chamado em andamento</h3>
                    <p className="text-muted-foreground">Inicie um chamado pendente para começar a trabalhar!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="concluidos" className="space-y-4">
            {chamadosConcluidos.map((chamado) => (
              <Card key={chamado.id} className="shadow-medium border-0 bg-gradient-card border-l-4 border-l-success">
                <CardHeader>
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
                      <CardTitle className="text-lg">{chamado.titulo}</CardTitle>
                      <CardDescription className="mt-1">
                        Solicitante: {chamado.solicitante} • {chamado.categoria}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{chamado.descricao}</p>
                </CardContent>
              </Card>
            ))}
            {chamadosConcluidos.length === 0 && (
              <Card className="shadow-medium border-0 bg-gradient-card">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum chamado concluído</h3>
                    <p className="text-muted-foreground">Os chamados concluídos aparecerão aqui!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Executor;