import React, { useState } from 'react';
import { EXPANDED_DRAFT_TEMPLATES, CONTRACT_EXECUTION_GUIDELINES } from '../data/templatesData';
import { LegalDraftTemplate } from '../types';
import {
  FileText,
  Copy,
  Check,
  Download,
  Sparkles,
  Printer,
  PenTool,
  BookOpen,
  ShieldCheck,
  Building2,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export const DraftGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'guidelines'>('generator');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedTemplate, setSelectedTemplate] = useState<LegalDraftTemplate>(EXPANDED_DRAFT_TEMPLATES[0]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    EXPANDED_DRAFT_TEMPLATES[0].fields.forEach((f) => {
      initial[f.key] = f.defaultValue || '';
    });
    return initial;
  });

  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aiGeneratedDraft, setAiGeneratedDraft] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedGuidelineId, setExpandedGuidelineId] = useState<string | null>('validity_essentials');

  // Filter templates
  const filteredTemplates = EXPANDED_DRAFT_TEMPLATES.filter((tmpl) => {
    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      (selectedCategoryFilter === 'civil_contract' && (tmpl.category === 'civil_contract' || tmpl.category === 'contract')) ||
      (selectedCategoryFilter === 'power_of_attorney' && tmpl.category === 'power_of_attorney') ||
      (selectedCategoryFilter === 'court_applications' && (tmpl.category === 'bail' || tmpl.category === 'police_report' || tmpl.category === 'notice'));

    const matchesSearch =
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Handle template selection
  const handleSelectTemplate = (template: LegalDraftTemplate) => {
    setSelectedTemplate(template);
    const initial: Record<string, string> = {};
    template.fields.forEach((f) => {
      initial[f.key] = f.defaultValue || '';
    });
    setFieldValues(initial);
    setAiGeneratedDraft('');
  };

  // Field change
  const handleFieldChange = (key: string, val: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: val }));
  };

  // Render text from template + fields
  const getRenderedText = () => {
    if (aiGeneratedDraft) return aiGeneratedDraft;

    let text = selectedTemplate.templateText;
    // Substitute fields if placeholders exist
    selectedTemplate.fields.forEach((field) => {
      const val = fieldValues[field.key];
      if (val) {
        text = text.replaceAll(`[${field.label}]`, val);
      }
    });
    return text;
  };

  // State for AI drafting error
  const [aiError, setAiError] = useState<string | null>(null);

  // Generate or Refine with AI
  const handleAiRefine = async () => {
    setIsAiLoading(true);
    setAiError(null);

    const promptText = customPrompt.trim()
      ? customPrompt
      : `အောက်ပါ လျှောက်လွှာ ပုံစံအား တရားဝင် တရားရုံးသုံး လျှောက်လွှာ/စာချုပ် ပုံစံအတိုင်း အချက်အလက်များ ပြည့်စုံစွာ ရေးသားပေးပါ။\n\nပုံစံအမည်: ${selectedTemplate.title}\nအချက်အလက်များ: ${JSON.stringify(fieldValues, null, 2)}`;

    try {
      const res = await fetch('/api/legal-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          mode: 'drafting',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI မူကြမ်း ရေးသားရာတွင် အမှားအယွင်း ရှိသွားပါသည်။');
      }

      if (data.result) {
        setAiGeneratedDraft(data.result);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'AI စနစ်မှ တုံ့ပြန်မှု ရယူ၍ မရပါ။ ပြန်လည် ကြိုးစားပေးပါ။');
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentDraftText = getRenderedText();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDraftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentDraftText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate.id}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getGuidelineIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-blue-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 font-myanmar text-slate-100 max-w-6xl mx-auto">
      
      {/* Navigation Banner & Tabs */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                ဥပဒေ စာချုပ်စာတမ်းနှင့် လျှောက်လွှာ ရေးသားစနစ် (Legal Drafts & Contract Hub)
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                မြန်မာနိုင်ငံ တရားရုံးသုံး လျှောက်လွှာများ၊ အိမ်ခြံမြေ/ငွေချေး စာချုပ်များနှင့် တရားဝင် စာချုပ်ချုပ်ဆိုပုံ ဥပဒေရေးရာ လမ်းညွှန်များ။
              </p>
            </div>
          </div>

          {/* Switch Mode Tabs */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-stretch md:self-auto">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'generator'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>စာချုပ်/လျှောက်လွှာ မူကြမ်း ရေးသားရန်</span>
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'guidelines'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>စာချုပ်ချုပ်ဆိုပုံ ဥပဒေ လမ်းညွှန်</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: DRAFT GENERATOR & CONTRACT TEMPLATES */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Template Selection & Controls */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  ၁။ စာချုပ်/လျှောက်လွှာ အမျိုးအစား ရွေးချယ်ရန်
                </label>
                <span className="text-[10px] text-amber-400 font-medium">
                  {filteredTemplates.length} ခု တွေ့ရသည်
                </span>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="စာချုပ်အမည်ဖြင့် ရှာဖွေရန်..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  အားလုံး
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('civil_contract')}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                    selectedCategoryFilter === 'civil_contract'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  📄 စာချုပ်စာတမ်းများ
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('power_of_attorney')}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                    selectedCategoryFilter === 'power_of_attorney'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  📜 ကိုယ်စားလှယ်လွှဲစာ
                </button>
                <button
                  onClick={() => setSelectedCategoryFilter('court_applications')}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                    selectedCategoryFilter === 'court_applications'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ⚖️ တရားရုံး/ရဲစခန်း
                </button>
              </div>

              {/* Template List */}
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {filteredTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                      selectedTemplate.id === tmpl.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="block">{tmpl.title}</span>
                      <span className="text-[10px] text-slate-500 block">{tmpl.categoryLabel}</span>
                    </div>
                    <PenTool className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                ၂။ အချက်အလက်များ ဖြည့်သွင်းရန်
              </label>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={fieldValues[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Custom Draft Request */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <label className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI ဖြင့် စိတ်ကြိုက် စာချုပ်/လျှောက်လွှာ ရေးသားရန်</span>
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                placeholder="ဥပမာ - အိမ်ခြံမြေ အရောင်းအဝယ် ကတိစာချုပ်တွင် အတိုးပေးရန် ပျက်ကွက်ပါက စရံငွေ သိမ်းဆည်းမည့် အချက်အား သီးသန့် ထည့်သွင်းပေးပါ..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleAiRefine}
                disabled={isAiLoading}
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs rounded-xl hover:from-amber-400 hover:to-amber-300 shadow-md transition flex items-center justify-center space-x-2"
              >
                {isAiLoading ? (
                  <span>AI ဖြင့် ရေးသားနေပါသည်...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI ဖြင့် မူကြမ်း ပြင်ဆင်/ရေးသားမည်</span>
                  </>
                )}
              </button>

              {aiError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                  <Info className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Live Document Preview & Actions */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between min-h-[550px]">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">
                    {selectedTemplate.categoryLabel}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {selectedTemplate.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'ကူးယူပြီး' : 'ကူးယူရန်'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold text-xs rounded-lg transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ဒေါင်းလုဒ် (TXT)</span>
                  </button>
                </div>
              </div>

              {/* Document Render Canvas */}
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 text-xs md:text-sm text-slate-100 font-myanmar whitespace-pre-line leading-relaxed min-h-[420px] select-text">
                {currentDraftText}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>မြန်မာနိုင်ငံ တရားရုံးသုံးနှင့် စာချုပ်စာတမ်း မှတ်ပုံတင် စံနှုန်းအတိုင်း ရေးသားထားပါသည်။</span>
              </span>
              <button
                onClick={() => window.print()}
                className="text-slate-300 hover:text-amber-400 flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print ထုတ်ရန်</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: CONTRACT EXECUTION GUIDELINES */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>စာချုပ်စာတမ်း ချုပ်ဆိုရာတွင် သိရှိလိုက်နာရမည့် ဥပဒေရေးရာ လမ်းညွှန်ချက်များ</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              စာချုပ်များ တရားဝင် အာဏာတည်စေရန်၊ တရားရုံးတွင် သက်သေခံအဖြစ် လက်ခံနိုင်စေရန်နှင့် အရောင်းအဝယ်/ငွေကြေး ပဋိပက္ခများ မဖြစ်ပေါ်စေရန် မြန်မာနိုင်ငံ ပဋိညာဉ် အက်ဥပဒေ၊ တံဆိပ်ခေါင်းခွန် အက်ဥပဒေနှင့် စာချုပ် မှတ်ပုံတင်ခြင်း အက်ဥပဒေများအတိုင်း ရေးသား ပြုစုထားပါသည်။
            </p>
          </div>

          <div className="space-y-4">
            {CONTRACT_EXECUTION_GUIDELINES.map((guideline) => {
              const isExpanded = expandedGuidelineId === guideline.id;

              return (
                <div
                  key={guideline.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition"
                >
                  {/* Guideline Header Toggle */}
                  <button
                    onClick={() => setExpandedGuidelineId(isExpanded ? null : guideline.id)}
                    className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/60 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-slate-800 border border-slate-700/60 rounded-xl">
                        {getGuidelineIcon(guideline.icon)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{guideline.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{guideline.summary}</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-amber-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 shrink-0 ml-2" />
                    )}
                  </button>

                  {/* Expanded Content Body */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-6">
                      {guideline.sections.map((sec, idx) => (
                        <div key={idx} className="space-y-2 border-b border-slate-800/80 pb-4 last:border-b-0 last:pb-0">
                          <h5 className="text-xs font-bold text-amber-400 flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>{sec.heading}</span>
                          </h5>
                          <p className="text-xs text-slate-300 leading-relaxed pl-3">{sec.content}</p>

                          {sec.bulletPoints && (
                            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-5">
                              {sec.bulletPoints.map((pt, pIdx) => (
                                <li key={pIdx} className="leading-relaxed">
                                  {pt}
                                </li>
                              ))}
                            </ul>
                          )}

                          {sec.legalRef && (
                            <div className="pt-1 pl-3">
                              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                ⚖️ ဥပဒေ အကိုးအကား: {sec.legalRef}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
