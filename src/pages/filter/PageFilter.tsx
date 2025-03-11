import FilterMap from "@/components/map/FilterMap";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SelectFilter } from "./SelectFilter";
import { AreaFilter } from "./AreaFilter";

function PageFilter() {

  const handleFilterChange = (selectedValue: string) => {
    console.log("Выбранный фильтр:", selectedValue);
    // Здесь можно обновить состояние родительского компонента или выполнить другие действия
  };
  
  // min-h-screen
  // h-full 
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="mt-2 w-full min-h-14 rounded-lg border absolute l-0 t-0"
    >
      <ResizablePanel defaultSize={15} className="mt-10 flex w-full items-center  min-w-28 max-w-64">
        <div className="mt-20 min-h-full w-full items-center min-w-24">
          <SelectFilter onChange={handleFilterChange} />
          <AreaFilter />  
        </div>
        
        {/* <div className="flex h-full items-center justify-center p-6 min-w-24">
          <span className="font-semibold">Sidebar</span>
        </div> */}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85}>
        <FilterMap/>
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
