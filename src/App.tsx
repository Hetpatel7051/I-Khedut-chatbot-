import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { EligibilityCalculator } from './components/EligibilityCalculator';
import { DocumentChecklistModal } from './components/DocumentChecklistModal';
import { QuickSchemeDrawer } from './components/QuickSchemeDrawer';
import { MarketPricesModal } from './components/MarketPricesModal';
import { OfflineStatusBanner } from './components/OfflineStatusBanner';
import { useChat } from './hooks/useChat';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { Scheme } from './types';

export function App() {
  const {
    language,
    setLanguage,
    messages,
    isLoading,
    farmerProfile,
    updateProfile,
    sendMessage,
    clearChat,
    currentlyPlayingAudioId,
    playAudio,
    stopAudioPlayback
  } = useChat();

  const { isOnline } = useNetworkStatus();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSchemesDrawerOpen, setIsSchemesDrawerOpen] = useState(false);
  const [isPricesModalOpen, setIsPricesModalOpen] = useState(false);
  const [activeChecklistScheme, setActiveChecklistScheme] = useState<Scheme | null>(null);

  const handleOpenChecklist = (scheme: Scheme) => {
    setActiveChecklistScheme(scheme);
  };

  const handleAskAIAboutScheme = (schemeName: string) => {
    sendMessage(`મને ${schemeName} યોજનાની સબસિડી, પાત્રતા અને ૭/૧૨ કાગળોની વિગતવાર માહિતી આપો.`, false);
  };

  return (
    <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-950 font-sans antialiased text-stone-900 dark:text-stone-100 overflow-hidden">
      {/* Offline Alert Banner (shown when connection drops or is poor) */}
      <OfflineStatusBanner isOnline={isOnline} language={language} />

      {/* Top Gujarat Gov Header with Navigation & Profile */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        farmerProfile={farmerProfile}
        isOnline={isOnline}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenSchemes={() => setIsSchemesDrawerOpen(true)}
        onOpenChecklist={() => {}}
        onOpenPrices={() => setIsPricesModalOpen(true)}
      />

      {/* Main Chat Interface */}
      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        language={language}
        farmerProfile={farmerProfile}
        currentlyPlayingAudioId={currentlyPlayingAudioId}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
        onPlayAudio={playAudio}
        onStopAudio={stopAudioPlayback}
        onOpenChecklist={handleOpenChecklist}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Farmer Profile Editor Modal */}
      <FarmerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={farmerProfile}
        onSave={updateProfile}
        language={language}
      />

      {/* Interactive Subsidy Calculator Modal */}
      <EligibilityCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        farmerProfile={farmerProfile}
        language={language}
        onAskAIAboutScheme={handleAskAIAboutScheme}
      />

      {/* Document Checklist & Print Modal */}
      <DocumentChecklistModal
        scheme={activeChecklistScheme}
        isOpen={!!activeChecklistScheme}
        onClose={() => setActiveChecklistScheme(null)}
        language={language}
      />

      {/* Quick Scheme Explorer Side Drawer */}
      <QuickSchemeDrawer
        isOpen={isSchemesDrawerOpen}
        onClose={() => setIsSchemesDrawerOpen(false)}
        language={language}
        onOpenChecklist={handleOpenChecklist}
      />

      {/* Full Gujarat APMC Market Crop Prices Modal */}
      <MarketPricesModal
        isOpen={isPricesModalOpen}
        onClose={() => setIsPricesModalOpen(false)}
        language={language}
      />
    </div>
  );
}

export default App;
