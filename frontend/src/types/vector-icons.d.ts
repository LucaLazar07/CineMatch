declare module "@expo/vector-icons" {
  import type { ComponentType } from "react";
  import type { TextProps } from "react-native";

  export const Feather: ComponentType<{
    name: string;
    size?: number;
    color?: string;
    style?: TextProps["style"];
  }>;

  export const MaterialCommunityIcons: ComponentType<{
    name: string;
    size?: number;
    color?: string;
    style?: TextProps["style"];
  }>;
}
