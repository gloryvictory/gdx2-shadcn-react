// import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
// import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
// import { Link } from "react-router-dom"
import { BtnRefresh } from "./btn-clear"

export function SiteHeader() {
  return (
    // <header className="sticky top-0 z-40 w-full border-b bg-background">
    <header className="h-14 shadow-inner bg-opacity-15 w-full lg:max-w-screen-xl top-0 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card border-slate-600">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 ">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {/* <Link to={siteConfig.links.github} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              to={siteConfig.links.youtube}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </div>
            </Link> */}
            <ModeToggle />
            <BtnRefresh/>
          </nav>
        </div>
      </div>
    </header>
  )
}
