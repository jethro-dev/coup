import { cn } from "@/lib/utils";
import { Character } from "@coup/shared";

const characterConfig = {
  [Character.CAPTAIN]: {
    color: "bg-blue-500 hover:bg-blue-400",
    symbol: "⚓",
    image: "/images/cards/captain.png",
  },
  [Character.AMBASSADOR]: {
    color: "bg-green-500 hover:bg-green-400",
    symbol: "🤝",
    image: "/images/cards/ambassador.png",
  },
  [Character.DUKE]: {
    color: "bg-purple-500 hover:bg-purple-400",
    symbol: "👑",
    image: "/images/cards/duke.png",
  },
  [Character.ASSASSIN]: {
    color: "bg-gray-500 hover:bg-gray-400",
    symbol: "🗡️",
    image: "/images/cards/assassin.png",
  },
  [Character.CONTESSA]: {
    color: "bg-red-500 hover:bg-red-400",
    symbol: "👸",
    image: "/images/cards/contessa.png",
  },
};

interface CharacterCardProps {
  character: Character | null;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const CharacterCard = ({
  character,
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CharacterCardProps) => {
  const config = character
    ? characterConfig[character]
    : {
        color: "bg-gray-800",
        symbol: "🃏",
        image: "/images/cards/coup.png",
      };

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "aspect-[2/3] border-2 border-black rounded-2xl hover:brightness-125 cursor-pointer transform transition-all duration-300 overflow-hidden",
        config.color,
        className
      )}
      style={style}
    >
      <img
        src={config.image}
        alt={`${character} card`}
        className="w-full h-full"
      />
    </button>
  );
};
