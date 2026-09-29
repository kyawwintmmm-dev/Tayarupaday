import React, { useState, useEffect } from 'react';
import { Header, AppTabType } from './components/Header';
import { LawExplorer } from './components/LawExplorer';
import { AILawyerAssistant } from './components/AILawyerAssistant';
import { CaseAnalyzer } from './components/CaseAnalyzer';
import { DraftGenerator } from './components/DraftGenerator';
import { BookmarksView } from './components/BookmarksView';
import { PrecedentsDatabase } from './components/PrecedentsDatabase';
import { LegalCalculators } from './components/LegalCalculators';
import { LegalDictionary } from './components/LegalDictionary';
import { LegalAidDirectory } from './components/LegalAidDirectory';
import { LegalQuizzes } from './components/LegalQuizzes';
import { LatestUpdates2026 } from './components/LatestUpdates2026';
import { SectionDetailModal } from './components/SectionDetailModal';
import { SpecialLawsModal } from './components/SpecialLawsModal';
import { MoreSettingsView } from './components/MoreSettingsView';
import { LawSection, SavedBookmark, ReadingHistoryItem } from './types';
import { LAW_SECTIONS } from './data/lawsData';
import { Scale } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabType>('explorer');
  const [selectedSection, setSelectedSection] = useState<LawSection | null>(null);
  const [isSpecialModalOpen, setIsSpecialModalOpen] = useState<boolean>(false);

  // App Theme & Font Size state
  const [appTheme, setAppTheme] = useState<'dark' | 'light' | 'system'>(() => {
    try {
      return (localStorage.getItem('myanmar_law_hub_theme') as any) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [appFontSize, setAppFontSize] = useState<'sm' | 'base' | 'lg' | 'xl' | '2xl'>(() => {
    try {
      return (localStorage.getItem('myanmar_law_hub_fontsize') as any) || 'base';
    } catch {
      return 'base';
    }
  });

  const [appLanguage, setAppLanguage] = useState<'my' | 'en'>(() => {
    try {
      return (localStorage.getItem('myanmar_law_hub_lang') as any) || 'my';
    } catch {
      return 'my';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('myanmar_law_hub_theme', appTheme);
    } catch (e) {
      console.error(e);
    }
  }, [appTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('myanmar_law_hub_fontsize', appFontSize);
    } catch (e) {
      console.error(e);
    }
  }, [appFontSize]);

  useEffect(() => {
    try {
      localStorage.setItem('myanmar_law_hub_lang', appLanguage);
    } catch (e) {
      console.error(e);
    }
  }, [appLanguage]);

  const getThemeClasses = () => {
    if (appTheme === 'light') {
      return 'bg-slate-100 text-slate-900';
    }
    return 'bg-slate-950 text-slate-100';
  };

  const getFontSizeClasses = () => {
    switch (appFontSize) {
      case 'sm':
        return 'text-xs sm:text-sm';
      case 'lg':
        return 'text-base sm:text-lg';
      case 'xl':
        return 'text-lg sm:text-xl';
      case '2xl':
        return 'text-xl sm:text-2xl';
      case 'base':
      default:
        return 'text-sm sm:text-base';
    }
  };

  // Reading History state with localStorage
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('myanmar_law_hub_reading_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('myanmar_law_hub_reading_history', JSON.stringify(readingHistory));
    } catch (e) {
      console.error('Failed to save reading history', e);
    }
  }, [readingHistory]);

  const handleRecordReadingHistory = (sec: LawSection) => {
    setReadingHistory((prev) => {
      const filtered = prev.filter((item) => item.sectionId !== sec.id);
      return [
        {
          id: `rh_${Date.now()}`,
          lawId: sec.lawId,
          sectionId: sec.id,
          lastReadAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 100);
    });
  };

  // Phase 29 - Parse Deep Link on load (e.g. #/law/penal_code/section/contract_act_10 or #/law/penal_code/section/penal_code_302)
  useEffect(() => {
    const handleDeepLink = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('/section/')) {
        const parts = hash.split('/section/');
        if (parts.length > 1) {
          const secId = parts[1].split('?')[0];
          const found = LAW_SECTIONS.find(
            (s) => s.id === secId || s.sectionNo.toLowerCase().includes(secId.toLowerCase())
          );
          if (found) {
            setSelectedSection(found);
          }
        }
      }
    };

    handleDeepLink();
    window.addEventListener('hashchange', handleDeepLink);
    return () => window.removeEventListener('hashchange', handleDeepLink);
  }, []);

  // AI Assistant initial prompt state
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiContext, setAiContext] = useState<string>('');

  // Bookmarks state with localStorage
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('myanmar_law_hub_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('myanmar_law_hub_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  }, [bookmarks]);

  // Toggle Bookmark
  const handleToggleBookmark = (sectionId: string, note?: string) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.sectionId === sectionId);
      if (exists) {
        if (note !== undefined && note !== exists.userNote) {
          // Update note
          return prev.map((b) => (b.sectionId === sectionId ? { ...b, userNote: note } : b));
        }
        // Remove
        return prev.filter((b) => b.sectionId !== sectionId);
      } else {
        // Add
        return [
          ...prev,
          {
            id: `bm_${Date.now()}`,
            sectionId,
            createdAt: new Date().toISOString(),
            userNote: note,
          },
        ];
      }
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Ask AI from section detail
  const handleAskAI = (prompt: string, lawContext: string) => {
    setAiPrompt(prompt);
    setAiContext(lawContext);
    setActiveTab('ai_assistant');
  };

  return (
    <div className={`min-h-screen flex flex-col font-myanmar selection:bg-amber-500 selection:text-slate-950 transition-colors duration-200 ${getThemeClasses()} ${getFontSizeClasses()}`}>
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'special_laws') {
            setIsSpecialModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenSearch={() => {
          setActiveTab('explorer');
        }}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab Views */}
        {activeTab === 'explorer' && (
          <LawExplorer
            onSelectSection={(sec) => {
              handleRecordReadingHistory(sec);
              setSelectedSection(sec);
            }}
            bookmarks={bookmarks}
            onOpenSpecialLaws={() => setIsSpecialModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'latest_updates' && (
          <LatestUpdates2026
            onAskAI={(prompt, context) => handleAskAI(prompt, context)}
          />
        )}

        {activeTab === 'precedents' && (
          <PrecedentsDatabase />
        )}

        {activeTab === 'ai_assistant' && (
          <AILawyerAssistant
            initialPrompt={aiPrompt}
            initialLawContext={aiContext}
          />
        )}

        {activeTab === 'case_analyzer' && (
          <CaseAnalyzer />
        )}

        {activeTab === 'draft_generator' && (
          <DraftGenerator />
        )}

        {activeTab === 'calculators' && (
          <LegalCalculators />
        )}

        {activeTab === 'dictionary' && (
          <LegalDictionary />
        )}

        {activeTab === 'legal_aid' && (
          <LegalAidDirectory />
        )}

        {activeTab === 'quizzes' && (
          <LegalQuizzes onNavigateTab={(tab) => setActiveTab(tab as any)} />
        )}

        {(activeTab === 'bookmarks' || activeTab === 'notes' || activeTab === 'history') && (
          <BookmarksView
            bookmarks={bookmarks}
            readingHistory={readingHistory}
            defaultTab={activeTab === 'notes' ? 'notes' : activeTab === 'history' ? 'history' : 'bookmarks'}
            onRemoveBookmark={handleRemoveBookmark}
            onClearReadingHistory={() => setReadingHistory([])}
            onSelectSection={(sec) => {
              handleRecordReadingHistory(sec);
              setSelectedSection(sec);
            }}
          />
        )}

        {activeTab === 'more' && (
          <MoreSettingsView
            onOpenSpecialLaws={() => setIsSpecialModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            currentTheme={appTheme}
            onThemeChange={(th) => setAppTheme(th)}
            fontSize={appFontSize}
            onFontSizeChange={(sz) => setAppFontSize(sz)}
            selectedLanguage={appLanguage}
            onLanguageChange={(lang) => setAppLanguage(lang)}
          />
        )}

      </main>

      {/* Section Detail Modal */}
      {selectedSection && (
        <SectionDetailModal
          section={selectedSection}
          allSections={LAW_SECTIONS}
          bookmarks={bookmarks || []}
          onClose={() => setSelectedSection(null)}
          onToggleBookmark={(secId, note) => handleToggleBookmark(secId, note)}
          onAskAI={(prompt, context) => handleAskAI(prompt, context)}
          onSelectSection={(sec) => {
            handleRecordReadingHistory(sec);
            setSelectedSection(sec);
          }}
        />
      )}

      {/* Special Laws Access Modal */}
      <SpecialLawsModal
        isOpen={isSpecialModalOpen}
        onClose={() => setIsSpecialModalOpen(false)}
        isUnlocked={true}
        onUnlockSpecialLaws={() => setIsSpecialModalOpen(false)}
      />

      {/* Footer & Phase 35 Legal Disclaimer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-8 text-xs text-slate-400 font-myanmar mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          
          {/* Phase 35 - LEGAL DISCLAIMER BLOCK */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 text-center space-y-2.5 max-w-4xl mx-auto shadow-xl">
            <div className="flex items-center justify-center space-x-2 text-amber-400 font-bold text-sm">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>⚖️ ဥပဒေဆိုင်ရာ အသိပညာပေး App ဖြစ်ပါသည်။</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              ဤ App တွင် ဖော်ပြထားသော ဥပဒေဆိုင်ရာအချက်အလက်များသည် အထွေထွေသိရှိနိုင်ရန်အတွက်သာ ဖြစ်ပြီး တရားဝင်ဥပဒေအကြံပေးချက်အဖြစ် မယူဆသင့်ပါ။
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              လက်တွေ့အမှုကိစ္စများအတွက် သက်ဆိုင်ရာ တရားဝင်ဥပဒေစာအုပ်၊ လက်ရှိပြင်ဆင်ချက်များနှင့် အရည်အချင်းပြည့်မီသော ဥပဒေပညာရှင်ထံမှ အတည်ပြုချက်ရယူရန် အကြံပြုပါသည်။
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/60">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-200">
                မြန်မာဥပဒေရေးရာ လက်စွဲ (Myanmar Law Hub Pro)
              </span>
            </div>

            <p className="text-slate-500 text-[11px]">
              ရာဇသတ်ကြီး၊ ပြစ်မှုကျင့်ထုံး၊ ဖွဲ့စည်းပုံ၊ စီရင်ထုံးများ၊ စာချုပ်စာတမ်း၊ ဥပဒေ တွက်ချက်စနစ်နှင့် အဘိဓာန်။
            </p>

            <div className="flex items-center space-x-3 text-slate-400">
              <button onClick={() => setIsSpecialModalOpen(true)} className="hover:text-amber-400 transition">
                အထူးဥပဒေများ
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab('ai_assistant')} className="hover:text-amber-400 transition">
                AI ဥပဒေအကြံပေး
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
