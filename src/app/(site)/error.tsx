"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/layout";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="pt-36 pb-28 lg:pt-48 lg:pb-36">
      <div className="max-w-2xl">
        <Eyebrow>Something went wrong</Eyebrow>
        <h1 className="mt-6 font-serif text-headline">We couldn&rsquo;t load this page.</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Please try again. If the problem continues, our team is happy to help directly.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button onClick={() => retry()}>Try Again</Button>
          <Link href="/contact" className="text-sm underline underline-offset-4">
            Contact us
          </Link>
        </div>
      </div>
    </Container>
  );
}
