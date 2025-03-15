import React, { createContext, useContext, useState } from "react";

const SectionContext = createContext<number>(0);
const SetSectionContext = createContext<React.Dispatch<React.SetStateAction<number>> | null>(null);

export const DraggableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sectionCount, setSectionCount] = useState(0);

  return (
    <SetSectionContext.Provider value={setSectionCount}>
      <SectionContext.Provider value={sectionCount}>
        {children}
      </SectionContext.Provider>
    </SetSectionContext.Provider>
  );
};

export const useSectionCount = () => useContext(SectionContext);
export const useSetSectionCount = () => useContext(SetSectionContext);
