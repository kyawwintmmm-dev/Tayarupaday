import React, { useState } from 'react';
import { 
  User, Bell, ChevronRight, Crown, Share2, Palette, Type, Globe, 
  RefreshCw, MessageSquare, HelpCircle, PhoneCall, Shield, 
  FileText, Heart, Sparkles, Check, Moon, Sun, Monitor, Info
} from 'lucide-react';

interface MoreSettingsViewProps {
  userEmail?: string;
  userName?: string;
  onOpenSpecialLaws: () => void;
  onNavigateTab?: (tab: string) => void;
  currentTheme?: 'dark' | 'light' | 'system';
  onThemeChange?: (theme: 'dark' | 'light' | 'system') => void;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  onFontSizeChange?: (size: 'sm' | 'base' | 'lg' | 'xl' | '2xl') => void;
  selectedLanguage?: 'my' | 'en';
  onLanguageChange?: (lang: 'my' | 'en') => void;
}

export const MoreSettingsView: React.FC<MoreSettingsViewProps> = ({
  userEmail = 'kyawwin64.mm@gmail.com',
  userName = 'kyaw win',
  onOpenSpecialLaws,
  onNavigateTab,
  currentTheme = 'dark',
  onThemeChange,
  fontSize = 'base',
  onFontSizeChange,
  selectedLanguage = 'my',
  onLanguageChange,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('myanmar_law_hub_notifications') !== 'false';
    } catch {
      return true;
    }
  });

  const [noteAccentColor, setNoteAccentColor] = useState<string>(() => {
    try {
      return localStorage.getItem('myanmar_law_hub_note_accent') || 'amber';
    } catch {
      return 'amber';
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showStyleModal, setShowStyleModal] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'မြန်မာဥပဒေရေးရာ လက်စွဲ (Myanmar Law Hub Pro)',
        text: 'ရာဇသတ်ကြီး၊ ကျင့်ထုံး၊ စီရင်ထုံးများနှင့် AI ဥပဒေအကြံပေး စနစ်ပါဝင်သော မြန်မာဥပဒေ App ကို ဒေါင်းလုဒ်ဆွဲပါ!',
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        showToast('App Link ကို Copy ယူလိုက်ပါပြီ');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('App Link ကို Copy ယူလိုက်ပါပြီ');
    }
  };

  const handleCheckUpdate = () => {
    showToast('သင့် App သည် နောက်ဆုံးထွက် v2.5.0 (2026 Version) သို့ အဆင့်မြှင့်ထားပြီးဖြစ်ပါသည်');
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    showToast('ကျေးဇူးတင်ပါသည်! သင့် အကြံပြုချက်ကို ပေးပို့လိုက်ပါပြီ။');
    setFeedbackText('');
    setShowFeedbackModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-myanmar text-slate-100 pb-12 animate-fadeIn">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl border border-amber-300 animate-bounce flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & User Profile Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold flex items-center justify-center text-lg shadow-md border-2 border-amber-400">
            {userName ? userName.charAt(0).toUpperCase() : 'K'}
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span>{userName}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                Pro Member
              </span>
            </h1>
            <p className="text-xs text-slate-400">{userEmail}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => showToast('အသိပေးချက် အသစ် ၃ ခု ရှိပါသည်')}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-slate-900"></span>
          </button>
        </div>
      </div>

      {/* Free Trial / Subscription Usage Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 p-5 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
            အခမဲ့
          </span>
          <span className="text-amber-300 font-semibold">1 hr 29 min ကျန်ပါသည်</span>
        </div>

        <div>
          <p className="text-sm font-bold text-white">
            သင့် 2 hr အခမဲ့ စမ်းသပ်ကာလမှ တစ်ကြိမ်သာ ဖြစ်သည်။
          </p>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden border border-slate-700">
            <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full w-[75%] rounded-full transition-all duration-500"></div>
          </div>
        </div>

        <button
          onClick={onOpenSpecialLaws}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2 mt-2"
        >
          <Crown className="w-4 h-4 text-slate-950" />
          <span>အစီအစဉ်များ ကြည့်ရန် / VIP အပြည့်အဝ ရယူရန်</span>
        </button>
      </div>

      {/* Section 1: အရင်းအမြစ်များ (Resources & Guides) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          အရင်းအမြစ်များ
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-lg">
          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('legal_aid');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  အက်ပ် မိတ်ဆက်
                </h3>
                <p className="text-xs text-slate-400">မိတ်ဆက်အကျဉ်းကို အချိန်မရွေး ပြန်ကြည့်နိုင်ပါတယ်</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('precedents');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-emerald-400 rounded-xl group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  လေ့လာမယ်
                </h3>
                <p className="text-xs text-slate-400">လမ်းညွှန်နဲ့ သင်ခန်းစာများ</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Section 2: အစီအစဉ် (Plans & Share) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          အစီအစဉ်
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-lg">
          <button
            onClick={onOpenSpecialLaws}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl group-hover:scale-105 transition">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  Pro သို့ အဆင့်မြှင့်မယ်
                </h3>
                <p className="text-xs text-slate-400">အကန့်အသတ်မရှိ မှတ်စုများနှင့် အခြားအရာများ</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={handleShareApp}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-blue-400 rounded-xl group-hover:scale-105 transition">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  သူငယ်ချင်းတွေကို ဖိတ်ခေါ်မယ်
                </h3>
                <p className="text-xs text-slate-400">ဖိတ်ခေါ်ကူပွန်တွေ မျှဝေပြီး အသုံးပြုလိုက်ပါ</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Section 3: စိတ်ကြိုက် ဆက်တင်များ (Custom Settings) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          စိတ်ကြိုက် ဆက်တင်များ
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5 shadow-lg">
          
          {/* Note Style */}
          <button
            onClick={() => setShowStyleModal(true)}
            className="w-full flex items-center justify-between border-b border-slate-800 pb-4 text-left group hover:opacity-90 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-indigo-400 rounded-xl group-hover:scale-105 transition">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  ကိုယ်ပိုင် Style များ
                </h3>
                <p className="text-xs text-slate-400">သင့်မှတ်စု အရောင်နှင့် Style များကို စီမံပါ</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </button>

          {/* Notifications */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">အသိပေးချက်များ</h3>
                <p className="text-xs text-slate-400">Push နဲ့ အီးမေးလ် ဆက်တင်များ</p>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !notificationsEnabled;
                setNotificationsEnabled(next);
                try {
                  localStorage.setItem('myanmar_law_hub_notifications', String(next));
                } catch (e) {
                  console.error(e);
                }
                showToast(next ? 'အသိပေးချက်များ ဖွင့်လိုက်ပါပြီ' : 'အသိပေးချက်များ ပိတ်လိုက်ပါပြီ');
              }}
              className={`w-11 h-6 rounded-full transition p-1 relative ${
                notificationsEnabled ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Theme Selector */}
          <div className="space-y-2.5 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-purple-400 rounded-xl">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">အသွင်အပြင်</h3>
                <p className="text-xs text-slate-400">
                  {currentTheme === 'dark' ? 'အမှောင်' : currentTheme === 'light' ? 'အလင်း' : 'စက်အတိုင်း'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => onThemeChange && onThemeChange('light')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                  currentTheme === 'light'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>အလင်း</span>
              </button>

              <button
                onClick={() => onThemeChange && onThemeChange('system')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                  currentTheme === 'system'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>စက်အတိုင်း</span>
              </button>

              <button
                onClick={() => onThemeChange && onThemeChange('dark')}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                  currentTheme === 'dark'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>အမှောင်</span>
              </button>
            </div>
          </div>

          {/* Font Size Selector */}
          <div className="space-y-2.5 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-emerald-400 rounded-xl">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">စာလုံးအရွယ်အစား</h3>
                <p className="text-xs text-slate-400">
                  {fontSize === 'sm' ? 'အသေး' : fontSize === 'base' ? 'ပုံမှန်' : fontSize === 'lg' ? 'အကြီး' : fontSize === 'xl' ? 'XL' : '2XL'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[
                { id: 'sm', label: 'အသေး' },
                { id: 'base', label: 'ပုံမှန်' },
                { id: 'lg', label: 'အကြီး' },
                { id: 'xl', label: 'XL' },
                { id: '2xl', label: '2XL' },
              ].map((sz) => (
                <button
                  key={sz.id}
                  onClick={() => onFontSizeChange && onFontSizeChange(sz.id as any)}
                  className={`py-2 rounded-xl border text-xs font-semibold transition ${
                    fontSize === sz.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-blue-400 rounded-xl">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">အက်ပ် ဘာသာစကား</h3>
                <p className="text-xs text-slate-400">
                  {selectedLanguage === 'my' ? 'မြန်မာ' : 'English'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  if (onLanguageChange) onLanguageChange('en');
                  showToast('App Language switched to English');
                }}
                className={`py-2.5 rounded-xl border text-xs font-semibold transition ${
                  selectedLanguage === 'en'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                English
              </button>

              <button
                onClick={() => {
                  if (onLanguageChange) onLanguageChange('my');
                  showToast('အက်ပ် ဘာသာစကား မြန်မာသို့ ပြောင်းလဲလိုက်ပါပြီ');
                }}
                className={`py-2.5 rounded-xl border text-xs font-semibold transition ${
                  selectedLanguage === 'my'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                မြန်မာ
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Section 4: အထောက်အကူ (Support & App Info) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          အထောက်အကူ
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-lg">
          <button
            onClick={handleCheckUpdate}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-cyan-400 rounded-xl group-hover:scale-105 transition">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  အပ်ဒိတ် စစ်မယ်
                </h3>
                <p className="text-xs text-slate-400">နောက်ဆုံးဗားရှင်း ဖြစ်နေရဲ့လား စစ်ကြည့်ပါ</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => setShowFeedbackModal(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl group-hover:scale-105 transition">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  အကြံပြုချက် ပို့မယ်
                </h3>
                <p className="text-xs text-slate-400">Myanmar Law Hub ပိုကောင်းလာအောင် ကူညီပေးပါ</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('legal_aid');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-emerald-400 rounded-xl group-hover:scale-105 transition">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  အကူအညီ
                </h3>
                <p className="text-xs text-slate-400">FAQ နဲ့ အကူအညီများ</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => showToast('နည်းပညာ ကူညီပံ့ပိုးမှု support@myanmarlawhub.org သို့ အီးမေးလ် ပို့နိုင်ပါသည်')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 text-pink-400 rounded-xl group-hover:scale-105 transition">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  ဆက်သွယ်မယ်
                </h3>
                <p className="text-xs text-slate-400">မက်ဆင်ဂျာ၊ ဖုန်းတွက်ခ် (သို့) အီးမေးလ်နဲ့ ဆက်သွယ်နိုင်ပါတယ်</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="pt-6 text-center space-y-3 text-xs text-slate-500 border-t border-slate-800/80">
        <div className="flex items-center justify-center space-x-4 text-slate-400 font-semibold">
          <button onClick={() => showToast('ကိုယ်ရေးကိုယ်တာ လုံခြုံမှု မူဝါဒ')} className="hover:text-amber-400 transition">
            ကိုယ်ရေးကိုယ်တာ လုံခြုံမှုမူဝါဒ
          </button>
          <span>•</span>
          <button onClick={() => showToast('ဝန်ဆောင်မှု စည်းမျဉ်းများ')} className="hover:text-amber-400 transition">
            ဝန်ဆောင်မှု စည်းမျဉ်းများ
          </button>
        </div>

        <div>
          <p className="font-bold text-slate-300">Myanmar Law Hub Pro v2.5.0 (Build 38)</p>
          <p className="text-slate-500 text-[11px] mt-1 flex items-center justify-center space-x-1">
            <span>မြန်မာပြည်မှာ</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>မေတ္တာဖြင့် ဖန်တီးထားပါသည်</span>
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>အကြံပြုချက် ပေးပို့ရန်</span>
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Myanmar Law Hub တွင် ထပ်မံထည့်သွင်းစေလိုသော အချက်များ သို့မဟုတ် သုံးသပ်ချက်များ ရေးသားပါ..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 h-28"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400"
                >
                  ပေးပို့မည်
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Style Customization Modal */}
      {showStyleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center space-x-2">
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>ကိုယ်ပိုင် မှတ်စု Style များ စီမံရန်</span>
              </h3>
              <button
                onClick={() => setShowStyleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-2">
                  ၁။ မှတ်စု ကဒ်ပြား အရောင် (Note Card Accent Color):
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'amber', name: 'ရွှေဝါ', bg: 'bg-amber-500' },
                    { id: 'emerald', name: 'မြစိမ်း', bg: 'bg-emerald-500' },
                    { id: 'blue', name: 'ပြာလွင်', bg: 'bg-blue-500' },
                    { id: 'rose', name: 'ပန်းရောင်', bg: 'bg-rose-500' },
                    { id: 'purple', name: 'ခရမ်း', bg: 'bg-purple-500' },
                  ].map((clr) => (
                    <button
                      key={clr.id}
                      onClick={() => {
                        setNoteAccentColor(clr.id);
                        try {
                          localStorage.setItem('myanmar_law_hub_note_accent', clr.id);
                        } catch (e) {
                          console.error(e);
                        }
                        showToast(`မှတ်စု အရောင်ကို ${clr.name} သို့ ပြောင်းလိုက်ပါပြီ`);
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition ${
                        noteAccentColor === clr.id
                          ? 'border-white bg-slate-800 shadow-md ring-2 ring-amber-400'
                          : 'border-slate-800 bg-slate-950 hover:bg-slate-800'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${clr.bg}`} />
                      <span className="text-[10px] text-slate-300 font-semibold">{clr.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="text-slate-300 font-semibold block mb-2">
                  ၂။ မှတ်စု အလိုအလျောက် သိမ်းဆည်းမှု (Auto-save Notes):
                </label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300">စာရိုက်တိုင်း အလိုအလျောက် သိမ်းမည်</span>
                  <span className="text-amber-400 font-bold">ဖွင့်ထားသည် ✓</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowStyleModal(false)}
                className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400"
              >
                ပြီးပါပြီ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
