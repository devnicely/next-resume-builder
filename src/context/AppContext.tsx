import React, { createContext, useContext } from 'react';


const AppContext = createContext();

// Create a context provider component
export const AppProvider: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { trpcClient, prismaClient } = pageProps;

  return (
    <AppContext.Provider value={{ trpcClient, prismaClient }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

// Custom hook to access the context
export const useAppContext = (): AppContextInterface => {
  const context = useContext(AppContext);
  if (!context) {
    // Throw an error or handle it according to your preference
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};