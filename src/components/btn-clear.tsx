import {RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

export const BtnRefresh = () => {
  return (
    <Button
      onClick={() =>{window.localStorage.clear(); window.location.reload();}}
      size="sm"
      variant="ghost"
      className="w-full justify-start"
    >
      <div className="flex gap-2">
        <RotateCcw className="size-5" />
        <span className="block lg:hidden"> Refresh </span>
      </div>
      <span className="sr-only">Refresh</span>
    </Button>
  );
};
