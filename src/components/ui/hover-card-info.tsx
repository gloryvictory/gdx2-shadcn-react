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
  'Добавлено:',
  '1.03.2025 "Переход на карту"',
  '1.03.2025 "Пожелания"',
  '17.03.2025 "Фильтр"',
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
      </HoverCardContent>
    </HoverCard>
  )
}
export default HoverCardDemo;
