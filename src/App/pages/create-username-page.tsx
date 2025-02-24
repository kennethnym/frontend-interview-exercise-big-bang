import { ChangeEvent, FormEvent, useRef } from "react"
import { validateUsername } from "../game.ts"
import { useGameStore } from "../game-store.ts"
import { Button } from "../components/button.tsx"

const EMPTY_USERNAME_MESSAGE = "Username cannot be empty!"

function CreateUsernamePage() {
  const saveUsername = useGameStore((state) => state.saveUsername)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function createUsername(event: FormEvent<HTMLFormElement>) {
    // prevent default form redirection
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const username = form.get("username")
    if (
      username &&
      typeof username === "string" &&
      validateUsername(username)
    ) {
      saveUsername(username)
    }
  }

  function validateInput(event: ChangeEvent<HTMLInputElement>) {
    if (validateUsername(event.currentTarget.value)) {
      event.currentTarget.setCustomValidity("")
    } else {
      event.currentTarget.setCustomValidity(EMPTY_USERNAME_MESSAGE)
    }
  }

  return (
    <div className="w-full min-h-[inherit] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold dark:text-white">Welcome!</h1>
      <h2 className="text-2xl opacity-80 darK:text-white">
        Before the game starts, pick a username:
      </h2>
      <form onSubmit={createUsername} className="flex flex-col items-center">
        <input
          required
          ref={inputRef}
          name="username"
          type="text"
          placeholder="hunter2"
          onChange={validateInput}
          onInvalid={(event) => {
            // this is needed because the default error message for the required attr is different
            // which is separate from our custom validation
            event.currentTarget.setCustomValidity(EMPTY_USERNAME_MESSAGE)
          }}
          className="bg-transparent text-xl text-center my-8"
        />
        <Button type="submit">Continue</Button>
      </form>
    </div>
  )
}

export default CreateUsernamePage
