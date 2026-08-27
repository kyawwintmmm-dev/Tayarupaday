import { useState, useMemo } from 'react';
import { LEGAL_DICTIONARY_TERMS } from '../data/dictionaryData';
import { Search, BookOpen, Sparkles, Filter, Copy, Check, Hash } from 'lucide-react';

export const LegalDictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    return LEGAL_DICTIONARY_TERMS.filter((term) => {
      if (selectedCategory !== 'All' && term.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m1 = term.englishTerm.toLowerCase().includes(q);
        const m2 = term.myanmarTerm.toLowerCase().includes(q);
        const m3 = term.paliTerm?.toLowerCase().includes(q) || false;
        const m4 = term.definition.toLowerCase().includes(q);
        return m1 || m2 || m3 || m4;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-myanmar text-slate-100 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ဥပဒေ ဝေါဟာရ အဘိဓာန် (Legal Dictionary)</h2>
            <p className="text-xs text-slate-300 mt-1">
              အင်္ဂလိပ် - မြန်မာ - ပါဠိ ဥပဒေ ဝေါဟာရများ၊ အနက်ဖွင့်ဆိုချက်များ နှင့် တရားခွင် သုံးစွဲမှု သာဓကများ။
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="အင်္ဂလိပ်၊ မြန်မာ သို့မဟုတ် ပါဠိ ဝေါဟာရ ရှာရန် (ဥပမာ - Bail, အာမခံ, Cognizable, Habeas Corpus)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded"
            >
              ရှင်းလင်းမည်
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">ကဏ္ဍများ:</span>
          {['All', 'Criminal', 'Civil', 'Constitutional', 'Commercial', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat === 'All' ? 'အားလုံး' : cat === 'Criminal' ? 'ရာဇဝတ်ဥပဒေ' : cat === 'Civil' ? 'တရားမဥပဒေ' : cat === 'Constitutional' ? 'ဖွဲ့စည်းပုံဥပဒေ' : cat === 'Commercial' ? 'စီးပွားရေးဥပဒေ' : 'အထွေထွေ'}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Term Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {term.englishTerm}
                </span>
                <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                  {term.category}
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <h3 className="text-base font-bold text-white">
                  {term.myanmarTerm}
                </h3>
                {term.paliTerm && (
                  <span className="text-xs text-amber-300/80 italic bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    ပါဠိ - {term.paliTerm}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {term.definition}
              </p>

              {term.exampleUsage && (
                <div className="text-[11px] text-slate-400 pt-1">
                  💡 <strong className="text-slate-300">သုံးစွဲပုံ -</strong> {term.exampleUsage}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">ဥပဒေ ဝေါဟာရ</span>
              <button
                onClick={() => handleCopy(term.id, `${term.englishTerm} (${term.myanmarTerm})\n${term.definition}`)}
                className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium"
              >
                {copiedId === term.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === term.id ? 'ကူးယူပြီး' : 'ဝေါဟာရ ကူးယူမည်'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
