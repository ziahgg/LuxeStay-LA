"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PropertyImage } from "@/lib/properties/types";

/**
 * Property gallery.
 * - Desktop: editorial mosaic (one large + two stacked).
 * - Mobile: the lead image only (secondary tiles are display:none and lazy,
 *   so they never download), with a clear "View photos" control.
 * - Lightbox: native <dialog> (focus containment + Escape), arrow keys,
 *   swipe, previous/next buttons and an announced position.
 */
export function Gallery({ images, name }: { images: PropertyImage[]; name: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const count = images.length;

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [go]);

  if (count === 0) {
    return (
      <div
        className="flex aspect-[16/9] items-center justify-center bg-stone text-sm text-muted"
        role="img"
        aria-label={`No photographs available for ${name}`}
      >
        Photography coming soon
      </div>
    );
  }

  const [hero, ...rest] = images;

  return (
    <div>
      <div className="relative grid gap-3 md:h-[min(72vh,44rem)] md:grid-cols-[2fr_1fr] md:grid-rows-2">
        <button
          type="button"
          onClick={() => open(0)}
          className="group relative aspect-[4/3] overflow-hidden bg-stone md:row-span-2 md:aspect-auto"
          aria-label={`Open photo gallery (${count} photos): ${hero.alt}`}
        >
          <Image
            src={hero.src}
            alt=""
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            quality={80}
            preload
            className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.03]"
          />
          <span className="absolute right-4 bottom-4 bg-paper px-3.5 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-charcoal uppercase md:hidden">
            View {count} photos
          </span>
        </button>
        {rest.slice(0, 2).map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => open(i + 1)}
            className="group relative hidden overflow-hidden bg-stone md:block"
            aria-label={`Open photo ${i + 2} of ${count}: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt=""
              fill
              sizes="33vw"
              quality={70}
              className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.04]"
            />
            {i === 1 && count > 3 && (
              <span className="absolute right-4 bottom-4 bg-paper px-4 py-2.5 text-xs font-semibold tracking-[0.14em] text-charcoal uppercase">
                View all {count} photos
              </span>
            )}
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={`${name} photo gallery`}
        className="focus-light m-0 h-dvh max-h-none w-screen max-w-none bg-charcoal p-0 text-ivory backdrop:bg-charcoal"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="text-sm tracking-[0.08em]" aria-live="polite">
              Photo {index + 1} of {count}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className="inline-flex h-11 items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase"
            >
              Close
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M1 1l14 14M15 1 1 15" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
          <figure
            className="relative flex-1 touch-pan-y"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <Image
              key={images[index].src}
              src={images[index].src}
              alt={images[index].alt}
              fill
              sizes="100vw"
              quality={80}
              className="animate-[fade-in_0.4s_ease] object-contain"
            />
          </figure>
          <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
            <button
              type="button"
              onClick={() => go(-1)}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-ivory/40 transition-colors hover:bg-ivory hover:text-charcoal"
              aria-label="Previous photo"
            >
              <svg aria-hidden="true" width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M18 5H2M6 1 2 5l4 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <p className="line-clamp-2 max-w-xl text-center text-sm text-stone">{images[index].alt}</p>
            <button
              type="button"
              onClick={() => go(1)}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-ivory/40 transition-colors hover:bg-ivory hover:text-charcoal"
              aria-label="Next photo"
            >
              <svg aria-hidden="true" width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
