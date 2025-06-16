'use client'

import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { IDataMap } from "@/types/models";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";

ModuleRegistry.registerModules([AllCommunityModule]);

type PropsDrawer = {
  open: boolean,
  onClose: () => void,
  showDrawer: () => void, 
  dataSource: IDataMap[] | undefined
}

const pagination = true;
const paginationPageSize = 500;
const paginationPageSizeSelector = [500, 1000, 5000, 10000];

export default function TableDrawer({open, onClose, dataSource}: PropsDrawer) {
  const [columnDefs] = useState<ColDef[]>([
    { headerName: "№", field: "id", filter: true, sortable: true, resizable: true, width: 80 },
    { headerName: "Авторы", field: "avts", filter: true, sortable: true, resizable: true, width: 150 },
    { headerName: "Год окончания", field: "god_end", filter: true, sortable: true, resizable: true, width: 120 },
    { headerName: "Год начала", field: "god_nach", filter: true, sortable: true, resizable: true, width: 120 },
    { headerName: "№ РГФ", field: "in_n_rosg", filter: true, sortable: true, resizable: true, width: 100 },
    { headerName: "№ ТГФ", field: "in_n_tgf", filter: true, sortable: true, resizable: true, width: 100 },
    { headerName: "Метод", field: "method", filter: true, sortable: true, resizable: true, width: 120 },
    { headerName: "n_uk_rosg", field: "n_uk_rosg", filter: true, sortable: true, resizable: true, width: 120 },
    { headerName: "n_uk_tgf", field: "n_uk_tgf", filter: true, sortable: true, resizable: true, width: 120 },
    { headerName: "Отчет", field: "name_otch", filter: true, sortable: true, resizable: true, width: 200 },
    { headerName: "Лист", field: "nom_1000", filter: true, sortable: true, resizable: true, width: 80 },
    { headerName: "Организация", field: "org_isp", filter: true, sortable: true, resizable: true, width: 150 },
    { headerName: "Масштаб", field: "scale", filter: true, sortable: true, resizable: true, width: 100 },
    { headerName: "ТГФ", field: "tgf", filter: true, sortable: true, resizable: true, width: 100 },
    { headerName: "Вид изученности", field: "vid_iz", filter: true, sortable: true, resizable: true, width: 150 },
    { headerName: "web_uk_id", field: "web_uk_id", filter: true, sortable: true, resizable: true, width: 120 },
  ]);

  const generateCSVContent = () => {
    if (!dataSource || dataSource.length === 0) return '';
    
    const headers = columnDefs.map(col => col.headerName).join('\t');
    const rows = dataSource.map(row => 
      columnDefs.map(col => {
        const value = row[col.field as keyof IDataMap];
        return String(value || '');
      }).join('\t')
    ).join('\n');
    
    return `${headers}\n${rows}`;
  };

  const exportToCSV = () => {
    const csvContent = generateCSVContent();
    if (!csvContent) return;
    
    // Показываем уведомление о начале экспорта
    toast.promise(
      new Promise((resolve) => {
        // Создание CSV с BOM для UTF-8
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `export_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve(null);
      }),
      {
        loading: 'Экспорт данных...',
        success: () => 'Данные успешно экспортированы в CSV файл',
        error: 'Произошла ошибка при экспорте',
      }
    );
  };

  const copyToClipboard = async () => {
    const csvContent = generateCSVContent();
    if (!csvContent) return;
    
    toast.promise(
      navigator.clipboard.writeText(csvContent),
      {
        loading: 'Копирование данных...',
        success: () => 'Данные скопированы в буфер обмена',
        error: 'Не удалось скопировать данные',
      }
    );
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerTrigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
        Open Drawer
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40" />
        <DrawerContent className="bg-gray-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 h-[85vh]">
          <div className="p-4 bg-white rounded-t-[10px] flex flex-col h-full">
            <div className="w-full mx-auto flex justify-between items-center">
              <div>
                <div aria-hidden className="mx-auto w-full h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />
                <DrawerTitle className="font-medium mb-4 text-gray-900">
                  Найдено: {dataSource?.length}
                </DrawerTitle>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  disabled={!dataSource || dataSource.length === 0}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Копировать
                </Button>
                <Button 
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                  disabled={!dataSource || dataSource.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Экспорт
                </Button>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="ag-theme-alpine w-full h-full" style={{ height: '100%' }}>
                <AgGridReact 
                  rowData={dataSource} 
                  columnDefs={columnDefs}
                  pagination={pagination}
                  paginationPageSize={paginationPageSize}
                  paginationPageSizeSelector={paginationPageSizeSelector}
                  domLayout='normal'
                  headerHeight={40}
                  rowHeight={35}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    sortable: true,
                    resizable: true,
                    filter: true,
                  }}
                  onGridReady={(params) => {
                    params.api.sizeColumnsToFit();
                  }}
                  onFirstDataRendered={(params) => {
                    params.api.sizeColumnsToFit();
                  }}
                /> 
              </div>
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}


 // <div className="bg-gray-100 h-fit fixed bottom-0 left-0 right-0 outline-none">
    //   <Drawer open={open} onOpenChange={onClose} >
    //     <DrawerTrigger asChild>open</DrawerTrigger>
    //     <DrawerContent   >
    //       <DrawerHeader>
    //         <DrawerTitle>{dataSource?.length} items</DrawerTitle>
    //         <DrawerDescription>This action cannot be undone.</DrawerDescription>
    //       </DrawerHeader>
    //       {/* <AgGridReact 
    //         rowData={dataSource} 
    //         columnDefs={columnDefs}  
    //         // rowClassRules={rowClassRules}
    //         pagination={pagination}
    //         paginationPageSize={paginationPageSize}
    //         paginationPageSizeSelector={paginationPageSizeSelector}
    //         /> */}
          
    //       <DrawerFooter>
    //         {/* <Button>Submit</Button>
    //         <DrawerClose>
    //           <Button variant="outline" onClick={onClose}>Cancel</Button>
    //         </DrawerClose> */}
    //       </DrawerFooter>
    //     </DrawerContent>
    //   </Drawer>
    // </div>

// const [columnDefs, setColumnDefs] = useState<ColDef[]>([
  //   { headerName: "№",                field: "id",          filter: true, sortable: true, resizable: true },
  //   { headerName: "Наименование",     field: "report_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "Автор",     field: "author_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "Автор",     field: "author_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "РГФ",     field: "rgf",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_hmao",     field: "tgf_hmao",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_ynao",     field: "tgf_ynao",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_kras",     field: "tgf_kras",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_ekat",     field: "tgf_ekat",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_omsk",     field: "tgf_omsk",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_novo",     field: "tgf_novo",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_tomsk",     field: "tgf_tomsk",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_more",     field: "tgf_more",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_tmn",     field: "tgf_tmn",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf_kurgan",     field: "tgf_kurgan",     filter: true, sortable: true, resizable: true },
  //   { headerName: "tgf",     field: "tgf",     filter: true, sortable: true, resizable: true },
  //   { headerName: "subrf_name",     field: "subrf_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "areaoil",     field: "areaoil",     filter: true, sortable: true, resizable: true },
  //   { headerName: "field",     field: "field",     filter: true, sortable: true, resizable: true },
  //   { headerName: "pi_name",     field: "pi_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "territory_name",     field: "territory_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "fin_name",     field: "fin_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "is_alive",     field: "is_alive",     filter: true, sortable: true, resizable: true },
  //   { headerName: "org_name",     field: "org_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "list_name",     field: "list_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "zsniigg_report",     field: "zsniigg_report",     filter: true, sortable: true, resizable: true },
  //   { headerName: "part_name",     field: "part_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "vid_rab",     field: "vid_rab",     filter: true, sortable: true, resizable: true },
  //   { headerName: "inf_report",     field: "inf_report",     filter: true, sortable: true, resizable: true },
  //   { headerName: "folder_root",     field: "folder_root",     filter: true, sortable: true, resizable: true },
  //   { headerName: "folder_name",     field: "folder_name",     filter: true, sortable: true, resizable: true },
  //   { headerName: "folder_short",     field: "folder_short",     filter: true, sortable: true, resizable: true },
  //   { headerName: "folder_link",     field: "folder_link",     filter: true, sortable: true, resizable: true },
  //   { headerName: "year_str",     field: "year_str",     filter: true, sortable: true, resizable: true },
  //   { headerName: "comments",     field: "comments",     filter: true, sortable: true, resizable: true },
  //   { headerName: "lu",     field: "lu",     filter: true, sortable: true, resizable: true },
  //   { headerName: "Дата обновления",  field: "lastupdate",  filter: true, sortable: true, resizable: true },
  // ]);
  

  // open={open} onOpenChange={setOpen}
