import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Edit } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { z } from 'zod';
import { whatsappService } from '@/lib/services/whatsapp.service';
import { formatBrazilianPhone, cleanPhone, validateBrazilianPhone } from '@/modules/payment/utils/phone';

interface CustomerData {
  name: string;
  email: string;
  whatsapp: string;
}

// Schema de validação com Zod
const customerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido").max(15)
});

// Interface simplificada para as props
interface CustomerFormProps {
  onContinue: (data: CustomerData) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onContinue }) => {
  // Estado interno para os dados do cliente
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    whatsapp: ''
  });
  
  // Estados para validação e controle de UI
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});
  const [isWhatsappChecking, setIsWhatsappChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Função de validação com Zod (apenas quando solicitado)
  const validateField = (field: keyof CustomerData, value: string) => {
    try {
      // Validar apenas o campo específico
      customerSchema.shape[field].parse(value);
      // Se passar na validação, remove o erro
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]?.message || `${field} inválido`;
        setErrors(prev => ({ ...prev, [field]: fieldError }));
      }
      return false;
    }
  };
  
  // Validação de WhatsApp (silenciosa)
  const validateWhatsapp = async () => {
    const phone = customerData.whatsapp;
    const cleanedPhone = cleanPhone(phone);
    
    // Verifica se o número é válido antes de fazer a chamada de API
    if (!validateBrazilianPhone(phone)) {
      setErrors(prev => ({ ...prev, whatsapp: "Número de telefone inválido" }));
      return;
    }
    
    setIsWhatsappChecking(true);
    try {
      const result = await whatsappService.checkWhatsappNumber(cleanedPhone);
      if (!result.isWhatsapp) {
        setErrors(prev => ({ 
          ...prev, 
          whatsapp: "Este número não está registrado no WhatsApp" 
        }));
      } else {
        setErrors(prev => ({ ...prev, whatsapp: undefined }));
      }
    } catch (error) {
      console.error("Erro ao validar WhatsApp:", error);
    } finally {
      setIsWhatsappChecking(false);
    }
  };
  
  // Função de submit com validação completa
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Validar todos os campos
    let isValid = true;
    Object.entries(customerData).forEach(([field, value]) => {
      const fieldValid = validateField(field as keyof CustomerData, value);
      if (!fieldValid) isValid = false;
    });
    
    // Se WhatsApp não foi validado ainda, validar
    if (isValid && customerData.whatsapp && !isWhatsappChecking) {
      await validateWhatsapp();
    }
    
    setIsSubmitting(false);
    
    // Se tudo estiver válido, chama o onContinue e fecha o formulário
    if (isValid && !isWhatsappChecking && !errors.whatsapp) {
      setIsOpen(false);
      setIsEditing(false);
      onContinue(customerData);
    }
  };
  
  // Função para editar os dados
  const handleEdit = () => {
    setIsEditing(true);
    setIsOpen(true);
  };
  
  // Handler de mudança (sem validação)
  const handleChange = (field: keyof CustomerData, value: string) => {
    // Se for o campo de WhatsApp, aplicar máscara
    if (field === 'whatsapp') {
      value = formatBrazilianPhone(value);
    }
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };
  
  // Handlers de blur para validação
  const handleNameBlur = () => {
    validateField('name', customerData.name);
  };
  
  const handleEmailBlur = () => {
    validateField('email', customerData.email);
  };
  
  const handleWhatsappBlur = () => {
    validateField('whatsapp', customerData.whatsapp);
    if (customerData.whatsapp && customerData.whatsapp.length >= 10) {
      validateWhatsapp();
    }
  };
  
  return (
    <Card className="shadow-md sticky top-4">
      <Collapsible 
        open={isOpen} 
        onOpenChange={(open) => {
          // Só permite fechar se os dados estiverem preenchidos
          if (!open && (!customerData.name || !customerData.email || !customerData.whatsapp)) {
            // Não permite fechar se os dados não estiverem preenchidos
            return;
          }
          setIsOpen(open);
        }}
      >
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 border-b cursor-pointer hover:bg-gray-50 transition-colors rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {isOpen ? (
                  <CardTitle>Identifique-se</CardTitle>
                ) : (
                  <div className="flex flex-col">
                    <span className="font-semibold text-base leading-tight">{customerData.name || 'Preencha seus dados'}</span>
                    <span className="text-xs text-muted-foreground truncate">{customerData.email || '-'}</span>
                    <span className="text-xs text-muted-foreground truncate">{customerData.whatsapp || '-'}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!isOpen && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs flex items-center gap-1 h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                  >
                    <Edit className="h-3 w-3" />
                    Editar dados
                  </Button>
                )}

              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
                  value={customerData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="h-10"
                  disabled={!isEditing && !isOpen}
                />
                {errors.name && (
                  <span className="text-xs text-red-500">{errors.name}</span>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu melhor e-mail"
                  value={customerData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className="h-10"
                  disabled={!isEditing && !isOpen}
                />
                {errors.email && (
                  <span className="text-xs text-red-500">{errors.email}</span>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp" className="text-sm">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  inputMode="numeric"
                  placeholder="(00) 00000-0000"
                  value={customerData.whatsapp}
                  onChange={e => handleChange('whatsapp', e.target.value)}
                  className="h-10"
                  disabled={!isEditing && !isOpen}
                />
                {errors.whatsapp && (
                  <span className="text-xs text-red-500">{errors.whatsapp}</span>
                )}
              </div>
              <Button 
                className="w-full mt-4 h-10 text-sm" 
                onClick={handleSubmit} 
                size="default"
                disabled={isSubmitting || isWhatsappChecking}
              >
                Continuar para pagamento
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
