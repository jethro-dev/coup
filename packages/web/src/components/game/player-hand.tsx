import { Character } from "@coup/shared";
import { CharacterCard } from "./CharacterCard";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface PlayerHandProps {
  cards: Character[];
}

const HOVER_SPREAD_FACTOR = 20;
const DEFAULT_SPREAD_FACTOR = 10;

export const PlayerHand = ({ cards }: PlayerHandProps) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="relative flex items-center justify-center w-full h-[280px] bg-red-500">
      {cards.map((card, index) => {
        const spreadFactor =
          hoveredCard !== null ? HOVER_SPREAD_FACTOR : DEFAULT_SPREAD_FACTOR;
        const isHovered = hoveredCard === index;
        return (
          <CharacterCard
            key={"key" + index}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            character={card}
            className={cn(
              "absolute aspect-[2/3] h-[280px] border-2 border-black rounded-3xl hover:brightness-125 cursor-pointer transform transition-transform duration-300 overflow-hidden",
              ["bg-red-500", "bg-blue-500", "bg-purple-500"][index % 3]
            )}
            style={{
              transform: `rotate(-${
                spreadFactor * (cards.length - index - 1)
              }deg) translateX(${
                -spreadFactor * (cards.length - index - 1)
              }px) translateY(${isHovered ? "-10px" : "0"})`,
              transformOrigin: "50% 100%",
              zIndex: isHovered ? index + 2 : index,
            }}
          />
        );
      })}
    </div>
  );
};
