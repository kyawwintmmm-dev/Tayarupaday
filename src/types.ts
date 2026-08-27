export type LawCategoryType = 
  | 'penal_code'      // ရာဇသတ်ကြီး (1860) - Free
  | 'crpc'            // ပြစ်မှုဆိုင်ရာ ကျင့်ထုံးဥပဒေ (1898) - Free
  | 'constitution'    // ဖွဲ့စည်းပုံအခြေခံဥပဒေ (၂၀၀၈) - Free
  | 'contract_law'    // စာချုပ်စာတမ်းနှင့် ပဋိညာဉ်ဆိုင်ရာ ဥပဒေများ
  | 'corporate_business' // စီးပွားရေးနှင့် ရင်းနှီးမြှုပ်နှံမှု ဥပဒေများ
  | 'labor_law'          // အလုပ်သမားနှင့် အလုပ်ရှင် ဥပဒေများ
  | 'ip_law'             // ဉာဏဗဟုသုတ (IP) ဥပဒေများ
  | 'cyber_digital'      // ဆိုက်ဘာနှင့် နည်းပညာ ဥပဒေများ
  | 'special_laws';   // အထူးဥပဒေများ

export interface Precedent {
  id: string;
  year: string;            // e.g. ၁၉၉၅, ၂၀၁၈, ၂၀၂၄
  citation: string;        // e.g. ၁၉၉၅ မတစ ၄၅
  title?: string;          // e.g. မယားငယ်ထားရှိမှုနှင့် အသရေဖျက်မှု အယူခံ
  summary: string;         // ဥပဒေအဓိပ္ပာယ် ဖွင့်ဆိုချက်
  lawSectionRef?: string;  // e.g. ရာဇသတ်ကြီး ပုဒ်မ ၄၉၉
  category?: string;       // e.g. ရာဇဝတ် / တရားမ / ဖွဲ့စည်းပုံ
  fullText?: string;       // အကျဉ်း သို့မဟုတ် အပြည့်အစုံ
}

export interface LawDirective {
  id: string;
  title: string;
  issuedBy: string;        // e.g. ပြည်ထောင်စု တရားလွှတ်တော်ချုပ် / ပြည်ထောင်စု ရှေ့နေချုပ်ရုံး
  date: string;            // e.g. ၁၅-၈-၂၀၂၄
  directiveNo: string;     // e.g. ညွှန်ကြားလွှာ အမှတ် (၄/၂၀၂၄)
  summary: string;
  category: string;
  fullText: string;
}

export interface AmendingAct {
  id: string;
  mainLawTitle: string;
  amendingActTitle: string; // e.g. ရာဇသတ်ကြီးကို ပြင်ဆင်သည့် ဥပဒေ (၂၀၂၁)
  enactedYear: string;
  summary: string;
  keyChanges: string[];
}

export interface LawSection {
  id: string;
  lawId: string;
  lawName: string;         // e.g. ရာဇသတ်ကြီး
  sectionNo: string;       // e.g. ပုဒ်မ ၃၀၂
  title: string;           // e.g. လူသတ်မှု
  chapter: string;         // e.g. အခန်း (၁၆) - လူ့အသက်ကို ထိခိုက်စေသော ပြစ်မှုများ
  lawCategory: LawCategoryType;
  isFree: boolean;
  content: string;         // Full statutory text
  explanation?: string;    // ရှင်းလင်းချက် / ဥပမာ
  punishment?: string;     // ပြစ်ဒဏ်
  cognizable?: string;
  bailable?: string;
  compoundable?: string;
  courtType?: string;      // စီရင်ပိုင်ခွင့်ရှိ တရားရုံး
  precedents?: Precedent[];
  tags?: string[];
}

export interface LawBookInfo {
  id: string;
  category: LawCategoryType;
  title: string;
  enTitle: string;
  enactedYear: string;
  description: string;
  isFree: boolean;
  sectionCount: number;
  iconName: string;
}

export interface LegalDraftTemplate {
  id: string;
  title: string;
  category: 'bail' | 'police_report' | 'notice' | 'contract' | 'power_of_attorney' | 'petition' | 'civil_contract';
  categoryLabel: string;
  description: string;
  templateText: string;
  fields: { key: string; label: string; placeholder: string; defaultValue?: string }[];
}

export interface LegalDictionaryTerm {
  id: string;
  englishTerm: string;
  myanmarTerm: string;
  paliTerm?: string;
  definition: string;
  category: 'Criminal' | 'Civil' | 'Constitutional' | 'Commercial' | 'General';
  exampleUsage?: string;
}

export interface LegalAidOrganization {
  id: string;
  name: string;
  type: 'Government' | 'Bar Association' | 'NGO' | 'Pro Bono Group';
  services: string[];
  address: string;
  phone: string;
  email?: string;
  region: string;
  description: string;
}

export interface LegalFAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Police & FIR' | 'Bail & Custody' | 'Court Procedure' | 'Rights on Arrest' | 'Witness Guidance';
  legalReferences?: string[];
}

export interface SavedBookmark {
  id: string;
  sectionId: string;
  createdAt: string;
  userNote?: string;
}

export interface AIResponse {
  result: string;
  error?: string;
}

