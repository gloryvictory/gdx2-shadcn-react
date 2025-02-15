import { gdx2_urls } from "./urls";

// interface StatCardProps {
//   title : string , 
//   url   : string, 
//   link?: string
// }

export interface IStatList {
  title?: string
  url?: string
  link?: string
  }
  

export const list_stat: IStatList[] = [
  {
    title: "Отчетов",
    url: gdx2_urls.gdx2_url_report_count,
    link: "/table/report",
  },
  {
    title: "Авторов",
    url: gdx2_urls.gdx2_url_report_author_count,
    link: "/table/author",
  },
  {
    title: "Листов карт",
    url: gdx2_urls.gdx2_url_report_list_count,
    link: "/table/list",
  },
  {
    title: "Субъектов РФ",
    url: gdx2_urls.gdx2_url_report_subrf_count,
    link: "/table/subrf",
  },
  {
    title: "Организаций",
    url: gdx2_urls.gdx2_url_report_org_count,
    link: "/table/org",
  },
  {
    title: "Площадей",
    url: gdx2_urls.gdx2_url_report_area_count,
    link: "/table/areaoil",
  },
  {
    title: "Месторождений",
    url: gdx2_urls.gdx2_url_report_field_count,
    link: "/table/field",
  },
  {
    title: "Лицензий",
    url: gdx2_urls.gdx2_url_report_lu_count,
    link: "/table/lu",
  },
  {
    title: "Полезных ископаемых",
    url: gdx2_urls.gdx2_url_report_pi_count,
    link: "/table/pi",
  },
  {
    title: "Видов работ",
    url: gdx2_urls.gdx2_url_report_vid_rab_count,
    link: "/table/vidrab",
  },
];
