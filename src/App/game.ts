import { Tagged } from "./tagged.ts"

const GAME_STAGE = {
  landing: "landing",
  playing: "playing",
} as const
type GameStage = (typeof GAME_STAGE)[keyof typeof GAME_STAGE]

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

export { GAME_STAGE, loadUsername, validateUsername, saveUsername }
export type { Username, GameStage }
