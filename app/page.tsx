"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
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
  LogOut,
} from "lucide-react"

interface UserData {
  username: string
  firstName: string
  lastName: string
  isAuthenticated: boolean
  loginTime: string
}

export default function HomePage() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const router = useRouter()

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

  // Vérifier l'authentification au chargement
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

  // Fonction de déconnexion
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('currentUser')
    }
    setCurrentUser(null)
    router.push('/')
  }

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

              {/* Affichage conditionnel selon l'authentification */}
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-green-700 font-medium">
                    Hi, {currentUser.firstName || currentUser.username}! 👋
                  </span>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/authentification/login">
                    <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/authentification/sign_up">
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
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
        {/* Hero Section - Personnalisé selon l'authentification */}
        <div className="text-center mb-20">
          {currentUser ? (
            <>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {currentUser.firstName || currentUser.username}!
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Ready to continue your mental wellness journey? Explore our services and tools designed to support your growth and healing.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to MindBloom
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                A virtual support platform for patients suffering from depression or anxiety, with chatbots using cognitive
                behavioral therapy techniques. Your journey to mental wellness starts here, with compassionate support
                available 24/7.
              </p>
              {/* Animated Robot Button - Affiché seulement si non connecté */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/authentification/sign_up">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <Bot className="h-6 w-6 mr-3 animate-bounce group-hover:animate-pulse" />
                    <span className="text-lg font-semibold">Start Your Journey</span>
                  </Button>
                </Link>
                <Link href="/authentification/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-lg font-semibold">I Already Have an Account</span>
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Platform Information */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-20 shadow-lg border border-white/20">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Mental Health Matters</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                MindBloom combines evidence-based cognitive behavioral therapy techniques with modern technology to
                provide accessible mental health support. Our platform offers a safe, judgment-free space where you can
                explore your thoughts, track your progress, and engage with exercises designed to help you heal and
                thrive.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Personalized mood tracking and journaling tools</li>
                <li>Access to calming music and relaxation techniques</li>
                <li>Interactive CBT-based exercises and insights</li>
                <li>24/7 chatbot support tailored to your needs</li>
                <li>Secure and confidential environment</li>
              </ul>
            </div>
            <div className="flex justify-center md:justify-end">
              <img
                src="/assets/mental-health-illustration.png"
                alt="Mental Health Illustration"
                className="w-64 h-auto rounded-xl shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section>
          <h3 className="text-4xl font-bold mb-12 text-center text-gray-800">
            {currentUser ? 'Continue Your Journey' : 'Explore Our Services'}
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm overflow-hidden"
              >
                <CardHeader className={`bg-gradient-to-br ${service.color} pb-6`}>
                  <div
                    className={`${service.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
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
                      {currentUser ? 'Continue' : 'Explore'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-50 border-t border-green-100 py-10">
        <div className="container mx-auto px-4 text-center text-green-600">
          &copy; {new Date().getFullYear()} MindBloom. All rights reserved.
        </div>
      </footer>
    </div>
  )
}