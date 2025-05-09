'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PixResultProps {
  qrCodeImage: string;
  qrCodeText: string;
  expirationTime: string;
}

export function PixResult({ qrCodeImage, qrCodeText, expirationTime }: PixResultProps) {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(qrCodeText);
    alert('Código PIX copiado para a área de transferência!');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Pagamento via PIX</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg mb-4 border">
          {qrCodeImage ? (
            <Image 
              src={qrCodeImage} 
              alt="QR Code PIX" 
              width={200} 
              height={200} 
              className="mx-auto"
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">QR Code não disponível</span>
            </div>
          )}
        </div>
        
        <div className="w-full mb-4">
          <p className="text-sm text-gray-500 mb-2 text-center">Código PIX copia e cola:</p>
          <div className="relative">
            <div className="p-3 bg-gray-100 rounded-md text-xs break-all overflow-hidden">
              {qrCodeText}
            </div>
            <Button 
              onClick={handleCopyToClipboard}
              variant="outline" 
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              Copiar
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Abra o aplicativo do seu banco, selecione PIX e escaneie o código acima ou cole o código copiado.</p>
          <p className="mt-2 font-medium">Expira em: {expirationTime}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-gray-500 mb-2 text-center w-full">
          Após o pagamento, você receberá a confirmação por e-mail.
        </p>
      </CardFooter>
    </Card>
  );
}
