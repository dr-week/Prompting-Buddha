import { Clipboard, Shuffle, Sparkles, Flame } from "lucide-react";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";

export function CharacterToolbar({
  cast,
  activeIdx,
  onSelectCast,
  onRollMaster,
  onRollMature,
  matureContent,
  onCompile,
  onCopy,
  isOutputOpen,
  onAddCharacter,
}: {
  cast: CharacterConcept[];
  activeIdx: number;
  onSelectCast: (idx: number) => void;
  onRollMaster: () => void;
  onRollMature: () => void;
  matureContent: boolean;
  onCompile: () => void;
  onCopy: () => void;
  isOutputOpen: boolean;
  onAddCharacter: () => void;
}) {
  return (
    <header className="character-cockpit-toolbar">
      <div className="toolbar-left">
        <div className="cast-tab-group">
          {cast.map((char, idx) => (
            <button
              key={char.id || idx}
              type="button"
              className={`cast-tab ${activeIdx === idx ? "active" : ""}`}
              onClick={() => onSelectCast(idx)}
            >
              <span className="cast-tab-dot" />
              <span className="cast-tab-name">{char.name || `Character ${idx + 1}`}</span>
            </button>
          ))}
          {cast.length < 3 ? (
            <button
              type="button"
              className="cast-tab add"
              onClick={onAddCharacter}
              aria-label="Add character"
              title="Add character"
            >
              +
            </button>
          ) : null}
        </div>
      </div>

      <div className="toolbar-right">
        <div className="toolbar-random-group" aria-label="Character randomization">
          <button
            type="button"
            className="pill-button secondary"
            onClick={onRollMaster}
            title="Randomise unlocked character traits"
            aria-label="Randomise unlocked character traits"
          >
            <Shuffle size={14} />
          </button>
          {matureContent ? (
            <button
              type="button"
              className="pill-button mature-roll-btn"
              onClick={onRollMature}
              title="Mature random: unlocked mature traits only"
              aria-label="Mature random: unlocked mature traits only"
            >
              <Flame size={14} />
            </button>
          ) : null}
        </div>

        <div className="toolbar-utility-group" aria-label="Character tools">
        <button
          type="button"
          className="pill-button secondary"
          onClick={onCopy}
          title="Copy character prompt"
          aria-label="Copy character prompt"
        >
          <Clipboard size={14} />
        </button>

        <button
          type="button"
          className={`pill-button ${isOutputOpen ? "primary" : "secondary"}`}
          onClick={onCompile}
          title="Preview compiled prompt"
          aria-label="Preview character prompt"
        >
          <Sparkles size={14} />
        </button>
        </div>

      </div>
    </header>
  );
}
