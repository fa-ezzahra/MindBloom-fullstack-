"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    MessageCircle,
    BookOpen,
    Quote,
    Heart,
    Sparkles,
    Bot,
    Calendar,
    Save,
    Clock,
    Search,
    ChevronLeft,
    ChevronRight,
    Edit,
    Trash2,
    Filter,
    SunMoon,
    Brain,
    Lightbulb,
    Loader2,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { journalService, JournalEntry } from "@/lib/supabase"

// Define UserData interface
interface UserData {
    username: string
    firstName: string
    lastName: string
    isAuthenticated: boolean
    loginTime: string
}

export default function JournalingPage() {
    const { toast } = useToast()
    const [currentQuote, setCurrentQuote] = useState(0)
    const [journalContent, setJournalContent] = useState("")
    const [journalTitle, setJournalTitle] = useState("")
    const [journalMood, setJournalMood] = useState("reflective")
    const [journalTags, setJournalTags] = useState("")
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterMood, setFilterMood] = useState("")
    const [currentUser, setCurrentUser] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoadingEntries, setIsLoadingEntries] = useState(true)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const inspirationalQuotes = [
        "Writing is medicine. It helps to heal the hurt by articulating it.",
        "Your journal is a place to capture thoughts, not judge them.",
        "In the journal I am at ease, and can talk with myself without reserve.",
        "Journal writing is a voyage to the interior.",
        "What you write today is how you see the world tomorrow.",
        "Your journal is the story of your life, waiting to be told.",
    ]

    const moodOptions = ["happy", "calm", "anxious", "sad", "energetic", "reflective", "grateful"]

    // Check authentication and load entries
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('currentUser')
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser)
                    setCurrentUser(userData)
                    loadEntries(userData.username)
                } catch (error) {
                    console.error('Error parsing user data:', error)
                    sessionStorage.removeItem('currentUser')
                    toast({
                        title: "Authentication Error",
                        description: "Please log in again.",
                        variant: "destructive",
                    })
                }
            } else {
                setIsLoadingEntries(false)
                toast({
                    title: "Not Authenticated",
                    description: "Please log in to access your journal.",
                    variant: "destructive",
                })
            }
        }
    }, [])

    // Load journal entries for the current user
    const loadEntries = async (username: string) => {
        setIsLoadingEntries(true)
        try {
            const userEntries = await journalService.getEntries(username)
            setEntries(userEntries)
        } catch (error) {
            console.error('Error loading entries:', error)
            toast({
                title: "Error Loading Entries",
                description: "Failed to load your journal entries.",
                variant: "destructive",
            })
        } finally {
            setIsLoadingEntries(false)
        }
    }

    // Rotate quotes every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    // Focus textarea when in edit mode
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [])

    const handleSaveEntry = async () => {
        if (!journalContent.trim() || !currentUser) {
            toast({
                title: "Invalid Entry",
                description: "Please write something before saving.",
                variant: "destructive",
            })
            return
        }

        setIsSaving(true)
        try {
            const tagsArray = journalTags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)

            const newEntry = await journalService.createEntry({
                username: currentUser.username,
                title: journalTitle || `Journal Entry - ${format(new Date(), "MMMM d, yyyy")}`,
                content: journalContent,
                mood: journalMood,
                tags: tagsArray.length > 0 ? tagsArray : ["daily-thoughts"],
            })

            if (newEntry) {
                setEntries([newEntry, ...entries])
                setJournalContent("")
                setJournalTitle("")
                setJournalMood("reflective")
                setJournalTags("")
                toast({
                    title: "Entry Saved",
                    description: "Your journal entry has been saved successfully.",
                })
            } else {
                throw new Error("Failed to create entry")
            }
        } catch (error) {
            console.error('Error saving entry:', error)
            toast({
                title: "Save Failed",
                description: "Failed to save your journal entry. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteEntry = async (id: string) => {
        if (!currentUser) return

        setIsLoading(true)
        try {
            const success = await journalService.deleteEntry(id, currentUser.username)
            if (success) {
                setEntries(entries.filter((entry) => entry.id !== id))
                if (selectedEntry && selectedEntry.id === id) {
                    setSelectedEntry(null)
                }
                toast({
                    title: "Entry Deleted",
                    description: "Your journal entry has been deleted.",
                })
            } else {
                throw new Error("Failed to delete entry")
            }
        } catch (error) {
            console.error('Error deleting entry:', error)
            toast({
                title: "Delete Failed",
                description: "Failed to delete your journal entry. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!currentUser || !searchTerm.trim()) {
            // If no search term, reload all entries
            await loadEntries(currentUser?.username || '')
            return
        }

        setIsLoadingEntries(true)
        try {
            const searchResults = await journalService.searchEntries(currentUser.username, searchTerm)
            setEntries(searchResults)
        } catch (error) {
            console.error('Error searching entries:', error)
            toast({
                title: "Search Failed",
                description: "Failed to search your entries. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoadingEntries(false)
        }
    }

    const handleMoodFilter = async (mood: string) => {
        if (!currentUser) return

        setFilterMood(mood)
        setIsLoadingEntries(true)

        try {
            if (mood) {
                const filteredEntries = await journalService.getEntriesByMood(currentUser.username, mood)
                setEntries(filteredEntries)
            } else {
                await loadEntries(currentUser.username)
            }
        } catch (error) {
            console.error('Error filtering entries:', error)
            toast({
                title: "Filter Failed",
                description: "Failed to filter your entries. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoadingEntries(false)
        }
    }

    // Clear search and reload all entries
    useEffect(() => {
        if (!searchTerm && currentUser) {
            loadEntries(currentUser.username)
        }
    }, [searchTerm])

    const filteredEntries = entries.filter((entry) => {
        if (!searchTerm) return true

        const searchLower = searchTerm.toLowerCase()
        return (
            entry.title.toLowerCase().includes(searchLower) ||
            entry.content.toLowerCase().includes(searchLower) ||
            entry.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        )
    })

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>Please log in to access your journal</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Link href="/">
                            <Button>Go to Login</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo and Name */}
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                MindBloom Journal
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                Home
                            </Link>
                            <Link href="/journal" className="text-blue-600 font-medium">
                                Journal
                            </Link>
                            <span className="text-blue-700 font-medium">
                                Hi, {currentUser.username}! 👋
                            </span>
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
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center space-x-4">
                        <Quote className="h-6 w-6 text-blue-600 flex-shrink-0" />
                        <p className="text-center text-gray-700 font-medium text-lg max-w-2xl transition-all duration-500 ease-in-out">
                            {inspirationalQuotes[currentQuote]}
                        </p>
                        <Quote className="h-6 w-6 text-blue-600 flex-shrink-0 rotate-180" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Your Journaling Space
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Express your thoughts, track your emotions, and reflect on your journey. Your private space for growth and
                        self-discovery.
                    </p>
                </div>

                <Tabs defaultValue="write" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                        <TabsTrigger value="write" className="text-lg py-3">
                            <Edit className="h-5 w-5 mr-2" />
                            Write
                        </TabsTrigger>
                        <TabsTrigger value="archive" className="text-lg py-3">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Archive
                        </TabsTrigger>
                    </TabsList>

                    {/* Write Tab */}
                    <TabsContent value="write" className="mt-0">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Journal Writing Area */}
                            <Card className="md:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                            <span className="text-gray-700 font-medium">{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
                                        </div>
                                        <SunMoon className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Entry Title (Optional)"
                                        className="mt-4 bg-white/70"
                                        value={journalTitle}
                                        onChange={(e) => setJournalTitle(e.target.value)}
                                    />
                                    <div className="flex space-x-2 mt-2">
                                        <select
                                            className="flex-1 p-2 border rounded-md bg-white/70"
                                            value={journalMood}
                                            onChange={(e) => setJournalMood(e.target.value)}
                                        >
                                            {moodOptions.map((mood) => (
                                                <option key={mood} value={mood}>
                                                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <Input
                                            type="text"
                                            placeholder="Tags (comma separated)"
                                            className="flex-1 bg-white/70"
                                            value={journalTags}
                                            onChange={(e) => setJournalTags(e.target.value)}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Textarea
                                        ref={textareaRef}
                                        placeholder="What's on your mind today? Write freely, without judgment..."
                                        className="min-h-[400px] border-0 rounded-none p-6 text-gray-700 text-lg leading-relaxed focus:ring-0 resize-none bg-transparent"
                                        value={journalContent}
                                        onChange={(e) => setJournalContent(e.target.value)}
                                    />
                                </CardContent>
                                <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50 to-indigo-50 py-4">
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        <span>Draft saved locally</span>
                                    </div>
                                    <Button
                                        onClick={handleSaveEntry}
                                        disabled={!journalContent.trim() || isSaving}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Entry
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Journal Tips */}
                            <div className="space-y-6">
                                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 pb-4">
                                        <CardTitle className="text-gray-800 flex items-center">
                                            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                                            Journaling Tips
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <ul className="space-y-3 text-gray-600">
                                            <li className="flex items-start space-x-2">
                                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <p>Write without censoring yourself</p>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <p>Try to journal at the same time each day</p>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <p>Include both challenges and positive moments</p>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <p>Notice patterns in your thoughts and feelings</p>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 pb-4">
                                        <CardTitle className="text-gray-800 flex items-center">
                                            <Heart className="h-5 w-5 mr-2 text-blue-500" />
                                            Prompts for Today
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <ul className="space-y-4 text-gray-600">
                                            <li className="p-3 bg-blue-50 rounded-lg">What made you smile today, even briefly?</li>
                                            <li className="p-3 bg-indigo-50 rounded-lg">
                                                Describe a challenge and one step you can take to address it.
                                            </li>
                                            <li className="p-3 bg-purple-50 rounded-lg">What are you learning about yourself right now?</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Archive Tab */}
                    <TabsContent value="archive" className="mt-0">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Entries List */}
                            <div className="md:col-span-1 space-y-6">
                                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-gray-800">Your Entries</CardTitle>
                                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                                                {filteredEntries.length} entries
                                            </Badge>
                                        </div>
                                        <div className="mt-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    type="text"
                                                    placeholder="Search entries..."
                                                    className="pl-10 bg-white/70"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <Filter className="h-4 w-4 text-gray-400" />
                                            <div className="text-sm text-gray-500">Filter by mood:</div>
                                            <select
                                                className="text-sm border-0 bg-white/70 rounded-md"
                                                value={filterMood}
                                                onChange={(e) => handleMoodFilter(e.target.value)}
                                            >
                                                <option value="">All moods</option>
                                                {moodOptions.map((mood) => (
                                                    <option key={mood} value={mood}>
                                                        {mood}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0 max-h-[600px] overflow-hidden">
                                        <ScrollArea className="h-[600px]">
                                            {isLoadingEntries ? (
                                                <div className="flex items-center justify-center p-8">
                                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                                    <span className="ml-2 text-gray-500">Loading entries...</span>
                                                </div>
                                            ) : filteredEntries.length > 0 ? (
                                                <div className="divide-y divide-gray-100">
                                                    {filteredEntries.map((entry) => (
                                                        <div
                                                            key={entry.id}
                                                            className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedEntry && selectedEntry.id === entry.id ? "bg-blue-50" : ""
                                                                }`}
                                                            onClick={() => setSelectedEntry(entry)}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="font-medium text-gray-800 mb-1 truncate">{entry.title}</h3>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`ml-2 flex-shrink-0 ${entry.mood === "happy" || entry.mood === "grateful"
                                                                        ? "text-green-600 border-green-200"
                                                                        : entry.mood === "anxious" || entry.mood === "sad"
                                                                            ? "text-rose-600 border-rose-200"
                                                                            : "text-blue-600 border-blue-200"
                                                                        }`}
                                                                >
                                                                    {entry.mood}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-500 mb-2">
                                                                {format(new Date(entry.created_at), "MMM d, yyyy")}
                                                            </p>
                                                            <p className="text-sm text-gray-600 line-clamp-2">{entry.content}</p>
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {entry.tags.map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                                                                    >
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center text-gray-500">
                                                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                                    <p>No entries found</p>
                                                    <p className="text-sm mt-1">
                                                        {searchTerm || filterMood
                                                            ? "Try adjusting your search or filters"
                                                            : "Start writing your first journal entry!"}
                                                    </p>
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Entry Viewer */}
                            <div className="md:col-span-2">
                                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-full">
                                    {selectedEntry ? (
                                        <>
                                            <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 pb-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{format(new Date(selectedEntry.created_at), "EEEE, MMMM d, yyyy")}</span>
                                                            {selectedEntry.updated_at !== selectedEntry.created_at && (
                                                                <span className="text-xs text-gray-400">
                                                                    (edited {format(new Date(selectedEntry.updated_at), "MMM d")})
                                                                </span>
                                                            )}
                                                        </div>
                                                        <CardTitle className="text-xl text-gray-800">{selectedEntry.title}</CardTitle>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-600 border-red-200"
                                                                    disabled={isLoading}
                                                                >
                                                                    {isLoading ? (
                                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                                    )}
                                                                    Delete
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                                    <DialogDescription>
                                                                        This action cannot be undone. This will permanently delete your journal entry
                                                                        "{selectedEntry.title}".
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={() => handleDeleteEntry(selectedEntry.id)}
                                                                        disabled={isLoading}
                                                                    >
                                                                        {isLoading ? (
                                                                            <>
                                                                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                                                Deleting...
                                                                            </>
                                                                        ) : (
                                                                            "Delete Entry"
                                                                        )}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </div>
                                                <div className="flex items-center mt-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`${selectedEntry.mood === "happy" || selectedEntry.mood === "grateful"
                                                            ? "text-green-600 border-green-200"
                                                            : selectedEntry.mood === "anxious" || selectedEntry.mood === "sad"
                                                                ? "text-rose-600 border-rose-200"
                                                                : "text-blue-600 border-blue-200"
                                                            }`}
                                                    >
                                                        Mood: {selectedEntry.mood}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="prose max-w-none text-gray-700">
                                                    <p className="whitespace-pre-wrap leading-relaxed">{selectedEntry.content}</p>
                                                </div>
                                                <div className="mt-8 flex flex-wrap gap-1">
                                                    {selectedEntry.tags.map((tag) => (
                                                        <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 flex justify-between">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const entryIndex = entries.findIndex((e) => e.id === selectedEntry.id)
                                                            if (entryIndex > 0) {
                                                                setSelectedEntry(entries[entryIndex - 1])
                                                            }
                                                        }}
                                                        disabled={entries.findIndex((e) => e.id === selectedEntry.id) === 0}
                                                    >
                                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                                        Previous
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const entryIndex = entries.findIndex((e) => e.id === selectedEntry.id)
                                                            if (entryIndex < entries.length - 1) {
                                                                setSelectedEntry(entries[entryIndex + 1])
                                                            }
                                                        }}
                                                        disabled={entries.findIndex((e) => e.id === selectedEntry.id) === entries.length - 1}
                                                    >
                                                        Next
                                                        <ChevronRight className="h-4 w-4 ml-1" />
                                                    </Button>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Entry {entries.findIndex((e) => e.id === selectedEntry.id) + 1} of {entries.length}
                                                </div>
                                            </CardFooter>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full py-16">
                                            <BookOpen className="h-16 w-16 text-blue-300 mb-4" />
                                            <h3 className="text-xl font-medium text-gray-700 mb-2">Select an entry to view</h3>
                                            <p className="text-gray-500 text-center max-w-md">
                                                Click on any entry from your archive to view its contents here.
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Benefits of Journaling */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Benefits of Journaling</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Regular journaling can significantly improve your mental well-being
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-br from-blue-100 to-indigo-100 pb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                                    <Brain className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-lg font-bold text-gray-800">Reduces Stress & Anxiety</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <CardDescription className="text-gray-600">
                                    Writing about your worries and concerns helps process emotions, providing mental clarity and reducing
                                    stress levels. Regular journaling can decrease symptoms of anxiety and overwhelm.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-br from-purple-100 to-pink-100 pb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                                    <Lightbulb className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-lg font-bold text-gray-800">Increases Self-Awareness</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <CardDescription className="text-gray-600">
                                    Journaling helps you recognize patterns in your thoughts, behaviors, and emotions. This awareness is
                                    the first step toward positive change and personal growth.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md bg-white/70 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-br from-cyan-100 to-blue-100 pb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-lg font-bold text-gray-800">Improves Emotional Processing</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <CardDescription className="text-gray-600">
                                    Writing about difficult experiences helps you process and make sense of them. This can lead to
                                    emotional healing and a greater sense of well-being over time.
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
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50"
                    aria-label="Open Chatbot"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
            </Link>

            {/* Floating Animation */}
            <div className="fixed top-1/4 left-8 opacity-20 pointer-events-none">
                <div className="animate-bounce">
                    <Sparkles className="h-8 w-8 text-blue-400" />
                </div>
            </div>
            <div className="fixed top-1/3 right-12 opacity-20 pointer-events-none">
                <div className="animate-pulse">
                    <Heart className="h-6 w-6 text-pink-400" />
                </div>
            </div>
            <div className="fixed bottom-1/4 left-12 opacity-20 pointer-events-none">
                <div className="animate-spin" style={{ animationDuration: "8s" }}>
                    <Bot className="h-6 w-6 text-indigo-400" />
                </div>
            </div>
        </div>
    )
}