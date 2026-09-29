import React, { useState } from 'react';
import { SavedBookmark, LawSection, ReadingHistoryItem } from '../types';
import { LAW_SECTIONS } from '../data/lawsData';
import { Bookmark, Trash2, Copy, Check, FileText, History, ExternalLink, RotateCcw } from 'lucide-react';

interface BookmarksViewProps {
  bookmarks: SavedBookmark[];
  readingHistory?: ReadingHistoryItem[];
  defaultTab?: 'bookmarks' | 'notes' | 'history';
  onRemoveBookmark: (id: string) => void;
  onClearReadingHistory?: () => void;
  onSelectSection: (section: LawSection) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  readingHistory = [],
  defaultTab = 'bookmarks',
  onRemoveBookmark,
  onClearReadingHistory,
  onSelectSection,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes' | 'history'>(defaultTab);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bookmarkedSections = bookmarks.map((b) => {
    const section = LAW_SECTIONS.find((s) => s.id === b.sectionId);
    return {
      bookmark: b,
      section,
    };
  }).filter((item) => item.section !== undefined);

  const sectionsWithNotes = bookmarkedSections.filter(
    (item) => item.bookmark.userNote && item.bookmark.userNote.trim().length > 0
  );

  const historySections = readingHistory
    .map((h) => {
      const section = LAW_SECTIONS.find((s) => s.id === h.sectionId);
      return {
        item: h,
        section,
      };
    })
    .filter((h) => h.section !== undefined);

  const handleCopyCitation = (section: LawSection, userNote?: string) => {
    let text = `${section.lawName} - ${section.sectionNo} (${section.title})\n${section.content}`;
    if (section.precedents && section.precedents.length > 0) {
      text += `\n\n[စီရင်ထုံး အကိုးအကား]\n${section.precedents[0].citation} - ${section.precedents[0].summary}`;
    }
    if (userNote) {
      text += `\n\n[မှတ်ချက်]\n${userNote}`;
    }

    navigator.clipboard.writeText(text);
    setCopiedId(section.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-myanmar text-slate-100 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            {activeTab === 'bookmarks' && <Bookmark className="w-7 h-7" />}
            {activeTab === 'notes' && <FileText className="w-7 h-7" />}
            {activeTab === 'history' && <History className="w-7 h-7" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'bookmarks' && '🔖 သိမ်းဆည်းထားသော ပုဒ်မများ (Bookmarks)'}
              {activeTab === 'notes' && '📝 ကျွန်ုပ်၏ ရှေ့နေ မှတ်စုများ (My Notes)'}
              {activeTab === 'history' && '🕘 ဖတ်ရှုခဲ့မှု မှတ်တမ်း (Reading History)'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {activeTab === 'bookmarks' && 'သိမ်းဆည်းထားသော ဥပဒေပုဒ်မများနှင့် တရားစီရင်ထုံး အကိုးအကားများ။'}
              {activeTab === 'notes' && 'ဥပဒေပုဒ်မများအောက်တွင် သင်ရေးသားထားသော ကိုယ်ပိုင် လျှောက်လဲချက်နှင့် မှတ်ချက်များ။'}
              {activeTab === 'history' && 'မကြာသေးမီက သင်ကြည့်ရှုဖတ်ရှုခဲ့သော ဥပဒေပုဒ်မများ စာရင်း။'}
            </p>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmark ({bookmarkedSections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'notes'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>မှတ်စုများ ({sectionsWithNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>ဖတ်ရှုမှတ်တမ်း ({historySections.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <>
          {bookmarkedSections.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">မှတ်တမ်းတင်ထားသော ပုဒ်မ မရှိသေးပါ</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ဥပဒေပေါင်းချုပ်တွင် ပုဒ်မများ ဖတ်ရှုစဉ် "မှတ်တမ်းသိမ်းမည်" ကို နှိပ်၍ သိမ်းဆည်းနိုင်ပါသည်။
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedSections.map(({ bookmark, section }) => {
                if (!section) return null;

                return (
                  <div
                    key={bookmark.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                          {section.lawName}
                        </span>
                        <h3
                          onClick={() => onSelectSection(section)}
                          className="text-base font-bold text-white hover:text-amber-300 transition cursor-pointer flex items-center space-x-2"
                        >
                          <span className="text-amber-400">{section.sectionNo}</span>
                          <span>- {section.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyCitation(section, bookmark.userNote)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                        >
                          {copiedId === section.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === section.id ? 'ကူးယူပြီး' : 'အကိုးအကား ကူးယူရန်'}</span>
                        </button>

                        <button
                          onClick={() => onRemoveBookmark(bookmark.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                          title="မှတ်တမ်းမှ ပယ်ဖျက်မည်"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                      {section.content}
                    </p>

                    {bookmark.userNote && (
                      <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs space-y-1">
                        <span className="font-semibold text-amber-400 block">သင်၏ ရှေ့နေ မှတ်စု -</span>
                        <p className="text-slate-200 whitespace-pre-line">{bookmark.userNote}</p>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500">
                      သိမ်းဆည်းခဲ့သည့် ရက်စွဲ - {new Date(bookmark.createdAt).toLocaleDateString('my-MM')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* SUB-TAB 2: MY NOTES */}
      {activeTab === 'notes' && (
        <>
          {sectionsWithNotes.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">မှတ်စု ရေးသားထားခြင်း မရှိသေးပါ</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ဥပဒေပုဒ်မများ၏ အသေးစိတ်စာမျက်နှာတွင် "ရှေ့နေ မှတ်စု ရေးရန်" နေရာတွင် ကိုယ်ပိုင် မှတ်ချက်များ ရေးသားသိမ်းဆည်းနိုင်ပါသည်။
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sectionsWithNotes.map(({ bookmark, section }) => {
                if (!section) return null;

                return (
                  <div
                    key={bookmark.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          {section.lawName}
                        </span>
                        <h3
                          onClick={() => onSelectSection(section)}
                          className="text-base font-bold text-white hover:text-amber-300 transition cursor-pointer flex items-center space-x-2 mt-1"
                        >
                          <span>{section.sectionNo} - {section.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </h3>
                      </div>

                      <button
                        onClick={() => onSelectSection(section)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition"
                      >
                        ပြင်ဆင်မည်
                      </button>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-xs space-y-1">
                      <span className="font-semibold text-amber-400 block">📝 မှတ်စု -</span>
                      <p className="text-slate-100 whitespace-pre-line leading-relaxed">{bookmark.userNote}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* SUB-TAB 3: READING HISTORY */}
      {activeTab === 'history' && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              မကြာသေးမီက သင် ကြည့်ရှုခဲ့သော ဥပဒေ ပုဒ်မများ ({historySections.length})
            </span>
            {historySections.length > 0 && onClearReadingHistory && (
              <button
                onClick={onClearReadingHistory}
                className="flex items-center space-x-1 px-3 py-1 bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/60 text-rose-300 text-xs rounded-lg transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>မှတ်တမ်း ရှင်းလင်းမည်</span>
              </button>
            )}
          </div>

          {historySections.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <History className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">ဖတ်ရှုခဲ့သည့် မှတ်တမ်း မရှိသေးပါ</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                သင် ဖတ်ရှုသော ဥပဒေပုဒ်မများကို ဤနေရာတွင် အလိုအလျောက် မှတ်တမ်းတင်ပေးသွားပါမည်။
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historySections.map(({ item, section }) => {
                if (!section) return null;

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectSection(section)}
                    className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-xl cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {section.lawName}
                        </span>
                        <span className="text-xs font-bold text-amber-400">{section.sectionNo}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition">
                        {section.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{section.content}</p>
                    </div>

                    <div className="text-right pl-4">
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(item.lastReadAt).toLocaleTimeString('my-MM', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition ml-auto mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

    </div>
  );
};

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
