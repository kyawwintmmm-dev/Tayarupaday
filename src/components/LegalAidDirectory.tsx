import { useState, useMemo } from 'react';
import { LEGAL_AID_ORGANIZATIONS, KNOW_YOUR_RIGHTS_FAQS } from '../data/legalAidData';
import { LegalAidOrganization, LegalFAQ } from '../types';
import { ShieldCheck, Phone, Mail, MapPin, ChevronDown, ChevronUp, Search, Users, HelpCircle, FileText, ExternalLink } from 'lucide-react';

export const LegalAidDirectory = () => {
  const [activeTab, setActiveTab] = useState<'aid_directory' | 'faq'>('aid_directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq_1');

  // Filtered Aid Orgs
  const filteredAidOrgs = useMemo(() => {
    return LEGAL_AID_ORGANIZATIONS.filter((org) => {
      if (selectedType !== 'All' && org.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          org.name.toLowerCase().includes(q) ||
          org.address.toLowerCase().includes(q) ||
          org.region.toLowerCase().includes(q) ||
          org.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedType]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return KNOW_YOUR_RIGHTS_FAQS.filter((faq) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          faq.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  return (
    <div className="space-y-6 font-myanmar text-slate-100 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ပြည်သူ့ ဥပဒေ အကူအညီ နှင့် အခွင့်အရေး သိကောင်းစရာများ</h2>
              <p className="text-xs text-slate-300 mt-1">
                အခမဲ့ တရားဥပဒေ အကူအညီပေးရေး အဖွဲ့အစည်းများ၊ ရဲစခန်းနှင့် တရားရုံးဆိုင်ရာ ပြည်သူ့အခွင့်အရေးများ။
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('aid_directory')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'aid_directory'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏢 အခမဲ့ ဥပဒေ အကူအညီပေးရေး အဖွဲ့များ
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'faq'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ❓ သိထားရမည့် အခွင့်အရေးများ (FAQ)
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="relative">
          <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'aid_directory'
                ? 'အဖွဲ့အစည်း အမည်၊ မြို့နယ် သို့မဟုတ် ဝန်ဆောင်မှု ရှာရန်...'
                : 'ဖမ်းဆီးခံရမှု၊ အာမခံ၊ FIR တိုင်စာ၊ သက်သေ အခွင့်အရေးများ ရှာရန်...'
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
          />
        </div>
      </div>

      {/* TAB 1: LEGAL AID DIRECTORY */}
      {activeTab === 'aid_directory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAidOrgs.map((org) => (
              <div
                key={org.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                      {org.type}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded">
                      {org.region}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {org.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {org.description}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs text-slate-300">
                    <div className="flex items-center space-x-2 text-amber-300">
                      <Phone className="w-4 h-4 shrink-0 text-amber-400" />
                      <span className="font-mono">{org.phone}</span>
                    </div>
                    {org.email && (
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="font-mono">{org.email}</span>
                      </div>
                    )}
                    <div className="flex items-start space-x-2 text-slate-400">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{org.address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-semibold block mb-1">အခမဲ့ ဝန်ဆောင်မှုများ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {org.services.map((srv, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-200 text-[11px] px-2 py-0.5 rounded">
                        • {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: KNOW YOUR RIGHTS FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition shadow-lg"
              >
                <button
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between space-x-4 hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 mb-1 inline-block">
                        {faq.category}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
                    <div className="whitespace-pre-line text-xs text-slate-200 leading-relaxed pt-3">
                      {faq.answer}
                    </div>

                    {faq.legalReferences && (
                      <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2 text-[11px] text-slate-400">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>ဥပဒေ အကိုးအကားများ: <strong className="text-slate-300">{faq.legalReferences.join(', ')}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
