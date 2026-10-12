import Image from "next/image";

/**
 * Official LuxeStay LA logo (mark + "LuxeStay" + "LOS ANGELES").
 * Vector files traced from the client-supplied artwork live in /public/brand.
 * "dark" = charcoal for light backgrounds, "light" = ivory for dark/photographic ones.
 */
const LOGO_RATIO = 4000 / 988; // viewBox of the traced SVGs

export function Logo({
  tone = "dark",
  className = "",
  priority = false,
  decorative = false,
}: {
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
  /** Use inside a link that already has an accessible name. */
  decorative?: boolean;
}) {
  return (
    <Image
      src={`/brand/luxestay-logo-${tone}.svg`}
      alt={decorative ? "" : "LuxeStay Los Angeles"}
      width={Math.round(48 * LOGO_RATIO)}
      height={48}
      unoptimized
      preload={priority}
      className={`w-auto ${className}`}
    />
  );
}
