import { useState } from "react";
import { Copy, Check, Sparkles, X } from "lucide-react";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";

export function PromptPreviewDrawer({
  isOpen,
  character,
  compiledPrompt,
  onClose,
}: {
  isOpen: boolean;
  character: CharacterConcept;
  compiledPrompt: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="prompt-slideout-drawer">
      <div className="prompt-drawer-header">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-amber-500" />
          <span className="font-bold text-xs text-slate-800">
            {character.name} · 3-View Turnaround Prompt
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="copy-prompt-btn"
            onClick={handleCopy}
            title="Copy compiled turnaround prompt to clipboard"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="close-drawer-btn"
            onClick={onClose}
            aria-label="Close prompt preview"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="prompt-drawer-body">
        <div className="prompt-specs-pills">
          <span className="spec-pill">{character.tag}</span>
          <span className="spec-pill">{character.bodyType || "Standard Build"}</span>
          <span className="spec-pill">{character.eyeColor || "Dark Brown Eyes"}</span>
          <span className="spec-pill">AR 16:9</span>
          <span className="spec-pill">RAW 35mm</span>
        </div>
        <textarea
          readOnly
          value={compiledPrompt}
          className="prompt-compiled-textarea"
          rows={10}
        />
      </div>
    </div>
  );
}
