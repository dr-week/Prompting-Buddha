"use client";

import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

export function PromptOutput({ title, prompt, onClose }: { title: string; prompt: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }
  return (
    <aside className="output-panel" aria-label="Compiled prompt">
      <header>
        <div><span className="eyebrow">Output</span><h2>{title}</h2></div>
        <div className="row-actions">
          <button className="icon-button" onClick={copy} aria-label="Copy prompt">{copied ? <Check size={18} /> : <Copy size={18} />}</button>
          <button className="icon-button" onClick={onClose} aria-label="Close output"><X size={18} /></button>
        </div>
      </header>
      <pre>{prompt}</pre>
    </aside>
  );
}
