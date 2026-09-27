import { useState } from "react";
import { Box, Lock, Plus } from "lucide-react";
import type { CharacterConcept } from "@/lib/filmmaker-compiler";
import { createId } from "@/lib/id";
import type { PropAsset, PropCategory, PropScope } from "./types";
import { validatePropAsset } from "./prop-rules";

export function PropsLibraryPanel({ assets, characters, storyboardId, onSave, onUse }: {
  assets: PropAsset[];
  characters: CharacterConcept[];
  storyboardId: string;
  onSave: (asset: PropAsset) => void;
  onUse: (asset: PropAsset) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [scope, setScope] = useState<PropScope>("scene");
  const [category, setCategory] = useState<PropCategory>("personal");
  const [ownerCharacterId, setOwnerCharacterId] = useState("");
  const [error, setError] = useState("");

  const createAsset = () => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const asset: PropAsset = {
      id: createId("prop"), name: cleanName, category, scope, description: "", tags: [],
      ownerCharacterId: scope === "character" ? ownerCharacterId || characters[0]?.id : undefined,
      storyboardId: scope === "scene" ? storyboardId : undefined,
      locked: false, savedToLibrary: scope === "recurring",
    };
    const issue = validatePropAsset(asset)[0];
    if (issue) { setError(issue); return; }
    onSave(asset);
    onUse(asset);
    setName("");
    setCreating(false);
    setError("");
  };

  return <section className="props-library-panel">
    <header><span><Box size={13} /> Props</span><button type="button" onClick={() => setCreating((value) => !value)} aria-label="New prop"><Plus size={13} /></button></header>
    {creating ? <div className="props-quick-form">
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Prop name" aria-label="Prop name" />
      <div className="props-form-row">
        <select value={scope} onChange={(event) => setScope(event.target.value as PropScope)} aria-label="Prop scope">
          <option value="character">Character-owned</option><option value="scene">Scene</option><option value="recurring">Recurring</option>
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value as PropCategory)} aria-label="Prop category">
          <option value="personal">Personal</option><option value="furniture">Furniture</option><option value="food">Food</option><option value="vehicle">Vehicle</option><option value="gadget">Gadget</option><option value="tool">Tool</option><option value="work">Work</option><option value="other">Other</option>
        </select>
      </div>
      {scope === "character" ? <select value={ownerCharacterId} onChange={(event) => setOwnerCharacterId(event.target.value)} aria-label="Prop owner"><option value="">Choose owner</option>{characters.map((character) => <option key={character.id} value={character.id}>{character.name}</option>)}</select> : null}
      {error ? <small className="props-form-error">{error}</small> : null}
      <button type="button" className="props-create-button" onClick={createAsset} title="Add to map">Add</button>
    </div> : null}
    {assets.length ? <div className="props-library-list">{assets.map((asset) => <button type="button" key={asset.id} onClick={() => onUse(asset)}><span>{asset.name}</span><small>{asset.scope}</small>{asset.locked ? <Lock size={10} /> : null}</button>)}</div> : <small className="props-library-empty">Optional reusable objects.</small>}
  </section>;
}
