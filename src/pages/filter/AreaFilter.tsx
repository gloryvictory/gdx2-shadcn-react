import * as React from "react"
import { nanoid } from 'nanoid'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useMethod } from "@/hooks/useMethod"
import { gdx2_urls } from "@/config/urls"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useVidIz } from "@/hooks/useVidIz"
import { useGodNach } from "@/hooks/useGodNach"
import { useGodEnd } from "@/hooks/useGodEnd"
import { useTGF } from "@/hooks/useTGF"
import { useNomer } from "@/hooks/useNomer"
import { useOrgIsp } from "@/hooks/useOrgIsp"
import { useScale } from "@/hooks/useScale"



interface SelectAreaProps {
  onChange: (value: string) => void;
  selectFilter: string
}

export function AreaFilter({ onChange, selectFilter }: SelectAreaProps) {
  const { dataMethod, errorMethod, loadingMethod } = useMethod(gdx2_urls.gdx2_url_stall_method)
  const { dataVidIz, errorVidIz, loadingVidIz    } = useVidIz(gdx2_urls.gdx2_url_stall_vid_iz)
  const { dataGodNach, errorGodNach, loadingGodNach    } = useGodNach(gdx2_urls.gdx2_url_stall_god_nach)
  const { dataGodEnd, errorGodEnd, loadingGodEnd    } = useGodEnd(gdx2_urls.gdx2_url_stall_god_end)
  const { dataTGF, errorTGF, loadingTGF    } = useTGF(gdx2_urls.gdx2_url_stall_tgf)
  const { dataNomer, errorNomer, loadingNomer    } = useNomer(gdx2_urls.gdx2_url_stall_nom_1000)
  const { dataScale, errorScale, loadingScale    } = useScale(gdx2_urls.gdx2_url_stall_scale)
  // const { dataOrgIsp, errorOrgIsp, loadingOrgIsp    } = useOrgIsp(gdx2_urls.gdx2_url_stall_org_isp)

  const [value, setValue] = React.useState("");

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue); // Вызываем callback с новым значением
    // console.log(newValue)
  };

function getMethod(selectFilter: string) {
  if(selectFilter === 'method') {
    return(
      dataMethod?.data  && dataMethod?.data?.map((res) => (
        <div key={nanoid()} >
          <div key={nanoid()} className="flex items-center space-x-2">
            <RadioGroupItem  key={nanoid()}  value={res} id={res} />
            <Label  key={nanoid()} htmlFor={res}>{res}</Label>
          </div>
          <Separator key={nanoid()} className="my-2" />
        </div>
      ))
    )
  } 
  if(selectFilter === 'vid_iz') {
    return(
      dataVidIz?.data  && dataVidIz?.data?.map((res) => (
        <div key={nanoid()} >
          <div key={nanoid()} className="flex items-center space-x-2">
            <RadioGroupItem  key={nanoid()}  value={res} id={res} />
            <Label  key={nanoid()} htmlFor={res}>{res}</Label>
          </div>
          <Separator key={nanoid()} className="my-2" />
        </div>
      ))
    )
  }
  if(selectFilter === 'god_nach') {
    return(
      dataGodNach?.data  && dataGodNach?.data?.map((res) => (
        <div key={nanoid()} >
          <div key={nanoid()} className="flex items-center space-x-2">
            <RadioGroupItem  key={nanoid()}  value={res} id={res} />
            <Label  key={nanoid()} htmlFor={res}>{res}</Label>
          </div>
          <Separator key={nanoid()} className="my-2" />
        </div>
      ))
    )
  }
  if(selectFilter === 'god_end') {
    return(
      dataGodEnd?.data  && dataGodEnd?.data?.map((res) => (
        <div key={nanoid()} >
          <div key={nanoid()} className="flex items-center space-x-2">
            <RadioGroupItem  key={nanoid()}  value={res} id={res} />
            <Label  key={nanoid()} htmlFor={res}>{res}</Label>
          </div>
          <Separator key={nanoid()} className="my-2" />
        </div>
      ))
    )
  }
  if(selectFilter === 'tgf') {
    return(
      dataTGF?.data  && dataTGF?.data?.map((res) => (
        <div key={nanoid()} >
          <div key={nanoid()} className="flex items-center space-x-2">
            <RadioGroupItem  key={nanoid()}  value={res} id={res} />
            <Label  key={nanoid()} htmlFor={res}>{res}</Label>
          </div>
          <Separator key={nanoid()} className="my-2" />
        </div>
      ))
    )
  }
  if(selectFilter === 'nom_1000') {
    return(
      dataNomer?.data  && dataNomer?.data?.map((res) => (
        <div key={nanoid()} >
          <div key={nanoid()} className="flex items-center space-x-2">
            <RadioGroupItem  key={nanoid()}  value={res} id={res} />
            <Label  key={nanoid()} htmlFor={res}>{res}</Label>
          </div>
          <Separator key={nanoid()} className="my-2" />
        </div>
      ))
    )
  }
  if(selectFilter === 'scale') {
    return(
      dataScale?.data  && dataScale?.data?.map((res) => (
        <div key={nanoid()} >
          <div key={nanoid()} className="flex items-center space-x-2">
            <RadioGroupItem  key={nanoid()}  value={res} id={res} />
            <Label  key={nanoid()} htmlFor={res}>{res}</Label>
          </div>
          <Separator key={nanoid()} className="my-2" />
        </div>
      ))
    )
  }
  
  else 
        {  
          return(
            <div key={nanoid()} className="flex items-center space-x-2">
              <RadioGroupItem key={nanoid()} value="empty" id="empty" />
              <Label key={nanoid()} htmlFor="empty">Нет данных</Label>
            </div>
          )
        }

}


  return (
    <>
    { loadingMethod && <Spinner size="md" className="bg-black dark:bg-white" /> }
    { errorMethod && `Error: ${errorMethod}` }

    <ScrollArea className="w-full h-screen rounded-md border">
      <div  key={nanoid()} className="p-4">
        <h4  key={nanoid()} className="mb-4 text-sm font-medium leading-none text-slate-500">Значения</h4>
        
        <RadioGroup key={nanoid()} defaultValue={value} onValueChange={handleValueChange}>
        { getMethod(selectFilter) }
        </RadioGroup>
      </div>
    </ScrollArea>
    
    </>
  )
}
