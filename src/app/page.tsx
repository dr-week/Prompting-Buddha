"use client";

import { useMemo, useState } from "react";
import { Aperture, ArrowRight, Check, ChevronDown, Clipboard, Clapperboard, Copy, Film, Frame, Lightbulb, MapPin, Play, RotateCcw, ScanFace, Shirt, SlidersHorizontal, Sparkles, TriangleAlert, Video, WandSparkles } from "lucide-react";

type Stage = "storyboard" | "video";
type FormState = { story:string; character:string; wardrobe:string; location:string; look:string; ratio:string; frames:number };

const initialState: FormState = {
  story:"At pre-dawn, a scrapyard worker gently wakes his son before the boy leaves for ITI.",
  character:"Same 19-year-old Indian male in every frame, slim build, medium-brown skin, short messy black hair. His father is the same lean man in his late 40s with greying stubble.",
  wardrobe:"Boy: faded grey T-shirt and dark work pants. Father: worn olive work shirt. No wardrobe changes in this scene.",
  location:"A cramped tin-sheet room inside a working scrapyard, bed on frame-left, doorway on frame-right, old motors and tools outside.",
  look:"Raw Indian short-film realism, natural skin, muted brown-green palette, warm practical light inside and cool dawn at the doorway.",
  ratio:"16:9", frames:4,
};
const shotTypes = ["Wide establishing", "Tight two-shot", "Insert close-up", "Medium profile"];

function storyboardPrompt(form: FormState) {
  const actions = [
    "Establish the room geography. The boy sleeps frame-left; his father approaches from frame-right.",
    "The father gently taps the boy's shoulder. The boy remains lying down with closed lips.",
    "Show the father's hand on the boy's shoulder and the slight movement of the bedsheet.",
    "The boy opens his eyes but remains on the bed. The father stays beside him near the doorway.",
  ];
  const shots = Array.from({length:form.frames},(_,i)=>`FRAME ${i+1} — ${shotTypes[i%4].toUpperCase()}\n${actions[i%4]}`).join("\n\n");
  return `CREATE ONE ${form.frames}-FRAME STORYBOARD — ${form.ratio}\n\nSTORY BEAT\n${form.story}\n\nCHARACTER LOCK\n${form.character}\nFaces, age, hair, skin tone and body proportions remain identical in every frame.\n\nWARDROBE LOCK\n${form.wardrobe}\n\nLOCATION LOCK\n${form.location}\nPreserve the bed, doorway, light sources and screen direction in every frame.\n\nVISUAL LOCK\n${form.look}\n\n${shots}\n\nCONTINUITY RULES\nOne continuous moment. Same characters, wardrobe, room geography, time of day and lighting across all frames. Each panel is a still composition, not a time-lapse or costume transition. No captions, borders, speech bubbles or text inside the images.`;
}

function videoPrompt(form: FormState) {
  const beats = [
    "The father enters the edge of frame and pauses beside the sleeping boy.",
    "The father gently taps the boy's shoulder twice. The boy breathes naturally and stays still.",
    "The boy's eyelids slowly open. The father's hand withdraws without changing position.",
    "The boy turns his gaze toward his father. Both remain quiet and restrained.",
  ];
  return Array.from({length:form.frames},(_,i)=>`SHOT ${String(i+1).padStart(2,"0")} — SOURCE: STORYBOARD FRAME ${i+1}\nUse the approved frame as the start frame. Preserve every visible identity, garment, prop, spatial relationship, color and light source exactly.\n\nMOTION\n${beats[i%4]} Movement is subtle, physically natural and limited to this single action.\n\nCAMERA\n${i===0?"Locked camera with barely perceptible handheld breathing.":"Hold the approved composition; no reframing, zoom, orbit or lens change."}\n\nENVIRONMENT\nOnly faint cloth movement and natural breathing. Keep the room geometry and background objects fixed.\n\nEND STATE\nEnd on a clean, stable frame that can be saved as the next shot's continuity reference.\n\nAUDIO\nLow scrapyard ambience, distant morning birds and soft metal creaks. No music. ${i===1?'Father, softly and off-camera: “उठ बेटा...” The boy does not speak; his lips remain closed.':"No dialogue."}`).join("\n\n────────────────────────────\n\n");
}

function IconButton({label,children,onClick}:{label:string;children:React.ReactNode;onClick?:()=>void}) {
  return <button className="icon-button" aria-label={label} title={label} onClick={onClick} type="button">{children}</button>;
}

export default function Home() {
  const [stage,setStage]=useState<Stage>("storyboard");
  const [form,setForm]=useState(initialState);
  const [copied,setCopied]=useState(false);
  const [generated,setGenerated]=useState(true);
  const output=useMemo(()=>stage==="storyboard"?storyboardPrompt(form):videoPrompt(form),[form,stage]);
  const warnings=useMemo(()=>{
    const items:string[]=[];
    if(form.frames>6) items.push("Too many panels can weaken visual consistency.");
    if(!/same|lock|identical/i.test(form.character)) items.push("Identity language will be added automatically.");
    if(/change|transformation|becomes/i.test(form.wardrobe)) items.push("Put wardrobe changes across an editorial cut, not inside one scene.");
    if(form.story.length<35) items.push("The story beat may be too vague for stable shot planning.");
    return items;
  },[form]);
  function update<K extends keyof FormState>(key:K,value:FormState[K]) { setForm(c=>({...c,[key]:value})); setGenerated(false); }
  async function copyOutput(){ await navigator.clipboard.writeText(output); setCopied(true); window.setTimeout(()=>setCopied(false),1500); }

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand" aria-label="Prompting Buddha"><span className="brand-mark"><Aperture size={18}/></span><span>Prompting Buddha</span></div>
      <div className="top-actions"><span className="flow-badge"><Sparkles size={14}/> Flow-ready</span><IconButton label="Reset project" onClick={()=>{setForm(initialState);setGenerated(true)}}><RotateCcw size={17}/></IconButton></div>
    </header>
    <section className="workspace">
      <aside className="rail" aria-label="Prompt stages">
        <button className={`rail-step ${stage==="storyboard"?"active":""}`} onClick={()=>setStage("storyboard")}><span>01</span><Frame size={19}/><strong>Storyboard</strong></button>
        <div className="rail-line"/>
        <button className={`rail-step ${stage==="video"?"active":""}`} onClick={()=>setStage("video")}><span>02</span><Video size={19}/><strong>Video</strong></button>
        <div className="rail-note"><Lightbulb size={17}/><p>One prompt per shot. Export storyboard panels separately.</p></div>
      </aside>
      <section className="editor-panel">
        <div className="section-heading"><div><span className="eyebrow">{stage==="storyboard"?"01 / COMPOSE":"02 / ANIMATE"}</span><h1>{stage==="storyboard"?"Storyboard prompt":"Video prompts"}</h1></div><span className="status"><span/> continuity on</span></div>
        {stage==="storyboard" ? <div className="form-stack">
          <Field icon={<Clapperboard size={16}/>} label="Story beat" value={form.story} onChange={v=>update("story",v)} />
          <Field icon={<ScanFace size={16}/>} label="Character lock" value={form.character} onChange={v=>update("character",v)} />
          <div className="field-row"><Field icon={<Shirt size={16}/>} label="Wardrobe" value={form.wardrobe} onChange={v=>update("wardrobe",v)} /><Field icon={<MapPin size={16}/>} label="Location" value={form.location} onChange={v=>update("location",v)} /></div>
          <Field icon={<WandSparkles size={16}/>} label="Visual lock" value={form.look} onChange={v=>update("look",v)} />
          <div className="compact-row">
            <label className="select-field"><Frame size={16}/><span>Frames</span><select value={form.frames} onChange={e=>update("frames",Number(e.target.value))}>{[3,4,5,6,8].map(n=><option key={n}>{n}</option>)}</select><ChevronDown size={14}/></label>
            <label className="select-field"><SlidersHorizontal size={16}/><span>Ratio</span><select value={form.ratio} onChange={e=>update("ratio",e.target.value)}><option>16:9</option><option>9:16</option><option>2.39:1</option><option>1:1</option></select><ChevronDown size={14}/></label>
          </div>
        </div> : <div className="video-setup">
          <div className="source-card"><Clipboard size={20}/><div><span>Source structure</span><strong>{form.frames} approved storyboard frames</strong></div><Check size={18}/></div>
          <div className="flow-rule"><Play size={18}/><p>Each frame becomes one continuous shot. The prompt describes motion—not a new image.</p></div>
          <div className="shot-map">{Array.from({length:form.frames},(_,i)=><div key={i}><span>{String(i+1).padStart(2,"0")}</span><div/><Video size={16}/></div>)}</div>
        </div>}
        <button className="generate-button" type="button" onClick={()=>setGenerated(true)}><Sparkles size={18}/><span>{stage==="storyboard"?"Generate storyboard prompt":"Generate video prompts"}</span><ArrowRight size={18}/></button>
      </section>
      <section className="output-panel">
        <div className="output-header"><div><Film size={17}/><span>{stage==="storyboard"?"STORYBOARD / MASTER":"VIDEO / SHOT SET"}</span></div><IconButton label="Copy prompt" onClick={copyOutput}>{copied?<Check size={17}/>:<Copy size={17}/>}</IconButton></div>
        <div className={`prompt-paper ${generated?"ready":"stale"}`}>{!generated&&<button className="refresh-overlay" onClick={()=>setGenerated(true)}><Sparkles size={18}/> Update prompt</button>}<pre>{output}</pre></div>
        <div className={`audit ${warnings.length?"warning":"clear"}`}>{warnings.length?<TriangleAlert size={17}/>:<Check size={17}/>}<div><strong>{warnings.length?`${warnings.length} prompt risk${warnings.length>1?"s":""}`:"Continuity check passed"}</strong><span>{warnings[0]??"Identity, wardrobe, geography and shot structure are explicit."}</span></div></div>
        {stage==="storyboard"&&<button className="next-button" onClick={()=>setStage("video")}><span>Convert to video</span><ArrowRight size={17}/></button>}
      </section>
    </section>
  </main>;
}

function Field({icon,label,value,onChange}:{icon:React.ReactNode;label:string;value:string;onChange:(value:string)=>void}){
  return <label className="field"><span>{icon}{label}</span><textarea value={value} onChange={e=>onChange(e.target.value)}/></label>;
}
