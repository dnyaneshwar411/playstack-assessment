'use client'

import { type ReactNode, createContext, useState, useContext } from 'react'
import { useStore } from 'zustand'
import { GlobalStore, createGlobalStore } from './store'

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(
  undefined
)

export type GlobalStoreContextType = {
  children: ReactNode
  payload: Record<string, any>
}

export const GlobalStoreProvider = ({
  children,
  payload
}: GlobalStoreContextType) => {
  const [store] = useState(() => createGlobalStore(payload))
  return (
    <GlobalStoreContext.Provider value={store}>
      {children}
    </GlobalStoreContext.Provider>
  )
}

export const useGlobalStore = <T,>(
  selector: (store: GlobalStore) => T,
): T => {
  const globalStoreContext = useContext(GlobalStoreContext)
  if (!globalStoreContext) {
    throw new Error(`useGlobalStore must be used within GlobalStoreProvider`)
  }

  return useStore(globalStoreContext, selector)
}