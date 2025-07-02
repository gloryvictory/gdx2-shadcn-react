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
import FilterMap, { FilterMapRef } from "@/components/map/FilterMap";
import { useFilteredFeaturesStore } from '@/store/filterStore';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

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
  const [selectedFilter, setSelectedFilter] = React.useState("");
  const [selectedList, setSelectedList] = React.useState("");
  const { filteredFeatures, stp, stl, sta, setStp, setStl, setSta } = useFilteredFeaturesStore();
  const [tableLoading, setTableLoading] = React.useState(false);
  const [gridKey, setGridKey] = React.useState(0);
  const [tablesReady, setTablesReady] = React.useState(false);
  const [wasTableManuallyRefreshed, setWasTableManuallyRefreshed] = React.useState(false);
  const [wasMarkerSet, setWasMarkerSet] = React.useState(false);
  const filterMapRef = React.useRef<FilterMapRef>(null);

  // Следим за фильтрами и включаем индикатор загрузки
  React.useEffect(() => {
    if (!selectedFilter || !selectedList) {
      setTableLoading(false);
      return;
    }
    setTableLoading(true);
  }, [selectedFilter, selectedList]);

  // Следим за обновлением данных с карты
  React.useEffect(() => {
    if (!selectedFilter || !selectedList) {
      setTableLoading(false);
      return;
    }
    if (stp.length === 0 && stl.length === 0 && sta.length === 0) {
      setTableLoading(true);
    } else {
      setTableLoading(false);
    }
  }, [stp, stl, sta, selectedFilter, selectedList]);

  // Разделяем данные по слоям
  const layerData = React.useMemo(() => {
    if (!selectedFilter || !selectedList) {
      return { stp: [], stl: [], sta: [] };
    }
    return {
      stp: stp,
      stl: stl,
      sta: sta,
    };
  }, [stp, stl, sta, selectedFilter, selectedList]);

  // Преобразуем данные для таблиц
  const rowData = React.useMemo(() => {
    if (!selectedFilter || !selectedList || (!wasTableManuallyRefreshed && !wasMarkerSet)) {
      return { stp: [], stl: [], sta: [] };
    }
    return {
      stp: stp.map(feature => ({ id: feature.id, ...feature.properties })),
      stl: stl.map(feature => ({ id: feature.id, ...feature.properties })),
      sta: sta.map(feature => ({ id: feature.id, ...feature.properties })),
    };
  }, [stp, stl, sta, selectedFilter, selectedList, wasTableManuallyRefreshed, wasMarkerSet]);

  // Кнопка активна, если есть данные хотя бы в одной таблице
  const hasAnyData = rowData.stp.length > 0 || rowData.stl.length > 0 || rowData.sta.length > 0;

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

  // Экспорт в Excel
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const addSheet = (data: any[], columns: ColDef[], name: string) => {
      if (!data.length) return;
      // Формируем массив для xlsx: первая строка — заголовки
      const headers = columns.map(col => col.headerName || col.field);
      const rows = data.map(row => columns.map(col => row[col.field ?? '']));
      const wsData = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, name);
    };
    addSheet(rowData.stp, commonColumnDefs, 'Точки (STP)');
    addSheet(rowData.stl, commonColumnDefs, 'Линии (STL)');
    addSheet(rowData.sta, commonColumnDefs, 'Полигоны (STA)');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'filtered_layers.xlsx');
  };

  // Обновить таблицы с карты (заглушка)
  const handleRefreshTables = () => {
    filterMapRef.current?.refreshTables();
    setWasTableManuallyRefreshed(true);
  };

  // Callback для FilterMap, чтобы узнать, что маркер был поставлен
  const handleMarkerSet = () => {
    setWasMarkerSet(true);
  };

  const handleFilterChange = (selectedValue: string) => {
    setValueFilter(selectedValue);
    setValueList("");
    setStp([]);
    setStl([]);
    setSta([]);
    setTableLoading(true);
    setGridKey(prev => prev + 1);
    setSelectedFilter(selectedValue);
    setSelectedList("");
    setTablesReady(false);
    setWasTableManuallyRefreshed(false);
    setWasMarkerSet(false);
  };
  
  const handleListChange = (selectedValue: string) => {
    setValueList(selectedValue);
    setStp([]);
    setStl([]);
    setSta([]);
    setTableLoading(true);
    setGridKey(prev => prev + 1);
    setSelectedList(selectedValue);
    setTablesReady(false);
    setWasTableManuallyRefreshed(false);
    setWasMarkerSet(false);
  };

  // Следим за наполнением store и включаем таблицы только когда пришли новые данные
  React.useEffect(() => {
    if (!selectedFilter || !selectedList) return;
    if (stp.length > 0 || stl.length > 0 || sta.length > 0) {
      setTablesReady(true);
      setTableLoading(false);
    }
  }, [stp, stl, sta, selectedFilter, selectedList]);

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
            <FilterMap ref={filterMapRef} selectFilter={selectedFilter} selectList={selectedList} onMarkerSet={handleMarkerSet} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} className="overflow-hidden flex flex-col">
            {/* Кнопка экспорта */}
            <div className="flex justify-end p-2 gap-2">
              <button
                onClick={handleRefreshTables}
                disabled={!selectedFilter || !selectedList}
                className={
                  `px-4 py-2 rounded text-sm font-medium shadow border transition ` +
                  ((!selectedFilter || !selectedList)
                    ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-300 cursor-pointer')
                }
              >
                Обновить таблицы с карты
              </button>
              <button
                onClick={handleExportExcel}
                disabled={!hasAnyData}
                className={
                  `px-4 py-2 rounded text-white text-sm font-medium shadow transition ` +
                  (hasAnyData
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed')
                }
              >
                Экспорт в Excel
              </button>
            </div>
            {/* Таблицы или индикатор загрузки */}
            {(!selectedFilter || !selectedList) ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Выберите фильтр и значение</div>
            ) : !tablesReady ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : (!hasAnyData && !wasTableManuallyRefreshed && !wasMarkerSet ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-base text-center px-4">
                Укажите на карте точку или обновите таблицы с карты
              </div>
            ) : (
            <Tabs defaultValue="stp" className="h-full flex flex-col">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="stp">Точки (STP) ({rowData.stp.length})</TabsTrigger>
                <TabsTrigger value="stl">Линии (STL) ({rowData.stl.length})</TabsTrigger>
                <TabsTrigger value="sta">Полигоны (STA) ({rowData.sta.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stp" className="flex-1 overflow-hidden">
                <div className="ag-theme-alpine h-full w-full">
                  <AgGridReact<FeatureRowData>
                    key={gridKey}
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
                    key={gridKey}
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
                    key={gridKey}
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
            ))}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default PageFilter;
