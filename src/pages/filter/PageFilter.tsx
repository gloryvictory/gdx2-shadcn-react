import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectFilter } from "./SelectFilter";
import { AreaFilter } from "./AreaFilter";
import FilterMap from "@/components/map/FilterMap";
import { useFilteredFeaturesStore } from '@/store/filterStore';

interface FeatureRowData {
  id: string | number;
  method?: string;
  vid_iz?: string;
  god_nach?: string | number;
  god_end?: string | number;
  tgf?: string;
  nom_1000?: string;
  scale?: string;
  [key: string]: any;
}

function PageFilter() {
  const [valueFilter, setValueFilter] = React.useState("");
  const [valueList, setValueList] = React.useState("");
  const { filteredFeatures, stp, stl, sta } = useFilteredFeaturesStore();

  // Разделяем данные по слоям
  const layerData = React.useMemo(() => {
    return {
      stp: stp,
      stl: stl,
      sta: sta,
    };
  }, [stp, stl, sta]);

  // Преобразуем данные для таблиц
  const rowData = React.useMemo(() => {
    return {
      stp: layerData.stp.map(feature => ({ id: feature.id, ...feature.properties })),
      stl: layerData.stl.map(feature => ({ id: feature.id, ...feature.properties })),
      sta: layerData.sta.map(feature => ({ id: feature.id, ...feature.properties })),
    };
  }, [layerData]);

  // Общие настройки колонок
  const commonColumnDefs: ColDef<FeatureRowData>[] = [
    { field: 'id', headerName: 'ID', width: 80, filter: 'agNumberColumnFilter' },
    { field: 'method', headerName: 'Метод', width: 120, filter: 'agTextColumnFilter' },
    { field: 'vid_iz', headerName: 'Вид изученности', width: 150, filter: 'agTextColumnFilter' },
    { field: 'god_nach', headerName: 'Начало работ', width: 120, filter: 'agNumberColumnFilter' },
    { field: 'god_end', headerName: 'Окончание работ', width: 130, filter: 'agNumberColumnFilter' },
    { field: 'tgf', headerName: 'ТГФ', width: 100, filter: 'agTextColumnFilter' },
    { field: 'nom_1000', headerName: 'Лист карты', width: 120, filter: 'agTextColumnFilter' },
    { field: 'scale', headerName: 'Масштаб', width: 110, filter: 'agTextColumnFilter' },
  ];

  const handleFilterChange = (selectedValue: string) => {
    setValueFilter(selectedValue);
    setValueList("");
  };
  
  const handleListChange = (selectedValue: string) => {
    setValueList(selectedValue);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full h-full rounded-lg border overflow-hidden"
    >
      <ResizablePanel defaultSize={20} className="min-w-28 max-w-64">
        <div className="flex flex-col h-full min-w-28 max-w-64 items-center justify-center p-2 overflow-hidden">
          <div className="w-full mb-1"><SelectFilter onChange={handleFilterChange} /></div>
          <AreaFilter onChange={handleListChange} selectFilter={valueFilter} />
        </div>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical" className="overflow-hidden">
          <ResizablePanel defaultSize={75} className="overflow-hidden">
            <FilterMap selectFilter={valueFilter} selectList={valueList} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} className="overflow-hidden flex flex-col">
            <Tabs defaultValue="stp" className="h-full flex flex-col">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="stp">Точки (STP) ({rowData.stp.length})</TabsTrigger>
                <TabsTrigger value="stl">Линии (STL) ({rowData.stl.length})</TabsTrigger>
                <TabsTrigger value="sta">Полигоны (STA) ({rowData.sta.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stp" className="flex-1 overflow-hidden">
                <div className="ag-theme-alpine h-full w-full">
                  <AgGridReact<FeatureRowData>
                    rowData={rowData.stp}
                    columnDefs={commonColumnDefs}
                    defaultColDef={{
                      sortable: true,
                      resizable: true,
                      filter: true,
                      flex: 1,
                      minWidth: 100,
                    }}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50, 100]}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="stl" className="flex-1 overflow-hidden">
                <div className="ag-theme-alpine h-full w-full">
                  <AgGridReact<FeatureRowData>
                    rowData={rowData.stl}
                    columnDefs={commonColumnDefs}
                    defaultColDef={{
                      sortable: true,
                      resizable: true,
                      filter: true,
                      flex: 1,
                      minWidth: 100,
                    }}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50, 100]}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="sta" className="flex-1 overflow-hidden">
                <div className="ag-theme-alpine h-full w-full">
                  <AgGridReact<FeatureRowData>
                    rowData={rowData.sta}
                    columnDefs={commonColumnDefs}
                    defaultColDef={{
                      sortable: true,
                      resizable: true,
                      filter: true,
                      flex: 1,
                      minWidth: 100,
                    }}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50, 100]}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default PageFilter;
