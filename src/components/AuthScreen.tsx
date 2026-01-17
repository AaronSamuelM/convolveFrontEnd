import { useState,useEffect } from 'react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const access = localStorage.getItem("user_id");
    if (access) {
      onAuth(access, false);
    }
  }, []);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.register(name, email, password);
      if (res.error) {
        setError(res.error);
      } else {
        localStorage.setItem("user_id",res?.user_id);
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
        localStorage.setItem("user_id",res?.user_id);
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
                type="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
