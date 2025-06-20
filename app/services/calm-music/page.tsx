"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Music, Quote, Heart, Sparkles, Bot, Play, Pause, Volume2, VolumeX } from "lucide-react"

// Define UserData interface to match JournalingPage
interface UserData {
  username: string
  firstName: string
  lastName: string
  isAuthenticated: boolean
  loginTime: string
}

export default function MusicPage() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  const inspirationalQuotes = [
    "Let the music heal your soul and bring peace to your mind.",
    "In every note, find a moment of tranquility and hope.",
    "Music is the universal language of comfort and healing.",
    "Allow these sounds to guide you to a place of inner calm.",
    "Each melody is a step towards emotional balance and well-being.",
    "Find your rhythm, find your peace, find your strength.",
  ]

  const musicCards = [
    {
      title: "Calm Sonata",
      description: "Classical piano sonatas designed to reduce stress and promote deep relaxation.",
      icon: <Music className="h-8 w-8" />,
      color: "from-emerald-100 to-teal-100",
      iconColor: "text-emerald-600",
      audioUrl: "/placeholder-audio.mp3",
      duration: "15 min",
      type: "Classical Piano",
    },
    {
      title: "White Noise",
      description: "Pure white noise to mask distractions and create a peaceful environment.",
      icon: <Volume2 className="h-8 w-8" />,
      color: "from-blue-100 to-indigo-100",
      iconColor: "text-blue-600",
      audioUrl: "/placeholder-audio.mp3",
      duration: "30 min",
      type: "Ambient Sound",
    },
    {
      title: "Soothing Sounds",
      description: "Nature sounds including rain, ocean waves, and gentle forest ambience.",
      icon: <Sparkles className="h-8 w-8" />,
      color: "from-rose-100 to-pink-100",
      iconColor: "text-rose-600",
      audioUrl: "/placeholder-audio.mp3",
      duration: "20 min",
      type: "Nature Sounds",
    },
    {
      title: "Classical Music",
      description: "Carefully curated classical compositions known for their calming properties.",
      icon: <Music className="h-8 w-8" />,
      color: "from-amber-100 to-orange-100",
      iconColor: "text-amber-600",
      audioUrl: "/placeholder-audio.mp3",
      duration: "45 min",
      type: "Classical Orchestra",
    },
    {
      title: "Meditation Bells",
      description: "Tibetan singing bowls and meditation bells for mindfulness practice.",
      icon: <Heart className="h-8 w-8" />,
      color: "from-purple-100 to-pink-100",
      iconColor: "text-purple-600",
      audioUrl: "/placeholder-audio.mp3",
      duration: "25 min",
      type: "Meditation",
    },
    {
      title: "Binaural Beats",
      description: "Scientifically designed frequencies to promote relaxation and focus.",
      icon: <Bot className="h-8 w-8" />,
      color: "from-cyan-100 to-blue-100",
      iconColor: "text-cyan-600",
      audioUrl: "/placeholder-audio.mp3",
      duration: "60 min",
      type: "Therapeutic Audio",
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

  // Initialize audio elements
  useEffect(() => {
    musicCards.forEach((card) => {
      if (!audioRefs.current[card.title]) {
        const audio = new Audio()
        audio.loop = true
        audio.volume = isMuted ? 0 : 0.5
        audioRefs.current[card.title] = audio
      }
    })
  }, [])

  const handlePlayPause = (cardTitle: string, audioUrl: string) => {
    const audio = audioRefs.current[cardTitle]

    if (currentlyPlaying === cardTitle) {
      audio.pause()
      setCurrentlyPlaying(null)
    } else {
      if (currentlyPlaying) {
        audioRefs.current[currentlyPlaying].pause()
      }
      audio.src = audioUrl
      audio.play().catch(console.error)
      setCurrentlyPlaying(cardTitle)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = isMuted ? 0.5 : 0
    })
  }

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser')
    setCurrentUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                MindBloom Calm Music
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/music" className="text-green-600 font-medium">
                Music Therapy
              </Link>
              <Button
                variant="outline"
                onClick={toggleMute}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              {currentUser ? (
                <>
                  <span className="text-green-700 font-medium">
                    Hi, {currentUser.firstName || currentUser.username}! 👋
                  </span>
                  <Button
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  Log In
                </Button>
              )}
            </div>
            <Button variant="ghost" className="md:hidden">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-green-100 to-emerald-100 py-6">
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

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Music Therapy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover the healing power of music. Our carefully curated collection of calming sounds, classical music,
            and therapeutic audio is designed to reduce anxiety, promote relaxation, and support your mental wellness
            journey.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Now Playing: {currentlyPlaying || "None"}</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Sound</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Click on any card to start playing therapeutic music designed for relaxation and healing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {musicCards.map((card, index) => (
            <Card
              key={index}
              className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm overflow-hidden cursor-pointer ${currentlyPlaying === card.title ? "ring-2 ring-green-500 shadow-lg" : ""
                }`}
              onClick={() => handlePlayPause(card.title, card.audioUrl)}
            >
              <CardHeader className={`bg-gradient-to-br ${card.color} pb-6 relative`}>
                <div className={`${card.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">{card.title}</CardTitle>
                <div className="absolute top-4 right-4">
                  {currentlyPlaying === card.title ? (
                    <Pause className="h-6 w-6 text-green-600" />
                  ) : (
                    <Play className="h-6 w-6 text-gray-400 group-hover:text-green-600 transition-colors" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardDescription className="text-gray-600 text-sm leading-relaxed mb-4">
                  {card.description}
                </CardDescription>
                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">{card.type}</span>
                  <span>{card.duration}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full transition-all duration-300 ${currentlyPlaying === card.title
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent"
                    : "group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-500 group-hover:text-white group-hover:border-transparent"
                    }`}
                >
                  {currentlyPlaying === card.title ? "Now Playing" : "Play"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-20 border border-indigo-100">
          <div className="text-center mb-12">
            <Music className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">The Science of Music Therapy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Research shows that music therapy can significantly reduce anxiety, depression, and stress while promoting
              emotional well-being
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Reduces Stress</h3>
                <p className="text-gray-600">
                  Listening to calming music lowers cortisol levels and activates the body's relaxation response.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Improves Mood</h3>
                <p className="text-gray-600">
                  Music stimulates the release of dopamine and endorphins, natural mood elevators in the brain.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Enhances Focus</h3>
                <p className="text-gray-600">
                  Certain frequencies and rhythms can improve concentration and cognitive performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Link href="/chatbot">
        <Button
          size="lg"
          className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open Chatbot"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </Link>

      <div className="fixed top-1/4 left-8 opacity-20 pointer-events-none">
        <div className="animate-bounce">
          <Music className="h-8 w-8 text-green-400" />
        </div>
      </div>
      <div className="fixed top-1/3 right-12 opacity-20 pointer-events-none">
        <div className="animate-pulse">
          <Heart className="h-6 w-6 text-pink-400" />
        </div>
      </div>
      <div className="fixed bottom-1/4 left-12 opacity-20 pointer-events-none">
        <div className="animate-spin" style={{ animationDuration: "8s" }}>
          <Volume2 className="h-6 w-6 text-green-400" />
        </div>
      </div>
    </div>
  )
}