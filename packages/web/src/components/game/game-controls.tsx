import React from "react";
import { Button } from "../ui/button";

type Props = {};

export const GameControls = (props: Props) => {
  return (
    <div className="absolute bottom-0 right-0 text-white p-2">
      <div className="grid grid-cols-3 grid-rows-2 gap-2">
        <div className="bg-black rounded-md flex items-center justify-center py-1">
          <span className="text-xs">Assassin</span>
        </div>
        <div className="bg-red-600 rounded-md flex items-center justify-center">
          <span className="text-xs">Duke</span>
        </div>
        <div className="bg-blue-600  rounded-md flex items-center justify-center">
          <span className="text-xs">Captain</span>
        </div>
        <div className="bg-yellow-600 rounded-md flex items-center justify-center">
          <span className="text-xs">Ambassador</span>
        </div>
        <div className="bg-green-600 rounded-md  col-start-2 col-span-2 flex items-center justify-center">
          <span className="text-xs">Income</span>
        </div>
      </div>
    </div>
  );
};
