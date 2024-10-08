import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface GlampingContextType {
  glampId: string | null;
  setGlampId?: (id: string | null) => void;
}

const defaultContextValue: GlampingContextType = {
  glampId: null,
};

const GlampingContext = createContext<GlampingContextType>(defaultContextValue);

export const GlampingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [glampId, setGlampId] = useState<string | null>(() => {
    return sessionStorage.getItem("glampId") || null;
  });

  useEffect(() => {
    if (glampId) {
      sessionStorage.setItem("glampId", glampId);
    } else {
      sessionStorage.removeItem("glampId");
    }
  }, [glampId]);

  return (
    <GlampingContext.Provider value={{ glampId, setGlampId }}>
      {children}
    </GlampingContext.Provider>
  );
};

export const useGlamping = () => {
  const context = useContext(GlampingContext);
  if (!context.setGlampId) {
    throw new Error("setGlampId is not available");
  }
  return context;
};
