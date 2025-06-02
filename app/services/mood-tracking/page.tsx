"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format, subDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MessageCircle,
  Quote,
  Sparkles,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Heart,
  Smile,
  Frown,
  Meh,
  Zap,
  CloudRain,
  Sun,
  Moon,
  Activity,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Brain,
} from "lucide-react"

// Mock data for mood tracking
const moodOptions = [
  { id: "ecstatic", name: "Ecstatic", icon: <Sun className="h-6 w-6" />, color: "bg-yellow-400", value: 5 },
  { id: "happy", name: "Happy", icon: <Smile className="h-6 w-6" />, color: "bg-green-400", value: 4 },
  { id: "content", name: "Content", icon: <Meh className="h-6 w-6" />, color: "bg-blue-400", value: 3 },
  { id: "sad", name: "Sad", icon: <Frown className="h-6 w-6" />, color: "bg-indigo-400", value: 2 },
  { id: "depressed", name: "Depressed", icon: <CloudRain className="h-6 w-6" />, color: "bg-gray-400", value: 1 },
  { id: "anxious", name: "Anxious", icon: <AlertCircle className="h-6 w-6" />, color: "bg-orange-400", value: 2 },
  { id: "energetic", name: "Energetic", icon: <Zap className="h-6 w-6" />, color: "bg-purple-400", value: 4 },
  { id: "calm", name: "Calm", icon: <Moon className="h-6 w-6" />, color: "bg-teal-400", value: 3 },
]

const mockWeeklyData = [
  { date: subDays(new Date(), 6), mood: "happy", value: 4, notes: "Great day at work!" },
  { date: subDays(new Date(), 5), mood: "content", value: 3, notes: "Peaceful evening" },
  { date: subDays(new Date(), 4), mood: "anxious", value: 2, notes: "Stressful meeting" },
  { date: subDays(new Date(), 3), mood: "sad", value: 2, notes: "Feeling down" },
  { date: subDays(new Date(), 2), mood: "energetic", value: 4, notes: "Good workout!" },
  { date: subDays(new Date(), 1), mood: "happy", value: 4, notes: "Fun with friends" },
  { date: new Date(), mood: "content", value: 3, notes: "Relaxing day" },
]

export default function MoodTrackingPage() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [todayMood, setTodayMood] = useState<string | null>("content")
  const [weeklyData, setWeeklyData] = useState(mockWeeklyData)

  const inspirationalQuotes = [
    "Your feelings are valid, and tracking them is a step toward understanding yourself.",
    "Every emotion tells a story. Listen to what yours are saying.",
    "Mood tracking isn't about judgment—it's about awareness and growth.",
    "Small daily improvements in mood awareness lead to big life changes.",
    "Understanding your emotional patterns is the first step to emotional wellness.",
    "Your mood today doesn't define you, but tracking it helps you grow.",
  ]

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId)
    setTodayMood(moodId)
    // In a real app, this would save to database
  }

  const getWeeklyAverage = () => {
    const total = weeklyData.reduce((sum, day) => sum + day.value, 0)
    return (total / weeklyData.length).toFixed(1)
  }

  const getMoodTrend = () => {
    const firstHalf = weeklyData.slice(0, 3).reduce((sum, day) => sum + day.value, 0) / 3
    const secondHalf = weeklyData.slice(4).reduce((sum, day) => sum + day.value, 0) / 3
    return secondHalf > firstHalf ? "improving" : secondHalf < firstHalf ? "declining" : "stable"
  }

  const getMostFrequentMood = () => {
    const moodCounts = weeklyData.reduce(
      (acc, day) => {
        acc[day.mood] = (acc[day.mood] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(moodCounts).reduce((a, b) => (moodCounts[a[0]] > moodCounts[b[0]] ? a : b))[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Name */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                MindBloom Mood Tracker
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/mood-tracking" className="text-pink-600 font-medium">
                Mood Tracking
              </Link>
              <Button variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                Log In
              </Button>
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
      <div className="bg-gradient-to-r from-pink-100 to-rose-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4">
            <Quote className="h-6 w-6 text-pink-600 flex-shrink-0" />
            <p className="text-center text-gray-700 font-medium text-lg max-w-2xl transition-all duration-500 ease-in-out">
              {inspirationalQuotes[currentQuote]}
            </p>
            <Quote className="h-6 w-6 text-pink-600 flex-shrink-0 rotate-180" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
            Track Your Mood Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Understanding your emotions is the first step toward better mental health. Track your daily moods and
            discover patterns that help you thrive.
          </p>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="today" className="text-lg py-3">
              <Calendar className="h-5 w-5 mr-2" />
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="text-lg py-3">
              <BarChart3 className="h-5 w-5 mr-2" />
              This Week
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-lg py-3">
              <Brain className="h-5 w-5 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Today Tab */}
          <TabsContent value="today" className="mt-0">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Mood Selection */}
              <Card className="md:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-pink-600" />
                      <span className="text-gray-700 font-medium">{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    <Activity className="h-5 w-5 text-rose-500" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">How are you feeling today?</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => handleMoodSelect(mood.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${todayMood === mood.id
                            ? "border-pink-500 bg-pink-50 shadow-lg"
                            : "border-gray-200 hover:border-pink-300 bg-white"
                          }`}
                      >
                        <div
                          className={`w-12 h-12 ${mood.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white`}
                        >
                          {mood.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-700">{mood.name}</p>
                      </button>
                    ))}
                  </div>
                  {todayMood && (
                    <div className="mt-6 p-4 bg-pink-50 rounded-lg">
                      <p className="text-pink-800 font-medium">
                        You're feeling {moodOptions.find((m) => m.id === todayMood)?.name.toLowerCase()} today.
                        Remember, all emotions are valid and temporary.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-pink-50 to-rose-50 py-4">
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    disabled={!selectedMood}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Today's Mood
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 pb-4">
                    <CardTitle className="text-gray-800 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-pink-500" />
                      Weekly Average
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600 mb-2">{getWeeklyAverage()}/5</div>
                      <Progress value={Number.parseFloat(getWeeklyAverage()) * 20} className="mb-2" />
                      <p className="text-sm text-gray-600">Your mood this week</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 pb-4">
                    <CardTitle className="text-gray-800 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-pink-500" />
                      Mood Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600 mb-2">7</div>
                      <p className="text-sm text-gray-600">Days of tracking</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Week Tab */}
          <TabsContent value="week" className="mt-0">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Weekly Chart */}
              <Card className="md:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 pb-4">
                  <CardTitle className="text-xl text-gray-800">Your Week at a Glance</CardTitle>
                  <CardDescription>Mood patterns from the past 7 days</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {weeklyData.map((day, index) => {
                      const mood = moodOptions.find((m) => m.id === day.mood)
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-pink-50 transition-colors"
                        >
                          <div className="w-12 text-sm font-medium text-gray-600">{format(day.date, "EEE")}</div>
                          <div
                            className={`w-8 h-8 ${mood?.color} rounded-full flex items-center justify-center text-white flex-shrink-0`}
                          >
                            {mood?.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-800">{mood?.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {day.value}/5
                              </Badge>
                            </div>
                            {day.notes && <p className="text-sm text-gray-600 mt-1">{day.notes}</p>}
                          </div>
                          <div className="w-20">
                            <Progress value={day.value * 20} className="h-2" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Summary */}
              <div className="space-y-6">
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 pb-4">
                    <CardTitle className="text-gray-800 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-pink-500" />
                      Trend Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMoodTrend() === "improving"
                            ? "bg-green-100 text-green-800"
                            : getMoodTrend() === "declining"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {getMoodTrend() === "improving" ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : getMoodTrend() === "declining" ? (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        ) : (
                          <Activity className="h-4 w-4 mr-1" />
                        )}
                        {getMoodTrend().charAt(0).toUpperCase() + getMoodTrend().slice(1)}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Your mood trend this week</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 pb-4">
                    <CardTitle className="text-gray-800 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-pink-500" />
                      Most Common
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-lg font-medium text-pink-600 capitalize mb-2">{getMostFrequentMood()}</div>
                      <p className="text-sm text-gray-600">Your dominant mood this week</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-0">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 pb-4">
                  <CardTitle className="text-xl text-gray-800 flex items-center">
                    <Brain className="h-6 w-6 mr-2 text-pink-600" />
                    Mood Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <h4 className="font-semibold text-pink-800 mb-2">Pattern Recognition</h4>
                      <p className="text-pink-700 text-sm">
                        You tend to feel more energetic on weekends and experience lower moods mid-week. Consider
                        planning enjoyable activities for Wednesday and Thursday.
                      </p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-lg">
                      <h4 className="font-semibold text-rose-800 mb-2">Improvement Suggestion</h4>
                      <p className="text-rose-700 text-sm">
                        Your mood shows improvement when you track consistently. Keep up the daily check-ins to maintain
                        awareness of your emotional patterns.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Positive Trend</h4>
                      <p className="text-purple-700 text-sm">
                        Your overall mood has been stable this week with moments of happiness. This indicates good
                        emotional regulation skills.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 pb-4">
                  <CardTitle className="text-xl text-gray-800 flex items-center">
                    <Target className="h-6 w-6 mr-2 text-pink-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">Morning Routine</h4>
                        <p className="text-sm text-gray-600">
                          Start your day with 5 minutes of mindfulness to set a positive tone.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">Exercise</h4>
                        <p className="text-sm text-gray-600">
                          Regular physical activity can help stabilize mood and increase energy levels.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">Social Connection</h4>
                        <p className="text-sm text-gray-600">
                          Reach out to friends or family when you notice your mood declining.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">Sleep Hygiene</h4>
                        <p className="text-sm text-gray-600">
                          Maintain consistent sleep patterns to support emotional well-being.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Benefits of Mood Tracking */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Track Your Mood?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Regular mood tracking provides valuable insights into your emotional patterns and mental health
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-br from-pink-100 to-rose-100 pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">Increases Self-Awareness</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-gray-600">
                  Understanding your emotional patterns helps you recognize triggers and develop better coping
                  strategies for challenging situations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-br from-rose-100 to-pink-100 pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">Identifies Patterns</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-gray-600">
                  Track mood changes over time to identify patterns related to sleep, exercise, social interactions, and
                  life events.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-br from-purple-100 to-pink-100 pb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">Improves Treatment</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-gray-600">
                  Provide valuable data to healthcare providers to improve treatment plans and track progress in therapy
                  or medication.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating Chatbot Button */}
      <Link href="/chatbot">
        <Button
          size="lg"
          className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open Chatbot"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </Link>

      {/* Floating Animation */}
      <div className="fixed top-1/4 left-8 opacity-20 pointer-events-none">
        <div className="animate-bounce">
          <Heart className="h-8 w-8 text-pink-400" />
        </div>
      </div>
      <div className="fixed top-1/3 right-12 opacity-20 pointer-events-none">
        <div className="animate-pulse">
          <Activity className="h-6 w-6 text-rose-400" />
        </div>
      </div>
      <div className="fixed bottom-1/4 left-12 opacity-20 pointer-events-none">
        <div className="animate-spin" style={{ animationDuration: "8s" }}>
          <Sparkles className="h-6 w-6 text-pink-400" />
        </div>
      </div>
    </div>
  )
}
