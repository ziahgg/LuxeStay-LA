import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "@/components/dashboard/sign-in-form";
import { Logo } from "@/components/layout/logo";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { PlaceholderNote } from "@/components/ui/layout";
import { getCurrentResident } from "@/lib/auth/dal";
import { getIdentityProvider } from "@/lib/auth/providers";
import { photos } from "@/lib/images";
import { residentPortalUrl } from "@/lib/resident/config";

export const metadata: Metadata = {
  title: "Resident Sign In",
};

export default function LoginPage(props: PageProps<"/dashboard/login">) {
  return (
    <main id="main" className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden bg-charcoal lg:block">
        <Image
          src={photos.archResidences.src}
          alt=""
          fill
          sizes="50vw"
          quality={75}
          preload
          className="object-cover saturate-[0.72]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-charcoal/45" />
        <div className="absolute inset-x-12 bottom-12 text-ivory">
          <p className="eyebrow text-stone">Resident Dashboard</p>
          <p className="mt-4 max-w-md font-serif text-[2.5rem] leading-tight">
            Everything for your stay, in one place.
          </p>
        </div>
      </div>

      <div className="flex flex-col px-5 py-8 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="LuxeStay LA — back to website">
            <Logo tone="dark" decorative className="h-10" />
          </Link>
          <Link href="/" className="text-sm underline-offset-4 hover:underline">
            Back to website
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-16">
          <h1 className="font-serif text-headline font-normal">Resident sign in</h1>
          <Suspense fallback={<div className="mt-10 h-72 animate-pulse bg-stone-soft" aria-hidden="true" />}>
            <SignInArea searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function SignInArea({ searchParams }: Pick<PageProps<"/dashboard/login">, "searchParams">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/dashboard";
  const provider = getIdentityProvider();
  const resident = await getCurrentResident();

  if (resident) {
    return (
      <div className="mt-8">
        <p className="leading-relaxed text-muted">
          You&rsquo;re signed in as <span className="text-charcoal">{resident.firstName}</span>.
        </p>
        <ButtonLink href="/dashboard" arrow className="mt-6">
          Go to Dashboard
        </ButtonLink>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="mt-8 space-y-6">
        <p className="leading-relaxed text-muted">
          Online sign-in for the LuxeStay LA Resident Dashboard isn&rsquo;t available yet. Current residents can
          manage payments, maintenance requests and documents through the official resident portal.
        </p>
        <div className="flex flex-wrap gap-3">
          {residentPortalUrl ? (
            <ExternalButtonLink href={residentPortalUrl}>Open Resident Portal</ExternalButtonLink>
          ) : null}
          <ButtonLink href="/contact?type=resident" variant={residentPortalUrl ? "secondary" : "primary"}>
            Contact Resident Support
          </ButtonLink>
        </div>
        {!residentPortalUrl && (
          <PlaceholderNote>The official resident portal link will be added once provided by LuxeStay LA.</PlaceholderNote>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8">
      {sp.signedOut === "1" && (
        <p role="status" className="mb-6 bg-stone-soft px-4 py-3 text-sm text-muted">
          You&rsquo;ve been signed out.
        </p>
      )}
      <p className="mb-8 leading-relaxed text-muted">Sign in to view your residence, requests and documents.</p>
      <SignInForm next={next} />
      {provider.id === "fixtures" && (
        <PlaceholderNote className="mt-8">
          <strong className="font-semibold text-charcoal">Development sign-in.</strong> Only fictional fixture
          residents can sign in here. Their emails and the shared development password are configured in{" "}
          <code className="text-xs">.env.local</code>; this sign-in method is disabled in production.
        </PlaceholderNote>
      )}
      {residentPortalUrl && (
        <p className="mt-8 text-sm text-muted">
          Looking for payments or the full resident portal?{" "}
          <a href={residentPortalUrl} target="_blank" rel="noopener noreferrer" className="text-charcoal underline underline-offset-4">
            Open RentCafe<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      )}
    </div>
  );
}
