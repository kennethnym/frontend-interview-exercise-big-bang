import { useGameStore } from "../../game-store.ts"
import { GAME_STAGE } from "../../game.ts"
import LandingScreen from "./landing-screen.tsx"
import GameScreen from "./game-screen.tsx"

const STAGE_COMPONENT = {
  [GAME_STAGE.landing]: LandingScreen,
  [GAME_STAGE.playing]: GameScreen,
} as const

function InGamePage() {
  return (
    <div className="w-full min-h-[inherit] flex flex-col items-center justify-center">
      <TopNav />
      <CurrentStage />
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

function CurrentStage() {
  const stage = useGameStore((state) => state.gameStage)
  const StageComponent = STAGE_COMPONENT[stage]
  return <StageComponent />
}

export default InGamePage
