"use client"

import React, { useState, useEffect } from "react";
import { IReport, IResultReport } from "@/types/models";
import { gdx2_urls } from "@/config/urls";
import axios, { AxiosError } from "axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import ReportDrawer from "./ReportDrawer";
import MyCard from "./myCard";
import { List, Grid, Table2, ChevronDown, Filter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export default function SearchInput() {
  const [inputValue, setInputValue] = React.useState("");
  const [msgError, setMsgError] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<IReport[]>([]);
  const [filteredResults, setFilteredResults] = useState<IReport[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "list" | "table">("cards");
  
  // Фильтры
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [availableTGFs, setAvailableTGFs] = useState<string[]>([]);
  const [selectedTGFs, setSelectedTGFs] = useState<string[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [availableWorkTypes, setAvailableWorkTypes] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [availableTGFTyumen, setAvailableTGFTyumen] = useState<string[]>([]);
  const [selectedTGFTyumen, setSelectedTGFTyumen] = useState<string[]>([]);
  
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentItem, setCurrentItem] = useState<IReport>();

  // Обновление доступных фильтров
  useEffect(() => {
    if (searchResults.length > 0) {
      const years = [...new Set(searchResults.map(item => item.year_str).filter(Boolean))]
        .sort((a, b) => b.localeCompare(a));
      
      const authors = [...new Set(searchResults.map(item => item.author_name).filter(Boolean))]
        .sort();
      
      const tgfs = [...new Set(searchResults.map(item => item.tgf).filter(Boolean))]
        .sort();
      
      const tgfTyumen = [...new Set(searchResults.map(item => item.tgf_tmn).filter(Boolean))]
        .sort();
      
      const areas = [...new Set(searchResults.map(item => item.areaoil).filter(Boolean))]
        .sort((a, b) => parseFloat(a) - parseFloat(b));
      
      const sheets = [...new Set(searchResults.map(item => item.list_name).filter(Boolean))]
        .sort();
      
      const workTypes = [...new Set(searchResults.map(item => item.vid_rab).filter(Boolean))]
        .sort();

      const regions = [...new Set(searchResults.map(item => item.subrf_name).filter(Boolean))]
        .sort();

      setAvailableYears(years);
      setAvailableAuthors(authors);
      setAvailableTGFs(tgfs);
      setAvailableTGFTyumen(tgfTyumen);
      setAvailableAreas(areas);
      setAvailableSheets(sheets);
      setAvailableWorkTypes(workTypes);
      setAvailableRegions(regions);
      setFilteredResults(searchResults);
    }
  }, [searchResults]);

  // Применение фильтров
  useEffect(() => {
    if (searchResults.length === 0) return;
    
    let results = [...searchResults];
    
    if (selectedYears.length > 0) {
      results = results.filter(item => selectedYears.includes(item.year_str));
    }
    
    if (selectedAuthors.length > 0) {
      results = results.filter(item => selectedAuthors.includes(item.author_name));
    }
    
    if (selectedTGFs.length > 0) {
      results = results.filter(item => selectedTGFs.includes(item.tgf));
    }
    
    if (selectedTGFTyumen.length > 0) {
      results = results.filter(item => selectedTGFTyumen.includes(item.tgf_tmn));
    }
    
    if (selectedAreas.length > 0) {
      results = results.filter(item => selectedAreas.includes(item.areaoil));
    }
    
    if (selectedSheets.length > 0) {
      results = results.filter(item => selectedSheets.includes(item.list_name));
    }
    
    if (selectedWorkTypes.length > 0) {
      results = results.filter(item => selectedWorkTypes.includes(item.vid_rab));
    }

    if (selectedRegions.length > 0) {
      results = results.filter(item => selectedRegions.includes(item.subrf_name));
    }
    
    setFilteredResults(results);
  }, [
    selectedYears, 
    selectedAuthors, 
    selectedTGFs, 
    selectedTGFTyumen,
    selectedAreas, 
    selectedSheets, 
    selectedWorkTypes,
    selectedRegions,
    searchResults
  ]);

  const resetFilters = () => {
    setSelectedYears([]);
    setSelectedAuthors([]);
    setSelectedTGFs([]);
    setSelectedTGFTyumen([]);
    setSelectedAreas([]);
    setSelectedSheets([]);
    setSelectedWorkTypes([]);
    setSelectedRegions([]);
    setFilteredResults(searchResults);
  };

  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    
    setLoading(true);
    setMsgError('');
    const url = `${gdx2_urls.gdx2_url_report_search}${inputValue}`;
    
    try {
      const response = await axios.get<IResultReport>(url);
      setSearchResults(response?.data.data || []);
      resetFilters();
    } catch (e: unknown) {
      const error = e as AxiosError;
      setMsgError(error.message);
      setSearchResults([]);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

  const showDrawer = (item: IReport) => {
    setCurrentItem(item);
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  return (
    <div className="w-full mt-2">
      {/* Поле поиска */}
      <div className="flex w-full items-center space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Поиск..."
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Spinner className="mr-2" /> : null}
          Найти
        </Button>
      </div>

      {/* Статус поиска */}
      <div className="flex justify-between items-center mt-2 p-2 bg-muted rounded-md">
        <div>
          Найдено: <strong>{filteredResults.length}</strong> из {searchResults.length}
        </div>
        {searchResults.length > 0 && (
          <div className="flex space-x-2">
            <Button 
              variant={viewMode === "cards" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <Table2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Панель фильтров */}
      {searchResults.length > 0 && (
        <div className="mt-3 p-3 bg-muted rounded-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-2">
              {/* Фильтр по годам */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                    Год {selectedYears.length > 0 && `(${selectedYears.length})`}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-48 overflow-y-auto">
                  {availableYears.map(year => (
                    <DropdownMenuCheckboxItem
                      key={year}
                      checked={selectedYears.includes(year)}
                      onCheckedChange={() => setSelectedYears(prev => 
                        prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
                      )}
                    >
                      {year}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Фильтр по авторам */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                    Автор {selectedAuthors.length > 0 && `(${selectedAuthors.length})`}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-48 overflow-y-auto">
                  {availableAuthors.map(author => (
                    <DropdownMenuCheckboxItem
                      key={author}
                      checked={selectedAuthors.includes(author)}
                      onCheckedChange={() => setSelectedAuthors(prev => 
                        prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
                      )}
                    >
                      {author}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Фильтр по ТГФ */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                    ТГФ {selectedTGFs.length > 0 && `(${selectedTGFs.length})`}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-48 overflow-y-auto">
                  {availableTGFs.map(tgf => (
                    <DropdownMenuCheckboxItem
                      key={tgf}
                      checked={selectedTGFs.includes(tgf)}
                      onCheckedChange={() => setSelectedTGFs(prev => 
                        prev.includes(tgf) ? prev.filter(t => t !== tgf) : [...prev, tgf]
                      )}
                    >
                      {tgf}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Фильтр по № отчета в Тюменском ТГФ */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                    № ТюмТГФ {selectedTGFTyumen.length > 0 && `(${selectedTGFTyumen.length})`}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-48 overflow-y-auto">
                  {availableTGFTyumen.map(tgf_tmn => (
                    <DropdownMenuCheckboxItem
                      key={tgf_tmn}
                      checked={selectedTGFTyumen.includes(tgf_tmn)}
                      onCheckedChange={() => setSelectedTGFTyumen(prev =>
                        prev.includes(tgf_tmn) ? prev.filter(t => t !== tgf_tmn) : [...prev, tgf_tmn]
                      )}
                    >
                      {tgf_tmn}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Фильтр по площади */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                    Площадь {selectedAreas.length > 0 && `(${selectedAreas.length})`}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-48 overflow-y-auto">
                  {availableAreas.map(area => (
                    <DropdownMenuCheckboxItem
                      key={area}
                      checked={selectedAreas.includes(area)}
                      onCheckedChange={() => setSelectedAreas(prev => 
                        prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
                      )}
                    >
                      {area}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Фильтр по листам карты */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                    Листы {selectedSheets.length > 0 && `(${selectedSheets.length})`}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-48 overflow-y-auto">
                  {availableSheets.map(sheet => (
                    <DropdownMenuCheckboxItem
                      key={sheet}
                      checked={selectedSheets.includes(sheet)}
                      onCheckedChange={() => setSelectedSheets(prev => 
                        prev.includes(sheet) ? prev.filter(s => s !== sheet) : [...prev, sheet]
                      )}
                    >
                      {sheet}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Фильтр по виду работ */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                    Вид работ {selectedWorkTypes.length > 0 && `(${selectedWorkTypes.length})`}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-48 overflow-y-auto">
                  {availableWorkTypes.map(workType => (
                    <DropdownMenuCheckboxItem
                      key={workType}
                      checked={selectedWorkTypes.includes(workType)}
                      onCheckedChange={() => setSelectedWorkTypes(prev => 
                        prev.includes(workType) ? prev.filter(w => w !== workType) : [...prev, workType]
                      )}
                    >
                      {workType}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Фильтр по субъектам РФ */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
                    Субъект РФ {selectedRegions.length > 0 && `(${selectedRegions.length})`}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 w-48 overflow-y-auto">
                  {availableRegions.map(region => (
                    <DropdownMenuCheckboxItem
                      key={region}
                      checked={selectedRegions.includes(region)}
                      onCheckedChange={() => setSelectedRegions(prev => 
                        prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
                      )}
                    >
                      {region}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Кнопка сброса фильтров */}
            {(selectedYears.length > 0 || selectedAuthors.length > 0 || selectedTGFs.length > 0 || 
              selectedTGFTyumen.length > 0 || selectedAreas.length > 0 || selectedSheets.length > 0 ||
              selectedWorkTypes.length > 0 || selectedRegions.length > 0) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={resetFilters}
                className="whitespace-nowrap text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3 mr-1" />
                Сбросить
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Результаты */}
      {isLoading ? (
        <div className="flex justify-center mt-4">
          <Spinner size="lg" />
        </div>
      ) : msgError ? (
        <div className="text-destructive mt-4">{msgError}</div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mt-4">
          {filteredResults.map(item => (
            <MyCard 
              key={item.id} 
              item={item} 
              onClick={() => showDrawer(item)} 
            />
          ))}
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-2 mt-4">
          {filteredResults.map(item => (
            <div 
              key={item.id}
              className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => showDrawer(item)}
            >
              <h3 className="font-medium">{item.report_name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.author_name && `${item.author_name}, `}
                {item.year_str}
                {item.tgf && `, ТГФ: ${item.tgf}`}
                {item.areaoil && `, Площадь: ${item.areaoil}`}
                {item.subrf_name && `, ${item.subrf_name}`}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <div className="flex gap-2 mb-2">
            <Button size="sm" variant="outline" onClick={() => {
              // Копировать в буфер обмена
              const header = ['№', 'Название отчета', 'Авторы', 'Организация', 'Год окончания работ', '№ отчета в РГФ', '№ отчета в Тюменском ТГФ', 'Ссылка'];
              const rows = filteredResults.map((item, idx) => [
                idx + 1,
                item.report_name,
                item.author_name,
                item.org_name,
                item.year_str,
                item.rgf,
                item.tgf_tmn,
                item.folder_root || ''
              ]);
              const escapeCell = (cell: any) => {
                const str = String(cell ?? '');
                if (str.length > 30) {
                  return '"' + str.replace(/"/g, '""') + '"';
                }
                return str;
              };
              const text = [header, ...rows].map(row => row.map(escapeCell).join('\t')).join('\n');
              navigator.clipboard.writeText(text);
              toast.success('Скопировано в буфер обмена');
            }}>
              Копировать в буфер обмена
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              // Экспорт в CSV с BOM и разделителем ;
              const header = ['№', 'Название отчета', 'Авторы', 'Организация', 'Год окончания работ', '№ отчета в РГФ', '№ отчета в Тюменском ТГФ', 'Ссылка'];
              const rows = filteredResults.map((item, idx) => [
                idx + 1,
                item.report_name,
                item.author_name,
                item.org_name,
                item.year_str,
                item.rgf,
                item.tgf_tmn,
                item.folder_root || ''
              ]);
              const csv = '\uFEFF' + [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\r\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'reports.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}>
              Экспорт в CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              // Экспорт в Excel (xlsx)
              const header = ['№', 'Название отчета', 'Авторы', 'Организация', 'Год окончания работ', '№ отчета в РГФ', '№ отчета в Тюменском ТГФ', 'Ссылка'];
              const rows = filteredResults.map((item, idx) => [
                idx + 1,
                item.report_name,
                item.author_name,
                item.org_name,
                item.year_str,
                item.rgf,
                item.tgf_tmn,
                item.folder_root || ''
              ]);
              const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Reports');
              XLSX.writeFile(wb, 'reports.xlsx');
            }}>
              Экспорт в Excel
            </Button>
          </div>
          <table className="min-w-full border text-sm bg-background">
            <thead>
              <tr>
                <th className="border px-2 py-1">№</th>
                <th className="border px-2 py-1">Название отчета</th>
                <th className="border px-2 py-1">Авторы</th>
                <th className="border px-2 py-1">Организация</th>
                <th className="border px-2 py-1">Год окончания работ</th>
                <th className="border px-2 py-1">№ отчета в РГФ</th>
                <th className="border px-2 py-1">№ отчета в Тюменском ТГФ</th>
                <th className="border px-2 py-1">Ссылка</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((item, idx) => (
                <tr key={item.id} className="hover:bg-accent cursor-pointer" onClick={() => showDrawer(item)}>
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">{item.report_name}</td>
                  <td className="border px-2 py-1">{item.author_name}</td>
                  <td className="border px-2 py-1">{item.org_name}</td>
                  <td className="border px-2 py-1">{item.year_str}</td>
                  <td className="border px-2 py-1">{item.rgf}</td>
                  <td className="border px-2 py-1">{item.tgf_tmn}</td>
                  <td className="border px-2 py-1">
                    {item.folder_root || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Детали отчета */}
      {openDrawer && (
        <ReportDrawer 
          open={openDrawer} 
          onClose={onClose} 
          item={currentItem}
        />
      )}
    </div>
  );
}
