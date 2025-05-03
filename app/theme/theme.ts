export interface CustomTheme {
  dark: boolean;
  colors: {
    primary: string;
    background:string;
    text:string;
    themeTab: string;
    secondary: string;
    tertiary: string;
    card:string;
    text1:string;
    green:string;
  };
}

export type AppTheme = 'light' | 'dark' | 'system';

export const lightTheme: CustomTheme = {
  dark: false,
  colors: {
    primary: '#3bb3b1',
    background:'#fff',
    text:'#000',
    themeTab: '#3bb3b1',
    secondary: "#8BECEB",
    tertiary: '#3F87FC',
    card: '#f1f1f1',
    text1:"#000",
    green:'#3bb3b1'
  },
};

export const darkTheme: CustomTheme = {
  dark: true,
  colors: {
    primary: '#121212',
    background:'#000',
    text:'#fff',
    themeTab: '#3bb3b1',
    secondary: "#8BECEB",
    tertiary: '#3F87FC',
    card: '#1e1e1e',
    text1:"#fff",
    green:"#3bb3b1"
  },
};
