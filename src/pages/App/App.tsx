import { SiteHeader } from "@/components/site-header"
import { useRoutes } from "react-router-dom"
import { TailwindIndicator } from "../../components/tailwind-indicator"
import { routes } from "../../routes"


function App() {
  const children = useRoutes(routes)

  return (
    <>
      {/* <div className="relative flex min-h-screen flex-col"> */}
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
      </div>

      <TailwindIndicator />
    </>
  )
}

export default App
