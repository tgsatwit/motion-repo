// Small inline icon set (24×24, stroke-based) so the starter has no icon dependency.
type P = React.SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 16, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (p: P) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
export const SunIcon = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Svg>
export const MoonIcon = (p: P) => <Svg {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></Svg>
export const MenuIcon = (p: P) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>
export const CloseIcon = (p: P) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>
export const CopyIcon = (p: P) => <Svg {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></Svg>
export const CheckIcon = (p: P) => <Svg {...p}><path d="m5 12 5 5L20 7" /></Svg>
export const ArrowRight = (p: P) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
export const ArrowLeft = (p: P) => <Svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>
export const ReplayIcon = (p: P) => <Svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></Svg>
export const PlayIcon = (p: P) => <Svg {...p}><path d="M7 4v16l13-8Z" fill="currentColor" /></Svg>
export const PauseIcon = (p: P) => <Svg {...p}><path d="M7 4h3v16H7zM14 4h3v16h-3z" fill="currentColor" /></Svg>
export const InfoIcon = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>
export const WarnIcon = (p: P) => <Svg {...p}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></Svg>
export const TipIcon = (p: P) => <Svg {...p}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z" /></Svg>
export const DangerIcon = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" /></Svg>
export const GithubIcon = (p: P) => <Svg {...p}><path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></Svg>
export const ChevronDown = (p: P) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>
export const SparkIcon = (p: P) => <Svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></Svg>
export const BookIcon = (p: P) => <Svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /></Svg>
export const LayersIcon = (p: P) => <Svg {...p}><path d="m12 2 10 5-10 5L2 7l10-5Z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></Svg>
export const CursorIcon = (p: P) => <Svg {...p}><path d="m4 4 7 17 2.5-7.5L21 11 4 4Z" /></Svg>
export const ScrollIcon = (p: P) => <Svg {...p}><rect x="6" y="3" width="12" height="18" rx="6" /><path d="M12 7v4" /></Svg>
export const WaveIcon = (p: P) => <Svg {...p}><path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" /></Svg>
export const TerminalIcon = (p: P) => <Svg {...p}><path d="m4 17 6-5-6-5M12 19h8" /></Svg>
export const BotIcon = (p: P) => <Svg {...p}><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 8V4M9 14h.01M15 14h.01" /></Svg>
export const TimelineIcon = (p: P) => <Svg {...p}><path d="M3 6h10M3 12h18M3 18h7" /><circle cx="16" cy="6" r="2" /><circle cx="13" cy="18" r="2" /></Svg>
