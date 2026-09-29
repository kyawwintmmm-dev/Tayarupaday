import React, { useState, useMemo } from 'react';
import { LawSection, LawBookInfo, SavedBookmark } from '../types';
import { LAW_BOOKS, LAW_SECTIONS } from '../data/lawsData';
import { AppTabType } from './Header';
import { 
  Search, Filter, BookOpen, Scale, ChevronRight, Download, 
  ListOrdered, Layers, Tag, Calendar, FileText, CheckSquare, Square, 
  ArrowLeft, RotateCcw, Sparkles, Bookmark, History, Bot, BookMarked, ShieldAlert
} from 'lucide-react';

interface LawExplorerProps {
  onSelectSection: (section: LawSection) => void;
  bookmarks: SavedBookmark[];
  onOpenSpecialLaws: () => void;
  onNavigateTab?: (tab: AppTabType) => void;
}

export const LawExplorer: React.FC<LawExplorerProps> = ({
  onSelectSection,
  bookmarks,
  onOpenSpecialLaws,
  onNavigateTab,
}) => {
  // Navigation & View Modes
  const [selectedLawBook, setSelectedLawBook] = useState<LawBookInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Phase 24 - Chapter & Range TOC Filter
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<string>('all');

  // Quick Attribute Filters
  const [filterBailable, setFilterBailable] = useState<string>('all');
  const [filterCognizable, setFilterCognizable] = useState<string>('all');
  const [onlyPrecedents, setOnlyPrecedents] = useState<boolean>(false);
  const [showAllBooks, setShowAllBooks] = useState<boolean>(false);

  // Phase 30 & 32 - Advanced Global Search Engine Filters
  const [isAdvancedSearch, setIsAdvancedSearch] = useState<boolean>(false);
  const [selectedResultTab, setSelectedResultTab] = useState<'all' | 'laws' | 'sections' | 'books' | 'pdf' | 'other'>('all');
  
  // Checkbox Filters for Types (Phase 32)
  const [typeFilters, setTypeFilters] = useState<{ laws: boolean; sections: boolean; books: boolean; pdf: boolean }>({
    laws: true,
    sections: true,
    books: true,
    pdf: true,
  });

  // Checkbox Filters for Domain Categories (Phase 32)
  const [domainFilters, setDomainFilters] = useState<{
    criminal: boolean;
    civil: boolean;
    land: boolean;
    labor: boolean;
    company: boolean;
    tax: boolean;
    family: boolean;
    other: boolean;
  }>({
    criminal: true,
    civil: true,
    land: true,
    labor: true,
    company: true,
    tax: true,
    family: true,
    other: true,
  });

  // Year Filter
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');

  // Download law book as text file with UTF-8 BOM
  const handleDownloadBook = (e: React.MouseEvent, book: LawBookInfo) => {
    e.stopPropagation();
    const bookSections = LAW_SECTIONS.filter(
      (sec) => sec.lawCategory === book.id || sec.lawId === book.id
    );

    let content = `=== ${book.title} ===\n`;
    content += `အင်္ဂလိပ်အမည်: ${book.enTitle}\n`;
    content += `ပြဋ္ဌာန်းခုနှစ်: ${book.enactedYear}\n`;
    content += `ဖော်ပြချက်: ${book.description}\n`;
    content += `ပုဒ်မ အရေအတွက်: ${book.sectionCount} ပုဒ်\n`;
    content += `\n===============================================\n\n`;

    if (bookSections.length > 0) {
      bookSections.forEach((sec, idx) => {
        content += `${idx + 1}။ ${sec.lawName} - ${sec.sectionNo} (${sec.title})\n`;
        content += `အခန်း: ${sec.chapter}\n`;
        if (sec.cognizable) content += `ဖမ်းဆီးနိုင်ခွင့်: ${sec.cognizable}\n`;
        if (sec.bailable) content += `အာမခံ: ${sec.bailable}\n`;
        if (sec.compoundable) content += `ကျေအေးခွင့်: ${sec.compoundable}\n`;
        content += `\n[ဥပဒေ စာသား]\n${sec.content}\n`;
        if (sec.explanation) content += `\n[ရှင်းလင်းချက်နှင့် သာဓက]\n${sec.explanation}\n`;
        if (sec.punishment) content += `\n[ပြစ်ဒဏ်]\n${sec.punishment}\n`;
        if (sec.precedents && sec.precedents.length > 0) {
          content += `\n[တရားစီရင်ထုံးများ]\n`;
          sec.precedents.forEach((p) => {
            content += `- ${p.citation} (${p.year}): ${p.summary}\n`;
          });
        }
        content += `\n-----------------------------------------------\n\n`;
      });
    } else {
      content += `ဤဥပဒေစာအုပ်နှင့် သက်ဆိုင်သော အကျဉ်းချုပ် ပုဒ်မများနှင့် ဥပဒေရေးရာ အချက်အလက်များကို အက်ပလီကေးရှင်းတွင် တိုက်ရိုက် ကြည့်ရှုနိုင်ပါသည်။\n`;
    }

    const utf8Bom = '\uFEFF';
    const blob = new Blob([utf8Bom + content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.title.replace(/[/\\?%*:|"<>]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to get active law book sections
  const activeBookSections = useMemo(() => {
    if (!selectedLawBook) return LAW_SECTIONS;
    return LAW_SECTIONS.filter(
      (s) => s.lawId === selectedLawBook.id || s.lawCategory === selectedLawBook.id || s.lawName.includes(selectedLawBook.title)
    );
  }, [selectedLawBook]);

  // Extract Table of Contents Chapters (Phase 24)
  const chaptersList = useMemo(() => {
    const chaptersSet = new Set<string>();
    activeBookSections.forEach((s) => {
      if (s.chapter) chaptersSet.add(s.chapter);
    });
    return Array.from(chaptersSet);
  }, [activeBookSections]);

  // Main Filtered Sections Logic (Phases 21, 22, 24, 30, 31, 32)
  const filteredSections = useMemo(() => {
    return LAW_SECTIONS.filter((section) => {
      // Law Book Filter
      if (selectedLawBook && section.lawId !== selectedLawBook.id && section.lawCategory !== selectedLawBook.id && !section.lawName.includes(selectedLawBook.title)) {
        return false;
      }

      // Category filter (if no book is selected)
      if (!selectedLawBook && selectedCategory !== 'all' && section.lawCategory !== selectedCategory && section.lawId !== selectedCategory) {
        return false;
      }

      // Phase 24 Chapter Filter
      if (selectedChapter !== 'all' && section.chapter !== selectedChapter) {
        return false;
      }

      // Phase 24 Range Filter (e.g. 1-10, 11-20, 21-50, etc.)
      if (selectedRange !== 'all') {
        const numMatch = section.sectionNo.match(/\d+/);
        if (numMatch) {
          const secNum = parseInt(numMatch[0], 10);
          if (selectedRange === '1-10' && (secNum < 1 || secNum > 10)) return false;
          if (selectedRange === '11-30' && (secNum < 11 || secNum > 30)) return false;
          if (selectedRange === '31-100' && (secNum < 31 || secNum > 100)) return false;
          if (selectedRange === '101-300' && (secNum < 101 || secNum > 300)) return false;
          if (selectedRange === '301-511' && (secNum < 301 || secNum > 511)) return false;
        }
      }

      // Phase 32 - Advanced Domain Category Checkbox Filter
      if (isAdvancedSearch) {
        const cat = section.lawCategory;
        if (cat === 'penal_code' || cat === 'crpc') {
          if (!domainFilters.criminal) return false;
        } else if (cat === 'contract_law') {
          if (!domainFilters.civil) return false;
        } else if (cat === 'corporate_business') {
          if (!domainFilters.company) return false;
        } else if (cat === 'labor_law') {
          if (!domainFilters.labor) return false;
        } else if (!domainFilters.other) {
          return false;
        }

        // Year filter
        if (selectedYearFilter !== 'all') {
          if (selectedYearFilter === '1860' && !section.effectiveDate?.includes('၁၈၆၀') && !section.lawName.includes('၁၈၆၀') && !section.lawName.includes('1860')) return false;
          if (selectedYearFilter === '1898' && !section.effectiveDate?.includes('၁၈၉၈') && !section.lawName.includes('၁၈၉၈') && !section.lawName.includes('1898')) return false;
          if (selectedYearFilter === '2008' && !section.effectiveDate?.includes('၂၀၀၈') && !section.lawName.includes('၂၀၀၈')) return false;
          if (selectedYearFilter === '2026' && !section.effectiveDate?.includes('၂၀၂၆') && !section.lawName.includes('၂၀၂၆')) return false;
        }
      }

      // Search Query (Phase 22 - Section Number, Title, Law Text, Keywords)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        
        // Convert digits to handle both Myanmar & English numerals
        const qDigitsOnly = q.replace(/[^\d]/g, '');
        const secDigitsOnly = section.sectionNo.replace(/[^\d]/g, '');

        const matchesDigit = qDigitsOnly && secDigitsOnly && secDigitsOnly.includes(qDigitsOnly);
        const matchesSectionNo = section.sectionNo.toLowerCase().includes(q);
        const matchesTitle = section.title.toLowerCase().includes(q);
        const matchesLawName = section.lawName.toLowerCase().includes(q);
        const matchesContent = section.content.toLowerCase().includes(q);
        const matchesChapter = section.chapter.toLowerCase().includes(q);
        const matchesTags = (section.tags || []).some((t) => t && t.toLowerCase().includes(q));

        if (!matchesDigit && !matchesSectionNo && !matchesTitle && !matchesLawName && !matchesContent && !matchesChapter && !matchesTags) {
          return false;
        }
      }

      // Quick Attribute Filters
      if (filterBailable === 'bailable' && !section.bailable?.includes('ရနိုင်သည်')) return false;
      if (filterBailable === 'non_bailable' && !section.bailable?.includes('မရနိုင်ပါ')) return false;
      if (filterCognizable === 'cognizable' && !section.cognizable?.includes('အာမခံမပါဘဲ ဖမ်းခွင့်ရှိ')) return false;
      if (onlyPrecedents && (!section.precedents || section.precedents.length === 0)) return false;

      return true;
    });
  }, [
    selectedLawBook, selectedCategory, selectedChapter, selectedRange, searchQuery, 
    filterBailable, filterCognizable, onlyPrecedents, isAdvancedSearch, domainFilters, selectedYearFilter
  ]);

  // Phase 30 Global Search Categorized Results
  const globalMatchingBooks = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return LAW_BOOKS.filter(
      (b) => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.enTitle.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Keyword Highlighting Helper for Search Results (Phase 31)
  const renderHighlightedSnippet = (text: string, query: string) => {
    if (!query.trim()) return text;
    const q = query.trim();
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-amber-400 text-slate-950 font-bold px-1 py-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6 font-myanmar text-slate-100">
      
      {/* Header View Context Notice */}
      {selectedLawBook ? (
        /* Phase 21 - Legal Article System View Header */
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setSelectedLawBook(null);
                setSelectedChapter('all');
                setSelectedRange('all');
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ဥပဒေပေါင်းချုပ် စာအုပ်များသို့ ပြန်သွားမည်</span>
            </button>

            <button
              onClick={(e) => handleDownloadBook(e, selectedLawBook)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition shadow"
            >
              <Download className="w-4 h-4" />
              <span>ဥပဒေစာအုပ် စာသားတစ်ခုလုံး Download ရယူမည်</span>
            </button>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold mb-1">
              <span>{selectedLawBook.enTitle}</span>
              <span>•</span>
              <span>ပြဋ္ဌာန်းခုနှစ် - {selectedLawBook.enactedYear}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {selectedLawBook.title}
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-6">
              {selectedLawBook.description}
            </p>
          </div>

          {/* Phase 24 - Table of Contents (TOC) Chapter & Range Filter */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
              <ListOrdered className="w-4 h-4" />
              <span>📖 ပုဒ်မ မာတိကာ (Table of Contents - Chapter & Range System)</span>
            </div>

            {/* Chapters Bar */}
            {chaptersList.length > 0 && (
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                <span className="text-slate-400 shrink-0 font-medium">အခန်းများ:</span>
                <button
                  onClick={() => setSelectedChapter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition ${
                    selectedChapter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  အခန်း အားလုံး ({chaptersList.length})
                </button>
                {chaptersList.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedChapter(chap)}
                    className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition ${
                      selectedChapter === chap
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {chap}
                  </button>
                ))}
              </div>
            )}

            {/* Section Ranges Bar */}
            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs scrollbar-none">
              <span className="text-slate-400 shrink-0 font-medium">ပုဒ်မ အပိုင်းအခြား:</span>
              {[
                { id: 'all', label: 'ပုဒ်မ အားလုံး' },
                { id: '1-10', label: 'ပုဒ်မ ၁ မှ ၁၀' },
                { id: '11-30', label: 'ပုဒ်မ ၁၁ မှ ၃၀' },
                { id: '31-100', label: 'ပုဒ်မ ၃၁ မှ ၁၀၀' },
                { id: '101-300', label: 'ပုဒ်မ ၁၀၁ မှ ၃၀၀' },
                { id: '301-511', label: 'ပုဒ်မ ၃၀၁ မှ ၅၁၁+' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setSelectedRange(range.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition ${
                    selectedRange === range.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Home Main Sections Quick Navigation & Law Books Overview */
        <div className="space-y-6">
          
          {/* Main Sections Navigation Grid */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>ပင်မ အဓိက ကဏ္ဍကြီးများ (Main Sections)</span>
              </h2>
              <span className="text-[11px] text-slate-400">စနစ်တကျ လျင်မြန်စွာ ဝင်ရောက်နိုင်ပါသည်</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                {
                  id: 'laws',
                  icon: Scale,
                  title: '⚖️ ဥပဒေများ',
                  desc: 'ရာဇသတ်ကြီး၊ ကျင့်ထုံး၊ ဖွဲ့စည်းပုံ',
                  action: () => {
                    setSelectedLawBook(null);
                    setSelectedCategory('all');
                  },
                },
                {
                  id: 'sections',
                  icon: BookOpen,
                  title: '📖 ပုဒ်မများ',
                  desc: 'ပုဒ်မအလိုက် အသေးစိတ် ဖတ်ရှုရန်',
                  action: () => {
                    const el = document.getElementById('sections-results-list');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  },
                },
                {
                  id: 'books',
                  icon: BookMarked,
                  title: '📚 အခမဲ့စာအုပ်များ',
                  desc: 'အခမဲ့ ဒေါင်းလုဒ် ဖတ်ရှုနိုင်သော စာအုပ်များ',
                  action: () => setShowAllBooks(true),
                },
                {
                  id: 'search',
                  icon: Search,
                  title: '🔍 ဥပဒေရှာရန်',
                  desc: 'အဆင့်မြှင့် ရှာဖွေရေး အင်ဂျင်',
                  action: () => {
                    const el = document.getElementById('global-search-input');
                    if (el) el.focus();
                  },
                },
                {
                  id: 'bookmarks',
                  icon: Bookmark,
                  title: '🔖 Bookmark',
                  desc: 'သိမ်းဆည်းထားသော ပုဒ်မများ',
                  action: () => onNavigateTab?.('bookmarks'),
                },
                {
                  id: 'notes',
                  icon: FileText,
                  title: '📝 ကျွန်ုပ်၏မှတ်စုများ',
                  desc: 'ရှေ့နေ လျှောက်လဲချက် မှတ်စုများ',
                  action: () => onNavigateTab?.('notes'),
                },
                {
                  id: 'history',
                  icon: History,
                  title: '🕘 ဖတ်ရှုမှတ်တမ်း',
                  desc: 'မကြာသေးမီက ကြည့်ရှုခဲ့သည်များ',
                  action: () => onNavigateTab?.('history'),
                },
                {
                  id: 'ai_assistant',
                  icon: Bot,
                  title: '🤖 AI Legal Assistant',
                  desc: 'ဥပဒေရေးရာ AI မေးမြန်းရန်',
                  action: () => onNavigateTab?.('ai_assistant'),
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition group space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition shrink-0" />
                      <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Law Books Banner Overview */}
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
                    setSelectedLawBook(book);
                    setSelectedCategory(book.id);
                  }
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden group ${
                  selectedLawBook?.id === book.id || selectedCategory === book.id
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
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-400 font-semibold">{book.sectionCount} ပုဒ်</span>
                    <button
                      onClick={(e) => handleDownloadBook(e, book)}
                      title="စာအုပ် စာသားများ ဒေါင်းလုဒ်ယူရန် (Download TXT)"
                      className="p-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 transition flex items-center space-x-1 text-[10px] font-semibold px-2"
                    >
                      <Download className="w-3 h-3" />
                      <span>ဒေါင်းလုဒ်</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

      {/* Phase 30 & 32 - Search & Advanced Filter Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ပုဒ်မနံပါတ်၊ ဥပဒေအမည် သို့မဟုတ် သော့ချက်စကားလုံး ရှာရန် (ဥပမာ - 302၊ ခိုးမှု၊ အာမခံ၊ ရာဇသတ်ကြီး)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-24 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md"
              >
                ရှင်းလင်းမည်
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
            className={`flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl border text-xs font-semibold transition ${
              isAdvancedSearch
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>အဆင့်မြှင့် စိစစ်မှု (Advanced Filter)</span>
          </button>
        </div>

        {/* Phase 32 - Advanced Checkbox Filters Panel */}
        {isAdvancedSearch && (
          <div className="bg-slate-950/90 border border-amber-500/30 p-4 rounded-xl space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                <Filter className="w-4 h-4" />
                <span>အဆင့်မြှင့် စိစစ်မှု စည်းမျဉ်းများ (Advanced Search & Filters)</span>
              </span>
              <button
                onClick={() => {
                  setTypeFilters({ laws: true, sections: true, books: true, pdf: true });
                  setDomainFilters({ criminal: true, civil: true, land: true, labor: true, company: true, tax: true, family: true, other: true });
                  setSelectedYearFilter('all');
                  setFilterBailable('all');
                  setFilterCognizable('all');
                  setOnlyPrecedents(false);
                }}
                className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>မူလအတိုင်း ပြန်ထားမည်</span>
              </button>
            </div>

            {/* Type Checkboxes */}
            <div className="space-y-1.5">
              <span className="text-slate-400 font-semibold block">အမျိုးအစား စိစစ်ရန် (Type Filter):</span>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'laws', label: '📕 ဥပဒေများ' },
                  { key: 'sections', label: '📖 ပုဒ်မများ' },
                  { key: 'books', label: '📚 စာအုပ်များ' },
                  { key: 'pdf', label: '📄 PDF / ပြဋ္ဌာန်းချက်များ' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center space-x-1.5 cursor-pointer text-slate-200">
                    <input
                      type="checkbox"
                      checked={typeFilters[item.key as keyof typeof typeFilters]}
                      onChange={(e) =>
                        setTypeFilters({ ...typeFilters, [item.key]: e.target.checked })
                      }
                      className="accent-amber-500 rounded"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Checkboxes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 font-semibold block">ဥပဒေနယ်ပယ် (Category Domain Filter):</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'criminal', label: '☐ ပြစ်မှုဆိုင်ရာ' },
                  { key: 'civil', label: '☐ တရားမ / စာချုပ်' },
                  { key: 'land', label: '☐ မြေယာ / ပိုင်ဆိုင်မှု' },
                  { key: 'labor', label: '☐ အလုပ်သမား' },
                  { key: 'company', label: '☐ ကုမ္ပဏီ / စီးပွားရေး' },
                  { key: 'tax', label: '☐ အခွန် / ဘဏ္ဍာရေး' },
                  { key: 'family', label: '☐ မိသားစု / လက်ထပ်' },
                  { key: 'other', label: '☐ အခြား အထူးဥပဒေများ' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={domainFilters[item.key as keyof typeof domainFilters]}
                      onChange={(e) =>
                        setDomainFilters({ ...domainFilters, [item.key]: e.target.checked })
                      }
                      className="accent-amber-500 rounded"
                    />
                    <span>{item.label.replace('☐ ', '')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 font-semibold">ပြဋ္ဌာန်းခုနှစ် စိစစ်ရန် (Enacted Year):</span>
              <select
                value={selectedYearFilter}
                onChange={(e) => setSelectedYearFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
              >
                <option value="all">ခုနှစ် အားလုံး</option>
                <option value="1860">၁၈၆၀ (ရာဇသတ်ကြီး)</option>
                <option value="1898">၁၈၉၈ (ပြစ်မှုကျင့်ထုံး)</option>
                <option value="2008">၂၀၀၈ (ဖွဲ့စည်းပုံ)</option>
                <option value="2026">၂၀၂၆ (ဥပဒေသစ်များ)</option>
              </select>
            </div>
          </div>
        )}

        {/* Category Tabs (When not viewing a single book) */}
        {!selectedLawBook && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap">အမျိုးအစား:</span>
            {[
              { id: 'all', label: `ဥပဒေအားလုံး (${LAW_SECTIONS.length})` },
              { id: 'penal_code', label: 'ရာဇသတ်ကြီး' },
              { id: 'crpc', label: 'ပြစ်မှုကျင့်ထုံး' },
              { id: 'constitution', label: 'ဖွဲ့စည်းပုံ (2008)' },
              { id: 'contract_law', label: '📜 စာချုပ်စာတမ်း' },
              { id: 'corporate_business', label: '🏢 စီးပွားရေး/ကုမ္ပဏီ' },
              { id: 'labor_law', label: '👷 အလုပ်သမား' },
              { id: 'ip_law', label: '💡 ဉာဏဗဟုသုတ' },
              { id: 'cyber_digital', label: '⚡ ဆိုက်ဘာ/နည်းပညာ' },
              { id: 'special_laws', label: '⚖️ အထူးဥပဒေများ' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400">အမြန်စိစစ်ရန်:</span>
          
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

      {/* Phase 30 & 31 - Global Search Categorized Results Banner */}
      {searchQuery.trim() && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>🔍 Global Search ရလဒ်များ (ခေါင်းစဉ်အလိုက် ရှာဖွေတွေ့ရှိချက်)</span>
            <span className="text-slate-400 font-normal">
              ရှာဖွေစကားလုံး: "<span className="text-white">{searchQuery}</span>"
            </span>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1 scrollbar-none">
            {[
              { id: 'all', label: `အားလုံး (${filteredSections.length + globalMatchingBooks.length})` },
              { id: 'sections', label: `📖 ပုဒ်မများ (${filteredSections.length})` },
              { id: 'books', label: `📚 ဥပဒေစာအုပ်များ (${globalMatchingBooks.length})` },
              { id: 'laws', label: `📕 ဥပဒေအဓိကအချက်များ` },
              { id: 'pdf', label: `📄 PDF / ပြဋ္ဌာန်းချက်များ` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedResultTab(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedResultTab === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Show matching books if books tab or all tab */}
          {(selectedResultTab === 'all' || selectedResultTab === 'books') && globalMatchingBooks.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">📚 ကိုက်ညီသော ဥပဒေစာအုပ်များ:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {globalMatchingBooks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedLawBook(b);
                      setSelectedCategory(b.id);
                      setSearchQuery('');
                    }}
                    className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-300 block">{b.title}</span>
                      <span className="text-slate-400 text-[11px]">{b.enactedYear} • {b.sectionCount} ပုဒ်</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sections Grid & Results List */}
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
          <div id="sections-results-list" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>မှတ်တမ်းဝင်</span>
                        </span>
                      )}
                    </div>

                    {/* Section Number & Title */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition flex items-center space-x-2">
                        <span className="text-amber-400">{section.sectionNo}</span>
                        <span>- {renderHighlightedSnippet(section.title, searchQuery)}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        📌 {section.chapter}
                      </p>
                    </div>

                    {/* Content Snippet (Phase 31 - Highlighted Snippet) */}
                    <p className="text-xs text-slate-300 line-clamp-3 leading-5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {renderHighlightedSnippet(section.content, searchQuery)}
                    </p>
                  </div>

                  {/* Badges & Phase 31 Action Button */}
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

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSection(section);
                      }}
                      className="text-slate-950 bg-amber-500 hover:bg-amber-400 px-3 py-1 rounded-lg font-bold flex items-center space-x-1 transition shadow"
                    >
                      <span>ဖတ်ရန်</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
