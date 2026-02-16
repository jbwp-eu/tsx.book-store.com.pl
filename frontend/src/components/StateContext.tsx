import { createContext, useState, type ReactNode } from "react";

type StateContextType = {
  isFilter: boolean;
  isAdminMenu: boolean;
  isCarousel: boolean;
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdminMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCarousel: React.Dispatch<React.SetStateAction<boolean>>;
};

const StateContext = createContext<StateContextType>(
  null as unknown as StateContextType
);

const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const [isFilter, setIsFilter] = useState(false);
  const [isAdminMenu, setIsAdminMenu] = useState(false);
  const [isCarousel, setIsCarousel] = useState(true);

  const value = {
    isFilter,
    setIsFilter,
    isAdminMenu,
    setIsAdminMenu,
    isCarousel,
    setIsCarousel,
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

StateContextProvider.Context = StateContext;
export default StateContextProvider;
