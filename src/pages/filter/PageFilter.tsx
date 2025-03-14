import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SelectFilter } from "./SelectFilter";
import { AreaFilter } from "./AreaFilter";
import FilterMap from "@/components/map/FilterMap";



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
      className="w-full h-full rounded-lg border overflow-hidden" // Добавлено overflow-hidden
    >
      <ResizablePanel defaultSize={20} className="min-w-28 max-w-64">
        <div className="flex flex-col h-full min-w-28 max-w-64 items-center justify-center p-2 overflow-hidden"> {/* Добавлено overflow-hidden */}
          <div className="w-full mb-1"> <SelectFilter onChange={handleFilterChange} /> </div>
          
          <AreaFilter onChange={handleListChange} selectFilter={valueFilter} />
        </div>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical" className="overflow-hidden"> {/* Добавлено overflow-hidden */}
          <ResizablePanel defaultSize={90} className="overflow-hidden"> {/* Добавлено overflow-hidden */}
            <FilterMap selectFilter={valueFilter} selectList={valueList} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={10} className="overflow-hidden"> {/* Добавлено overflow-hidden */}
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">потом придумаю что тут будет...</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>

  )
}

export default PageFilter;

// max-w-md 
// h-full min-h-[50px]  md:min-w-[450px] lg:min-w-[50px]

// Рабочий вариант
{/* <>
      <ResizablePanelGroup
        direction="horizontal"
        className="mt-5 w-full min-h-14 rounded-lg border absolute l-0 t-0"
      >
        <ResizablePanel defaultSize={15} className="mt-10 flex w-full items-center  min-w-28 max-w-64">
          <div className="mt-20 min-h-full w-full items-center min-w-24">
            <SelectFilter onChange={handleFilterChange} />
            <AreaFilter onChange={handleListChange} selectFilter={valueFilter}/>  
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={85}>
          <FilterMap selectFilter={valueFilter} selectList={valueList}/>
        </ResizablePanel>
      </ResizablePanelGroup>
    </> */}


        // <ResizablePanelGroup
    //   direction="horizontal"
    //   className="w-full h-full rounded-lg border "
    // >
    //   <ResizablePanel defaultSize={50}>
    //     <div className="flex flex-col h-full items-center justify-center p-2">
    //       <SelectFilter onChange={handleFilterChange} />
    //       <AreaFilter onChange={handleListChange} selectFilter={valueFilter}/>  
    //     </div>
    //   </ResizablePanel>

    //   <ResizableHandle />
    //   <ResizablePanel defaultSize={50}>
    //     <ResizablePanelGroup direction="vertical">
    //       <ResizablePanel defaultSize={90}>
    //         {/* <div className="flex h-full items-center justify-center p-6">
    //           <span className="font-semibold">Two</span>
    //         </div> */}
    //         <FilterMap selectFilter={valueFilter} selectList={valueList}/>
    //       </ResizablePanel>
    //       <ResizableHandle />
    //       <ResizablePanel defaultSize={10}>
    //         <div className="flex h-full items-center justify-center p-6">
    //           <span className="font-semibold">Three</span>
    //         </div>
    //       </ResizablePanel>
    //     </ResizablePanelGroup>
    //   </ResizablePanel>
    // </ResizablePanelGroup>
