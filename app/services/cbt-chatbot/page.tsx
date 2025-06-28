"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Bot,
    User,
    Send,
    Brain,
    Sparkles,
    ArrowLeft,
    MessageCircle,
    Clock,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    LogOut,
} from "lucide-react"

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    loading?: boolean
}

interface UserData {
    username: string
    firstName: string
    lastName: string
    isAuthenticated: boolean
    loginTime: string
}

interface SessionInfo {
    active: boolean
    user_name?: string
    duration?: string
    message_count?: number
    session_id?: string
    error?: string
}

interface ChatResponse {
    success: boolean
    response?: string
    error?: string
    message_count?: number
    timeout?: boolean
}

export default function CBTChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionInfo, setSessionInfo] = useState<SessionInfo>({ active: false })
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<UserData | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Backend API base URL - adjust this to match your Flask server
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    // Check authentication on mount
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
                    router.push('/authentification/login')
                }
            } else {
                router.push('/authentification/login')
            }
        }
    }, [router])

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Initialize session when component mounts
    useEffect(() => {
        if (currentUser) {
            initializeSession()
        }
    }, [currentUser])

    // FIXED: Send both display name and actual username
    const initializeSession = async () => {
        try {
            setConnectionError(null)
            const response = await fetch(`${API_BASE_URL}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: currentUser?.firstName || currentUser?.username || 'User',
                    username: currentUser?.username // FIXED: Add the actual username for database storage
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                // Add welcome message
                const welcomeMessage: Message = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `Hello ${currentUser?.firstName || currentUser?.username}! 👋 I'm your CBT (Cognitive Behavioral Therapy) assistant. I'm here to help you explore your thoughts and feelings using evidence-based techniques. How are you feeling today?`,
                    timestamp: new Date().toISOString()
                }
                setMessages([welcomeMessage])

                // Get session info
                await fetchSessionInfo()
            } else {
                setConnectionError(data.error || 'Failed to start session')
            }
        } catch (error) {
            console.error('Failed to initialize session:', error)
            setConnectionError('Unable to connect to the CBT service. Please check your connection and try again.')
        }
    }

    const fetchSessionInfo = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/info`)
            if (response.ok) {
                const data: SessionInfo = await response.json()
                setSessionInfo(data)
            }
        } catch (error) {
            console.error('Failed to fetch session info:', error)
        }
    }

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date().toISOString()
        }

        const loadingMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            loading: true
        }

        setMessages(prev => [...prev, userMessage, loadingMessage])
        setInputMessage("")
        setIsLoading(true)
        setConnectionError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: content.trim() }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: ChatResponse = await response.json()

            // Remove loading message
            setMessages(prev => prev.filter(msg => !msg.loading))

            if (data.success && data.response) {
                const assistantMessage: Message = {
                    id: (Date.now() + 2).toString(),
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date().toISOString()
                }
                setMessages(prev => [...prev, assistantMessage])

                // Update session info
                await fetchSessionInfo()
            } else if (data.timeout) {
                // Handle session timeout
                const timeoutMessage: Message = {
                    id: (Date.now() + 2).toString(),
                    role: 'assistant',
                    content: data.response || "Your session has timed out. Please send your message again to start a new session.",
                    timestamp: new Date().toISOString()
                }
                setMessages(prev => [...prev, timeoutMessage])
            } else {
                throw new Error(data.error || 'Unknown error occurred')
            }
        } catch (error) {
            console.error('Failed to send message:', error)

            // Remove loading message
            setMessages(prev => prev.filter(msg => !msg.loading))

            const errorMessage: Message = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: "I'm sorry, I'm having trouble responding right now. Please check your connection and try again. If the problem persists, you can refresh the page to start a new session.",
                timestamp: new Date().toISOString()
            }
            setMessages(prev => [...prev, errorMessage])
            setConnectionError('Connection issue - please try again')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage(inputMessage)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(inputMessage)
        }
    }

    const restartSession = async () => {
        setMessages([])
        setConnectionError(null)
        await initializeSession()
    }

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('currentUser')
        }
        setCurrentUser(null)
        router.push('/')
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo and Name */}
                        <div className="flex items-center space-x-3">
                            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <Brain className="h-6 w-6 text-white" />
                                    </div>
                                    <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    MindBloom
                                </span>
                            </Link>
                        </div>

                        {/* User Info and Session Status */}
                        <div className="flex items-center space-x-4">
                            {sessionInfo.active && (
                                <div className="hidden md:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-700">
                                        {sessionInfo.message_count || 0} messages • {sessionInfo.duration || '0:00'}
                                    </span>
                                </div>
                            )}

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
                    </div>
                </div>
            </nav>

            {/* Main Chat Interface */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 border-b border-green-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <Bot className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">CBT Assistant</h1>
                                    <p className="text-sm text-gray-600">
                                        Cognitive Behavioral Therapy Support •
                                        {sessionInfo.active ? (
                                            <span className="text-green-600 ml-1">Online</span>
                                        ) : (
                                            <span className="text-gray-500 ml-1">Connecting...</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {connectionError && (
                                <Button
                                    onClick={restartSession}
                                    variant="outline"
                                    size="sm"
                                    className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Restart
                                </Button>
                            )}
                        </div>

                        {connectionError && (
                            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                                <p className="text-sm text-orange-700">{connectionError}</p>
                            </div>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="h-96 md:h-[500px] overflow-y-auto p-6 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <div className="flex items-start space-x-2">
                                        {message.role === 'assistant' && (
                                            <Bot className={`h-5 w-5 flex-shrink-0 mt-0.5 ${message.loading ? 'animate-pulse' : ''}`} />
                                        )}
                                        {message.role === 'user' && (
                                            <User className="h-5 w-5 flex-shrink-0 mt-0.5 text-white" />
                                        )}
                                        <div className="flex-1">
                                            {message.loading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    </div>
                                                    <span className="text-sm text-gray-500">Thinking...</span>
                                                </div>
                                            ) : (
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                    {message.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-green-100 p-6">
                        <form onSubmit={handleSubmit} className="flex space-x-3">
                            <div className="flex-1">
                                <Input
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message here... (Press Enter to send)"
                                    disabled={isLoading}
                                    className="w-full border-green-200 focus:border-green-400 focus:ring-green-400"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading || !inputMessage.trim()}
                                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6"
                            >
                                {isLoading ? (
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </form>

                        <p className="text-xs text-gray-500 mt-2 text-center">
                            This CBT assistant provides support and guidance. For emergencies, please contact professional help immediately.
                        </p>
                    </div>
                </div>

                {/* Info Card */}
                <Card className="mt-6 bg-white/70 backdrop-blur-sm border-0">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                            How CBT Assistant Works
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-start space-x-2">
                                <Brain className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p>Uses evidence-based CBT techniques to help you understand thought patterns</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                <p>Provides personalized exercises and coping strategies for your situation</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Clock className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <p>Available 24/7 for support whenever you need guidance or someone to talk to</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}