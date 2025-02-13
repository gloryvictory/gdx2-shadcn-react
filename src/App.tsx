import { SiteHeader } from "@/components/site-header"
import { useRoutes } from "react-router-dom"
import { TailwindIndicator } from "./components/tailwind-indicator"
import { Button } from "@/components/ui/button"


const routes = [{ path: "/", element: <Home /> }]

function Home() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Vite Ready.
        </p>
      </div>
      <div>
      <Button>Click me</Button>
    </div>
      <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos veritatis impedit consequatur itaque deleniti error aliquid magni aperiam, earum modi sed laudantium fugit, perspiciatis accusantium, alias id fugiat rerum odio nam ducimus consequuntur dolorum. Mollitia, nostrum odit obcaecati libero aspernatur molestias soluta aut voluptatem possimus incidunt! Blanditiis ipsam odit expedita ducimus illo. Nostrum ea exercitationem maxime recusandae fugiat quis iusto consequatur? Est architecto velit illum id quaerat voluptatem odit, eum at nihil, iste molestiae ex neque totam quibusdam officia ea cumque alias esse itaque optio quidem debitis libero! Tempore quod voluptatem earum minima atque saepe voluptates obcaecati quis officia deleniti dolores dicta, odit fugit quas pariatur, illum dolorem maxime optio vel exercitationem distinctio. Laudantium omnis veniam ut quidem blanditiis ipsa. Expedita cumque quisquam odio pariatur autem distinctio, ea maiores, accusantium reiciendis eius, explicabo tempore minima corporis iusto adipisci. Placeat consectetur rem pariatur, minima explicabo ea iste quisquam qui similique corporis quae vitae ratione illo dolor soluta corrupti dignissimos quo delectus aliquam facilis! Velit sequi alias consequuntur omnis fugiat, minima laudantium sapiente non aliquam doloremque! Nihil, natus. Error consectetur voluptatibus suscipit delectus nisi tempora iste odit repellendus aspernatur sint reprehenderit iusto fugiat maiores deserunt aliquid, quo nihil rerum officiis, placeat qui rem corporis quae expedita. In voluptatibus corrupti quas enim temporibus libero quaerat quod veritatis modi alias. Fugit praesentium, magnam cumque ad ut perferendis aliquid a sunt consequuntur dignissimos necessitatibus fugiat ex maiores officiis perspiciatis pariatur error consequatur ullam consectetur dolorem non. Aspernatur, a id dignissimos vero ipsam rem accusantium temporibus obcaecati debitis commodi ducimus sit? Totam recusandae esse maxime expedita laudantium, doloribus eligendi dolorem fugit error ex rerum reiciendis aliquam sequi, enim porro veritatis unde accusantium deleniti facere non cumque laboriosam beatae hic! Aliquid ad quos ipsa, reiciendis amet eligendi, delectus libero optio, eius odio recusandae dolore eaque ipsum quam illo dolores numquam. Similique soluta aperiam nulla autem consectetur neque quia, eum accusantium voluptatum cupiditate, molestias, dolor quod distinctio perspiciatis illo id. Cupiditate dicta vero, eaque impedit, corporis dolor eum omnis minima deleniti reiciendis architecto neque reprehenderit pariatur aut magni provident quis, itaque quam. Dicta corrupti, soluta eius incidunt voluptas aspernatur, ducimus amet perferendis, vitae consectetur illo nulla ex vero. Sapiente, iure quam libero doloribus atque ad accusamus nostrum rerum magni ratione temporibus error ipsa omnis? Deserunt quisquam accusantium non blanditiis id quaerat nemo voluptatum deleniti explicabo nostrum at quibusdam ex magnam nisi reiciendis eos exercitationem, molestiae magni quia natus eum maxime aut? Veritatis animi qui dolorem ipsa placeat aspernatur est corporis, eaque iusto fuga possimus id enim voluptatem ullam magnam deserunt harum sint repellat perspiciatis voluptate debitis esse, maiores tenetur illum? Tenetur dicta doloremque cupiditate nesciunt sapiente minus libero asperiores atque, eum exercitationem eos blanditiis ab quasi voluptatem architecto magnam repudiandae cum. Consequatur aliquam sequi provident, dolorum debitis quae pariatur assumenda illum, eius, aut earum tenetur totam molestias nam dicta dolor incidunt consequuntur ratione fuga libero! Nulla id adipisci tempora dicta in quibusdam qui unde. Placeat distinctio ad fuga error similique, id, deserunt magni soluta officiis aspernatur consequatur obcaecati!</div>
    </section>
  )
}

function App() {
  const children = useRoutes(routes)

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
      </div>

      <TailwindIndicator />
    </>
  )
}

export default App
