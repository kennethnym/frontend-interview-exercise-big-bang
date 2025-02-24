import { AnimatePresence, motion } from "motion/react"
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { useGameStore } from "../../game-store.ts"
import { OUTCOME, ROUND_STATE } from "../../game.ts"
import { CardDeck } from "./card-deck.tsx"

function PlayingScreen() {
  const labelDisplayed = useRef(false)
  const setRoundState = useGameStore((state) => state.setCurrentRoundState)

  function onPlayerLabelDisplayed() {
    if (!labelDisplayed.current) {
      labelDisplayed.current = true
      setRoundState(ROUND_STATE.starting)
    }
  }

  const onCountdownFinished = useCallback(() => {
    setRoundState(ROUND_STATE.started)
  }, [setRoundState])

  return (
    <main className="w-full min-h-[inherit] flex flex-col">
      <PlayerSectionBackground direction="fromTop">
        <PlayerLabel label="Computer" onDisplayed={onPlayerLabelDisplayed} />
        <ComputerChoiceLabel />
        <ComputerDeck />
      </PlayerSectionBackground>
      <PlayerSectionBackground direction="fromBottom">
        <PlayerLabel label="You" onDisplayed={onPlayerLabelDisplayed} />
        <PlayerDeck />
        <PlayerChoiceLabel />
      </PlayerSectionBackground>
      <CountdownLabel onFinish={onCountdownFinished} />
      <OutcomeOverlay />
    </main>
  )
}

function PlayerSectionBackground({
  direction,
  children,
}: PropsWithChildren<{ direction: "fromTop" | "fromBottom" }>) {
  const shouldAnimate = useGameStore((state) =>
    state.gameRound ? state.gameRound.state === ROUND_STATE.greeting : false,
  )
  return (
    <motion.div
      className={`flex flex-col items-center justify-evenly flex-1 ${direction === "fromTop" ? "bg-red-900" : "bg-blue-900"}`}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={{
        hidden: { translateY: direction === "fromTop" ? -1000 : 1000 },
        visible: {
          translateY: 0,
          transition: { delay: 0.5, bounceStiffness: 400 },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

function PlayerLabel({
  label,
  onDisplayed,
}: {
  label: string
  onDisplayed: () => void
}) {
  const shouldBeVisible = useGameStore((state) =>
    state.gameRound ? state.gameRound.state === ROUND_STATE.greeting : false,
  )
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (shouldBeVisible) {
      const t1 = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      const t2 = setTimeout(() => {
        setIsVisible(false)
      }, 4000)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [shouldBeVisible])

  return (
    <AnimatePresence onExitComplete={onDisplayed}>
      {isVisible ? (
        <motion.p
          variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="text-6xl font-bold"
        >
          {label}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}

function CountdownLabel({ onFinish }: { onFinish: () => void }) {
  const shouldBeVisible = useGameStore((state) =>
    state.gameRound ? state.gameRound.state === ROUND_STATE.starting : false,
  )
  const roundNumber = useGameStore((state) => state.gameRound?.number || 0)
  const [isVisible, setIsVisible] = useState(false)
  const [label, setLabel] = useState("")

  useEffect(() => {
    if (shouldBeVisible) {
      setIsVisible(true)
      setLabel(`Round ${roundNumber.toString()}`)

      const t1 = setTimeout(() => {
        setLabel("Rock")
      }, 2000)
      const t2 = setTimeout(() => {
        setLabel("Paper")
      }, 2500)
      const t3 = setTimeout(() => {
        setLabel("Scissors")
      }, 3000)
      const t4 = setTimeout(() => {
        setLabel("Shoot!")
        onFinish()
      }, 3500)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
      }
    } else {
      setTimeout(() => {
        setIsVisible(false)
      }, 1000)
    }
  }, [onFinish, roundNumber, shouldBeVisible])

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.p
          className="absolute left-0 right-0 text-center top-1/2 -translate-y-1/2 select-none font-bold text-2xl md:text-6xl"
          variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {label}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}

function OutcomeOverlay() {
  const outcome = useGameStore((state) =>
    state.gameRound ? state.gameRound.outcome : "",
  )
  const advanceToNextRound = useGameStore((state) => state.advanceToNextRound)

  let label: string
  switch (outcome) {
    case OUTCOME.won:
      label = "You won! 🎉"
      break
    case OUTCOME.lost:
      label = "You lost! 😔"
      break
    case OUTCOME.tied:
      label = "It's a tie!"
      break
    default:
      label = ""
      break
  }

  return (
    <AnimatePresence>
      {label ? (
        <motion.button
          className="absolute left-0 right-0 text-center top-1/2 -translate-y-1/2"
          variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={advanceToNextRound}
        >
          <span className="text-2xl md:text-6xl font-bold">{label}</span>
          <br />
          <span className="text-sm">Click here for next round</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}

function ComputerDeck() {
  const choice = useGameStore((state) =>
    state.gameRound ? state.gameRound.computerChoice : null,
  )
  const shouldReveal = useGameStore((state) =>
    state.gameRound ? state.gameRound.state === ROUND_STATE.revealed : false,
  )
  return (
    <CardDeck
      interactable={false}
      selectedChoice={shouldReveal ? choice : null}
    />
  )
}

function PlayerDeck() {
  const choice = useGameStore((state) =>
    state.gameRound ? state.gameRound.playerChoice : null,
  )
  const setChoice = useGameStore((state) => state.setPlayerChoice)
  return <CardDeck interactable selectedChoice={choice} onSelect={setChoice} />
}

function ComputerChoiceLabel() {
  const isVisible = useGameStore((state) =>
    state.gameRound ? state.gameRound.state === ROUND_STATE.revealed : false,
  )
  const selectedChoice = useGameStore((state) =>
    state.gameRound ? state.gameRound.computerChoice : "",
  )
  return (
    <p>
      {isVisible && selectedChoice ? `Computer selected ${selectedChoice}` : ""}
    </p>
  )
}

function PlayerChoiceLabel() {
  const username = useGameStore((state) => state.username || "")
  const selectedChoice = useGameStore((state) =>
    state.gameRound ? state.gameRound.playerChoice || "" : "",
  )
  return <p>{selectedChoice ? `${username} selected ${selectedChoice}` : ""}</p>
}

export default PlayingScreen
