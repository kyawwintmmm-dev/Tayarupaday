import { useState, useMemo } from 'react';
import { MYANMAR_LAW_REPORTS, LAW_DIRECTIVES, AMENDING_ACTS } from '../data/precedentsData';
import { Precedent, LawDirective, AmendingAct } from '../types';
import { Search, Scale, FileText, Bell, BookOpen, ChevronRight, Copy, Check, Filter, Sparkles, ExternalLink } from 'lucide-react';

export const PrecedentsDatabase = () => {
  const [activeSubTab, setActiveSubTab] = useState<'mlr' | 'amendments' | 'directives'>('mlr');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Precedent | LawDirective | AmendingAct | null>(null);

  // Available MLR years
  const availableYears = useMemo(() => {
    const set = new Set(MYANMAR_LAW_REPORTS.map((p) => p.year));
    return Array.from(set).sort().reverse();
  }, []);

  // Filtered MLRs
  const filteredMlrs = useMemo(() => {
    return MYANMAR_LAW_REPORTS.filter((p) => {
      if (selectedYear !== 'all' && p.year !== selectedYear) return false;
      if (selectedCategory !== 'all' && p.category && !p.category.includes(selectedCategory)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m1 = p.citation.toLowerCase().includes(q);
        const m2 = p.title.toLowerCase().includes(q);
        const m3 = p.summary.toLowerCase().includes(q);
        const m4 = p.lawSectionRef?.toLowerCase().includes(q);
        return m1 || m2 || m3 || m4;
      }
      return true;
    });
  }, [selectedYear, selectedCategory, searchQuery]);

  // Filtered Directives
  const filteredDirectives = useMemo(() => {
    return LAW_DIRECTIVES.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.title.toLowerCase().includes(q) ||
          d.directiveNo.toLowerCase().includes(q) ||
          d.issuedBy.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  // Filtered Amendments
  const filteredAmendments = useMemo(() => {
    return AMENDING_ACTS.filter((a) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.mainLawTitle.toLowerCase().includes(q) ||
          a.amendingActTitle.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-myanmar text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>မြန်မာစကားပြန် စီရင်ထုံးများ နှင့် အမိန့်ညွှန်ကြားချက်များ</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                တရားလွှတ်တော်ချုပ် စီရင်ထုံးများ (MLR)၊ ခေတ်အလိုက် ပြင်ဆင်သည့် ဥပဒေများနှင့် ပြည်ထောင်စု ရှေ့နေချုပ်ရုံး ညွှန်ကြားလွှာများ။
              </p>
            </div>
          </div>

          {/* Sub Navigation Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('mlr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'mlr'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚖️ မြန်မာစကားပြန် စီရင်ထုံးများ
            </button>
            <button
              onClick={() => setActiveSubTab('amendments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'amendments'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📜 ပြင်ဆင်သည့် ဥပဒေများ
            </button>
            <button
              onClick={() => setActiveSubTab('directives')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'directives'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔔 အမိန့်နှင့် ညွှန်ကြားချက်များ
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="စီရင်ထုံး အကိုးအကား၊ ပုဒ်မ၊ နှစ် သို့မဟုတ် သော့ချက်စကားလုံး ရှာရန် (ဥပမာ - ၁၉၉၅ မတစ ၄၅၊ ပုဒ်မ ၄၂၀၊ အာမခံ)..."
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

        {activeSubTab === 'mlr' && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">ခုနှစ်အလိုက် ရှာရန်:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="all">နှစ် အားလုံး</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>{y} မတစ</option>
              ))}
            </select>

            <span className="text-slate-400 font-medium ml-2">အမျိုးအစား:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="all">အမျိုးအစား အားလုံး</option>
              <option value="ရာဇဝတ်">ရာဇဝတ်မှု စီရင်ထုံးများ</option>
              <option value="တရားမ">တရားမမှု စီရင်ထုံးများ</option>
              <option value="ဆိုက်ဘာ">ဆိုက်ဘာ / နည်းပညာ</option>
            </select>
          </div>
        )}
      </div>

      {/* Sub Tab Content */}

      {/* 1. MYANMAR LAW REPORTS (MLR) */}
      {activeSubTab === 'mlr' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <span>တွေ့ရှိသော စီရင်ထုံး အရေအတွက် - <strong className="text-amber-400">{filteredMlrs.length}</strong> ခု</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMlrs.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {item.citation}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {item.category || 'စီရင်ထုံး'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h3>

                  {item.lawSectionRef && (
                    <span className="text-[11px] text-slate-400 block font-medium">
                      📌 မှီးငြမ်းဥပဒေ: <strong className="text-slate-300">{item.lawSectionRef}</strong>
                    </span>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">တရားလွှတ်တော်ချုပ် ထုတ်ပြန်ချက်</span>
                  <button
                    onClick={() => handleCopy(item.id, `${item.citation} - ${item.title}\n${item.summary}`)}
                    className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'ကူးယူပြီး' : 'အကိုးအကား ကူးယူမည်'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. AMENDING ACTS */}
      {activeSubTab === 'amendments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAmendments.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {item.mainLawTitle}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ပြဋ္ဌာန်းခုနှစ် - {item.enactedYear}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">
                  {item.amendingActTitle}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <span className="font-semibold text-amber-300 block">အဓိက ပြင်ဆင်ချက်များ:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {item.keyChanges.map((kc, idx) => (
                      <li key={idx}>{kc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DIRECTIVES & NOTIFICATIONS */}
      {activeSubTab === 'directives' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredDirectives.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-400">{item.directiveNo}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{item.title}</h3>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-800 px-3 py-1 rounded-lg shrink-0">
                    ထုတ်ပြန်သည့် အဖွဲ့အစည်း - <strong className="text-slate-200">{item.issuedBy}</strong> ({item.date})
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  {item.fullText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
