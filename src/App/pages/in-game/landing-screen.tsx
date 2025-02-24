import { AnimatePresence, motion } from "motion/react"
import { useGameStore } from "../../game-store.ts"
import { GAME_SCREEN } from "../../game.ts"
import { useState } from "react"
import { Button } from "../../components/button.tsx"

function LandingScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const setCurrentGameScreen = useGameStore(
    (state) => state.setCurrentGameScreen,
  )
  const advanceToNextRound = useGameStore((state) => state.advanceToNextRound)

  return (
    <AnimatePresence
      onExitComplete={() => {
        setCurrentGameScreen(GAME_SCREEN.playing)
        advanceToNextRound()
      }}
    >
      {isVisible ? (
        <motion.div exit={{ scale: 0 }}>
          <main className="flex flex-col items-center">
            <h1 className="font-bold">Ross</h1>
            <h2 className="opacity-80">
              Rock paper scissors with a <em>twist!</em>
            </h2>
            <Button
              type="button"
              className="mt-4"
              onClick={() => {
                setIsVisible(false)
              }}
            >
              Start game!
            </Button>
          </main>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default LandingScreen
