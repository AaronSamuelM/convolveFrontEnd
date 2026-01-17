import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name: string;
  };
}

export function ChatMessage({ content, isUser, timestamp, media }: ChatMessageProps) {
  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className={cn(
        'max-w-[75%] rounded-2xl px-4 py-3 space-y-2',
        isUser 
          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
          : 'bg-secondary text-secondary-foreground rounded-tl-sm'
      )}>
        {media && (
          <div className="mb-2">
            {media.type === 'image' && (
              <img src={media.url} alt={media.name} className="max-w-full rounded-lg" />
            )}
            {media.type === 'video' && (
              <video src={media.url} controls className="max-w-full rounded-lg" />
            )}
            {media.type === 'audio' && (
              <audio src={media.url} controls className="w-full" />
            )}
            {media.type === 'file' && (
              <div className="bg-background/20 rounded-lg p-2 text-sm">
                📎 {media.name}
              </div>
            )}
          </div>
        )}
        
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        
        {timestamp && (
          <p className={cn(
            'text-[10px] opacity-70',
            isUser ? 'text-right' : 'text-left'
          )}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
