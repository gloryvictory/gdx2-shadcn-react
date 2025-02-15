import { MouseEventHandler } from "react";
import { IReport } from "@/types/models";
// import ReportDrawer from "@/app/search/ReportDrawer";


export interface ReportCardProps  {
  onClick?: MouseEventHandler<HTMLDivElement>;
  item: IReport;
}

export default function MyCard({item, onClick } : ReportCardProps ) {
  // onClick
  return (
    <>
      <div onClick={onClick} className="flex flex-col p-2 bg-white shadow-lg rounded-lg border-2 max-w-[400px] hover:shadow-large  hover:outline-offset-1	 hover:ring-2 hover:ring-blue-500/50 focus:shadow-large focus:outline  focus:ring-2 focus:ring-blue-500/50
      dark:text-white dark:bg-slate-600">
        <div>
          <p className="text-gray-800 font-semibold dark:text-white ">
            {`${item.author_name.length ? `${item.author_name}` : 'Автор не указан.'} `}
          </p>
        </div>
        <hr className="mt-1 w-full h-divider"></hr>
        <div>
          <p className="mt-2 text-gray-600 dark:text-slate-100 ">
            {item.report_name}
          </p>
        </div>
        {/* <hr></hr> */}
        <div className="mt-auto  flex flex-col grow-1">
        <hr className="mt-1 w-full h-divider"></hr>
          <div className="text-small mt-2 p-2 flex flex-row gap-1 items-center justify-center space-x-6">
            <div className="text-small dark:text-slate-50 " >№ РГФ: <strong>{`${item.rgf.length ? `${item.rgf}` : ''} `} </strong></div>
            <div className="text-small dark:text-slate-50 " ><strong>{`${item.tgf.length ? `${item.tgf}` : ''} `}</strong></div>
            <div className="text-small dark:text-slate-50 " >Год: <strong>{`${item.year_str.length ? `${item.year_str}` : ''}`}</strong></div>
          </div>
        </div>
      </div>
      
    </>    
  );
};
