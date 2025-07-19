import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  User,
  Clock,
  Truck,
  Shield,
  FileText,
  Plus,
  MapPin,
  Bed,
  X,
  Search,
  Settings,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import PasswordChangeModal from './PasswordChangeModal';

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

interface ChamadosPanelProps {
  chamados: Chamado[];
  onNovoChamado: () => void;
  onCancelarChamado: (id: string) => void;
  usuarioLogado: string;
  userKey?: string; // Adicionar prop para a chave do usuário
}

const ChamadosPanel: React.FC<ChamadosPanelProps> = ({ 
  chamados: chamadosProps, 
  onNovoChamado, 
  onCancelarChamado, 
  usuarioLogado: usuarioLogadoProps,
  userKey
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [termoBusca, setTermoBusca] = useState('');
  const [mostrarBusca, setMostrarBusca] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const chamadosPorPagina = 10;
  
  // Usar os dados vindos das props em vez do estado local
  const chamados = chamadosProps || [];
  const usuarioLogado = usuarioLogadoProps || localStorage.getItem('username') || '';
  const chaveUsuario = userKey || localStorage.getItem('username') || usuarioLogado;

  // Função para lidar com alteração de senha
  const handlePasswordChanged = () => {
    // Forçar logout após alteração de senha
    navigate('/', { replace: true });
  };

  // Atualizar loading quando os chamados chegarem
  useEffect(() => {
    setLoading(false);
  }, [chamados]);

  const handleLogout = async () => {
    try {
      // Chamar endpoint de logout (opcional)
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log('Erro no logout:', error);
    } finally {
      // Limpar dados do cliente
      localStorage.removeItem('username');
      localStorage.removeItem('userType');
      
      // Redirecionar para login
      window.location.href = '/';
      
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Pendente": "bg-yellow-500 text-white",
      "Em Transporte": "bg-blue-500 text-white", 
      "Concluído": "bg-green-500 text-white",
      "Cancelado": "bg-red-500 text-white"
    };

    const className = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pendente"];
    
    return (
      <Badge className={className}>
        {status}
      </Badge>
    );
  };

  const handleCancelarChamado = (chamado: Chamado) => {
    if (chamado.solicitante !== usuarioLogado) {
      toast({
        title: "Ação não permitida",
        description: "Você só pode cancelar chamados criados por você.",
        variant: "destructive",
      });
      return;
    }

    if (chamado.status === "Cancelado" || chamado.status === "Concluído") {
      toast({
        title: "Ação não permitida",
        description: "Este chamado não pode ser cancelado.",
        variant: "destructive",
      });
      return;
    }

    onCancelarChamado(chamado.id);
    toast({
      title: "Chamado cancelado",
      description: `Chamado #${chamado.id} foi cancelado com sucesso.`,
    });
  };

  // Filtrar chamados baseado no termo de busca
  const chamadosFiltrados = chamados.filter(chamado => {
    const termo = termoBusca.toLowerCase();
    return (
      chamado.nomePaciente.toLowerCase().includes(termo) ||
      chamado.localOrigem.toLowerCase().includes(termo) ||
      chamado.localDestino.toLowerCase().includes(termo) ||
      chamado.leito.toLowerCase().includes(termo) ||
      chamado.tipoTransporte.toLowerCase().includes(termo) ||
      chamado.solicitante.toLowerCase().includes(termo) ||
      chamado.status.toLowerCase().includes(termo) ||
      String(chamado.id).includes(termo)
    );
  });

  // Calcular paginação com base nos chamados filtrados
  const totalPaginas = Math.ceil(chamadosFiltrados.length / chamadosPorPagina);
  const indiceInicio = (paginaAtual - 1) * chamadosPorPagina;
  const indiceFim = indiceInicio + chamadosPorPagina;
  const chamadosPaginados = chamadosFiltrados.slice(indiceInicio, indiceFim);

  // Resetar página quando buscar
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);

  // Função para alternar a visibilidade da busca
  const toggleBusca = () => {
    setMostrarBusca(!mostrarBusca);
    if (mostrarBusca) {
      setTermoBusca(''); // Limpar busca ao fechar
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Painel de Chamados
            </h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe todos os chamados de transporte
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={toggleBusca} 
              variant="outline" 
              size="lg"
              className="flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {mostrarBusca ? 'Fechar Busca' : 'Buscar'}
            </Button>
            <Button onClick={onNovoChamado} variant="hero" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Novo Chamado
            </Button>
            
            {/* Menu de Perfil do Utilizador */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {usuarioLogado}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  Alterar Senha
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sair do Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">{chamados.length}</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {chamados.filter(c => c.status === "Pendente").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Em Transporte</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {chamados.filter(c => c.status === "Em Transporte").length}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {chamados.filter(c => c.status === "Concluído").length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campo de Busca - Condicional */}
        {mostrarBusca && (
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar por paciente, ID, origem, destino, leito, transporte, solicitante ou status..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              {termoBusca && (
                <p className="text-sm text-muted-foreground mt-2">
                  {chamadosFiltrados.length} chamado(s) encontrado(s) para "{termoBusca}"
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabela de Chamados */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Lista de Chamados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chamadosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {termoBusca ? 'Nenhum chamado encontrado' : 'Nenhum chamado encontrado'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {termoBusca 
                    ? `Não há chamados que correspondam à busca "${termoBusca}"`
                    : 'Crie seu primeiro chamado para começar a gerenciar transportes'
                  }
                </p>
                {!termoBusca && (
                  <Button onClick={onNovoChamado} variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Chamado
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Leito</TableHead>
                        <TableHead>Transporte</TableHead>
                        <TableHead>Precaução</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chamadosPaginados.map((chamado) => (
                        <TableRow key={chamado.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">
                            #{String(chamado.id).slice(-6)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {chamado.nomePaciente}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              {chamado.localOrigem} 
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              {chamado.localDestino}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Bed className="w-3 h-3 text-muted-foreground" />
                              {chamado.leito}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Truck className="w-3 h-3 text-muted-foreground" />
                              {chamado.tipoTransporte}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-muted-foreground" />
                              {chamado.precisaPrecaucao === "sim" ? (
                                <span className="text-orange-600 text-xs">
                                  {chamado.tipoPrecaucao || "Sim"}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">Não</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(chamado.status)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(chamado.dataCriacao).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell className="text-sm">
                            {chamado.solicitante}
                          </TableCell>
                          <TableCell>
                            {chamado.solicitante === usuarioLogado && 
                             chamado.status !== "Cancelado" && 
                             chamado.status !== "Concluído" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelarChamado(chamado)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginação */}
                {totalPaginas > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                            className={paginaAtual === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                          <PaginationItem key={pagina}>
                            <PaginationLink
                              onClick={() => setPaginaAtual(pagina)}
                              isActive={pagina === paginaAtual}
                              className="cursor-pointer"
                            >
                              {pagina}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                            className={paginaAtual === totalPaginas ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Modal de Alteração de Senha */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        usuarioLogado={userKey || usuarioLogado}
        onPasswordChanged={handlePasswordChanged}
      />
    </div>
  );
};

export default ChamadosPanel;