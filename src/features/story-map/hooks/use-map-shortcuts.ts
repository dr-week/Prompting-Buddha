import { useEffect } from "react";

export function useMapShortcuts(undo: () => void, redo: () => void, deleteSelected?: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (!editing && deleteSelected && (event.key === "Delete" || event.key === "Backspace")) {
        event.preventDefault();
        deleteSelected();
        return;
      }
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) redo(); else undo();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteSelected, redo, undo]);
}
