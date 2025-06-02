// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xiqafhhdzhaqxgviksnr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcWFmaGhkemhhcXhndmlrc25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTYxNTAsImV4cCI6MjA2NDE5MjE1MH0.j6Otry7FlDXH4u1q3g02Z7vSweIEY82M31ICpGSzKmw'
export const supabase = createClient(supabaseUrl, supabaseKey)
