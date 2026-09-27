import { useCallback, useEffect, useRef } from "react";
import type { StoryMapEdge, StoryMapNode } from "@/features/workspaces/types";

export type MindMapState = { nodes: StoryMapNode[]; edges: StoryMapEdge[] };
export type MapHistoryState = { past: MindMapState[]; future: MindMapState[] };

export function undoMapHistory(history: MapHistoryState, current: MindMapState) {
  const previous = history.past.at(-1);
  if (!previous) return null;
  return { state: structuredClone(previous), history: { past: history.past.slice(0, -1), future: [structuredClone(current), ...history.future] } };
}

export function redoMapHistory(history: MapHistoryState, current: MindMapState) {
  const next = history.future[0];
  if (!next) return null;
  return { state: structuredClone(next), history: { past: [...history.past, structuredClone(current)], future: history.future.slice(1) } };
}

export function useMapHistory(state: MindMapState, onChange: (next: MindMapState) => void, scopeId: string) {
  const history = useRef<MapHistoryState>({ past: [], future: [] });
  const current = useRef(state);
  const commit = useCallback((next: MindMapState) => { history.current.past.push(current.current); history.current.future = []; current.current = next; onChange(next); }, [onChange]);
  const undo = useCallback(() => { const result = undoMapHistory(history.current, current.current); if (!result) return; history.current = result.history; current.current = result.state; onChange(result.state); }, [onChange]);
  const redo = useCallback(() => { const result = redoMapHistory(history.current, current.current); if (!result) return; history.current = result.history; current.current = result.state; onChange(result.state); }, [onChange]);
  useEffect(() => {
    if (scopeId) {
      history.current = { past: [], future: [] };
    }
  }, [scopeId]);
  useEffect(() => { current.current = state; }, [state]);
  return { commit, undo, redo };
}
