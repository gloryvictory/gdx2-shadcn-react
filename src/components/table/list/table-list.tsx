// components/GridComponent.tsx
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { gdx2_urls } from '@/config/urls';
import { IData, IList, IResult } from '@/types/models';
import axios, { AxiosError } from 'axios';
import { Spinner } from '@/components/ui/spinner';
import "./styles.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const DataTableList = () => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rowData, setRowData] = useState<IList[] >([]);

  const [columnDefs, ] = useState<ColDef[]>([
    { headerName: "№",                field: "id",          filter: true, sortable: true, resizable: true },
    { headerName: "Наименование",     field: "name_ru",     filter: true, sortable: true, resizable: true },
    { headerName: "Дата обновления",  field: "lastupdate",  filter: true, sortable: true, resizable: true },
    { headerName: "Ошибка",           field: "error",       filter: true, sortable: true, resizable: true },
  ]);

  const pagination = true;
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [500, 1000, 5000, 10000];

  

  async function fetchData() {
    const url = `${gdx2_urls.gdx2_url_report_list}`
    console.log(url)
    try {
      setError('')
      setLoading(true)     
      const data1 = window.localStorage.getItem(url); // Retrieve auth token from localStorage
      if (data1) {
        setRowData(JSON.parse(data1)) 
      }else{
        const response = await axios.get<IResult>(url)
        const data2: IData[] = response?.data?.data
        
        let  errorArr: Array<IList> = [];
        //  проверяем на совпадение регулярного выражения вида "Иванов И.И."
        let sampleRegEx: RegExp = /^[A-Z]-\d\d/;

        // console.log(errorArr);
        
        data2.forEach((item) => {
          errorArr.push({
            id: item?.id,
            name_ru: item?.name_ru,
            error: sampleRegEx.test(item?.name_ru) ? "OK":"error",
            lastupdate: new Date(item?.lastupdate).toLocaleDateString('ru-RU'),
          });
        });
              
        window.localStorage.setItem(url, JSON.stringify(errorArr));
        setRowData(errorArr)  
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

export default DataTableList;
