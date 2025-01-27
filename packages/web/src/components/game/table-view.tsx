import React from "react";
import { PlayerHand } from "./player-hand";
import { Character } from "@coup/shared";
import { cn } from "@/lib/utils";

type Props = {
  numOfPlayers: number;
};

export const TableView = ({ numOfPlayers }: Props) => {
  const mockCards = [Character.DUKE, Character.CAPTAIN];

  const getPlayerPositions = (playerCount: number) => {
    const positions = {
      1: ["bottom"],
      2: ["bottom", "top"],
      3: ["bottom", "topLeft", "topRight"],
      4: ["bottom", "left", "top", "right"],
      5: ["bottom", "bottomLeft", "topLeft", "topRight", "bottomRight"],
      6: ["bottom", "bottomLeft", "topLeft", "top", "topRight", "bottomRight"],
    } as const;

    const positionStyles = {
      bottom: "absolute bottom-0 left-1/2",
      top: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180",
      left: "absolute top-1/2 left-0 -translate-y-1/2 rotate-90",
      right: "absolute top-1/2 right-0 -translate-y-1/2 -rotate-90",
      topLeft:
        "absolute top-0 left-[25%] -translate-x-1/2 -translate-y-1/2 rotate-[150deg]",
      topRight:
        "absolute top-0 right-[25%] translate-x-1/2 -translate-y-1/2 -rotate-[150deg]",
      bottomLeft:
        "absolute bottom-0 left-[25%] -translate-x-1/2 translate-y-1/2 rotate-[30deg]",
      bottomRight:
        "absolute bottom-0 right-[25%] translate-x-1/2 translate-y-1/2 -rotate-[30deg]",
    };

    return (positions[playerCount as keyof typeof positions] || []).map(
      (position) => ({
        className: positionStyles[position as keyof typeof positionStyles],
      })
    );
  };

  return (
    <>
      {getPlayerPositions(numOfPlayers).map((position, index) => (
        <div key={index} className={cn(position.className)}>
          <PlayerHand cards={mockCards} />
        </div>
      ))}
    </>
  );
};
