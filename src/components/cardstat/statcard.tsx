import { useCounts } from "@/hooks/useCounts";
// import { Card, CardFooter, CardHeader } from "../card";
// import { Spinner } from "../spinner";
// import Link from "next/link";
import { IStatList } from "@/config/lists";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { Link } from "react-router-dom";
import { Spinner } from "../ui/spinner";

// const url = gdx2_urls.gdx2_url_report_author_count

interface StatCardProps {
  key: number; 
  item: IStatList;
}

export default function StatCard (item_prop: StatCardProps ) {

  const { stat_count, loading, error,} = useCounts(item_prop?.item?.url!)

  return (        
        <Card key={item_prop?.item?.title}  className="hover:bg-slate-200 dark:hover:bg-slate-600">
          {/* <CardHeader className="flex gap-3">  </CardHeader> */}
          <Link                
                // className="flex items-center gap-1 text-current"
                to={`${item_prop?.item?.link}`}
                title="Подробнее..."
              >
          <CardHeader className="overflow-visible p-3">
          <b>{item_prop?.item?.title}</b>
          </CardHeader>
          <CardFooter className="text-small justify-between">
            { loading && <Spinner size="md" className="bg-black dark:bg-white" /> }
            { error && `Error: ${error}` }
            {stat_count && <p className="text-default-500">{`${stat_count?.count}`}</p>}
          </CardFooter>
          </Link>
        </Card>
  );
}

