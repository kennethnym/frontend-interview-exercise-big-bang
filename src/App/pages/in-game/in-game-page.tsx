import { useGameStore } from "../../game-store.ts"
import { GAME_SCREEN } from "../../game.ts"
import LandingScreen from "./landing-screen.tsx"
import PlayingScreen from "./playing-screen.tsx"
import { Button } from "../../components/button.tsx"
import { CircleUser, X } from "lucide-react"
import { InGameMenu } from "./in-game-menu.tsx"

const SCREEN_COMPONENT = {
  [GAME_SCREEN.landing]: LandingScreen,
  [GAME_SCREEN.playing]: PlayingScreen,
} as const

function InGamePage() {
  return (
    <div className="w-full min-h-[inherit] relative flex flex-col items-center justify-center">
      <TopNav />
      <CurrentScreen />
      <InGameMenu />
    </div>
  )
}

function CurrentScreen() {
  const screen = useGameStore((state) => state.gameScreen)
  const ScreenComponent = SCREEN_COMPONENT[screen]
  return <ScreenComponent />
}

function TopNav() {
  return (
    <nav className="fixed z-20 top-0 left-0 right-0 flex flex-row justify-start px-8 py-4">
      <MenuButton />
    </nav>
  )
}

function MenuButton() {
  const username = useGameStore((state) => state.username)
  const isInGameMenuVisible = useGameStore((state) => state.isInGameMenuOpen)
  const setIsInGameMenuVisible = useGameStore(
    (state) => state.setIsInGameMenuOpen,
  )

  function toggleInGameMenu() {
    setIsInGameMenuVisible(!isInGameMenuVisible)
  }

  return (
    <Button
      className="flex flex-row items-center space-x-2"
      onClick={toggleInGameMenu}
    >
      {isInGameMenuVisible ? (
        <>
          <span>
            <X size={16} />
          </span>
          <span className="-translate-y-[1px]">Close</span>
        </>
      ) : (
        <>
          <span>
            <CircleUser size={16} />
          </span>
          <span className="-translate-y-[1px]">{username}</span>
        </>
      )}
    </Button>
  )
}

export default InGamePage
