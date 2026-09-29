import React, { useState, useEffect } from 'react';
import { LawSection, SavedBookmark } from '../types';
import { LAW_SECTIONS } from '../data/lawsData';
import { 
  X, Bookmark, BookmarkCheck, Copy, Check, Bot, BookOpen, 
  ShieldAlert, AlertTriangle, Scale, Share2, ChevronLeft, ChevronRight, 
  Highlighter, Info, Edit3, Trash2, ArrowRight
} from 'lucide-react';

interface SectionDetailModalProps {
  section: LawSection | null;
  allSections?: LawSection[];
  onClose: () => void;
  bookmarks: SavedBookmark[];
  onToggleBookmark: (sectionId: string, note?: string) => void;
  onAskAI: (prompt: string, lawContext: string) => void;
  onSelectSection?: (section: LawSection) => void;
}

export const SectionDetailModal: React.FC<SectionDetailModalProps> = ({
  section,
  allSections = LAW_SECTIONS,
  onClose,
  bookmarks,
  onToggleBookmark,
  onAskAI,
  onSelectSection,
}) => {
  if (!section) return null;

  const safeBookmarks = bookmarks || [];
  const isBookmarked = safeBookmarks.some((b) => b?.sectionId === section.id);
  const existingNote = safeBookmarks.find((b) => b?.sectionId === section.id)?.userNote || '';
  
  const [noteText, setNoteText] = useState(existingNote);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  // Highlights state for this section
  const [highlights, setHighlights] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`law_highlights_${section.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [highlightInput, setHighlightInput] = useState('');
  const [showHighlightManager, setShowHighlightManager] = useState(false);

  // Sync state when section changes
  useEffect(() => {
    setNoteText(existingNote);
    setShowNoteInput(false);
    try {
      const saved = localStorage.getItem(`law_highlights_${section.id}`);
      setHighlights(saved ? JSON.parse(saved) : []);
    } catch {
      setHighlights([]);
    }
  }, [section.id, existingNote]);

  // Save highlights to localStorage
  const saveHighlights = (newHighlights: string[]) => {
    setHighlights(newHighlights);
    try {
      localStorage.setItem(`law_highlights_${section.id}`, JSON.stringify(newHighlights));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddHighlight = (phrase: string) => {
    const trimmed = phrase.trim();
    if (!trimmed) return;
    if (!highlights.includes(trimmed)) {
      const next = [...highlights, trimmed];
      saveHighlights(next);
      showToast('စာသားကို Highlight ဆေးရောင်ခြယ်လိုက်ပါပြီ');
    }
    setHighlightInput('');
  };

  const handleRemoveHighlight = (phraseToRemove: string) => {
    const next = highlights.filter((h) => h !== phraseToRemove);
    saveHighlights(next);
    showToast('Highlight ဆေးရောင် ဖျက်လိုက်ပါပြီ');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Phase 23 - Article Navigation
  const sameLawSections = allSections.filter((s) => s.lawId === section.lawId || s.lawName === section.lawName);
  const currentIndex = sameLawSections.findIndex((s) => s.id === section.id);
  const prevSection = currentIndex > 0 ? sameLawSections[currentIndex - 1] : null;
  const nextSection = currentIndex >= 0 && currentIndex < sameLawSections.length - 1 ? sameLawSections[currentIndex + 1] : null;

  // Jump to specific section state
  const [jumpNo, setJumpNo] = useState('');

  const handleJumpToSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jumpNo.trim()) return;
    const searchTarget = jumpNo.trim().toLowerCase();
    const target = sameLawSections.find(
      (s) =>
        s.sectionNo.toLowerCase().includes(searchTarget) ||
        s.sectionNo.replace(/[^\d]/g, '').includes(searchTarget)
    );
    if (target && onSelectSection) {
      onSelectSection(target);
      setJumpNo('');
    } else {
      showToast(`ပုဒ်မ ${jumpNo} ကို ရှာမတွေ့ပါ`);
    }
  };

  // Phase 25 - Formatted Copy
  const handleCopy = () => {
    const textToCopy = `[ဥပဒေအမည်]: ${section.lawName}
[ပုဒ်မနံပါတ်]: ${section.sectionNo}
[ပုဒ်မခေါင်းစဉ်]: ${section.title}
[အခန်း]: ${section.chapter}

[ဥပဒေ စာသား]
${section.content}

${section.explanation ? `[ရှင်းလင်းချက်]\n${section.explanation}\n` : ''}${section.punishment ? `[ပြစ်ဒဏ်]\n${section.punishment}\n` : ''}
Source: ${section.sourceInfo || 'မြန်မာနိုင်ငံ ဥပဒေစာအုပ် (ပြည်ထောင်စု ရှေ့နေချုပ်ရုံး)'}
ထုတ်ပြန်သည့်နှစ်: ${section.effectiveDate || '၁၈၆၀'}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('ပုဒ်မစာသားကို Copy ပြီးပါပြီ');
    setTimeout(() => setCopied(false), 2000);
  };

  // Phase 29 - Share Deep Link
  const handleShare = () => {
    const deepLinkUrl = `${window.location.origin}${window.location.pathname}#/law/${section.lawId || 'penal_code'}/section/${section.id}`;
    const shareText = `⚖️ ${section.lawName} (${section.sectionNo} - ${section.title})
ဖတ်ရှုရန် Link: ${deepLinkUrl}`;

    if (navigator.share) {
      navigator.share({
        title: `${section.lawName} - ${section.sectionNo}`,
        text: shareText,
        url: deepLinkUrl,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        setShared(true);
        showToast('Share Link ကို Copy ပြီးပါပြီ');
        setTimeout(() => setShared(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(shareText);
      setShared(true);
      showToast('Share Link ကို Copy ပြီးပါပြီ');
      setTimeout(() => setShared(false), 2000);
    }
  };

  // Save Note (Phase 28)
  const handleSaveNote = () => {
    onToggleBookmark(section.id, noteText);
    setShowNoteInput(false);
    showToast('ကိုယ်ပိုင်မှတ်စုကို သိမ်းဆည်းလိုက်ပါပြီ');
  };

  // Highlight Text Render Helper
  const renderHighlightedText = (text: string) => {
    if (!highlights || highlights.length === 0) {
      return text;
    }
    
    // Sort highlights by length descending to prevent substring collisions
    const regexParts = highlights
      .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter(Boolean);

    if (regexParts.length === 0) return text;

    const regex = new RegExp(`(${regexParts.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = highlights.some((h) => h.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark
            key={index}
            className="bg-amber-400 text-slate-950 font-bold px-1 py-0.5 rounded border-b-2 border-amber-600 shadow-sm"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-myanmar text-slate-100 relative">
        
        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-amber-300 animate-bounce flex items-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-amber-300 rounded-full border border-slate-700">
                  {section.lawName}
                </span>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {section.versionStatus || 'Current (အတည်ပြုပြီး)'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {section.sectionNo} - {section.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase 23 - Article Quick Navigation Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-1">
            {prevSection ? (
              <button
                onClick={() => onSelectSection && onSelectSection(prevSection)}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition font-medium text-[11px]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>ယခင် ({prevSection.sectionNo})</span>
              </button>
            ) : (
              <span className="text-slate-600 text-[11px]">ယခင်ပုဒ်မ မရှိပါ</span>
            )}
          </div>

          {/* Jump to section */}
          <form onSubmit={handleJumpToSection} className="flex items-center space-x-1.5">
            <input
              type="text"
              value={jumpNo}
              onChange={(e) => setJumpNo(e.target.value)}
              placeholder="ပုဒ်မ သို့ တိုက်ရိုက်သွားရန်..."
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200 w-28 sm:w-36 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg hover:bg-amber-400"
            >
              သွားမည်
            </button>
          </form>

          <div className="flex items-center space-x-1">
            {nextSection ? (
              <button
                onClick={() => onSelectSection && onSelectSection(nextSection)}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition font-medium text-[11px]"
              >
                <span>နောက် ({nextSection.sectionNo})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-slate-600 text-[11px]">နောက်ပုဒ်မ မရှိပါ</span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm leading-relaxed">
          
          {/* Phase 34 - Source & Version Info Box */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3 text-slate-300">
              <span>
                <strong>Source:</strong> {section.sourceInfo || 'မြန်မာနိုင်ငံ ဥပဒေစာအုပ် (ပြည်ထောင်စု ရှေ့နေချုပ်ရုံး)'}
              </span>
              <span>•</span>
              <span>
                <strong>ထုတ်ပြန်သည့်နှစ်:</strong> {section.effectiveDate || '၁၈၆၀'}
              </span>
            </div>
            
            {(section.hasAmendmentWarning || section.lawName.includes('ရာဇသတ်ကြီး')) && (
              <div className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30 font-semibold text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>⚠️ ပြင်ဆင်ချက်ရှိနိုင်ပါသည် (၂၀၂၁-၂၀၂၆ အသစ်များကို စစ်ဆေးပါ)</span>
              </div>
            )}
          </div>

          {/* Status Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3">
              <span className="text-xs text-slate-400 block mb-1">ဖမ်းဆီးနိုင်ခွင့် (Cognizable)</span>
              <span className="font-semibold text-amber-300 text-xs sm:text-sm">
                {section.cognizable || 'မသက်ဆိုင်ပါ'}
              </span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3">
              <span className="text-xs text-slate-400 block mb-1">အာမခံ အခြေအနေ (Bail)</span>
              <span className={`font-semibold text-xs sm:text-sm ${
                section.bailable?.includes('ရနိုင်သည်') ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {section.bailable || 'မသက်ဆိုင်ပါ'}
              </span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3">
              <span className="text-xs text-slate-400 block mb-1">ကျေအေးခွင့် (Compoundable)</span>
              <span className="font-semibold text-blue-300 text-xs sm:text-sm">
                {section.compoundable || 'မသက်ဆိုင်ပါ'}
              </span>
            </div>
          </div>

          {/* Chapter badge */}
          <div className="text-xs text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span>📌 {section.chapter}</span>
            <button
              onClick={() => setShowHighlightManager(!showHighlightManager)}
              className="flex items-center space-x-1 text-amber-400 hover:underline font-semibold"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>Highlight ဆေးရောင်ခြယ်စနစ်</span>
            </button>
          </div>

          {/* Highlight Manager Input */}
          {showHighlightManager && (
            <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300">
                  Highlight ဆေးရောင်ခြယ်လိုသည့် စာလုံး သို့မဟုတ် စာကြောင်း ထည့်ပါ:
                </span>
                <span className="text-slate-400 text-[10px]">
                  ({highlights.length} ခု ခြယ်ထားပြီး)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="ဥပမာ - 'ထောင်ဒဏ်', 'ကျခံစေရမည်', 'ကျပ်ငွေ'..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleAddHighlight(highlightInput)}
                  className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 shrink-0"
                >
                  Highlight လုပ်မည်
                </button>
              </div>

              {highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {highlights.map((phrase, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-400/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1"
                    >
                      <span>{phrase}</span>
                      <button
                        onClick={() => handleRemoveHighlight(phrase)}
                        className="text-amber-400 hover:text-rose-400 ml-1 font-bold"
                        title="Remove highlight"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Full Law Text (Phase 27 Rendering Highlights) */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4" />
                <span>ဥပဒေ ပုဒ်မ စာသား (Statutory Text)</span>
              </h3>

              {/* Reader Font Size Selector */}
              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-[11px]">
                <span className="text-slate-400 px-1 text-[10px]">စာလုံးအရွယ်:</span>
                {[
                  { id: 'sm', label: 'သေး' },
                  { id: 'base', label: 'ပုံမှန်' },
                  { id: 'lg', label: 'ကြီး' },
                  { id: 'xl', label: 'အကြီးဆုံး' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setFontSize(sz.id as any)}
                    className={`px-2 py-0.5 rounded transition ${
                      fontSize === sz.id
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`text-slate-200 whitespace-pre-line font-normal transition-all ${
              fontSize === 'sm' ? 'text-xs sm:text-sm leading-6' :
              fontSize === 'base' ? 'text-sm sm:text-base leading-7' :
              fontSize === 'lg' ? 'text-base sm:text-lg leading-8' :
              'text-lg sm:text-xl leading-9'
            }`}>
              {renderHighlightedText(section.content)}
            </div>
          </div>

          {/* Explanation & Example */}
          {section.explanation && (
            <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>ရှင်းလင်းချက်နှင့် သာဓက (Explanation & Illustration)</span>
              </h3>
              <div className="text-slate-300 text-xs sm:text-sm leading-6">
                {renderHighlightedText(section.explanation)}
              </div>
            </div>
          )}

          {/* Punishment */}
          {section.punishment && (
            <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl space-y-1.5">
              <h3 className="text-xs font-semibold text-rose-300 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>ပြစ်ဒဏ် (Punishment)</span>
              </h3>
              <div className="text-slate-200 font-medium text-sm">
                {renderHighlightedText(section.punishment)}
              </div>
            </div>
          )}

          {/* Precedents */}
          {section.precedents && section.precedents.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>တရားလွှတ်တော်ချုပ် တရားစီရင်ထုံးများ (Supreme Court Precedents)</span>
              </h3>
              <div className="space-y-2.5">
                {section.precedents.map((p) => (
                  <div key={p.id} className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                      <span>{p.citation}</span>
                      <span className="text-slate-400">ခုနှစ် - {p.year}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-5">
                      {p.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase 28 - Personal Notes Section */}
          <div className="border-t border-slate-800/80 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
                <Edit3 className="w-4 h-4" />
                <span>📝 ကိုယ်ပိုင်မှတ်စု (Personal Note)</span>
              </h3>
              <button
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                {showNoteInput ? 'ပိတ်မည်' : existingNote ? 'ပြင်ဆင်မည်' : 'မှတ်စု ထည့်ရန်'}
              </button>
            </div>

            {showNoteInput ? (
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                  placeholder="ဒီပုဒ်မကို အမှုအမှတ် 123 နဲ့ ဆက်စပ်ပြီး ဖတ်ရန် သို့မဟုတ် လျှောက်လဲချက် ရေးရန်..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowNoteInput(false)}
                    className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs rounded-lg hover:bg-slate-600"
                  >
                    မလုပ်တော့ပါ
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-semibold text-xs rounded-lg hover:bg-amber-400"
                  >
                    မှတ်တမ်း သိမ်းမည်
                  </button>
                </div>
              </div>
            ) : (
              existingNote ? (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs space-y-1">
                  <span className="font-semibold text-amber-400 block">သင်၏ ကိုယ်ပိုင် မှတ်စု -</span>
                  <p className="text-slate-200 whitespace-pre-line">{existingNote}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  မည်သည့် ကိုယ်ပိုင်မှတ်စုမျှ ထည့်သွင်းထားခြင်း မရှိသေးပါ။ "မှတ်စု ထည့်ရန်" ကို နှိပ်၍ ရေးသားနိုင်ပါသည်။
                </p>
              )
            )}
          </div>

        </div>

        {/* Footer Actions (Phase 25 Copy, Phase 26 Bookmark, Phase 29 Share) */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Phase 26 Bookmark */}
            <button
              onClick={() => {
                onToggleBookmark(section.id, noteText);
                showToast(isBookmarked ? 'Bookmark မှ ပယ်ဖျက်လိုက်ပါပြီ' : 'ကျွန်ုပ်၏ Bookmark များထဲသို့ သိမ်းဆည်းလိုက်ပါပြီ');
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
              <span>{isBookmarked ? 'Bookmark ပြီး' : '🔖 Bookmark'}</span>
            </button>

            {/* Phase 25 Copy */}
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copy ပြီးပါပြီ' : '📋 Copy'}</span>
            </button>

            {/* Phase 29 Share */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 transition"
            >
              {shared ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span>{shared ? 'Share ပြီးပါပြီ' : '🔗 Share'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onAskAI(
                `${section.lawName} ${section.sectionNo} (${section.title}) ၏ တရားဥပဒေဆိုင်ရာ အသေးစိတ် အဓိပ္ပာယ်နှင့် စီရင်ထုံး အသုံးချပုံကို အသေးစိတ် ရှင်းပြပေးပါ။`,
                `${section.lawName} - ${section.sectionNo}`
              );
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition"
          >
            <Bot className="w-4 h-4" />
            <span>AI ရှေ့နေအား မေးမြန်းမည်</span>
          </button>
        </div>

      </div>
    </div>
  );
};
