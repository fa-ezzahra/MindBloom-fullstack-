"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageCircle,
  Music,
  BookOpen,
  Lightbulb,
  Dumbbell,
  Quote,
  Sparkles,
  Bot,
  TrendingUp,
  Brain,
  Users,
  Shield,
  Clock,
} from "lucide-react"

export default function HomePage() {
  const [currentQuote, setCurrentQuote] = useState(0)

  const inspirationalQuotes = [
    "Every day is a new beginning. Take a deep breath, smile, and start again.",
    "You are stronger than you think and more capable than you imagine.",
    "Healing is not linear, but every step forward counts.",
    "Your mental health is just as important as your physical health.",
    "Progress, not perfection, is what matters on your journey.",
    "You have survived 100% of your difficult days. You're doing great.",
  ]

  const services = [
    {
      title: "Calm Music",
      description: "Soothing sounds and melodies to help you relax, reduce anxiety, and find inner peace.",
      icon: <Music className="h-8 w-8" />,
      color: "from-emerald-100 to-teal-100",
      iconColor: "text-emerald-600",
      href: "/services/calm-music",
    },
    {
      title: "Journaling",
      description: "Express your thoughts and feelings in a safe, private space to process emotions.",
      icon: <BookOpen className="h-8 w-8" />,
      color: "from-blue-100 to-indigo-100",
      iconColor: "text-blue-600",
      href: "/services/journaling",
    },
    {
      title: "Mood Tracking",
      description: "Monitor your daily emotions and identify patterns to better understand your mental health journey.",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "from-rose-100 to-pink-100",
      iconColor: "text-rose-600",
      href: "/services/mood-tracking",
    },
    {
      title: "Insights",
      description: "Gain deeper understanding of your thought patterns and emotional triggers.",
      icon: <Lightbulb className="h-8 w-8" />,
      color: "from-amber-100 to-orange-100",
      iconColor: "text-amber-600",
      href: "/services/insights",
    },
    {
      title: "Exercises",
      description: "Practical CBT exercises and techniques to challenge negative thoughts.",
      icon: <Dumbbell className="h-8 w-8" />,
      color: "from-purple-100 to-pink-100",
      iconColor: "text-purple-600",
      href: "/services/exercises",
    },
  ]

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Name */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                MindBloom
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                About Us
              </Link>
              <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
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
      <div className="bg-gradient-to-r from-green-100 to-blue-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4">
            <Quote className="h-6 w-6 text-green-600 flex-shrink-0" />
            <p className="text-center text-gray-700 font-medium text-lg max-w-2xl transition-all duration-500 ease-in-out">
              {inspirationalQuotes[currentQuote]}
            </p>
            <Quote className="h-6 w-6 text-green-600 flex-shrink-0 rotate-180" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to MindBloom
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            A virtual support platform for patients suffering from depression or anxiety, with chatbots using cognitive
            behavioral therapy techniques. Your journey to mental wellness starts here, with compassionate support
            available 24/7.
          </p>
          {/* Animated Robot Button */}
          <Link href="/start-journey">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <Bot className="h-6 w-6 mr-3 animate-bounce group-hover:animate-pulse" />
              <span className="text-lg font-semibold">Start Your Journey</span>
            </Button>
          </Link>
        </div>

        {/* Platform Information */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-20 shadow-lg border border-white/20">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Mental Health Matters</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                MindBloom combines evidence-based cognitive behavioral therapy techniques with modern technology to
                provide accessible mental health support. Our platform offers a safe, judgment-free space where you can
                explore your thoughts, track your progress, and develop healthy coping strategies.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">24/7 AI-powered support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Evidence-based CBT techniques</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Private and secure environment</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-200 to-blue-200 rounded-2xl flex items-center justify-center max-w-xs mx-auto">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-green-600 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium text-sm">Your wellness journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our range of tools designed to support your mental wellness journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-20">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm overflow-hidden"
            >
              <CardHeader className={`bg-gradient-to-br ${service.color} pb-6`}>
                <div className={`${service.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <CardDescription className="text-gray-600 text-sm leading-relaxed mb-4">
                  {service.description}
                </CardDescription>
                <Link href={service.href}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                  >
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CBT Explanation Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-20 border border-indigo-100">
          <div className="text-center mb-12">
            <Brain className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Understanding Cognitive Behavioral Therapy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CBT is a proven therapeutic approach that helps you understand the connection between thoughts, feelings,
              and behaviors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Identify Thoughts</h3>
                <p className="text-gray-600">
                  Learn to recognize negative thought patterns and understand how they influence your emotions and
                  behaviors.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Challenge Beliefs</h3>
                <p className="text-gray-600">
                  Question and examine unhelpful thoughts, replacing them with more balanced and realistic perspectives.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Change Behaviors</h3>
                <p className="text-gray-600">
                  Develop new, healthier behavioral patterns that support your mental wellness and personal growth.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why CBT Works</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Evidence-Based</h4>
                    <p className="text-gray-600 text-sm">
                      Extensively researched and proven effective for anxiety and depression
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Time-Efficient</h4>
                    <p className="text-gray-600 text-sm">
                      Short-term therapy with long-lasting results and practical skills
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Collaborative</h4>
                    <p className="text-gray-600 text-sm">
                      You're an active participant in your healing and recovery process
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Empowering</h4>
                    <p className="text-gray-600 text-sm">Provides tools and strategies you can use independently</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chatbot Button */}
      <Link href="/chatbot">
        <Button
          size="lg"
          className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open Chatbot"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </Link>

      {/* Floating Animation */}
      <div className="fixed top-1/4 left-8 opacity-20 pointer-events-none">
        <div className="animate-bounce">
          <Sparkles className="h-8 w-8 text-green-400" />
        </div>
      </div>
      <div className="fixed top-1/3 right-12 opacity-20 pointer-events-none">
        <div className="animate-pulse">
          <Brain className="h-6 w-6 text-pink-400" />
        </div>
      </div>
      <div className="fixed bottom-1/4 left-12 opacity-20 pointer-events-none">
        <div className="animate-spin" style={{ animationDuration: "8s" }}>
          <Bot className="h-6 w-6 text-blue-400" />
        </div>
      </div>
    </div>
  )
}
