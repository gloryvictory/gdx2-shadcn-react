import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import BtnInfo from "./btn-info"
import { nanoid } from "nanoid"
import { CalendarDays } from "lucide-react"

const updates = [
  { date: '16.06.2025', description: 'Экспорт таблицы в csv и буфер обмена' },
  { date: '16.06.2025', description: 'Копирование пути отчета в буфер обмена' },
  { date: '01.03.2025', description: 'Переход на карту' },
  { date: '01.03.2025', description: 'Пожелания' },
  { date: '17.03.2025', description: 'Фильтр' },
]

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <BtnInfo />
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 opacity-70" />
            <h3 className="font-semibold">История изменений</h3>
          </div>
          
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-accent">
                <tr>
                  <th className="font-medium px-4 py-2 text-left w-[100px]">Дата</th>
                  <th className="font-medium px-4 py-2 text-left">Изменение</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {updates.map((update) => (
                  <tr key={nanoid()}>
                    <td className="px-4 py-2 font-mono text-muted-foreground">
                      {update.date}
                    </td>
                    <td className="px-4 py-2">
                      {update.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-xs text-muted-foreground text-right">
            Обновлено: {new Date().toLocaleDateString('ru-RU')} • vzam
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default HoverCardDemo
