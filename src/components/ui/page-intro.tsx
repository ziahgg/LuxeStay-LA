import type { ReactNode } from "react";
import { Container, Eyebrow } from "./layout";

/** Editorial header used at the top of interior pages. */
export function PageIntro({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Container className="pt-36 pb-12 lg:pt-48 lg:pb-16">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow className="mb-6 animate-fade-up">{eyebrow}</Eyebrow>
          <h1 className="animate-fade-up font-serif text-display font-normal text-charcoal [animation-delay:80ms]">
            {title}
          </h1>
        </div>
        {(children || aside) && (
          <div className="animate-fade-up text-[1.0625rem] leading-relaxed text-muted [animation-delay:160ms] lg:col-span-4 lg:col-start-9">
            {children}
            {aside}
          </div>
        )}
      </div>
    </Container>
  );
}
