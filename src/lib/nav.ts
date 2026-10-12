import { nav, type NavItem } from "@/site.config";

export type FlatNavItem = NavItem & { href: string; group: string };

/** Every linkable sidebar entry, in sidebar order. Powers prev/next and search. */
export const flatNav: FlatNavItem[] = nav.flatMap((group) =>
  group.items
    .filter((item): item is NavItem & { href: string } => Boolean(item.href) && !item.disabled)
    .map((item) => ({ ...item, group: group.title })),
);

export function getPagination(pathname: string) {
  const index = flatNav.findIndex((item) => item.href === pathname);
  if (index === -1) return { previous: undefined, next: undefined };
  return { previous: flatNav[index - 1], next: flatNav[index + 1] };
}
