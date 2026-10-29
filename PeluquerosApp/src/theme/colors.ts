export const lightColors = {
  background: '#ffffff',
  text: '#1f1f1f',
  primary: '#333c87',
  primaryInactive: '#4a5199',
  border: '#d7d9f0',
  card: '#ffffff',
  tabBar: '#ffffff',
  surface: '#ffffff',
  inputBackground: '#f8f9fa',
  muted: '#5f6368',
} as const;

export const darkColors = {
  background: '#0f1026',
  text: '#f4f4f7',
  primary: '#9aa0ff',
  primaryInactive: '#b9bcff',
  border: '#2a2d5a',
  card: '#1a1d3a',
  tabBar: '#151833',
  surface: '#151833',
  inputBackground: '#1a1d3a',
  muted: '#b9bcff',
} as const;


export type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  primaryInactive: string;
  border: string;
  card: string;
  tabBar: string;
  surface: string;
  inputBackground: string;
  muted: string;
};
