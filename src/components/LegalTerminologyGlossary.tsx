import React, { useState, useMemo } from 'react';
import { LegalDictionaryTerm } from '../types';
import { LEGAL_DICTIONARY_TERMS } from '../data/dictionaryData';
import { 
  Search, BookOpen, Scale, Sparkles, Filter, 
  Copy, Check, ChevronRight, BookMarked, HelpCircle, 
  ShieldCheck, FileText, Lightbulb, ArrowUpRight
} from 'lucide-react';

interface LegalTerminologyGlossaryProps {
  onSelectTerm?: (term: LegalDictionaryTerm) => void;
}

export const LegalTerminologyGlossary: React.FC<LegalTerminologyGlossaryProps> = ({ onSelectTerm }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTermDetail, setSelectedTermDetail] = useState<LegalDictionaryTerm | null>(null);

  const categories = [
    { id: 'All', label: 'အလုံးစုံ (All)' },
    { id: 'Criminal', label: 'ရာဇဝတ် (Criminal)' },
    { id: 'Civil', label: 'တရားမ (Civil)' },
    { id: 'Constitutional', label: 'ဖွဲ့စည်းပုံ (Constitutional)' },
    { id: 'Commercial', label: 'စီးပွားရေး (Commercial)' },
    { id: 'General', label: 'အထွေထွေ (General)' },
  ];

  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const filteredTerms = useMemo(() => {
    return LEGAL_DICTIONARY_TERMS.filter((term) => {
      // Search query filter
      const matchesSearch = 
        searchQuery === '' ||
        term.englishTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.myanmarTerm.includes(searchQuery) ||
        term.definition.includes(searchQuery) ||
        (term.exampleUsage && term.exampleUsage.includes(searchQuery));

      // Category filter
      const matchesCategory = 
        selectedCategory === 'All' || term.category === selectedCategory;

      // Letter filter
      const matchesLetter = 
        selectedLetter === 'All' || 
        term.englishTerm.toUpperCase().startsWith(selectedLetter);

      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [searchQuery, selectedCategory, selectedLetter]);

  const handleCopy = (term: LegalDictionaryTerm) => {
    const textToCopy = `${term.englishTerm} (${term.myanmarTerm})\n\nဖွင့်ဆိုချက်: ${term.definition}\n${term.exampleUsage ? `ဥပမာ: ${term.exampleUsage}` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(term.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Criminal':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Civil':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Constitutional':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Commercial':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6 font-myanmar max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>ဥပဒေ ဝေါဟာရနှင့် အဓိပ္ပာယ်ဖွင့်ဆိုချက်များ</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Legal Glossary
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                ရာဇသတ်ကြီးနှင့် ဥပဒေအသီးသီးပါ ခက်ခဲသော ဥပဒေ စကားလုံးများအား ပြည်သူများ လွယ်ကူစွာ နားလည်နိုင်ရန် ရှင်းလင်းဖော်ပြထားပါသည်။
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative pt-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="အင်္ဂလိပ် / မြန်မာ ဝေါဟာရ သို့မဟုတ် ဥပဒေစကားလုံး ရှာဖွေပါ (ဥပမာ - Bail, Cognizable, အာမခံ...)..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950/90 border border-slate-700 focus:border-amber-500 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills & Alphabet Bar */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          <Filter className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Alphabet Quick Jump Bar */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex items-center space-x-1 overflow-x-auto text-xs font-mono scrollbar-thin">
          <span className="text-slate-400 font-sans text-[11px] px-2 font-bold shrink-0">A-Z Jump:</span>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-2 py-1 rounded transition text-center shrink-0 ${
                selectedLetter === letter
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Result Stats */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          ဝေါဟာရ စုစုပေါင်း <span className="text-amber-400 font-bold">{filteredTerms.length}</span> ခု တွေ့ရှိပါသည်
        </span>
        {(selectedCategory !== 'All' || selectedLetter !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLetter('All');
            }}
            className="text-amber-400 hover:underline"
          >
            စစ်ထုတ်မှု အားလုံး ဖြုတ်မည်
          </button>
        )}
      </div>

      {/* Glossary Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">ရှာဖွေမှုနှင့် ကိုက်ညီသော ဝေါဟာရ မတွေ့ရှိပါ</h3>
          <p className="text-xs text-slate-400">
            အခြား စကားလုံးဖြင့် ထပ်မံ ရှာဖွေပါ သို့မဟုတ် စစ်ထုတ်မှုကို ပြန်လည် စတင်ပါ။
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((term) => (
            <div
              key={term.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 space-y-4 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Term Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base font-extrabold text-white tracking-tight">
                        {term.englishTerm}
                      </h2>
                      {term.paliTerm && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-sans">
                          {term.paliTerm}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-amber-400">
                      {term.myanmarTerm}
                    </p>
                  </div>

                  <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold shrink-0 ${getCategoryBadgeColor(term.category)}`}>
                    {term.category}
                  </span>
                </div>

                {/* Definition Body */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p>{term.definition}</p>
                  </div>

                  {term.exampleUsage && (
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="text-amber-400 font-bold block">📜 ဥပဒေ သုံးစွဲပုံ ဥပမာ -</span>
                      <p className="italic text-slate-300">{term.exampleUsage}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleCopy(term)}
                  className="flex items-center space-x-1.5 text-slate-400 hover:text-amber-400 transition"
                >
                  {copiedId === term.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">ကူးယူပြီးပါပြီ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>အချက်အလက် ကူးယူမည်</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedTermDetail(term)}
                  className="flex items-center space-x-1 text-amber-400 font-semibold hover:text-amber-300 transition"
                >
                  <span>အသေးစိတ် ကြည့်မည်</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Term Detail Modal */}
      {selectedTermDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${getCategoryBadgeColor(selectedTermDetail.category)}`}>
                  {selectedTermDetail.category} Law Term
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedTermDetail.englishTerm}
                </h3>
                <p className="text-base font-bold text-amber-400">
                  {selectedTermDetail.myanmarTerm}
                </p>
              </div>

              <button
                onClick={() => setSelectedTermDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">အဓိပ္ပာယ်ဖွင့်ဆိုချက် (Definition):</span>
                <p className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed">
                  {selectedTermDetail.definition}
                </p>
              </div>

              {selectedTermDetail.exampleUsage && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">ဥပဒေအရ လက်တွေ့ သုံးစွဲမှု (Example Usage):</span>
                  <p className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-amber-200 leading-relaxed">
                    {selectedTermDetail.exampleUsage}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTermDetail(null)}
                className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-amber-400 transition"
              >
                ပိတ်မည် (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
