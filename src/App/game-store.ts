import { create } from "zustand"
import { PAGE, Page } from "./pages/page.ts"
import {
  Choice,
  compareChoices,
  GAME_SCREEN,
  GameRound,
  GameScreen,
  generateChoice,
  loadUsername,
  OUTCOME,
  Outcome,
  ROUND_STATE,
  RoundState,
  saveUsername,
  Username,
} from "./game.ts"
import { persist, createJSONStorage } from "zustand/middleware"

interface GameState {
  page: Page
  username: Username | null
  gameScreen: GameScreen
  gameRound: GameRound | null
  isInGameMenuOpen: boolean
  computerScore: number
  playerScore: number

  initializeGame: () => void
  saveUsername: (username: Username) => void
  setCurrentGameScreen: (gameScreen: GameScreen) => void
  advanceToNextRound: () => void
  setCurrentRoundState: (state: RoundState) => void
  setPlayerChoice: (choice: Choice) => Outcome
  setIsInGameMenuOpen: (open: boolean) => void
  resetGame: () => void
}

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      page: PAGE.loading,
      username: null,
      gameScreen: GAME_SCREEN.landing,
      isInGameMenuOpen: false,
      gameRound: null,
      playerScore: 0,
      computerScore: 0,

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

      setCurrentGameScreen(gameScreen: GameScreen) {
        set({ gameScreen })
      },

      advanceToNextRound() {
        set((state) => {
          const roundNumber = state.gameRound ? state.gameRound.number + 1 : 1
          const gameRound: GameRound = {
            number: roundNumber,
            // if we have never started a round before
            // show greeting first, i.e. player labels
            state: state.gameRound
              ? ROUND_STATE.starting
              : ROUND_STATE.greeting,
            computerChoice: generateChoice(),
            playerChoice: null,
            outcome: null,
          }
          return { gameRound }
        })
      },

      setCurrentRoundState(roundState: RoundState) {
        set((state) =>
          state.gameRound
            ? {
                ...state,
                gameRound: {
                  ...state.gameRound,
                  state: roundState,
                },
              }
            : {},
        )
      },

      setPlayerChoice(choice: Choice): Outcome {
        const currentRound = get().gameRound
        if (!currentRound) {
          throw new Error("game has not started!")
        }
        const outcome = compareChoices(choice, currentRound.computerChoice)
        if (currentRound.playerChoice) {
          return outcome
        }

        let newComputerScore = get().computerScore
        let newPlayerScore = get().playerScore

        switch (outcome) {
          case OUTCOME.won:
            newPlayerScore++
            break
          case OUTCOME.lost:
            newComputerScore++
            break
          default:
            break
        }

        set(() => ({
          computerScore: newComputerScore,
          playerScore: newPlayerScore,
          gameRound: {
            ...currentRound,
            state: ROUND_STATE.revealed,
            outcome,
            playerChoice: choice,
          },
        }))

        return outcome
      },

      setIsInGameMenuOpen(open: boolean) {
        set({ isInGameMenuOpen: open })
      },

      resetGame() {
        set({
          computerScore: 0,
          playerScore: 0,
          gameRound: null,
          gameScreen: GAME_SCREEN.landing,
        })
      },
    }),
    {
      name: "game-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export { useGameStore }
