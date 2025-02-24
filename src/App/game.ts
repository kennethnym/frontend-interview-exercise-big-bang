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

/**
 * OUTCOME_TABLE maps each choice to a list of choices it wins against.
 */
const OUTCOME_TABLE: Record<Choice, Choice[]> = {
  [CHOICE.rock]: [CHOICE.scissors, CHOICE.lizard],
  [CHOICE.paper]: [CHOICE.rock, CHOICE.spock],
  [CHOICE.scissors]: [CHOICE.paper, CHOICE.lizard],
  [CHOICE.lizard]: [CHOICE.paper, CHOICE.spock],
  [CHOICE.spock]: [CHOICE.scissors, CHOICE.rock],
}

/**
 * GAME_SCREEN defines all in-game screens.
 * The screens are all displayed under the in game page.
 */
const GAME_SCREEN = {
  landing: "landing",
  /**
   * The playing screen is displayed when the game has started.
   */
  playing: "playing",
} as const
type GameScreen = (typeof GAME_SCREEN)[keyof typeof GAME_SCREEN]

const ROUND_STATE = {
  /**
   * Players greeting before the game starts
   */
  greeting: "greeting",
  /**
   * The round is counting down
   */
  starting: "starting",
  /**
   * The round has started and is awaiting user choice
   */
  started: "started",
  /**
   * The round has finished and the result has been revealed
   */
  revealed: "revealed",
} as const
type RoundState = (typeof ROUND_STATE)[keyof typeof ROUND_STATE]

/**
 * GameRound contains the state of a round of game.
 */
interface GameRound {
  /**
   * The number of the current round which starts from 1.
   */
  number: number
  state: RoundState
  computerChoice: Choice
  /**
   * The choice the player has made. null if the player has not made a choice.
   */
  playerChoice: Choice | null
  /**
   * The outcome of the round. null if the player has not made a choice.
   */
  outcome: Outcome | null
}

/**
 * Username represents a validated username.
 */
type Username = Tagged<string, "Username">

/**
 * Validates whether the given username is valid.
 * This is a type guard, so the resulting type can be used for functions that expect a valid username.
 */
function validateUsername(username: string): username is Username {
  return username.trim().length > 0
}

/**
 * Loads the username the player has set previously from session storage.
 * Returns null if the player has never set a username.
 */
function loadUsername(): Username | null {
  const savedUsername = sessionStorage.getItem("username")
  if (!savedUsername || !validateUsername(savedUsername)) {
    return null
  }
  return savedUsername
}

/**
 * Saves the given username to session storage.
 */
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
 */
function compareChoices(a: Choice, b: Choice): Outcome {
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
