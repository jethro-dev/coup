export enum CardType {
  DUKE = "DUKE",
  ASSASSIN = "ASSASSIN",
  CAPTAIN = "CAPTAIN",
  AMBASSADOR = "AMBASSADOR",
  CONTESSA = "CONTESSA",
}

export interface CardProps {
  type: CardType;
}

export class Card {
  private readonly type: CardType;

  constructor(props: CardProps) {
    this.type = props.type;
  }

  public getType(): CardType {
    return this.type;
  }
}
