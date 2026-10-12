/** Numbered steps. Each <Step> usually starts with an h3. */
export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="steps">{children}</div>
}

export function Step({ children }: { children: React.ReactNode }) {
  return <div className="step">{children}</div>
}
