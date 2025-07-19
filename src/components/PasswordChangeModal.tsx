import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock } from 'lucide-react';

const passwordChangeSchema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmarNovaSenha: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.novaSenha !== data.senhaAtual, {
  message: 'A nova senha deve ser diferente da senha atual',
  path: ['novaSenha'],
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarNovaSenha'],
});

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioLogado: string;
  onPasswordChanged?: () => void; // Nova prop para callback após alteração
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  usuarioLogado,
  onPasswordChanged,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarNovaSenha: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuarioLogado,
          senhaAtual: data.senhaAtual,
          novaSenha: data.novaSenha,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Sucesso!',
          description: 'Senha alterada com sucesso! Você será redirecionado para fazer login novamente.',
        });
        reset();
        onClose();
        
        // Chamar callback para forçar logout
        if (onPasswordChanged) {
          setTimeout(() => {
            onPasswordChanged();
          }, 2000); // Aguardar 2 segundos para mostrar a mensagem
        }
      } else {
        toast({
          title: 'Erro',
          description: result.message || 'Erro ao alterar senha',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro de conexão. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setShowPasswords({
      senhaAtual: false,
      novaSenha: false,
      confirmarNovaSenha: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Alterar Senha
          </DialogTitle>
          <DialogDescription>
            Digite sua senha atual e escolha uma nova senha para sua conta.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senhaAtual">Senha Atual</Label>
            <div className="relative">
              <Input
                id="senhaAtual"
                type={showPasswords.senhaAtual ? 'text' : 'password'}
                {...register('senhaAtual')}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('senhaAtual')}
                disabled={isLoading}
              >
                {showPasswords.senhaAtual ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.senhaAtual && (
              <p className="text-sm text-destructive">{errors.senhaAtual.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="novaSenha">Nova Senha</Label>
            <div className="relative">
              <Input
                id="novaSenha"
                type={showPasswords.novaSenha ? 'text' : 'password'}
                {...register('novaSenha')}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('novaSenha')}
                disabled={isLoading}
              >
                {showPasswords.novaSenha ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.novaSenha && (
              <p className="text-sm text-destructive">{errors.novaSenha.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmarNovaSenha">Confirmar Nova Senha</Label>
            <div className="relative">
              <Input
                id="confirmarNovaSenha"
                type={showPasswords.confirmarNovaSenha ? 'text' : 'password'}
                {...register('confirmarNovaSenha')}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirmarNovaSenha')}
                disabled={isLoading}
              >
                {showPasswords.confirmarNovaSenha ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmarNovaSenha && (
              <p className="text-sm text-destructive">{errors.confirmarNovaSenha.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeModal;