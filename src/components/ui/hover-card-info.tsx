import { CalendarDays } from "lucide-react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import BtnInfo from "./btn-info"
import { nanoid } from "nanoid"
// asChild

const data:Array<string>=[
  'Добавлено "Переход на карту"',
  'Добавлено "Пожелания"',
]


export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger  >
        <BtnInfo/>
      </HoverCardTrigger>
      <HoverCardContent  className="w-80">
        {
          data.map((item)=>(
            <div key={nanoid()} className="flex justify-between space-x-4">
              <div className="space-y-1">
                {item}
              </div>
            </div>
          ))

        }
        <span className="text-xs text-muted-foreground">
          vzam
        </span>
        {/* <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div> */}
      </HoverCardContent>
    </HoverCard>
  )
}
export default HoverCardDemo;
