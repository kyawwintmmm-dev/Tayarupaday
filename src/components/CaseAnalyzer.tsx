import React, { useState } from 'react';
import { Sparkles, Send, ShieldAlert, Scale, CheckCircle2, Copy, Check, FileText, Bot } from 'lucide-react';

export const CaseAnalyzer: React.FC = () => {
  const [caseFacts, setCaseFacts] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const sampleScenarios = [
    {
      title: 'အရက်ဝိုင်း ခိုက်ရန်ဖြစ်ပွားမှုနှင့် ဓားထိုးမှု',
      facts: '၂၀၂၆ ခုနှစ် မတ်လတွင် သူငယ်ချင်း ၂ ယောက် အရက်အတူတောက်ရင်း စကားများကြရာမှ က ထုတ်ယူထားသော အိမ်သုံးဓားဖြင့် ခ အား ထိုးလိုက်သဖြင့် ခ ၏ ဝမ်းဗိုက်တွင် ဓားဒဏ်ရာ ရရှိပြီး ဆေးရုံတွင် ၁၅ ရက်ကြာ ဆေးကုသမှု ခံယူခဲ့ရသည်။ က တွင် မည်သည့် ပုဒ်မများ ငြိစွန်းနိုင်သနည်း။ အာမခံ ရနိုင်ပါသလား။',
    },
    {
      title: 'အွန်လိုင်းမှ ငွေကြေး လိမ်လည် ရယူမှု',
      facts: 'ဒေါ်လှလှ သည် Facebook ပေါ်တွင် စကားပြောရင်း စာချုပ်အတု ပြသကာ စာအုပ်ထုတ်ဝေရေး လုပ်ငန်းအတွက် ငွေကျပ် သိန်း ၂၀၀ ရင်းနှီးမြှုပ်နှံပါက တစ်လလျှင် ၁၀% အမြတ်ပေးမည်ဟု ဆိုသဖြင့် ဒေါ်လှလှက ငွေလွှဲပေးခဲ့သည်။ ၃ လအကြာတွင် ငွေလည်း မပေး၊ ဆက်သွယ်၍လည်း မရဘဲ ထွက်ပြေးသွားသည်။ မည်သည့် ဥပဒေဖြင့် တိုင်တန်းနိုင်သနည်း။',
    },
    {
      title: 'လင်မယား ကွာရှင်းမှုနှင့် ကလေး အုပ်ထိန်းခွင့်',
      facts: 'မြန်မာဗုဒ္ဓဘာသာဝင် လင်မယား ၂ ဦး ဖြစ်ပြီး အိမ်ထောင်သက် ၇ နှစ်တွင် ခင်ပွန်းဖြစ်သူ၏ မတရား ရိုက်နှက်မှုနှင့် အိမ်ထောင်ရေး ဖောက်ပြန်မှုကြောင့် ကွာရှင်းလိုသည်။ အသက် ၄ နှစ်အရွယ် သမီးငယ်အား မိခင်ဖြစ်သူက တရားဝင် အုပ်ထိန်းခွင့် (Child Custody) ရရှိနိုင်မည့် ဥပဒေကြောင်းအရ လျှောက်လဲချက်များ။',
    },
    {
      title: 'ဆိုက်ဘာ ဒေတာ ခိုးယူမှုနှင့် ဆက်သွယ်ရေး ၆၆(ဃ)',
      facts: 'ကုမ္ပဏီ ဝန်ထမ်းဟောင်း ဦးကျော်ကျော် သည် ကုမ္ပဏီ၏ လျှို့ဝှက် Customer ဒေတာများကို တရားမဝင် ရယူ၍ လူမှုကွန်ရက် ပေါ်တွင် ကုမ္ပဏီ၏ အသရေကို ဖျက်ဆီးသော စာများ ရေးသား ဖြန့်ဝေခဲ့သည်။ ဆိုက်ဘာဥပဒေ ၂၀၂၅ နှင့် ဆက်သွယ်ရေး ဥပဒေအရ အရေးယူနိုင်မည့် ပုဒ်မများ။',
    }
  ];

  const handleAnalyze = async (factsToAnalyze?: string) => {
    const text = factsToAnalyze || caseFacts;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/legal-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          mode: 'case_analysis',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'အမှုဖြစ်စဉ် သုံးသပ်ရာတွင် အမှားအယွင်း ရှိသွားပါသည်။');
      }

      setAnalysisResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'သုံးသပ်ချက် ရယူ၍ မရပါ။ ကျေးဇူးပြု၍ ပြန်လည် ကြိုးစားပါ။');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-myanmar text-slate-100 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>အမှုဖြစ်စဉ် ဓာတ်ခွဲသုံးသပ်စနစ် (Case Scenario Analyzer)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              ဖြစ်ပျက်ခဲ့သည့် အကြောင်းအရာ အစစ်အမှန် သို့မဟုတ် အမှုဖြစ်စဉ် (Scenario) ကို ထည့်သွင်း၍ သီးခြား ငြိစွန်းနိုင်သည့် ဥပဒေပုဒ်မများ၊ ပြစ်မှုအင်္ဂါရပ်များ၊ အာမခံ နှင့် ချေပချက်များကို သုံးသပ်ပါ။
            </p>
          </div>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
          📋 နမူနာ အမှုဖြစ်စဉ်များ (Sample Scenarios)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampleScenarios.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCaseFacts(s.facts);
                handleAnalyze(s.facts);
              }}
              className="text-left bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-xl transition group hover:bg-slate-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 group-hover:text-amber-400">
                  {s.title}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  သုံးသပ်မည်
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-5">
                {s.facts}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            အမှုဖြစ်စဉ် အသေးစိတ် ရေးသားထည့်သွင်းရန်
          </label>
          <textarea
            value={caseFacts}
            onChange={(e) => setCaseFacts(e.target.value)}
            rows={5}
            placeholder="ဥပမာ - မည်သည့် ရက်စွဲ၊ မည်သည့် နေရာတွင် မည်သူနှင့် မည်သူ ခိုက်ရန်ဖြစ်ပွားခဲ့ပုံ၊ ဒဏ်ရာ ရရှိပုံ သို့မဟုတ် ပစ္စည်း ငွေကြေး လိမ်လည်ခံရပုံ..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setCaseFacts('');
              setAnalysisResult('');
            }}
            className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800"
          >
            ရှင်းလင်းမည်
          </button>

          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !caseFacts.trim()}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>ဥပဒေပုဒ်မများ သုံးသပ်နေပါသည်...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>အမှုဖြစ်စဉ် ဓာတ်ခွဲသုံးသပ်မည်</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-500/40 p-4 rounded-xl text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
              <Scale className="w-5 h-5" />
              <span>ဥပဒေကြောင်းအရ သုံးသပ်ချက် ရလဒ်</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'ကူးယူပြီးပါပြီ' : 'ရလဒ် ကူးယူရန်'}</span>
            </button>
          </div>

          <div className="prose prose-invert prose-amber max-w-none text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line space-y-3">
            {analysisResult}
          </div>
        </div>
      )}

    </div>
  );
};
