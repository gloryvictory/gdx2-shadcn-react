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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

ModuleRegistry.registerModules([AllCommunityModule]);

const DataTableVidrab = () => {

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
    const url = `${gdx2_urls.gdx2_url_report_vid_rab}`
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
        
        // Сначала собрать индексы всех дубликатов name_ru (без учёта регистра)
        const nameMap = new Map<string, number[]>();
        data2.forEach((item, idx) => {
          const key = (item?.name_ru || '').toLowerCase();
          if (!nameMap.has(key)) nameMap.set(key, []);
          nameMap.get(key)!.push(idx);
        });
        // Получить индексы всех дубликатов (если встречается более 1 раза)
        const allDuplicateIndexes = new Set<number>();
        for (const arr of nameMap.values()) {
          if (arr.length > 1) arr.forEach(i => allDuplicateIndexes.add(i));
        }
        let errorArr: Array<IList> = [];
        data2.forEach((item, idx) => {
          // Ошибка, если в name_ru нет кириллицы ИЛИ есть латиница ИЛИ есть символ № ИЛИ это дубликат без учёта регистра ИЛИ есть ':' или '.'
          const hasCyrillic = /[а-яА-ЯёЁ]/.test(item?.name_ru || '');
          const hasLatin = /[a-zA-Z]/.test(item?.name_ru || '');
          const hasNumberSign = /№/.test(item?.name_ru || '');
          const hasColonOrDot = /[:.]/.test(item?.name_ru || '');
          const isDuplicate = allDuplicateIndexes.has(idx);
          const isError = !hasCyrillic || hasLatin || hasNumberSign || hasColonOrDot || isDuplicate;
          errorArr.push({
            id: item?.id,
            name_ru: item?.name_ru,
            error: isError ? "error" : "OK",
            lastupdate: new Date(item?.lastupdate).toLocaleDateString('ru-RU'),
          });
        });
              
        // window.localStorage.setItem(url, JSON.stringify(errorArr));
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
        <button
          className="mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            const errors = rowData.filter(row => row.error && row.error !== 'OK');
            if (errors.length === 0) return;
            const header = Object.keys(errors[0]) as (keyof typeof errors[0])[];
            const rows = errors.map(row => header.map(h => (row as Partial<IList>)[h] ?? ''));
            const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Ошибки');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'errors.xlsx');
          }}
          disabled={rowData.filter(row => row.error && row.error !== 'OK').length === 0}
        >
          Экспорт ошибок в Excel
        </button>
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

export default DataTableVidrab;
