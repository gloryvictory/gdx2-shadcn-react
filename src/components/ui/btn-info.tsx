import { Info } from "lucide-react";
import { Button } from "./button";

export const BtnInfo = () => {
  return (
    <Button
      onClick={() =>{}}
      size="sm"
      variant="ghost"
      // className="w-full justify-start"
    >
      <div className="flex">
        <Info className="size-5" />
        <span className="block lg:hidden"> Info </span>
      </div>
      {/* <span className="sr-only">Info</span> */}
    </Button>
  );
};
export default BtnInfo;
