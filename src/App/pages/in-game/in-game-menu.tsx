import { useGameStore } from "../../game-store.ts"
import { Button } from "../../components/button.tsx"

function InGameMenu() {
  const isVisible = useGameStore((state) => state.isInGameMenuOpen)
  const resetGame = useGameStore((state) => state.resetGame)
  const setIsInGameMenuVisible = useGameStore(
    (state) => state.setIsInGameMenuOpen,
  )

  if (!isVisible) return null

  function restartGame() {
    setIsInGameMenuVisible(false)
    resetGame()
  }

  return (
    <div
      role="dialog"
      className="absolute z-10 inset-0 bg-black/80 flex flex-col items-center justify-evenly text-neutral-200"
    >
      <h2 className="text-4xl font-bold">Scoreboard</h2>
      <div className="flex flex-col items-center space-y-4 md:space-y-16">
        <CurrentRoundLabel />
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <ComputerScoreCell />
          <span className="text-2xl font-bold">vs</span>
          <PlayerScoreCell />
        </div>
      </div>
      <Button onClick={restartGame}>Restart game</Button>
    </div>
  )
}

function CurrentRoundLabel() {
  const round = useGameStore((state) =>
    state.gameRound ? state.gameRound.number : 0,
  )
  return <p className="font-medium text-2xl">Current round: {round}</p>
}

function ComputerScoreCell() {
  const score = useGameStore((state) => state.computerScore)
  return (
    <div className="flex flex-col items-center space-y-2 text-red-400">
      <p className="text-6xl font-bold">{score}</p>
      <p>Computer</p>
    </div>
  )
}

function PlayerScoreCell() {
  const score = useGameStore((state) => state.playerScore)
  const username = useGameStore((state) => state.username || "")
  return (
    <div className="flex flex-col items-center space-y-2 text-blue-400">
      <p className="text-6xl font-bold">{score}</p>
      <p>{username}</p>
    </div>
  )
}

export { InGameMenu }
