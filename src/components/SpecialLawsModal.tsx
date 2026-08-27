import React, { useState } from 'react';
import { LAW_BOOKS } from '../data/lawsData';
import { ShieldCheck, Check, Sparkles, Lock, Unlock, Zap, Scale, Star } from 'lucide-react';

interface SpecialLawsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
  onUnlockSpecialLaws: () => void;
}

export const SpecialLawsModal: React.FC<SpecialLawsModalProps> = ({
  isOpen,
  onClose,
  isUnlocked,
  onUnlockSpecialLaws,
}) => {
  if (!isOpen) return null;

  const freeBooks = LAW_BOOKS.filter((b) => b.isFree);
  const specialBooks = LAW_BOOKS.filter((b) => !b.isFree);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto font-myanmar text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">
                  မြန်မာနိုင်ငံ အထူးဥပဒေများ (Special Laws Package)
                </h2>
                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  PRO LAWYER
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                ပင်မ ဥပဒေကြီး ၃ ခု (ရာဇသတ်ကြီး၊ ကျင့်ထုံး၊ ဖွဲ့စည်းပုံ) အခမဲ့ ဖတ်ရှုနိုင်ပြီး အထူးဥပဒေများ အပြည့်အဝ အသုံးပြုနိုင်ပါသည်။
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 rounded-xl text-xs"
          >
            ပိတ်မည်
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Status Badge */}
          {isUnlocked ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl flex items-center justify-between text-emerald-300">
              <div className="flex items-center space-x-3">
                <Check className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="font-bold text-sm">အထူးဥပဒေများ အားလုံး အသုံးပြုခွင့် ရရှိထားပါသည်!</h4>
                  <p className="text-xs text-slate-300">
                    ဆိုက်ဘာဥပဒေ၊ ဆက်သွယ်ရေး၊ ရင်းနှီးမြှုပ်နှံမှု၊ ကလေးအခွင့်အရေးနှင့် အထူးထိမ်းမြားခြင်း ဥပဒေများကို အပြည့်အဝ ရှာဖွေနိုင်ပါပြီ။
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-amber-400 block mb-1">
                  🎁 အထူးဥပဒေများ ရရှိနိုင်မှု အဆင့်
                </span>
                <h3 className="text-base font-bold text-white">
                  အထူးဥပဒေများ Package အား အခမဲ့ စမ်းသပ် ရယူနိုင်ပါသည်။
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  ရှေ့နေကြီးများနှင့် ဥပဒေပညာရှင်များအတွက် အထူးဥပဒေ ၇ ခုအား တိုက်ရိုက် Unlock ပြုလုပ်၍ အသုံးပြုပါ။
                </p>
              </div>

              <button
                onClick={onUnlockSpecialLaws}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition shrink-0 flex items-center space-x-2 justify-center"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>အထူးဥပဒေများ တိုက်ရိုက် ဖွင့်မည် (Free Trial Unlock)</span>
              </button>
            </div>
          )}

          {/* Core Free Laws */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>အခမဲ့ အမြဲတမ်း ရရှိနိုင်သော ပင်မဥပဒေကြီးများ (Free Core Laws)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {freeBooks.map((b) => (
                <div key={b.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{b.title}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      အခမဲ့
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Special Laws List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>အထူးဥပဒေများ (Special Laws Collection)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specialBooks.map((b) => (
                <div key={b.id} className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/30 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <span>{b.title}</span>
                    </h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {isUnlocked ? 'Unlocked' : 'Special Law'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {b.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>ပြဋ္ဌာန်းခုနှစ် - {b.enactedYear}</span>
                    <span className="text-amber-400 font-semibold">{b.sectionCount} ပုဒ် ပါဝင်</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            မြန်မာနိုင်ငံ တရားဥပဒေ ထုတ်ဝေချက်များအတိုင်း မှီးငြမ်း ပြုစုထားပါသည်။
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium"
          >
            ပိတ်မည်
          </button>
        </div>

      </div>
    </div>
  );
};
