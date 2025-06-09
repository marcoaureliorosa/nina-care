import React from "react"
import InputMask from "react-input-mask"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export const InputMaskPhone = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ ...props }, ref) => (
    <InputMask
      mask="(99) 99999-9999"
      maskChar={null}
      alwaysShowMask={false}
      {...props}
    >
      {(inputProps: any) => <input ref={ref} {...inputProps} className={props.className} />}
    </InputMask>
  )
)
InputMaskPhone.displayName = "InputMaskPhone"

export { Input }
