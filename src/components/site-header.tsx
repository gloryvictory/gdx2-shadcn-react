import { MainNav } from "@/components/main-nav"
import { BtnModeToggle } from "@/components/ui/btn-modetoggle"
import { siteConfig } from "@/config/site"
import { BtnRefresh } from "./ui/btn-clear"
import HoverCardDemo from "./ui/hover-card-info"

export function SiteHeader() {
  return (
    // <header className="sticky top-0 z-40 w-full border-b bg-background">
    <header className="h-14 shadow-inner bg-opacity-15 w-full lg:max-w-screen-xl top-0 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card border-slate-600">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 ">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-end gap-3">
            
            <BtnModeToggle />
            <BtnRefresh/>
            <HoverCardDemo/>
          </nav>
        </div>
      </div>
    </header>
  )
}
