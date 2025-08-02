import AuthContextProvider from "./auth/auth-context";
import ScrollToTop from "./components/scroll-to-top";
import AppContextProvider from "./contexts/app-context";
import Router from "./routes";
import ThemeProvider from "./utils/theme";
import { SnackbarProvider } from 'notistack';

function App() {

  return (
    <AuthContextProvider>
      <AppContextProvider>
        <ThemeProvider>
          <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
            <ScrollToTop />
            <Router />
          </SnackbarProvider>
        </ThemeProvider>
      </AppContextProvider>
    </AuthContextProvider>
  )
}

export default App
