import React, { useState, useCallback } from 'react'
import { FileUp, X, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  accept = '.xlsx,.xls,.csv',
  className 
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = useCallback((selectedFile: File | null) => {
    setFile(selectedFile)
    onFileSelect(selectedFile)
  }, [onFileSelect])

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0]
      handleFileChange(selectedFile)
    }
  }, [handleFileChange])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      handleFileChange(selectedFile)
    }
  }, [handleFileChange])

  const removeFile = useCallback(() => {
    handleFileChange(null)
  }, [handleFileChange])

  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
        dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="hidden" 
        id="file-upload" 
        accept={accept}
        onChange={handleFileInput}
      />
      
      {!file ? (
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex flex-col items-center space-y-4"
        >
          <FileUp className="w-12 h-12 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Arraste e solte ou clique para fazer upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Formatos aceitos: Excel (.xlsx, .xls), CSV
            </p>
          </div>
        </label>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileSpreadsheet className="w-10 h-10 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={removeFile}
            className="text-destructive hover:text-destructive/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
