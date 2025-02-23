import { create } from "zustand"
import { PAGE, Page } from "./pages/page.ts"
import {
  GAME_STAGE,
  GameStage,
  loadUsername,
  saveUsername,
  Username,
} from "./game.ts"
import { persist, createJSONStorage } from "zustand/middleware"

interface GameState {
  page: Page
  username: Username | null
  gameStage: GameStage

  initializeGame: () => void
  saveUsername: (username: Username) => void
  setCurrentGameStage: (stage: GameStage) => void
}

const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      page: PAGE.loading,
      username: null,
      gameStage: GAME_STAGE.landing,

      initializeGame() {
        const savedUsername = loadUsername()
        set(() => {
          if (savedUsername) {
            return { page: PAGE.inGame, username: savedUsername }
          }
          return { page: PAGE.createUsername }
        })
      },

      saveUsername(username: Username) {
        saveUsername(username)
        set({
          username,
          page: PAGE.inGame,
        })
      },

      setCurrentGameStage(gameStage: GameStage) {
        set({ gameStage })
      },
    }),
    {
      name: "game-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export { useGameStore }
