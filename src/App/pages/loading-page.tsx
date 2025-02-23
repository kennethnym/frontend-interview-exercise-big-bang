import { memo } from "react"

const LoadingPage = memo(() => (
  <div className="h-full min-h-[inherit] flex items-center justify-center">
    <main>
      <p className="animate-pulse">Loading game...</p>
    </main>
  </div>
))
LoadingPage.displayName = "LoadingPage"

export default LoadingPage
