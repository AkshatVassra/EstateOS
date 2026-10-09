import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Estate<span className="text-gray-400">OS</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
          <Link href="/pricing" className="hover:text-primary">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost">Log in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="accent">Start free trial</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/command-center">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold">EstateOS</p>
          <p className="mt-2 text-sm text-gray-500">
            The AI operating system for real estate agencies.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/book-demo">Book demo</Link></li>
          </ul>
        </div>
        <div>
          <p className=" text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} EstateOS. All rights reserved.
      </div>
    </footer>
  );
}
