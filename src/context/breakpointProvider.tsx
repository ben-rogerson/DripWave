import { useContext, createContext, useMemo } from 'react'
import { useBodyWidth } from 'mezz'
import { getTailwindBodyWidthConfig } from 'mezz/tailwind'
import { screens } from '../../tailwind.config'
import type { ReactNode } from 'react'

const mezzBodyWidthConfig = getTailwindBodyWidthConfig(screens)

type BodyWidthKeys = keyof typeof mezzBodyWidthConfig
type BreakpointContextType = ReturnType<typeof useBodyWidth<BodyWidthKeys>>

export const BreakpointProvider = (props: { children: ReactNode }) => {
  const cachedMezzConfig = useMemo(() => mezzBodyWidthConfig, [])
  const size = useBodyWidth(cachedMezzConfig)

  return (
    <BreakpointContext.Provider value={size}>
      {props.children}
    </BreakpointContext.Provider>
  )
}

const BreakpointContext = createContext<BreakpointContextType | null>(null)

export const useBreakpoint = () => {
  const context = useContext(BreakpointContext)
  if (!context) {
    throw new Error('useBreakpoint must be used within a BreakpointProvider')
  }

  return context
}
