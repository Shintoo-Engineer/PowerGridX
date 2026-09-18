import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Logo } from '../common/Logo.tsx';
import { PhysicalVsDigitalModal } from '../common/PhysicalVsDigitalModal.tsx';
import { AppNotification, UserRole } from '../../types/index.ts';
import {
  LayoutDashboard,
  Sun,
  Zap,
  ShoppingBag,
  Send,
  Receipt,
  Wallet,
  TrendingUp,
  Bot,
  Bell,
  Settings,
  FileText,
  Activity,
  MapPin,
  AlertTriangle,
  Users,
  CheckSquare,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Info,
  Shield,
  Home,
  Building2,
  Server,
  Layers,
  BarChart3
} from 'lucide-react';

interface AppShellProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentTab, onSelectTab, children }) => {
  const { user, logout, quickLoginAs } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', {
        headers: user ? { 'Authorization': `Bearer ${user.id}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: user ? { 'Authorization': `Bearer ${user.id}` } : {},
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Sidebar items mapped strictly to user role according to Sections 41-45
  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'PROSUMER':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'my-energy', label: 'My Energy (Solar)', icon: Sun },
          { id: 'sell-surplus', label: 'Sell Surplus', icon: Send, badge: 'Wizard' },
          { id: 'buy-electricity', label: 'Buy Electricity', icon: Zap },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          { id: 'my-offers', label: 'My Offers', icon: CheckSquare },
          { id: 'transactions', label: 'Transactions', icon: Receipt },
          { id: 'earnings', label: 'Earnings & Wallet', icon: Wallet },
          { id: 'forecast', label: 'AI Solar Forecast', icon: TrendingUp },
          { id: 'assistant', label: 'AI Energy Assistant', icon: Bot },
          { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadCount },
          { id: 'support', label: 'Help & Disputes', icon: LifeBuoy },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      case 'PRODUCER':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'generation', label: 'Generation Assets', icon: Activity },
          { id: 'sell-surplus', label: 'Create Offer', icon: Send },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          { id: 'my-offers', label: 'Active Offers', icon: CheckSquare },
          { id: 'contracts', label: 'Power Contracts (PPAs)', icon: FileText },
          { id: 'transactions', label: 'Transactions', icon: Receipt },
          { id: 'earnings', label: 'Revenue & Wallet', icon: Wallet },
          { id: 'forecast', label: 'Plant Forecast', icon: TrendingUp },
          { id: 'assistant', label: 'AI Energy Assistant', icon: Bot },
          { id: 'support', label: 'Help & Disputes', icon: LifeBuoy },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      case 'CONSUMER':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'buy-electricity', label: 'Buy Electricity', icon: Zap, badge: 'Match' },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
          { id: 'transactions', label: 'My Purchases', icon: Receipt },
          { id: 'my-energy', label: 'Energy Usage', icon: Activity },
          { id: 'contracts', label: 'Energy Contracts', icon: FileText },
          { id: 'earnings', label: 'Payments & Wallet', icon: Wallet },
          { id: 'assistant', label: 'AI Assistant', icon: Bot },
          { id: 'support', label: 'Help & Disputes', icon: LifeBuoy },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      case 'GRID_OPERATOR':
        return [
          { id: 'dashboard', label: 'Grid Dashboard', icon: LayoutDashboard },
          { id: 'grid-map', label: 'Interactive Grid Map', icon: MapPin, badge: 'Live' },
          { id: 'grid-overview', label: 'Generation & Demand', icon: Activity },
          { id: 'congestion', label: 'Congestion & Feeders', icon: AlertTriangle },
          { id: 'metering', label: 'Smart Meter Telemetry', icon: Server },
          { id: 'marketplace', label: 'Market Activity', icon: ShoppingBag },
          { id: 'reports', label: 'Dispatch Reports', icon: BarChart3 },
          { id: 'assistant', label: 'Grid AI Assistant', icon: Bot },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'verification', label: 'Verification Desk', icon: CheckSquare, badge: '2' },
          { id: 'assets', label: 'Energy Assets', icon: Sun },
          { id: 'marketplace', label: 'Marketplace Monitor', icon: ShoppingBag },
          { id: 'transactions', label: 'All Transactions', icon: Receipt },
          { id: 'grid-map', label: 'Grid Interconnection', icon: MapPin },
          { id: 'support', label: 'Complaints & Disputes', icon: LifeBuoy },
          { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'PROSUMER':
        return { label: 'Prosumer', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: Home };
      case 'PRODUCER':
        return { label: 'Producer', color: 'bg-amber-100 text-amber-900 border-amber-300', icon: Zap };
      case 'CONSUMER':
        return { label: 'Consumer', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Building2 };
      case 'GRID_OPERATOR':
        return { label: 'Grid Operator', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Server };
      case 'ADMIN':
        return { label: 'Administrator', color: 'bg-red-100 text-red-800 border-red-300', icon: Shield };
    }
  };

  const roleInfo = user ? getRoleBadge(user.role) : null;
  const RoleIcon = roleInfo?.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo size="sm" showTagline={false} />
            
            {/* Role Badge */}
            {roleInfo && RoleIcon && (
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleInfo.color}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{roleInfo.label}</span>
              </div>
            )}
          </div>

          {/* Center: Architecture Explainer Button & Search */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
            <button
              onClick={() => setShowArchModal(true)}
              className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors whitespace-nowrap shadow-2xs"
              title="View Digital Marketplace vs Physical Grid architecture"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Digital Market + Physical Grid</span>
            </button>
            
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search offers, assets, meters, or transactions..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-transparent rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Architecture button on mobile */}
            <button
              onClick={() => setShowArchModal(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              title="Architecture info"
            >
              <Layers className="w-5 h-5 text-emerald-600" />
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 text-[9px] font-bold text-white items-center justify-center"></span>
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="text-xs font-bold text-slate-900">Notifications ({notifications.length})</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[11px] text-emerald-600 hover:underline font-medium">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-2.5 rounded-lg border text-xs ${n.read ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-emerald-50/50 border-emerald-100 text-slate-900 font-medium'}`}>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span className="font-semibold text-emerald-700">{n.title}</span>
                            <span>{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {user?.name.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <span className="font-semibold text-slate-900 block truncate max-w-[130px]">{user?.name}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{user?.role.toLowerCase().replace('_', ' ')}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">Wallet: ₹{user?.walletBalance.toFixed(2)}</p>
                  </div>

                  {/* Switch Demo Role (Fast Testing) */}
                  <div className="py-2 border-b border-slate-100">
                    <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Switch Role (Prototype Test):
                    </span>
                    {(['PROSUMER', 'PRODUCER', 'CONSUMER', 'GRID_OPERATOR', 'ADMIN'] as UserRole[]).map(r => (
                      <button
                        key={r}
                        onClick={() => {
                          quickLoginAs(r);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                          user?.role === r ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="capitalize">{r.toLowerCase().replace('_', ' ')}</span>
                        {user?.role === r && <span className="text-[10px] text-emerald-600 font-bold">Active</span>}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body Layout: Sidebar + Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex gap-6">
        {/* Desktop Role-Specific Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-1">
            <div className="px-3 py-2 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {roleInfo?.label} Navigation
              </span>
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-white">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Consumer Solar Upgrade Banner */}
            {user?.role === 'CONSUMER' && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                  Have Rooftop Solar?
                </span>
                <p className="text-[11px] text-slate-700 leading-snug">
                  Add your solar capacity to become a Prosumer & sell surplus.
                </p>
                <button
                  onClick={() => onSelectTab('my-energy')}
                  className="mt-2 w-full py-1 text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  Add Solar Asset
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl p-4 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <Logo size="sm" showTagline={false} />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs ${
                          isActive ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">{item.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-xs text-red-600 font-semibold hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Global Architecture Explainer Modal */}
      <PhysicalVsDigitalModal
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />
    </div>
  );
};
