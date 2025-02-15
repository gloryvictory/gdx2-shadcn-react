export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Отчеты",
  description:
    "Сервис по отчетам ЗапСибНИИГГ",
  mainNav: [
    {
      title: "Статистика",
      href: "/stat",
    },
    {
      title: "Поиск",
      href: "/search",
    },
    {
      title: "Карта",
      href: "/map",
    },
  ],
  links: {
    youtube: "https://youtube.com/@m6io",
    github: "https://github.com/m6io/shadcn-vite-template",
    docs: "https://ui.shadcn.com",
  },
}
