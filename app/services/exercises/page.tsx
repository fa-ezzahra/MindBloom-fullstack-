"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    MessageCircle,
    Quote,
    Sparkles,
    Brain,
    Dumbbell,
    Play,
    Pause,
    RotateCcw,
    CheckCircle,
    Plus,
    Trash2,
    Target,
    Award,
    TrendingUp,
    Lightbulb,
    Heart,
    BookOpen,
} from "lucide-react"

// Define UserData interface to match JournalingPage
interface UserData {
    username: string
    firstName: string
    lastName: string
    isAuthenticated: boolean
    loginTime: string
}

// Types for exercises
interface ThoughtRecord {
    id: string
    trigger: string
    emotion: string
    automaticThought: string
    evidenceFor: string
    evidenceAgainst: string
    alternativeThought: string
    outcome: string
    date: Date
}

interface Activity {
    id: string
    name: string
    completed: boolean
    date: string
}

interface QuizQuestion {
    id: number
    thought: string
    options: string[]
    correct: number
    explanation: string
}

export default function ExercisesPage() {
    const [currentQuote, setCurrentQuote] = useState(0)
    const [currentUser, setCurrentUser] = useState<UserData | null>(null)

    // Thought Record State
    const [thoughtRecord, setThoughtRecord] = useState<Partial<ThoughtRecord>>({})
    const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecord[]>([])
    const [currentStep, setCurrentStep] = useState(0)

    // Breathing Exercise State
    const [breathingActive, setBreathingActive] = useState(false)
    const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale" | "pause">("pause")
    const [breathingCount, setBreathingCount] = useState(0)
    const [breathingCycle, setBreathingCycle] = useState(0)

    // Behavioral Activation State
    const [activities, setActivities] = useState<Activity[]>([])
    const [newActivity, setNewActivity] = useState("")

    // Anxiety Rating State
    const [anxietyBefore, setAnxietyBefore] = useState([50])
    const [anxietyAfter, setAnxietyAfter] = useState([50])
    const [hasRatedBefore, setHasRatedBefore] = useState(false)
    const [hasRatedAfter, setHasRatedAfter] = useState(false)

    // Quiz State
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)
    const [score, setScore] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)

    // Distortion Identifier State
    const [userThought, setUserThought] = useState("")
    const [selectedDistortion, setSelectedDistortion] = useState("")
    const [showDistortionHelp, setShowDistortionHelp] = useState(false)

    const inspirationalQuotes = [
        "Every small step in challenging your thoughts is a victory worth celebrating.",
        "Your thoughts are not facts. You have the power to examine and change them.",
        "Progress in mental health comes from practice, patience, and self-compassion.",
        "These exercises are tools for building a stronger, more resilient mind.",
        "Remember: you're learning new skills that will serve you for life.",
        "Each exercise you complete is an investment in your mental wellness.",
    ]

    const cognitiveDistortions = [
        {
            name: "All-or-Nothing Thinking",
            description: "Seeing things in black and white categories, with no middle ground.",
            keywords: ["always", "never", "completely", "totally", "perfect", "failure"],
            reframe: "What would be a more balanced way to look at this situation?",
        },
        {
            name: "Catastrophizing",
            description: "Imagining the worst possible outcome and treating it as likely.",
            keywords: ["disaster", "terrible", "awful", "worst", "catastrophe", "ruined"],
            reframe: "What's the most realistic outcome? What would you tell a friend in this situation?",
        },
        {
            name: "Mind Reading",
            description: "Assuming you know what others are thinking without evidence.",
            keywords: ["thinks", "believes", "knows", "assumes", "judging"],
            reframe: "What evidence do I have for this? Could there be other explanations?",
        },
        {
            name: "Emotional Reasoning",
            description: "Believing that your feelings reflect reality.",
            keywords: ["feel like", "seems", "appears", "must be true"],
            reframe: "Just because I feel this way doesn't mean it's true. What are the facts?",
        },
        {
            name: "Should Statements",
            description: "Having rigid rules about how you or others should behave.",
            keywords: ["should", "must", "ought", "have to", "supposed to"],
            reframe: "What would be more flexible and realistic expectations?",
        },
    ]

    const quizQuestions: QuizQuestion[] = [
        {
            id: 1,
            thought: "I failed this test, so I'm a complete failure as a person.",
            options: [
                "You're right, one test defines everything about you.",
                "What evidence do you have that one test makes you a complete failure?",
                "You should study harder next time.",
                "Tests don't matter anyway.",
            ],
            correct: 1,
            explanation: "This challenges all-or-nothing thinking by asking for evidence and perspective.",
        },
        {
            id: 2,
            thought: "Everyone at the party thinks I'm boring and weird.",
            options: [
                "You should avoid parties in the future.",
                "What specific evidence do you have that everyone thinks this?",
                "Maybe you are boring.",
                "Parties are overrated anyway.",
            ],
            correct: 1,
            explanation: "This challenges mind reading by asking for concrete evidence rather than assumptions.",
        },
        {
            id: 3,
            thought: "If I don't get this job, my career will be ruined forever.",
            options: [
                "You're probably right to worry.",
                "What other opportunities might exist if this doesn't work out?",
                "You should have prepared better.",
                "Jobs aren't that important.",
            ],
            correct: 1,
            explanation: "This challenges catastrophizing by exploring alternative outcomes and possibilities.",
        },
    ]

    const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Check authentication on load
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('currentUser')
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser)
                    setCurrentUser(userData)
                } catch (error) {
                    console.error('Error parsing user data:', error)
                    sessionStorage.removeItem('currentUser')
                }
            }
        }
    }, [])

    // Load data from localStorage on mount
    useEffect(() => {
        const savedThoughtRecords = localStorage.getItem("mindbloom-thought-records")
        if (savedThoughtRecords) {
            setThoughtRecords(JSON.parse(savedThoughtRecords))
        }

        const savedActivities = localStorage.getItem("mindbloom-activities")
        if (savedActivities) {
            setActivities(JSON.parse(savedActivities))
        }
    }, [])

    // Rotate quotes every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    // Breathing exercise logic
    useEffect(() => {
        if (breathingActive) {
            const phases = [
                { name: "inhale", duration: 4000 },
                { name: "hold", duration: 7000 },
                { name: "exhale", duration: 8000 },
            ]

            let phaseIndex = 0
            setBreathingPhase(phases[phaseIndex].name as any)
            setBreathingCount(phases[phaseIndex].duration / 1000)

            const startPhase = () => {
                const currentPhase = phases[phaseIndex]
                setBreathingPhase(currentPhase.name as any)
                setBreathingCount(currentPhase.duration / 1000)

                let timeLeft = currentPhase.duration / 1000
                const countInterval = setInterval(() => {
                    timeLeft -= 1
                    setBreathingCount(timeLeft)

                    if (timeLeft <= 0) {
                        clearInterval(countInterval)
                        phaseIndex = (phaseIndex + 1) % phases.length
                        if (phaseIndex === 0) {
                            setBreathingCycle((prev) => prev + 1)
                        }
                        startPhase()
                    }
                }, 1000)

                breathingIntervalRef.current = countInterval
            }

            startPhase()
        } else {
            if (breathingIntervalRef.current) {
                clearInterval(breathingIntervalRef.current)
            }
        }

        return () => {
            if (breathingIntervalRef.current) {
                clearInterval(breathingIntervalRef.current)
            }
        }
    }, [breathingActive])

    // Thought Record Functions
    const saveThoughtRecord = () => {
        if (thoughtRecord.trigger && thoughtRecord.emotion && thoughtRecord.automaticThought) {
            const newRecord: ThoughtRecord = {
                id: Date.now().toString(),
                trigger: thoughtRecord.trigger || "",
                emotion: thoughtRecord.emotion || "",
                automaticThought: thoughtRecord.automaticThought || "",
                evidenceFor: thoughtRecord.evidenceFor || "",
                evidenceAgainst: thoughtRecord.evidenceAgainst || "",
                alternativeThought: thoughtRecord.alternativeThought || "",
                outcome: thoughtRecord.outcome || "",
                date: new Date(),
            }

            const updated = [...thoughtRecords, newRecord]
            setThoughtRecords(updated)
            localStorage.setItem("mindbloom-thought-records", JSON.stringify(updated))
            setThoughtRecord({})
            setCurrentStep(0)
        }
    }

    // Activity Functions
    const addActivity = () => {
        if (newActivity.trim()) {
            const activity: Activity = {
                id: Date.now().toString(),
                name: newActivity.trim(),
                completed: false,
                date: new Date().toISOString().split("T")[0],
            }

            const updated = [...activities, activity]
            setActivities(updated)
            localStorage.setItem("mindbloom-activities", JSON.stringify(updated))
            setNewActivity("")
        }
    }

    const toggleActivity = (id: string) => {
        const updated = activities.map((activity) =>
            activity.id === id ? { ...activity, completed: !activity.completed } : activity,
        )
        setActivities(updated)
        localStorage.setItem("mindbloom-activities", JSON.stringify(updated))
    }

    const deleteActivity = (id: string) => {
        const updated = activities.filter((activity) => activity.id !== id)
        setActivities(updated)
        localStorage.setItem("mindbloom-activities", JSON.stringify(updated))
    }

    // Quiz Functions
    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswer(answerIndex)
        setShowExplanation(true)

        if (answerIndex === quizQuestions[currentQuestion].correct) {
            setScore(score + 1)
        }
    }

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
            setShowExplanation(false)
        } else {
            setQuizCompleted(true)
        }
    }

    const resetQuiz = () => {
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowExplanation(false)
        setScore(0)
        setQuizCompleted(false)
    }

    // Distortion Identifier Functions
    const identifyDistortion = () => {
        const thought = userThought.toLowerCase()
        const identified = cognitiveDistortions.find((distortion) =>
            distortion.keywords.some((keyword) => thought.includes(keyword)),
        )

        if (identified) {
            setSelectedDistortion(identified.name)
            setShowDistortionHelp(true)
        } else {
            setSelectedDistortion("No specific distortion detected")
            setShowDistortionHelp(true)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('currentUser')
        setCurrentUser(null)
    }

    const thoughtRecordSteps = [
        { label: "Trigger", field: "trigger", placeholder: "What happened? Describe the situation..." },
        { label: "Emotion", field: "emotion", placeholder: "What did you feel? (e.g., anxious, sad, angry...)" },
        { label: "Automatic Thought", field: "automaticThought", placeholder: "What went through your mind?" },
        { label: "Evidence For", field: "evidenceFor", placeholder: "What supports this thought?" },
        { label: "Evidence Against", field: "evidenceAgainst", placeholder: "What contradicts this thought?" },
        { label: "Alternative Thought", field: "alternativeThought", placeholder: "What's a more balanced view?" },
        { label: "Outcome", field: "outcome", placeholder: "How do you feel now?" },
    ]

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-violet-25 via-purple-25 to-fuchsia-25"
            style={{
                background: "linear-gradient(135deg, #faf7ff 0%, #f3f0ff 50%, #f0ebff 100%)",
            }}
        >
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-violet-100 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo and Name */}
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
                                    <Dumbbell className="h-6 w-6 text-white" />
                                </div>
                                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                MindBloom Exercises
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-violet-600 transition-colors font-medium">
                                Home
                            </Link>
                            <Link href="/exercises" className="text-violet-600 font-medium">
                                Exercises
                            </Link>
                            {currentUser ? (
                                <>
                                    <span className="text-violet-700 font-medium">
                                        Hi, {currentUser.firstName || currentUser.username}! 👋
                                    </span>
                                    <Button
                                        variant="outline"
                                        className="border-violet-200 text-violet-700 hover:bg-violet-50"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50">
                                    Log In
                                </Button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <Button variant="ghost" className="md:hidden">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Inspirational Quote */}
            <div className="bg-gradient-to-r from-violet-100 to-purple-100 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center space-x-4">
                        <Quote className="h-6 w-6 text-violet-600 flex-shrink-0" />
                        <p className="text-center text-gray-700 font-medium text-lg max-w-2xl transition-all duration-500 ease-in-out">
                            {inspirationalQuotes[currentQuote]}
                        </p>
                        <Quote className="h-6 w-6 text-violet-600 flex-shrink-0 rotate-180" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                        CBT Exercise Toolkit
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Practice evidence-based cognitive behavioral therapy techniques to build mental resilience and emotional
                        well-being.
                    </p>
                </div>

                <Tabs defaultValue="anxiety-rating" className="w-full">
                    <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-3 lg:grid-cols-6 mb-8">
                        <TabsTrigger value="anxiety-rating" className="text-xs py-3">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Anxiety Scale
                        </TabsTrigger>
                        <TabsTrigger value="thought-record" className="text-xs py-3">
                            <Brain className="h-4 w-4 mr-1" />
                            Thought Record
                        </TabsTrigger>
                        <TabsTrigger value="breathing" className="text-xs py-3">
                            <Heart className="h-4 w-4 mr-1" />
                            Breathing
                        </TabsTrigger>
                        <TabsTrigger value="distortion" className="text-xs py-3">
                            <Lightbulb className="h-4 w-4 mr-1" />
                            Distortions
                        </TabsTrigger>
                        <TabsTrigger value="activities" className="text-xs py-3">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activities
                        </TabsTrigger>
                        <TabsTrigger value="quiz" className="text-xs py-3">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Quiz
                        </TabsTrigger>
                    </TabsList>

                    {/* Anxiety Rating Scale */}
                    <TabsContent value="anxiety-rating" className="mt-0">
                        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <TrendingUp className="h-6 w-6 mr-2 text-violet-600" />
                                    Anxiety Rating Scale (SUDs)
                                </CardTitle>
                                <CardDescription>
                                    Rate your anxiety level from 0 (completely calm) to 100 (extreme anxiety)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            Before Exercise: {anxietyBefore[0]}
                                        </label>
                                        <Slider
                                            value={anxietyBefore}
                                            onValueChange={(value) => {
                                                setAnxietyBefore(value)
                                                setHasRatedBefore(true)
                                            }}
                                            max={100}
                                            step={1}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>0 - Completely Calm</span>
                                            <span>50 - Moderate</span>
                                            <span>100 - Extreme Anxiety</span>
                                        </div>
                                    </div>

                                    {hasRatedBefore && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                                After Exercise: {anxietyAfter[0]}
                                            </label>
                                            <Slider
                                                value={anxietyAfter}
                                                onValueChange={(value) => {
                                                    setAnxietyAfter(value)
                                                    setHasRatedAfter(true)
                                                }}
                                                max={100}
                                                step={1}
                                                className="w-full"
                                            />
                                        </div>
                                    )}

                                    {hasRatedBefore && hasRatedAfter && (
                                        <div className="p-4 bg-violet-50 rounded">
                                            <h4 className="font-semibold text-violet-800 mb-2">Your Progress</h4>
                                            <div className="text-2xl font-bold text-violet-600 mb-2">
                                                {anxietyBefore[0] - anxietyAfter[0] > 0 ? "-" : "+"}
                                                {Math.abs(anxietyBefore[0] - anxietyAfter[0])} points
                                            </div>
                                            <p className="text-violet-700 text-sm">
                                                {anxietyBefore[0] - anxietyAfter[0] > 0
                                                    ? "Great job! Your anxiety decreased. This shows the exercise is helping."
                                                    : anxietyBefore[0] - anxietyAfter[0] < 0
                                                        ? "It's okay if anxiety increased. Sometimes awareness brings temporary discomfort. Keep practicing."
                                                        : "Your anxiety stayed the same. That's still progress - you're building awareness!"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Thought Record */}
                    <TabsContent value="thought-record" className="mt-0">
                        <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <Brain className="h-6 w-6 mr-2 text-violet-600" />
                                    Thought Record - Cognitive Restructuring
                                </CardTitle>
                                <CardDescription>
                                    Step {currentStep + 1} of {thoughtRecordSteps.length}: {thoughtRecordSteps[currentStep].label}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="mb-6">
                                    <Progress value={(currentStep / thoughtRecordSteps.length) * 100} className="h-2" />
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {thoughtRecordSteps[currentStep].label}
                                        </label>
                                        <Textarea
                                            placeholder={thoughtRecordSteps[currentStep].placeholder}
                                            value={thoughtRecord[thoughtRecordSteps[currentStep].field as keyof ThoughtRecord] || ""}
                                            onChange={(e) =>
                                                setThoughtRecord({
                                                    ...thoughtRecord,
                                                    [thoughtRecordSteps[currentStep].field]: e.target.value,
                                                })
                                            }
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                            disabled={currentStep === 0}
                                        >
                                            Previous
                                        </Button>

                                        {currentStep < thoughtRecordSteps.length - 1 ? (
                                            <Button
                                                onClick={() => setCurrentStep(currentStep + 1)}
                                                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                            >
                                                Next
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={saveThoughtRecord}
                                                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                            >
                                                Save Record
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {thoughtRecords.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-violet-200">
                                        <h4 className="font-semibold text-gray-800 mb-4">Previous Records</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {thoughtRecords.slice(-3).map((record) => (
                                                <div key={record.id} className="p-3 bg-violet-50 rounded">
                                                    <div className="text-sm font-medium text-violet-800">{record.trigger}</div>
                                                    <div className="text-xs text-violet-600">{new Date(record.date).toLocaleDateString()}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Breathing Exercise */}
                    <TabsContent value="breathing" className="mt-0">
                        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <Heart className="h-6 w-6 mr-2 text-violet-600" />
                                    4-7-8 Breathing Exercise
                                </CardTitle>
                                <CardDescription>Inhale for 4, hold for 7, exhale for 8 seconds</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center space-y-8">
                                    <div className="relative">
                                        <div
                                            className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${breathingPhase === "inhale"
                                                ? "border-green-400 bg-green-50 scale-110"
                                                : breathingPhase === "hold"
                                                    ? "border-yellow-400 bg-yellow-50 scale-110"
                                                    : breathingPhase === "exhale"
                                                        ? "border-blue-400 bg-blue-50 scale-90"
                                                        : "border-violet-400 bg-violet-50"
                                                }`}
                                        >
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-gray-800 capitalize">{breathingPhase}</div>
                                                {breathingActive && <div className="text-lg text-gray-600">{Math.ceil(breathingCount)}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="text-lg font-medium text-gray-700">Cycle: {breathingCycle}</div>

                                        <div className="flex justify-center space-x-4">
                                            <Button
                                                onClick={() => setBreathingActive(!breathingActive)}
                                                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                            >
                                                {breathingActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                                {breathingActive ? "Pause" : "Start"}
                                            </Button>

                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setBreathingActive(false)
                                                    setBreathingPhase("pause")
                                                    setBreathingCount(0)
                                                    setBreathingCycle(0)
                                                }}
                                            >
                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                Reset
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p>
                                            <span className="text-green-600 font-medium">Inhale</span> through your nose for 4 seconds
                                        </p>
                                        <p>
                                            <span className="text-yellow-600 font-medium">Hold</span> your breath for 7 seconds
                                        </p>
                                        <p>
                                            <span className="text-blue-600 font-medium">Exhale</span> through your mouth for 8 seconds
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Cognitive Distortion Identifier */}
                    <TabsContent value="distortion" className="mt-0">
                        <Card className="max-w-3xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <Lightbulb className="h-6 w-6 mr-2 text-violet-600" />
                                    Cognitive Distortion Identifier
                                </CardTitle>
                                <CardDescription>Identify thinking patterns that might be unhelpful</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Write a thought you'd like to examine:
                                        </label>
                                        <Textarea
                                            placeholder="e.g., 'I always mess everything up' or 'Everyone thinks I'm weird'"
                                            value={userThought}
                                            onChange={(e) => setUserThought(e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <Button
                                        onClick={identifyDistortion}
                                        disabled={!userThought.trim()}
                                        className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                    >
                                        Analyze Thought
                                    </Button>

                                    {showDistortionHelp && (
                                        <div className="p-4 bg-violet-50 rounded">
                                            <h4 className="font-semibold text-violet-800 mb-2">Possible Distortion: {selectedDistortion}</h4>
                                            {selectedDistortion !== "No specific distortion detected" && (
                                                <div className="space-y-2">
                                                    <p className="text-violet-700 text-sm">
                                                        {cognitiveDistortions.find((d) => d.name === selectedDistortion)?.description}
                                                    </p>
                                                    <p className="text-violet-600 text-sm font-medium">
                                                        Challenge: {cognitiveDistortions.find((d) => d.name === selectedDistortion)?.reframe}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {cognitiveDistortions.map((distortion) => (
                                            <div key={distortion.name} className="p-4 border border-violet-200 rounded">
                                                <h5 className="font-medium text-violet-800 mb-2">{distortion.name}</h5>
                                                <p className="text-sm text-gray-600">{distortion.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Behavioral Activation Planner */}
                    <TabsContent value="activities" className="mt-0">
                        <Card className="max-w-3xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <CheckCircle className="h-6 w-6 mr-2 text-violet-600" />
                                    Behavioral Activation Planner
                                </CardTitle>
                                <CardDescription>Plan small, manageable activities to boost your mood</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Add a new activity (e.g., take a 10-minute walk)"
                                            value={newActivity}
                                            onChange={(e) => setNewActivity(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && addActivity()}
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={addActivity}
                                            disabled={!newActivity.trim()}
                                            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {activities.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                                <p>No activities yet. Add some small, achievable goals!</p>
                                            </div>
                                        ) : (
                                            activities.map((activity) => (
                                                <div
                                                    key={activity.id}
                                                    className={`flex items-center space-x-3 p-3 rounded border ${activity.completed ? "bg-green-50 border-green-200" : "bg-white border-violet-200"
                                                        }`}
                                                >
                                                    <Checkbox checked={activity.completed} onCheckedChange={() => toggleActivity(activity.id)} />
                                                    <span
                                                        className={`flex-1 ${activity.completed ? "line-through text-green-700" : "text-gray-800"}`}
                                                    >
                                                        {activity.name}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteActivity(activity.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {activities.length > 0 && (
                                        <div className="p-4 bg-violet-50 rounded">
                                            <div className="flex items-center justify-between">
                                                <span className="text-violet-800 font-medium">
                                                    Progress: {activities.filter((a) => a.completed).length} / {activities.length}
                                                </span>
                                                <Badge variant="secondary" className="bg-violet-200 text-violet-800">
                                                    {Math.round((activities.filter((a) => a.completed).length / activities.length) * 100)}%
                                                </Badge>
                                            </div>
                                            <Progress
                                                value={(activities.filter((a) => a.completed).length / activities.length) * 100}
                                                className="mt-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Thought Challenge Quiz */}
                    <TabsContent value="quiz" className="mt-0">
                        <Card className="max-w-3xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <BookOpen className="h-6 w-6 mr-2 text-violet-600" />
                                    Thought Challenge Mini-Quiz
                                </CardTitle>
                                <CardDescription>Practice identifying helpful ways to challenge negative thoughts</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {!quizCompleted ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <Badge variant="outline" className="border-violet-200 text-violet-700">
                                                Question {currentQuestion + 1} of {quizQuestions.length}
                                            </Badge>
                                            <Badge variant="outline" className="border-violet-200 text-violet-700">
                                                Score: {score}
                                            </Badge>
                                        </div>

                                        <div className="p-4 bg-violet-50 rounded">
                                            <h4 className="font-medium text-violet-800 mb-2">Negative Thought:</h4>
                                            <p className="text-gray-700 italic">"{quizQuestions[currentQuestion].thought}"</p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-800 mb-4">Which response best challenges this thought?</h4>
                                            <div className="space-y-3">
                                                {quizQuestions[currentQuestion].options.map((option, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleAnswerSelect(index)}
                                                        disabled={showExplanation}
                                                        className={`w-full p-3 text-left rounded border transition-colors ${showExplanation
                                                            ? index === quizQuestions[currentQuestion].correct
                                                                ? "bg-green-50 border-green-200 text-green-800"
                                                                : index === selectedAnswer
                                                                    ? "bg-red-50 border-red-200 text-red-800"
                                                                    : "bg-gray-50 border-gray-200 text-gray-600"
                                                            : "bg-white border-violet-200 hover:bg-violet-50 text-gray-800"
                                                            }`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {showExplanation && (
                                            <div className="p-4 bg-blue-50 rounded">
                                                <h5 className="font-medium text-blue-800 mb-2">Explanation:</h5>
                                                <p className="text-blue-700 text-sm">{quizQuestions[currentQuestion].explanation}</p>
                                                <Button
                                                    onClick={nextQuestion}
                                                    className="mt-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                                >
                                                    {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center space-y-6">
                                        <Award className="h-16 w-16 mx-auto text-violet-600" />
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
                                            <p className="text-xl text-violet-600 mb-4">
                                                You scored {score} out of {quizQuestions.length}
                                            </p>
                                            <p className="text-gray-600">
                                                {score === quizQuestions.length
                                                    ? "Perfect! You have a great understanding of challenging negative thoughts."
                                                    : score >= quizQuestions.length / 2
                                                        ? "Good job! You're developing skills in cognitive restructuring."
                                                        : "Keep practicing! These skills take time to develop."}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={resetQuiz}
                                            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Floating Chatbot Button */}
            <Link href="/chatbot">
                <Button
                    size="lg"
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50"
                    aria-label="Open Chatbot"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
            </Link>

            {/* Floating Animation */}
            <div className="fixed top-1/4 left-8 opacity-20 pointer-events-none">
                <div className="animate-bounce">
                    <Brain className="h-8 w-8 text-violet-400" />
                </div>
            </div>
            <div className="fixed top-1/3 right-12 opacity-20 pointer-events-none">
                <div className="animate-pulse">
                    <Dumbbell className="h-6 w-6 text-purple-400" />
                </div>
            </div>
            <div className="fixed bottom-1/4 left-12 opacity-20 pointer-events-none">
                <div className="animate-spin" style={{ animationDuration: "8s" }}>
                    <Sparkles className="h-6 w-6 text-violet-400" />
                </div>
            </div>
        </div>
    )
}