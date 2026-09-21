"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { defaultCustomizerState } from "@/lib/customizer-data";

export interface CustomizerState {
  portion: string;
  theme: string;
  color: string;
  flavor: string;
  note: string;
}

interface CustomizerContextValue {
  state: CustomizerState;
  setPortion: (value: string) => void;
  setTheme: (value: string) => void;
  setColor: (value: string) => void;
  setFlavor: (value: string) => void;
  setNote: (value: string) => void;
}

const CustomizerContext = createContext<CustomizerContextValue | null>(null);

/**
 * Orijinal HTML'deki global `state` objesinin React karşılığı.
 *
 * Kategori kartlarındaki "Bu Temayı Tasarla" linkleri (orijinalde
 * `selectThemeFromCategory` global fonksiyonu ile tema butonunu
 * programatik olarak tıklayan kod) burada aynı state'i paylaşarak
 * customizer'daki tema seçimini günceller.
 */
export function CustomizerProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  /** Computed server-side from the currently active Supabase options, when available. */
  initialState?: CustomizerState;
}) {
  const [state, setState] = useState<CustomizerState>(initialState ?? defaultCustomizerState);

  const value = useMemo<CustomizerContextValue>(
    () => ({
      state,
      setPortion: (value) => setState((prev) => ({ ...prev, portion: value })),
      setTheme: (value) => setState((prev) => ({ ...prev, theme: value })),
      setColor: (value) => setState((prev) => ({ ...prev, color: value })),
      setFlavor: (value) => setState((prev) => ({ ...prev, flavor: value })),
      setNote: (value) => setState((prev) => ({ ...prev, note: value })),
    }),
    [state],
  );

  return <CustomizerContext.Provider value={value}>{children}</CustomizerContext.Provider>;
}

export function useCustomizer() {
  const ctx = useContext(CustomizerContext);
  if (!ctx) {
    throw new Error("useCustomizer must be used within a CustomizerProvider");
  }
  return ctx;
}
