import { AnimatePresence, motion } from "motion/react"
import { useGameStore } from "../../game-store.ts"
import { GAME_STAGE } from "../../game.ts"
import { useState } from "react"

function LandingScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const setCurrentGameStage = useGameStore((state) => state.setCurrentGameStage)

  return (
    <AnimatePresence
      onExitComplete={() => {
        setCurrentGameStage(GAME_STAGE.playing)
      }}
    >
      {isVisible ? (
        <motion.div exit={{ scale: 0 }}>
          <main className="flex flex-col items-center">
            <h1 className="font-bold">Ross</h1>
            <h2 className="opacity-80">
              Rock paper scissors with a <em>twist!</em>
            </h2>
            <button
              type="button"
              className="mt-4"
              onClick={() => {
                setIsVisible(false)
              }}
            >
              Start game!
            </button>
          </main>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default LandingScreen
