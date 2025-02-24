import { useGameStore } from "./game-store.ts"
import { PAGE, PAGE_MAP } from "./pages/page.ts"
import LoadingPage from "./pages/loading-page.tsx"
import { Suspense, useEffect } from "react"
import "./App.css"

function App() {
  const page = useGameStore((state) => state.page)
  const initializeGame = useGameStore((state) => state.initializeGame)

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  if (page === PAGE.loading) {
    return <LoadingPage />
  }

  const PageComponent = PAGE_MAP[page]
  return (
    <Suspense fallback={<LoadingPage />}>
      <PageComponent />
    </Suspense>
  )
}

export default App
