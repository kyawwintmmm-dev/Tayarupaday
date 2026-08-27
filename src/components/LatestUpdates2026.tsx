import React, { useState } from 'react';
import { Newspaper, ShieldAlert, Cpu, Scale, FileCode, Check, Copy, Bot, ExternalLink, Calendar, Search, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface LatestUpdates2026Props {
  onAskAI?: (prompt: string, context: string) => void;
}

export const LatestUpdates2026: React.FC<LatestUpdates2026Props> = ({ onAskAI }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: '🌐 အားလုံး (All Updates)' },
    { id: 'bills', label: '📜 ဥပဒေသစ်များနှင့် ပြင်ဆင်ချက်များ' },
    { id: 'reforms', label: '🏛️ တရားစီရင်ရေး ပြုပြင်ပြောင်းလဲမှုများ' },
    { id: 'others', label: '📝 အခြားထင်ရှားသော အကြောင်းအရာများ' },
  ];

  const updateItems = [
    // --- Category 1: 📜 ဥပဒေသစ်များနှင့် ပြင်ဆင်ချက်များ ---
    {
      id: 'advocates_amendment_2026',
      category: 'bills',
      categoryLabel: 'ဥပဒေသစ်နှင့် ပြင်ဆင်ချက်',
      title: 'ရှေ့နေများအက်ဥပဒေ ပြင်ဆင်ချက် (Advocates Act Amendment)',
      date: '၂၀၂၆ ခုနှစ်၊ ဩဂုတ်လ ၃ ရက်',
      badge: 'ပြင်ဆင်ချက်ဥပဒေ',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: Scale,
      summary: 'ရှေ့နေများ၏ လုပ်ငန်းဆောင်ရွက်မှုများနှင့် စည်းကမ်းများကို ထပ်မံပြင်ဆင်သတ်မှတ်ထားသည်။ အသေးစိတ်အချက်အလက်များအတွက် တရားရေးဝန်ကြီးဌာန၏ ထုတ်ပြန်ချက်ကို ကြည့်ရှုနိုင်သည်။',
      details: [
        'တရားလွှတ်တော်ရှေ့နေများနှင့် အထက်တန်းရှေ့နေများ၏ စည်းကမ်းထိန်းသိမ်းရေးဆိုင်ရာ ပြဋ္ဌာန်းချက်များ အဆင့်မြှင့်တင်ခြင်း။',
        'ဒစ်ဂျစ်တယ် တရားရုံးစနစ်များတွင် ရှေ့နေများ လိုက်နာရမည့် စည်းကမ်းချက်များ ပါဝင်ခြင်း။'
      ],
      tags: ['ရှေ့နေများအက်ဥပဒေ', 'တရားရေးဝန်ကြီးဌာန', 'ရှေ့နေကျင့်ဝတ်', '၂၀၂၆ ဩဂုတ်']
    },
    {
      id: 'anti_online_scam_bill_2026',
      category: 'bills',
      categoryLabel: 'ဥပဒေသစ်နှင့် ပြင်ဆင်ချက်',
      title: 'အွန်လိုင်းငွေလိမ်မှုတိုက်ဖျက်ရေးဥပဒေ (Anti-Online Scam Bill 2026)',
      date: '၂၀၂၆ ခုနှစ်၊ ဇူလိုင်လ',
      badge: 'အထူးဥပဒေသစ်',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      icon: ShieldAlert,
      summary: 'အွန်လိုင်းငွေလိမ်မှု (Online Scam) များနှင့် ဆိုက်ဘာဒဏ်ရာရရှိမှုများကို ပြင်းထန်စွာ အရေးယူနိုင်ရန် သီးသန့် အထူးဥပဒေ ပြဋ္ဌာန်းခဲ့သည်။',
      highlights: [
        {
          title: '⚖️ ပြစ်ဒဏ်များ',
          desc: 'ငွေလိမ်လိမ်လုပ်ငန်းများတွင် အကြမ်းဖက်မှု၊ တရားမဝင်ဖမ်းဆီးချုပ်နှောင်မှုများ ကျူးလွန်ပါက ထောင်ဒဏ် ၁၀ နှစ်မှ တစ်သက်တစ်ကျွန်းအထိ ချမှတ်နိုင်ပြီး၊ သေဒဏ်အထိ ပြစ်ဒဏ်ချမှတ်နိုင်သည်။ အကယ်၍ အဆိုပါပြစ်မှုကြောင့် သေဆုံးပါက သေဒဏ် ချမှတ်ရမည်။'
        },
        {
          title: '💳 ဘဏ်စာရင်းအေးခဲခြင်း (Freeze Account)',
          desc: 'သံသယရှိသော ငွေလွှဲအကောင့်များကို ၁၅ မိနစ်အတွင်း အေးခဲနိုင်ပြီး၊ သံသယဖြစ်ဖွယ်အကောင့်များကို ၇၂ နာရီအထိ ရပ်ဆိုင်းထားနိုင်သည်။'
        },
        {
          title: '📡 စောင့်ကြည့်စနစ် (Monitoring Database)',
          desc: 'ဘဏ်များ၊ မိုဘိုင်းငွေပေးချေမှုဝန်ဆောင်မှုများ (Wave Pay, KPay စသည်)၊ တယ်လီကွန်အော်ပရေတာများနှင့် အင်တာနက်ဝန်ဆောင်မှုပေးသူများအား ဗဟိုပြုဒေတာဘေ့စ်မှတစ်ဆင့် အချက်အလက်များ ဖလှယ်ရန် လိုအပ်သည်။'
        }
      ],
      tags: ['Anti-Online Scam', 'အွန်လိုင်းငွေလိမ်မှု', 'သေဒဏ်', 'ဘဏ်စာရင်းအေးခဲခြင်း', 'ဆိုက်ဘာဥပဒေ']
    },

    // --- Category 2: 🏛️ တရားစီရင်ရေးဆိုင်ရာ ပြုပြင်ပြောင်းလဲမှုများ ---
    {
      id: 'ai_judiciary_integration_2026',
      category: 'reforms',
      categoryLabel: 'တရားစီရင်ရေး ပြုပြင်ပြောင်းလဲမှု',
      title: 'ဉာဏ်ရည်တု (AI) စတင်အသုံးပြုခြင်း (AI in Judiciary)',
      date: '၂၀၂၆ ခုနှစ်၊ ဇူလိုင်လ ၁၇ ရက်',
      badge: 'AI နည်းပညာ',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      icon: Cpu,
      summary: 'တရားစီရင်ရေးစနစ်တွင် AI နည်းပညာကို စတင်အသုံးပြုလာပြီး တရားရုံးများ၏ ထိရောက်မှုနှင့် တရားမျှတမှုကို မြှင့်တင်ရန် ရည်ရွယ်သည်။',
      details: [
        'အမှုဖြစ်စဉ်များ လျင်မြန်စွာ စိစစ်နိုင်ရန်နှင့် တရားရုံးမှတ်တမ်းများ ဒစ်ဂျစ်တယ် စနစ်သို့ ပြောင်းလဲရန် AI စနစ်များ စမ်းသပ် တပ်ဆင်။',
        'စီရင်ထုံး ရှာဖွေရေးနှင့် အမှုတွဲ စီမံခန့်ခွဲရေးတွင် စေတနာ့ဝန်ထမ်း AI Assistant များ ပံ့ပိုးပေးခြင်း။'
      ],
      tags: ['AI တရားစီရင်ရေး', 'Judiciary AI', 'ဒစ်ဂျစ်တယ်တရားရုံး', '၂၀၂၆ ဇူလိုင်']
    },
    {
      id: 'judicial_integrity_index_2026',
      category: 'reforms',
      categoryLabel: 'တရားစီရင်ရေး ပြုပြင်ပြောင်းလဲမှု',
      title: 'တရားစီရင်ရေး ဂုဏ်သိက္ခာဆိုင်ရာ အညွှန်းကိန်းများ (Judicial Integrity Index)',
      date: '၂၀၂၆ ခုနှစ်၊ ဇူလိုင်လ',
      badge: 'ဂုဏ်သိက္ခာ အညွှန်းကိန်း',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: ShieldCheck,
      summary: 'တရားရုံးများ၏ ဂုဏ်သိက္ခာကို တိုင်းတာရန်အတွက် ညွှန်းကိန်းများ ရေးဆွဲသွားမည်ဖြစ်ပြီး အဆိုပါအချက်များကို အဂတိလိုက်စားမှု တိုက်ဖျက်ရေးကော်မရှင်နှင့် ညှိနှိုင်းဆောင်ရွက်သွားမည်။',
      details: [
        'တရားရုံးအဆင့်ဆင့်၏ သန့်ရှင်းစက်ဆုပ်မှုနှင့် ပွင့်လင်းမြင်သာမှု စစ်ဆေးရေး။',
        'အဂတိလိုက်စားမှု လျော့နည်းစေရေး စောင့်ကြည့်စစ်ဆေးမှုများ တိုးမြှင့်ခြင်း။'
      ],
      tags: ['တရားစီရင်ရေးဂုဏ်သိက္ခာ', 'အဂတိတိုက်ဖျက်ရေး', 'Integrity Index']
    },
    {
      id: 'lawyer_ethics_training_2026',
      category: 'reforms',
      categoryLabel: 'တရားစီရင်ရေး ပြုပြင်ပြောင်းလဲမှု',
      title: 'ရှေ့နေနှင့် တရားသူကြီးများအတွက် ကျင့်ဝတ်သင်တန်း (Ethics & AML Training)',
      date: '၂၀၂၆ ခုနှစ်',
      badge: 'ကျင့်ဝတ် & AML',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: Scale,
      summary: 'တရားသူကြီးများနှင့် ရှေ့နေများအတွက် ကျင့်ဝတ်ဆိုင်ရာ သင်တန်းများ ပိုမိုချဲ့ထွင်သွားမည်ဖြစ်ပြီး ငွေကြေးခဝါချမှုတိုက်ဖျက်ရေး (AML) ဆိုင်ရာ ပညာပေးမှုများလည်း ဆောင်ရွက်သွားမည်။',
      details: [
        'ငွေကြေးခဝါချမှု တိုက်ဖျက်ရေးဥပဒေ (Anti-Money Laundering) လိုက်နာရမည့် စည်းကမ်းများ။',
        'ရှေ့နေ ကျင့်ဝတ် တိကျစွာ လိုက်နာရေး ပညာပေး သင်တန်းများ။'
      ],
      tags: ['ရှေ့နေကျင့်ဝတ်', 'ငွေကြေးခဝါချမှု', 'AML', 'တရားသူကြီးသင်တန်း']
    },
    {
      id: 'legal_branch_offices_2026',
      category: 'reforms',
      categoryLabel: 'တရားစီရင်ရေး ပြုပြင်ပြောင်းလဲမှု',
      title: 'ရှေ့နေရုံးခွဲများ ချဲ့ထွင်ခြင်း နှင့် ဒစ်ဂျစ်တယ်စနစ် (Digital Law Offices)',
      date: '၂၀၂၆ ခုနှစ်၊ မေလ',
      badge: 'ဒစ်ဂျစ်တယ် စနစ်',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: FileCode,
      summary: 'တရားရေးဝန်ကြီးဌာနအောက်တွင် မြို့နယ် ၁၀ မြို့နယ်၌ ရှေ့နေရုံးခွဲများ စမ်းသပ်ဖွင့်လှစ်ခဲ့ပြီး စာရင်းသွင်းခြင်းနှင့် စာရွက်စာတမ်းပြုလုပ်ခြင်းလုပ်ငန်းများကို ဒစ်ဂျစ်တယ်စနစ်သို့ ပြောင်းလဲဆောင်ရွက်လျက်ရှိသည်။',
      details: [
        'မြို့နယ် ၁၀ မြို့နယ်၌ ရှေ့နေရုံးခွဲများ စမ်းသပ်ဖွင့်လှစ်ခြင်း။',
        'စာချုပ်စာတမ်း စာရင်းသွင်းမှုဆိုင်ရာ ဒစ်ဂျစ်တယ်စနစ် (Online Registration) စတင်ခြင်း။'
      ],
      tags: ['ရှေ့နေရုံးခွဲ', 'ဒစ်ဂျစ်တယ်စနစ်', 'တရားရေးဝန်ကြီးဌာန', '၂၀၂၆ မေ']
    },

    // --- Category 3: 📝 အခြားထင်ရှားသော အကြောင်းအရာများ ---
    {
      id: 'ip_law_awareness_2026',
      category: 'others',
      categoryLabel: 'အခြား အကြောင်းအရာ',
      title: 'မူပိုင်ခွင့်ဥပဒေဆိုင်ရာ အသိပညာပေးခြင်း (IP Law Awareness)',
      date: '၂၀၂၆ ခုနှစ်',
      badge: 'မူပိုင်ခွင့် (IP)',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      icon: Sparkles,
      summary: 'တရားရုံးများမှ မူပိုင်ခွင့်ဥပဒေ (Intellectual Property Law) ဆိုင်ရာ အသိပညာပေးလုပ်ငန်းများကို ဆက်လက်ဆောင်ရွက်သွားမည်။',
      details: [
        'ကုန်အမှတ်တံဆိပ်၊ တီထွင်မှုနှင့် စာပေကဝိ မူပိုင်ခွင့်ဆိုင်ရာ အငြင်းပွားမှုများ စီရင်ရေး ပညာပေး။'
      ],
      tags: ['မူပိုင်ခွင့်ဥပဒေ', 'IP Law', 'ကုန်အမှတ်တံဆိပ်', 'အသိပညာပေး']
    },
    {
      id: 'consumer_protection_status_2026',
      category: 'others',
      categoryLabel: 'အခြား အကြောင်းအရာ',
      title: 'စားသုံးသူကာကွယ်ရေးဥပဒေ အခြေအနေ (Consumer Protection Law)',
      date: '၂၀၂၆ ခုနှစ်',
      badge: 'စားသုံးသူ ကာကွယ်ရေး',
      badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
      icon: Newspaper,
      summary: 'လက်ရှိဥပဒေသည် စားသုံးသူများကို ဈေးနှုန်းကိစ္စရပ်များတွင် အကာအကွယ်ပေးထားပြီး ယင်းကို ပြင်ဆင်ရန် လက်ရှိတွင် အစီအစဉ်မရှိကြောင်း သိရသည်။',
      details: [
        'ဈေးနှုန်း အလွန်အကျွန်း တင်ရောင်းသူများကို စားသုံးသူကာကွယ်ရေး ဥပဒေအရ အကာအကွယ်ပေးထားဆဲ ဖြစ်သည်။'
      ],
      tags: ['စားသုံးသူကာကွယ်ရေး', 'ဈေးနှုန်း ထိန်းချုပ်မှု', 'Consumer Rights']
    },
    {
      id: 'myanmar_fisheries_law_2026',
      category: 'others',
      categoryLabel: 'အခြား အကြောင်းအရာ',
      title: 'မြန်မာ့ငါးဖမ်းလုပ်ငန်းဥပဒေ ပြင်ဆင်ရေးဆွဲခြင်း (Myanmar Fisheries Law Revision)',
      date: '၂၀၂၆ ခုနှစ်',
      badge: 'ဥပဒေ မူကြမ်း',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      icon: AlertTriangle,
      summary: 'ပင်လယ်ကမ်းရိုးတန်းအနီးတွင် တရားမဝင်ငါးဖမ်းသည့် သင်္ဘောများကို ထိရောက်စွာ အရေးယူနိုင်ရန် ဥပဒေအား ပြင်ဆင်ရေးဆွဲလျက်ရှိသည်။',
      details: [
        'တရားမဝင် ပင်လယ်ပြင် ငါးဖမ်းသင်္ဘောများကို ပြင်းထန်သော ပြစ်ဒဏ်များ ပြဋ္ဌာန်းရန် ပြင်ဆင်ရေးဆွဲလျက်ရှိသည်။'
      ],
      tags: ['ငါးဖမ်းလုပ်ငန်းဥပဒေ', 'တရားမဝင်ငါးဖမ်းမှု', 'ပင်လယ်ကမ်းရိုးတန်း']
    }
  ];

  const filteredItems = updateItems.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      (item.details && item.details.some((d) => d.toLowerCase().includes(q))) ||
      (item.highlights && item.highlights.some((h) => h.title.toLowerCase().includes(q) || h.desc.toLowerCase().includes(q)));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 font-myanmar">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold">
            <Newspaper className="w-4 h-4" />
            <span>၂၀၂၆ ခုနှစ် တရားရေးရာ အထူးသတင်းလွှာ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ၂၀၂၆ ခုနှစ်အတွင်း နောက်တိုးဥပဒေသစ်များနှင့် တရားစီရင်ရေး အပြောင်းအလဲများ
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            ၂၀၂၆ ခုနှစ်အတွင်း မြန်မာနိုင်ငံ၏ တရားရေးကဏ္ဍတွင် အရေးကြီးသော ဥပဒေသစ်များနှင့် ပြောင်းလဲမှုများ ရှိလာပါသည်။ ရှေ့နေနှင့် ပြည်သူများ သိရှိသင့်သည့် အချက်များကို စုစည်းဖော်ပြထားပါသည်။
          </p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition font-medium ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ဥပဒေသစ် / အကြောင်းအရာ ရှာရန်..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            ရှာဖွေမှုနှင့် ကိုက်ညီသော ၂၀၂၆ ဥပဒေသစ် မရှိပါ။
          </div>
        ) : (
          filteredItems.map((item) => {
            const IconComponent = item.icon;
            const fullContentToCopy = `${item.title} (${item.date})\n${item.summary}\n${
              item.highlights ? item.highlights.map((h) => `${h.title}: ${h.desc}`).join('\n') : ''
            }${item.details ? item.details.join('\n') : ''}`;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition shadow-lg space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{item.date}</span>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() => handleCopy(item.id, fullContentToCopy)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                      title="ကူးယူရန်"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">ကူးယူပြီး</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>ကူးယူမည်</span>
                        </>
                      )}
                    </button>

                    {onAskAI && (
                      <button
                        onClick={() =>
                          onAskAI(
                            `၂၀၂၆ ခုနှစ်အတွင်း ပြဋ္ဌာန်း/ပြောင်းလဲခဲ့သော "${item.title}" အကြောင်းအား အသေးစိတ် ရှင်းပြပေးပါ။ ရှေ့နေများနှင့် ပြည်သူများအတွက် သက်ရောက်မှုများကို ပါဝင်အောင် ရှင်းပြပါ။`,
                            item.title
                          )
                        }
                        className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>AI မေးမည်</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm text-slate-200 leading-relaxed">
                  {item.summary}
                </p>

                {/* Highlights (if any, e.g. Anti-Online Scam Law) */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
                    {item.highlights.map((h, idx) => (
                      <div key={idx} className="space-y-1">
                        <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                          <span>{h.title}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-amber-500/40">
                          {h.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bullet details (if any) */}
                {item.details && item.details.length > 0 && (
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                    {item.details.map((d, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tags */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-1 pt-1">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Official Disclaimer Footer Card */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>သတိပြုရန်နှင့် သတင်းအချက်အလက် အတည်ပြုချက် (Legal Notice)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          အထက်ဖော်ပြပါ အချက်အလက်များသည် ၂၀၂၆ ခုနှစ် ဩဂုတ်လ ၁၀ ရက်နေ့အထိ စုဆောင်းရရှိထားသော သတင်းများဖြစ်ပါသည်။ တိကျသော ဥပဒေဆိုင်ရာ အကြံပြုချက်များအတွက် ကျွမ်းကျင်ရှေ့နေများနှင့် တိုင်ပင်ဆွေးနွေးရန် အကြံပြုအပ်ပါသည်။
        </p>
      </div>
    </div>
  );
};
