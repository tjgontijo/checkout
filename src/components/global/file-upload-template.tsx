import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FileUploadTemplate: React.FC = () => {
  const templateData = [
    ['Nome', 'Email'],
    ['João Silva', 'joao.silva@exemplo.com'],
    ['Maria Souza', 'maria.souza@exemplo.com'],
  ];

  const downloadTemplate = () => {
    const csvContent = templateData.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_participantes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-dashed bg-muted/10 p-4">
      <div>
        <div className="mb-4 flex items-center space-x-3">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <h3 className="text-sm font-semibold">Formato do Arquivo</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded border border-primary/30 bg-primary/20"></div>
            <span className="text-muted-foreground">Formatos aceitos: .csv, .xlsx</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded border border-primary/30 bg-primary/20"></div>
            <span className="text-muted-foreground">Colunas obrigatórias: Nome e Email</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={downloadTemplate}
          className="flex w-full items-center justify-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span className="text-xs">Baixar Template</span>
        </Button>
      </div>
    </div>
  );
};
