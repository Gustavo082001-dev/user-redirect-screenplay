import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Bed, Truck, Shield, FileText, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FormData {
  nomePaciente: string;
  localOrigemm: string;
  localDestino: string;
  leito: string;
  tipoTransporte: string;
  precisaPrecaucao: string;
  tipoPrecaucao?: string;
  observacoes: string;
}

const Solicitante = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [precisaPrecaucao, setPrecisaPrecaucao] = useState("");
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>();

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Simula envio do chamado
    setTimeout(() => {
      toast({
        title: "Chamado criado com sucesso!",
        description: `Chamado para ${data.nomePaciente} foi registrado e será processado em breve.`,
      });
      
      reset();
      setPrecisaPrecaucao("");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-strong border-0 bg-gradient-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Abertura de Chamado
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Preencha os dados para solicitar transporte de paciente
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Nome do Paciente */}
              <div className="space-y-2">
                <Label htmlFor="nomePaciente" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome do Paciente
                </Label>
                <Input
                  id="nomePaciente"
                  {...register("nomePaciente", { required: "Nome do paciente é obrigatório" })}
                  placeholder="Digite o nome completo do paciente"
                  className="h-11 shadow-soft border-border/50 focus:border-primary focus:shadow-medium transition-all duration-200"
                  disabled={isLoading}
                />
                {errors.nomePaciente && (
                  <p className="text-sm text-destructive">{errors.nomePaciente.message}</p>
                )}
              </div>

              {/* Local de Origem */}
              <div className="space-y-2">
                <Label htmlFor="localOrigem" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Local de Origem
                </Label>
                <Input
                  id="localOrigem"
                  {...register("localOrigemm", { required: "Local de origem é obrigatório" })}
                  placeholder="Ex: UTI, Quarto 201, Pronto Socorro"
                  className="h-11 shadow-soft border-border/50 focus:border-primary focus:shadow-medium transition-all duration-200"
                  disabled={isLoading}
                />
                {errors.localOrigemm && (
                  <p className="text-sm text-destructive">{errors.localOrigemm.message}</p>
                )}
              </div>

              {/* Local de Destino */}
              <div className="space-y-2">
                <Label htmlFor="localDestino" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Local de Destino
                </Label>
                <Input
                  id="localDestino"
                  {...register("localDestino", { required: "Local de destino é obrigatório" })}
                  placeholder="Ex: Centro Cirúrgico, Radiologia, Enfermaria"
                  className="h-11 shadow-soft border-border/50 focus:border-primary focus:shadow-medium transition-all duration-200"
                  disabled={isLoading}
                />
                {errors.localDestino && (
                  <p className="text-sm text-destructive">{errors.localDestino.message}</p>
                )}
              </div>

              {/* Leito */}
              <div className="space-y-2">
                <Label htmlFor="leito" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  Leito
                </Label>
                <Input
                  id="leito"
                  {...register("leito", { required: "Leito é obrigatório" })}
                  placeholder="Ex: 01, 15A, 203B"
                  className="h-11 shadow-soft border-border/50 focus:border-primary focus:shadow-medium transition-all duration-200"
                  disabled={isLoading}
                />
                {errors.leito && (
                  <p className="text-sm text-destructive">{errors.leito.message}</p>
                )}
              </div>

              {/* Tipo de Transporte */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Tipo de Transporte
                </Label>
                <Select onValueChange={(value) => setValue("tipoTransporte", value)} disabled={isLoading}>
                  <SelectTrigger className="h-11 shadow-soft border-border/50 focus:border-primary focus:shadow-medium transition-all duration-200">
                    <SelectValue placeholder="Selecione o tipo de transporte" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-strong z-50">
                    <SelectItem value="cadeira-rodas">Cadeira de Rodas</SelectItem>
                    <SelectItem value="maca">Maca</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoTransporte && (
                  <p className="text-sm text-destructive">Tipo de transporte é obrigatório</p>
                )}
              </div>

              {/* Precisa de Precaução */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Precisa de Precaução?
                </Label>
                <RadioGroup
                  value={precisaPrecaucao}
                  onValueChange={(value) => {
                    setPrecisaPrecaucao(value);
                    setValue("precisaPrecaucao", value);
                  }}
                  className="flex gap-6"
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="precaucao-sim" />
                    <Label htmlFor="precaucao-sim" className="text-sm font-normal">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="precaucao-nao" />
                    <Label htmlFor="precaucao-nao" className="text-sm font-normal">Não</Label>
                  </div>
                </RadioGroup>

                {precisaPrecaucao === "sim" && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <Label htmlFor="tipoPrecaucao" className="text-sm font-medium text-foreground">
                      Tipo de Precaução
                    </Label>
                    <Input
                      id="tipoPrecaucao"
                      {...register("tipoPrecaucao", { 
                        required: precisaPrecaucao === "sim" ? "Tipo de precaução é obrigatório" : false 
                      })}
                      placeholder="Ex: Isolamento por contato, Isolamento respiratório"
                      className="h-11 shadow-soft border-border/50 focus:border-primary focus:shadow-medium transition-all duration-200"
                      disabled={isLoading}
                    />
                    {errors.tipoPrecaucao && (
                      <p className="text-sm text-destructive">{errors.tipoPrecaucao.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-sm font-medium text-foreground">
                  Observações
                </Label>
                <Textarea
                  id="observacoes"
                  {...register("observacoes")}
                  placeholder="Informações adicionais sobre o transporte, condições especiais do paciente, urgência, etc."
                  className="min-h-[100px] shadow-soft border-border/50 focus:border-primary focus:shadow-medium transition-all duration-200"
                  disabled={isLoading}
                />
              </div>

              {/* Botão de Envio */}
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
                    Criando chamado...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Criar Chamado
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Solicitante;