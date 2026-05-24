chat_fix = '''import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ArrowLeft, Send, Bot, User, Loader2, Clock,
  Package, Search, FileText, HelpCircle, LogOut,
  Home, Settings, Moon, Sun, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AirpakLogo } from "@/components/AirpakLogo";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'tracking' | 'error';
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: <Package className="h-4 w-4" />, label: "Track shipment", prompt: "I need to track my shipment" },
  { icon: <Search className="h-4 w-4" />, label: "Get a quote", prompt: "How much to ship a package from London to Tokyo?" },
  { icon: <FileText className="h-4 w-4" />, label: "File a claim", prompt: "I need to file a claim for a damaged package" },
  { icon: <HelpCircle className="h-4 w-4" />, label: "Support", prompt: "I need help with my account" },
];

export default function Chat() {
  const [, navigate] = useLocation();
  const { toggle, resolvedTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check auth (optional - chat can work for guests too)
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setUser(data.user || null))
      .catch(() => {});
  }, []);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your Airpak assistant. I can help you with:\n\n• Tracking shipments\n• Getting shipping quotes\n• Filing claims\n• Account questions\n\nWhat can I help you with today?`,
        timestamp: new Date(),
        type: 'text'
      }]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    
    const messageText = overrideInput || input;
    if (!messageText.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");
    
    try {
      // Try to call backend API first
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: messageText })
      });
      
      if (res.ok) {
        const data = await res.json();
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          type: data.type || 'text'
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback to client-side responses if API fails
        handleFallbackResponse(messageText);
      }
    } catch (err) {
      // Network error - use fallback
      handleFallbackResponse(messageText);
    } finally {
      setLoading(false);
    }
  };

  const handleFallbackResponse = (message: string) => {
    const lower = message.toLowerCase();
    let response = '';
    let type: 'text' | 'tracking' | 'error' = 'text';
    
    if (lower.includes('track') || lower.includes('where') || lower.includes('shipment')) {
      response = `I can help you track your shipment. Please visit our [Tracking page](/tracking) and enter your Airpak Waybill (AWB) number.\n\nYour tracking number typically looks like: **APX-2026-XXXXXX**`;
      type = 'tracking';
    } else if (lower.includes('quote') || lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      response = `To get an accurate shipping quote, please provide:\n\n• Origin and destination\n• Package weight and dimensions\n• Preferred service (Express, Standard, Economy, or Freight)\n\nYou can also visit our homepage and click "Get a Quote" for instant pricing.`;
    } else if (lower.includes('claim') || lower.includes('damage') || lower.includes('lost') || lower.includes('missing')) {
      response = `I'm sorry to hear you're having an issue. To file a claim:\n\n1. Gather your AWB number and photos of damage (if applicable)\n2. Contact our claims team at claims@airpak-express.site\n3. Or call our support line at +44 20 7946 0958\n\nClaims are typically resolved within 5-7 business days.`;
    } else if (lower.includes('human') || lower.includes('agent') || lower.includes('support') || lower.includes('help')) {
      response = `I'll connect you with a human agent. Our support team is available:\n\n**Phone:** +44 20 7946 0958\n**Email:** support@airpak-express.site\n**Hours:** Monday-Friday, 8:00 AM - 6:00 PM GMT\n\nFor urgent issues, please call directly.`;
    } else if (lower.includes('account') || lower.includes('login') || lower.includes('password')) {
      response = `For account-related issues:\n\n• **Forgot password?** Visit [Reset Password](/reset-password)\n• **Account settings?** Go to [Settings](/settings)\n• **Billing questions?** Check [Payments](/payment)\n\nNeed more help? Contact support@airpak-express.site`;
    } else {
      response = `I understand you're asking about: "${message}"\n\nI'm an AI assistant with limited capabilities. For complex inquiries, I recommend:\n\n• Checking our [FAQ page](/faq)\n• Contacting support at support@airpak-express.site\n• Calling +44 20 7946 0958\n\nIs there something specific about tracking, quotes, or claims I can help with?`;
    }
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      type
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
      window.localStorage.removeItem('airpak_user');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link href="/">
              <AirpakLogo className="h-8" />
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Bot className="h-3 w-3" />
                AI Assistant
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle}>
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <Home className="h-5 w-5" />
            </Button>
            {user && (
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className={`max-w-[80%] space-y-1 ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}>
                <Card className={`${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : message.type === 'error'
                      ? 'border-red-500/20 bg-red-500/5'
                      : ''
                }`}>
                  <CardContent className="p-3">
                    <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className={line.startsWith('•') || line.startsWith('**') ? 'mb-1' : 'mb-2'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <span className="text-xs text-muted-foreground px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {error && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-3 max-w-3xl">
            <p className="text-xs text-muted-foreground mb-2">Quick actions</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {QUICK_ACTIONS.map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-2"
                  onClick={() => handleSend(undefined, action.prompt)}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-background p-4">
        <div className="container mx-auto max-w-3xl">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI assistant. For urgent matters, call +44 20 7946 0958
          </p>
        </div>
      </div>
    </div>
  );
}
'''

with open('/mnt/agents/output/airpak-repair/Chat.tsx', 'w') as f:
    f.write(chat_fix)

