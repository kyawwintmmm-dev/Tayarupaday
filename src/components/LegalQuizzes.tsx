import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizCategoryInfo } from '../types';
import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from '../data/quizData';
import { 
  HelpCircle, Scale, FileText, ShieldAlert, Bot, BookOpen, 
  CheckCircle2, XCircle, Award, Timer, RefreshCw, ChevronRight, 
  Sparkles, RotateCcw, AlertTriangle, ArrowRight, BookmarkCheck, Brain
} from 'lucide-react';

interface LegalQuizzesProps {
  onNavigateTab?: (tab: string) => void;
}

export const LegalQuizzes: React.FC<LegalQuizzesProps> = ({ onNavigateTab }) => {
  // Active Category & Mode Selection
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quizMode, setQuizMode] = useState<'practice' | 'exam'>('practice');

  // Quiz State
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // User Answers state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Score & Timer state
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 minutes for exam
  const [examTimeSpent, setExamTimeSpent] = useState<number>(0);

  // Filter questions whenever category changes or restart quiz
  const prepareQuestions = (catId: string) => {
    let list = QUIZ_QUESTIONS;
    if (catId !== 'all') {
      list = QUIZ_QUESTIONS.filter((q) => q.category === catId);
    }
    // Shuffle array for fresh experience
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsAnswered(false);
    setScore(0);
    setIsQuizCompleted(false);
    setTimeRemaining(300);
    setExamTimeSpent(0);
  };

  const handleStartQuiz = (catId: string) => {
    setSelectedCategory(catId);
    prepareQuestions(catId);
    setQuizStarted(true);
  };

  // Timer effect for Exam mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && quizMode === 'exam' && !isQuizCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsQuizCompleted(true);
            return 0;
          }
          return prev - 1;
        });
        setExamTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizStarted, quizMode, isQuizCompleted, timeRemaining]);

  const currentQ = currentQuestions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return; // Prevent changing answer in practice mode once chosen
    
    const updated = { ...selectedAnswers, [currentQ.id]: optionId };
    setSelectedAnswers(updated);
    setIsAnswered(true);

    if (optionId === currentQ.correctOptionId) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(!!selectedAnswers[currentQuestions[currentIndex + 1]?.id]);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    prepareQuestions(selectedCategory);
    setQuizStarted(true);
  };

  // Icon selector helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-5 h-5 text-amber-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-emerald-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'HelpCircle':
      default:
        return <Brain className="w-5 h-5 text-amber-300" />;
    }
  };

  // Format time format (e.g. 04:30)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  // Rank Badge based on percentage
  const getRankBadge = (pct: number) => {
    if (pct >= 90) return { title: '🏆 ဥပဒေ ပါရဂူ (Law Master)', desc: 'ဥပဒေ ပုဒ်မများနှင့် စီရင်ထုံးများအား အထူးကျွမ်းကျင်ပိုင်နိုင်သူ', color: 'from-amber-500 to-amber-300 text-slate-950' };
    if (pct >= 75) return { title: '🎓 ဥပဒေ ပညာရှင် (Legal Expert)', desc: 'ရာဇသတ်ကြီးနှင့် ကျင့်ထုံးဥပဒေများအား ထက်မြက်စွာ နားလည်သူ', color: 'from-blue-600 to-indigo-500 text-white' };
    if (pct >= 50) return { title: '⚖️ ဥပဒေ သင်တန်းသား (Legal Scholar)', desc: 'ဥပဒေ အခြေခံသဘောတရားများအား ကောင်းစွာ သိရှိသူ', color: 'from-emerald-600 to-teal-500 text-white' };
    return { title: '📖 ဥပဒေ လေ့လာသူ (Legal Learner)', desc: 'ဥပဒေ ပုဒ်မများကို ဆက်လက် လေ့လာ ဆန်းစစ်ရန် လိုအပ်ပါသည်', color: 'from-slate-700 to-slate-800 text-slate-200' };
  };

  return (
    <div className="space-y-6 font-myanmar max-w-5xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>ဥပဒေ ဗဟုသုတ ဉာဏ်စမ်းစနစ်</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Legal Quiz Pro
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  ရာဇသတ်ကြီး၊ ကျင့်ထုံးဥပဒေ၊ လူကုန်ကူးမှု၊ ဆိုက်ဘာနှင့် စီရင်ထုံးများအား တိကျစွာ လေ့ကျင့် ဖြေဆိုနိုင်ပါသည်။
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-700/80 shrink-0">
            <button
              onClick={() => {
                setQuizMode('practice');
                if (quizStarted) prepareQuestions(selectedCategory);
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                quizMode === 'practice'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🎓 လေ့ကျင့်ခန်း မုဒ်</span>
            </button>
            <button
              onClick={() => {
                setQuizMode('exam');
                if (quizStarted) prepareQuestions(selectedCategory);
              }}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                quizMode === 'exam'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>⏱️ စာမေးပွဲ မုဒ် (၅ မိနစ်)</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Quiz Home / Category Selector (When Quiz Not Started) */}
      {!quizStarted && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-200 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>ဉာဏ်စမ်း ကဏ္ဍများ ရွေးချယ်ပါ</span>
            </h2>
            <span className="text-xs text-slate-400">
              စုစုပေါင်း မေးခွန်း {QUIZ_QUESTIONS.length} မေးခွန်း ပါဝင်ပါသည်
            </span>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUIZ_CATEGORIES.map((cat) => {
              const catQuestions = cat.id === 'all' 
                ? QUIZ_QUESTIONS 
                : QUIZ_QUESTIONS.filter((q) => q.category === cat.id);

              return (
                <div
                  key={cat.id}
                  onClick={() => handleStartQuiz(cat.id)}
                  className="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all cursor-pointer shadow-md hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-amber-500/20 border border-slate-700/60 group-hover:border-amber-500/40 flex items-center justify-center transition">
                        {getCategoryIcon(cat.iconName)}
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {catQuestions.length} မေးခွန်း
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                    <span>စတင် ဖြေဆိုရန်</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Active Quiz Question View */}
      {quizStarted && !isQuizCompleted && currentQ && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setQuizStarted(false)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition"
              >
                ← မူလစာမျက်နှာ
              </button>
              <div className="text-xs text-slate-300 font-semibold">
                မေးခွန်း <span className="text-amber-400 text-sm font-bold">{currentIndex + 1}</span> / {currentQuestions.length}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-sans">
                {currentQ.categoryLabel}
              </span>
            </div>

            {/* Timer if Exam mode */}
            {quizMode === 'exam' && (
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-400 font-sans font-bold text-sm">
                <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>ကျန်ရှိချိန်: {formatTime(timeRemaining)}</span>
              </div>
            )}

            {/* Current Score in Practice Mode */}
            {quizMode === 'practice' && (
              <div className="text-xs text-slate-400">
                ရရှိမှတ် - <span className="text-emerald-400 font-bold text-sm">{score}</span> / {currentIndex + (isAnswered ? 1 : 0)}
              </div>
            )}
          </div>

          {/* Question Box Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>ခက်ခဲမှုအဆင့် - {currentQ.difficulty === 'easy' ? 'လွယ်ကူ' : currentQ.difficulty === 'medium' ? 'အလတ်အလတ်' : 'ခက်ခဲ'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                const isCorrect = opt.id === currentQ.correctOptionId;

                let optionStyle = "bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-amber-500/40";
                
                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold shadow-md shadow-emerald-500/10";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "bg-red-950/80 border-red-500 text-red-200 font-semibold";
                  } else {
                    optionStyle = "bg-slate-950/60 border-slate-800 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isAnswered && quizMode === 'practice'}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between text-sm ${optionStyle}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                        isAnswered && isCorrect 
                          ? 'bg-emerald-500 text-slate-950' 
                          : isAnswered && isSelected && !isCorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-900 border border-slate-700 text-slate-400'
                      }`}>
                        {opt.id}
                      </span>
                      <span>{opt.text}</span>
                    </div>

                    {isAnswered && (
                      <div className="shrink-0 ml-2">
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback & Explanation Box (Practice Mode) */}
            {isAnswered && (
              <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-5 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    {selectedAnswers[currentQ.id] === currentQ.correctOptionId ? (
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>မှန်ကန်ပါသည်။ (Correct Answer)</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                        <XCircle className="w-5 h-5" />
                        <span>မမှန်ကန်ပါ။ (Incorrect Answer)</span>
                      </div>
                    )}
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    📜 {currentQ.legalReference}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-1">
                  <span className="font-semibold text-amber-300">ရှင်းလင်းချက်နှင့် ဥပဒေအဓိပ္ပာယ်ဖွင့်ဆိုချက်-</span>
                  <p className="text-slate-300">{currentQ.explanation}</p>
                </div>
              </div>
            )}

            {/* Navigation Button */}
            <div className="flex justify-end pt-4">
              <button
                disabled={!isAnswered}
                onClick={handleNextQuestion}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg ${
                  isAnswered
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>{currentIndex < currentQuestions.length - 1 ? 'နောက်မေးခွန်းသို့' : 'ရလဒ် ကြည့်ရှုမည်'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Quiz Completion / Result Report Card */}
      {isQuizCompleted && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 text-center shadow-2xl relative overflow-hidden">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <Award className="w-10 h-10" />
              </div>

              {(() => {
                const percentage = Math.round((score / currentQuestions.length) * 100);
                const rank = getRankBadge(percentage);

                return (
                  <div className="space-y-2">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${rank.color} shadow-md`}>
                      {rank.title}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      ဉာဏ်စမ်း ဖြေဆိုမှု ပြီးစီးပါပြီ
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                      {rank.desc}
                    </p>

                    {/* Stats Box */}
                    <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4">
                      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                        <div className="text-2xl font-extrabold text-amber-400">{percentage}%</div>
                        <div className="text-[11px] text-slate-400">ရမှတ် ရာခိုင်နှုန်း</div>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                        <div className="text-2xl font-extrabold text-emerald-400">{score} / {currentQuestions.length}</div>
                        <div className="text-[11px] text-slate-400">မှန်ကန်သော မေးခွန်း</div>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                        <div className="text-2xl font-extrabold text-slate-200">
                          {quizMode === 'exam' ? `${examTimeSpent} စက္ကန့်` : 'လေ့ကျင့်ခန်း'}
                        </div>
                        <div className="text-[11px] text-slate-400">ကြာမြင့်ချိန်</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ပြန်လည် ဖြေဆိုမည် (Retake)</span>
              </button>

              <button
                onClick={() => setQuizStarted(false)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>အခြားကဏ္ဍ ရွေးချယ်မည်</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span>မေးခွန်း အဖြေများ ပြန်လည် ဆန်းစစ်ခြင်း (Question Review)</span>
            </h3>

            <div className="space-y-3">
              {currentQuestions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isUserCorrect = userAns === q.correctOptionId;

                return (
                  <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs text-amber-400 font-semibold">မေးခွန်း {idx + 1}</span>
                        <h4 className="text-sm font-bold text-white">{q.question}</h4>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                        isUserCorrect 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {isUserCorrect ? '✓ မှန်ကန်' : '✗ မှားယွင်း'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                      <div className="flex items-center space-x-2">
                        <span className="text-amber-400 font-semibold">မှန်ကန်သောအဖြေ:</span>
                        <span className="text-emerald-300 font-bold">
                          {q.options.find((o) => o.id === q.correctOptionId)?.text}
                        </span>
                      </div>
                      <div className="text-slate-400 pt-1">
                        <span className="text-amber-300 font-medium">📜 {q.legalReference}:</span> {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
