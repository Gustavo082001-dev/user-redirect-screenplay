import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hourglass, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const Executor = () => {
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const userName = location.state?.userName || "Usuário";

  const handleBuscarSolicitacoes = async () => {
    setIsSearching(true);
    
    // Simular busca por solicitações
    setTimeout(() => {
      setIsSearching(false);
      // Aqui poderia navegar para uma lista de solicitações
      alert("Buscando novas solicitações...");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <h1 className="text-xl font-semibold text-foreground text-center">
          Executor - Transporte
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Status Icon */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center shadow-medium">
            <Hourglass 
              className={`w-16 h-16 text-primary ${isSearching ? 'animate-pulse' : ''}`} 
            />
          </div>
          {isSearching && (
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-medium text-foreground">
            {isSearching ? "Buscando solicitações..." : "Aguardando solicitações..."}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isSearching 
              ? "Verificando novas solicitações de transporte"
              : "Toque no botão abaixo para buscar novas solicitações"
            }
          </p>
        </div>

        {/* Action Button */}
        <Card className="w-full max-w-sm p-6 shadow-strong bg-background/50 backdrop-blur-sm border-border/50">
          <Button
            onClick={handleBuscarSolicitacoes}
            disabled={isSearching}
            className="w-full h-14 text-base font-medium bg-gradient-to-r from-primary to-primary-hover hover:shadow-strong transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Search className="w-5 h-5 mr-2" />
            {isSearching ? "Buscando..." : "Buscar novas solicitações"}
          </Button>
        </Card>
      </div>

      {/* Footer with User Name */}
      <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground uppercase tracking-wide">
            {userName}
          </p>
          <p className="text-xs text-muted-foreground">
            Executor de Transporte
          </p>
        </div>
      </div>
    </div>
  );
};

export default Executor;