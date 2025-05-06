import React from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const FileUploadTemplate: React.FC = () => {
  const templateData = [
    ['Nome', 'Email'],
    ['João Silva', 'joao.silva@exemplo.com'],
    ['Maria Souza', 'maria.souza@exemplo.com']
  ]

  const downloadTemplate = () => {
    const csvContent = templateData.map(e => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_participantes.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-muted/10 border border-dashed rounded-lg p-4 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <FileSpreadsheet className="w-6 h-6 text-primary" />
          <h3 className="text-sm font-semibold">Formato do Arquivo</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary/20 border border-primary/30 rounded"></div>
            <span className="text-muted-foreground">
              Formatos aceitos: .csv, .xlsx
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary/20 border border-primary/30 rounded"></div>
            <span className="text-muted-foreground">
              Colunas obrigatórias: Nome e Email
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={downloadTemplate}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span className="text-xs">Baixar Template</span>
        </Button>
      </div>
    </div>
  )
}
