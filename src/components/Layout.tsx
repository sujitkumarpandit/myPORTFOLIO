import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { MobileBottomNav } from "./MobileBottomNav";
import { BackToTop } from "./BackToTop";
import { BeyondCodeModal } from "./BeyondCodeModal";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] font-body relative">
      <div className="fixed inset-0 pointer-events-none z-0 global-bg-grid opacity-100" />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <TopNav />
        
        {/* 
          This is the main structural container.
          Pages like Home/Feed will insert the responsive column grid inside this.
        */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8 pb-24 md:pb-12">
          {children}
        </main>
        
        <Footer />
        <BackToTop />
        <MobileBottomNav />
      </div>
      <CommandPalette />
      <BeyondCodeModal />
    </div>
  );
}
