// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
    username: string
    firstname: string
    lastname?: string | null
    password?: string | null
}

export interface MoodEntry {
    id: string
    username: string
    mood_id: string
    mood_name: string
    mood_value: number
    notes?: string
    entry_date: string
    created_at: string
    updated_at: string
}

export interface JournalEntry {
    id: string
    username: string
    title: string
    content: string
    mood: string
    tags: string[]
    created_at: string
    updated_at: string
}

export interface NewJournalEntry {
    username: string
    title: string
    content: string
    mood?: string
    tags?: string[]
}

export interface UpdateJournalEntry {
    title?: string
    content?: string
    mood?: string
    tags?: string[]
}

// CRUD Operations for Mood Entries
export class MoodService {
    // Create a new mood entry
    static async createMoodEntry(username: string, moodData: {
        mood_id: string
        mood_name: string
        mood_value: number
        notes?: string
        entry_date?: string
    }) {
        try {
            const { data, error } = await supabase
                .from('mood_entries')
                .insert([
                    {
                        username,
                        mood_id: moodData.mood_id,
                        mood_name: moodData.mood_name,
                        mood_value: moodData.mood_value,
                        notes: moodData.notes || null,
                        entry_date: moodData.entry_date || new Date().toISOString().split('T')[0]
                    }
                ])
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Error creating mood entry:', error)
            return { data: null, error }
        }
    }

    // Update existing mood entry
    static async updateMoodEntry(id: string, username: string, updates: {
        mood_id?: string
        mood_name?: string
        mood_value?: number
        notes?: string
    }) {
        try {
            const { data, error } = await supabase
                .from('mood_entries')
                .update(updates)
                .eq('id', id)
                .eq('username', username) // Ensure user can only update their own entries
                .select()
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Error updating mood entry:', error)
            return { data: null, error }
        }
    }

    // Delete mood entry
    static async deleteMoodEntry(id: string, username: string) {
        try {
            const { error } = await supabase
                .from('mood_entries')
                .delete()
                .eq('id', id)
                .eq('username', username) // Ensure user can only delete their own entries

            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Error deleting mood entry:', error)
            return { error }
        }
    }

    // Get mood entry for specific date
    static async getMoodEntryByDate(username: string, date: string) {
        try {
            const { data, error } = await supabase
                .from('mood_entries')
                .select('*')
                .eq('username', username)
                .eq('entry_date', date)
                .single()

            if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found" error
            return { data, error: null }
        } catch (error) {
            console.error('Error fetching mood entry by date:', error)
            return { data: null, error }
        }
    }

    // Get mood entries for date range
    static async getMoodEntriesRange(username: string, startDate: string, endDate: string) {
        try {
            const { data, error } = await supabase
                .from('mood_entries')
                .select('*')
                .eq('username', username)
                .gte('entry_date', startDate)
                .lte('entry_date', endDate)
                .order('entry_date', { ascending: true })

            if (error) throw error
            return { data: data || [], error: null }
        } catch (error) {
            console.error('Error fetching mood entries range:', error)
            return { data: [], error }
        }
    }

    // Get all mood entries for user
    static async getAllMoodEntries(username: string) {
        try {
            const { data, error } = await supabase
                .from('mood_entries')
                .select('*')
                .eq('username', username)
                .order('entry_date', { ascending: false })

            if (error) throw error
            return { data: data || [], error: null }
        } catch (error) {
            console.error('Error fetching all mood entries:', error)
            return { data: [], error }
        }
    }

    // Get mood statistics
    static async getMoodStats(username: string, days: number = 30) {
        try {
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - days)
            const startDateStr = startDate.toISOString().split('T')[0]

            const { data, error } = await supabase
                .from('mood_entries')
                .select('mood_value, entry_date, mood_id')
                .eq('username', username)
                .gte('entry_date', startDateStr)
                .order('entry_date', { ascending: true })

            if (error) throw error

            // Calculate statistics
            const entries = data || []
            const total = entries.reduce((sum, entry) => sum + entry.mood_value, 0)
            const average = entries.length > 0 ? total / entries.length : 0

            // Calculate trend (comparing first half vs second half)
            const midPoint = Math.floor(entries.length / 2)
            const firstHalf = entries.slice(0, midPoint)
            const secondHalf = entries.slice(midPoint)

            const firstHalfAvg = firstHalf.length > 0
                ? firstHalf.reduce((sum, entry) => sum + entry.mood_value, 0) / firstHalf.length
                : 0
            const secondHalfAvg = secondHalf.length > 0
                ? secondHalf.reduce((sum, entry) => sum + entry.mood_value, 0) / secondHalf.length
                : 0

            let trend = 'stable'
            if (secondHalfAvg > firstHalfAvg + 0.3) trend = 'improving'
            else if (secondHalfAvg < firstHalfAvg - 0.3) trend = 'declining'

            // Find most common mood
            const moodCounts = entries.reduce((acc, entry) => {
                acc[entry.mood_id] = (acc[entry.mood_id] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            let mostCommonMood = ''
            const moodEntries = Object.entries(moodCounts)
            if (moodEntries.length > 0) {
                mostCommonMood = moodEntries.reduce(
                    (a, b) => a[1] > b[1] ? a : b
                )[0]
            }

            return {
                data: {
                    entries,
                    average: Number(average.toFixed(1)),
                    trend,
                    mostCommonMood,
                    totalEntries: entries.length
                },
                error: null
            }
        } catch (error) {
            console.error('Error fetching mood stats:', error)
            return { data: null, error }
        }
    }
}

// Journal CRUD operations
export const journalService = {
    // Create a new journal entry
    async createEntry(entry: NewJournalEntry): Promise<JournalEntry | null> {
        try {
            const { data, error } = await supabase
                .from('journal_entries')
                .insert(entry)
                .select()
                .single()

            if (error) {
                console.error('Error creating journal entry:', error)
                return null
            }

            return data
        } catch (error) {
            console.error('Unexpected error creating journal entry:', error)
            return null
        }
    },

    // Get all journal entries for a user
    async getEntries(username: string): Promise<JournalEntry[]> {
        try {
            const { data, error } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('username', username)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching journal entries:', error)
                return []
            }

            return data || []
        } catch (error) {
            console.error('Unexpected error fetching journal entries:', error)
            return []
        }
    },

    // Get a single journal entry
    async getEntry(id: string, username: string): Promise<JournalEntry | null> {
        try {
            const { data, error } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('id', id)
                .eq('username', username)
                .single()

            if (error) {
                console.error('Error fetching journal entry:', error)
                return null
            }

            return data
        } catch (error) {
            console.error('Unexpected error fetching journal entry:', error)
            return null
        }
    },

    // Update a journal entry
    async updateEntry(id: string, username: string, updates: UpdateJournalEntry): Promise<JournalEntry | null> {
        try {
            const { data, error } = await supabase
                .from('journal_entries')
                .update(updates)
                .eq('id', id)
                .eq('username', username)
                .select()
                .single()

            if (error) {
                console.error('Error updating journal entry:', error)
                return null
            }

            return data
        } catch (error) {
            console.error('Unexpected error updating journal entry:', error)
            return null
        }
    },

    // Delete a journal entry
    async deleteEntry(id: string, username: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('journal_entries')
                .delete()
                .eq('id', id)
                .eq('username', username)

            if (error) {
                console.error('Error deleting journal entry:', error)
                return false
            }

            return true
        } catch (error) {
            console.error('Unexpected error deleting journal entry:', error)
            return false
        }
    },

    // Search entries by content, title, or tags
    async searchEntries(username: string, searchTerm: string): Promise<JournalEntry[]> {
        try {
            const { data, error } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('username', username)
                .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error searching journal entries:', error)
                return []
            }

            return data || []
        } catch (error) {
            console.error('Unexpected error searching journal entries:', error)
            return []
        }
    },

    // Filter entries by mood
    async getEntriesByMood(username: string, mood: string): Promise<JournalEntry[]> {
        try {
            const { data, error } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('username', username)
                .eq('mood', mood)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching entries by mood:', error)
                return []
            }

            return data || []
        } catch (error) {
            console.error('Unexpected error fetching entries by mood:', error)
            return []
        }
    }
}

// User Service for authentication
export class UserService {
    // Get user by username
    static async getUser(username: string) {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('username, firstname, lastname')
                .eq('username', username)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Error fetching user:', error)
            return { data: null, error }
        }
    }

    // Verify user credentials (for login)
    static async verifyUser(username: string, password: string) {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('username, firstname, lastname, password')
                .eq('username', username)
                .eq('password', password)
                .single()

            if (error) throw error

            // Remove password from returned data
            const { password: _, ...userData } = data
            return { data: userData, error: null }
        } catch (error) {
            console.error('Error verifying user:', error)
            return { data: null, error }
        }
    }
}