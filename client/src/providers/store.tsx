import { createStore } from 'zustand/vanilla'

export type GlobalState = Record<string, any>

export type GlobalActions = {
  update: (payload: Record<string, any>) => void
}

export type GlobalStore = GlobalState & GlobalActions

export const defaultInitState: GlobalState = {
  count: 0,
}

export const createGlobalStore = (
  initState: GlobalState = defaultInitState,
) => {
  return createStore<GlobalStore>()((set) => ({
    ...initState,
    update: (payload) => set((state) => ({ ...state, ...payload }))
  }))
}