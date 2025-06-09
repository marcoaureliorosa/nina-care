import React, { useState, useRef } from 'react';
import { Upload, X, User, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  userName?: string;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24', 
  lg: 'w-32 h-32'
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentImageUrl,
  onImageChange,
  disabled = false,
  size = 'md',
  userName = 'Usuario'
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF.'
      };
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Arquivo muito grande. O tamanho máximo é 5MB.'
      };
    }

    return { valid: true };
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Arquivo inválido",
        description: validation.error,
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    
    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload para o Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);

      const publicUrl = urlData.publicUrl;
      
      setPreviewUrl(publicUrl);
      onImageChange(publicUrl);
      
      toast({
        title: "Upload realizado",
        description: "Avatar atualizado com sucesso!",
      });

      return publicUrl;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadImage(file);
    
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = async () => {
    if (previewUrl && previewUrl.includes('supabase')) {
      try {
        // Extrair path do arquivo da URL
        const url = new URL(previewUrl);
        const pathSegments = url.pathname.split('/');
        const filePath = pathSegments.slice(-2).join('/'); // avatars/filename
        
        // Remover do storage
        await supabase.storage
          .from('avatars')
          .remove([filePath]);
      } catch (error) {
        console.error('Erro ao remover arquivo:', error);
      }
    }
    
    setPreviewUrl(null);
    onImageChange(null);
    
    toast({
      title: "Avatar removido",
      description: "O avatar foi removido com sucesso.",
    });
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative group">
        <Avatar className={cn(sizeClasses[size], "cursor-pointer transition-all")}>
          <AvatarImage 
            src={previewUrl || ''} 
            alt={userName}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay de upload */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center cursor-pointer",
            disabled && "cursor-not-allowed"
          )}
          onClick={openFileDialog}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Botão de remover */}
        {previewUrl && !disabled && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={removeImage}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openFileDialog}
          disabled={disabled || uploading}
          className="text-xs"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-3 h-3 mr-1" />
              {previewUrl ? 'Alterar' : 'Enviar'} Foto
            </>
          )}
        </Button>

        {previewUrl && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeImage}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="w-3 h-3 mr-1" />
            Remover
          </Button>
        )}
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Texto de ajuda */}
      <p className="text-xs text-muted-foreground text-center max-w-48">
        JPEG, PNG, WebP ou GIF. Máximo 5MB.
      </p>
    </div>
  );
};

export default AvatarUpload; 