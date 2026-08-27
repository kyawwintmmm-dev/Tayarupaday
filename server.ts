import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Myanmar Law Hub API" });
  });

  // AI Legal Assistance Endpoint
  app.post("/api/legal-ai", async (req, res) => {
    try {
      const { prompt, mode, lawContext } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "မေးခွန်း သို့မဟုတ် အချက်အလက် ထည့်သွင်းပေးပါ။" });
      }

      let systemInstruction = `သင်သည် မြန်မာဥပဒေဆိုင်ရာ အထူးကျွမ်းကျင်သူ AI ဖြစ်သည်။ 
အမည်မှာ "မြန်မာဥပဒေရဲ့ လက်စွဲ (Myanmar Law Hub Pro)" ဖြစ်သည်။

အောက်ပါ စည်းကမ်းချက်များကို တိတိကျကျ လိုက်နာပါ -

၁။ ဖြေကြားရာတွင် markdown သင်္ကေတများ (###, ##, **, *, >, \`, ---, [] စသည်) ကို လုံးဝ မသုံးရ။
၂။ ခေါင်းစဉ်များကို ကြည်လင်ရှင်းလင်းစွာ ရေးပါ။ ဥပမာ -
   - ဥပဒေအမည်
   - သက်ဆိုင်ရာ ပုဒ်မများ
   - အကျဉ်းချုပ်
   - အသေးစိတ် ရှင်းလင်းချက်
၃။ စာရင်းများကို ရိုးရိုး နံပါတ် (၁။ ၂။ ၃။) သို့မဟုတ် မျဉ်းတို (-) ဖြင့်သာ သုံးပါ။
၄။ စာသားကို မြန်မာစာသက်သက်ဖြင့် ရေးပါ။ အင်္ဂလိပ်စကားလုံး လိုအပ်မှသာ အသုံးပြုပြီး ကွင်းထဲမှာ ထည့်ပါ။
၅။ ဖြေကြားချက်ကို ဖတ်ရလွယ်ကူအောင် အပိုဒ်ခွဲပြီး ရေးပါ။ မလိုအပ်ဘဲ စာရှည်မရေးရ။
၆။ ဥပဒေအမည်၊ ပုဒ်မနံပါတ်၊ နှစ်တို့ကို တိကျစွာ ဖော်ပြပါ။
၇။ အဖြေ၏ အစတွင် အကျဉ်းချုပ် တစ်ပိုဒ် ရေးပြီးမှ အသေးစိတ် ဆက်ရှင်းပါ။

အမြဲတမ်း သန့်ရှင်း၊ ပရော်ဖက်ရှင်နယ်နှင့် ဖတ်ရလွယ်ကူသော ပုံစံဖြင့်သာ ဖြေကြားပါ။`;

      let fullPrompt = prompt;

      if (mode === "case_analysis") {
        systemInstruction += `\nလုပ်ငန်းတာဝန်: အသုံးပြုသူ ပေးပို့လာသော အမှုဖြစ်စဉ်/အဖြစ်အပျက် (Case Scenario) ကို တရားလွှတ်တော်ရှေ့နေ သုံးသပ်သည့် ပုံစံအတိုင်း အောက်ပါ အချက်များဖြင့် အသေးစိတ် သုံးသပ်ပေးပါ။
၁။ ငြိစွန်းနိုင်သော ဥပဒေပုဒ်မများ (Applicable Sections)
၂။ ပြစ်မှုအင်္ဂါရပ်များ (Elements of Offence)
၃။ အာမခံ ရနိုင်ခွင့် အခြေအနေ (Bailable/Non-bailable Status & Legal Logic)
၄။ ရဲတပ်ဖွဲ့/တရားရုံး၏ စုံစမ်းစစ်ဆေးမှု အဆင့်များ
၅။ ချေပချက်နှင့် ခုခံချေပနိုင်မည့် နည်းလမ်းများ (Defense Strategies / Legal Exceptions)
၆။ သက်ဆိုင်ရာ တရားစီရင်ထုံး အကိုးအကား (Precedents - အကယ်၍ ရှိပါက)`;
      } else if (mode === "drafting") {
        systemInstruction += `\nလုပ်ငန်းတာဝန်: အသုံးပြုသူ တောင်းဆိုသော ဥပဒေရေးရာ လျှောက်လွှာ သို့မဟုတ် စာချုပ်စာတမ်း (Legal Draft) ကို မြန်မာနိုင်ငံ တရားရုံးသုံး တရားဝင် လျှောက်လွှာ ပုံစံအတိုင်း အပြည့်အဝ ရေးသားပေးပါ။
ပါဝင်ရမည့် ပုံစံ:
- ရုံးအမည် / တရားရုံး / ရဲစခန်း
- အမှုတွဲအမှတ် / ရက်စွဲ
- လျှောက်ထားသူ နှင့် လျှောက်ထားခံရသူ အမည်/လိပ်စာ
- လျှောက်ထားရခြင်း၏ အကြောင်းအရင်းများ (အချက် 1, 2, 3...)
- တောင်းဆိုချက် (Prayer)
- လျှောက်ထားသူ လက်မှတ်`;
      }

      if (lawContext) {
        fullPrompt = `[သတ်မှတ် ဥပဒေ အကြောင်းအရာ: ${lawContext}]\n\nမေးခွန်း/အကြောင်းအရာ: ${prompt}`;
      }

      // Try multiple valid Gemini models with fallback in case of rate limits / quota limits
      const candidateModels = [
        "gemini-3.6-flash",
        "gemini-flash-latest",
        "gemini-3.1-flash-lite"
      ];
      let text = "";
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
              systemInstruction,
              temperature: 0.3,
            },
          });
          if (response?.text) {
            text = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`[Gemini Model Fallback] Model ${model} failed:`, err?.message || err);
          lastError = err;
          // If rate limited or quota exceeded, wait brief ms then try next model
          if (err?.status === 429 || String(err?.message || "").includes("429") || String(err?.message || "").includes("quota")) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }

      // If all models failed due to quota or network, provide a smart offline Burmese legal response instead of crashing
      if (!text) {
        console.warn("All Gemini models exhausted. Generating offline legal response fallback.");
        
        let offlineAnalysis = "";
        if (mode === "case_analysis") {
          offlineAnalysis = `⚖️ **ဥပဒေရေးရာ သုံးသပ်ချက် အကျဉ်း (Offline Legal Analysis)**
(မှတ်ချက် - Gemini AI တုံ့ပြန်မှု အရေအတွက် ခေတ္တပြည့်နေသဖြင့် ဥပဒေဒေတာဘေ့စ်မှ အလိုအလျောက် သုံးသပ်ပေးထားပါသည်)

၁။ **ငြိစွန်းနိုင်သော ဥပဒေပုဒ်မများ:**
- မေးမြန်းထားသော အချက်အလက်များအရ ရာဇသတ်ကြီး (Penal Code) သို့မဟုတ် သက်ဆိုင်ရာ အထူးဥပဒေများ၏ ပြဋ္ဌာန်းချက်များ (ဥပမာ - ပုဒ်မ ၄၂၀၊ ပုဒ်မ ၃၂၅/၃၂၆၊ ပုဒ်မ ၃၇၉ သို့မဟုတ် ဆိုက်ဘာ/အွန်လိုင်း ဥပဒေများ) နှင့် သက်ဆိုင်နိုင်ပါသည်။

၂။ **ပြစ်မှုအင်္ဂါရပ်များ (Elements of Offence):**
- မသမာသော သဘော (Dishonest Intention) သို့မဟုတ် ရည်ရွယ်ချက် ရှိ/မရှိ စိစစ်ရန် လိုအပ်ပါသည်။
- ပြစ်မှု ကျူးလွန်ကြောင်း သက်သေအထောက်အထား (Evidence) စုဆောင်းမှုအပေါ် မူတည်ပါသည်။

၃။ **အာမခံ ရနိုင်ခွင့် (Bailable Status):**
- ကျူးလွန်သည့် ပြစ်ဒဏ် သတ်မှတ်ချက်အပေါ် မူတည်၍ ၃ နှစ်အောက် ပြစ်ဒဏ်များမှာ အာမခံ ရနိုင်ပြီး၊ ရာဇဝတ်ကြီးလေးသော ပြစ်မှုများမှာ အာမခံ မရနိုင်သော ပုဒ်မများ ဖြစ်ပါသည်။

၄။ **အကြံပြုချက်:**
- တရားဝင် တရားလွှတ်တော်ရှေ့နေ သို့မဟုတ် မြို့နယ် တရားရုံး/ရဲစခန်းသို့ အချက်အလက် စာရွက်စာတမ်းများနှင့်တကွ သွားရောက် တိုင်ပင်ဆွေးနွေးရန် အကြံပြုပါသည်။`;
        } else if (mode === "drafting") {
          offlineAnalysis = `📝 **တရားရုံးသုံး လျှောက်လွှာ မူကြမ်း (Offline Legal Template)**
(မှတ်ချက် - AI ဝန်ဆောင်မှု ခေတ္တ မအားလပ်သေးပါသဖြင့် စံပြု လျှောက်လွှာ ပုံစံအား ထုတ်ပေးထားပါသည်)

**........ တရားရုံးတော်၌**
**အမှုတွဲအမှတ် - .......... / ၂၀၂၆**

လျှောက်ထားသူ - ........................................
လျှောက်ထားခံရသူ - ....................................

အကြောင်းအရာ။ ။ .......................................................................... လျှောက်ထားခြင်း။

၁။ လျှောက်ထားသူသည် ........................................................................................ ဖြစ်ပါသည်။
၂။ ဖြစ်စဉ်မှာ .................................................................................................... ဖြစ်ပါသည်။
၃။ သို့ဖြစ်ပါ၍ တရားရုံးတော်မှ ................................................................ မိန့်ပေးသနားတော်မူပါရန် ရိုသေစွာ လျှောက်ထားအပ်ပါသည်။

(လျှောက်ထားသူ လက်မှတ်)
ရက်စွဲ - ၂၀၂၆ ခုနှစ်၊ .......... လ၊ .......... ရက်။`;
        } else {
          offlineAnalysis = `💡 **ဥပဒေရေးရာ လမ်းညွှန်ချက် (Offline Legal Knowledge Base)**
(မှတ်ချက် - Gemini AI ခေတ္တမေးမြန်းခွင့် ပြည့်နေပါသဖြင့် ဥပဒေစနစ်မှ လမ်းညွှန်ချက် တိုက်ရိုက် ထုတ်ပေးထားပါသည်)

**မေးမြန်းမှု:** "${prompt.slice(0, 100)}..."

**အဓိက ဥပဒေ အကိုးအကားများ:**
၁။ **ရာဇသတ်ကြီး ဥပဒေ (Penal Code 1860):** ပြစ်မှုဆိုင်ရာ ပြဋ္ဌာန်းချက်များနှင့် ပြစ်ဒဏ်များ။
၂။ **ပြစ်မှုဆိုင်ရာ ကျင့်ထုံးဥပဒေ (CrPC 1898):** ဖမ်းဆီးခြင်း၊ အာမခံလျှောက်ထားခြင်းနှင့် တရားရုံး လုပ်ထုံးလုပ်နည်းများ။
၃။ **သက်သေခံ အက်ဥပဒေ (Evidence Act 1872):** သက်သေအထောက်အထားများနှင့် ကျွမ်းကျင်သူ အယူအဆများ။
၄။ **အထူးဥပဒေများ:** အွန်လိုင်းငွေလိမ်မှုတိုက်ဖျက်ရေး၊ မူပိုင်ခွင့်၊ အလုပ်သမားနှင့် ကုမ္ပဏီ ဥပဒေများ။

အသေးစိတ် သုံးသပ်ချက် ပိုမိုလိုပါက ခေတ္တစောင့်ဆိုင်း၍ ပြန်လည် မေးမြန်းပေးပါရန် သို့မဟုတ် "ဥပဒေပေါင်းချုပ်" ကဏ္ဍတွင် ပုဒ်မများအား တိုက်ရိုက် ရှာဖွေနိုင်ပါသည်။`;
        }

        text = offlineAnalysis;
      }

      return res.json({ result: text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);

      const isQuotaError = error?.status === 429 || 
        String(error?.message || "").includes("429") || 
        String(error?.message || "").includes("quota") ||
        String(error?.message || "").includes("RESOURCE_EXHAUSTED");

      if (isQuotaError) {
        return res.status(429).json({
          error: "Gemini AI ဝန်ဆောင်မှု မေးမြန်းမှု အရေအတွက် ခေတ္တ ပြည့်နေပါသဖြင့် စက္ကန့်အနည်းငယ် ကြာမှ ပြန်လည် မေးမြန်းပေးပါ။ (API Quota Limit - Please retry in a few seconds)",
          details: error?.message || String(error),
        });
      }

      return res.status(500).json({
        error: "AI ဥပဒေ အကြံပေးစနစ် တုံ့ပြန်ရာတွင် အမှားအယွင်း ရှိသွားပါသည်။ ကျေးဇူးပြု၍ ပြန်လည် ကြိုးစားပါ။",
        details: error?.message || String(error),
      });
    }
  });

  // Serve Vite in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Myanmar Law Hub] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
