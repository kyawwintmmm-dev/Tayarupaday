import React, { useState } from 'react';
import { Bot, Send, Sparkles, Copy, Check, RotateCcw, AlertCircle, BookOpen, ShieldCheck, Database } from 'lucide-react';
import { LAW_SECTIONS } from '../data/lawsData';

interface AILawyerAssistantProps {
  initialPrompt?: string;
  initialLawContext?: string;
}

export const AILawyerAssistant: React.FC<AILawyerAssistantProps> = ({
  initialPrompt = '',
  initialLawContext = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [lawContext, setLawContext] = useState(initialLawContext);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAskAI = async (customPrompt?: string, customContext?: string) => {
    const queryPrompt = customPrompt || prompt;
    const queryContext = customContext || lawContext;

    if (!queryPrompt.trim()) return;

    setLoading(true);
    setError(null);

    // Phase 33 - Query app's local LAW_SECTIONS database for ground-truth matching
    const qLower = queryPrompt.toLowerCase();
    const matchedSections = LAW_SECTIONS.filter((s) => {
      const secNoDigits = s.sectionNo.replace(/[^\d]/g, '');
      const promptDigits = qLower.replace(/[^\d]/g, '');
      const matchDigit = secNoDigits && promptDigits && promptDigits.length >= 2 && promptDigits.includes(secNoDigits);
      
      return (
        matchDigit ||
        qLower.includes(s.sectionNo.toLowerCase()) ||
        qLower.includes(s.title.toLowerCase()) ||
        qLower.includes(s.lawName.toLowerCase()) ||
        (s.tags && s.tags.some((t) => t && qLower.includes(t.toLowerCase())))
      );
    }).slice(0, 5);

    let enrichedContext = queryContext;
    if (matchedSections.length > 0) {
      const dbSnippet = matchedSections
        .map(
          (sec) =>
            `• ${sec.lawName} - ${sec.sectionNo} (${sec.title}):\n  ${sec.content}\n  [ပြစ်ဒဏ်]: ${sec.punishment || 'သတ်မှတ်မထားပါ'}`
        )
        .join('\n\n');
      enrichedContext = `${queryContext ? queryContext + '\n\n' : ''}[DATABASE MATCHES (အက်ပလီကေးရှင်း ဥပဒေဒေတာဘေ့စ်မှ တိုက်ရိုက် ရရှိသော အချက်အလက်များ)]:\n${dbSnippet}`;
    }

    try {
      const res = await fetch('/api/legal-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryPrompt,
          lawContext: enrichedContext,
          mode: 'qa',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI စနစ် တုံ့ပြန်ရာတွင် အမှားအယွင်း ရှိသွားပါသည်။');
      }

      setResponse(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'မေးခွန်းအား ပေးပို့၍ မရပါပါ။ ကွန်ရက် သို့မဟုတ် အချက်အလက်များအား စစ်ဆေးပါ။');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-myanmar text-slate-100 max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>AI ဥပဒေရေးရာ အကြံပေးစနစ်</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-500 text-slate-950 rounded-full font-sans">
                Gemini 3.6 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              မြန်မာနိုင်ငံ ရာဇသတ်ကြီး၊ ပြစ်မှုကျင့်ထုံး၊ ဖွဲ့စည်းပုံအခြေခံဥပဒေနှင့် အထူးဥပဒေများကို မှီးငြမ်း၍ တရားဥပဒေကြောင်းအရ အကြံပြုပေးပါသည်။
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        
        {/* Optional Context Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            သတ်မှတ်လိုသော ဥပဒေ သို့မဟုတ် ပုဒ်မ (အလိုအလျောက် သို့မဟုတ် စိတ်ကြိုက်ထည့်နိုင်ပါသည်)
          </label>
          <input
            type="text"
            value={lawContext}
            onChange={(e) => setLawContext(e.target.value)}
            placeholder="ဥပမာ - ရာဇသတ်ကြီး ပုဒ်မ ၄၂၀ သို့မဟုတ် ၂၀၂၅ ဆိုက်ဘာဥပဒေ"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            မေးခွန်း သို့မဟုတ် ဥပဒေ အကူအညီ လိုအပ်ချက်များ
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="ဥပမာ - အာမခံ မရနိုင်သော ပြစ်မှုတစ်ခုတွင် တရားရုံးသို့ အာမခံ လျှောက်ထားရာ၌ မည်သည့် အကြောင်းပြချက်များနှင့် သက်သေခံချက်များကို အလေးထား တင်ပြရမည်နည်း..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setPrompt('');
              setLawContext('');
              setResponse('');
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ပြန်စမည်</span>
          </button>

          <button
            onClick={() => handleAskAI()}
            disabled={loading || !prompt.trim()}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>ဥပဒေ စိစစ်နေပါသည်...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>AI မေးမြန်းမည်</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-500/40 p-4 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Response Display */}
      {response && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI ဥပဒေ အကြံပေးချက် သုံးသပ်ချက်</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'ကူးယူပြီးပါပြီ' : 'စာသား ကူးယူရန်'}</span>
            </button>
          </div>

          <div className="prose prose-invert prose-amber max-w-none text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line space-y-2">
            {response}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              သတိပြုရန် - AI အကြံပေးချက်သည် အကိုးအကား ပြုလုပ်ရန်သာ ဖြစ်ပြီး အမှု လျှောက်လဲရာတွင် သက်ဆိုင်ရာ ရှေ့နေကြီးများနှင့် ပြန်လည် စိစစ်ပါ။
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
