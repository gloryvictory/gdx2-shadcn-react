
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
// import { Button } from "../ui/button";


type PropsDrawer = {
  open:boolean,
  onClose: () => void,
  showDrawer: () => void, 
  item: IReport| undefined
}

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

interface DescriptionItemWithMapProps {
  title: string;
  content: React.ReactNode;
  item: IReport| undefined;
}

const  result: ICountOnMap = {
  sta_count: 0,
  stl_count: 0,
  stp_count: 0,
}

export function DescriptionItem({ title, content }: DescriptionItemProps) {
  return (
    // {
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

  let linkTo: JSX.Element = <></>

  if(title.includes("На карте (Точки)")){
    linkTo = <Link to={link_to_map_stp} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "link", size: 'sm' })} > Показать на карте</Link>    
  }else
      if(title.includes("На карте (Линии)")){
        linkTo = <Link to={link_to_map_stl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "link", size: 'sm' })} > Показать на карте</Link>    
      }else
          if(title.includes("На карте (Полигоны)")){
            linkTo = <Link to={link_to_map_sta} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "link", size: 'sm' })} > Показать на карте</Link>    
          }else console.log(`Не нашли в ${title}`);              



  return (
    // {
      content?.toString().length 
      ? 
      <>
        <div className="grid grid-cols-2 gap-1 content-center items-center dark:text-white">
          <div className="col-span-1">
            {`${title}`}
          </div>
          <div className="col-span-1 text-black dark:text-white">
            {
                // item?.rgf?.toString().length 
                content.toString() != '0'
                ? 
                <>
                <span> {content} </span>
                {linkTo}  
                </>
                : content
            }
          </div>
        </div>
        <Separator />
      </>
      : null
  )
}


// export const TheDrawer: React.FC<PropsDrawer> = ({open, onClose,showDrawer, item }:PropsDrawer) => {

export default function ReportDrawer({open, onClose, item }:PropsDrawer) {
  
  const [data, setData] = useState<ICountOnMap>()
  const [isLoading, setLoading] = useState<boolean>(false)

  async function fetchData() {
    // const url = `${gdx2_urls.gdx2_url_sta}`
    const url_sta = `${gdx2_urls.gdx2_url_sta}/${item?.rgf}`
    const url_stl = `${gdx2_urls.gdx2_url_stl}/${item?.rgf}`
    const url_stp = `${gdx2_urls.gdx2_url_stp}/${item?.rgf}`

    
    try {
      // setError('')
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
      // setError(error?.message)
      console.log(error?.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);


  return (
          // <div id='mytest' className="max-w-5xl sm:max-w-5xl">
            <Sheet open={open} onOpenChange={onClose} >
            <SheetTrigger asChild >Open</SheetTrigger>
            <SheetContent className="max-w-5xl sm:max-w-5xl">
              <SheetHeader>
                <SheetTitle>Подробнее об отчете:</SheetTitle>
                <SheetDescription>
                  {/* <Label htmlFor="terms">Наименование:</Label>
                  {`${item?.report_name}`} */}
                  <Separator />
                  <DescriptionItem title="ID" content={item?.id} />
                  <DescriptionItem title="Имя" content={item?.report_name} />
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
          // </div>
          

  );
}
