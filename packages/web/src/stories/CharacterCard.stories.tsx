import type { Meta, StoryObj } from "@storybook/react";
import { CharacterCard } from "../components/game/CharacterCard";
import { Character } from "@coup/shared";

const meta = {
  title: "Game/CharacterCard",
  component: CharacterCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CharacterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cover: Story = {
  args: {
    character: null,
  },
};

export const Duke: Story = {
  args: {
    character: Character.DUKE,
  },
};

export const Captain: Story = {
  args: {
    character: Character.CAPTAIN,
  },
};

export const Ambassador: Story = {
  args: {
    character: Character.AMBASSADOR,
  },
};

export const Contessa: Story = {
  args: {
    character: Character.CONTESSA,
  },
};

export const Assassin: Story = {
  args: {
    character: Character.ASSASSIN,
  },
};
