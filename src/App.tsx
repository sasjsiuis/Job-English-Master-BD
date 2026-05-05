/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from "react";
import { 
  Briefcase, 
  Search, 
  ChevronRight, 
  Mic2, 
  Sparkles, 
  Menu, 
  User,
  Cpu,
  BadgeDollarSign,
  Users,
  MessageSquare,
  Mail,
  Presentation,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  PhoneCall,
  PhoneOff,
  Mic,
  Volume2,
  Award,
  PenTool,
  RotateCcw,
  Star,
  Headphones,
  Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TOPICS, TOPIC_CATEGORIES, type Topic, type Sentence } from "./data";
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function App() {
  const [selectedTopicId, setSelectedTopicId] = useState(TOPICS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customSentences, setCustomSentences] = useState<Record<string, Sentence[]>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Sentence[]>(() => {
    const saved = localStorage.getItem("job-english-bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  // Assistant State
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I am your career assistant. How can I help you practice your English today?" }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const assistantScrollRef = useRef<HTMLDivElement>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  // Exam State
  const [examActive, setExamActive] = useState(false);
  const [examStep, setExamStep] = useState(0);
  const [examScore, setExamScore] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [examTranscript, setExamTranscript] = useState("");
  const [isExamListening, setIsExamListening] = useState(false);
  const [examEvaluation, setExamEvaluation] = useState<string | null>(null);

  const selectedTopic = useMemo(() => {
    if (selectedTopicId === "bookmarks") {
      return {
        id: "bookmarks",
        title: "বুকমার্ক করা বাক্যগুলো (Saved Sentences)",
        category: "আমার প্রোফাইল (My Profile)",
        icon: "Bookmark",
        initialSentences: []
      } as Topic;
    }
    if (selectedTopicId === "assistant") {
      return {
        id: "assistant",
        title: "ভয়েস কল অ্যাসিস্ট্যান্ট (Voice Assistant)",
        category: "প্র্যাকটিস (Practice)",
        icon: "PhoneCall",
        initialSentences: []
      } as Topic;
    }
    return TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0];
  }, [selectedTopicId]);

  useEffect(() => {
    if (assistantScrollRef.current) {
      assistantScrollRef.current.scrollTop = assistantScrollRef.current.scrollHeight;
    }
  }, [assistantMessages]);

  useEffect(() => {
    if (examActive && !examFinished && !isExamListening && !examEvaluation && !isGenerating) {
      const currentQ = selectedTopic.initialSentences[examStep];
      speak(`Question ${examStep + 1}. ${currentQ.bn}. How do you say this in English?`, () => {
        setTimeout(startExamListening, 400);
      });
    }
  }, [examStep, examActive, examFinished, isGenerating]);

  // When call starts, speak greeting
  const startAssistantCall = () => {
    setIsCallActive(true);
    const greeting = assistantMessages[0].text;
    speak(greeting, () => {
      setTimeout(startAssistantListening, 500);
    });
  };

  const endAssistantCall = () => {
    setIsCallActive(false);
    window.speechSynthesis.cancel();
    setIsListening(false);
  };

  const toggleBookmark = (sentence: Sentence) => {
    setBookmarks(prev => {
      const isBookmarked = prev.some(s => s.en === sentence.en);
      const next = isBookmarked 
        ? prev.filter(s => s.en !== sentence.en)
        : [...prev, sentence];
      localStorage.setItem("job-english-bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Voice Functions
  const speak = (text: string, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    window.speechSynthesis.speak(utterance);
  };

  const startAssistantListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAssistantInput(transcript);
      handleAssistantSubmit(transcript);
    };
    recognition.start();
  };

  const startExamListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsExamListening(true);
    recognition.onend = () => setIsExamListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setExamTranscript(transcript);
      evaluateExamAnswer(transcript);
    };
    recognition.start();
  };

  const evaluateExamAnswer = async (userVoiceInput: string) => {
    setIsGenerating(true);
    setExamEvaluation("Checking...");
    try {
      const currentQ = selectedTopic.initialSentences[examStep];
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Evaluate the spoken answer for a Bengali to English translation task.
      Bengali Sentence: "${currentQ.bn}"
      Expected English: "${currentQ.en}"
      User Spoke: "${userVoiceInput}"
      
      Return JSON: {"correct": true/false, "feedback": "Short encouraging feedback in English"}
      Only return correct=true if the meaning matches even if wording is slightly different.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const data = JSON.parse(result.text || "{}");
      
      if (data.correct) setExamScore(prev => prev + 1);
      setExamEvaluation(data.feedback);
      speak(data.feedback, () => {
        setTimeout(() => {
          setExamEvaluation(null);
          setExamTranscript("");
          if (examStep + 1 < selectedTopic.initialSentences.length) {
            setExamStep(prev => prev + 1);
          } else {
            setExamFinished(true);
            speak(`Great job! You scored ${examScore + (data.correct ? 1 : 0)} out of ${selectedTopic.initialSentences.length}. You have successfully completed your mock interview.`);
          }
        }, 500);
      });

    } catch (error) {
      console.error(error);
      setExamEvaluation("Error checking. Moving next.");
      setTimeout(() => {
        setExamEvaluation(null);
        setExamStep(prev => prev + 1);
      }, 2000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAssistantSubmit = async (inputStr: string) => {
    const input = inputStr || assistantInput;
    if (!input.trim()) return;

    setAssistantMessages(prev => [...prev, { role: "user", text: input }]);
    setAssistantInput("");
    setIsGenerating(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      
      const history = assistantMessages.map(m => ({
        role: m.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: m.text }]
      }));

      const prompt = `You are a professional career coach and English interviewer. Be encouraging, helpful, and concise. Respond in English. If I make mistakes, gently correct me. Give me short conversational replies. Input: ${input}`;
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...history.flatMap(h => [h]), { role: "user", parts: [{ text: prompt }] }]
      });
      const text = result.text || "";
      
      setAssistantMessages(prev => [...prev, { role: "assistant", text }]);
      speak(text, () => {
        if (isCallActive) {
          setTimeout(startAssistantListening, 500);
        }
      });
    } catch (error) {
      console.error("Assistant error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startExam = () => {
    setExamActive(true);
    setExamStep(0);
    setExamScore(0);
    setExamFinished(false);
    setExamTranscript("");
    setExamEvaluation(null);
  };

  const filteredTopics = useMemo(() => {
    return TOPICS.filter(topic => 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const displaySentences = useMemo(() => {
    if (selectedTopicId === "bookmarks" || selectedTopicId === "assistant") return bookmarks;
    const initial = selectedTopic.initialSentences;
    const generated = customSentences[selectedTopicId] || [];
    return [...initial, ...generated];
  }, [selectedTopic, selectedTopicId, customSentences, bookmarks]);

  const generateMore = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      alert("API Key not found. Please add GEMINI_API_KEY to your environment.");
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Generate 10 professional English sentences for the topic "${selectedTopic.title}" suitable for job interviews or workplace. 
      For each sentence, provide:
      1. English sentence
      2. Bengali meaning
      3. Bengali transliteration (how to pronounce the English sentence in Bengali script, e.g., "I have a plan" = "আই হ্যাভ এ প্ল্যান")
      Format your response as a JSON array of objects: [{"en": "...", "bn": "...", "pronunciation": "..."}]`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const text = result.text || "";
      
      const jsonStr = text.match(/\[.*\]/s)?.[0] || text;
      const newSentences = JSON.parse(jsonStr) as Sentence[];
      
      setCustomSentences(prev => ({
        ...prev,
        [selectedTopicId]: [...(prev[selectedTopicId] || []), ...newSentences]
      }));
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "User": return <User className="w-5 h-5" />;
      case "Cpu": return <Cpu className="w-5 h-5" />;
      case "BadgeDollarSign": return <BadgeDollarSign className="w-5 h-5" />;
      case "Users": return <Users className="w-5 h-5" />;
      case "Mail": return <Mail className="w-5 h-5" />;
      case "Presentation": return <Presentation className="w-5 h-5" />;
      case "Clock": return <Clock className="w-5 h-5" />;
      case "PhoneCall": return <PhoneCall className="w-5 h-5" />;
      case "Headphones": return <Headphones className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">Job English</h1>
              <p className="text-xs text-slate-500 font-medium">Career Master BD</p>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="টপিক খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
            <div key="practice-tools">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                প্র্যাকটিস টুলস (Practice)
              </h2>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedTopicId("assistant"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                    selectedTopicId === "assistant" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <PhoneCall className="w-5 h-5" />
                  <span className="flex-1 text-left">ভয়েস কল অ্যাসিস্ট্যান্ট</span>
                </button>
                <button
                  onClick={() => { setSelectedTopicId("bookmarks"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                    selectedTopicId === "bookmarks" ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  <span className="flex-1 text-left">বুকমার্ক ({bookmarks.length})</span>
                </button>
              </div>
            </div>

            {TOPIC_CATEGORIES.map(category => (
              <div key={category}>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                  {category}
                </h2>
                <div className="space-y-1">
                  {filteredTopics
                    .filter(t => t.category === category)
                    .map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => { setSelectedTopicId(topic.id); setIsSidebarOpen(false); setExamActive(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                          selectedTopicId === topic.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="shrink-0">{getIcon(topic.icon)}</span>
                        <span className="flex-1 text-left truncate">{topic.title}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 lg:hidden text-slate-600 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 ml-4 lg:ml-0 overflow-hidden text-left">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-0.5">
              <span>{selectedTopic.category}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
            <h2 className="font-bold text-lg lg:text-xl truncate text-slate-900">{selectedTopic.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            {selectedTopic.category.includes("Mock Exam") && !examActive && (
              <button onClick={startExam} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
                <PenTool className="w-4 h-4" />
                পরিক্ষা দিন
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-600 text-xs font-semibold border border-indigo-100">
              <Star className="w-3.5 h-3.5" />
              <span>{displaySentences.length || "Live"} Active</span>
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {selectedTopicId === "assistant" ? (
              /* New Integrated Phone Call Assistant View */
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-white">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-black/60 pointer-events-none" />
                
                {!isCallActive ? (
                  <div className="relative z-10 flex flex-col items-center space-y-8 animate-in fade-in duration-700">
                    <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                      <PhoneCall className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-3xl font-black mb-2">AI Career Assistant</h3>
                      <p className="text-slate-400 font-medium max-w-sm">
                        সরাসরি এআই কোচের সাথে কথা বলে ইংলিশ প্র্যাকটিস করুন। মাইক্রোফোন ব্যবহারের অনুমতি দিন।
                      </p>
                    </div>
                    <button 
                      onClick={startAssistantCall} 
                      className="group flex items-center gap-3 bg-green-500 text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-green-600 transition-all shadow-xl shadow-green-900/20 hover:-translate-y-1"
                    >
                      <PhoneCall className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      কল শুরু করুন
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10 w-full max-w-md flex flex-col items-center space-y-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ repeat: Infinity, duration: 2 }} 
                          className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl" 
                        />
                        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center relative border border-white/10">
                          <User className="w-12 h-12 text-indigo-400" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="text-xl font-bold tracking-tight">AI Assistant</h4>
                        <p className="text-xs font-bold text-green-400 uppercase tracking-widest mt-1">In Call...</p>
                      </div>
                    </div>

                    <div className="w-full text-center min-h-[120px] flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {isGenerating ? (
                          <motion.div 
                            key="generating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                          >
                            <div className="flex gap-1 justify-center">
                              {[0, 1, 2].map(i => (
                                <motion.div 
                                  key={i} 
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                  className="w-2 h-2 bg-indigo-400 rounded-full" 
                                />
                              ))}
                            </div>
                            <p className="text-sm text-slate-400 italic">Thinking...</p>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key={isListening ? "listening" : "idle"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            {isListening ? (
                              <div className="space-y-4">
                                <div className="flex items-center gap-1 justify-center h-8">
                                  {[...Array(6)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      animate={{ height: [4, 24, 4] }}
                                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                      className="w-1 bg-green-500 rounded-full"
                                    />
                                  ))}
                                </div>
                                <p className="text-lg font-medium text-slate-300">Listening to you...</p>
                              </div>
                            ) : (
                              <p className="text-xl font-medium text-indigo-200">
                                {assistantMessages[assistantMessages.length - 1].text}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex gap-8 items-center bg-white/5 py-8 px-10 rounded-[40px] backdrop-blur-md border border-white/10">
                      <button className="p-5 bg-white/10 rounded-full text-slate-400 hover:text-white transition-all">
                        <Volume2 className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={endAssistantCall}
                        className="p-8 bg-rose-500 rounded-full text-white shadow-2xl shadow-rose-900/40 hover:bg-rose-600 transition-all active:scale-95"
                      >
                        <PhoneOff className="w-10 h-10" />
                      </button>
                      <button 
                        onClick={startAssistantListening}
                        disabled={isListening}
                        className={`p-5 rounded-full transition-all ${
                          isListening ? "bg-green-500 text-white" : "bg-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : examActive ? (
              /* Voice Call Exam Mode View */
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-white">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black/40 pointer-events-none" />
                
                {!examFinished ? (
                  <div className="relative z-10 w-full flex flex-col items-center space-y-12">
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-widest animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        AI Voice Interviewer
                      </div>
                      <h3 className="text-sm font-medium text-slate-400">Question {examStep + 1} of {selectedTopic.initialSentences.length}</h3>
                    </div>

                    <div className="w-full max-w-md text-center space-y-6">
                      <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                        <p className="text-2xl font-bold leading-tight">{selectedTopic.initialSentences[examStep].bn}</p>
                        <p className="mt-4 text-indigo-400 text-sm font-medium">Please say the English translation</p>
                      </div>

                      <div className="h-24 flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                          {examEvaluation ? (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-lg ${
                                examEvaluation.toLowerCase().includes("good") || examEvaluation.toLowerCase().includes("correct")
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {examEvaluation}
                            </motion.div>
                          ) : examTranscript ? (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-lg font-medium text-indigo-200 line-clamp-2"
                            >
                              "{examTranscript}"
                            </motion.p>
                          ) : (
                            isExamListening && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-1 items-center"
                              >
                                {[0, 1, 2, 3].map(i => (
                                  <motion.div
                                    key={i}
                                    animate={{ height: [8, 24, 8] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                    className="w-1.5 bg-indigo-500 rounded-full"
                                  />
                                ))}
                              </motion.div>
                            )
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex gap-8 items-center">
                      <button 
                        onClick={() => setExamActive(false)}
                        className="p-5 bg-rose-500 rounded-full text-white shadow-xl shadow-rose-900/20 hover:bg-rose-600 transition-all active:scale-95"
                      >
                        <PhoneOff className="w-6 h-6" />
                      </button>
                      
                      <button 
                        onClick={startExamListening}
                        disabled={isExamListening || !!examEvaluation}
                        className={`p-8 rounded-full transition-all relative ${
                          isExamListening 
                            ? "bg-indigo-500 text-white shadow-indigo-500/30" 
                            : "bg-white text-indigo-600 hover:bg-indigo-50 shadow-white/10"
                        }`}
                      >
                        {isExamListening && <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20" />}
                        <Mic className="w-8 h-8 relative z-10" />
                      </button>

                      <button 
                        onClick={() => speak(selectedTopic.initialSentences[examStep].bn)}
                        className="p-5 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
                      >
                        <Volume2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="inline-flex p-8 bg-indigo-500/20 rounded-full text-indigo-400 ring-8 ring-indigo-500/10 mb-4">
                      <Trophy className="w-20 h-20" />
                    </div>
                    <div>
                      <h2 className="text-5xl font-black mb-2">পরীক্ষা শেষ!</h2>
                      <p className="text-slate-400 font-medium">আপনার মৌখিক দক্ষতা আজ চমৎকার ছিল।</p>
                    </div>
                    <div className="max-w-[200px] mx-auto bg-white/5 p-6 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">FINAL SCORE</p>
                      <div className="text-6xl font-black text-white">{Math.round((examScore / selectedTopic.initialSentences.length) * 100)}%</div>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <button onClick={startExam} className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/20">
                        <RotateCcw className="w-6 h-6" />
                        আবার দিন
                      </button>
                      <button onClick={() => setExamActive(false)} className="px-10 py-5 bg-white/10 text-white rounded-3xl font-black hover:bg-white/20 transition-all border border-white/10">
                        ফিরে যান
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Standard Sentence List View */
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {displaySentences.map((s, idx) => (
                    <motion.div
                      key={`${selectedTopicId}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-indigo-100"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xl font-bold tracking-tight text-slate-900">{s.en}</p>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => toggleBookmark(s)}
                                  className={`p-1.5 rounded-lg ${bookmarks.some(b => b.en === s.en) ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-indigo-600 shadow-sm"}`}
                                >
                                  {bookmarks.some(b => b.en === s.en) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                </button>
                                <button onClick={() => copyToClipboard(s.en, `${selectedTopicId}-${idx}`)} className="p-1.5 text-slate-400 hover:text-indigo-600">
                                  {copiedId === `${selectedTopicId}-${idx}` ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button onClick={() => speak(s.en)} className="p-1.5 text-slate-400 hover:text-indigo-600">
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-indigo-600 font-medium text-lg leading-relaxed">{s.bn}</p>
                          </div>
                          <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                            <div className="px-3 py-1 bg-amber-50 rounded-lg flex items-center gap-2 border border-amber-100">
                              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">উচ্চারণ</span>
                              <p className="text-sm font-medium text-slate-750">{s.pronunciation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {selectedTopicId !== "bookmarks" && (
                  <div className="pt-8 pb-12 flex flex-col items-center gap-4">
                    <button onClick={generateMore} disabled={isGenerating} className={`flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50`}>
                      {isGenerating ? "জেনারেট হচ্ছে..." : <><Sparkles className="w-5 h-5 text-indigo-200" /> আরও ১০টি বাক্য জেনারেট করুন</>}
                    </button>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Gemini AI ব্যবহার করে নতুন বাক্য জেনারেট করা হবে
                    </p>
                  </div>
                )}
                {selectedTopicId === "bookmarks" && bookmarks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                    <Bookmark className="w-16 h-16 opacity-10" />
                    <p className="font-medium">আপনার কোনো বুকমার্ক করা বাক্য নেই।</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
