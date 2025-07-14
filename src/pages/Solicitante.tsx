import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Send, Clock, CheckCircle, AlertTriangle, LogOut, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Solicitante = () => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [categoria, setCategoria] = useState("");
  const navigate = useNavigate();

  // Simulação de chamados já criados
  const [chamados] = useState([
    {
      id: "001",
      titulo: "Computador não liga",
      status: "Em andamento",
      prioridade: "Alta",
      dataAbertura: "2024-01-15",
    },
    {
      id: "002",
      titulo: "Problema na impressora",
      status: "Concluído",
      prioridade: "Média",
      dataAbertura: "2024-01-10",
    },
    {
      id: "003",
      titulo: "Acesso ao sistema",
      status: "Aguardando",
      prioridade: "Baixa",
      dataAbertura: "2024-01-12",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo || !descricao || !prioridade || !categoria) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    toast({
      title: "Chamado criado com sucesso!",
      description: `Chamado "${titulo}" foi registrado e será processado em breve.`,
    });

    // Limpar formulário
    setTitulo("");
    setDescricao("");
    setPrioridade("");
    setCategoria("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-accent/10">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Portal do Solicitante</h1>
                <p className="text-sm text-muted-foreground">Abertura e acompanhamento de chamados</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de novo chamado */}
          <Card className="shadow-medium border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-primary" />
                <span>Novo Chamado</span>
              </CardTitle>
              <CardDescription>
                Preencha as informações para abrir um novo chamado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Chamado</Label>
                  <Input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Descreva brevemente o problema"
                    className="shadow-soft"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={categoria} onValueChange={setCategoria}>
                      <SelectTrigger className="shadow-soft">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="rede">Rede</SelectItem>
                        <SelectItem value="acesso">Acesso</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select value={prioridade} onValueChange={setPrioridade}>
                      <SelectTrigger className="shadow-soft">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição do Problema</Label>
                  <Textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva detalhadamente o problema ou solicitação"
                    rows={4}
                    className="shadow-soft"
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Chamado
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de chamados */}
          <Card className="shadow-medium border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Meus Chamados</span>
              </CardTitle>
              <CardDescription>
                Acompanhe o status dos seus chamados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chamados.map((chamado, index) => (
                  <div key={chamado.id}>
                    <div className="flex items-start justify-between p-4 rounded-lg bg-background/50 border border-border/30">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{chamado.id}
                          </span>
                          <Badge variant="outline" className={getStatusColor(chamado.status)}>
                            {getStatusIcon(chamado.status)}
                            <span className="ml-1">{chamado.status}</span>
                          </Badge>
                        </div>
                        <h4 className="font-medium text-foreground mb-1">
                          {chamado.titulo}
                        </h4>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span>Aberto em {chamado.dataAbertura}</span>
                          <Badge variant="outline" className={getPrioridadeColor(chamado.prioridade)}>
                            {chamado.prioridade}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {index < chamados.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Solicitante;