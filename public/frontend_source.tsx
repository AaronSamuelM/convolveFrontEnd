// ============================================
// MENTAL HEALTH CHATBOT - FRONTEND SOURCE CODE
// ============================================
// Download this file and extract the code sections below
// into your React + Vite project structure

// ============================================
// FILE: src/lib/api.ts
// ============================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AuthResponse {
  user_id: string;
  email?: string;
  error?: string;
}

interface ChatResponse {
  user_id: string;
  response: string;
  timestamp: string;
  error?: string;
}

interface UploadResponse {
  processed?: Record<string, unknown>;
  error?: string;
}

export const api = {
  async register(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async guestLogin(): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
    });
    return res.json();
  },

  async chat(userId: string, query: string, isGuest: boolean = false): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, query, is_guest: isGuest }),
    });
    return res.json();
  },

  async upload(userId: string, file: File, isGuest: boolean = false): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('file', file);
    formData.append('is_guest', String(isGuest));
    
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },
};

// ============================================
// FILE: src/components/AuthScreen.tsx
// ============================================

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { Heart, UserPlus, LogIn, User } from 'lucide-react';

interface AuthScreenProps {
  onAuth: (userId: string, isGuest: boolean) => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.register(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        onAuth(res.user_id, false);
      }
    } catch {
      setError('Connection failed. Is the server running?');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        onAuth(res.user_id, false);
      }
    } catch {
      setError('Connection failed. Is the server running?');
    }
    setLoading(false);
  };

  const handleGuest = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.guestLogin();
      onAuth(res.user_id, true);
    } catch {
      setError('Connection failed. Is the server running?');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Mental Health Assistant</CardTitle>
          <CardDescription>Your safe space for support and guidance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="gap-2">
                <LogIn className="w-4 h-4" /> Login
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-2">
                <UserPlus className="w-4 h-4" /> Register
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={handleLogin} 
                disabled={loading || !email || !password}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 mt-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={handleRegister} 
                disabled={loading || !email || !password}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full gap-2" 
            onClick={handleGuest}
            disabled={loading}
          >
            <User className="w-4 h-4" />
            Continue as Guest
          </Button>

          {error && (
            <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded-md">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// FILE: src/components/MediaPreview.tsx
// ============================================

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

// ============================================
// FILE: src/components/ChatMessage.tsx
// ============================================

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

// ============================================
// FILE: src/components/ChatScreen.tsx
// ============================================

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

// ============================================
// FILE: src/pages/Index.tsx
// ============================================

import { useState } from 'react';
import { AuthScreen } from '@/components/AuthScreen';
import { ChatScreen } from '@/components/ChatScreen';

const Index = () => {
  const [session, setSession] = useState<{ userId: string; isGuest: boolean } | null>(null);

  const handleAuth = (userId: string, isGuest: boolean) => {
    setSession({ userId, isGuest });
  };

  const handleLogout = () => {
    setSession(null);
  };

  if (!session) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <ChatScreen 
      userId={session.userId} 
      isGuest={session.isGuest} 
      onLogout={handleLogout} 
    />
  );
};

export default Index;

// ============================================
// SETUP INSTRUCTIONS
// ============================================
/*
1. Create a new Vite + React + TypeScript project:
   npm create vite@latest mental-health-app -- --template react-ts

2. Install dependencies:
   npm install @radix-ui/react-tabs @radix-ui/react-scroll-area lucide-react tailwindcss class-variance-authority clsx tailwind-merge

3. Set up Tailwind CSS and shadcn/ui components

4. Copy each FILE section above into the corresponding path

5. Create .env file with:
   VITE_API_URL=http://localhost:8000

6. Run the Flask backend on port 8000

7. Start the frontend:
   npm run dev
*/
