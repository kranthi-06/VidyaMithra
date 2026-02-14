import { PremiumNavbar } from '../components/PremiumNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    LineChart,
    TrendingUp,
    Award,
    Target,
    Rocket,
    PieChart,
    BrainCircuit,
    History,
    Flame,
    Zap,
    History as HistoryIcon,
    Calendar,
    ChevronRight,
    Search,
    Monitor,
    BarChart3,
    Users2,
    ArrowUpRight,
    Mic2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PremiumBackground } from '../components/PremiumBackground';

export default function Progress() {
    const quizHistory = [
        { date: 'Nov 7, 2025, 04:39 PM', topic: 'JavaScript', diff: 'Easy', score: '60%', result: 'Review' },
        { date: 'Nov 5, 2025, 11:22 PM', topic: 'JavaScript', diff: 'Hard', score: '33%', result: 'Review' },
        { date: 'Nov 5, 2025, 11:15 PM', topic: 'C', diff: 'Easy', score: '0%', result: 'Review' },
        { date: 'Nov 3, 2025, 11:34 PM', topic: 'Python', diff: 'Easy', score: '20%', result: 'Review' },
        { date: 'Nov 3, 2025, 10:34 PM', topic: 'JavaScript', diff: 'Easy', score: '60%', result: 'Review' },
        { date: 'Nov 3, 2025, 10:02 PM', topic: 'JavaScript', diff: 'Easy', score: '20%', result: 'Review' },
        { date: 'Nov 3, 2025, 09:29 PM', topic: 'JavaScript', diff: 'Easy', score: '40%', result: 'Review' },
        { date: 'Nov 3, 2025, 04:43 PM', topic: 'JavaScript', diff: 'Easy', score: '20%', result: 'Review' },
    ];

    const interviewHistory = [
        {
            role: 'Software Engineer',
            date: 'Nov 3, 2025, 11:37 PM',
            overall: '5%',
            rounds: [
                { type: 'TECHNICAL', time: '1m 58s', score: '5%', icon: Monitor }
            ]
        },
        {
            role: 'AI Developer',
            date: 'Nov 3, 2025, 10:36 PM',
            overall: '4%',
            rounds: [
                { type: 'TECHNICAL', time: '1m 6s', score: '4%', icon: Monitor }
            ]
        },
        {
            role: 'AI',
            date: 'Nov 3, 2025, 10:11 PM',
            overall: '7%',
            rounds: [
                { type: 'TECHNICAL', time: '1m 12s', score: '7%', icon: Monitor }
            ]
        }
    ];

    return (
        <div className="min-h-screen font-sans pb-20 overflow-x-hidden relative animated-gradient">
            <PremiumBackground />
            <div className="relative z-10">
                <PremiumNavbar />

                <main className="max-w-[1200px] mx-auto px-6 pt-16 space-y-16">
                    {/* Header Container */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-[900] text-slate-900 tracking-tight">Your Learning Progress</h1>
                        <p className="text-slate-400 text-lg font-medium">Track your growth and achievements across all activities</p>
                    </div>

                    {/* Top Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-10 border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-[3rem] relative overflow-hidden group border border-white/20">
                            <div className="absolute top-0 right-0 p-8">
                                <BrainCircuit className="w-12 h-12 text-blue-500/10 rotate-12 transition-transform group-hover:rotate-0" />
                            </div>
                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-3">Quiz Performance</p>
                                    <p className="text-4xl font-[900] text-slate-900 tracking-tighter">32%</p>
                                    <p className="text-xs font-bold text-slate-400 mt-2">Average Score</p>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '32%' }} className="h-full bg-blue-500 rounded-full" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400">0 out of 8 quizzes passed</p>
                            </div>
                        </Card>

                        <Card className="p-10 border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-[3rem] relative overflow-hidden group border border-white/20">
                            <div className="absolute top-0 right-0 p-8">
                                <Flame className="w-12 h-12 text-orange-500/10 rotate-12 transition-transform group-hover:rotate-0" />
                            </div>
                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                    <HistoryIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-3">Quizzes Taken</p>
                                    <p className="text-4xl font-[900] text-slate-900 tracking-tighter">8</p>
                                    <p className="text-xs font-bold text-slate-400 mt-2">Current Count</p>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-orange-500 rounded-full" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400">Total attempts across all topics</p>
                            </div>
                        </Card>

                        <Card className="p-10 border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-[3rem] relative overflow-hidden group border border-white/20">
                            <div className="absolute top-0 right-0 p-8">
                                <Mic2 className="w-12 h-12 text-rose-500/10 rotate-12 transition-transform group-hover:rotate-0" />
                            </div>
                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-3">Interview Score</p>
                                    <p className="text-4xl font-[900] text-slate-900 tracking-tighter">5%</p>
                                    <p className="text-xs font-bold text-slate-400 mt-2">Average Score</p>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '5%' }} className="h-full bg-rose-500 rounded-full" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400">0 out of 3 interviews passed</p>
                            </div>
                        </Card>
                    </div>

                    {/* Quiz History Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-slate-900" />
                            </div>
                            <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">Quiz History</h2>
                        </div>

                        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-white/20">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#5c52d2] text-white">
                                            <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest">Date</th>
                                            <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest">Topic</th>
                                            <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest">Difficulty</th>
                                            <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest">Score</th>
                                            <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {quizHistory.map((q, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="w-4 h-4 text-slate-300" />
                                                        <span className="text-sm font-bold text-slate-500">{q.date}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-black text-slate-900">{q.topic}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${q.diff === 'Hard' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                                                        }`}>
                                                        {q.diff}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-black text-slate-900">{q.score}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest hover:border-rose-100 hover:text-rose-500 transition-all">
                                                        ✕ Review <ChevronRight className="w-3 h-3" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Interview Practice History */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                                <Mic2 className="w-5 h-5" />
                            </div>
                            <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">Interview Practice History</h2>
                        </div>

                        <div className="space-y-6">
                            {interviewHistory.map((item, i) => (
                                <Card key={i} className="p-8 border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-[2.5rem] space-y-6 group hover:shadow-xl hover:shadow-rose-100/30 transition-all border border-white/20">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-[900] text-slate-900 tracking-tight group-hover:text-rose-500 transition-colors">{item.role}</h3>
                                            <p className="text-xs font-bold text-slate-400">{item.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-[900] text-rose-500 tracking-tighter">{item.overall}</p>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">0/1 rounds passed</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {item.rounds.map((r, idx) => (
                                            <div key={idx} className="p-5 rounded-2xl bg-white border-2 border-rose-100/50 flex items-center gap-6 relative overflow-hidden group/round">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                                                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                                                    <r.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{r.type}</h4>
                                                    <p className="text-xs font-bold text-slate-400">{r.time}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-lg font-black text-rose-500">{r.score}</span>
                                                    <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 group-hover/round:border-rose-200 group-hover/round:text-rose-500 transition-all">
                                                        ✕
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Footer Insight */}
                    <Card className="p-10 border-none shadow-2xl shadow-blue-100/50 bg-white/90 backdrop-blur-sm rounded-[3rem] flex flex-col md:flex-row items-center gap-10 border border-white/20">
                        <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-[2.5rem] flex items-center justify-center shrink-0">
                            <Rocket className="w-12 h-12" />
                        </div>
                        <div className="space-y-4 flex-1 text-center md:text-left">
                            <h3 className="text-3xl font-[900] text-slate-900 tracking-tight">Growth Insight Available</h3>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                Based on your recent quiz and interview performance, we've identified key patterns in your learning curve. Check out your personalized improvement strategy.
                            </p>
                        </div>
                        <Button className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black shadow-xl shrink-0 group">
                            Unlock Analytics <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </Card>
                </main>
            </div>
        </div>
    );
}
