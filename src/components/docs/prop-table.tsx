export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export function PropTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-bg-subtle text-xs uppercase tracking-wider text-fg-faint">
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Default</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-border align-top">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-accent">
                {row.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-fg-muted">
                {row.type}
              </td>
              <td className="hidden whitespace-nowrap px-4 py-3 font-mono text-[13px] text-fg-faint sm:table-cell">
                {row.default ?? "-"}
              </td>
              <td className="px-4 py-3 leading-relaxed text-fg-muted">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
