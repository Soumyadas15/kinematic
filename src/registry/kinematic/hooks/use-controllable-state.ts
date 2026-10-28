"use client"

import * as React from "react"

type ControllableStateOptions<T> = {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>) {
  const [inner, setInner] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : inner

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setInner(next)
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  return [current, setValue] as const
}
