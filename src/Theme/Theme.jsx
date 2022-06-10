import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#00AB55',
      light:'#C8FACD'
    },
    secondary: {
      main: '#000000',
    },
    blue:{
      main:'#D0F2FF'
    },
    darkGray:{
        main:'#637381'
    }
  },
});

const Theme = ({children}) => {
  return <ThemeProvider theme={theme}>
      {children}
  </ThemeProvider>;
};

export default Theme;
