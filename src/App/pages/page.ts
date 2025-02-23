import { lazy } from "react"

const PAGE = {
  loading: "loading",
  createUsername: "createUsername",
  inGame: "inGame",
} as const

const PAGE_MAP = {
  [PAGE.createUsername]: lazy(() => import("./create-username-page.tsx")),
  [PAGE.inGame]: lazy(() => import("./in-game/in-game-page.tsx")),
} as const

type Page = (typeof PAGE)[keyof typeof PAGE]

export { PAGE, PAGE_MAP }
export type { Page }
