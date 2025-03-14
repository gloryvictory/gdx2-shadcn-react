import { SiteHeader } from "@/components/site-header"
// import { useRoutes } from "react-router-dom"
import { TailwindIndicator } from "../../components/tailwind-indicator"
// import { routes } from "../../routes"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageHome from "../home/PageHome";
import PageStat from "../stat/PageStat";
import PageSearch from "../search/PageSearch";
import PageMap from "../map/PageMap";
import MapComponent from "@/components/map/sta/rgf/Map2";
import DataTableReport from "@/components/table/report/table-report";
import DataTableList from "@/components/table/list/table-list";
import DataTableSubrf from "@/components/table/subrf/table-subrf";
import DataTableOrg from "@/components/table/org/table-org";
import DataTableAreaoil from "@/components/table/areaoil/table-areaoil";
import DataTableField from "@/components/table/field/table-field";
import DataTableLu from "@/components/table/lu/table-lu";
import DataTablePi from "@/components/table/pi/table-pi";
import DataTableVidrab from "@/components/table/vidrab/table-vidrab";
import DataTableAuthor from "@/components/table/author/table-author";
import PageMessage from "../message/PageMessage";
import PageFilter from "../filter/PageFilter";


// { path: "/", element: <PageHome /> },
// { path: "/stat", element: <PageStat /> },
// { path: "/search", element: <PageSearch /> },
// { path: "/map", element: <PageMap /> },
// { path: "/map2", element: <MapComponent /> },
// { path: "/table/report", element: <DataTableReport /> },
// { path: "/table/author", element: <DataTableAuthor /> },
// { path: "/table/list", element: <DataTableList /> },
// { path: "/table/subrf", element: <DataTableSubrf /> },
// { path: "/table/org", element: <DataTableOrg /> },
// { path: "/table/areaoil", element: <DataTableAreaoil /> },
// { path: "/table/field", element: <DataTableField /> },
// { path: "/table/lu", element: <DataTableLu /> },
// { path: "/table/pi", element: <DataTablePi /> },
// { path: "/table/vidrab", element: <DataTableVidrab /> },

function App() {
  // const children = useRoutes(routes)

  return (
    <>
              {/* <div className="relative flex min-h-screen flex-col"> */}
      <div className="h-full w-full min-h-screen flex-col">
        <SiteHeader />
    
          {/* <div className="flex-1">{children}</div> */}
          <Routes>
            <Route path="/" element={<PageHome />} />
            <Route path="/stat" element={<PageStat />} />
            <Route path="/search" element={<PageSearch />} />
            <Route path="/map" element={<PageMap />} />
            <Route path="/map2" element={<MapComponent />} />
            <Route path="/table/report" element={<DataTableReport />} />
            <Route path="/table/author" element={<DataTableAuthor />} />
            <Route path="/table/list" element={<DataTableList />} />
            <Route path="/table/subrf" element={<DataTableSubrf />} />
            <Route path="/table/org" element={<DataTableOrg />} />
            <Route path="/table/areaoil" element={<DataTableAreaoil />} />
            <Route path="/table/field" element={<DataTableField />} />
            <Route path="/table/lu" element={<DataTableLu />} />
            <Route path="/table/pi" element={<DataTablePi />} />
            <Route path="/table/vidrab" element={<DataTableVidrab />} />
            <Route path="/message" element={<PageMessage />} />
            <Route path="/filter" element={<PageFilter />} />
            {/* <Route path="*" element={<NotFound />} /> Обработка 404 */}
          </Routes>
        <TailwindIndicator />
      </div>
    </>
  )
}

export default App
// relative flex 
