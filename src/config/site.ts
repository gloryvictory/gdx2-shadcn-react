export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Отчеты",
  description:
    "Сервис по отчетам ЗапСибНИИГГ",
  mainNav: [
    {
      title: "Поиск",
      href: "/search",
    },
    {
      title: "Карта",
      href: "/map",
    },
    {
      title: "Пожелания",
      href: "/message",
    },
    {
      title: "Фильтр",
      href: "/filter",
    },
  ],
}
