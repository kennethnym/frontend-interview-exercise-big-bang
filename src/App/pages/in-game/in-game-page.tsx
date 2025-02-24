import { useGameStore } from "../../game-store.ts"
import { GAME_SCREEN } from "../../game.ts"
import LandingScreen from "./landing-screen.tsx"
import PlayingScreen from "./playing-screen.tsx"

const SCREEN_COMPONENT = {
  [GAME_SCREEN.landing]: LandingScreen,
  [GAME_SCREEN.playing]: PlayingScreen,
} as const

function InGamePage() {
  return (
    <div className="w-full min-h-[inherit] flex flex-col items-center justify-center">
      <TopNav />
      <CurrentScreen />
    </div>
  )
}

function TopNav() {
  const username = useGameStore((state) => state.username)
  return (
    <nav className="fixed top-0 left-0 right-0 flex flex-row justify-end px-8 py-4">
      <p>{username}</p>
    </nav>
  )
}

function CurrentScreen() {
  const screen = useGameStore((state) => state.gameScreen)
  const ScreenComponent = SCREEN_COMPONENT[screen]
  return <ScreenComponent />
}

export default InGamePage
