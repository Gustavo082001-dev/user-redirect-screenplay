import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { User, MapPin, Bed, Truck, Shield, Clock, X, Plus, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

interface ChamadosPanelProps {
  chamados: Chamado[];
  onNovoChamado: () => void;
  onCancelarChamado: (id: string) => void;
  usuarioLogado: string;
}

const ChamadosPanel = ({ chamados, onNovoChamado, onCancelarChamado, usuarioLogado }: ChamadosPanelProps) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const chamadosPorPagina = 15;

  const totalPaginas = Math.ceil(chamados.length / chamadosPorPagina);
  const indiceInicio = (paginaAtual - 1) * chamadosPorPagina;
  const indiceFim = indiceInicio + chamadosPorPagina;
  const chamadosPaginados = chamados.slice(indiceInicio, indiceFim);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel de Chamados</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas solicitações de transporte de pacientes
            </p>
          </div>
          <Button 
            onClick={onNovoChamado}
            variant="hero"
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Criar Novo Chamado
          </Button>
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

        {/* Tabela de Chamados */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Lista de Chamados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chamados.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum chamado encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Crie seu primeiro chamado para começar a gerenciar transportes
                </p>
                <Button onClick={onNovoChamado} variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Chamado
                </Button>
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
                            #{chamado.id.slice(-6)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {chamado.nomePaciente}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              {chamado.localOrigemm}
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
                            {chamado.dataCriacao}
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
    </div>
  );
};

export default ChamadosPanel;