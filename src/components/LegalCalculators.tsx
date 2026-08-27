import { useState, useMemo } from 'react';
import { Calculator, Calendar, DollarSign, FileCheck, ShieldAlert, Sparkles, Clock, CheckCircle2, Info } from 'lucide-react';

export const LegalCalculators = () => {
  const [activeTab, setActiveTab] = useState<'court_fees' | 'stamp_duty' | 'limitation'>('court_fees');

  // --- Court Fee State ---
  const [suitValue, setSuitValue] = useState<string>('10000000'); // 1 Crore MMK default
  const [suitType, setSuitType] = useState<'money' | 'property' | 'ejectment' | 'declaration'>('money');

  // --- Stamp Duty State ---
  const [contractType, setContractType] = useState<'conveyance' | 'lease' | 'promissory' | 'mortgage' | 'gpa' | 'business'>('conveyance');
  const [contractValue, setContractValue] = useState<string>('50000000'); // 5 Crores MMK
  const [leaseYears, setLeaseYears] = useState<number>(1);

  // --- Limitation Calculator State ---
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [actionType, setActionType] = useState<string>('district_appeal');

  // --- Calculations ---

  // Court Fees Calculation (Court Fees Act 1870)
  const courtFeeResult = useMemo(() => {
    const val = parseFloat(suitValue) || 0;
    if (val <= 0) return { fee: 0, breakdown: 'တန်ဖိုး ထည့်သွင်းပါ။' };

    if (suitType === 'ejectment' || suitType === 'declaration') {
      return {
        fee: 10000,
        breakdown: 'ကြေညာပေးစေလိုမှု / နှင်ထုတ်လိုမှုအတွက် ပုံသေ တရားရုံး အခကြေးငွေ - ကျပ် ၁၀,၀၀၀/-',
        note: 'ပစ္စည်း ပိုင်ဆိုင်ခွင့် သီးခြား တောင်းဆိုပါက ပစ္စည်း တန်ဖိုးအလိုက် အခကြေးငွေ ပေးဆောင်ရမည်။'
      };
    }

    let fee = 0;
    // Myanmar Court Fees Act Tiers
    if (val <= 10000) {
      fee = val * 0.075;
    } else if (val <= 20000) {
      fee = 750 + (val - 10000) * 0.05;
    } else {
      fee = 750 + 500 + (val - 20000) * 0.03;
    }

    return {
      fee: Math.round(fee),
      breakdown: `အမှုတန်ဖိုး ကျပ် ${val.toLocaleString()} အပေါ် တရားရုံးခွန် - ကျပ် ${Math.round(fee).toLocaleString()}/-`,
      note: 'အက်ဥပဒေ ဇယား (၁) အရ သတ်မှတ်ထားသော တရားရုံးခွန် နှုန်းထား ဖြစ်ပါသည်။'
    };
  }, [suitValue, suitType]);

  // Stamp Duty Calculation (Myanmar Stamp Act 1899)
  const stampDutyResult = useMemo(() => {
    const val = parseFloat(contractValue) || 0;
    if (contractType === 'gpa') {
      return {
        duty: 20000,
        municipalTax: 0,
        total: 20000,
        rateText: 'GPA / SPA ကိုယ်စားလှယ်လွှဲစာ ပုံသေ တံဆိပ်ခေါင်းခွန် - ကျပ် ၂၀,၀၀၀/-'
      };
    }

    if (val <= 0) return { duty: 0, municipalTax: 0, total: 0, rateText: 'တန်ဖိုး ထည့်သွင်းပါ။' };

    let dutyRate = 0;
    let municipalTaxRate = 0;

    switch (contractType) {
      case 'conveyance': // အိမ်ခြံမြေ အရောင်းအဝယ်
        dutyRate = 0.03; // 3% Stamp Duty
        municipalTaxRate = 0.02; // 2% City Tax
        break;
      case 'lease': // အိမ်ခြံမြေ အငှား
        if (leaseYears <= 1) dutyRate = 0.005; // 0.5%
        else if (leaseYears <= 3) dutyRate = 0.01; // 1%
        else dutyRate = 0.015; // 1.5%
        break;
      case 'promissory': // ချေးငွေ / ကတိစာချုပ်
        dutyRate = 0.005; // 0.5%
        break;
      case 'mortgage': // ပေါင်နှံခြင်း
        dutyRate = 0.01; // 1%
        break;
      case 'business': // စီးပွားရေး/JV စာချုပ်
        dutyRate = 0.005; // 0.5%
        break;
    }

    const duty = Math.round(val * dutyRate);
    const municipalTax = Math.round(val * municipalTaxRate);
    const total = duty + municipalTax;

    return {
      duty,
      municipalTax,
      total,
      rateText: `တံဆိပ်ခေါင်းခွန် (${(dutyRate * 100).toFixed(1)}%) = ကျပ် ${duty.toLocaleString()}/-` + 
        (municipalTax > 0 ? ` + စည်ပင်အခွန် (၂%) = ကျပ် ${municipalTax.toLocaleString()}/-` : '')
    };
  }, [contractType, contractValue, leaseYears]);

  // Limitation Period Calculation (Limitation Act 1908)
  const limitationResult = useMemo(() => {
    if (!startDate) return null;

    const start = new Date(startDate);
    if (isNaN(start.getTime())) return null;

    let daysToAdd = 0;
    let monthsToAdd = 0;
    let yearsToAdd = 0;
    let lawSection = '';
    let description = '';

    switch (actionType) {
      case 'district_appeal':
        daysToAdd = 30;
        lawSection = 'သတ်မှတ်ကာလ အက်ဥပဒေ ဇယား (၁) - အပိုဒ် ၁၅၂';
        description = 'ခရိုင် တရားရုံး သို့မဟုတ် ခရိုင် တရားသူကြီးထံ တရားမ အယူခံလွှာ တင်သွင်းရန် သတ်မှတ်ကာလ။';
        break;
      case 'high_court_appeal':
        daysToAdd = 90;
        lawSection = 'သတ်မှတ်ကာလ အက်ဥပဒေ ဇယား (၁) - အပိုဒ် ၁၅၆';
        description = 'တိုင်းဒေသကြီး/ပြည်နယ် သို့မဟုတ် ပြည်ထောင်စု တရားလွှတ်တော်ချုပ်သို့ တရားမ အယူခံ တင်သွင်းရန်။';
        break;
      case 'civil_revision':
        daysToAdd = 90;
        lawSection = 'သတ်မှတ်ကာလ အက်ဥပဒေ ဇယား (၁) - အပိုဒ် ၁၆၀';
        description = 'တရားမ ပြင်ဆင်မှု သို့မဟုတ် သုံးသပ်မှု လျှောက်ထားရန် သတ်မှတ်ကာလ။';
        break;
      case 'money_suit':
        yearsToAdd = 3;
        lawSection = 'သတ်မှတ်ကာလ အက်ဥပဒေ ဇယား (၁) - အပိုဒ် ၅၇/၆၇';
        description = 'ချေးငွေ သို့မဟုတ် ကြွေးမြီ တောင်းဆိုမှုအတွက် တရားမ စွဲဆိုရန် သတ်မှတ်ကာလ။';
        break;
      case 'contract_breach':
        yearsToAdd = 3;
        lawSection = 'သတ်မှတ်ကာလ အက်ဥပဒေ ဇယား (၁) - အပိုဒ် ၁၁၃';
        description = 'ကတိစာချုပ် ချိုးဖောက်မှုအတွက် သီးခြား ဆောင်ရွက်ပေးစေလိုမှု (Specific Performance) တရားစွဲဆိုရန်။';
        break;
      case 'property_possession':
        yearsToAdd = 12;
        lawSection = 'သတ်မှတ်ကာလ အက်ဥပဒေ ဇယား (၁) - အပိုဒ် ၁၄၂/၁၄၄';
        description = 'မရွှေ့မပြောင်းနိုင်သော ပိုင်ဆိုင်ခွင့် ပစ္စည်းအား ပြန်လည် ရယူရန် တရားစွဲဆိုရန် သတ်မှတ်ကာလ။';
        break;
    }

    const deadline = new Date(start);
    if (daysToAdd > 0) deadline.setDate(deadline.getDate() + daysToAdd);
    if (monthsToAdd > 0) deadline.setMonth(deadline.getMonth() + monthsToAdd);
    if (yearsToAdd > 0) deadline.setFullYear(deadline.getFullYear() + yearsToAdd);

    // Burmese formatted date
    const formattedDeadline = deadline.toLocaleDateString('my-MM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      deadlineDate: deadline.toISOString().split('T')[0],
      formattedDeadline,
      lawSection,
      description,
      daysRemaining: Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    };
  }, [startDate, actionType]);

  return (
    <div className="space-y-6 font-myanmar text-slate-100 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">တရားရုံး အခကြေးငွေ၊ တံဆိပ်ခေါင်းခွန် နှင့် သတ်မှတ်ကာလ တွက်ချက်စနစ်</h2>
              <p className="text-xs text-slate-300 mt-1">
                မြန်မာနိုင်ငံ တရားရုံးခွန် အက်ဥပဒေ၊ တံဆိပ်ခေါင်းခွန် အက်ဥပဒေ နှင့် သတ်မှတ်ကာလ အက်ဥပဒေ (၁၉၀၈) အပေါ် အခြေခံ၍ စနစ်တကျ တွက်ချက်ပေးပါသည်။
              </p>
            </div>
          </div>

          {/* Calculator Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('court_fees')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'court_fees'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏛️ တရားရုံးခွန် (Court Fees)
            </button>
            <button
              onClick={() => setActiveTab('stamp_duty')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'stamp_duty'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📄 တံဆိပ်ခေါင်းခွန် (Stamp Duty)
            </button>
            <button
              onClick={() => setActiveTab('limitation')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'limitation'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⏳ သတ်မှတ်ကာလ (Limitation)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: COURT FEES CALCULATOR */}
      {activeTab === 'court_fees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>အမှုတန်ဖိုး နှင့် အမှုအမျိုးအစား ထည့်သွင်းပါ</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">အမှု အမျိုးအစား:</label>
              <select
                value={suitType}
                onChange={(e) => setSuitType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="money">ကြွေးမြီ / ငွေတောင်းခံမှု အမှု (Money Suit)</option>
                <option value="property">ပစ္စည်း ပိုင်ဆိုင်ခွင့် တောင်းဆိုမှု (Property Suit)</option>
                <option value="ejectment">အိမ်ငှား/မြေငှား နှင်ထုတ်လိုမှု (Ejectment Suit)</option>
                <option value="declaration">ကြေညာပေးစေလိုမှု (Declaratory Decree)</option>
              </select>
            </div>

            {(suitType === 'money' || suitType === 'property') && (
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-medium">အမှုတန်ဖိုး (ကျပ်):</label>
                <input
                  type="number"
                  value={suitValue}
                  onChange={(e) => setSuitValue(e.target.value)}
                  placeholder="ဥပမာ - ၁၀၀၀၀၀၀၀"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <span className="text-[11px] text-slate-400">
                  စာလုံးဖြင့် - {parseFloat(suitValue) ? `${(parseFloat(suitValue) / 100000).toLocaleString()} သိန်းကျပ်` : '၀'}
                </span>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400">တွက်ချက်ရရှိသော တရားရုံး အခကြေးငွေ</span>
              
              <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/30 space-y-2">
                <span className="text-xs text-slate-400">ပေးဆောင်ရမည့် စုစုပေါင်း တရားရုံးခွန်:</span>
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  ကျပ် {courtFeeResult.fee.toLocaleString()} /-
                </div>
                <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                  {courtFeeResult.breakdown}
                </p>
              </div>

              {courtFeeResult.note && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{courtFeeResult.note}</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3">
              * တရားရုံးခွန် အက်ဥပဒေ (Court Fees Act 1870) ဇယား (၁) ပါ သတ်မှတ်ချက်များအတိုင်း တွက်ချက်ထားပါသည်။
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAMP DUTY CALCULATOR */}
      {activeTab === 'stamp_duty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <FileCheck className="w-4 h-4" />
              <span>စာချုပ် အချက်အလက်များ ထည့်သွင်းပါ</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">စာချုပ် အမျိုးအစား:</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="conveyance">အိမ်ခြံမြေ အရောင်းအဝယ် စာချုပ် (Deed of Conveyance)</option>
                <option value="lease">အိမ်/မြေ အငှား စာချုပ် (Lease Agreement)</option>
                <option value="promissory">ချေးငွေ / ကတိစာချုပ် (Promissory Note / Loan)</option>
                <option value="mortgage">အပေါင်စာချုပ် (Mortgage Deed)</option>
                <option value="gpa">GPA / SPA ကိုယ်စားလှယ်လွှဲစာ</option>
                <option value="business">စီးပွားရေး / ဖက်စပ် လုပ်ငန်း စာချုပ် (JV Agreement)</option>
              </select>
            </div>

            {contractType !== 'gpa' && (
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-medium">စာချုပ်ပါ စုစုပေါင်း တန်ဖိုး (ကျပ်):</label>
                <input
                  type="number"
                  value={contractValue}
                  onChange={(e) => setContractValue(e.target.value)}
                  placeholder="ဥပမာ - ၅၀၀၀၀၀၀၀"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <span className="text-[11px] text-slate-400">
                  {parseFloat(contractValue) ? `${(parseFloat(contractValue) / 100000).toLocaleString()} သိန်းကျပ်` : '၀'}
                </span>
              </div>
            )}

            {contractType === 'lease' && (
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-medium">အငှား သက်တမ်း (နှစ်):</label>
                <select
                  value={leaseYears}
                  onChange={(e) => setLeaseYears(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={1}>၁ နှစ် နှင့် အောက် (0.5%)</option>
                  <option value={3}>၁ နှစ်မှ ၃ နှစ်အထိ (1.0%)</option>
                  <option value={5}>၃ နှစ် ထက်ကျော်လွန် (1.5%)</option>
                </select>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400">ကျသင့်မည့် တံဆိပ်ခေါင်းခွန် နှင့် အခွန်အခများ</span>

              <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/30 space-y-2">
                <span className="text-xs text-slate-400">စုစုပေါင်း ပေးဆောင်ရမည့် တံဆိပ်ခေါင်းခွန်:</span>
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  ကျပ် {stampDutyResult.total.toLocaleString()} /-
                </div>
                <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                  {stampDutyResult.rateText}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3">
              * မြန်မာနိုင်ငံ တံဆိပ်ခေါင်းခွန် အက်ဥပဒေ (Myanmar Stamp Act) ဇယား (၁) ပါ စံနှုန်းများအတိုင်း တွက်ချက်ထားပါသည်။
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIMITATION PERIOD CALCULATOR */}
      {activeTab === 'limitation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>အမိန့်နေ့စွဲ နှင့် အမှုအမျိုးအစား ရွေးချယ်ပါ</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">အရေးယူဆောင်ရွက်လိုသော တရားမ/ရာဇဝတ် လုပ်ငန်း:</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="district_appeal">ခရိုင် တရားရုံးသို့ တရားမ အယူခံ (၃၀ ရက်)</option>
                <option value="high_court_appeal">တိုင်း/ပြည်နယ်/လွှတ်တော်ချုပ် အယူခံ (၉၀ ရက်)</option>
                <option value="civil_revision">တရားမ ပြင်ဆင်မှု လျှောက်ထားခြင်း (၉၀ ရက်)</option>
                <option value="money_suit">ကြွေးမြီ တောင်းဆိုမှု တရားစွဲဆိုခြင်း (၃ နှစ်)</option>
                <option value="contract_breach">စာချုပ် ပျက်ကွက်မှု သီးခြား ဆောင်ရွက်ပေးစေလိုမှု (၃ နှစ်)</option>
                <option value="property_possession">မရွှေ့မပြောင်းနိုင်သော ပစ္စည်း ပိုင်ဆိုင်ခွင့် (၁၂ နှစ်)</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">အမိန့်ချသည့် နေ့စွဲ သို့မဟုတ် အမှုဖြစ်ပွားသည့် နေ့စွဲ:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            {limitationResult ? (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400">နောက်ဆုံး တင်သွင်းရမည့် ရက်စွဲ (Limitation Deadline)</span>

                <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/30 space-y-2">
                  <span className="text-xs text-slate-400">နောက်ဆုံး တင်သွင်းရမည့် ရက်စွဲ:</span>
                  <div className="text-xl font-extrabold text-emerald-400">
                    {limitationResult.formattedDeadline}
                  </div>
                  <div className="text-xs text-slate-300 font-mono pt-1">
                    ({limitationResult.deadlineDate})
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                  <span className="text-amber-400 font-semibold">{limitationResult.lawSection}</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {limitationResult.description}
                  </p>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start space-x-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>
                    အမိန့် မိတ္တူ ကူးယူသည့် ရက်များအား သတ်မှတ်ကာလ အက်ဥပဒေ ပုဒ်မ ၁၂ အရ နှုတ်ပယ်ခွင့် ရှိပါသည်။
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">နေ့စွဲ ရွေးချယ်ပါ။</div>
            )}

            <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3">
              * သတ်မှတ်ကာလ အက်ဥပဒေ (Myanmar Limitation Act 1908) ပြဋ္ဌာန်းချက်များအတိုင်း တွက်ချက်ထားပါသည်။
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
