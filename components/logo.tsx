import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="relative h-10 w-10 mr-2 text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          {/* Head silhouette */}
          <path d="M12 2c-3.5 0-6 2.5-6 6 0 1.5 0.5 3 1.5 4.2C8.2 13.5 9.8 14 12 14s3.8-0.5 4.5-1.8C17.5 11 18 9.5 18 8c0-3.5-2.5-6-6-6z" />

          {/* Neck */}
          <path d="M10 14v2c0 1 1 2 2 2s2-1 2-2v-2" />

          {/* Lotus flower petals emerging from the head */}
          <path d="M12 2c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2z" fill="currentColor" opacity="0.3" />
          <path d="M9 3c-0.5-1-1.5-1-2-0.5s-0.5 1.5 0.5 2 2 0 2-0.5-0.5-1-0.5-1z" fill="currentColor" opacity="0.2" />
          <path d="M15 3c0.5-1 1.5-1 2-0.5s0.5 1.5-0.5 2-2 0-2-0.5 0.5-1 0.5-1z" fill="currentColor" opacity="0.2" />
          <path d="M8 5c-1-0.5-1-1.5-0.5-2s1.5-0.5 2 0.5 0 2-0.5 2-1-0.5-1-0.5z" fill="currentColor" opacity="0.1" />
          <path d="M16 5c1-0.5 1-1.5 0.5-2s-1.5-0.5-2 0.5 0 2 0.5 2 1-0.5 1-0.5z" fill="currentColor" opacity="0.1" />

          {/* Center of lotus */}
          <circle cx="12" cy="3" r="0.5" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
        MindBloom
      </span>
    </Link>
  )
}
