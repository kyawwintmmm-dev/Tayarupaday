import React, { useState, useMemo } from 'react';
import { LawSection, LawBookInfo, LawCategoryType, SavedBookmark } from '../types';
import { LAW_BOOKS, LAW_SECTIONS } from '../data/lawsData';
import { Search, Filter, BookOpen, ShieldAlert, Scale, ChevronRight, Lock, CheckCircle2, Bookmark } from 'lucide-react';

interface LawExplorerProps {
  onSelectSection: (section: LawSection) => void;
  bookmarks: SavedBookmark[];
  onOpenSpecialLaws: () => void;
}

export const LawExplorer: React.FC<LawExplorerProps> = ({
  onSelectSection,
  bookmarks,
  onOpenSpecialLaws,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBailable, setFilterBailable] = useState<string>('all');
  const [filterCognizable, setFilterCognizable] = useState<string>('all');
  const [onlyPrecedents, setOnlyPrecedents] = useState<boolean>(false);
  const [showAllBooks, setShowAllBooks] = useState<boolean>(false);

  // Filter logic
  const filteredSections = useMemo(() => {
    return LAW_SECTIONS.filter((section) => {
      // Category filter
      if (selectedCategory !== 'all' && section.lawCategory !== selectedCategory && section.lawId !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSectionNo = section.sectionNo.toLowerCase().includes(q);
        const matchesTitle = section.title.toLowerCase().includes(q);
        const matchesLawName = section.lawName.toLowerCase().includes(q);
        const matchesContent = section.content.toLowerCase().includes(q);
        const matchesTags = (section.tags || []).some((t) => t && t.toLowerCase().includes(q));

        if (!matchesSectionNo && !matchesTitle && !matchesLawName && !matchesContent && !matchesTags) {
          return false;
        }
      }

      // Bailable filter
      if (filterBailable === 'bailable' && !section.bailable?.includes('ရနိုင်သည်')) return false;
      if (filterBailable === 'non_bailable' && !section.bailable?.includes('မရနိုင်ပါ')) return false;

      // Cognizable filter
      if (filterCognizable === 'cognizable' && !section.cognizable?.includes('အာမခံမပါဘဲ ဖမ်းခွင့်ရှိ')) return false;

      // Precedents filter
      if (onlyPrecedents && (!section.precedents || section.precedents.length === 0)) return false;

      return true;
    });
  }, [selectedCategory, searchQuery, filterBailable, filterCognizable, onlyPrecedents]);

  return (
    <div className="space-y-6 font-myanmar text-slate-100">
      
      {/* Law Categories Banner */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-200">
              ဥပဒေပေါင်းချုပ် စာအုပ်များ ({LAW_BOOKS.length} အုပ်)
            </h2>
          </div>
          <button
            onClick={() => setShowAllBooks(!showAllBooks)}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg transition"
          >
            <span>{showAllBooks ? 'အကျဉ်းချုပ် ရုပ်သိမ်းမည်' : `စာအုပ်များအားလုံး ကြည့်မည် (${LAW_BOOKS.length})`}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllBooks ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {(showAllBooks ? LAW_BOOKS : LAW_BOOKS.slice(0, 4)).map((book) => (
            <div
              key={book.id}
              onClick={() => {
                if (!book.isFree) {
                  onOpenSpecialLaws();
                } else {
                  setSelectedCategory(book.id);
                }
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden group ${
                selectedCategory === book.id
                  ? 'bg-gradient-to-br from-amber-500/20 to-slate-900 border-amber-500/60 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 text-amber-400 group-hover:scale-105 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  book.isFree 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {book.isFree ? 'အခမဲ့ (Free)' : 'အထူးဥပဒေ'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-3 line-clamp-1 group-hover:text-amber-300 transition">
                {book.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-5">
                {book.description}
              </p>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                <span>ပြဋ္ဌာန်းခုနှစ် - {book.enactedYear}</span>
                <span className="text-amber-400 font-semibold">{book.sectionCount} ပုဒ်</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ပုဒ်မနံပါတ်၊ ဥပဒေအမည် သို့မဟုတ် သော့ချက်စကားလုံး ရှာရန် (ဥပမာ - ပုဒ်မ ၃၀၂၊ လိမ်လည်မှု၊ အာမခံ)..."
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

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap">အမျိုးအစား:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ဥပဒေအားလုံး ({LAW_SECTIONS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('penal_code')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'penal_code'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ရာဇသတ်ကြီး
          </button>
          <button
            onClick={() => setSelectedCategory('crpc')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'crpc'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ပြစ်မှုကျင့်ထုံး
          </button>
          <button
            onClick={() => setSelectedCategory('constitution')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'constitution'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ဖွဲ့စည်းပုံ (2008)
          </button>
          <button
            onClick={() => setSelectedCategory('contract_law')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'contract_law'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📜 စာချုပ်စာတမ်း
          </button>
          <button
            onClick={() => setSelectedCategory('corporate_business')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'corporate_business'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏢 စီးပွားရေး/ကုမ္ပဏီ
          </button>
          <button
            onClick={() => setSelectedCategory('labor_law')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'labor_law'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            👷 အလုပ်သမား
          </button>
          <button
            onClick={() => setSelectedCategory('ip_law')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'ip_law'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            💡 ဉာဏဗဟုသုတ
          </button>
          <button
            onClick={() => setSelectedCategory('cyber_digital')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'cyber_digital'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⚡ ဆိုက်ဘာ/နည်းပညာ
          </button>
          <button
            onClick={() => setSelectedCategory('special_laws')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'special_laws'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⚖️ အထူးဥပဒေများ
          </button>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400">စိစစ်ရန်:</span>
          
          <select
            value={filterBailable}
            onChange={(e) => setFilterBailable(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="all">အာမခံ အားလုံး</option>
            <option value="bailable">အာမခံ ရနိုင်သော ပုဒ်မများ</option>
            <option value="non_bailable">အာမခံ မရနိုင်သော ပုဒ်မများ</option>
          </select>

          <select
            value={filterCognizable}
            onChange={(e) => setFilterCognizable(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="all">ဖမ်းဆီးခွင့် အားလုံး</option>
            <option value="cognizable">ရဲက အာမခံမပါဘဲ ဖမ်းခွင့်ရှိ</option>
          </select>

          <button
            onClick={() => setOnlyPrecedents(!onlyPrecedents)}
            className={`px-3 py-1 rounded-lg border text-xs transition ${
              onlyPrecedents
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            ⚖️ စီရင်ထုံး ပါရှိသော ပုဒ်မများသာ
          </button>
        </div>

      </div>

      {/* Sections Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs text-slate-400">
            တွေ့ရှိသော ဥပဒေပုဒ်မ အရေအတွက် - <strong className="text-amber-400">{filteredSections.length}</strong> ပုဒ်
          </span>
        </div>

        {filteredSections.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-amber-500/50 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">ရှာဖွေမှုနှင့် ကိုက်ညီသော ဥပဒေပုဒ်မ မရှိပါ</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              ရှာဖွေသည့် စကားလုံးကို ပြင်ဆင်၍ သို့မဟုတ် စိစစ်ချက်များ ရှင်းလင်း၍ ပြန်လည် ကြိုးစားကြည့်ပါ။
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSections.map((section) => {
              const safeBookmarks = bookmarks || [];
              const isBookmarked = safeBookmarks.some((b) => b?.sectionId === section.id);
              return (
                <div
                  key={section.id}
                  onClick={() => onSelectSection(section)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition cursor-pointer flex flex-col justify-between group hover:shadow-xl hover:shadow-amber-500/5 relative"
                >
                  <div className="space-y-3">
                    {/* Top Law Title & Bookmarked indicator */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                        {section.lawName}
                      </span>
                      {isBookmarked && (
                        <span className="flex items-center space-x-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Bookmark className="w-3 h-3 fill-amber-400" />
                          <span>မှတ်တမ်းဝင်</span>
                        </span>
                      )}
                    </div>

                    {/* Section Number & Title */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition flex items-center space-x-2">
                        <span className="text-amber-400">{section.sectionNo}</span>
                        <span>- {section.title}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        📌 {section.chapter}
                      </p>
                    </div>

                    {/* Content Snippet */}
                    <p className="text-xs text-slate-300 line-clamp-3 leading-5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {section.content}
                    </p>
                  </div>

                  {/* Badges & Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded font-medium ${
                        section.bailable?.includes('ရနိုင်သည်')
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {section.bailable?.includes('ရနိုင်သည်') ? 'အာမခံ ရနိုင်' : 'အာမခံ မရနိုင်'}
                      </span>

                      {section.precedents && section.precedents.length > 0 && (
                        <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                          ⚖️ {section.precedents.length} စီရင်ထုံး
                        </span>
                      )}
                    </div>

                    <span className="text-amber-400 font-semibold flex items-center group-hover:translate-x-1 transition">
                      အသေးစိတ် ကြည့်မည်
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
