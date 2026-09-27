"use client";

import { Check, X, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";

const TAGS = [
  "warm brown skin", "deep complexion", "olive skin", "freckles", "visible pores", "sun weathered",
  "black hair", "loose waves", "short crop", "stubble", "clean shaven", "dark eyes",
  "denim", "linen", "silk", "leather", "streetwear", "formalwear", "Indian", "Western",
  "casual", "party", "editorial", "cinematic", "athletic", "mature styling", "sensual drama",
];

function score(query: string, tag: string) {
  const q = query.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const t = tag.toLowerCase();
  if (!q) return 0;
  if (t.startsWith(q)) return 100;
  if (t.includes(q)) return 80;
  const words = q.split(/\s+/).filter(Boolean);
  return words.filter((word) => t.includes(word)).length * 20;
}

export function CharacterTagInput({ onApply }: { onApply: (tags: string[]) => void }) {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const suggestions = useMemo(() => TAGS.map((tag) => ({ tag, score: score(value, tag) })).filter((item) => item.score > 0).toSorted((a, b) => b.score - a.score).slice(0, 5), [value]);
  const add = (tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    const next = tags.includes(clean) ? tags : [...tags, clean];
    setTags(next); setValue(""); onApply(next);
  };
  const remove = (tag: string) => { const next = tags.filter((item) => item !== tag); setTags(next); onApply(next); };
  const submit = () => { if (suggestions[0]) add(suggestions[0].tag); else if (value.trim()) add(value); };
  return <div className="character-tag-input">
    <WandSparkles size={15} aria-hidden="true" />
    <div className="character-tag-list">
      {tags.map((tag) => <span className="character-tag" key={tag}>{tag}<button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}><X size={11} /></button></span>)}
      <input value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); submit(); } if (event.key === "Escape") setValue(""); }} placeholder="Add character traits…" aria-label="Add character traits" />
    </div>
    {value && <div className="character-tag-suggestions" role="listbox">
      {suggestions.map(({ tag }) => <button type="button" key={tag} onClick={() => add(tag)}><Check size={12} />{tag}</button>)}
      <button type="button" className="custom-tag" onClick={() => add(value)}>Use “{value}”</button>
    </div>}
  </div>;
}
