import MapComponent from "./components/map/sta/rgf/page";
import DataTableAreaoil from "./components/table/areaoil/table-areaoil";
import DataTableAuthor from "./components/table/author/table-author";
import DataTableField from "./components/table/field/table-field";
import DataTableList from "./components/table/list/table-list";
import DataTableLu from "./components/table/lu/table-lu";
import DataTableOrg from "./components/table/org/table-org";
import DataTablePi from "./components/table/pi/table-pi";
import DataTableReport from "./components/table/report/table-report";
import DataTableSubrf from "./components/table/subrf/table-subrf";
import DataTableVidrab from "./components/table/vidrab/table-vidrab";
import PageHome from "./pages/home/PageHome";
import PageMap from "./pages/map/PageMap";
import PageSearch from "./pages/search/PageSearch";
import PageStat from "./pages/stat/PageStat";


export const routes = [
    { path: "/", element: <PageHome /> },
    { path: "/stat", element: <PageStat /> },
    { path: "/search", element: <PageSearch /> },
    { path: "/map", element: <PageMap /> },
    { path: "/map2", element: <MapComponent /> },
    { path: "/table/report", element: <DataTableReport /> },
    { path: "/table/author", element: <DataTableAuthor /> },
    { path: "/table/list", element: <DataTableList /> },
    { path: "/table/subrf", element: <DataTableSubrf /> },
    { path: "/table/org", element: <DataTableOrg /> },
    { path: "/table/areaoil", element: <DataTableAreaoil /> },
    { path: "/table/field", element: <DataTableField /> },
    { path: "/table/lu", element: <DataTableLu /> },
    { path: "/table/pi", element: <DataTablePi /> },
    { path: "/table/vidrab", element: <DataTableVidrab /> },
]
