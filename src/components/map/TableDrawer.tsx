'use client'

// import { Button } from "@/components/ui/button";
import {
  Drawer,
  // DrawerClose,
  DrawerContent,
  // DrawerDescription,
  // DrawerFooter,
  // DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { IDataMap } from "@/types/models";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);



type PropsDrawer = {
  open:boolean,
  onClose: () => void,
  showDrawer: () => void, 
  dataSource: IDataMap[]| undefined
}


const pagination = true;
const paginationPageSize = 500;
const paginationPageSizeSelector = [500, 1000, 5000, 10000];

export default function TableDrawer({open, onClose, dataSource}:PropsDrawer) {

  const [columnDefs, ] = useState<ColDef[]>([
    { headerName: "№",                field: "id",          filter: true, sortable: true, resizable: true },
    { headerName: "avts",                field: "avts",          filter: true, sortable: true, resizable: true },
    { headerName: "god_end",                field: "god_end",          filter: true, sortable: true, resizable: true },
    { headerName: "god_nach",                field: "god_nach",          filter: true, sortable: true, resizable: true },
    { headerName: "in_n_rosg",                field: "in_n_rosg",          filter: true, sortable: true, resizable: true },
    { headerName: "in_n_tgf",                field: "in_n_tgf",          filter: true, sortable: true, resizable: true },
    { headerName: "method",                field: "method",          filter: true, sortable: true, resizable: true },
    { headerName: "n_uk_rosg",                field: "n_uk_rosg",          filter: true, sortable: true, resizable: true },
    { headerName: "n_uk_tgf",                field: "n_uk_tgf",          filter: true, sortable: true, resizable: true },
    { headerName: "name_otch",                field: "name_otch",          filter: true, sortable: true, resizable: true },
    { headerName: "nom_1000",                field: "nom_1000",          filter: true, sortable: true, resizable: true },
    { headerName: "org_isp",                field: "org_isp",          filter: true, sortable: true, resizable: true },
    { headerName: "scale",                field: "scale",          filter: true, sortable: true, resizable: true },
    { headerName: "tgf",                field: "tgf",          filter: true, sortable: true, resizable: true },
    { headerName: "vid_iz",                field: "vid_iz",          filter: true, sortable: true, resizable: true },
    { headerName: "web_uk_id",                field: "web_uk_id",          filter: true, sortable: true, resizable: true },

  ]);

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
  return (
      <Drawer open={open} onOpenChange={onClose}>
      <DrawerTrigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
        Open Drawer
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40" />
        <DrawerContent className="bg-gray-100 flex flex-col rounded-t-[10px] mt-24 h-[50%] lg:h-[620px] fixed bottom-0 left-0 right-0 outline-none">
        <DrawerTitle className="font-medium mb-4 text-gray-900">Найдено: {dataSource?.length}</DrawerTitle>
          <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto">
            <div className="w-full mx-auto space-y-4">
              <div aria-hidden className="mx-auto w-full h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
              <div className='container w-full h-screen'>
                <AgGridReact 
                  rowData={dataSource} 
                  columnDefs={columnDefs}  
                // rowClassRules={rowClassRules}
                  pagination={pagination}
                  paginationPageSize={paginationPageSize}
                  paginationPageSizeSelector={paginationPageSizeSelector}
                /> 
              </div>
              
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>



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
    

  );
}
