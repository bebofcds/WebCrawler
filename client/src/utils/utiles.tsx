
export function shortLabel(name: string): string {
  try {
    const url = new URL(name);
    const path = url.pathname === "/" ? url.hostname : url.pathname;
    const segments = path.replace(/\/$/, "").split("/");
    const last = segments[segments.length - 1] || url.hostname;
    return decodeURIComponent(last).slice(0, 28) || url.hostname;
  } catch {
    return name.length > 28 ? name.slice(0, 26) + "…" : name;
  }
}

export const VerticalLine = () => (
  <div className="w-[2px] h-5 bg-gray-400/40" />
);