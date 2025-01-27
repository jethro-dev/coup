import { Character } from "@coup/shared";
import { CharacterCard } from "./CharacterCard";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface PlayerHandProps {
  cards: Character[];
}

const HOVER_SPREAD_FACTOR = 80;
const DEFAULT_SPREAD_FACTOR = 20;

export const PlayerHand = ({ cards }: PlayerHandProps) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const spreadFactor =
    hoveredCard !== null ? HOVER_SPREAD_FACTOR : DEFAULT_SPREAD_FACTOR;
  const totalSpreadWidth = spreadFactor * (cards.length - 1);
  const centerOffset = totalSpreadWidth / 2;

  // Calculate the middle index for rotation reference
  const middleIndex = (cards.length - 1) / 2;

  return (
    <div className="relative flex items-center justify-center w-full h-[300px] bg-red-500">
      {cards.map((card, index) => {
        const isHovered = hoveredCard === index;

        // Calculate rotation based on distance from center
        const rotationFactor = 20; // Adjust this to control curve intensity
        const rotationAngle = (index - middleIndex) * rotationFactor;

        return (
          <CharacterCard
            key={"card-" + index}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            character={card}
            className={cn(
              "absolute aspect-[2/3] h-[280px] border-2 border-black rounded-3xl hover:brightness-125 cursor-pointer transform transition-transform duration-300 overflow-hidden",
              ["bg-red-500", "bg-blue-500", "bg-purple-500"][index % 3]
            )}
            style={{
              transform: `rotate(${rotationAngle}deg) translateX(${
                -centerOffset + spreadFactor * index
              }px) translateY(${isHovered ? "-10px" : "0"})`,
              transformOrigin: "50% 100%",
              zIndex: index,
            }}
          />
        );
      })}
    </div>
  );
};
