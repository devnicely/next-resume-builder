import '@fontsource/ibm-plex-sans/300.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';

import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import type { AppProps } from "next/app";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { Session } from "next-auth";
import { UserProfileProvider } from "~/context/UserProfileContext";
import store, { persistor } from "~/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider as ReduxProvider } from "react-redux";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ModalWarpper from "~/modals";
import { QueryClientProvider } from "react-query";
import queryClient from '~/services/react-query';
import WrapperRegistry from '~/wrappers/index';


interface CustomAppProps extends AppProps {
  pageProps: {
    session?: Session;
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  } & AppProps["pageProps"];
}

const MyApp: AppType = ({ Component, pageProps }: CustomAppProps) => {
  const session = pageProps.session;
  return (
    <ReduxProvider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
              <WrapperRegistry>
                <UserProfileProvider>
                  <Toaster />
                  <Component {...pageProps} />
                  <ModalWarpper />
                </UserProfileProvider>
              </WrapperRegistry>
            </SessionProvider>
          </QueryClientProvider>
        </PersistGate>
      </LocalizationProvider>
    </ReduxProvider>
  );
};

export default api.withTRPC(MyApp);
