import { CHOICE, Choice, POSSIBLE_CHOICES, ROUND_STATE } from "../../game.ts"
import { useGameStore } from "../../game-store.ts"
import clsx from "clsx"
import { motion, Variants } from "motion/react"

const CHOICE_ICON = {
  [CHOICE.rock]: "🪨",
  [CHOICE.paper]: "📄",
  [CHOICE.scissors]: "✂️",
  [CHOICE.lizard]: "🐊",
  [CHOICE.spock]: "🧑‍🚀",
} as const

function CardDeck(
  props:
    | {
        interactable: true
        onSelect: (choice: Choice) => void
        selectedChoice: Choice | null
      }
    | {
        interactable: false
        selectedChoice: Choice | null
      },
) {
  const isVisible = useGameStore((state) =>
    state.gameRound
      ? state.gameRound.state === ROUND_STATE.started ||
        state.gameRound.state === ROUND_STATE.revealed
      : false,
  )

  if (!isVisible) return null

  // whether to highlight the selected option in the deck
  const showSelection = props.selectedChoice !== null

  return (
    <ul className="flex flex-row justify-center flex-wrap gap-4">
      {POSSIBLE_CHOICES.map((choice) =>
        props.interactable ? (
          <ClickableItem
            key={choice}
            selected={choice === props.selectedChoice}
            showSelection={showSelection}
            choice={choice}
            onClick={() => {
              props.onSelect(choice)
            }}
          />
        ) : (
          <StaticItem
            key={choice}
            selected={choice === props.selectedChoice}
            showSelection={showSelection}
            choice={choice}
          />
        ),
      )}
    </ul>
  )
}

const ITEM_ANIMATION_VARIANTS: Variants = {
  idle: {},
  selected: { scale: 1.1 },
  notSelected: { opacity: 0.5 },
  hover: { translateY: -8 },
}

function StaticItem({
  selected,
  showSelection,
  choice,
}: {
  selected: boolean
  showSelection: boolean
  choice: Choice
}) {
  return (
    <motion.li
      variants={ITEM_ANIMATION_VARIANTS}
      animate={showSelection ? (selected ? "selected" : "notSelected") : "idle"}
      className="w-24 h-20 md:h-32 rounded bg-neutral-200 text-neutral-900 shadow-sm text-2xl flex flex-col items-center justify-center"
    >
      <span className="text-2xl">{CHOICE_ICON[choice]}</span>
      <br />
      <span className="text-lg">{choice}</span>
    </motion.li>
  )
}

function ClickableItem({
  selected,
  showSelection,
  choice,
  onClick,
}: {
  selected: boolean
  showSelection: boolean
  choice: Choice
  onClick: () => void
}) {
  return (
    <motion.li
      variants={ITEM_ANIMATION_VARIANTS}
      animate={showSelection ? (selected ? "selected" : "notSelected") : "idle"}
      whileHover={showSelection ? "" : "hover"}
    >
      <button
        className={clsx(
          "w-24 h-20 md:h-32 rounded bg-neutral-200 text-neutral-900 shadow-lg text flex flex-col items-center justify-center",
          { "cursor-pointer": !showSelection },
        )}
        onClick={onClick}
      >
        <span className="text-2xl">{CHOICE_ICON[choice]}</span>
        <br />
        <span className="text-lg">{choice}</span>
      </button>
    </motion.li>
  )
}

export { CardDeck }
