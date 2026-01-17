import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { MediaPreview } from './MediaPreview';
import { api } from '@/lib/api';
import { Send, Paperclip, LogOut, Heart, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name: string;
  };
}

interface ChatScreenProps {
  userId: string;
  isGuest: boolean;
  onLogout: () => void;
}

export function ChatScreen({ userId, isGuest, onLogout }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Mental Health Assistant. I'm here to listen and support you. How are you feeling today?",
      isUser: false,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getMediaType = (file: File): 'image' | 'video' | 'audio' | 'file' => {
    const type = file.type.split('/')[0];
    if (type === 'image') return 'image';
    if (type === 'video') return 'video';
    if (type === 'audio') return 'audio';
    return 'file';
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input || (file ? `Uploaded: ${file.name}` : ''),
      isUser: true,
      timestamp: new Date().toISOString(),
      media: file ? {
        type: getMediaType(file),
        url: URL.createObjectURL(file),
        name: file.name,
      } : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentFile = file;
    setInput('');
    setFile(null);
    setLoading(true);

    try {
      if (currentFile) {
        await api.upload(userId, currentFile, isGuest);
      }

      if (currentInput.trim()) {
        const res = await api.chat(userId, currentInput, isGuest);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: res.response || res.error || 'I received your message.',
          isUser: false,
          timestamp: res.timestamp || new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else if (currentFile) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Thank you for sharing that file. I\'ve processed it and added it to your context.',
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I couldn\'t connect to the server. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Mental Health Assistant</h1>
            <p className="text-xs text-muted-foreground">
              {isGuest ? 'Guest Session' : 'Personalized Support'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              content={msg.content}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
              media={msg.media}
            />
          ))}
          
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {file && (
            <MediaPreview file={file} onRemove={() => setFile(null)} />
          )}
          
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={loading || (!input.trim() && !file)}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Your conversations are private and secure
          </p>
        </div>
      </div>
    </div>
  );
}
