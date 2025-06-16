import { MainNav } from "@/components/main-nav";
import { BtnModeToggle } from "@/components/ui/btn-modetoggle";
import { siteConfig } from "@/config/site";
import { BtnRefresh } from "./ui/btn-clear";
import HoverCardDemo from "./ui/hover-card-info";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="h-14 shadow-inner bg-opacity-15 w-full lg:max-w-screen-xl top-0 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card border-slate-600">
      <div className="flex items-center flex-1">
        <MainNav items={siteConfig.mainNav} />
      </div>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-3">
        <BtnModeToggle />
        <BtnRefresh />
        <HoverCardDemo />
      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] p-2">
            {siteConfig.mainNav.map((item) => (
              <DropdownMenuItem key={item.title} asChild>
                <a
                  href={item.href}
                  className="w-full px-2 py-1.5 relative transition-all duration-200 hover:scale-105 hover:font-medium"
                >
                  <span className="relative">
                    {item.title}
                    <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuItem className="p-0 hover:bg-transparent focus:bg-transparent">
              <div className="w-full px-2 py-1.5 transition-all duration-200 hover:scale-105 justify-start hover:font-medium">
                <BtnModeToggle />
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="p-0 hover:bg-transparent focus:bg-transparent">
              <div className="w-full px-2 py-1.5 transition-all duration-200 hover:scale-105 justify-start hover:font-medium">
                <BtnRefresh  />
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="p-0 hover:bg-transparent focus:bg-transparent">
              <div className="w-full px-2 py-1.5 transition-all duration-200 hover:scale-105 justify-start hover:font-medium">
                <HoverCardDemo />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
