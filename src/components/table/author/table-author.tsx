// components/GridComponent.tsx
"use client";

import { AgGridReact } from 'ag-grid-react';
import { useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import { useAuthor } from '@/hooks/useAuthor';
import { gdx2_urls } from '@/config/urls';
import { IData, IList, IResult } from '@/types/models';
import axios, { AxiosError } from 'axios';
import { Spinner } from '@/components/ui/spinner';
import "./styles.css";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

ModuleRegistry.registerModules([AllCommunityModule]);

const DataTableAuthor = () => {

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

  
  // useEffect(() => {
  //   fetch("https://www.ag-grid.com/example-assets/olympic-winners.json") // Fetch data from server
  //     .then((result) => result.json()) // Convert to JSON
  //     .then((rowData) => setRowData(rowData)); // Update state of `rowData`
  // }, []);
  async function fetchData() {
    const url = `${gdx2_urls.gdx2_url_report_author}`
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
        
        let errorArr: Array<IList> = [];
        let sampleRegEx: RegExp = /^[а-яА-ЯёЁa-zA-Z]+ [а-яА-ЯёЁa-zA-Z]. ?[а-яА-ЯёЁa-zA-Z].$/;

        // console.log(errorArr);
        
        data2.forEach((item) => {
          errorArr.push({
            id: item?.id,
            name_ru: item?.name_ru,
            error: sampleRegEx.test(item?.name_ru) ? "OK":"error",
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

export default DataTableAuthor;
