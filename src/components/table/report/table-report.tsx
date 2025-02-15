// components/GridComponent.tsx
"use client";

import { AgGridReact } from 'ag-grid-react';
import { useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { gdx2_urls } from '@/config/urls';
import { IListReport,IResultReport } from '@/types/models';
import axios, { AxiosError } from 'axios';
import { Spinner } from '@/components/ui/spinner';
import "./styles.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const DataTableReport = () => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rowData, setRowData] = useState<IListReport[] >([]);

  const [columnDefs, ] = useState<ColDef[]>([
    { headerName: "№",                field: "id",              filter: true, sortable: true, resizable: true },
    { headerName: "Наименование",     field: "report_name",     filter: true, sortable: true, resizable: true },
    { headerName: "Автор",            field: "author_name",     filter: true, sortable: true, resizable: true },
    { headerName: "Год",              field: "year_str",        filter: true, sortable: true, resizable: true },
    { headerName: "Субъект РФ",       field: "subrf_name",      filter: true, sortable: true, resizable: true },
    { headerName: "Лист карты",       field: "list_name",       filter: true, sortable: true, resizable: true },
    { headerName: "Партия",           field: "part_name",       filter: true, sortable: true, resizable: true },
    { headerName: "Площадь",          field: "areaoil",         filter: true, sortable: true, resizable: true },
    { headerName: "Месторождение",    field: "field",           filter: true, sortable: true, resizable: true },
    { headerName: "ЛУ",               field: "lu",              filter: true, sortable: true, resizable: true },
    { headerName: "ПИ",               field: "pi_name",         filter: true, sortable: true, resizable: true },
    { headerName: "Источник",         field: "fin_name",        filter: true, sortable: true, resizable: true },
    { headerName: "Организация",      field: "org_name",        filter: true, sortable: true, resizable: true },
    { headerName: "ЗапСибНИИГГ",      field: "zsniigg_report",  filter: true, sortable: true, resizable: true },
    { headerName: "Вид работ",        field: "vid_rab",         filter: true, sortable: true, resizable: true },
    { headerName: "Примечание",       field: "comments",        filter: true, sortable: true, resizable: true },

    { headerName: "ТГФ",              field: "tgf",             filter: true, sortable: true, resizable: true },
    { headerName: "№ РГФ",            field: "rgf",             filter: true, sortable: true, resizable: true },
    { headerName: "№ ХМТГФ",          field: "tgf_hmao",        filter: true, sortable: true, resizable: true },
    { headerName: "№ ЯНТГФ",          field: "tgf_ynao",        filter: true, sortable: true, resizable: true },
    { headerName: "№ КраснТГФ",       field: "tgf_kras",        filter: true, sortable: true, resizable: true },
    { headerName: "№ ЕкатерТГФ",      field: "tgf_ekat",        filter: true, sortable: true, resizable: true },
    { headerName: "№ ОмскТГФ",        field: "tgf_omsk",        filter: true, sortable: true, resizable: true },
    { headerName: "№ НовосибТГФ",     field: "tgf_novo",        filter: true, sortable: true, resizable: true },
    { headerName: "№ ТомскТГФ",       field: "tgf_tomsk",       filter: true, sortable: true, resizable: true },
    { headerName: "№ МорскойТГФ",     field: "tgf_more",        filter: true, sortable: true, resizable: true },
    { headerName: "№ ТюмТГФ",         field: "tgf_tmn",         filter: true, sortable: true, resizable: true },
    { headerName: "№ КурганТГФ",      field: "tgf_kurgan",      filter: true, sortable: true, resizable: true },
    
  ]);
  
  

  const pagination = true;
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [500, 1000, 5000, 10000];

  
  // useEffect(() => {
  //   fetch("https://www.ag-grid.com/example-assets/olympic-winners.json") // Fetch data from server
  //     .then((result) => result.json()) // Convert to JSON
  //     .then((rowData) => setRowData(rowData)); // Update state of `rowData`
  // }, []);
  async function fetchData() {
    const url = `${gdx2_urls.gdx2_url_report_all}`
    console.log(url)
    try {
      setError('')
      setLoading(true)     
      const data1 = window.localStorage.getItem(url); // Retrieve auth token from localStorage
      if (data1) {
        setRowData(JSON.parse(data1)) 
      }else{
        const response = await axios.get<IResultReport>(url)
        const data2: IListReport[] = response?.data?.data
        // console.log(data2);
        let resultArr: Array<IListReport> = [];
        
        data2.forEach((item) => {
          // const last: string =  item?.lastupdate?.toString()!
          resultArr.push({
            id: item?.id,
            report_name: item?.report_name,
            author_name : item?.author_name,
            field: item?.field,
            year_str: item?.year_str,
            areaoil: item?.areaoil,
            rgf: item?.rgf,
            subrf_name: item?.subrf_name,
            vid_rab: item?.vid_rab,
            part_name: item?.part_name,
            tgf: item?.tgf,
            tgf_hmao: item?.tgf_hmao,
            tgf_ynao: item?.tgf_ynao,
            tgf_kras: item?.tgf_kras,
            tgf_ekat: item?.tgf_ekat,
            tgf_omsk: item?.tgf_omsk,
            tgf_novo: item?.tgf_novo,
            tgf_tomsk: item?.tgf_tomsk,
            tgf_more: item?.tgf_more,
            tgf_tmn: item?.tgf_tmn,
            tgf_kurgan: item?.tgf_kurgan,
            list_name: item?.list_name,
            lu: item?.lu,
            pi_name: item?.pi_name,
            fin_name: item?.fin_name,
            org_name: item?.org_name,
            zsniigg_report: item?.zsniigg_report,
            comments: item?.comments,
            
            error: "OK",
            lastupdate: new Date(item?.lastupdate?.toString()!).toLocaleDateString('ru-RU'),
          });
        });
              
        window.localStorage.setItem(url, JSON.stringify(resultArr));
        // console.log(resultArr);
        setRowData(resultArr)  
        // console.log(rowData);
      }
      setLoading(false)
    } catch (e: unknown) {
      const error = e as AxiosError
      setLoading(false)
      setError(error?.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  const rowClassRules = useMemo(() => {
    return {
      // row style function
      "sick-days-warning": (params:any) => {
        const error_str:string = params.data.error;
        return error_str.includes('error') ;
      },
    };
  }, []);


  return (
    <>
    { loading && 
        <div className="flex w-full-5 flex-col text-center items-center justify-items-center content-center align-baseline">
          <Spinner size="lg" className="flex w-full-5  flex-col text-center items-center justify-items-center content-center align-baseline bg-black dark:bg-white" /> 
        </div>
      }
      { error && `Error: ${error}` }
      <div className='container w-full h-screen mt-2'>
      <AgGridReact 
        rowData={rowData} 
        columnDefs={columnDefs}  
        rowClassRules={rowClassRules}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}/>
    </div>
    </>
  );
};

export default DataTableReport;
