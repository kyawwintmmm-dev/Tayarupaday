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
import { LatestUpdates2026 } from './components/LatestUpdates2026';
import { SectionDetailModal } from './components/SectionDetailModal';
import { SpecialLawsModal } from './components/SpecialLawsModal';
import { LawSection, SavedBookmark } from './types';
import { Scale } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabType>('explorer');
  const [selectedSection, setSelectedSection] = useState<LawSection | null>(null);
  const [isSpecialModalOpen, setIsSpecialModalOpen] = useState<boolean>(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-myanmar selection:bg-amber-500 selection:text-slate-950">
      
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
            onSelectSection={(sec) => setSelectedSection(sec)}
            bookmarks={bookmarks}
            onOpenSpecialLaws={() => setIsSpecialModalOpen(true)}
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

        {activeTab === 'bookmarks' && (
          <BookmarksView
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            onSelectSection={(sec) => setSelectedSection(sec)}
          />
        )}

      </main>

      {/* Section Detail Modal */}
      {selectedSection && (
        <SectionDetailModal
          section={selectedSection}
          bookmarks={bookmarks || []}
          onClose={() => setSelectedSection(null)}
          onToggleBookmark={(note) => handleToggleBookmark(selectedSection.id, note)}
          onAskAI={(prompt, context) => handleAskAI(prompt, context)}
        />
      )}

      {/* Special Laws Access Modal */}
      <SpecialLawsModal
        isOpen={isSpecialModalOpen}
        onClose={() => setIsSpecialModalOpen(false)}
        onUnlock={() => setIsSpecialModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 text-center text-xs text-slate-400 font-myanmar mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">
              မြန်မာဥပဒေရေးရာ လက်စွဲ (Myanmar Law Hub Pro)
            </span>
          </div>

          <p className="text-slate-500">
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
      </footer>

    </div>
  );
}
