import { Tagged } from "./tagged.ts"

const CHOICE = {
  rock: "rock",
  paper: "paper",
  scissors: "scissors",
  lizard: "lizard",
  spock: "spock",
} as const
const POSSIBLE_CHOICES = Object.values(CHOICE)
type Choice = (typeof CHOICE)[keyof typeof CHOICE]

const OUTCOME = {
  won: "won",
  lost: "lost",
  tied: "tied",
} as const
type Outcome = (typeof OUTCOME)[keyof typeof OUTCOME]

const OUTCOME_TABLE: Record<Choice, Choice[]> = {
  [CHOICE.rock]: [CHOICE.scissors, CHOICE.lizard],
  [CHOICE.paper]: [CHOICE.rock, CHOICE.spock],
  [CHOICE.scissors]: [CHOICE.paper, CHOICE.lizard],
  [CHOICE.lizard]: [CHOICE.paper, CHOICE.spock],
  [CHOICE.spock]: [CHOICE.scissors, CHOICE.rock],
}

const GAME_SCREEN = {
  landing: "landing",
  playing: "playing",
} as const
type GameScreen = (typeof GAME_SCREEN)[keyof typeof GAME_SCREEN]

const ROUND_STATE = {
  greeting: "greeting",
  starting: "starting",
  started: "started",
  revealed: "revealed",
} as const
type RoundState = (typeof ROUND_STATE)[keyof typeof ROUND_STATE]

interface GameRound {
  number: number
  state: RoundState
  computerChoice: Choice
  playerChoice: Choice | null
  outcome: Outcome | null
}

type Username = Tagged<string, "Username">

function validateUsername(username: string): username is Username {
  return username.trim().length > 0
}

function loadUsername(): Username | null {
  const savedUsername = sessionStorage.getItem("username")
  if (!savedUsername || !validateUsername(savedUsername)) {
    return null
  }
  return savedUsername
}

function saveUsername(username: Username) {
  sessionStorage.setItem("username", username)
}

function generateChoice(): Choice {
  const i = Math.floor(Math.random() * POSSIBLE_CHOICES.length)
  return POSSIBLE_CHOICES[i]
}

/**
 * compareChoices determines whether the first choice wins over the second choice.
 * If both choices are the same, then it is a tie.
 *
 * @param a
 * @param b
 */
function compareChoices(a: Choice, b: Choice): Outcome {
  console.log({ a, b })
  if (a === b) return OUTCOME.tied
  const aWinsAgainst = OUTCOME_TABLE[a]
  if (aWinsAgainst.includes(b)) {
    return OUTCOME.won
  }
  return OUTCOME.lost
}

export {
  CHOICE,
  OUTCOME,
  POSSIBLE_CHOICES,
  GAME_SCREEN,
  ROUND_STATE,
  loadUsername,
  validateUsername,
  saveUsername,
  generateChoice,
  compareChoices,
}
export type { Username, GameScreen, GameRound, RoundState, Choice, Outcome }
