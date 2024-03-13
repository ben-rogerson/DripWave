import { IconDrip } from '@/components/Icons'

/**
 * Splash page animation that shows on load.
 */
export const Introduction = () => (
  <div className="pointer-events-none fixed z-40 h-[100dvh] w-[100dvw] overflow-hidden">
    <div className="absolute grid h-full w-full place-content-center bg-background delay-2000 duration-1000 animate-out fade-out fill-mode-forwards">
      <div className="-ml-4 -mt-6 flex items-center gap-1 text-3xl delay-0 duration-1000 ease-out animate-in zoom-in-125 fill-mode-backwards sm:text-4xl">
        <IconDrip className="-mt-4 text-[175%]" />
        <div>DripWave</div>
      </div>
    </div>
  </div>
)
