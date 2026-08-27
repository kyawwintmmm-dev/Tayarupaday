import React, { useState } from 'react';
import { LawSection, SavedBookmark } from '../types';
import { X, Bookmark, BookmarkCheck, Copy, Check, Bot, BookOpen, ShieldAlert, AlertTriangle, Scale, ExternalLink } from 'lucide-react';

interface SectionDetailModalProps {
  section: LawSection | null;
  onClose: () => void;
  bookmarks: SavedBookmark[];
  onToggleBookmark: (sectionId: string, note?: string) => void;
  onAskAI: (prompt: string, lawContext: string) => void;
}

export const SectionDetailModal: React.FC<SectionDetailModalProps> = ({
  section,
  onClose,
  bookmarks,
  onToggleBookmark,
  onAskAI,
}) => {
  if (!section) return null;

  const safeBookmarks = bookmarks || [];
  const isBookmarked = safeBookmarks.some((b) => b?.sectionId === section.id);
  const existingNote = safeBookmarks.find((b) => b?.sectionId === section.id)?.userNote || '';
  const [noteText, setNoteText] = useState(existingNote);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${section.lawName}\n${section.sectionNo} - ${section.title}\n\n[ဥပဒေ စာသား]\n${section.content}\n\n[ပြစ်ဒဏ်]\n${section.punishment || 'သတ်မှတ်မထားပါ'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    onToggleBookmark(section.id, noteText);
    setShowNoteInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-myanmar text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                {section.lawName}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
          
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
          <div className="text-xs text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
            📌 {section.chapter}
          </div>

          {/* Full Law Text */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4" />
              <span>ဥပဒေ ပုဒ်မ စာသား (Statutory Text)</span>
            </h3>
            <p className="text-slate-200 text-sm whitespace-pre-line leading-7 font-normal">
              {section.content}
            </p>
          </div>

          {/* Explanation & Example */}
          {section.explanation && (
            <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>ရှင်းလင်းချက်နှင့် သာဓက (Explanation & Illustration)</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-6">
                {section.explanation}
              </p>
            </div>
          )}

          {/* Punishment */}
          {section.punishment && (
            <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl space-y-1.5">
              <h3 className="text-xs font-semibold text-rose-300 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>ပြစ်ဒဏ် (Punishment)</span>
              </h3>
              <p className="text-slate-200 font-medium text-sm">
                {section.punishment}
              </p>
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

          {/* User Note Section */}
          {showNoteInput ? (
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
              <label className="block text-xs font-semibold text-amber-300">
                ရှေ့နေ/ဥပဒေပညာရှင် ကိုယ်ပိုင် မှတ်စု ထည့်ရန်
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                placeholder="ဤပုဒ်မနှင့် စပ်လျဉ်း၍ လျှောက်လဲချက်၊ အမှုတွဲ မှတ်ချက်များကို ရေးသားပါ..."
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
            existingNote && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs space-y-1">
                <span className="font-semibold text-amber-400 block">သင်၏ မှတ်ချက် -</span>
                <p className="text-slate-200">{existingNote}</p>
              </div>
            )
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleBookmark(section.id, noteText)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
              <span>{isBookmarked ? 'မှတ်တမ်းဝင်ထားပြီး' : 'မှတ်တမ်းသိမ်းမည်'}</span>
            </button>

            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 transition"
            >
              မှတ်စု ရေးရန်
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'ကူးယူပြီးပါပြီ' : 'ပုဒ်မ ကူးယူရန်'}</span>
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
