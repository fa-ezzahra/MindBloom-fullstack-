"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const quotes = [
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
  },
  {
    text: "Mental health problems don't define who you are. They are something you experience.",
    author: "Unknown",
  },
  {
    text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality.",
    author: "Julian Seifter",
  },
  {
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown",
  },
  {
    text: "There is hope, even when your brain tells you there isn't.",
    author: "John Green",
  },
  {
    text: "Self-care is how you take your power back.",
    author: "Lalah Delia",
  },
  {
    text: "You are not alone in this journey. Every step forward is a step towards healing.",
    author: "MindBloom",
  },
]

export default function DailyQuote() {
  const [quote, setQuote] = useState({ text: "", author: "" })

  useEffect(() => {
    // Get a random quote when component mounts
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  return (
    <div className="container py-4">
      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm italic">{quote.text}</p>
            <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
