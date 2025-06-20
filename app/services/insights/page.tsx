"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    MessageCircle,
    Quote,
    Sparkles,
    Brain,
    Lightbulb,
    BookOpen,
    Users,
    Target,
    TrendingUp,
    CheckCircle,
    FileText,
    GraduationCap,
    Stethoscope,
    ClipboardList,
    BarChart3,
    Zap,
    Shield,
    Clock,
    Download,
    Star,
} from "lucide-react"

// Define UserData interface to match JournalingPage
interface UserData {
    username: string
    firstName: string
    lastName: string
    isAuthenticated: boolean
    loginTime: string
}

export default function InsightsPage() {
    const [currentQuote, setCurrentQuote] = useState(0)
    const [currentUser, setCurrentUser] = useState<UserData | null>(null)

    const inspirationalQuotes = [
        "CBT empowers both therapist and client to work collaboratively toward meaningful change.",
        "Understanding thought patterns is the foundation of effective cognitive behavioral therapy.",
        "Evidence-based practice in CBT creates lasting transformation for clients.",
        "Professional mastery of CBT techniques requires continuous learning and adaptation.",
        "The therapeutic relationship in CBT is built on trust, collaboration, and shared goals.",
        "CBT's structured approach provides clear pathways to client empowerment and healing.",
    ]

    const cbtTechniques = [
        {
            name: "Cognitive Restructuring",
            description: "Identifying and challenging negative thought patterns",
            applications: ["Depression", "Anxiety", "PTSD"],
            difficulty: "Intermediate",
            duration: "4-8 sessions",
        },
        {
            name: "Behavioral Activation",
            description: "Increasing engagement in meaningful activities",
            applications: ["Depression", "Behavioral Issues"],
            difficulty: "Beginner",
            duration: "6-12 sessions",
        },
        {
            name: "Exposure Therapy",
            description: "Gradual exposure to feared situations or objects",
            applications: ["Phobias", "PTSD", "OCD"],
            difficulty: "Advanced",
            duration: "8-16 sessions",
        },
        {
            name: "Thought Records",
            description: "Systematic documentation of thoughts and emotions",
            applications: ["Anxiety", "Depression", "Anger"],
            difficulty: "Beginner",
            duration: "2-4 sessions",
        },
        {
            name: "Mindfulness Integration",
            description: "Incorporating mindfulness practices into CBT framework",
            applications: ["Anxiety", "Depression", "Stress"],
            difficulty: "Intermediate",
            duration: "6-10 sessions",
        },
        {
            name: "Relapse Prevention",
            description: "Developing strategies to maintain therapeutic gains",
            applications: ["All conditions", "Maintenance"],
            difficulty: "Advanced",
            duration: "2-6 sessions",
        },
    ]

    const researchFindings = [
        {
            title: "Efficacy in Depression Treatment",
            finding: "CBT shows 60-80% response rates in treating major depressive disorder",
            source: "American Journal of Psychiatry, 2023",
            impact: "High",
        },
        {
            title: "Anxiety Disorder Outcomes",
            finding: "CBT demonstrates superior long-term outcomes compared to medication alone",
            source: "Journal of Clinical Psychology, 2023",
            impact: "High",
        },
        {
            title: "PTSD Treatment Effectiveness",
            finding: "Trauma-focused CBT reduces PTSD symptoms by 70% in 12-16 sessions",
            source: "Clinical Psychology Review, 2022",
            impact: "Very High",
        },
        {
            title: "Digital CBT Platforms",
            finding: "Online CBT interventions show 85% of face-to-face therapy effectiveness",
            source: "Behavior Research and Therapy, 2023",
            impact: "Medium",
        },
    ]

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

    // Rotate quotes every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleLogout = () => {
        sessionStorage.removeItem('currentUser')
        setCurrentUser(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-yellow-100 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo and Name */}
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                                    <Lightbulb className="h-6 w-6 text-white" />
                                </div>
                                <Sparkles className="h-4 w-4 text-orange-400 absolute -top-1 -right-1" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                                MindBloom Insights
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors font-medium">
                                Home
                            </Link>
                            <Link href="/insights" className="text-yellow-600 font-medium">
                                Professional Insights
                            </Link>
                            {currentUser ? (
                                <>
                                    <span className="text-yellow-700 font-medium">
                                        Hi, {currentUser.firstName || currentUser.username}! 👋
                                    </span>
                                    <Button
                                        variant="outline"
                                        className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline" className="border-yellow-200 text-yellow-700 hover:bg-yellow-50">
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
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center space-x-4">
                        <Quote className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                        <p className="text-center text-gray-700 font-medium text-lg max-w-2xl transition-all duration-500 ease-in-out">
                            {inspirationalQuotes[currentQuote]}
                        </p>
                        <Quote className="h-6 w-6 text-yellow-600 flex-shrink-0 rotate-180" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                        Professional CBT Insights
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Comprehensive cognitive behavioral therapy resources, techniques, and evidence-based practices for mental
                        health professionals seeking to enhance their therapeutic effectiveness.
                    </p>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
                        <TabsTrigger value="overview" className="text-sm py-3">
                            <Brain className="h-4 w-4 mr-1" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="techniques" className="text-sm py-3">
                            <Target className="h-4 w-4 mr-1" />
                            Techniques
                        </TabsTrigger>
                        <TabsTrigger value="research" className="text-sm py-3">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Research
                        </TabsTrigger>
                        <TabsTrigger value="resources" className="text-sm py-3">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Resources
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-0">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                    <CardTitle className="text-xl text-gray-800 flex items-center">
                                        <Brain className="h-6 w-6 mr-2 text-yellow-600" />
                                        CBT Fundamentals
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Core Principles</h4>
                                            <ul className="space-y-2 text-gray-600 text-sm">
                                                <li className="flex items-start space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span>Thoughts, feelings, and behaviors are interconnected</span>
                                                </li>
                                                <li className="flex items-start space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span>Present-focused and problem-solving oriented</span>
                                                </li>
                                                <li className="flex items-start space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span>Collaborative therapeutic relationship</span>
                                                </li>
                                                <li className="flex items-start space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span>Structured and goal-oriented sessions</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Therapeutic Process</h4>
                                            <p className="text-gray-600 text-sm">
                                                CBT follows a systematic approach beginning with assessment and case formulation, followed by
                                                psychoeducation, skill development, and relapse prevention planning.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                    <CardTitle className="text-xl text-gray-800 flex items-center">
                                        <Stethoscope className="h-6 w-6 mr-2 text-yellow-600" />
                                        Clinical Applications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-yellow-50 rounded-lg">
                                                <h5 className="font-medium text-yellow-800 mb-1">Depression</h5>
                                                <p className="text-xs text-yellow-700">Cognitive restructuring, behavioral activation</p>
                                            </div>
                                            <div className="p-3 bg-amber-50 rounded-lg">
                                                <h5 className="font-medium text-amber-800 mb-1">Anxiety</h5>
                                                <p className="text-xs text-amber-700">Exposure therapy, relaxation training</p>
                                            </div>
                                            <div className="p-3 bg-orange-50 rounded-lg">
                                                <h5 className="font-medium text-orange-800 mb-1">PTSD</h5>
                                                <p className="text-xs text-orange-700">Trauma-focused CBT, EMDR integration</p>
                                            </div>
                                            <div className="p-3 bg-yellow-50 rounded-lg">
                                                <h5 className="font-medium text-yellow-800 mb-1">OCD</h5>
                                                <p className="text-xs text-yellow-700">Exposure and response prevention</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Treatment Duration</h4>
                                            <p className="text-gray-600 text-sm">
                                                Typical CBT treatment ranges from 12-20 sessions, with some conditions requiring longer-term
                                                intervention. Session frequency is usually weekly, transitioning to bi-weekly as progress is
                                                made.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CBT Model Explanation */}
                        <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <Target className="h-6 w-6 mr-2 text-yellow-600" />
                                    The CBT Triangle Model
                                </CardTitle>
                                <CardDescription>
                                    Understanding the interconnection of thoughts, feelings, and behaviors
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Brain className="h-10 w-10 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Thoughts (Cognitions)</h3>
                                        <p className="text-gray-600 text-sm">
                                            Automatic thoughts, beliefs, and cognitive patterns that influence emotional responses and
                                            behavioral choices.
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Zap className="h-10 w-10 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Feelings (Emotions)</h3>
                                        <p className="text-gray-600 text-sm">
                                            Emotional responses triggered by thoughts and situations, which in turn influence thinking
                                            patterns and behaviors.
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="h-10 w-10 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Behaviors (Actions)</h3>
                                        <p className="text-gray-600 text-sm">
                                            Observable actions and responses that are influenced by thoughts and emotions, creating feedback
                                            loops.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Techniques Tab */}
                    <TabsContent value="techniques" className="mt-0">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cbtTechniques.map((technique, index) => (
                                <Card key={index} className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg font-bold text-gray-800">{technique.name}</CardTitle>
                                            <Badge
                                                variant="outline"
                                                className={`${technique.difficulty === "Beginner"
                                                    ? "border-green-200 text-green-700"
                                                    : technique.difficulty === "Intermediate"
                                                        ? "border-yellow-200 text-yellow-700"
                                                        : "border-red-200 text-red-700"
                                                    }`}
                                            >
                                                {technique.difficulty}
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-gray-600">{technique.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <h5 className="font-medium text-gray-800 mb-1">Applications:</h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {technique.applications.map((app, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs">
                                                            {app}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {technique.duration}
                                                </span>
                                                <Button variant="outline" size="sm" className="text-xs">
                                                    Learn More
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Implementation Guidelines */}
                        <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <ClipboardList className="h-6 w-6 mr-2 text-yellow-600" />
                                    Implementation Best Practices
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Session Structure</h4>
                                        <ol className="space-y-2 text-gray-600 text-sm">
                                            <li className="flex items-start space-x-2">
                                                <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                    1
                                                </span>
                                                <span>Agenda setting and homework review (10 minutes)</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                    2
                                                </span>
                                                <span>Check-in and mood assessment (5 minutes)</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                    3
                                                </span>
                                                <span>Main therapeutic work (30-35 minutes)</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                    4
                                                </span>
                                                <span>Summary and homework assignment (10 minutes)</span>
                                            </li>
                                        </ol>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Key Considerations</h4>
                                        <ul className="space-y-2 text-gray-600 text-sm">
                                            <li className="flex items-start space-x-2">
                                                <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                <span>Maintain therapeutic alliance throughout treatment</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>Set specific, measurable, achievable goals</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                                <span>Monitor progress using validated assessment tools</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <Users className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                                <span>Adapt techniques to client's cultural background</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Research Tab */}
                    <TabsContent value="research" className="mt-0">
                        <div className="space-y-6">
                            {researchFindings.map((research, index) => (
                                <Card key={index} className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg font-bold text-gray-800">{research.title}</CardTitle>
                                            <Badge
                                                variant="outline"
                                                className={`${research.impact === "Very High"
                                                    ? "border-green-200 text-green-700 bg-green-50"
                                                    : research.impact === "High"
                                                        ? "border-blue-200 text-blue-700 bg-blue-50"
                                                        : "border-yellow-200 text-yellow-700 bg-yellow-50"
                                                    }`}
                                            >
                                                {research.impact} Impact
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <p className="text-gray-700 mb-3">{research.finding}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500 italic">{research.source}</span>
                                            <Button variant="outline" size="sm" className="text-xs">
                                                <FileText className="h-3 w-3 mr-1" />
                                                View Study
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Meta-Analysis Summary */}
                        <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <BarChart3 className="h-6 w-6 mr-2 text-yellow-600" />
                                    Meta-Analysis Summary
                                </CardTitle>
                                <CardDescription>Comprehensive review of CBT effectiveness across conditions</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-yellow-600 mb-2">78%</div>
                                        <p className="text-gray-600 text-sm">Average response rate across all anxiety disorders</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-amber-600 mb-2">65%</div>
                                        <p className="text-gray-600 text-sm">Remission rate for major depressive disorder</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
                                        <p className="text-gray-600 text-sm">Client satisfaction with CBT treatment</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources" className="mt-0">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                    <CardTitle className="text-xl text-gray-800 flex items-center">
                                        <GraduationCap className="h-6 w-6 mr-2 text-yellow-600" />
                                        Training & Certification
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="p-4 border border-yellow-200 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-2">Beck Institute Certification</h4>
                                            <p className="text-gray-600 text-sm mb-2">
                                                Comprehensive CBT training program with supervised practice and competency assessment.
                                            </p>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-3 w-3 mr-1" />
                                                Learn More
                                            </Button>
                                        </div>
                                        <div className="p-4 border border-amber-200 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-2">BABCP Accreditation</h4>
                                            <p className="text-gray-600 text-sm mb-2">
                                                British884 Association for Behavioural and Cognitive Psychotherapies certification pathway.
                                            </p>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-3 w-3 mr-1" />
                                                Learn More
                                            </Button>
                                        </div>
                                        <div className="p-4 border border-orange-200 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-2">Online Training Modules</h4>
                                            <p className="text-gray-600 text-sm mb-2">
                                                Self-paced learning modules covering specific CBT techniques and applications.
                                            </p>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-3 w-3 mr-1" />
                                                Access Modules
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                    <CardTitle className="text-xl text-gray-800 flex items-center">
                                        <BookOpen className="h-6 w-6 mr-2 text-yellow-600" />
                                        Essential Reading
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-medium text-gray-800">Cognitive Therapy of Depression</h5>
                                                <p className="text-sm text-gray-600">Beck, Rush, Shaw, & Emery</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-medium text-gray-800">Mind Over Mood</h5>
                                                <p className="text-sm text-gray-600">Greenberger & Padesky</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-medium text-gray-800">Cognitive Behavior Therapy: Basics and Beyond</h5>
                                                <p className="text-sm text-gray-600">Judith Beck</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-medium text-gray-800">The Anxiety and Worry Workbook</h5>
                                                <p className="text-sm text-gray-600">Clark & Beck</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Professional Organizations */}
                        <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 pb-4">
                                <CardTitle className="text-xl text-gray-800 flex items-center">
                                    <Users className="h-6 w-6 mr-2 text-yellow-600" />
                                    Professional Organizations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 border border-yellow-200 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">International Association for CBT</h4>
                                        <p className="text-gray-600 text-sm mb-3">Global network of CBT professionals and researchers</p>
                                        <Button variant="outline" size="sm">
                                            Visit Website
                                        </Button>
                                    </div>
                                    <div className="text-center p-4 border border-amber-200 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">Academy of CBT</h4>
                                        <p className="text-gray-600 text-sm mb-3">Professional development and certification body</p>
                                        <Button variant="outline" size="sm">
                                            Visit Website
                                        </Button>
                                    </div>
                                    <div className="text-center p-4 border border-orange-200 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">CBT Research Network</h4>
                                        <p className="text-gray-600 text-sm mb-3">Collaborative research and evidence sharing</p>
                                        <Button variant="outline" size="sm">
                                            Visit Website
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Floating Chatbot Button */}
            <Link href="/chatbot">
                <Button
                    size="lg"
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50"
                    aria-label="Open Chatbot"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
            </Link>

            {/* Floating Animation */}
            <div className="fixed top-1/4 left-8 opacity-20 pointer-events-none">
                <div className="animate-bounce">
                    <Lightbulb className="h-8 w-8 text-yellow-400" />
                </div>
            </div>
            <div className="fixed top-1/3 right-12 opacity-20 pointer-events-none">
                <div className="animate-pulse">
                    <Brain className="h-6 w-6 text-amber-400" />
                </div>
            </div>
            <div className="fixed bottom-1/4 left-12 opacity-20 pointer-events-none">
                <div className="animate-spin" style={{ animationDuration: "8s" }}>
                    <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
            </div>
        </div>
    )
}