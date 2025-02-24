import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"
import clsx from "clsx"

function Button({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={clsx(
        className,
        "rounded relative text-neutral-100 bg-blue-500 px-3 py-1 after:content-[''] after:block after:absolute after:-z-10 after:inset-0 after:rounded after:h-inherit after:bg-blue-800 after:translate-y-1 active:translate-y-0.5 active:after:hidden active:bg-blue-800",
      )}
      {...props}
    />
  )
}

export { Button }
