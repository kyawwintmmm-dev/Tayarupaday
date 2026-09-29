import React from 'react';
import { Scale, BookOpen, Bot, FileText, Bookmark, ShieldCheck, Sparkles, Search, Calculator, BookMarked, Users, Gavel, Newspaper, History, Grid, Brain } from 'lucide-react';

export type AppTabType =
  | 'explorer'
  | 'latest_updates'
  | 'precedents'
  | 'ai_assistant'
  | 'case_analyzer'
  | 'draft_generator'
  | 'calculators'
  | 'dictionary'
  | 'legal_aid'
  | 'quizzes'
  | 'bookmarks'
  | 'notes'
  | 'history'
  | 'special_laws'
  | 'more';

interface HeaderProps {
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenSearch }) => {
  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-md font-myanmar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Bar */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('explorer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  မြန်မာဥပဒေရေးရာ လက်စွဲ
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-sans">
                  Myanmar Law Hub Pro
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ဥပဒေပညာရှင်၊ ရှေ့နေများ၊ ဥပဒေကျောင်းသားများနှင့် ပြည်သူများအတွက် တရားဝင် ဥပဒေ အထောက်အကူပြုစနစ်
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenSearch}
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>ပုဒ်မ / ဥပဒေ ရှာရန်...</span>
              <kbd className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-sans">Ctrl+K</kbd>
            </button>

            <button
              onClick={() => setActiveTab('special_laws')}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-medium text-xs rounded-lg transition shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">အထူးဥပဒေများ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'explorer'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>ဥပဒေပေါင်းချုပ်</span>
          </button>

          <button
            onClick={() => setActiveTab('latest_updates')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'latest_updates'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-amber-400 hover:bg-slate-800 font-semibold'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>⚡ ၂၀၂၆ ဥပဒေသစ်များ</span>
          </button>

          <button
            onClick={() => setActiveTab('precedents')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'precedents'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>စီရင်ထုံးနှင့် ညွှန်ကြားချက်များ</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'ai_assistant'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>AI ဥပဒေ အကြံပေး</span>
          </button>

          <button
            onClick={() => setActiveTab('case_analyzer')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'case_analyzer'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>အမှုဖြစ်စဉ် သုံးသပ်မှု</span>
          </button>

          <button
            onClick={() => setActiveTab('draft_generator')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'draft_generator'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>စာချုပ်/လျှောက်လွှာ ရေးသားစနစ်</span>
          </button>

          <button
            onClick={() => setActiveTab('calculators')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'calculators'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>ဥပဒေ တွက်ချက်စနစ်များ</span>
          </button>

          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'dictionary'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>ဥပဒေ အဘိဓာန်</span>
          </button>

          <button
            onClick={() => setActiveTab('legal_aid')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'legal_aid'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ပြည်သူ့ အကူအညီ & FAQ</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'quizzes'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-amber-400 hover:bg-slate-800 hover:text-amber-300 font-semibold'
            }`}
          >
            <Brain className="w-4 h-4 text-amber-400" />
            <span>🧠 ဥပဒေ ဉာဏ်စမ်း</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Bookmark</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>ကျွန်ုပ်၏မှတ်စုများ</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>ဖတ်ရှုမှတ်တမ်း</span>
          </button>

          <button
            onClick={() => setActiveTab('more')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap border ${
              activeTab === 'more'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                : 'bg-slate-800/80 text-amber-400 border-amber-500/30 hover:bg-slate-800 hover:text-amber-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>နောက်ထပ်</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
