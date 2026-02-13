import { useState } from 'react';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    BrainCircuit,
    Timer,
    Trophy,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Target,
    Zap,
    BookOpen,
    HelpCircle,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type QuizStep = 'setup' | 'active' | 'results';

const questionsByTopic: Record<string, any[]> = {
    'JavaScript': [
        { id: 1, question: "What is undefined in JavaScript?", options: ["Syntax error", "Variable declared but not assigned", "Keyword", "Type of null"], correct: 1 },
        { id: 2, question: "What is the result of '2' + 2?", options: ["4", "'22'", "NaN", "undefined"], correct: 1 },
        { id: 3, question: "Which keyword declares a constant?", options: ["var", "let", "constant", "const"], correct: 3 },
        { id: 4, question: "Is JavaScript single-threaded?", options: ["Yes", "No", "Depends", "Only in Node.js"], correct: 0 },
        { id: 5, question: "What does 'typeof null' return?", options: ["null", "undefined", "object", "number"], correct: 2 }
    ],
    'Python': [
        { id: 1, question: "How do you start a comment in Python?", options: ["//", "/*", "#", "--"], correct: 2 },
        { id: 2, question: "Which data type is immutable?", options: ["List", "Dictionary", "Set", "Tuple"], correct: 3 },
        { id: 3, question: "What is the correct extension for Python files?", options: [".py", ".pt", ".pyt", ".pyn"], correct: 0 },
        { id: 4, question: "How do you create a function in Python?", options: ["function myFn():", "def myFn():", "create myFn():", "fn myFn():"], correct: 1 },
        { id: 5, question: "Which function gets the length of a list?", options: ["length()", "size()", "len()", "count()"], correct: 2 }
    ],
    'Java': [
        { id: 1, question: "Which keyword is used to inherit a class?", options: ["implements", "extends", "inherits", "using"], correct: 1 },
        { id: 2, question: "What is the default value of a boolean in Java?", options: ["true", "false", "null", "0"], correct: 1 },
        { id: 3, question: "Which company originally developed Java?", options: ["Microsoft", "Google", "Sun Microsystems", "Oracle"], correct: 2 },
        { id: 4, question: "Which method is the entry point for Java apps?", options: ["start()", "run()", "main()", "init()"], correct: 2 },
        { id: 5, question: "What type of variable can hold the value '3.14'?", options: ["int", "double", "char", "boolean"], correct: 1 }
    ],
    'HTML': [
        { id: 1, question: "What does HTML stand for?", options: ["Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Home Tool Markup Language", "Hyper Tool Markup Language"], correct: 1 },
        { id: 2, question: "Who is making the Web standards?", options: ["Mozilla", "Google", "Microsoft", "The World Wide Web Consortium"], correct: 3 },
        { id: 3, question: "Choose the correct HTML element for the largest heading:", options: ["<heading>", "<h6>", "<h1>", "<head>"], correct: 2 },
        { id: 4, question: "What is the correct HTML element for inserting a line break?", options: ["<lb>", "<br>", "<break>", "<nextline>"], correct: 1 },
        { id: 5, question: "Which attribute is used to provide an alternative text for an image?", options: ["title", "src", "alt", "longdesc"], correct: 2 }
    ],
    'CSS': [
        { id: 1, question: "What does CSS stand for?", options: ["Creative Style Sheets", "Colorful Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"], correct: 2 },
        { id: 2, question: "Where in an HTML document is the correct place to refer to an external style sheet?", options: ["In the <body> section", "In the <head> section", "At the end of the document", "Anywhere is fine"], correct: 1 },
        { id: 3, question: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<script>", "<style>", "<design>"], correct: 2 },
        { id: 4, question: "Which CSS property is used to change the background color?", options: ["color", "bg-color", "background-color", "bgcolor"], correct: 2 },
        { id: 5, question: "How do you select an element with id 'demo'?", options: ["demo", ".demo", "*demo", "#demo"], correct: 3 }
    ],
    'C++': [
        { id: 1, question: "Which header file allows us to work with input and output objects?", options: ["<iostream>", "<stdio.h>", "<input>", "<conio.h>"], correct: 0 },
        { id: 2, question: "What is the correct way to output 'Hello World' in C++?", options: ["print('Hello World');", "cout << 'Hello World';", "System.out.println('Hello World');", "Console.Write('Hello World');"], correct: 1 },
        { id: 3, question: "How do you create a variable with the numeric value 5?", options: ["x = 5;", "double x = 5;", "int x = 5;", "num x = 5;"], correct: 2 },
        { id: 4, question: "Which operator is used to multiply two values?", options: ["X", "*", "#", "MOD"], correct: 1 },
        { id: 5, question: "Which keyword is used to create a class in C++?", options: ["class", "struct", "object", "type"], correct: 0 }
    ],
    'C': [
        { id: 1, question: "Which character is used to end a statement in C?", options: ["{", "(", ";", ":"], correct: 2 },
        { id: 2, question: "What is the correct way to output 'Hello World' in C?", options: ["printf('Hello World');", "scanf('Hello World');", "cout << 'Hello World';", "print('Hello World');"], correct: 0 },
        { id: 3, question: "Which data type is used to create a variable that should store text?", options: ["string", "char", "txt", "text"], correct: 1 },
        { id: 4, question: "How do you start a multi-line comment?", options: ["//", "#", "/*", "<!--"], correct: 2 },
        { id: 5, question: "Which library is needed for printf()?", options: ["math.h", "conio.h", "string.h", "stdio.h"], correct: 3 }
    ]
};

const languages = [
    { name: 'JavaScript', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { name: 'Python', color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Java', color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'HTML', color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'CSS', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'C++', color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { name: 'C', color: 'text-slate-500', bg: 'bg-slate-50' }
];

export default function Quiz() {
    const [step, setStep] = useState<QuizStep>('setup');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [topic, setTopic] = useState('JavaScript');
    const [difficulty, setDifficulty] = useState('Medium');
    const [numQuestions, setNumQuestions] = useState('5');

    const quizQuestions = questionsByTopic[topic] || questionsByTopic['JavaScript'];

    const handleStartQuiz = () => {
        setStep('active');
        setCurrentQuestion(0);
        setSelectedAnswers({});
    };

    const handleOptionSelect = (optionIndex: number) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: optionIndex
        });
    };

    const handleNext = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setStep('results');
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const score = Object.entries(selectedAnswers).reduce((acc, [idx, ans]) => {
        return acc + (ans === quizQuestions[parseInt(idx)].correct ? 1 : 0);
    }, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-20 overflow-x-hidden">
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
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                                    <div className="flex flex-wrap w-10 h-10 gap-1 translate-y-1">
                                        <div className="w-4 h-4 bg-green-400 rounded-sm" />
                                        <div className="w-4 h-4 bg-rose-400 rounded-sm" />
                                        <div className="w-4 h-4 bg-blue-400 rounded-sm" />
                                        <div className="w-4 h-4 bg-purple-400 rounded-sm" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">Test Your Knowledge</h1>
                                    <p className="text-slate-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                                        Choose a language and prove your expertise with our high-fidelity skill assessments.
                                    </p>
                                </div>
                            </div>

                            <Card className="p-10 border-none shadow-sm bg-white rounded-[2.5rem] space-y-10 max-w-2xl mx-auto">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest">
                                        <BookOpen className="w-4 h-4 text-blue-500" />
                                        Select Technology
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.name}
                                                onClick={() => setTopic(lang.name)}
                                                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${topic === lang.name
                                                        ? `border-transparent shadow-xl ring-2 ring-slate-900 ${lang.bg} ${lang.color}`
                                                        : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:bg-white hover:border-slate-200'
                                                    }`}
                                            >
                                                <BrainCircuit className="w-6 h-6" />
                                                <span className="text-xs font-black uppercase tracking-widest">{lang.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest">
                                            <Zap className="w-4 h-4 text-orange-500" />
                                            Difficulty
                                        </div>
                                        <div className="flex gap-2">
                                            {['Easy', 'Medium', 'Hard'].map((lvl) => (
                                                <button
                                                    key={lvl}
                                                    onClick={() => setDifficulty(lvl)}
                                                    className={`flex-1 h-12 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all ${difficulty === lvl
                                                            ? 'bg-[#5c52d2] text-white border-transparent shadow-lg'
                                                            : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {lvl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest">
                                            <HelpCircle className="w-4 h-4 text-purple-500" />
                                            Questions
                                        </div>
                                        <select
                                            value={numQuestions}
                                            onChange={(e) => setNumQuestions(e.target.value)}
                                            className="w-full h-12 px-6 rounded-xl border border-slate-100 bg-slate-50/50 font-black text-xs uppercase tracking-widest focus:bg-white transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="5">5 Questions</option>
                                            <option value="10">10 Questions</option>
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleStartQuiz}
                                    className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#5c52d2] to-[#7c3aed] text-white font-black text-lg shadow-2xl shadow-purple-200 hover:scale-[1.02] transition-all"
                                >
                                    Start {topic} Assessment
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {step === 'active' && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    Question {currentQuestion + 1} of {quizQuestions.length}
                                </h3>
                                <div className="flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-widest">
                                    {topic} • {difficulty}
                                </div>
                            </div>

                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-[#5c52d2] to-[#7c3aed]"
                                />
                            </div>

                            <Card className="p-12 border-none shadow-sm bg-white rounded-[3rem] space-y-10 min-h-[500px] flex flex-col justify-center">
                                <h2 className="text-2xl font-[900] text-slate-900 leading-snug">
                                    {quizQuestions[currentQuestion].question}
                                </h2>

                                <div className="space-y-4">
                                    {quizQuestions[currentQuestion].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(idx)}
                                            className={`w-full p-6 rounded-2xl border text-left font-bold transition-all ${selectedAnswers[currentQuestion] === idx
                                                ? 'bg-[#5c52d2] text-white border-transparent shadow-xl ring-2 ring-slate-900 ring-offset-2'
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/30'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            <div className="flex justify-between items-center px-2 pt-8">
                                <Button
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                    className="h-14 px-8 rounded-2xl border-slate-100 text-slate-400 font-black hover:bg-slate-50 gap-2"
                                >
                                    — Previous
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="h-14 px-10 rounded-2xl bg-gradient-to-r from-[#5c52d2] to-[#7c3aed] text-white font-black shadow-xl shadow-purple-100 hover:scale-105 transition-all gap-2"
                                >
                                    {currentQuestion === quizQuestions.length - 1 ? 'Submit Quiz' : 'Next Question'} →
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-12 py-10"
                        >
                            <div className="relative w-48 h-48 mx-auto">
                                <div className="absolute inset-0 bg-purple-100 rounded-full blur-3xl opacity-50" />
                                <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                                    <div className="flex flex-col items-center">
                                        <span className="text-6xl font-[900] text-[#5c52d2] tracking-tighter">
                                            {Math.round((score / quizQuestions.length) * 100)}%
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Score Captured</span>
                                    </div>
                                </div>
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12">
                                    <Trophy className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">
                                    {score === quizQuestions.length ? 'Perfect Score! 🥳' : score > quizQuestions.length / 2 ? 'Great Job! 👏' : 'Keep Practicing! 💪'}
                                </h1>
                                <p className="text-slate-500 text-lg font-medium">
                                    You answered {score} out of {quizQuestions.length} questions correctly in {topic}.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-8">
                                <Card className="p-8 border-none bg-blue-50/50 rounded-3xl space-y-2">
                                    <Target className="w-6 h-6 text-blue-500 mx-auto" />
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accuracy</p>
                                    <p className="text-2xl font-black text-blue-600">{Math.round((score / quizQuestions.length) * 100)}%</p>
                                </Card>
                                <Card className="p-8 border-none bg-green-50/50 rounded-3xl space-y-2">
                                    <Zap className="w-6 h-6 text-green-500 mx-auto" />
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Level</p>
                                    <p className="text-2xl font-black text-green-600">{difficulty}</p>
                                </Card>
                                <Card className="p-8 border-none bg-purple-50/50 rounded-3xl space-y-2">
                                    <CheckCircle2 className="w-6 h-6 text-purple-500 mx-auto" />
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Correct</p>
                                    <p className="text-2xl font-black text-purple-600">{score}/{quizQuestions.length}</p>
                                </Card>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
                                <Button
                                    onClick={() => setStep('setup')}
                                    variant="outline"
                                    className="h-14 px-10 rounded-2xl border-slate-100 font-black text-slate-600 hover:bg-slate-50"
                                >
                                    Try Another Quiz
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black shadow-xl hover:bg-black transition-all gap-2"
                                >
                                    Back to Dashboard <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
