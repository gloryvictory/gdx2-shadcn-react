import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { ICountOnMap, IReport } from "@/types/models";
import './styles.css';
import { useEffect, useState, memo } from "react";
import axios, { AxiosError } from "axios";
import { gdx2_urls } from "@/config/urls";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type PropsDrawer = {
  open: boolean;
  onClose: () => void;
  item: IReport | undefined;
};

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

interface DescriptionItemWithMapProps {
  title: string;
  content: React.ReactNode;
  item: IReport | undefined;
}

interface ApiResponse<T = any> {
  count: number;
  data?: T;
}

enum MapType {
  Points = "На карте (Точки)",
  Lines = "На карте (Линии)",
  Polygons = "На карте (Полигоны)",
}

interface MapConfig {
  link: string;
  btnLabel: string;
  fetchUrl: string;
}

const reportFields: { title: string; key: keyof IReport }[] = [
  { title: "ID", key: "id" },
  { title: "Отчет", key: "report_name" },
  { title: "Автор", key: "author_name" },
  { title: "Год", key: "year_str" },
  { title: "РГФ", key: "rgf" },
  { title: "ТГФ ХМАО", key: "tgf_hmao" },
  { title: "ТГФ ЯНАО", key: "tgf_ynao" },
  { title: "ТГФ Красноярск", key: "tgf_kras" },
  { title: "ТГФ Екатеринбург", key: "tgf_ekat" },
  { title: "ТГФ Омск", key: "tgf_omsk" },
  { title: "ТГФ Новосибирск", key: "tgf_novo" },
  { title: "ТГФ Томск", key: "tgf_tomsk" },
  { title: "ТГФ МорскойТГФ", key: "tgf_more" },
  { title: "ТГФ Тюмень", key: "tgf_tmn" },
  { title: "ТГФ Курган", key: "tgf_kurgan" },
  { title: "ТГФ", key: "tgf" },
  { title: "Субъект РФ", key: "subrf_name" },
  { title: "Площадь", key: "areaoil" },
  { title: "Месторождение", key: "field" },
  { title: "Полезные ископаемые", key: "pi_name" },
  { title: "Территория", key: "territory_name" },
  { title: "Источник финансирования", key: "fin_name" },
  { title: "Организация", key: "org_name" },
  { title: "Листы карты", key: "list_name" },
  { title: "ЗАПСИБНИИГГ отчет", key: "zsniigg_report" },
  { title: "Партия", key: "part_name" },
  { title: "Вид работ", key: "vid_rab" },
  { title: "Информационный отчет", key: "inf_report" },
  { title: "Ссылка", key: "folder_root" },
  { title: "Комментарии", key: "comments" },
  { title: "Дата обновления", key: "lastupdate" },
];

const getMapConfig = (title: string, rgf?: string): MapConfig | null => {
  const baseUrl = `http://${window.location.host}/map2`;
  const rgfSuffix = rgf ? `${rgf}` : '';

  switch (title) {
    case MapType.Points:
      return {
        link: `${baseUrl}?stprgf=${rgfSuffix}`,
        btnLabel: 'Показать таблицу точек с карты',
        fetchUrl: `${gdx2_urls.gdx2_url_stp_rgf_get_report_by_rgf}${rgfSuffix}`,
      };
    case MapType.Lines:
      return {
        link: `${baseUrl}?stlrgf=${rgfSuffix}`,
        btnLabel: 'Показать таблицу линий с карты',
        fetchUrl: `${gdx2_urls.gdx2_url_stl_rgf_get_report_by_rgf}${rgfSuffix}`,
      };
    case MapType.Polygons:
      return {
        link: `${baseUrl}?stargf=${rgfSuffix}`,
        btnLabel: 'Показать таблицу полигонов с карты',
        fetchUrl: `${gdx2_urls.gdx2_url_sta_rgf_get_report_by_rgf}${rgfSuffix}`,
      };
    default:
      return null;
  }
};

export const DescriptionItem = memo(({ title, content }: DescriptionItemProps) => {
  return content?.toString().length ? (
    <>
      <div className="grid grid-cols-2 gap-1 content-center items-center dark:text-white">
        <div className="col-span-1">{title}</div>
        <div className="col-span-1 text-black dark:text-white">
          {title === "Дата обновления" && content
            ? new Date(content as string).toLocaleDateString('ru-RU')
            : `${content}`}
        </div>
      </div>
      <Separator />
    </>
  ) : null;
});

export const DescriptionItemWithMap = memo(({ title, content, item }: DescriptionItemWithMapProps) => {
  const [tableData, setTableData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTableVisible, setIsTableVisible] = useState(false);

  const config = getMapConfig(title, item?.rgf);

  const handleFetchTable = async () => {
    if (!config) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<ApiResponse<any[]>>(config.fetchUrl);
      setTableData(response.data.data || []);
      setIsTableVisible(true); // Показываем таблицу после загрузки
    } catch (e: unknown) {
      const error = e as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка при загрузке данных';
      console.error('Ошибка загрузки таблицы:', error);
      setError(`Ошибка: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTable = () => {
    if (!tableData) {
      handleFetchTable(); // Загружаем данные, если их ещё нет
    } else {
      setIsTableVisible(!isTableVisible); // Переключаем видимость таблицы
    }
  };

  if (!config) return null;

  const toggleButtonLabel = isTableVisible ? `Скрыть ${config.btnLabel.toLowerCase()}` : config.btnLabel;

  return content?.toString().length ? (
    <>
      <div className="grid grid-cols-2 gap-1 content-center items-center dark:text-white">
        <div className="col-span-1">{title}</div>
        <div className="col-span-1 text-black dark:text-white">
          {content.toString() !== '0' ? (
            <>
              <span>{content}</span>
              <Link
                to={config.link}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "link", size: 'sm' })}
                aria-label="Открыть карту"
              >
                Показать на карте
              </Link>
              {item?.rgf && (
                <button
                  onClick={toggleTable}
                  className={buttonVariants({ variant: "outline", size: "sm", className: "ml-2" })}
                  aria-label={toggleButtonLabel}
                  aria-expanded={isTableVisible ? "true" : "false"}
                >
                  {toggleButtonLabel}
                </button>
              )}
            </>
          ) : (
            content
          )}
        </div>
      </div>
      <Separator />
      {loading && <Spinner size="lg" className="bg-black dark:bg-white" />}
      {error && <div className="text-red-500">{error}</div>}
      {tableData && tableData.length > 0 && (
        <div className={`mt-4 max-h-[40vh] overflow-y-auto table-container ${isTableVisible ? '' : 'hidden'}`}>
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
  ) : null;
});

export default function ReportDrawer({ open, onClose, item }: PropsDrawer) {
  const [data, setData] = useState<ICountOnMap>();
  const [isLoading, setLoading] = useState<boolean>(false);

  async function fetchData() {
    const url_sta = `${gdx2_urls.gdx2_url_sta}/${item?.rgf}`;
    const url_stl = `${gdx2_urls.gdx2_url_stl}/${item?.rgf}`;
    const url_stp = `${gdx2_urls.gdx2_url_stp}/${item?.rgf}`;

    try {
      setLoading(true);
      const [sta_res, stl_res, stp_res] = await Promise.all([
        axios.get<ApiResponse>(url_sta),
        axios.get<ApiResponse>(url_stl),
        axios.get<ApiResponse>(url_stp),
      ]);
      console.log('sta_res:', sta_res.data);
      console.log('stl_res:', stl_res.data);
      console.log('stp_res:', stp_res.data);
      setData({
        sta_count: sta_res.data.count ?? 0,
        stl_count: stl_res.data.count ?? 0,
        stp_count: stp_res.data.count ?? 0,
      });
      setLoading(false);
    } catch (e: unknown) {
      const error = e as AxiosError<{ message?: string }>;
      console.error('Ошибка загрузки данных:', error);
      console.error('Response data:', error.response?.data);
      setLoading(false);
      toast.error(`Ошибка при загрузке данных: ${error.response?.data?.message || error.message}`);
    }
  }

  useEffect(() => {
    console.log('item.rgf:', item?.rgf);
    if (item?.rgf) {
      fetchData();
    }
  }, [item?.rgf]);

  const copyToClipboard = (text: string) => {
    if (!text) {
      toast.error('Путь для копирования не указан');
      return;
    }

    const fallbackCopy = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          toast.success(`Сетевой путь скопирован: ${text}`);
        } else {
          throw new Error('Копирование не удалось');
        }
      } catch (err) {
        toast.error(`Не удалось скопировать путь: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        document.body.removeChild(textarea);
      }
    };

    if (!navigator.clipboard) {
      fallbackCopy();
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`Сетевой путь скопирован: ${text}`);
      })
      .catch((err) => {
        console.error('Ошибка Clipboard API:', err);
        fallbackCopy();
      });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <button className={buttonVariants({ variant: "outline" })} aria-label="Открыть информацию об отчете">
          Открыть
        </button>
      </SheetTrigger>
      <SheetContent
        className="max-w-5xl sm:max-w-5xl h-full overflow-y-auto"
        aria-describedby="report-drawer-description"
      >
        <SheetHeader>
          <SheetTitle>Подробнее об отчете:</SheetTitle>
          <SheetDescription id="report-drawer-description">
            Данные об отчете из Excel файла, включая информацию с карты.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Separator />
          {reportFields.map(({ title, key }) => (
            <DescriptionItem
              key={title}
              title={title}
              content={key === "lastupdate" && item?.lastupdate ? new Date(item.lastupdate).toLocaleDateString('ru-RU') : item?.[key]}
            />
          ))}
          <div className="flex justify-center mt-4 mb-4">
            <button
              onClick={() => copyToClipboard(item?.folder_root || '')}
              className={buttonVariants({ variant: "outline", size: "sm" })}
              aria-label="Копировать сетевой путь отчета в буфер обмена"
            >
              Копировать полный путь в буфер обмена
            </button>
          </div>
          {isLoading ? (
            <Spinner size="lg" className="bg-black dark:bg-white" />
          ) : (
            <>
              <DescriptionItemWithMap title={MapType.Points} content={data ? data.stp_count : 0} item={item} />
              <DescriptionItemWithMap title={MapType.Lines} content={data ? data.stl_count : 0} item={item} />
              <DescriptionItemWithMap title={MapType.Polygons} content={data ? data.sta_count : 0} item={item} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
