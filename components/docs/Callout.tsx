import { DangerIcon, InfoIcon, TipIcon, WarnIcon } from "@/components/site/Icons"

const variants = {
  info: { color: "var(--info)", Icon: InfoIcon },
  tip: { color: "var(--success)", Icon: TipIcon },
  warning: { color: "var(--warn)", Icon: WarnIcon },
  danger: { color: "var(--danger)", Icon: DangerIcon },
}

type Props = {
  type?: keyof typeof variants
  title?: string
  children: React.ReactNode
}

export function Callout({ type = "info", title, children }: Props) {
  const { color, Icon } = variants[type]
  return (
    <div className="callout" style={{ "--c": color } as React.CSSProperties}>
      <Icon size={17} />
      <div>
        {title && <div className="callout-title">{title}</div>}
        {children}
      </div>
    </div>
  )
}
