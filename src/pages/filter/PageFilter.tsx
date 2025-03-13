import FilterMap from "@/components/map/FilterMap";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SelectFilter } from "./SelectFilter";
import { AreaFilter } from "./AreaFilter";
import React from "react";
import { Button } from "@/components/ui/button";

function PageFilter() {
  const [valueFilter, setValueFilter] = React.useState("");
  const [valueList, setValueList] = React.useState("");

// Выбрали из выпадающего списка
  const handleFilterChange = (selectedValue: string) => {
    setValueFilter(selectedValue);
    setValueList("");
    console.log("Выбранный фильтр:", selectedValue);
    // Здесь можно обновить состояние родительского компонента или выполнить другие действия
  };
  
  // Выбрали из списка
  const handleListChange = (selectedValue: string) => {
    setValueList(selectedValue);
    console.log("Выбранный из списка:", selectedValue);
    // Здесь можно обновить состояние родительского компонента или выполнить другие действия
  };

  
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="mt-5 w-full min-h-14 rounded-lg border absolute l-0 t-0"
    >
      <ResizablePanel defaultSize={15} className="mt-10 flex w-full items-center  min-w-28 max-w-64">
        <div className="mt-20 min-h-full w-full items-center min-w-24">
          <SelectFilter onChange={handleFilterChange} />
          <AreaFilter onChange={handleListChange} selectFilter={valueFilter}/>  
          {/* <Button/> */}
        </div>
        
        {/* <div className="flex h-full items-center justify-center p-6 min-w-24">
          <span className="font-semibold">Sidebar</span>
        </div> */}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85}>
        <FilterMap selectFilter={valueFilter} selectList={valueList}/>
        {/* <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div> */}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default PageFilter;

// max-w-md 
// h-full min-h-[50px]  md:min-w-[450px] lg:min-w-[50px]
