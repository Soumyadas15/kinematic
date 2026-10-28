"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useSpringPreset } from "@/registry/kinematic/lib/motion"

const RingIdContext = React.createContext("")

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  const ringId = React.useId()

  return (
    <RingIdContext.Provider value={ringId}>
      <OTPInput
        data-slot="input-otp"
        containerClassName={cn(
          "flex items-center gap-2 has-disabled:opacity-50",
          containerClassName
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    </RingIdContext.Provider>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPRing() {
  const ringId = React.useContext(RingIdContext)
  const transition = useSpringPreset("snappy")

  return (
    <motion.span
      layoutId={ringId}
      aria-hidden
      data-slot="input-otp-ring"
      className="pointer-events-none absolute -inset-px rounded-[inherit] border border-ring ring-3 ring-ring/50 group-aria-invalid/slot:border-destructive group-aria-invalid/slot:ring-destructive/20 dark:group-aria-invalid/slot:ring-destructive/40"
      transition={transition}
    />
  )
}

function InputOTPChar({ char }: { char: string | null | undefined }) {
  const transition = useSpringPreset("snappy")

  return (
    <AnimatePresence initial={false}>
      {char && (
        <motion.span
          key={char}
          className="relative [grid-area:1/1]"
          initial={{ opacity: 0, scale: 0.5, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={transition}
        >
          {char}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function InputOTPCaret() {
  const transition = useSpringPreset("smooth")

  return (
    <motion.span
      aria-hidden
      data-slot="input-otp-caret"
      className="pointer-events-none absolute inset-0 m-auto h-4 w-px bg-foreground"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        ...transition,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 0.4,
      }}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "group/slot relative grid size-8 place-items-center border-y border-r border-input text-sm shadow-xs transition-[color,background-color,border-color,box-shadow] outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 dark:bg-input/30",
        className
      )}
      {...props}
    >
      {isActive && <InputOTPRing />}
      <InputOTPChar char={char} />
      {hasFakeCaret && <InputOTPCaret />}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
