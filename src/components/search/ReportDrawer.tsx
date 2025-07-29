import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { buttonVariants } from "@/components/ui/button"
import { ICountOnMap, IReport, IResult } from "@/types/models";
import './styles.css'
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { gdx2_urls } from "@/config/urls";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { toast } from "sonner";
//import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from "ag-grid-community";

type PropsDrawer = {
  open: boolean,
  onClose: () => void,
  item: IReport | undefined
}

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

interface DescriptionItemWithMapProps {
  title: string;
  content: React.ReactNode;
  item: IReport | undefined;
}

const result: ICountOnMap = {
  sta_count: 0,
  stl_count: 0,
  stp_count: 0,
}

export function DescriptionItem({ title, content }: DescriptionItemProps) {
  return (
    content?.toString().length 
    ? 
    <>
      <div className="grid grid-cols-2 gap-1 content-center items-center dark:text-white">
        <div className="col-span-1">
          {`${title}`}
        </div>
        <div className="col-span-1 text-black dark:text-white">
          {`${content}`}
        </div>
      </div>
      <Separator />
    </>
    : null
  )
}

export function DescriptionItemWithMap({ title, content, item }: DescriptionItemWithMapProps) {
  const link_to_map_sta = `http://${window.location.host}/map2?stargf=${item?.rgf}`
  const link_to_map_stl = `http://${window.location.host}/map2?stlrgf=${item?.rgf}`
  const link_to_map_stp = `http://${window.location.host}/map2?stprgf=${item?.rgf}`

  const link_get_sta_report_by_rgf = `${gdx2_urls.gdx2_url_sta_rgf_get_report_by_rgf}${item?.rgf}`
  const link_get_stl_report_by_rgf = `${gdx2_urls.gdx2_url_stl_rgf_get_report_by_rgf}${item?.rgf}`
  const link_get_stp_report_by_rgf = `${gdx2_urls.gdx2_url_stp_rgf_get_report_by_rgf}${item?.rgf}`

  const [tableData, setTableData] = useState<IReport[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  let linkTo: JSX.Element = <></>
  let showBtn = false;
  let btnLabel = '';
  let fetchUrl = '';

  if(title.includes("На карте (Точки)")){
    linkTo = <Link to={link_to_map_stp} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "link", size: 'sm' })} > Показать на карте</Link>
    showBtn = !!item?.rgf;
    btnLabel = 'Показать таблицу точек с карты';
    fetchUrl = link_get_stp_report_by_rgf;
  } else if(title.includes("На карте (Линии)")){
    linkTo = <Link to={link_to_map_stl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "link", size: 'sm' })} > Показать на карте</Link>
    showBtn = !!item?.rgf;
    btnLabel = 'Показать таблицу линий с карты';
    fetchUrl = link_get_stl_report_by_rgf;
  } else if(title.includes("На карте (Полигоны)")){
    linkTo = <Link to={link_to_map_sta} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "link", size: 'sm' })} > Показать на карте</Link>
    showBtn = !!item?.rgf;
    btnLabel = 'Показать таблицу полигонов с карты';
    fetchUrl = link_get_sta_report_by_rgf;
  }

  const columnDefs: ColDef[] = [
    { headerName: "№", field: "id", filter: true, sortable: true, resizable: true },
    { headerName: "Наименование", field: "report_name", filter: true, sortable: true, resizable: true },
    { headerName: "Автор", field: "author_name", filter: true, sortable: true, resizable: true },
    { headerName: "Год", field: "year_str", filter: true, sortable: true, resizable: true },
    { headerName: "Субъект РФ", field: "subrf_name", filter: true, sortable: true, resizable: true },
    { headerName: "Лист карты", field: "list_name", filter: true, sortable: true, resizable: true },
    { headerName: "Партия", field: "part_name", filter: true, sortable: true, resizable: true },
    { headerName: "Площадь", field: "areaoil", filter: true, sortable: true, resizable: true },
    { headerName: "Месторождение", field: "field", filter: true, sortable: true, resizable: true },
    { headerName: "ЛУ", field: "lu", filter: true, sortable: true, resizable: true },
    { headerName: "ПИ", field: "pi_name", filter: true, sortable: true, resizable: true },
    { headerName: "Источник", field: "fin_name", filter: true, sortable: true, resizable: true },
    { headerName: "Организация", field: "org_name", filter: true, sortable: true, resizable: true },
    { headerName: "ЗАПСИБНИИГГ", field: "zsniigg_report", filter: true, sortable: true, resizable: true },
    { headerName: "Вид работ", field: "vid_rab", filter: true, sortable: true, resizable: true },
    { headerName: "Примечание", field: "comments", filter: true, sortable: true, resizable: true },
    { headerName: "ТГФ", field: "tgf", filter: true, sortable: true, resizable: true },
    { headerName: "№ РГФ", field: "rgf", filter: true, sortable: true, resizable: true },
  ];

  const handleFetchTable = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(fetchUrl);
      setTableData(response.data?.data || []);
    } catch (e: any) {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  return (
    content?.toString().length 
    ? 
    <>
      <div className="grid grid-cols-2 gap-1 content-center items-center dark:text-white">
        <div className="col-span-1">
          {`${title}`}
        </div>
        <div className="col-span-1 text-black dark:text-white">
          {
            content.toString() != '0'
            ? 
            <>
              <span> {content} </span>
              {linkTo}
              {showBtn && (
                <button onClick={handleFetchTable} className={buttonVariants({ variant: "outline", size: "sm" })} style={{marginLeft: 8}}>
                  {btnLabel}
                </button>
              )}
            </>
            : content
          }
        </div>
      </div>
      <Separator />
      {loading && <Spinner size="lg" className="bg-black dark:bg-white" />}
      {error && <div className="text-red-500">{error}</div>}
      {tableData && tableData.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {tableData.map((row, idx) => (
            <div key={row.id || idx} className="mb-2 p-2 border rounded bg-slate-50 dark:bg-slate-800">
              <DescriptionItem title="Автор" content={row.author_name || row.avts} />
              <DescriptionItem title="Отчет" content={row.report_name || row.name_otch} />
              <DescriptionItem title="Организация" content={row.org_name || row.org_isp} />
              <DescriptionItem title="Год начала" content={row.god_nach} />
              <DescriptionItem title="Год окончания" content={row.god_end} />
              <DescriptionItem title="Метод" content={row.method} />
              <DescriptionItem title="Лист" content={row.list_name || row.nom_1000} />
              <DescriptionItem title="Масштаб" content={row.scale} />
              <DescriptionItem title="ТГФ" content={row.tgf} />
              <DescriptionItem title="инв. № РГФ" content={row.in_n_rosg} />
              <DescriptionItem title="инв. № ТГФ" content={row.in_n_tgf} />
              <DescriptionItem title="№ РГФ" content={row.rgf || row.n_uk_rosg} />
              <DescriptionItem title="№ ТГФ" content={row.n_uk_tgf} />
              <DescriptionItem title="№" content={row.web_uk_id || row.id} />
              <DescriptionItem title="Вид" content={row.vid_iz} />
            </div>
          ))}
        </div>
      )}
    </>
    : null
  )
}

export default function ReportDrawer({open, onClose, item }: PropsDrawer) {
  const [data, setData] = useState<ICountOnMap>()
  const [isLoading, setLoading] = useState<boolean>(false)

  async function fetchData() {
    const url_sta = `${gdx2_urls.gdx2_url_sta}/${item?.rgf}`
    const url_stl = `${gdx2_urls.gdx2_url_stl}/${item?.rgf}`
    const url_stp = `${gdx2_urls.gdx2_url_stp}/${item?.rgf}`

    try {
      setLoading(true)     
      const sta_res = await axios.get<IResult>(url_sta)
      const stl_res = await axios.get<IResult>(url_stl)
      const stp_res = await axios.get<IResult>(url_stp)
      result.sta_count = sta_res?.data?.count;  
      result.stl_count = stl_res?.data?.count;   
      result.stp_count = stp_res?.data?.count;   
      setData(result)
      setLoading(false)
    } catch (e: unknown) {
      const error = e as AxiosError
      setLoading(false)
      toast.error(`Ошибка при загрузке данных: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  function copyNetworkPath(path: string) {
    if (!path) {
      toast.error('Путь для копирования не указан');
      return;
    }

    // Fallback для браузеров без Clipboard API
    const fallbackCopy = () => {
      const textarea = document.createElement('textarea');
      textarea.value = path;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          toast.success(`Сетевой путь скопирован: ${path}`);
        } else {
          throw new Error('execCommand failed');
        }
      } catch (err) {
        toast.error(`Не удалось скопировать путь: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        document.body.removeChild(textarea);
      }
    };

    // Проверяем доступность Clipboard API
    if (!navigator.clipboard) {
      fallbackCopy();
      return;
    }

    // Пытаемся использовать современный API
    navigator.clipboard.writeText(path)
      .then(() => {
        toast.success(`Сетевой путь скопирован: ${path}`);
      })
      .catch((err) => {
        console.error('Clipboard API error:', err);
        // Если современный API не сработал, пробуем fallback
        fallbackCopy();
      });
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetTrigger asChild>Open</SheetTrigger>
      <SheetContent className="max-w-5xl sm:max-w-5xl">
        <SheetHeader>
          <SheetTitle>Подробнее об отчете:</SheetTitle>
          <SheetDescription>
            <Separator />
            <DescriptionItem title="ID" content={item?.id} />
            <DescriptionItem title="Отчет" content={item?.report_name} />
            <DescriptionItem title="Автор" content={item?.author_name} />
            <DescriptionItem title="Год" content={item?.year_str} />
            <DescriptionItem title="РГФ" content={item?.rgf} />
            <DescriptionItem title="ТГФ ХМАО" content={item?.tgf_hmao} />
            <DescriptionItem title="ТГФ ЯНАО" content={item?.tgf_ynao} />
            <DescriptionItem title="ТГФ Красноярск" content={item?.tgf_kras} />
            <DescriptionItem title="ТГФ Екатеринбург" content={item?.tgf_ekat} />
            <DescriptionItem title="ТГФ Омск" content={item?.tgf_omsk} />
            <DescriptionItem title="ТГФ Новосибирск" content={item?.tgf_novo} />
            <DescriptionItem title="ТГФ Томск" content={item?.tgf_tomsk} />
            <DescriptionItem title="ТГФ МорскойТГФ" content={item?.tgf_more} />
            <DescriptionItem title="ТГФ Тюмень" content={item?.tgf_tmn} />
            <DescriptionItem title="ТГФ Курган" content={item?.tgf_kurgan} />
            <DescriptionItem title="ТГФ" content={item?.tgf} />
            <DescriptionItem title="Субъект РФ" content={item?.subrf_name} />
            <DescriptionItem title="Площадь" content={item?.areaoil} />
            <DescriptionItem title="Месторождение" content={item?.field} />
            <DescriptionItem title="Полезные ископаемые" content={item?.pi_name} />
            <DescriptionItem title="Территория" content={item?.territory_name} />
            <DescriptionItem title="Источник финансирования" content={item?.fin_name} />
            <DescriptionItem title="Организация" content={item?.org_name} />
            <DescriptionItem title="Листы карты" content={item?.list_name} />
            <DescriptionItem title="ЗАПСИБНИИГГ отчет" content={item?.zsniigg_report} />
            <DescriptionItem title="Партия" content={item?.part_name} />
            <DescriptionItem title="Вид работ" content={item?.vid_rab} />
            <DescriptionItem title="Информационный отчет" content={item?.inf_report} />
            <DescriptionItem title="Ссылка" content={item?.folder_root} />
            
            <div className="flex justify-center mt-4 mb-4">
              <button
                onClick={() => copyNetworkPath(item?.folder_root || '')}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Копировать полный путь в буфер обмена
              </button>
            </div> 

            <DescriptionItem title="Комментарии" content={item?.comments} />
            <DescriptionItem title="Дата обновления" content={new Date(item?.lastupdate!).toLocaleDateString('ru-RU')} />
            
            {isLoading
              ? <Spinner size="lg" className="bg-black dark:bg-white" /> 
              : <DescriptionItemWithMap title="На карте (Точки)" content={data ? data.stp_count : 0} item={item} />
            }
            {isLoading
              ? <Spinner size="lg" className="bg-black dark:bg-white" /> 
              : <DescriptionItemWithMap title="На карте (Линии)" content={data ? data.stl_count : 0} item={item} />
            }
            {isLoading
              ? <Spinner size="lg" className="bg-black dark:bg-white" /> 
              : <DescriptionItemWithMap title="На карте (Полигоны)" content={data ? data.sta_count : 0} item={item} />
            }
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
