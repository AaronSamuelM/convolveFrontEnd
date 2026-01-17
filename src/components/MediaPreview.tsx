import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaPreviewProps {
  file: File;
  onRemove: () => void;
}

export function MediaPreview({ file, onRemove }: MediaPreviewProps) {
  const url = URL.createObjectURL(file);
  const type = file.type.split('/')[0];

  return (
    <div className="relative inline-block rounded-lg overflow-hidden border border-border bg-muted/50">
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 z-10 h-6 w-6"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
      
      {type === 'image' && (
        <img 
          src={url} 
          alt={file.name} 
          className="max-w-[200px] max-h-[150px] object-cover"
          onLoad={() => URL.revokeObjectURL(url)}
        />
      )}
      
      {type === 'video' && (
        <video 
          src={url} 
          controls 
          className="max-w-[250px] max-h-[150px]"
          onLoadedData={() => URL.revokeObjectURL(url)}
        />
      )}
      
      {type === 'audio' && (
        <div className="p-3 min-w-[200px]">
          <p className="text-xs text-muted-foreground mb-2 truncate max-w-[180px]">
            {file.name}
          </p>
          <audio 
            src={url} 
            controls 
            className="w-full h-8"
            onLoadedData={() => URL.revokeObjectURL(url)}
          />
        </div>
      )}
      
      {!['image', 'video', 'audio'].includes(type) && (
        <div className="p-4 flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-primary uppercase">
              {file.name.split('.').pop()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
            {file.name}
          </p>
        </div>
      )}
    </div>
  );
}
