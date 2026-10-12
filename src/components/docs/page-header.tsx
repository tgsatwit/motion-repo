export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-fg-muted">{description}</p>
      )}
    </div>
  );
}
