payment_fix = '''import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ArrowLeft, CreditCard, Wallet, TrendingUp, Download, Plus,
  CheckCircle, AlertTriangle, LogOut, Home, User, Settings,
  Search, Calendar, DollarSign, ArrowUpRight, ArrowDownRight,
  FileText, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AirpakLogo } from "@/components/AirpakLogo";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: string;
  status: string;
  method?: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface WalletData {
  balance: string;
  currency: string;
  totalSpent: string;
  totalTransactions: number;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
}

export default function Payment() {
  const [, navigate] = useLocation();
  const { resolvedTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("transactions");

  // Check auth and load payment data
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data.user) {
          navigate('/signin?redirect=/payment');
          return;
        }
        setUser(data.user);
        
        // Load wallet data
        return fetch('/api/payments/wallet', { credentials: 'include' }).then(r => r.json());
      })
      .then(walletData => {
        if (walletData) setWallet(walletData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Payment load error:', err);
        setError('Failed to load payment data');
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
      window.localStorage.removeItem('airpak_user');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const filteredTransactions = wallet?.transactions?.filter(t =>
    t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.amount?.includes(searchQuery)
  ) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: 'bg-green-500/10 text-green-600 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      failed: 'bg-red-500/10 text-red-600 border-red-500/20',
      refunded: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    };
    return variants[status?.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading payment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payments & Wallet</h1>
          <p className="text-muted-foreground">Manage your payment methods and view transaction history</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Wallet Balance</p>
                  <p className="text-2xl font-bold">{wallet?.balance || '£0.00'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{wallet?.totalSpent || '£0.00'}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{wallet?.totalTransactions || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View all your payments and refunds</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search transactions..."
                        className="pl-10 w-64"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Transaction ID</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Description</th>
                        <th className="text-left py-3 px-2">Method</th>
                        <th className="text-right py-3 px-2">Amount</th>
                        <th className="text-left py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map(t => (
                        <tr key={t.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-2 font-mono text-xs">{t.id}</td>
                          <td className="py-3 px-2 text-muted-foreground">
                            {new Date(t.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">{t.description}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline">{t.method || 'Card'}</Badge>
                          </td>
                          <td className="py-3 px-2 text-right font-medium">
                            <span className={t.type === 'credit' ? 'text-green-600' : ''}>
                              {t.type === 'credit' ? '+' : ''}{t.amount}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={getStatusBadge(t.status)}>
                              {t.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No transactions found</h3>
                      <p className="text-muted-foreground mt-1">
                        {searchQuery ? 'Try adjusting your search' : 'Your transaction history will appear here'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="methods">
            <div className="space-y-4">
              {wallet?.paymentMethods?.map(method => (
                <Card key={method.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{method.type} •••• {method.last4}</p>
                            {method.isDefault && (
                              <Badge variant="default" className="text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card>
                  <CardContent className="p-6 text-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No payment methods</h3>
                    <p className="text-muted-foreground mt-1">Add a card to make payments</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {wallet?.paymentMethods && wallet.paymentMethods.length > 0 && (
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add New Payment Method
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="invoices">
            <Card>
              <CardContent className="p-6 text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Invoices</h3>
                <p className="text-muted-foreground mt-1">Invoice management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
'''

with open('/mnt/agents/output/airpak-repair/Payment.tsx', 'w') as f:
    f.write(payment_fix)

