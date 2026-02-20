import { useState, useEffect } from 'react';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '../services/api';
import {
    getAdvancedInterviewQuestion,
    finishAdvancedInterview,
    saveProgressSnapshot
} from '../services/careerPlatform';
import {
    Mic2,
    MessageSquare,
    Monitor,
    BarChart3,
    Users,
    Send,
    StopCircle,
    CheckCircle2,
    Target,
    Zap,
    ArrowRight,
    BrainCircuit,
    Award,
    Loader2,
    Sparkles,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumBackground } from '../components/PremiumBackground';

type InterviewStep = 'setup' | 'active' | 'results';
type InterviewMode = 'text' | 'voice';

interface Evaluation {
    technical_score: string;
    soft_skills_score: string;
    verdict: string;
    strengths: string[];
    weaknesses: string[];
    feedback: string;
    technical_accuracy?: string;
    communication_clarity?: string;
    confidence_level?: string;
}

export default function Interview() {
    const [step, setStep] = useState<InterviewStep>('setup');
    const [mode, setMode] = useState<InterviewMode>('text');
    const [position, setPosition] = useState('Software Engineer');
    const [currentRound, setCurrentRound] = useState<'technical' | 'managerial' | 'hr'>('technical');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [userResponse, setUserResponse] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [allResponses, setAllResponses] = useState<Record<string, any[]>>({
        technical: [],
        managerial: [],
        hr: []
    });
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

    // ── NEW: Advanced interview state ──────────
    const [useAdvanced, setUseAdvanced] = useState(true);

    const rounds = [
        { id: 'technical', label: 'Technical Round', icon: Monitor, qs: 3 },
        { id: 'managerial', label: 'Managerial Round', icon: BarChart3, qs: 2 },
        { id: 'hr', label: 'Hr Round', icon: Users, qs: 2 }
    ];

    const currentRoundData = rounds.find(r => r.id === currentRound)!;

    const fetchNextQuestion = async (roundType: string, currentHistory: any[]) => {
        setIsLoading(true);
        try {
            if (useAdvanced) {
                // ── Advanced: resume-aware question generation ──
                const res = await getAdvancedInterviewQuestion(
                    position,
                    roundType,
                    currentHistory,
                    undefined, // resume summary can be passed if available
                    undefined  // target skills
                );
                setCurrentQuestion(res.question);
            } else {
                // ── Standard: original endpoint ──
                const res = await api.post('/interview/next-question', {
                    position,
                    round_type: roundType,
                    history: currentHistory
                });
                setCurrentQuestion(res.data.question);
            }
        } catch (error: any) {
            console.error("Error fetching question:", error);
            // Fallback to original endpoint if advanced fails
            try {
                const res = await api.post('/interview/next-question', {
                    position,
                    round_type: roundType,
                    history: currentHistory
                });
                setCurrentQuestion(res.data.question);
            } catch (fallbackError: any) {
                const msg = fallbackError.response?.data?.detail || fallbackError.message || "Unknown error";
                setCurrentQuestion(`Error loading question: ${msg}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartInterview = async () => {
        setStep('active');
        setCurrentRound('technical');
        setQuestionIndex(0);
        setHistory([]);
        setAllResponses({ technical: [], managerial: [], hr: [] });
        await fetchNextQuestion('technical', []);
    };

    const handleSendResponse = async () => {
        if (!userResponse.trim() && mode === 'text') return;

        const responseData = { question: currentQuestion, answer: userResponse };
        const updatedAllResponses = { ...allResponses };
        updatedAllResponses[currentRound].push(responseData);
        setAllResponses(updatedAllResponses);

        const newHistory = [...history, responseData];
        setHistory(newHistory);
        setUserResponse('');

        if (questionIndex < currentRoundData.qs - 1) {
            setQuestionIndex(prev => prev + 1);
            await fetchNextQuestion(currentRound, newHistory);
        } else {
            // End of round
            if (currentRound === 'technical') {
                setCurrentRound('managerial');
                setQuestionIndex(0);
                setHistory([]);
                await fetchNextQuestion('managerial', []);
            } else if (currentRound === 'managerial') {
                setCurrentRound('hr');
                setQuestionIndex(0);
                setHistory([]);
                await fetchNextQuestion('hr', []);
            } else {
                // Finish interview
                setStep('results');
                analyzePerformance(updatedAllResponses);
            }
        }
    };

    const analyzePerformance = async (responses: any) => {
        setIsLoading(true);
        try {
            if (useAdvanced) {
                // ── Advanced: structured AI feedback and persistence ──
                const allResp = [
                    ...responses.technical,
                    ...responses.managerial,
                    ...responses.hr
                ];
                const res = await finishAdvancedInterview(
                    position,
                    'full', // all rounds
                    allResp,
                    undefined,
                    undefined,
                    undefined
                );

                // Map advanced analysis to evaluation format
                const analysis = res.analysis || {};
                setEvaluation({
                    technical_score: analysis.technical_accuracy || analysis.technical_score || '0%',
                    soft_skills_score: analysis.communication_clarity || analysis.soft_skills_score || '0%',
                    verdict: analysis.verdict || (analysis.overall_score > 60 ? 'PASS' : 'NEEDS IMPROVEMENT'),
                    strengths: analysis.strengths || [],
                    weaknesses: analysis.weaknesses || analysis.areas_for_improvement || [],
                    feedback: analysis.feedback || analysis.overall_feedback || 'Analysis complete.',
                    technical_accuracy: analysis.technical_accuracy,
                    communication_clarity: analysis.communication_clarity,
                    confidence_level: analysis.confidence_level
                });

                // Save progress snapshot after interview
                try { await saveProgressSnapshot(0); } catch (_) { }
            } else {
                // ── Standard: original analyze endpoint ──
                const res = await api.post('/interview/analyze', {
                    position,
                    responses
                });
                let data = res.data.analysis;
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data.replace(/```json\n?|\n?```/g, ''));
                    } catch (e) { console.error("Parse error", e); }
                }
                setEvaluation(data);
            }
        } catch (error) {
            console.error("Error analyzing interview:", error);
            // Fallback to original
            try {
                const res = await api.post('/interview/analyze', {
                    position,
                    responses
                });
                let data = res.data.analysis;
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data.replace(/```json\n?|\n?```/g, ''));
                    } catch (e) { console.error("Parse error", e); }
                }
                setEvaluation(data);
            } catch (_) { }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            // Start simple mock voice to text
            setTimeout(() => {
                setUserResponse("This is a simulated response generated using Speech-to-Text for the interview.");
                setIsListening(false);
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen font-sans pb-20 overflow-x-hidden relative animated-gradient">
            <PremiumBackground />
            <div className="relative z-10">
                <PremiumNavbar />

                <main className="max-w-4xl mx-auto px-6 pt-16">
                    <AnimatePresence mode="wait">
                        {step === 'setup' && (
                            <motion.div
                                key="setup"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                <div className="text-center space-y-4">
                                    <h1 className="text-5xl font-[900] text-slate-800 tracking-tight">AI Mock Interview</h1>
                                    <p className="text-slate-400 text-lg font-medium">Dynamically generated sessions powered by AI</p>
                                </div>

                                <Card className="p-10 border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-[3rem] space-y-8 max-w-2xl mx-auto border border-white/20">
                                    <div className="space-y-4">
                                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest px-1">
                                            What position are you interviewing for?
                                        </label>
                                        <Input
                                            placeholder="e.g., Software Engineer, Product Manager"
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                            className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white transition-all"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest px-1">
                                            Interview Mode
                                        </label>
                                        <div className="flex p-1 bg-slate-50/80 rounded-2xl">
                                            <button
                                                onClick={() => setMode('text')}
                                                className={`flex-1 h-16 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all ${mode === 'text'
                                                    ? 'bg-[#5c52d2] text-white shadow-lg'
                                                    : 'text-slate-500'
                                                    }`}
                                            >
                                                <MessageSquare className="w-5 h-5" /> Text Mode
                                            </button>
                                            <button
                                                onClick={() => setMode('voice')}
                                                className={`flex-1 h-16 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all ${mode === 'voice'
                                                    ? 'bg-[#5c52d2] text-white shadow-lg'
                                                    : 'text-slate-500'
                                                    }`}
                                            >
                                                <Mic2 className="w-5 h-5" /> Voice Mode
                                            </button>
                                        </div>
                                    </div>

                                    {/* AI Mode Toggle */}
                                    <div className="p-5 rounded-2xl bg-purple-50/60 border-2 border-purple-100 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Sparkles className="w-5 h-5 text-[#5c52d2]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-slate-900">Advanced AI Mode</p>
                                            <p className="text-[10px] font-bold text-slate-400">Resume-aware questions, structured feedback, and progress tracking</p>
                                        </div>
                                        <button
                                            onClick={() => setUseAdvanced(!useAdvanced)}
                                            className={`w-12 h-7 rounded-full transition-all ${useAdvanced ? 'bg-[#5c52d2]' : 'bg-slate-200'}`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${useAdvanced ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {rounds.map((r, i) => (
                                            <div key={i} className="p-7 rounded-[2.5rem] border-2 border-purple-50 group hover:border-purple-200 transition-all flex items-center gap-6">
                                                <div className={`w-16 h-16 ${'bg-blue-50'} ${'text-blue-500'} rounded-2xl flex items-center justify-center shrink-0`}>
                                                    <r.icon className="w-8 h-8" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-slate-900 text-lg leading-none">{r.label}</h4>
                                                    <p className="text-[11px] font-black text-slate-400 tracking-wider">
                                                        {r.qs} Questions • 60% To Pass
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={handleStartInterview}
                                        className="w-full h-20 rounded-[2rem] bg-[#b195ff] hover:bg-[#a284ff] text-white font-black text-xl shadow-xl shadow-purple-100 transition-all group"
                                    >
                                        Start {mode === 'text' ? 'Text' : 'Voice'} Interview <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Card>
                            </motion.div>
                        )}

                        {step === 'active' && (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
                                    {rounds.map((r) => (
                                        <div
                                            key={r.id}
                                            className={`flex-1 min-w-[200px] p-8 rounded-[2.5rem] border-2 transition-all backdrop-blur-sm ${currentRound === r.id
                                                ? 'border-[#5c52d2] bg-blue-50/80 shadow-lg'
                                                : 'border-slate-100 bg-white/40 hover:bg-white/60'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${currentRound === r.id ? 'bg-white shadow-sm' : ''}`}>
                                                <r.icon className={`w-6 h-6 ${currentRound === r.id ? 'text-[#5c52d2]' : 'text-slate-300'}`} />
                                            </div>
                                            <h4 className={`text-sm font-black mb-1 ${currentRound === r.id ? 'text-slate-900' : 'text-slate-400'}`}>{r.label}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 mb-4">{r.qs} questions</p>
                                            {currentRound === r.id && (
                                                <span className="px-4 py-1.5 bg-[#5c52d2] text-white text-[9px] font-black uppercase rounded-full shadow-lg shadow-purple-100">In Progress</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center">
                                        {currentRound === 'technical' && <Monitor className="w-6 h-6 text-blue-500" />}
                                        {currentRound === 'managerial' && <BarChart3 className="w-6 h-6 text-orange-500" />}
                                        {currentRound === 'hr' && <Users className="w-6 h-6 text-green-500" />}
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                                        {currentRound} Round (<span className="text-slate-400 font-bold">{mode === 'text' ? 'Text Mode' : 'Voice Mode'}</span>)
                                    </h2>
                                    <span className="ml-auto text-sm font-black text-[#5c52d2] tracking-widest uppercase">Question {questionIndex + 1} of {currentRoundData.qs}</span>
                                </div>

                                <Card className="p-12 border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-[4rem] space-y-10 min-h-[500px] flex flex-col relative overflow-hidden group border border-white/20">
                                    <AnimatePresence mode="wait">
                                        {isLoading ? (
                                            <div key="loading" className="flex-1 flex flex-col items-center justify-center space-y-6">
                                                <Loader2 className="w-12 h-12 text-[#5c52d2] animate-spin" />
                                                <p className="text-lg font-black text-slate-400 animate-pulse">AI is thinking...</p>
                                            </div>
                                        ) : (
                                            <motion.div
                                                key="question"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex-1 flex flex-col"
                                            >
                                                <div className="p-10 bg-slate-50/80 rounded-[3rem] border-2 border-slate-100 relative z-10 transition-all hover:bg-slate-50">
                                                    <p className="text-2xl font-bold text-slate-700 leading-relaxed italic">
                                                        <span className="text-[#5c52d2] font-black not-italic block mb-4 uppercase text-xs tracking-[0.2em]">Interviewer:</span>
                                                        "{currentQuestion}"
                                                    </p>
                                                </div>

                                                <div className="flex-1" />

                                                {mode === 'text' ? (
                                                    <div className="relative z-10">
                                                        <Input
                                                            placeholder="Type your response..."
                                                            value={userResponse}
                                                            onChange={(e) => setUserResponse(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()}
                                                            className="h-24 px-10 pr-36 rounded-[2.5rem] border-2 border-slate-100 bg-white font-bold text-xl focus:border-[#5c52d2] transition-all shadow-lg"
                                                        />
                                                        <button
                                                            onClick={handleSendResponse}
                                                            className="absolute right-4 top-4 bottom-4 px-10 bg-[#b195ff] text-white rounded-2xl font-black hover:scale-[1.05] transition-all flex items-center gap-2 shadow-lg shadow-purple-100"
                                                        >
                                                            Send <Send className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative z-10 flex flex-col items-center gap-10 py-6">
                                                        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.3)]' : 'bg-slate-100 text-slate-400'
                                                            }`}>
                                                            <Mic2 className={`w-14 h-14 ${isListening ? 'text-white animate-pulse' : ''}`} />
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <button
                                                                onClick={toggleListening}
                                                                className={`h-20 px-12 rounded-3xl font-black text-xl flex items-center gap-4 transition-all ${isListening
                                                                    ? 'bg-rose-500 text-white shadow-xl shadow-rose-200'
                                                                    : 'bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50'
                                                                    }`}
                                                            >
                                                                {isListening ? 'Stop Listening' : 'Start Speaking'}
                                                            </button>
                                                            <button
                                                                onClick={handleSendResponse}
                                                                className="h-20 px-12 bg-emerald-500 text-white rounded-3xl font-black text-xl shadow-xl shadow-emerald-200 hover:scale-105 transition-all flex items-center gap-4"
                                                            >
                                                                Done <Send className="w-6 h-6" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>

                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={() => setStep('setup')}
                                        className="text-slate-400 font-black uppercase text-xs tracking-widest hover:text-rose-500 transition-all flex items-center gap-2"
                                    >
                                        <StopCircle className="w-4 h-4" /> Terminate Interview Session
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'results' && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-12"
                            >
                                {isLoading ? (
                                    <div className="text-center py-20 space-y-8">
                                        <div className="w-24 h-24 bg-white shadow-xl rounded-[3rem] flex items-center justify-center mx-auto ring-8 ring-purple-50">
                                            <Loader2 className="w-12 h-12 text-[#5c52d2] animate-spin" />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Evaluating Performance...</h2>
                                        <p className="text-lg font-medium text-slate-400">Our senior AI recruiter is analyzing your responses.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-center space-y-6">
                                            <div className="w-24 h-24 bg-white shadow-xl text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                                                <Award className="w-12 h-12" />
                                            </div>
                                            <h1 className="text-5xl font-[900] text-slate-900 tracking-tight">Session Analysis</h1>
                                            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
                                                Dynamic AI evaluation for your <span className="text-[#5c52d2] font-black">{position}</span> session.
                                            </p>
                                        </div>

                                        {evaluation && (
                                            <>
                                                <div className="grid md:grid-cols-3 gap-8">
                                                    {[
                                                        { label: 'Technical Accuracy', val: evaluation.technical_score, icon: Monitor, color: 'text-blue-500', bg: 'bg-blue-50' },
                                                        { label: 'Soft Skills', val: evaluation.soft_skills_score, icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-50' },
                                                        { label: 'Verdict', val: evaluation.verdict, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                                                    ].map((stat, i) => (
                                                        <Card key={i} className="p-10 border-none shadow-lg bg-white/90 backdrop-blur-sm rounded-[3rem] text-center space-y-4 hover:shadow-xl transition-all border border-white/20">
                                                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                                                                <stat.icon className="w-7 h-7" />
                                                            </div>
                                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">{stat.label}</p>
                                                            <p className="text-4xl font-[900] text-slate-900 tracking-tighter">{stat.val}</p>
                                                        </Card>
                                                    ))}
                                                </div>

                                                {/* Advanced AI Breakdown (NEW) */}
                                                {useAdvanced && (evaluation.communication_clarity || evaluation.confidence_level) && (
                                                    <Card className="p-8 border-none shadow-lg bg-purple-50/50 rounded-[3rem] border border-purple-100">
                                                        <div className="flex items-center gap-3 mb-6">
                                                            <Sparkles className="w-5 h-5 text-[#5c52d2]" />
                                                            <h3 className="text-xl font-[900] text-slate-900">Advanced AI Breakdown</h3>
                                                        </div>
                                                        <div className="grid md:grid-cols-3 gap-6">
                                                            {evaluation.technical_accuracy && (
                                                                <div className="p-5 bg-white rounded-2xl text-center space-y-2">
                                                                    <Shield className="w-6 h-6 text-blue-500 mx-auto" />
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Accuracy</p>
                                                                    <p className="text-2xl font-[900] text-slate-900">{evaluation.technical_accuracy}</p>
                                                                </div>
                                                            )}
                                                            {evaluation.communication_clarity && (
                                                                <div className="p-5 bg-white rounded-2xl text-center space-y-2">
                                                                    <MessageSquare className="w-6 h-6 text-orange-500 mx-auto" />
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication</p>
                                                                    <p className="text-2xl font-[900] text-slate-900">{evaluation.communication_clarity}</p>
                                                                </div>
                                                            )}
                                                            {evaluation.confidence_level && (
                                                                <div className="p-5 bg-white rounded-2xl text-center space-y-2">
                                                                    <Zap className="w-6 h-6 text-emerald-500 mx-auto" />
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</p>
                                                                    <p className="text-2xl font-[900] text-slate-900">{evaluation.confidence_level}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Card>
                                                )}

                                                <div className="grid lg:grid-cols-2 gap-10">
                                                    <Card className="p-12 border-none shadow-lg bg-white/90 backdrop-blur-sm rounded-[4rem] space-y-8 border border-white/20">
                                                        <h3 className="text-3xl font-black text-slate-900 border-b pb-8 border-slate-50">Key Strengths</h3>
                                                        <div className="space-y-8">
                                                            {evaluation.strengths?.map((s, i) => (
                                                                <div key={i} className="flex items-start gap-5 group">
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                                                                        <CheckCircle2 className="w-4 h-4" />
                                                                    </div>
                                                                    <p className="text-slate-600 font-bold text-lg leading-relaxed">{s}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Card>

                                                    <Card className="p-12 border-none shadow-lg bg-white/90 backdrop-blur-sm rounded-[4rem] space-y-8 border border-white/20">
                                                        <h3 className="text-3xl font-black text-slate-900 border-b pb-8 border-slate-50">Areas for Growth</h3>
                                                        <div className="space-y-8">
                                                            {evaluation.weaknesses?.map((s, i) => (
                                                                <div key={i} className="flex items-start gap-5 group">
                                                                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                                                                        <Target className="w-4 h-4" />
                                                                    </div>
                                                                    <p className="text-slate-600 font-bold text-lg leading-relaxed">{s}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Card>
                                                </div>

                                                <Card className="p-12 border-none shadow-lg bg-slate-50/90 backdrop-blur-sm rounded-[4rem] space-y-6">
                                                    <h3 className="text-2xl font-black text-slate-900">Senior Feedback</h3>
                                                    <p className="text-lg text-slate-600 font-medium leading-relaxed italic">"{evaluation.feedback}"</p>
                                                </Card>
                                            </>
                                        )}

                                        <div className="bg-slate-900 rounded-[4rem] p-16 text-white text-center space-y-10 relative overflow-hidden">
                                            <div className="relative z-10 space-y-6">
                                                <h3 className="text-4xl font-black tracking-tight">Your Interview Roadmap is Ready</h3>
                                                <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">We've identified the exact steps you need to take to crush your next interview.</p>
                                                <div className="flex gap-6 justify-center pt-6">
                                                    <Button
                                                        onClick={() => window.location.href = '/career'}
                                                        className="h-16 px-12 bg-[#b195ff] text-white rounded-2xl font-black text-lg hover:bg-[#a284ff] shadow-2xl transition-all"
                                                    >
                                                        Explore Roadmap
                                                    </Button>
                                                    <Button
                                                        onClick={() => setStep('setup')}
                                                        variant="ghost"
                                                        className="h-16 px-12 border-2 border-white/10 text-white rounded-2xl font-black hover:bg-white/5"
                                                    >
                                                        Practice Again
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
