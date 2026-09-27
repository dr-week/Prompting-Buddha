"use client";

import { Lock } from "lucide-react";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";
import { SKIN_COMPLEXIONS } from "@/lib/filmmaker-compiler";

const skinToneLabel = (val = "") =>
  SKIN_COMPLEXIONS.find((s) => val.includes(s.label))?.label || "";

function InitialChip({ name, role }: { name: string; role?: string }) {
  const initial = (name || "?")[0].toUpperCase();
  const isLead = role === "lead" || role === "Protagonist";
  return (
    <span
      className={`char-summary-initial ${isLead ? "lead" : ""}`}
      aria-label={`Character: ${name}`}
    >
      {initial}
    </span>
  );
}

export function CharacterSummaryPanel({
  character,
  age,
  gender,
  locked,
}: {
  character: CharacterConcept;
  age: number;
  gender: "male" | "female";
  locked: Record<string, boolean>;
}) {
  const lockedKeys = Object.entries(locked)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <aside className="char-summary-rail" aria-label="Character summary">
      <div className="char-summary-header">
        <InitialChip name={character.name} role={character.role} />
        <div className="char-summary-name-block">
          <strong className="char-summary-name">{character.name || "Unnamed"}</strong>
          <span className="char-summary-tag">{character.tag}</span>
        </div>
      </div>

      <dl className="char-summary-dl">
        <div className="char-summary-row">
          <dt>Age</dt>
          <dd>{age} · {gender}</dd>
        </div>
        <div className="char-summary-row">
          <dt>Role</dt>
          <dd>{character.role || "—"}</dd>
        </div>
        {character.socioeconomicStatus && (
          <div className="char-summary-row">
            <dt>Lifestyle</dt>
            <dd className="capitalize">{character.socioeconomicStatus.replace("_", " ")}</dd>
          </div>
        )}
        <div className="char-summary-divider" />
        <div className="char-summary-row">
          <dt>Body</dt>
          <dd>{character.bodyType || "—"}</dd>
        </div>
        <div className="char-summary-row">
          <dt>Skin</dt>
          <dd>{skinToneLabel(character.skinTexture) || "—"}</dd>
        </div>
        <div className="char-summary-row">
          <dt>Hair</dt>
          <dd>{character.hairStyle ? `${character.hairStyle}, ${character.hairColor || ""}` : "—"}</dd>
        </div>
        <div className="char-summary-row">
          <dt>Eyes</dt>
          <dd>{character.eyeColor || "—"}</dd>
        </div>
        <div className="char-summary-divider" />
        <div className="char-summary-row">
          <dt>Outfit</dt>
          <dd>{character.outfitType || "—"}</dd>
        </div>
        <div className="char-summary-row">
          <dt>Colors</dt>
          <dd>{character.clothingPalette || "—"}</dd>
        </div>
        {character.footwear && (
          <div className="char-summary-row">
            <dt>Shoes</dt>
            <dd>{character.footwear}</dd>
          </div>
        )}
        <div className="char-summary-row">
          <dt>Condition</dt>
          <dd className="char-summary-condition-text">{character.personCondition?.split(".")[0] || "—"}</dd>
        </div>
      </dl>

      {lockedKeys.length > 0 && (
        <div className="char-summary-locks">
          <span className="char-summary-locks-label">
            <Lock size={10} />
            Locked
          </span>
          <div className="char-summary-lock-chips">
            {lockedKeys.map((k) => (
              <span key={k} className="char-summary-lock-chip">{k}</span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export function CharacterDrawerPanel({
  cast,
  activeIdx,
  savedCharacters,
  onSelectCast,
  onAddCharacter,
  onSave,
  onLoad,
  onDuplicate,
  onRemove,
}: {
  cast: CharacterConcept[];
  activeIdx: number;
  savedCharacters: CharacterConcept[];
  onSelectCast: (idx: number) => void;
  onAddCharacter: () => void;
  onSave: () => void;
  onLoad: (char: CharacterConcept) => void;
  onDuplicate: () => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <div className="char-drawer-panel">
      <div className="char-drawer-section-label">Cast</div>
      <div className="char-drawer-cast-list">
        {cast.map((c, idx) => (
          <div
            key={c.id || idx}
            className={`char-drawer-cast-row ${activeIdx === idx ? "active" : ""}`}
          >
            <button
              type="button"
              className="char-drawer-cast-btn"
              onClick={() => onSelectCast(idx)}
            >
              <span className="char-drawer-initial">{(c.name || "?")[0].toUpperCase()}</span>
              <span className="char-drawer-cast-info">
                <strong>{c.name || `Character ${idx + 1}`}</strong>
                <small>{c.role || "—"}</small>
              </span>
            </button>
            {activeIdx === idx && (
              <div className="char-drawer-cast-actions">
                <button type="button" className="char-drawer-action-btn" onClick={onSave} title="Save to library">↓</button>
                <button type="button" className="char-drawer-action-btn" onClick={onDuplicate} title="Duplicate">⧉</button>
                {cast.length > 1 && (
                  <button type="button" className="char-drawer-action-btn danger" onClick={() => onRemove(idx)} title="Remove">✕</button>
                )}
              </div>
            )}
          </div>
        ))}
        {cast.length < 3 && (
          <button type="button" className="char-drawer-add-btn" onClick={onAddCharacter}>
            + Add character
          </button>
        )}
      </div>

      {savedCharacters.length > 0 && (
        <>
          <div className="char-drawer-section-label" style={{ marginTop: 8 }}>Library</div>
          <div className="char-drawer-cast-list">
            {savedCharacters.map((c) => (
              <button
                key={c.id}
                type="button"
                className="char-drawer-cast-btn library-item"
                onClick={() => onLoad(c)}
              >
                <span className="char-drawer-initial saved">{(c.name || "?")[0].toUpperCase()}</span>
                <span className="char-drawer-cast-info">
                  <strong>{c.name}</strong>
                  <small>Load</small>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
