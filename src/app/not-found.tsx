import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <FileQuestion className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="text-gray-600">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild variant="default" className="w-full">
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
