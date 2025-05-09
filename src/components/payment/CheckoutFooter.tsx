import React from 'react';
import { Lock } from 'lucide-react';

export const CheckoutFooter: React.FC = () => (
  <div className="bg-white border-t mt-10">
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Checkout Seguro. Todos os direitos reservados.
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-sm">Pagamento seguro e criptografado</span>
        </div>
      </div>
    </div>
  </div>
);
