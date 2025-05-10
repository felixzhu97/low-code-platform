export type HistoryState<T> = {
  past: T[]
  present: T
  future: T[]
}

export function createHistory<T>(initialState: T): HistoryState<T> {
  return {
    past: [],
    present: initialState,
    future: [],
  }
}

export function undo<T>(history: HistoryState<T>): HistoryState<T> {
  const { past, present, future } = history

  if (past.length === 0) return history

  const previous = past[past.length - 1]
  const newPast = past.slice(0, past.length - 1)

  return {
    past: newPast,
    present: previous,
    future: [present, ...future],
  }
}

export function redo<T>(history: HistoryState<T>): HistoryState<T> {
  const { past, present, future } = history

  if (future.length === 0) return history

  const next = future[0]
  const newFuture = future.slice(1)

  return {
    past: [...past, present],
    present: next,
    future: newFuture,
  }
}

export function addToHistory<T>(history: HistoryState<T>, newPresent: T): HistoryState<T> {
  return {
    past: [...history.past, history.present],
    present: newPresent,
    future: [],
  }
}
