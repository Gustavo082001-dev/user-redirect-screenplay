import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Simulação de diferentes tipos de usuário baseado no campo usuário
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario || !senha) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha usuário e senha.",
      });
      return;
    }

    setIsLoading(true);

    // Simula delay de autenticação
    setTimeout(() => {
      if (usuario.toLowerCase().includes("solicitante") || usuario.toLowerCase().includes("user")) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para abertura de chamados...",
        });
        navigate("/solicitante", { state: { userName: usuario } });
      } else if (usuario.toLowerCase().includes("executor")) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para busca de solicitações...",
        });
        navigate("/executor", { state: { userName: usuario } });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Login efetuado com sucesso.",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-strong border-0 bg-gradient-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Sistema de Chamados
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Faça login para acessar o sistema
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="usuario" className="text-sm font-medium text-foreground">
                  Usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="usuario"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="pl-10 h-11 shadow-soft border-border/50 focus:border-primary focus:shadow-medium transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-medium text-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 h-11 shadow-soft border-border/50 focus:border-primary focus:shadow-medium transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-primary-light/20 rounded-lg border border-primary-light/30">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-primary/80">
                  <p className="font-medium mb-1">Usuários de demonstração:</p>
                  <p>• "solicitante" → Abertura de chamados</p>
                  <p>• "executor" → Execução de chamados</p>
                  <p>• "admin" → Painel administrativo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;