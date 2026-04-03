"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Something went wrong!</h1>
        <p className="text-gray-600">
          An unexpected error occurred. We&apos;ve been notified and are looking into it.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
