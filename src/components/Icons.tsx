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

interface SVGIconProps {
  className?: string
}

export const IconSearch = (props: SVGIconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" vectorEffect="non-scaling-stroke" />
    <path d="m21 21-4.3-4.3" vectorEffect="non-scaling-stroke" />
  </Icon>
)

export const IconDisc = (props: SVGIconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" vectorEffect="non-scaling-stroke" />
    <path d="M6 12c0-1.7.7-3.2 1.8-4.2" vectorEffect="non-scaling-stroke" />
    <circle cx="12" cy="12" r="2" vectorEffect="non-scaling-stroke" />
    <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" vectorEffect="non-scaling-stroke" />
  </Icon>
)

export const IconAudio = (props: SVGIconProps) => (
  <Icon {...props}>
    <path
      d="M2 10v3m4-7v11m4-14v18m4-13v7m4-10v13m4-8v3"
      className="fill-[red]"
      vectorEffect="non-scaling-stroke"
    />
  </Icon>
)

export const IconPause = (props: SVGIconProps) => (
  <Icon {...props}>
    <path d="M6 4h4v16H6zm8 0h4v16h-4z" vectorEffect="non-scaling-stroke" />
  </Icon>
)

export const IconPlay = (props: SVGIconProps) => (
  <Icon {...props}>
    <path d="m6 3 14 9-14 9z" vectorEffect="non-scaling-stroke" />
  </Icon>
)

export const IconTop = (props: SVGIconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="6" vectorEffect="non-scaling-stroke" />
    <path
      d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"
      vectorEffect="non-scaling-stroke"
    />
  </Icon>
)

export const IconDrip = (props: SVGIconProps) => (
  <Icon {...props} strokeWidth={0} viewBox="0 0 14 19">
    <path
      fill="currentColor"
      d="M7 19a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S7.5 2.5 7 0c-.5 2.5-2 4.9-4 6.5S0 10 0 12a7 7 0 0 0 7 7"
    />
    <path
      fill="#000"
      d="M11.81 11.785a.7.7 0 0 1-.383-.116c-2.117-1.263-5.901-1.566-8.35-.883-.108.03-.242.078-.384.078A.686.686 0 0 1 2 10.162c0-.404.25-.633.517-.71C3.564 9.146 4.735 9 6.01 9c2.17 0 4.445.452 6.107 1.42.231.135.383.319.383.673a.69.69 0 0 1-.69.692m-.921 2.265c-.155 0-.259-.068-.366-.125-1.858-1.1-4.629-1.542-7.093-.874-.143.039-.22.078-.354.078a.577.577 0 0 1-.577-.577c0-.318.155-.53.461-.615a10 10 0 0 1 2.908-.404c1.929 0 3.793.478 5.262 1.352a.62.62 0 0 1 .335.585.576.576 0 0 1-.576.58m-.8 1.95c-.125 0-.202-.039-.318-.107-1.855-1.118-4.013-1.165-6.145-.728-.116.03-.267.077-.354.077a.463.463 0 0 1-.47-.47c0-.306.182-.451.405-.499 2.435-.538 4.923-.49 7.045.779.182.116.289.22.289.49a.45.45 0 0 1-.452.458"
    />
  </Icon>
)

export const IconCross = (props: SVGIconProps) => (
  <Icon {...props}>
    <path d="M18 6 6 18M6 6l12 12" vectorEffect="non-scaling-stroke" />
  </Icon>
)
