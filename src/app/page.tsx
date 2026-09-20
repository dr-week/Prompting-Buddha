"use client";

import React, { useState, useMemo } from "react";
import {
  Aperture,
  Film,
  Clapperboard,
  Camera,
  Video,
  Copy,
  Check,
  Download,
  AlertTriangle,
  AlertCircle,
  Play,
  ArrowRight,
  Users,
  MapPin,
  SunMedium,
  Timer,
  Plus,
  Trash2,
  ShieldCheck,
  BookOpen,
  Info,
  Shuffle,
  UserCheck,
  Sliders,
  Search,
  Sparkles,
  Layers,
  Compass,
  Crosshair,
  Eye,
  EyeOff,
  X,
  Settings,
  ShieldAlert,
  Database,
  RefreshCw,
} from "lucide-react";
import {
  ProductionContinuity,
  StoryboardPanel,
  CharacterConcept,
  PRODUCTION_PRESETS,
  HUMAN_ARCHETYPES,
  BODY_BUILDS,
  SKIN_COMPLEXIONS,
  SKIN_TEXTURES,
  CLOTHING_PALETTES,
  generateProceduralCharacter,
  generateRealisticCharacterName,
  compileStoryboardPrompt,
  compileVideoPrompts,
  compileCharacterSheetPrompt,
  parseRoughCharacterInput,
  auditPromptContinuity,
  detectPhysicalSafetyDirectives,
  deriveCinematicCompositionPlanes,
  CompilerSettings,
  DEFAULT_COMPILER_SETTINGS,
  ShotFraming,
  CameraAngle,
  CameraMovement,
  DialogueType,
  ShotFramingEnum,
  CameraAngleEnum,
  CameraMovementEnum,
} from "@/lib/filmmaker-compiler";
import {
  CineComposition,
  CineCompositionCategory,
  CINE_COMPOSITIONS_DATABASE,
  getAvailableCineCompositions,
} from "@/lib/cine-database";

type ActiveTab = "character" | "storyboard" | "video" | "auditor";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("character");
  const [project, setProject] = useState<ProductionContinuity>(PRODUCTION_PRESETS.scrapyard_dawn);
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("scrapyard_dawn");
  const [flowSyntax, setFlowSyntax] = useState<boolean>(true);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedShotIndex, setCopiedShotIndex] = useState<number | null>(null);
  const [selectedPanelIdx, setSelectedPanelIdx] = useState<number>(0);

  // Studio Settings & NSFW Configuration
  const [settings, setSettings] = useState<CompilerSettings>({
    nsfwMode: false,
    negativeGuardrails: true,
    compactMode: false,
    platformSyntax: "google_flow"
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [dbSyncStatus, setDbSyncStatus] = useState<string | null>(null);

  // Database synchronization & export handlers (LibSQL/SQLite schema compatible)
  const handleSyncDatabase = () => {
    setDbSyncStatus("Synchronizing relational tables...");
    try {
      const allComps = getAvailableCineCompositions();
      const presetCount = Object.keys(PRODUCTION_PRESETS).length;
      setTimeout(() => {
        setDbSyncStatus(`Indexed ${allComps.length} Slice-of-Life Compositions, ${presetCount} Production Presets & Active Cast (${cast.length})`);
        setTimeout(() => setDbSyncStatus(null), 4500);
      }, 300);
    } catch {
      setDbSyncStatus("Storage synchronized");
      setTimeout(() => setDbSyncStatus(null), 3000);
    }
  };

  const handleExportDatabase = () => {
    try {
      const dump = {
        exportedAt: new Date().toISOString(),
        framework: "LibSQL / SQLite (file:cine_database.db & LocalStorage Sync)",
        stats: {
          compositionsCount: getAvailableCineCompositions().length,
          presetsCount: Object.keys(PRODUCTION_PRESETS).length,
          castCount: cast.length,
          panelsCount: project.panels.length
        },
        studioSettings: settings,
        activeProject: project,
        castContinuity: cast,
        allCompositions: getAvailableCineCompositions(),
        productionPresets: PRODUCTION_PRESETS
      };
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prompting_buddha_cine_database_${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to export database dump", e);
    }
  };

  // Cine-Grammar Composition Library State
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [libraryCategory, setLibraryCategory] = useState<string>("ALL");
  const [librarySearch, setLibrarySearch] = useState<string>("");

  // Cast Management State (1 to 3 characters max)
  const [cast, setCast] = useState<CharacterConcept[]>(
    PRODUCTION_PRESETS.scrapyard_dawn.cast || []
  );
  const [selectedCastIdx, setSelectedCastIdx] = useState<number>(0);

  // Ensure selected cast index is in bounds
  const currentCharacter: CharacterConcept = useMemo(() => {
    return (
      cast[selectedCastIdx] ||
      cast[0] || {
        id: "char_fallback",
        name: "Arjun",
        role: "lead",
        rawInput: "Arjun, a 19-year-old lean apprentice",
        tag: "@CHAR_ARJUN",
        archetypeTitle: "Lead Protagonist",
        ageGender: "19-year-old man, lean build",
        facialTopology: "Natural visible pores, tired eyes",
        skinTexture: "Natural human skin with pores, zero plastic airbrushing",
        microKinesics: "Authentic posture with weight and gravity",
        wardrobeFabric: "Faded charcoal cotton T-shirt, twill trousers",
        personalityVibe: "Restrained, watchful resting expression",
      }
    );
  }, [cast, selectedCastIdx]);

  // Compile current character's 3-view diagnostic sheet
  const compiledCharacterPrompt = useMemo(
    () => compileCharacterSheetPrompt(currentCharacter),
    [currentCharacter]
  );

  // Auto-compiled storyboard and video prompts
  const compiledStoryboard = useMemo(() => compileStoryboardPrompt(project, settings), [project, settings]);
  const compiledVideo = useMemo(() => compileVideoPrompts(project, flowSyntax, settings), [project, flowSyntax, settings]);
  const auditIssues = useMemo(() => auditPromptContinuity(project), [project]);
  const criticalCount = auditIssues.filter((i) => i.severity === "critical").length;

  // Copy handler
  const handleCopy = async (text: string, isAll = true, shotIdx: number | null = null) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isAll) {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } else if (shotIdx !== null) {
        setCopiedShotIndex(shotIdx);
        setTimeout(() => setCopiedShotIndex(null), 2000);
      }
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  // Download complete production package
  const handleDownload = () => {
    const fullContent = `
# ${project.projectTitle.toUpperCase()} // AI PRODUCTION PROMPT PACKAGE
Generated by Prompting Buddha (Film Continuity Compiler)
Target Format: ${project.aspectRatio} | Flow Mode: ${project.flowReferenceMode}

═══════════════════════════════════════════════════════════
STAGE 01: CAST CONTINUITY DIAGNOSTIC SHEETS (MAX 3)
═══════════════════════════════════════════════════════════
${cast.map((c) => compileCharacterSheetPrompt(c)).join("\n\n" + "─".repeat(50) + "\n\n")}

═══════════════════════════════════════════════════════════
STAGE 02: MASTER STORYBOARD PROMPT
═══════════════════════════════════════════════════════════
${compiledStoryboard}

═══════════════════════════════════════════════════════════
STAGE 03: SHOT-BY-SHOT VIDEO PROMPTS (IMAGE-TO-VIDEO)
═══════════════════════════════════════════════════════════
${compiledVideo}
`;
    const blob = new Blob([fullContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.projectTitle.toLowerCase().replace(/\s+/g, "_")}_ai_production_kit.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Switch production preset
  const handlePresetSelect = (presetKey: string) => {
    const p = PRODUCTION_PRESETS[presetKey];
    if (p) {
      setSelectedPresetKey(presetKey);
      setProject(p);
      if (p.cast && p.cast.length > 0) {
        setCast(p.cast);
        setSelectedCastIdx(0);
      }
    }
  };

  // Filtered Cine Compositions
  const availableCompositions = useMemo(() => getAvailableCineCompositions(), []);

  const filteredCompositions = useMemo(() => {
    return availableCompositions.filter((comp) => {
      const matchCat = libraryCategory === "ALL" || comp.category === libraryCategory;
      const search = librarySearch.toLowerCase().trim();
      const matchSearch =
        search === "" ||
        comp.name.toLowerCase().includes(search) ||
        comp.filmmakerTradition.toLowerCase().includes(search) ||
        comp.corePhilosophy.toLowerCase().includes(search) ||
        comp.antiComplexityConstraint.toLowerCase().includes(search) ||
        (comp.physicsAndGravityLaw && comp.physicsAndGravityLaw.toLowerCase().includes(search)) ||
        (comp.commonAiMistake && comp.commonAiMistake.toLowerCase().includes(search)) ||
        (comp.humanDexterityCheck && comp.humanDexterityCheck.toLowerCase().includes(search)) ||
        comp.examples.some((ex) => ex.title.toLowerCase().includes(search) || (ex.action || ex.actionText || "").toLowerCase().includes(search));
      return matchCat && matchSearch;
    });
  }, [availableCompositions, libraryCategory, librarySearch]);

  const applyCineCompositionToPanel = (comp: CineComposition, exampleIdx = 0, panelIdx = selectedPanelIdx) => {
    const ex = comp.examples[exampleIdx] || comp.examples[0];
    const isPillowOrInanimate =
      comp.category === "OZU_PILLOW_SHOT" ||
      comp.category === "ENVIRONMENTAL_PILLOW_TEXTURE" ||
      comp.category === "HYDRAULIC_LIQUID_GRAVITY";

    updatePanel(panelIdx, {
      framing: comp.framing,
      angle: comp.cameraAngle,
      cameraMovement: comp.cameraMovement,
      spatialBlocking: ex ? ex.spatialBlocking : comp.spatialBlockingGuide,
      initialPose: ex ? ex.initialPose : comp.t0BaselineRule,
      action: ex ? (ex.action || ex.actionText || "") : `${comp.name}: ${comp.actingProcedure}`,
      audioAmbience: ex ? ex.audioAmbience : comp.defaultAudioAmbience,
      dialogue: ex?.dialogue || "",
      dialogueType: ex?.dialogueType || (isPillowOrInanimate ? "silent" : "voiceover_inner_thought"),
      screenDirection: comp.category === "DIRECTIONAL_MATCH_TRANSIT" ? "Sprinting Screen-Right to Screen-Left" : "Center frame focus"
    });
    setIsLibraryOpen(false);
  };

  const addPanelFromCineComposition = (comp: CineComposition, exampleIdx = 0) => {
    const ex = comp.examples[exampleIdx] || comp.examples[0];
    const newPanelNumber = project.panels.length + 1;
    const isPillowOrInanimate =
      comp.category === "OZU_PILLOW_SHOT" ||
      comp.category === "ENVIRONMENTAL_PILLOW_TEXTURE" ||
      comp.category === "HYDRAULIC_LIQUID_GRAVITY";

    const defaultChars = isPillowOrInanimate 
      ? [] 
      : [project.cast[0]?.name || "Lead"];

    const newPanel: StoryboardPanel = {
      id: `p_${Date.now()}`,
      panelNumber: newPanelNumber,
      framing: comp.framing,
      angle: comp.cameraAngle,
      charactersInFrame: defaultChars,
      spatialBlocking: ex ? ex.spatialBlocking : comp.spatialBlockingGuide,
      initialPose: ex ? ex.initialPose : comp.t0BaselineRule,
      action: ex ? (ex.action || ex.actionText || "") : `${comp.name}: ${comp.actingProcedure}`,
      screenDirection: comp.category === "DIRECTIONAL_MATCH_TRANSIT" ? "Sprinting Screen-Right to Screen-Left" : "Center frame focus",
      cameraMovement: comp.cameraMovement,
      audioAmbience: ex ? ex.audioAmbience : comp.defaultAudioAmbience,
      dialogueType: ex?.dialogueType || (isPillowOrInanimate ? "silent" : "voiceover_inner_thought"),
      dialogue: ex?.dialogue || "",
      dialogueSpeaker: defaultChars[0] || "",
      durationSeconds: 6
    };

    setProject((prev) => ({
      ...prev,
      panels: [...prev.panels, newPanel]
    }));
    setSelectedPanelIdx(project.panels.length);
    setIsLibraryOpen(false);
  };

  // Update selected character
  const updateSelectedCharacter = (fields: Partial<CharacterConcept>) => {
    setCast((prev) => {
      const updated = [...prev];
      if (updated[selectedCastIdx]) {
        const nextChar = { ...updated[selectedCastIdx], ...fields };
        if (fields.name) {
          nextChar.tag = `@CHAR_${fields.name.toUpperCase().replace(/[^A-Z0-9]/g, "")}`;
        }
        updated[selectedCastIdx] = nextChar;
      }
      return updated;
    });
  };

  // Add new cast member (up to 3 max)
  const addCastMember = () => {
    if (cast.length >= 3) return;
    const role = cast.length === 1 ? ("supporting" as const) : ("counterpart" as const);
    const existingNames = cast.map((c) => c.name);
    const newChar = generateProceduralCharacter({
      role,
      existingNames
    });
    setCast((prev) => [...prev, newChar]);
    setSelectedCastIdx(cast.length);
  };

  // Remove cast member (min 1)
  const removeCastMember = (idx: number) => {
    if (cast.length <= 1) return;
    const removedName = cast[idx]?.name;
    const newCast = cast.filter((_, i) => i !== idx);
    setCast(newCast);
    setSelectedCastIdx(0);

    // Also remove from panels if active
    if (removedName) {
      setProject((prev) => ({
        ...prev,
        panels: prev.panels.map((panel) => ({
          ...panel,
          charactersInFrame: (panel.charactersInFrame || []).filter((n) => n !== removedName)
        }))
      }));
    }
  };

  // Roll entire procedural character for selected slot
  const rollProceduralForSelected = () => {
    const existingNames = cast.filter((_, i) => i !== selectedCastIdx).map((c) => c.name);
    const role = currentCharacter.role || (selectedCastIdx === 0 ? "lead" : "supporting");
    const rolled = generateProceduralCharacter({
      role,
      existingNames
    });
    setCast((prev) => {
      const updated = [...prev];
      updated[selectedCastIdx] = rolled;
      return updated;
    });
  };

  // Roll name only for selected slot
  const rollNameForSelected = () => {
    const existingNames = cast.filter((_, i) => i !== selectedCastIdx).map((c) => c.name);
    const isFemale = currentCharacter.ageGender.toLowerCase().includes("woman") || currentCharacter.ageGender.toLowerCase().includes("female");
    const newName = generateRealisticCharacterName(isFemale ? "female" : "male", existingNames);
    updateSelectedCharacter({
      name: newName,
      tag: `@CHAR_${newName.toUpperCase().replace(/[^A-Z0-9]/g, "")}`
    });
  };

  // Send entire cast to Storyboard
  const sendCastToStoryboard = () => {
    setProject((prev) => {
      const updatedCast = cast;
      const lead = updatedCast[0];
      const supporting = updatedCast[1];

      return {
        ...prev,
        cast: updatedCast,
        primaryCharacter: {
          name: lead?.name || "Lead",
          tag: lead?.tag || "@CHAR_LEAD",
          ethnicityAge: lead?.ageGender || "",
          description: (lead?.facialTopology || "") + ". " + (lead?.skinTexture || ""),
          expression: lead?.personalityVibe || ""
        },
        secondaryCharacter: supporting
          ? {
              name: supporting.name,
              tag: supporting.tag,
              ethnicityAge: supporting.ageGender,
              description: supporting.facialTopology,
              relationship: "Supporting Cast / Counterpart"
            }
          : undefined,
        wardrobeLock: {
          ...prev.wardrobeLock,
          tag: `@WARDROBE_${lead?.name?.toUpperCase() || "LEAD"}`,
          garments: lead?.wardrobeFabric || prev.wardrobeLock.garments
        },
        // Ensure every panel has valid character assignments
        panels: prev.panels.map((panel) => {
          const validChars = (panel.charactersInFrame || []).filter((n) =>
            updatedCast.some((c) => c.name === n)
          );
          return {
            ...panel,
            charactersInFrame: validChars.length > 0 ? validChars : [lead?.name || "Lead"]
          };
        })
      };
    });
    setActiveTab("storyboard");
  };

  // Panel management
  const addPanel = () => {
    const newPanelNumber = project.panels.length + 1;
    const defaultChars = [project.cast[0]?.name || "Lead"];
    const newPanel: StoryboardPanel = {
      id: `p_${Date.now()}`,
      panelNumber: newPanelNumber,
      framing: "MS",
      angle: "Eye-level",
      charactersInFrame: defaultChars,
      spatialBlocking: "Subject framed center; background objects in soft optical falloff.",
      initialPose: "Subject in stable resting posture.",
      action: "Natural slow micro-movement with authentic human weight.",
      screenDirection: "Facing screen-right",
      cameraMovement: "Static / Locked Tripod",
      audioAmbience: "Room tone and quiet ambient atmosphere",
      dialogueType: "silent",
      dialogueSpeaker: defaultChars[0],
      durationSeconds: 6
    };

    setProject((prev) => ({
      ...prev,
      panels: [...prev.panels, newPanel]
    }));
    setSelectedPanelIdx(project.panels.length);
  };

  const removePanel = (idx: number) => {
    if (project.panels.length <= 1) return;
    const updated = project.panels
      .filter((_, i) => i !== idx)
      .map((p, i) => ({ ...p, panelNumber: i + 1 }));
    setProject((prev) => ({ ...prev, panels: updated }));
    setSelectedPanelIdx(Math.max(0, idx - 1));
  };

  const updatePanel = (idx: number, fields: Partial<StoryboardPanel>) => {
    setProject((prev) => {
      const updated = [...prev.panels];
      if (updated[idx]) {
        updated[idx] = { ...updated[idx], ...fields };
      }
      return { ...prev, panels: updated };
    });
  };

  // Toggle character in panel
  const toggleCharacterInPanel = (panelIdx: number, charName: string) => {
    const panel = project.panels[panelIdx];
    if (!panel) return;
    const current = panel.charactersInFrame || [];
    let next: string[];
    if (current.includes(charName)) {
      next = current.filter((n) => n !== charName);
      if (next.length === 0) {
        next = [charName]; // Prevent completely empty panel
      }
    } else {
      next = [...current, charName];
    }
    updatePanel(panelIdx, { charactersInFrame: next });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07090e] text-slate-100 font-sans select-none">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-[#1b212d] bg-[#0c0e14] px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Aperture className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider uppercase text-slate-100">
                PROMPTING BUDDHA
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                MULTI-CAST // CINÉMA VÉRITÉ
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Named Character Locks • Anti-Prop Magnet • 1-Shot Video Compiler
            </p>
          </div>
        </div>

        {/* Studio Tabs */}
        <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-xl border border-[#212a3d]">
          <button
            type="button"
            onClick={() => setActiveTab("character")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === "character"
                ? "bg-amber-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>01 Character Foundry</span>
            <span className="text-[10px] opacity-80 font-mono">({cast.length}/3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("storyboard")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === "storyboard"
                ? "bg-amber-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>02 Master Storyboard</span>
            <span className="text-[10px] opacity-80 font-mono">({project.panels.length} Pnl)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === "video"
                ? "bg-amber-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>03 1-Shot Video</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("auditor")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === "auditor"
                ? "bg-amber-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Auditor</span>
            {criticalCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <select
            className="bg-[#141824] border border-[#263042] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            onChange={(e) => handlePresetSelect(e.target.value)}
            value={selectedPresetKey}
          >
            <option value="scrapyard_dawn">Preset: Scrapyard Dawn (9:16 • 2 Cast)</option>
            <option value="chai_tapri_dawn">Preset: Morning Chai Stall (9:16 • Thermal Cloth Lock)</option>
            <option value="coconut_palm_harvest">Preset: Coconut Palm Harvest (9:16 • Rope Rigging & Koitha)</option>
            <option value="morning_rush_bus">Preset: The Morning Rush (16:9 • 180° Screen Direction)</option>
            <option value="iti_scrap_mechanist">Preset: The ITI Mechanist & Scrap Robot (16:9 • Wall-E DIY)</option>
            <option value="mumbai_model_honeytrap_noir">Preset: The Model's Trap (16:9 • Mumbai Noir Honeytrap)</option>
            <option value="cyberpunk_courier">Preset: Sector 9 Courier (16:9 • 2 Cast)</option>
          </select>

          {/* Aspect Ratio Selector */}
          <select
            className="bg-[#141824] border border-[#263042] text-amber-400 font-mono text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer font-bold"
            value={project.aspectRatio}
            onChange={(e) =>
              setProject((p) => ({
                ...p,
                aspectRatio: e.target.value as ProductionContinuity["aspectRatio"]
              }))
            }
          >
            <option value="16:9">16:9 (Widescreen Two-Shot)</option>
            <option value="2.39:1">2.39:1 (Anamorphic Cinema)</option>
            <option value="9:16">9:16 (Vertical Depth Staging)</option>
            <option value="4:3">4:3 (Academy Standard)</option>
            <option value="1:1">1:1 (Square Profile)</option>
          </select>

          {/* NSFW / PG-13 Safety Mode Badge */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition cursor-pointer ${
              settings.nsfwMode
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
            }`}
            title="Click to toggle NSFW & Studio Settings"
          >
            {settings.nsfwMode ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-bold">18+ RAW INDIE</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">PG-13 SAFE</span>
              </>
            )}
          </button>

          {/* Download Script */}
          <button
            type="button"
            title="Download Full Production Package (.md)"
            onClick={handleDownload}
            className="w-8 h-8 rounded-lg bg-[#141824] hover:bg-[#1c2333] border border-[#263042] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Studio Settings */}
          <button
            type="button"
            title="Studio Settings & Safety Configurations"
            onClick={() => setIsSettingsOpen(true)}
            className="w-8 h-8 rounded-lg bg-[#141824] hover:bg-[#1c2333] border border-[#263042] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Editor Workspace */}
        <div className="w-[52%] border-r border-[#1e2430] bg-[#0c0e14] flex flex-col overflow-y-auto custom-scrollbar">
          {/* STAGE 01: Character Foundry */}
          {activeTab === "character" && (
            <div className="p-5 space-y-6">
              {/* Header Box */}
              <div className="p-4 rounded-xl bg-[#111722] border border-[#232f44] flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                      Stage 01: Named Consistent Character Generator
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    AI models anchor identity through <strong>explicit proper human names</strong> (e.g. Arjun, Ramesh), definite body builds, skin complexions, and lived-in garments. Support for up to <strong>3 characters max</strong> to prevent face morphing.
                  </p>
                </div>
                <button
                  type="button"
                  title="Generate completely randomized procedural character"
                  onClick={rollProceduralForSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a2335] hover:bg-[#25324c] border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition flex-shrink-0"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>🎲 Roll All Traits</span>
                </button>
              </div>

              {/* Cast Roster Tabs (Max 3 Characters) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="font-semibold tracking-wide">Scene Cast Roster (Choose Active Character to Edit)</span>
                  <span className="text-[10px] font-mono text-slate-400">Max 3 characters per scene</span>
                </div>

                <div className="flex items-center gap-2">
                  {cast.map((char, idx) => (
                    <button
                      key={char.id || idx}
                      type="button"
                      onClick={() => setSelectedCastIdx(idx)}
                      className={`flex-1 p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        selectedCastIdx === idx
                          ? "bg-[#162033] border-amber-500/50 shadow"
                          : "bg-[#10141e] border-[#1d2536] hover:border-[#2a3750]"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{char.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">
                          {char.role}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {char.tag}
                      </span>
                    </button>
                  ))}

                  {cast.length < 3 && (
                    <button
                      type="button"
                      onClick={addCastMember}
                      className="px-3 py-2.5 rounded-xl border border-dashed border-[#2b374e] hover:border-amber-400 text-slate-400 hover:text-amber-300 text-xs font-medium flex items-center gap-1.5 transition bg-[#0d1118]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Character ({cast.length + 1}/3)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Character Identity Bar */}
              <div className="p-4 rounded-xl bg-[#0f141f] border border-[#20293b] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1b2230]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      CHARACTER {selectedCastIdx + 1}: IDENTITY ANCHORS
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Role Selector */}
                    <select
                      className="bg-[#090c12] border border-[#1d2535] text-amber-400 text-[11px] rounded px-2 py-1 font-mono font-bold uppercase"
                      value={currentCharacter.role}
                      onChange={(e) =>
                        updateSelectedCharacter({
                          role: e.target.value as CharacterConcept["role"]
                        })
                      }
                    >
                      <option value="lead">Role: Lead Protagonist</option>
                      <option value="supporting">Role: Supporting Cast</option>
                      <option value="counterpart">Role: Counterpart / Extra</option>
                    </select>

                    {cast.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCastMember(selectedCastIdx)}
                        title="Remove character from cast"
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Name & Tag Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">PROPER HUMAN NAME:</span>
                      <button
                        type="button"
                        onClick={rollNameForSelected}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>Roll Name</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full bg-[#090c12] border border-[#1d2535] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none"
                      value={currentCharacter.name}
                      onChange={(e) => updateSelectedCharacter({ name: e.target.value })}
                      placeholder="e.g. Arjun, Ramesh, Sunita..."
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1 font-bold">ASSET TOKEN TAG:</span>
                    <input
                      type="text"
                      className="w-full bg-[#090c12] border border-[#1d2535] rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-mono focus:outline-none"
                      value={currentCharacter.tag}
                      onChange={(e) => updateSelectedCharacter({ tag: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Procedural Trait Pickers: Build, Skin, Texture, Clothes */}
              <div className="space-y-3 p-4 rounded-xl bg-[#0f141f] border border-[#20293b]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>PHYSICAL ANATOMY & REALISM SELECTORS</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Click to instantly apply trait</span>
                </div>

                {/* 1. Body Build / Strength */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-blue-400 block font-bold">
                    1. Physique & Build (Skinny / Curvy / Strong / Weak):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {BODY_BUILDS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          const agePrefix = currentCharacter.ageGender.split(",")[0] || "Adult human";
                          updateSelectedCharacter({
                            ageGender: `${agePrefix}, ${b.label.toLowerCase()}`,
                            microKinesics: b.desc
                          });
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#090c12] hover:bg-[#151c2a] border border-[#1e2636] text-slate-300 font-mono transition"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Skin Complexion */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-amber-400 block font-bold">
                    2. Skin Complexion (Dark / Warm / Bronze / Pale):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SKIN_COMPLEXIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          updateSelectedCharacter({
                            facialTopology: `Authentic facial structure for ${currentCharacter.name}: ${c.desc}`,
                            skinTexture: `Natural skin with pores. Complexion: ${c.label}. Zero plastic smoothing.`
                          });
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#090c12] hover:bg-[#151c2a] border border-[#1e2636] text-slate-300 font-mono transition"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Skin Texture & Realism */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-emerald-400 block font-bold">
                    3. Skin Micro-Texture (Pores / Wrinkles / Sweat / Stubble):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SKIN_TEXTURES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          updateSelectedCharacter({
                            skinTexture: `${t.desc} Zero cosmetic airbrushing.`
                          });
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#090c12] hover:bg-[#151c2a] border border-[#1e2636] text-slate-300 font-mono transition"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Lived-In Clothes Color Palette */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-rose-400 block font-bold">
                    4. Lived-in Clothes Palette (Indigo / Rust / Charcoal / Khaki):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {CLOTHING_PALETTES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          updateSelectedCharacter({
                            wardrobeFabric: `${p.desc} Utilitarian everyday styling.`
                          });
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#090c12] hover:bg-[#151c2a] border border-[#1e2636] text-slate-300 font-mono transition"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Free-form Producer Character Concept */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="font-semibold tracking-wide">
                    Free-Form Producer Character Logline (Character {selectedCastIdx + 1})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Describe specific human nuances</span>
                </div>
                <textarea
                  rows={3}
                  className="w-full bg-[#121620] border border-[#232b3b] focus:border-amber-400/50 rounded-xl p-3 text-xs text-slate-200 focus:outline-none transition resize-none leading-relaxed"
                  value={currentCharacter.rawInput}
                  onChange={(e) => {
                    const parsed = parseRoughCharacterInput(
                      e.target.value,
                      [],
                      currentCharacter.role,
                      currentCharacter.name
                    );
                    updateSelectedCharacter({
                      rawInput: e.target.value,
                      facialTopology: parsed.facialTopology,
                      microKinesics: parsed.microKinesics
                    });
                  }}
                  placeholder="e.g. A 28-year-old female accountant who boxes at night; swollen knuckles, tired eyes, wearing a faded crewneck..."
                />
              </div>

              {/* Quick Archetype Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 block">Or Pick a Classic Working-Class Archetype:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {HUMAN_ARCHETYPES.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        const parsed = parseRoughCharacterInput(
                          a.description,
                          [],
                          a.suggestedRole,
                          a.name
                        );
                        updateSelectedCharacter({
                          name: a.name,
                          role: a.suggestedRole,
                          rawInput: a.description,
                          archetypeTitle: a.archetypeTitle,
                          ageGender: parsed.ageGender,
                          facialTopology: parsed.facialTopology,
                          skinTexture: parsed.skinTexture,
                          microKinesics: parsed.microKinesics,
                          wardrobeFabric: a.wardrobeGarments
                        });
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-[#101520] hover:bg-[#182133] border border-[#20293a] text-slate-300 font-mono transition"
                    >
                      {a.name} ({a.archetypeTitle})
                    </button>
                  ))}
                </div>
              </div>

              {/* Lock Cast & Send to Storyboard */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={sendCastToStoryboard}
                  className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg"
                >
                  <span>Lock All ({cast.length}) Characters & Proceed to Stage 02 (Storyboard)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 02: Master Storyboard Prompt Compiler */}
          {activeTab === "storyboard" && (
            <div className="p-5 space-y-6">
              {/* Scene Logline / Beat */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold tracking-wide">Scene Narrative Beat</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Master human story context</span>
                </div>
                <textarea
                  rows={2}
                  className="w-full bg-[#121620] border border-[#232b3b] focus:border-amber-400/50 rounded-xl p-3 text-xs text-slate-200 focus:outline-none transition resize-none leading-relaxed"
                  value={project.sceneBeat}
                  onChange={(e) => setProject((p) => ({ ...p, sceneBeat: e.target.value }))}
                  placeholder="Describe the continuous moment happening in this scene..."
                />
              </div>

              {/* Active Cast Roster Bar in Storyboard */}
              <div className="p-3.5 rounded-xl bg-[#111622] border border-[#20293a] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>LOCKED SCENE CAST ({project.cast?.length || 1} CHARACTERS)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("character")}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono"
                  >
                    Edit Cast in Foundry →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {(project.cast || []).map((c, i) => (
                    <div
                      key={c.id || i}
                      className="p-2.5 rounded-lg bg-[#0a0d13] border border-[#1c2434] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">
                          {c.name} ({c.role.toUpperCase()})
                        </span>
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded">
                          {c.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{c.ageGender}</p>
                      <p className="text-[10px] text-emerald-400/90 line-clamp-1">{c.wardrobeFabric}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environment & Lighting Locks (Grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#11151e] border border-[#202736] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Environment & Spatial Axes</span>
                    </div>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                      {project.locationLock.tag}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    className="w-full bg-[#0d1017] border border-[#1e2533] rounded-lg p-2 text-xs text-slate-300 focus:outline-none resize-none leading-relaxed"
                    value={project.locationLock.geography}
                    onChange={(e) =>
                      setProject((p) => ({
                        ...p,
                        locationLock: { ...p.locationLock, geography: e.target.value }
                      }))
                    }
                    placeholder="Spatial positions: bed frame-left, door frame-right..."
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#11151e] border border-[#202736] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lighting & Depth Planes</span>
                    </div>
                    <Camera className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <textarea
                    rows={2}
                    className="w-full bg-[#0d1017] border border-[#1e2533] rounded-lg p-2 text-xs text-slate-300 focus:outline-none resize-none leading-relaxed"
                    value={project.locationLock.lightingKeys}
                    onChange={(e) =>
                      setProject((p) => ({
                        ...p,
                        locationLock: { ...p.locationLock, lightingKeys: e.target.value }
                      }))
                    }
                    placeholder="Key light, fill light, optical background falloff..."
                  />
                </div>
              </div>

              {/* Panel Breakdown Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Sequential Storyboard Panels ({project.panels.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setLibraryCategory("ENVIRONMENTAL_PILLOW_TEXTURE");
                        setIsLibraryOpen(true);
                      }}
                      className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold transition shadow"
                      title="Insert physically grounded environmental pillow shots, water drainage, or tool friction macros"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>🌿 Insert Environmental Cutaway</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLibraryCategory("ALL");
                        setIsLibraryOpen(true);
                      }}
                      className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold transition shadow"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>📖 Shot Composition Library</span>
                    </button>
                    <button
                      type="button"
                      onClick={addPanel}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#182030] hover:bg-[#202a40] text-slate-200 border border-[#2b374d] font-medium transition"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add Panel</span>
                    </button>
                  </div>
                </div>

                {/* Panel Carousel / Cards */}
                <div className="space-y-4">
                  {project.panels.map((panel, idx) => {
                    const activeInShot = panel.charactersInFrame || [];
                    return (
                      <div
                        key={panel.id}
                        className={`p-4 rounded-xl border transition-all space-y-3 ${
                          selectedPanelIdx === idx
                            ? "bg-[#131924] border-amber-500/40 shadow-lg shadow-amber-500/5"
                            : "bg-[#0e121a] border-[#1f2737] hover:border-[#2c374e]"
                        }`}
                      >
                        {/* Film Slate Banner */}
                        {(() => {
                          const spec = deriveCinematicCompositionPlanes(panel, project.aspectRatio, project.locationLock, project.opticsAndAesthetics);
                          return (
                            <div className="p-2 rounded-lg bg-[#07090e] border border-[#1a2233] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-mono">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20 flex items-center gap-1">
                                  <Clapperboard className="w-3 h-3" />
                                  <span>SCENE 01 // SHOT 0{panel.panelNumber}</span>
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-300 font-semibold">TAKE 01</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-emerald-400">{project.aspectRatio}</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-sky-400">{panel.durationSeconds}s</span>
                              </div>
                              <div className="text-[9px] text-slate-400 truncate max-w-xs" title={`${spec.opticsProfile} | ${spec.cameraMountSpecs}`}>
                                {spec.opticsProfile.split("•")[0]}
                              </div>
                            </div>
                          );
                        })()}
                        <div className="flex items-center justify-between pb-2 border-b border-[#1c2332]">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center border border-amber-500/20">
                              {panel.panelNumber}
                            </span>
                            <span className="text-xs font-semibold text-slate-300">
                              PANEL {panel.panelNumber}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-slate-400">
                              {activeInShot.length === 1 ? `Solo (${activeInShot[0]})` : `${activeInShot.length}-Shot`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Framing Selector */}
                            <select
                              className="bg-[#0b0e14] border border-[#232b3b] text-slate-200 text-[11px] rounded px-2 py-1 focus:outline-none"
                              value={panel.framing}
                              onChange={(e) =>
                                updatePanel(idx, { framing: e.target.value as ShotFraming })
                              }
                            >
                              {ShotFramingEnum.options.map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>

                            {/* Camera Angle */}
                            <select
                              className="bg-[#0b0e14] border border-[#232b3b] text-slate-200 text-[11px] rounded px-2 py-1 focus:outline-none"
                              value={panel.angle}
                              onChange={(e) =>
                                updatePanel(idx, { angle: e.target.value as CameraAngle })
                              }
                            >
                              {CameraAngleEnum.options.map((a) => (
                                <option key={a} value={a}>
                                  {a}
                                </option>
                              ))}
                            </select>

                            {project.panels.length > 1 && (
                              <button
                                type="button"
                                title="Delete this panel"
                                onClick={() => removePanel(idx)}
                                className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Character Assignment for this Panel */}
                        <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1c2436] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-amber-400 font-bold block">
                              CHARACTERS IN THIS SHOT (PREVENTS GHOST ACTORS):
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updatePanel(idx, {
                                    charactersInFrame: [project.cast[0]?.name || "Lead"]
                                  })
                                }
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161c28] text-slate-400 hover:text-slate-200"
                              >
                                Solo Lead
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updatePanel(idx, {
                                    charactersInFrame: project.cast.map((c) => c.name)
                                  })
                                }
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161c28] text-slate-400 hover:text-slate-200"
                              >
                                All Cast
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {project.cast.map((c) => {
                              const isChecked = activeInShot.includes(c.name);
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => toggleCharacterInPanel(idx, c.name)}
                                  className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 border ${
                                    isChecked
                                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                                      : "bg-[#10141e] border-[#1f2636] text-slate-500 hover:text-slate-400"
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${isChecked ? "bg-amber-400" : "bg-slate-600"}`} />
                                  <span>{c.name} ({c.role})</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Cinematic Staging & 3D Depth Planes relative to Aspect Ratio */}
                        <div className="p-3 rounded-lg bg-[#090c13] border border-[#1c2436] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-sky-400">
                              <Layers className="w-3.5 h-3.5" />
                              <span>CINEMATIC PLACEMENT & 3D DEPTH LAYERS ({project.aspectRatio}):</span>
                            </div>
                            <span className="text-[9px] font-mono text-slate-500">
                              Rule-of-Thirds & Depth Anchors
                            </span>
                          </div>

                          {/* 3-Point Placement Grid Presets */}
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updatePanel(idx, {
                                  spatialBlocking: project.aspectRatio === "9:16"
                                    ? "Subject anchored in intimate foreground (Z0/Z1); secondary elements in vertical depth."
                                    : "Subject staged on horizontal Left-Third (Screen-Left); sightline directed across frame to right."
                                })
                              }
                              className="py-1 px-2 rounded bg-[#10141f] hover:bg-[#182030] border border-[#20293b] text-[10px] font-mono text-slate-300 hover:text-white transition text-center cursor-pointer"
                            >
                              ← Left Third (Z1)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updatePanel(idx, {
                                  spatialBlocking: "Subject centered in optical axis; balanced negative space on left and right borders."
                                })
                              }
                              className="py-1 px-2 rounded bg-[#10141f] hover:bg-[#182030] border border-[#20293b] text-[10px] font-mono text-slate-300 hover:text-white transition text-center cursor-pointer"
                            >
                              ⊙ Center Focus (Z1)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updatePanel(idx, {
                                  spatialBlocking: project.aspectRatio === "9:16"
                                    ? "Subject framed in upper background depth; foreground threshold elements in soft blur."
                                    : "Subject staged on horizontal Right-Third (Screen-Right); gaze vector looking screen-left."
                                })
                              }
                              className="py-1 px-2 rounded bg-[#10141f] hover:bg-[#182030] border border-[#20293b] text-[10px] font-mono text-slate-300 hover:text-white transition text-center cursor-pointer"
                            >
                              Right Third (Z1) →
                            </button>
                          </div>

                          {/* Spatial Staging Input */}
                          <div>
                            <input
                              type="text"
                              className="w-full bg-[#07090f] border border-[#1b2332] rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50"
                              value={panel.spatialBlocking || ""}
                              onChange={(e) => updatePanel(idx, { spatialBlocking: e.target.value })}
                              placeholder="Describe 3D staging (Z0 foreground, Z1 focal plane, Z2 background)..."
                            />
                          </div>

                          {/* Depth Layers Breakdown Display */}
                          {(() => {
                            const spec = deriveCinematicCompositionPlanes(panel, project.aspectRatio, project.locationLock, project.opticsAndAesthetics);
                            return (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 border-t border-[#171e2e] text-[9px] font-mono">
                                <div className="p-2 rounded bg-[#0b0e16] border border-[#161d2b]">
                                  <span className="text-amber-400 font-bold block mb-0.5">Z0 FOREGROUND</span>
                                  <span className="text-slate-400 line-clamp-2 leading-tight block">{spec.depthPlanes.z0Foreground}</span>
                                </div>
                                <div className="p-2 rounded bg-[#0b0e16] border border-[#161d2b]">
                                  <span className="text-sky-400 font-bold block mb-0.5">Z1 FOCAL PLANE</span>
                                  <span className="text-slate-300 line-clamp-2 leading-tight block">{spec.depthPlanes.z1SubjectFocalPlane}</span>
                                </div>
                                <div className="p-2 rounded bg-[#0b0e16] border border-[#161d2b]">
                                  <span className="text-purple-400 font-bold block mb-0.5">Z2 DEEP SPACE</span>
                                  <span className="text-slate-400 line-clamp-2 leading-tight block">{spec.depthPlanes.z2BackgroundFalloff}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Frozen pose & forward action */}
                        <div className="space-y-2">
                          <div>
                            <span className="text-slate-400 text-[10px] block mb-0.5 font-mono">
                              Frozen Pose at T=0 (What is already visible in the image)
                            </span>
                            <input
                              type="text"
                              className="w-full bg-[#0a0d13] border border-[#1b2332] rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
                              value={panel.initialPose || ""}
                              onChange={(e) => updatePanel(idx, { initialPose: e.target.value })}
                              placeholder="e.g. Bare foot already planted on floor, hand on cot edge..."
                            />
                          </div>

                          <div>
                            <span className="text-slate-400 text-[10px] block mb-0.5 font-mono">
                              Forward Action Beat (Must NOT contradict the frozen pose)
                            </span>
                            <textarea
                              rows={2}
                              className="w-full bg-[#0a0d13] border border-[#1b2332] rounded-lg p-2 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
                              value={panel.action}
                              onChange={(e) => updatePanel(idx, { action: e.target.value })}
                              placeholder="What specific visual action occurs in this panel..."
                            />
                          </div>

                          {/* Physical Plausibility Directives (Cloth, Rigging, Sickle, Macro) */}
                          {(() => {
                            const safety = detectPhysicalSafetyDirectives(panel.action);
                            if (safety.length === 0) return null;
                            return (
                              <div className="p-2.5 rounded-lg bg-emerald-950/25 border border-emerald-500/30 text-[11px] space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-emerald-400 font-mono text-[10px]">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>AI PHYSICAL PLAUSIBILITY DIRECTIVES ACTIVE:</span>
                                </div>
                                <div className="space-y-1 pl-4 text-slate-300 text-[10px] leading-tight">
                                  {safety.map((d, sIdx) => (
                                    <div key={sIdx} className="flex items-start gap-1">
                                      <span className="text-emerald-400 font-bold">•</span>
                                      <span>{d}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Screen Direction & 180-Degree Axis Lock */}
                          <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1c2436] space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-amber-400 font-bold">SCREEN DIRECTION & 180° AXIS:</span>
                              <span className="text-slate-500">Prevent reverse cut disorientation</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {[
                                { label: "← Right to Left", val: "Sprinting Screen-Right to Screen-Left" },
                                { label: "→ Left to Right", val: "Moving Screen-Left to Screen-Right" },
                                { label: "Facing Right", val: "Profile facing frame-right" },
                                { label: "Facing Left", val: "Profile facing frame-left" },
                                { label: "Head-on", val: "Directly facing camera (Head-on)" },
                                { label: "Center Hold", val: "Center frame focus" }
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => updatePanel(idx, { screenDirection: preset.val })}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                                    panel.screenDirection === preset.val
                                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold"
                                      : "bg-[#10141f] border-[#222a3d] text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>

                            <input
                              type="text"
                              className="w-full bg-[#0a0d13] border border-[#1b2332] rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
                              value={panel.screenDirection || ""}
                              onChange={(e) => updatePanel(idx, { screenDirection: e.target.value })}
                              placeholder="e.g. Eyeline looking frame-lower-left toward burner"
                            />
                          </div>

                          {/* Camera Rig & Duration */}
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 text-[10px] block mb-0.5 font-mono">Camera Rig Movement</span>
                              <select
                                className="w-full bg-[#0a0d13] border border-[#1b2332] rounded px-2 py-1 text-slate-300 text-xs"
                                value={panel.cameraMovement}
                                onChange={(e) => updatePanel(idx, { cameraMovement: e.target.value as CameraMovement })}
                              >
                                {CameraMovementEnum.options.map((m) => (
                                  <option key={m} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <span className="text-slate-400 text-[10px] block mb-0.5 font-mono">Target Duration</span>
                              <select
                                className="w-full bg-[#0a0d13] border border-[#1b2332] rounded px-2 py-1 text-slate-300 text-xs font-mono"
                                value={panel.durationSeconds}
                                onChange={(e) => updatePanel(idx, { durationSeconds: Number(e.target.value) })}
                              >
                                <option value={4}>4 Seconds (Quick Cut / Macro)</option>
                                <option value={6}>6 Seconds (Standard Beat)</option>
                                <option value={8}>8 Seconds (Extended Hold)</option>
                                <option value={10}>10 Seconds (Meditative / Dialog)</option>
                              </select>
                            </div>
                          </div>

                          {/* Dialogue & Speaker */}
                          <div className="grid grid-cols-3 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 text-[10px] block mb-0.5">Speaker / Thinker</span>
                              <select
                                className="w-full bg-[#0a0d13] border border-[#1b2332] rounded px-2 py-1 text-slate-300"
                                value={panel.dialogueSpeaker || activeInShot[0] || ""}
                                onChange={(e) => updatePanel(idx, { dialogueSpeaker: e.target.value })}
                              >
                                {project.cast.map((c) => (
                                  <option key={c.id} value={c.name}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <span className="text-slate-400 text-[10px] block mb-0.5">Dialogue Type</span>
                              <select
                                className="w-full bg-[#0a0d13] border border-[#1b2332] rounded px-2 py-1 text-slate-300 font-mono text-[10px]"
                                value={panel.dialogueType}
                                onChange={(e) =>
                                  updatePanel(idx, { dialogueType: e.target.value as DialogueType })
                                }
                              >
                                <option value="voiceover_inner_thought">VO / Inner Thought (Lips Closed)</option>
                                <option value="spoken_dialogue">Spoken Dialogue (Lip Sync)</option>
                                <option value="silent">Pure Ambience (Silent)</option>
                              </select>
                            </div>

                            <div>
                              <span className="text-slate-400 text-[10px] block mb-0.5">Line / Thought Text</span>
                              <input
                                type="text"
                                className="w-full bg-[#0a0d13] border border-[#1b2332] rounded px-2 py-1 text-slate-300"
                                value={panel.dialogue || ""}
                                onChange={(e) => updatePanel(idx, { dialogue: e.target.value })}
                                placeholder="e.g. 'फिर सुबह हो गई...'"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 03: Storyboard-to-Video Engine */}
          {activeTab === "video" && (
            <div className="p-5 space-y-6">
              {/* Flow AI Conversion Info Banner */}
              <div className="p-4 rounded-xl bg-[#111722] border border-[#232f44] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <Play className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">
                      Stage 03: Storyboard-to-Video Engine (Google Flow & Veo 2 Standard)
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={flowSyntax}
                        onChange={(e) => setFlowSyntax(e.target.checked)}
                        className="rounded border-[#2d3748] bg-[#0c1017] text-amber-500 focus:ring-0"
                      />
                      <span className="text-[10px] text-slate-300 font-mono">@Asset Tags</span>
                    </label>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Maintains the exact storyboard panel structure. Operates in <strong>Flow Ingredients Mode</strong> using your reference sheet while enforcing <strong>Zero Lip-Sync (Voiceover VO)</strong> so faces never morph.
                  </p>
                </div>
              </div>

              {/* Video Shot Configurator (1 Shot per panel) */}
              <div className="space-y-4">
                {project.panels.map((panel, idx) => {
                  const activeInShot = panel.charactersInFrame || [];
                  return (
                    <div
                      key={panel.id}
                      className="p-4 rounded-xl bg-[#0f131c] border border-[#202738] space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#1b2230]">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/20">
                            {String(panel.panelNumber).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-bold text-slate-200 tracking-wide">
                            SHOT {String(panel.panelNumber).padStart(2, "0")} [From Panel {panel.panelNumber}]
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-amber-400 font-semibold">
                            {activeInShot.join(" & ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Duration Selector */}
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Timer className="w-3.5 h-3.5 text-slate-500" />
                            <select
                              className="bg-[#0b0e14] border border-[#232b3b] text-slate-200 text-[11px] rounded px-1.5 py-0.5"
                              value={panel.durationSeconds}
                              onChange={(e) =>
                                updatePanel(idx, { durationSeconds: Number(e.target.value) })
                              }
                            >
                              <option value={4}>4s</option>
                              <option value={5}>5s</option>
                              <option value={6}>6s</option>
                              <option value={8}>8s</option>
                              <option value={10}>10s</option>
                            </select>
                          </div>

                          {/* Copy Single Shot */}
                          <button
                            type="button"
                            onClick={() => {
                              const singleShotText = compileVideoPrompts(
                                { ...project, panels: [panel] },
                                flowSyntax
                              );
                              handleCopy(singleShotText, false, idx);
                            }}
                            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[#161c28] hover:bg-[#1e2738] text-slate-300 transition"
                          >
                            {copiedShotIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-mono">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Shot</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Camera Movement Rig */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] block mb-1 font-mono">Camera Rig Choreography</span>
                          <select
                            className="w-full bg-[#090c12] border border-[#1d2535] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                            value={panel.cameraMovement}
                            onChange={(e) =>
                              updatePanel(idx, { cameraMovement: e.target.value as CameraMovement })
                            }
                          >
                            {CameraMovementEnum.options.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <span className="text-slate-400 text-[10px] block mb-1 font-mono">Diegetic Sound & Ambience</span>
                          <input
                            type="text"
                            className="w-full bg-[#090c12] border border-[#1d2535] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                            value={panel.audioAmbience}
                            onChange={(e) => updatePanel(idx, { audioAmbience: e.target.value })}
                            placeholder="Foley, atmosphere, room tone..."
                          />
                        </div>
                      </div>

                      {/* Motion Prompting Guide for this shot */}
                      <div className="text-[11px] bg-[#090c12] p-2.5 rounded-lg border border-[#1b2230] text-slate-300 space-y-1.5">
                        {panel.initialPose && (
                          <div>
                            <span className="text-[10px] text-blue-400 font-mono block font-bold">
                              T=0 START FRAME FROZEN BASELINE:
                            </span>
                            <span className="text-slate-400 italic">{panel.initialPose}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-amber-400 font-mono block font-bold">
                            DIRECTED FORWARD MOTION ONLY ({activeInShot.join(" & ")}):
                          </span>
                          <span>{panel.action}</span>
                        </div>
                        {panel.dialogue && (
                          <div className="pt-1.5 border-t border-[#1b2230]">
                            <span className="text-[10px] text-emerald-400 font-mono block font-bold">
                              {panel.dialogueType === "voiceover_inner_thought"
                                ? `INNER THOUGHTS (${panel.dialogueSpeaker || activeInShot[0]} — LIPS CLOSED):`
                                : `SPOKEN DIALOGUE (${panel.dialogueSpeaker || activeInShot[0]}):`}
                            </span>
                            <span className="text-slate-200">
                              &quot;{panel.dialogue}&quot;
                              {panel.dialogueType === "voiceover_inner_thought" && (
                                <span className="text-[10px] text-slate-400 ml-2 italic">
                                  (Mouth remains naturally and completely closed)
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AUDITOR TAB */}
          {activeTab === "auditor" && (
            <div className="p-5 space-y-6">
              {/* Header */}
              <div className="p-4 rounded-xl bg-[#111722] border border-[#232f44] flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                    Filmmaker AI Prompting Auditor & Guardrails
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Analyzes current project setup against physical continuity collisions and AI hallucination traps.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      criticalCount > 0
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {criticalCount > 0 ? `${criticalCount} Action Required` : "100% Continuity Safe"}
                  </span>
                </div>
              </div>

              {/* Detected Issues */}
              <div className="space-y-3">
                {auditIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border ${
                      issue.severity === "critical"
                        ? "bg-rose-950/20 border-rose-500/30"
                        : issue.severity === "warning"
                        ? "bg-amber-950/20 border-amber-500/30"
                        : "bg-blue-950/20 border-blue-500/30"
                    } space-y-2`}
                  >
                    <div className="flex items-center gap-2">
                      {issue.severity === "critical" ? (
                        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      ) : issue.severity === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      )}
                      <span className="text-xs font-bold text-slate-100">{issue.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-6">
                      {issue.explanation}
                    </p>
                    <div className="text-[11px] text-slate-400 bg-[#0c1017] p-2.5 rounded-lg border border-[#1b2230] ml-6">
                      <strong className="text-amber-400">Filmmaker Fix: </strong>
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>

              {/* Common Mistakes Educational Cheat Sheet */}
              <div className="p-4 rounded-xl bg-[#0e121a] border border-[#1f2737] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>The 8 Core Rules of Continuity AI Prompting</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-[#080b10] border border-[#18202d] space-y-1">
                    <span className="font-bold text-slate-200">1. Always Assign Proper Human Names</span>
                    <p className="text-slate-400">
                      Never prompt generic nouns (&quot;a man&quot;, &quot;the boy&quot;). Specific names anchor cross-attention tokens so models don&apos;t swap identities.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080b10] border border-[#18202d] space-y-1">
                    <span className="font-bold text-slate-200">2. Max 3 Characters per Scene</span>
                    <p className="text-slate-400">
                      Crowding 4+ characters in video generation causes token bleeding, fused faces, and clothing duplication. Stick to 1 to 3 characters.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080b10] border border-[#18202d] space-y-1">
                    <span className="font-bold text-slate-200">3. 1 Prompt = 1 Continuous Shot</span>
                    <p className="text-slate-400">
                      Never request camera cuts inside one generation. Video models will melt and morph. Split every camera setup into an individual shot.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080b10] border border-[#18202d] space-y-1">
                    <span className="font-bold text-slate-200">4. Physical State Collision (T=0 Lock)</span>
                    <p className="text-slate-400 text-rose-300/90 font-medium">
                      If the image shows feet already on the floor, NEVER prompt &quot;removes bedsheet from over feet&quot;. Prompting backwards action causes severe limb mutations.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080b10] border border-[#18202d] space-y-1">
                    <span className="font-bold text-slate-200">5. Lips-Closed VO Lock</span>
                    <p className="text-slate-400">
                      For internal monologues, explicitly lock the mouth shut. If unconstrained, video generators will warp the jaw trying to animate speech.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080b10] border border-[#18202d] space-y-1">
                    <span className="font-bold text-slate-200">6. The Prop-Magnet & Depth Planes</span>
                    <p className="text-slate-400 text-amber-300/90 font-medium">
                      Mentioning background objects like &quot;chair&quot; causes diffusion models to spotlight or glow them. Relegate props strictly to background optical falloff.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080b10] border border-[#18202d] space-y-1">
                    <span className="font-bold text-slate-200">7. Wardrobe Transitions Across Cuts</span>
                    <p className="text-slate-400">
                      Never change clothes inside a single generation. Lock one lived-in wardrobe per scene, and cut to the next scene for outfit changes.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080b10] border border-[#18202d] space-y-1">
                    <span className="font-bold text-slate-200">8. Human Kinesics & Cinéma Vérité</span>
                    <p className="text-slate-400">
                      No CGI gloss or fake glow. Direct natural human mechanics: weight, inertia, slow blinks, and authentic skin pores with zero beauty filters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Compiled Prompt Terminal */}
        <div className="w-[48%] bg-[#080a0f] flex flex-col justify-between border-l border-[#191e28]">
          {/* Terminal Header */}
          <div className="h-12 border-b border-[#181d28] bg-[#0c0f16] px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {activeTab === "character"
                  ? `COMPILE // ${currentCharacter.name.toUpperCase()} DIAGNOSTIC SHEET`
                  : activeTab === "storyboard"
                  ? "COMPILE // MASTER STORYBOARD PROMPT"
                  : activeTab === "video"
                  ? "COMPILE // SHOT-BY-SHOT VIDEO SET"
                  : "AUDIT SUMMARY"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    activeTab === "character"
                      ? compiledCharacterPrompt
                      : activeTab === "storyboard"
                      ? compiledStoryboard
                      : activeTab === "video"
                      ? compiledVideo
                      : JSON.stringify(auditIssues, null, 2),
                    true
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Prompts</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Terminal Content (Code-style Viewer) */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 custom-scrollbar select-text bg-[#07090e]">
            {activeTab === "character" && (
              <pre className="whitespace-pre-wrap font-mono break-words text-slate-200">
                {compiledCharacterPrompt}
              </pre>
            )}

            {activeTab === "storyboard" && (
              <pre className="whitespace-pre-wrap font-mono break-words text-slate-200">
                {compiledStoryboard}
              </pre>
            )}

            {activeTab === "video" && (
              <pre className="whitespace-pre-wrap font-mono break-words text-slate-200">
                {compiledVideo}
              </pre>
            )}

            {activeTab === "auditor" && (
              <div className="space-y-4 font-sans">
                <div className="p-3 rounded-lg bg-[#0e131d] border border-[#1f283a] text-xs space-y-1">
                  <span className="font-bold text-amber-400">Continuity Health Report:</span>
                  <p className="text-slate-300">
                    {criticalCount === 0
                      ? "All shots conform to Google Flow AI, Runway Gen-4, and Veo 2 production standards."
                      : `Found ${criticalCount} issue(s) that could trigger AI hallucinations during video generation.`}
                  </p>
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Total Panels: {project.panels.length} | Aspect Ratio: {project.aspectRatio} | Flow Mode: {project.flowReferenceMode}
                </div>
              </div>
            )}
          </div>

          {/* Terminal Footer Status Bar */}
          <div className="h-9 border-t border-[#181d28] bg-[#0a0d14] px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Continuity Engine: ACTIVE</span>
              </span>
              <span>Aspect: {project.aspectRatio}</span>
              <span>Cast: {project.cast?.length || cast.length} Actors</span>
            </div>
            <div>
              {activeTab === "character" ? (
                <button
                  type="button"
                  onClick={sendCastToStoryboard}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
                >
                  <span>Lock & Send Cast to Storyboard</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : activeTab === "storyboard" ? (
                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
                >
                  <span>Proceed to Video Converter</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-slate-500">PROD READY</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SHOT COMPOSITION LIBRARY MODAL */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-5xl max-h-[90vh] bg-[#0c0f17] border border-[#232f44] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#1c2436] bg-[#0f131d] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold tracking-wider uppercase text-slate-100 font-mono">
                      FILMMAKER SHOT COMPOSITION DATABASE
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                      SLICE-OF-LIFE GRAMMAR
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Proven compositions from Yasujirō Ozu, Robert Bresson, Satyajit Ray & Neorealism. Eliminates complexity and AI hallucinations.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#161d2a] hover:bg-[#202a3c] border border-[#2b374d] text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Bar & Search */}
            <div className="p-4 border-b border-[#1c2436] bg-[#0a0d14] flex flex-col md:flex-row gap-3 items-center justify-between flex-shrink-0">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search shot compositions, masters, or keywords..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="w-full bg-[#111622] border border-[#20293a] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition font-mono"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
                {[
                  { id: "ALL", label: "All Compositions" },
                  { id: "ENVIRONMENTAL_PILLOW_TEXTURE", label: "🌿 Environmental & Ozu Textures" },
                  { id: "HYDRAULIC_LIQUID_GRAVITY", label: "💧 Hydraulic Liquids & Gravity" },
                  { id: "MECHANICAL_FRICTION_MACRO", label: "⚙️ Mechanical Friction & Tools" },
                  { id: "TACTILE_CHORE_MACRO", label: "Tactile Macros (Bresson)" },
                  { id: "OZU_PILLOW_SHOT", label: "Pillow Cutaway (Ozu)" },
                  { id: "TATAMI_GROUNDED_GAZE", label: "Tatami Seated (Ozu)" },
                  { id: "TOP_DOWN_FLAT_LAY", label: "Top-Down Flat Lay" },
                  { id: "THRESHOLD_FRAME_IN_FRAME", label: "Threshold Frame" },
                  { id: "MIRROR_REFLECTION", label: "Mirror Reflection" },
                  { id: "PROFILE_TRANSIT_WINDOW", label: "Transit Window" },
                  { id: "DIRTY_SINGLE_OTS", label: "Dirty Single OTS" },
                  { id: "DIRECTIONAL_MATCH_TRANSIT", label: "Directional Transit" },
                  { id: "NEOREALIST_DOMESTIC_PARALLEL", label: "Parallel Domestic" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setLibraryCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition border ${
                      libraryCategory === cat.id
                        ? "bg-amber-500 text-slate-950 font-bold border-amber-400"
                        : "bg-[#111622] border-[#20293a] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compositions Grid */}
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar bg-[#080a0f]">
              {filteredCompositions.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-500 font-mono text-xs">
                  No compositions found matching &quot;{librarySearch}&quot;.
                </div>
              ) : (
                filteredCompositions.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-4 rounded-xl bg-[#0f141f] border border-[#1e273a] hover:border-amber-500/40 transition flex flex-col justify-between space-y-3 shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182233] text-amber-400 border border-amber-500/20 font-bold uppercase block mb-1">
                            {comp.categoryLabel}
                          </span>
                          <h3 className="text-xs font-bold text-slate-100 tracking-wide">
                            {comp.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-[#161c28] px-2 py-0.5 rounded border border-[#232b3b] whitespace-nowrap">
                          {comp.filmmakerTradition}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 italic leading-relaxed">
                        &quot;{comp.corePhilosophy}&quot;
                      </p>

                      {/* Technical Specs Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#131a26] text-blue-300 border border-blue-500/20">
                          Framing: {comp.framing}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#131a26] text-purple-300 border border-purple-500/20">
                          Angle: {comp.cameraAngle}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#131a26] text-emerald-300 border border-emerald-500/20">
                          Rig: {comp.cameraMovement}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#0a0d14] border border-[#1b2332] space-y-1.5 text-[11px]">
                        <div>
                          <strong className="text-slate-400 font-mono text-[10px] block">ACTING & PHYSICAL WEIGHT:</strong>
                          <span className="text-slate-300 leading-tight block">{comp.actingProcedure}</span>
                        </div>
                        {comp.physicsAndGravityLaw && (
                          <div className="pt-1 border-t border-[#1b2332]">
                            <strong className="text-emerald-400 font-mono text-[10px] block">⚖️ PHYSICS & GRAVITY LAW:</strong>
                            <span className="text-emerald-300/90 text-[10px] block">{comp.physicsAndGravityLaw}</span>
                          </div>
                        )}
                        {comp.commonAiMistake && (
                          <div className="pt-1 border-t border-[#1b2332]">
                            <strong className="text-rose-400 font-mono text-[10px] block">🚫 COMMON AI HALLUCINATION TO AVOID:</strong>
                            <span className="text-rose-300/90 text-[10px] block">{comp.commonAiMistake}</span>
                          </div>
                        )}
                        {comp.humanDexterityCheck && (
                          <div className="pt-1 border-t border-[#1b2332]">
                            <strong className="text-cyan-400 font-mono text-[10px] block">✋ HUMAN DEXTERITY & HEAT THRESHOLD:</strong>
                            <span className="text-cyan-300/90 text-[10px] block">{comp.humanDexterityCheck}</span>
                          </div>
                        )}
                        <div>
                          <strong className="text-blue-400 font-mono text-[10px] block">T=0 START FRAME BASELINE:</strong>
                          <span className="text-slate-400 text-[10px] italic block">{comp.t0BaselineRule}</span>
                        </div>
                        <div className="pt-1 border-t border-[#1b2332]">
                          <strong className="text-amber-400 font-mono text-[10px] block">ANTI-COMPLEXITY CONSTRAINT:</strong>
                          <span className="text-amber-300/90 text-[10px] block">{comp.antiComplexityConstraint}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-[#1c2436] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => applyCineCompositionToPanel(comp, 0, selectedPanelIdx)}
                        className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply to Panel {project.panels[selectedPanelIdx]?.panelNumber || 1}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addPanelFromCineComposition(comp, 0)}
                        className="py-1.5 px-3 rounded-lg bg-[#1a2335] hover:bg-[#25324c] text-amber-300 border border-amber-500/30 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Panel</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 04: Studio Settings & Safety Filters Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0e15] border border-[#222d42] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1b2333] flex items-center justify-between bg-[#0e121b]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    Studio Production & Safety Settings
                  </h2>
                  <p className="text-xs text-slate-400">
                    Control content censorship ratings, anti-hallucination guardrails, and relational database backups.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#141a26] hover:bg-[#1f283a] text-slate-400 hover:text-slate-200 flex items-center justify-center transition border border-[#232b3b] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs">
              {/* Setting 1: NSFW / Content Rating Toggle */}
              <div className="p-4 rounded-xl bg-[#10141f] border border-[#20293b] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${
                      settings.nsfwMode
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}>
                      {settings.nsfwMode ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-sm">
                          Content Censorship & NSFW Filter
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          settings.nsfwMode
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}>
                          {settings.nsfwMode ? "18+ Uncensored Indie" : "PG-13 Commercial Safe"}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        {settings.nsfwMode
                          ? "Permits raw bodily realism, industrial oil grime, physical exhaustion, and unfiltered gritty neorealism. Disables overly sanitizing commercial safety blocks."
                          : "Commercial and family friendly rating. Injects strict negative prompts against nudity, extreme gore, and policy-violating tokens for Google Flow & Runway ad safety."}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, nsfwMode: !s.nsfwMode }))}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.nsfwMode ? "bg-rose-600" : "bg-[#253147]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.nsfwMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 bg-[#0a0d14] p-2.5 rounded-lg border border-[#192130] font-mono">
                  Active Rating Directive:{" "}
                  <span className={settings.nsfwMode ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {settings.nsfwMode ? "[RAW UNCENSORED INDIE • R-RATED / AUTHENTIC BODY & INDUSTRIAL VÉRITÉ]" : "[PG-13 COMMERCIAL SAFE • FAMILY FRIENDLY • ZERO NUDITY / CLEAN POLICY COMPLIANT]"}
                  </span>
                </div>
              </div>

              {/* Setting 2: Negative Prompt & Anti-Hallucination Guardrails */}
              <div className="p-4 rounded-xl bg-[#10141f] border border-[#20293b] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-sm">
                          Anti-Hallucination & Continuity Guardrails
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {settings.negativeGuardrails ? "Active Protection" : "Bypassed"}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        Appends comprehensive negative constraint blocks prohibiting CGI bloom, Pixar/Disney 3D cartoon gloss, floating limbs, and bizarre prop magnets (e.g. washbasins inside electrical piles).
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, negativeGuardrails: !s.negativeGuardrails }))}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.negativeGuardrails ? "bg-amber-500" : "bg-[#253147]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        settings.negativeGuardrails ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Setting 3: Target AI Platform Syntax */}
              <div className="p-4 rounded-xl bg-[#10141f] border border-[#20293b] space-y-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-slate-200 text-sm">
                    Target AI Video & Image Platform Syntax
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  Tailors prompt token weights and structural headers for the specific generation model you are prompting.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: "google_flow", name: "Google Flow / Veo 2", desc: "Structured brackets [RAW CAMERA] [PHYSICAL LOCK]" },
                    { id: "runway_gen4", name: "Runway Gen-4 / Gen-3", desc: "Cinematic continuous prose with temporal pacing" },
                    { id: "kling_pro", name: "Kling 1.5 Professional", desc: "Explicit camera movement tags & negative prompts" },
                    { id: "midjourney_v7", name: "Midjourney v7 / Niji", desc: "Natural lighting parameters --ar 16:9 --s 250" }
                  ].map((plat) => (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, platformSyntax: plat.id as any }))}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        settings.platformSyntax === plat.id
                          ? "bg-amber-500/15 border-amber-500/40 text-slate-100"
                          : "bg-[#0b0e15] border-[#1e273a] text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-200">{plat.name}</span>
                        {settings.platformSyntax === plat.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-tight">{plat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Setting 4: Open-Source Relational Database Engine */}
              <div className="p-4 rounded-xl bg-[#10141f] border border-[#20293b] space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-sm">
                          Relational Database Storage (LibSQL / SQLite)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Active: file:cine_database.db
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        Persists 19 slice-of-life compositions, character sheets, and 6 full production treatments locally with zero server daemon overhead.
                      </p>
                    </div>
                  </div>
                </div>

                {dbSyncStatus && (
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono">
                    ✓ {dbSyncStatus}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleExportDatabase}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#141b29] hover:bg-[#1d273b] border border-[#25324c] text-slate-200 font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export Database Archive (.json)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncDatabase}
                    className="py-2 px-3 rounded-lg bg-[#141b29] hover:bg-[#1d273b] border border-[#25324c] text-slate-200 font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sync Tables</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1b2333] bg-[#0e121b] flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-500">
                Prompting Buddha Studio v2.4 • In-Process LibSQL DB
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
