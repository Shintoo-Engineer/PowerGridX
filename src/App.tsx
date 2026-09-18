import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { LoginView } from './components/auth/LoginView.tsx';
import { RegisterView } from './components/auth/RegisterView.tsx';
import { HowItWorksModal } from './components/auth/HowItWorksModal.tsx';
import { AppShell } from './components/layout/AppShell.tsx';

// Role Dashboards
import { ProsumerDashboard } from './components/prosumer/ProsumerDashboard.tsx';
import { SellSurplusWizard } from './components/prosumer/SellSurplusWizard.tsx';
import { MyEnergyAssets } from './components/prosumer/MyEnergyAssets.tsx';
import { MarketplaceView } from './components/marketplace/MarketplaceView.tsx';
import { TransactionsView } from './components/transactions/TransactionsView.tsx';
import { ContractsView } from './components/contracts/ContractsView.tsx';
import { WalletView } from './components/wallet/WalletView.tsx';
import { GridMapDashboard } from './components/grid/GridMapDashboard.tsx';
import { AIAssistantView } from './components/ai/AIAssistantView.tsx';
import { ProducerDashboard } from './components/producer/ProducerDashboard.tsx';
import { ConsumerDashboard } from './components/consumer/ConsumerDashboard.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { SettingsAndSupport } from './components/common/SettingsAndSupport.tsx';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [showSellWizard, setShowSellWizard] = useState(false);

  // If loading session, show clean loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-medium">Loading PowerGridX Platform...</span>
        </div>
      </div>
    );
  }

  // FIRST SCREEN: AUTHENTICATION (Section 3 Requirement)
  // When user is NOT authenticated, strictly display the PowerGridX Login / Register
  if (!isAuthenticated || !user) {
    return (
      <>
        {authView === 'LOGIN' ? (
          <LoginView
            onSwitchToRegister={() => setAuthView('REGISTER')}
            onOpenHowItWorks={() => setShowHowItWorks(true)}
          />
        ) : (
          <RegisterView
            onSwitchToLogin={() => setAuthView('LOGIN')}
            onOpenHowItWorks={() => setShowHowItWorks(true)}
          />
        )}

        {/* Informative Platform Guide Modal */}
        <HowItWorksModal
          isOpen={showHowItWorks}
          onClose={() => setShowHowItWorks(false)}
          onOpenRegister={() => {
            setShowHowItWorks(false);
            setAuthView('REGISTER');
          }}
        />
      </>
    );
  }

  // AUTHENTICATED USER INTERFACE
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        if (user.role === 'PROSUMER') {
          return (
            <ProsumerDashboard
              onNavigate={tab => {
                if (tab === 'sell-surplus') setShowSellWizard(true);
                else setCurrentTab(tab);
              }}
              onOpenSellWizard={() => setShowSellWizard(true)}
            />
          );
        }
        if (user.role === 'PRODUCER') {
          return (
            <ProducerDashboard
              onNavigate={setCurrentTab}
              onOpenSellWizard={() => setShowSellWizard(true)}
            />
          );
        }
        if (user.role === 'CONSUMER') {
          return <ConsumerDashboard onNavigate={setCurrentTab} />;
        }
        if (user.role === 'GRID_OPERATOR') {
          return <GridMapDashboard />;
        }
        if (user.role === 'ADMIN') {
          return <AdminDashboard />;
        }
        return (
          <ProsumerDashboard
            onNavigate={setCurrentTab}
            onOpenSellWizard={() => setShowSellWizard(true)}
          />
        );

      case 'my-energy':
      case 'generation':
      case 'assets':
        return <MyEnergyAssets />;

      case 'sell-surplus':
      case 'my-offers':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Surplus Energy Management</h2>
                <p className="text-xs text-slate-500">Create new offers or manage active listings.</p>
              </div>
              <button
                onClick={() => setShowSellWizard(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                + Open Sell Surplus Wizard
              </button>
            </div>
            <MarketplaceView onNavigateTab={setCurrentTab} />
          </div>
        );

      case 'buy-electricity':
      case 'marketplace':
        return <MarketplaceView onNavigateTab={setCurrentTab} />;

      case 'transactions':
        return <TransactionsView onNavigateTab={setCurrentTab} />;

      case 'contracts':
        return <ContractsView onNavigateTab={setCurrentTab} />;

      case 'earnings':
      case 'metering':
        return <WalletView onNavigateTab={setCurrentTab} />;

      case 'grid-map':
      case 'grid-overview':
      case 'congestion':
      case 'reports':
        return <GridMapDashboard />;

      case 'forecast':
        return (
          <AIAssistantView
            initialMode="FORECAST"
            onNavigateTab={setCurrentTab}
            onOpenSellWizard={() => setShowSellWizard(true)}
          />
        );

      case 'assistant':
        return (
          <AIAssistantView
            initialMode="ASSISTANT"
            onNavigateTab={setCurrentTab}
            onOpenSellWizard={() => setShowSellWizard(true)}
          />
        );

      case 'users':
      case 'verification':
      case 'audit-logs':
        return <AdminDashboard />;

      case 'settings':
        return <SettingsAndSupport mode="SETTINGS" />;

      case 'support':
      case 'notifications':
        return <SettingsAndSupport mode="SUPPORT" />;

      default:
        return (
          <ProsumerDashboard
            onNavigate={setCurrentTab}
            onOpenSellWizard={() => setShowSellWizard(true)}
          />
        );
    }
  };

  return (
    <AppShell currentTab={currentTab} onSelectTab={setCurrentTab}>
      {renderTabContent()}

      {/* Global Sell Surplus Wizard Dialog (Callable from anywhere) */}
      <SellSurplusWizard
        isOpen={showSellWizard}
        onClose={() => setShowSellWizard(false)}
        onOfferCreated={() => {
          setCurrentTab('marketplace');
        }}
      />
    </AppShell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
