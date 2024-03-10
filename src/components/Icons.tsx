import type { SVGProps } from 'react'

const Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    {...props}
  >
    {props.children}
  </svg>
)

export const IconSearch = (props: { className?: string }) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" vectorEffect="non-scaling-stroke" />
    <path d="m21 21-4.3-4.3" vectorEffect="non-scaling-stroke" />
  </Icon>
)

export const IconDisc = (props: { className?: string }) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" vectorEffect="non-scaling-stroke" />
    <path d="M6 12c0-1.7.7-3.2 1.8-4.2" vectorEffect="non-scaling-stroke" />
    <circle cx="12" cy="12" r="2" vectorEffect="non-scaling-stroke" />
    <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" vectorEffect="non-scaling-stroke" />
  </Icon>
)

export const IconAudio = (props: { className?: string }) => (
  <Icon {...props}>
    <path
      d="M2 10v3m4-7v11m4-14v18m4-13v7m4-10v13m4-8v3"
      className="fill-[red]"
      vectorEffect="non-scaling-stroke"
    />
  </Icon>
)

export const IconPause = (props: { className?: string }) => (
  <Icon {...props}>
    <path
      fill="currentColor"
      d="M15 16h-2V8h2m-4 8H9V8h2m1-6A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"
      vectorEffect="non-scaling-stroke"
    />
  </Icon>
)

export const IconPlay = (props: { className?: string }) => (
  <Icon {...props}>
    <path
      fill="currentColor"
      d="M10 16.5v-9l6 4.5M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"
      vectorEffect="non-scaling-stroke"
    />
  </Icon>
)

export const IconTop = (props: { className?: string }) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="6" vectorEffect="non-scaling-stroke" />
    <path
      d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"
      vectorEffect="non-scaling-stroke"
    />
  </Icon>
)
