import { list_stat } from "@/config/lists";
import StatCard from "./statcard";


export default function CardStat() {
  

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-2">

      {list_stat.map((item, index) => (
        <StatCard key={index} item={item}/>  
        ))
      }

    </div>
  );
}
// CardHeader
