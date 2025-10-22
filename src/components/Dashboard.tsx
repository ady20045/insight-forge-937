import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ChatInterface from "./ChatInterface";
import { 
  PlusCircle, 
  LogOut, 
  MessageSquare,
  User,
  Menu,
  X
} from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "New Chat",
      created_at: new Date().toISOString(),
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/auth");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 border-r border-border flex flex-col bg-sidebar"
          >
            {/* New Chat Button */}
            <div className="p-4">
              <Button
                onClick={handleNewChat}
                className="w-full justify-start gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80"
              >
                <PlusCircle size={20} />
                New Chat
              </Button>
            </div>

            <Separator />

            {/* Chat Sessions */}
            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="p-4 space-y-2">
                {sessions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="mx-auto mb-2 opacity-50" size={32} />
                    <p className="text-sm">No chat sessions yet</p>
                    <p className="text-xs mt-1">Click "New Chat" to start</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <motion.button
                      key={session.id}
                      onClick={() => setCurrentSessionId(session.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentSessionId === session.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare size={18} className="mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{session.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(session.created_at)}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </ScrollArea>

            <Separator />

            {/* User Profile */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-sidebar-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">Free Plan</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start gap-2 border-border/50"
                size="sm"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <h1 className="text-xl font-bold gradient-text">AI4U</h1>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          {currentSessionId ? (
            <ChatInterface sessionId={currentSessionId} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
              >
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Welcome to AI4U
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start a new chat to analyze your data with AI-powered insights
                </p>
                <Button
                  onClick={handleNewChat}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <PlusCircle className="mr-2" size={20} />
                  Start New Chat
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
