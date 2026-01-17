import { useState } from 'react';
import { AuthScreen } from '@/components/AuthScreen';
import { ChatScreen } from '@/components/ChatScreen';

const App = () => {
  const [session, setSession] = useState<{ userId: string; isGuest: boolean } | null>(null);

  const handleAuth = (userId: string, isGuest: boolean) => {
    setSession({ userId, isGuest });
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("user_id");
    localStorage.clear();
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

export default App;