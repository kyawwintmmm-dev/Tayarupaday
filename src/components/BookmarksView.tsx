import React from 'react';
import { SavedBookmark, LawSection } from '../types';
import { LAW_SECTIONS } from '../data/lawsData';
import { Bookmark, Trash2, Copy, Check, Scale, BookOpen, ExternalLink } from 'lucide-react';

interface BookmarksViewProps {
  bookmarks: SavedBookmark[];
  onRemoveBookmark: (id: string) => void;
  onSelectSection: (section: LawSection) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onRemoveBookmark,
  onSelectSection,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const bookmarkedSections = bookmarks.map((b) => {
    const section = LAW_SECTIONS.find((s) => s.id === b.sectionId);
    return {
      bookmark: b,
      section,
    };
  }).filter((item) => item.section !== undefined);

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
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              မှတ်တမ်းနှင့် ရှေ့နေ မှတ်စုများ (Bookmarks & Citation Notes)
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              သိမ်းဆည်းထားသော ဥပဒေပုဒ်မများ၊ တရားစီရင်ထုံး အကိုးအကားများနှင့် ကိုယ်ပိုင် လျှောက်လဲချက် မှတ်စုများ။
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          စုစုပေါင်း - {bookmarkedSections.length} ပုဒ်
        </span>
      </div>

      {bookmarkedSections.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">မှတ်တမ်းတင်ထားသော ပုဒ်မ မရှိသေးပါ</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ဥပဒေပေါင်းချုပ်တွင် ပုဒ်မများ ဖတ်ရှုစဉ် "မှတ်တမ်းသိမ်းမည်" ကို နှိပ်၍ ကိုယ်ပိုင် မှတ်စုများ ရေးသား သိမ်းဆည်းနိုင်ပါသည်။
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

                {/* Statutory text snippet */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  {section.content}
                </p>

                {/* User Note */}
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

    </div>
  );
};
