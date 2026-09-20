import { z } from "zod";

export const ShotFramingEnum = z.enum([
  "ECU", // Extreme Close Up
  "CU",  // Close Up
  "MCU", // Medium Close Up
  "MS",  // Medium Shot
  "WS",  // Wide Shot
  "OTS", // Over the Shoulder
  "POV", // Point of View
]);
export type ShotFraming = z.infer<typeof ShotFramingEnum>;

export const CameraAngleEnum = z.enum([
  "Eye-level",
  "Low angle",
  "High angle",
  "Dutch tilt",
  "Overhead",
]);
export type CameraAngle = z.infer<typeof CameraAngleEnum>;

export const CameraMovementEnum = z.enum([
  "Static / Locked Tripod",
  "Subtle Handheld Breathing",
  "Slow Push-In (Dolly)",
  "Slow Pull-Out",
  "Tracking Pan",
  "Whip Pan",
  "Pedestal Up/Down",
  "Slow Tilt-Up",
  "Slow Tilt-Down",
]);
export type CameraMovement = z.infer<typeof CameraMovementEnum>;

export const DialogueTypeEnum = z.enum([
  "voiceover_inner_thought", // Lips firmly closed, inner monologue
  "spoken_dialogue",         // Diegetic dialogue with lip movement
  "silent",                  // Pure ambient sound
]);
export type DialogueType = z.infer<typeof DialogueTypeEnum>;

export interface CharacterConcept {
  id: string;
  name: string; // Proper human name (e.g. "Arjun", "Ramesh", "Sunita") - Critical for AI identity anchor
  role: "lead" | "supporting" | "counterpart";
  rawInput: string;
  tag: string; // e.g. @CHAR_ARJUN
  archetypeTitle: string;
  ageGender: string;
  facialTopology: string;
  skinTexture: string;
  microKinesics: string; // Everyday habits, physical tics, weight, posture
  wardrobeFabric: string; // Lived-in, non-runway, realistic fabrics
  personalityVibe: string;
}

export interface StoryboardPanel {
  id: string;
  panelNumber: number;
  framing: ShotFraming;
  angle: CameraAngle;
  action: string;
  charactersInFrame: string[]; // Names or tags of characters active in this shot (e.g. ["Arjun", "Ramesh"])
  spatialBlocking?: string; // Staging and positioning relative to aspect ratio (e.g. "Arjun screen-left, Ramesh screen-right")
  initialPose?: string; // Frozen physical state in reference image (T=0)
  screenDirection: string;
  cameraMovement: CameraMovement;
  audioAmbience: string;
  dialogue?: string;
  dialogueSpeaker?: string; // Which character is thinking/speaking
  dialogueType: DialogueType;
  durationSeconds: number;
}

export interface ProductionContinuity {
  projectTitle: string;
  aspectRatio: "16:9" | "2.39:1" | "9:16" | "4:3" | "1:1";
  flowReferenceMode: "ingredients" | "frames";
  rawRealismMode: boolean; // Enforce pure Cinéma Vérité, zero CGI glow, anti-prop magnet
  sceneBeat: string;
  // Multi-character cast (1 to 3 characters max)
  cast: CharacterConcept[];
  // Legacy / convenience accessors
  primaryCharacter: {
    name?: string;
    tag: string;
    description: string;
    ethnicityAge: string;
    expression: string;
  };
  secondaryCharacter?: {
    name?: string;
    tag: string;
    ethnicityAge: string;
    description: string;
    relationship: string;
  };
  wardrobeLock: {
    tag: string;
    garments: string;
    accessories: string;
    rule: string;
  };
  locationLock: {
    tag: string;
    geography: string;
    lightingKeys: string;
    colorPalette: string;
  };
  opticsAndAesthetics: {
    lensFamily: string;
    grading: string;
  };
  panels: StoryboardPanel[];
}

export interface PromptAuditIssue {
  id: string;
  severity: "critical" | "warning" | "tip";
  title: string;
  explanation: string;
  recommendation: string;
}

// Random human character seeds for film producers
export const RANDOM_CHARACTER_IDEAS: string[] = [
  "Arjun, a 19-year-old lean industrial apprentice waking up in a corrugated tin shed before an ITI trade exam; unruly black hair, natural skin pores, quiet determination.",
  "Ramesh, an aggressive 65-year-old street fruit vendor; heavy beedi smoker with nicotine-stained fingers, coarse grey stubble, hoarse raspy voice, worn linen kurta with street dust.",
  "Pooja, a 28-year-old female corporate accountant who trains in underground boxing at night; bruised swollen knuckles, tired guarded eyes, hair in a tight messy bun.",
  "Mahesh, a 42-year-old government bus driver on his lunch break; sun-darkened forearms, tea-stall saucer in hand, squinting against midday heat, faded khaki uniform shirt.",
  "Sunita, a 52-year-old hospital nurse at the end of a 14-hour night shift; soft dark circles under eyes, sensible worn flat shoes, loose cotton tunic, quiet contemplative exhaustion.",
  "Tariq, a 23-year-old freelance bike courier navigating torrential rain; reflective waterproof shell jacket, soaked eyelashes, sharp observant jawline, grip tape on glove cuffs."
];

export const FIRST_NAMES_MALE = [
  "Arjun", "Ramesh", "Kabir", "Vikram", "Mahesh", "Dev", "Tariq", "Marcus", "Mateo", "David", "Chen", "Karan", "Sanjay", "Farhan"
];

export const FIRST_NAMES_FEMALE = [
  "Pooja", "Sunita", "Devi", "Meera", "Ananya", "Maya", "Priya", "Elena", "Fatima", "Lin", "Sarah", "Nina", "Kavita", "Ritu"
];

export function generateRealisticCharacterName(genderHint?: string, existingNames: string[] = []): string {
  const isFemale = genderHint && (
    genderHint.toLowerCase().includes("woman") ||
    genderHint.toLowerCase().includes("female") ||
    genderHint.toLowerCase().includes("girl") ||
    genderHint.toLowerCase().includes("mother") ||
    genderHint.toLowerCase().includes("sister") ||
    genderHint.toLowerCase().includes("nurse")
  );
  const pool = isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE;
  const available = pool.filter((n) => !existingNames.includes(n));
  const list = available.length > 0 ? available : pool;
  return list[Math.floor(Math.random() * list.length)];
}

export interface HumanArchetypePreset {
  id: string;
  name: string; // Character name, e.g. "Pooja"
  archetypeTitle: string;
  description: string;
  wardrobeGarments: string;
  suggestedRole: "lead" | "supporting" | "counterpart";
}

export const HUMAN_ARCHETYPES: HumanArchetypePreset[] = [
  {
    id: "apprentice_mechanic",
    name: "Arjun",
    archetypeTitle: "Young Industrial Apprentice",
    suggestedRole: "lead",
    description: "19-year-old lean industrial apprentice waking up in a corrugated iron room before an ITI trade exam; unruly black hair, natural skin pores, quiet determination.",
    wardrobeGarments: "Faded navy blue cotton undershirt, utilitarian canvas work trousers with authentic grease smudges."
  },
  {
    id: "fruit_vendor",
    name: "Ramesh",
    archetypeTitle: "Aggressive Street Vendor / Mentor",
    suggestedRole: "supporting",
    description: "65-year-old street fruit vendor; heavy beedi smoker with nicotine-stained fingers, coarse grey stubble, hoarse raspy voice, calculating watchful gaze.",
    wardrobeGarments: "Worn beige linen kurta with authentic street dust, rolled-up forearms, faded cotton waistcloth."
  },
  {
    id: "boxer_woman",
    name: "Pooja",
    archetypeTitle: "Night Boxer / Accountant",
    suggestedRole: "lead",
    description: "28-year-old female corporate accountant who trains in underground boxing at night; bruised swollen knuckles, tired guarded eyes, tight messy bun, athletic grounded stance.",
    wardrobeGarments: "Faded grey cotton crewneck sweater with fraying ribbing, charcoal cargo sweatpants, worn wraps on knuckles."
  },
  {
    id: "bus_driver",
    name: "Mahesh",
    archetypeTitle: "Government Bus Driver",
    suggestedRole: "supporting",
    description: "42-year-old government bus driver on a humid afternoon break; sun-darkened forearms, tea-stall saucer in hand, squinting against harsh daylight.",
    wardrobeGarments: "Faded khaki uniform shirt with dual chest pockets and authentic collar sweat stains, dark cotton trousers."
  },
  {
    id: "night_nurse",
    name: "Sunita",
    archetypeTitle: "Night-Shift Nurse",
    suggestedRole: "lead",
    description: "52-year-old hospital nurse at the end of a grueling 14-hour night shift; soft dark circles under eyes, sensible posture, quiet contemplative exhaustion.",
    wardrobeGarments: "Pale blue hospital scrub top, comfortable dark stretch trousers, worn flat work clogs."
  },
  {
    id: "bike_courier",
    name: "Tariq",
    archetypeTitle: "Monsoon Courier",
    suggestedRole: "counterpart",
    description: "23-year-old freelance bike courier navigating torrential rain; reflective waterproof shell jacket, soaked eyelashes, sharp observant jawline, athletic posture.",
    wardrobeGarments: "Hi-vis weatherproof hooded windbreaker with water droplets, water-resistant trail pants, gripped gloves."
  }
];

export interface ProceduralTraitOption {
  id: string;
  label: string;
  desc: string;
}

export const BODY_BUILDS: ProceduralTraitOption[] = [
  { id: "skinny_frail", label: "Skinny / Frail", desc: "Slight, hollow-cheeked frame, visible collarbones, delicate wrist joints, light footsteps with minimal physical mass." },
  { id: "lean_athletic", label: "Lean / Sinewy", desc: "Lean wiry frame with tight tendon definition, hardened forearms, light on their feet with spring in their step." },
  { id: "curvy_soft", label: "Curvy / Soft", desc: "Full-bodied natural curves with soft rounded shoulders, grounded natural center of gravity, deliberate relaxed gait." },
  { id: "heavy_stocky", label: "Heavy / Stocky", desc: "Thick broad chest, solid heavy torso, short thick neck, planted stride bearing substantial physical weight." },
  { id: "muscular_strong", label: "Hardened / Strong", desc: "Dense muscular mass forged from heavy manual labor, broad calloused hands, thick neck muscles, grounded authority." },
  { id: "stooped_elderly", label: "Stooped / Weathered", desc: "Slightly hunched thoracic spine from decades of physical work, stiff lower back, cautious measured footing." }
];

export const SKIN_COMPLEXIONS: ProceduralTraitOption[] = [
  { id: "dark_melanin", label: "Deep Dark (Melanin-rich)", desc: "Rich deep obsidian-brown complexion, natural high-contrast skin undertone, subtle warm highlights under ambient tungsten light." },
  { id: "warm_brown", label: "Warm Brown / Wheatish", desc: "Warm golden-brown South Asian complexion, natural sun-darkened forearms and neck, authentic natural skin tones." },
  { id: "sunbaked_bronze", label: "Sun-baked Bronze", desc: "Deep copper bronze skin baked by years under the midday sun, leathery neck folds, natural tan gradients." },
  { id: "olive_matte", label: "Mediterranean / Olive", desc: "Matte olive undertone, neutral grey-green skin shadow falloff, natural resting facial hydration." },
  { id: "pale_ashen", label: "Pale / Ashen / Tired", desc: "Fair, slightly fatigued porcelain or ashen skin tone, subtle blue vascular undertones beneath thin under-eye skin, indoor worker look." }
];

export const SKIN_TEXTURES: ProceduralTraitOption[] = [
  { id: "pores_morning", label: "Visible Pores & Sleep Crease", desc: "Raw un-retouched epidermis with natural visible micro-pores, slight sleep impression marks on cheek, subtle morning puffiness. Zero airbrushing." },
  { id: "weathered_wrinkles", label: "Sun-Weathered & Deep Lines", desc: "Pronounced crow's feet radiating from outer eyelids, deep furrowed brow lines, leathery texture on neck and knuckles, authentic sun freckles." },
  { id: "sweat_grease", label: "Industrial Sweat & Grease", desc: "Fine natural moisture beads along the hairline, subtle oily sheen on nose bridge and forehead, faint soot or machine-grease smudge across cheek." },
  { id: "rough_stubble", label: "Coarse Stubble & Chapped", desc: "Uneven 3-day silver/black facial stubble, slightly chapped dry lower lip, rough matte skin texture without cosmetic glow." }
];

export const CLOTHING_PALETTES: ProceduralTraitOption[] = [
  { id: "charcoal_slate", label: "Charcoal & Slate", desc: "Sun-faded charcoal grey combed cotton with washed-out slate seams and frayed thread hems." },
  { id: "dusty_rust", label: "Rust & Terracotta", desc: "Faded terracotta oxide orange cotton with natural chalky fabric wash and street-dust patina." },
  { id: "washed_indigo", label: "Washed Indigo & Denim", desc: "Deep workwear indigo twill, faded at elbows and collar, subtle dye striations and worn white warp threads." },
  { id: "sunbleached_khaki", label: "Sun-bleached Khaki", desc: "Worn beige-khaki canvas drill fabric with sweat-stained collar band and utilitarian brass buttons." },
  { id: "olive_drab", label: "Faded Olive Drab", desc: "Muted army-green cotton duck fabric, weathered at pocket seams, muted desaturated olive tone." },
  { id: "offwhite_linen", label: "Soiled Off-white Linen", desc: "Natural unbleached raw linen fabric in bone-cream, visible natural slub weave, faint grime smudges along the cuffs." }
];

export const EVERYDAY_HABITS_KINESICS: string[] = [
  "Habitually rolls sleeves up past forearms; cracked calloused knuckles; checks wrist clock with a quick squint.",
  "Heavy smoker habit: nicotine-stained right index and middle fingers; shallow raspy breathing; stooped resting stance.",
  "Alert fighter habit: tense coiled shoulders, watchful eyes scanning corners, hands held relaxed but ready at waist level.",
  "Exhausted worker habit: rubs tired eyes with back of sleeve, shifts weight from foot to foot, slow deep sighs.",
  "Calculated merchant habit: sharp darting eyes assessing every movement, quick calculating hand gestures, posture leaning forward."
];

export function generateProceduralCharacter(options?: {
  role?: "lead" | "supporting" | "counterpart";
  gender?: "male" | "female";
  existingNames?: string[];
  buildId?: string;
  complexionId?: string;
  textureId?: string;
  paletteId?: string;
}): CharacterConcept {
  const role = options?.role || "lead";
  const gender = options?.gender || (Math.random() > 0.5 ? "female" : "male");
  const name = generateRealisticCharacterName(gender, options?.existingNames || []);
  
  const build = BODY_BUILDS.find((b) => b.id === options?.buildId) || BODY_BUILDS[Math.floor(Math.random() * BODY_BUILDS.length)];
  const complexion = SKIN_COMPLEXIONS.find((c) => c.id === options?.complexionId) || SKIN_COMPLEXIONS[Math.floor(Math.random() * SKIN_COMPLEXIONS.length)];
  const texture = SKIN_TEXTURES.find((t) => t.id === options?.textureId) || SKIN_TEXTURES[Math.floor(Math.random() * SKIN_TEXTURES.length)];
  const palette = CLOTHING_PALETTES.find((p) => p.id === options?.paletteId) || CLOTHING_PALETTES[Math.floor(Math.random() * CLOTHING_PALETTES.length)];
  const habit = EVERYDAY_HABITS_KINESICS[Math.floor(Math.random() * EVERYDAY_HABITS_KINESICS.length)];

  const randomAge = Math.floor(Math.random() * 45) + 19; // 19 to 64
  const ageGender = `${randomAge}-year-old ${gender === "female" ? "woman" : "man"}, ${build.label.toLowerCase()}`;
  const tag = `@CHAR_${name.toUpperCase().replace(/[^A-Z0-9]/g, "")}`;
  const rawInput = `${name}, a ${ageGender} with ${complexion.label.toLowerCase()} skin and ${palette.label.toLowerCase()} lived-in clothing. ${habit}`;

  return {
    id: `char_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    role,
    rawInput,
    tag,
    archetypeTitle: `${name} — ${build.label} (${complexion.label})`,
    ageGender,
    facialTopology: `Authentic facial structure for ${name}: ${complexion.desc} Distinct bone structure with natural asymmetry.`,
    skinTexture: `${texture.desc} Complexion: ${complexion.label}. Zero plastic smoothing.`,
    microKinesics: `${build.desc} Everyday habit: ${habit}`,
    wardrobeFabric: `${palette.desc} Utilitarian everyday tailoring with natural creases and authentic seam wear.`,
    personalityVibe: "Restrained, watchful resting expression; quiet grounded internal life."
  };
}

/**
 * Parses any raw free-form producer character concept into a structured cinematic prompt
 */
export function compileCharacterSheetPrompt(concept: CharacterConcept): string {
  return `[FILMMAKER CHARACTER DIAGNOSTIC REFERENCE SHEET]
CHARACTER NAME: ${concept.name.toUpperCase()} (Identity Anchor Token)
ASSET TAG: ${concept.tag}
ROLE: ${concept.role.toUpperCase()}
ARCHETYPE: ${concept.archetypeTitle}
INTENDED USE: Master Visual Reference / Flow Ingredient / Character Turnaround Model Sheet

═══════════════════════════════════════════════════════════
IDENTITY & BIOMETRIC CONTINUITY ANCHORS (DO NOT ALTER)
═══════════════════════════════════════════════════════════
• Character Name: ${concept.name}
• Age & Demographic: ${concept.ageGender}
• Bone Structure & Facial Topology: ${concept.facialTopology}
• Skin Texture & Authenticity: ${concept.skinTexture}
• Zero-Beauty Filter: Natural visible skin pores, authentic skin unevenness, subtle imperfections, zero plastic airbrushing, zero digital smoothing.

═══════════════════════════════════════════════════════════
EVERYDAY KINESICS & POSTURE HABITS
═══════════════════════════════════════════════════════════
• Physical Posture & Build: ${concept.microKinesics}
• Facial Baseline Expression: ${concept.personalityVibe}

═══════════════════════════════════════════════════════════
LIVED-IN WARDROBE LOCK (DAY-TO-DAY REALISM)
═══════════════════════════════════════════════════════════
• Garments: ${concept.wardrobeFabric}
• Wardrobe Rule: Everyday functional clothing with realistic seams, natural fabric creases, and authentic wear. No fashion runway styling.

═══════════════════════════════════════════════════════════
DIAGNOSTIC TURNAROUND RENDER DIRECTIVE
═══════════════════════════════════════════════════════════
Three-view character model sheet of ${concept.name} on a clean neutral grey cinematic background:
1. FRONT PORTRAIT (Eye-level, neutral resting facial expression, shoulders relaxed).
2. THREE-QUARTER VIEW (Showing hairline, jawline depth, and shoulder width).
3. PROFILE SHOT (Showing nasal bridge, ear placement, and spinal posture).

OPTICAL SPECIFICATIONS: Shot on 35mm Prime Lens (50mm T2.0). Even, diffuse natural daylight. Zero colored rim lights, zero neon glow, zero volumetric fog. Pure photographic realism.`;
}

/**
 * Intelligent parser that converts rough text into a full structured named concept
 */
export function parseRoughCharacterInput(
  rawInput: string,
  existingNames: string[] = [],
  role: "lead" | "supporting" | "counterpart" = "lead",
  customName?: string
): CharacterConcept {
  const lower = rawInput.toLowerCase();
  
  // Extract or assign character name
  let charName = (customName || "").trim();
  if (!charName) {
    // Check if rawInput begins with a capitalized name (e.g. "Arjun is a 19 year old...")
    const nameMatch = rawInput.match(/^([A-Z][a-z]{2,14})\b/);
    if (nameMatch && !["The", "This", "An", "A", "Elderly", "Young", "Old", "Aggressive"].includes(nameMatch[1])) {
      charName = nameMatch[1];
    } else {
      const isFemale = lower.includes("woman") || lower.includes("female") || lower.includes("girl") || lower.includes("mother") || lower.includes("sister") || lower.includes("nurse");
      charName = generateRealisticCharacterName(isFemale ? "female" : "male", existingNames);
    }
  }

  // Extract or guess age/gender
  let ageGender = "Adult human, everyday working-class background";
  if (lower.includes("woman") || lower.includes("female") || lower.includes("girl")) {
    const ageMatch = rawInput.match(/\b(\d{2})\b/);
    ageGender = ageMatch ? `${ageMatch[1]}-year-old woman` : "Woman in her late 20s or early 30s";
  } else if (lower.includes("man") || lower.includes("male") || lower.includes("guy")) {
    const ageMatch = rawInput.match(/\b(\d{2})\b/);
    ageGender = ageMatch ? `${ageMatch[1]}-year-old man` : "Man in his 30s or 40s";
  } else if (lower.includes("old") || lower.includes("elderly")) {
    ageGender = "Elderly person in their early 60s";
  }

  // Generate clean asset tag based on name
  const cleanTag = `@CHAR_${charName.toUpperCase().replace(/[^A-Z0-9]/g, "")}`;

  // Derive kinesics
  let kinesics = "Natural grounded posture with physical weight and realistic body gravity.";
  if (lower.includes("boxer") || lower.includes("fighter")) {
    kinesics = "Hardened athletic frame, bruised slightly swollen knuckles, alert coiled stance, guarded head tilt.";
  } else if (lower.includes("smoke") || lower.includes("smoker")) {
    kinesics = "Habitual nicotine-stained index and middle fingers, raspy shallow breathing, stooped shoulders.";
  } else if (lower.includes("fruit") || lower.includes("vendor") || lower.includes("seller")) {
    kinesics = "Sun-baked forearms, calloused palms, swift calculating hand gestures, posture accustomed to standing on concrete.";
  } else if (lower.includes("apprentice") || lower.includes("mechanic")) {
    kinesics = "Lean muscular build, grease-stained fingertips, quiet deliberate movements with real tool-handling dexterity.";
  }

  return {
    id: `char_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: charName,
    role,
    rawInput,
    tag: cleanTag,
    archetypeTitle: rawInput.slice(0, 42).trim() + (rawInput.length > 42 ? "..." : ""),
    ageGender,
    facialTopology: `Authentic facial structure for ${charName}: "${rawInput.slice(0, 80)}"`,
    skinTexture: "Natural human skin with visible micro-pores, authentic skin hydration, subtle daily wear, zero plastic airbrushing.",
    microKinesics: kinesics,
    wardrobeFabric: "Lived-in everyday garments with natural cotton/twill weave, visible seam stitching, and authentic wear.",
    personalityVibe: "Restrained, watchful resting expression; quiet internal life."
  };
}

/**
 * Built-in production presets for filmmakers
 */
export const PRODUCTION_PRESETS: Record<string, ProductionContinuity> = {
  scrapyard_dawn: {
    projectTitle: "Scrapyard Dawn",
    aspectRatio: "9:16",
    flowReferenceMode: "ingredients",
    rawRealismMode: true,
    sceneBeat: "At pre-dawn inside an industrial scrapyard tin shed, a young apprentice wakes up to face another grueling workday while his elder mentor watches from the doorway. Raw human mechanics, quiet internal thoughts, and zero CGI gloss.",
    cast: [
      {
        id: "char_arjun",
        name: "Arjun",
        role: "lead",
        rawInput: "Arjun, a 19-year-old lean industrial apprentice waking up in a corrugated shed before an ITI trade exam",
        tag: "@CHAR_ARJUN",
        archetypeTitle: "Young Industrial Apprentice",
        ageGender: "19-year-old South Asian young man, lean build, warm brown complexion",
        facialTopology: "Short unruly black hair, natural skin texture with visible pores and slight sleep crease, tired resting eyes",
        skinTexture: "Natural human skin with visible micro-pores, authentic skin hydration, subtle morning puffiness, zero plastic airbrushing.",
        microKinesics: "Lean muscular build, grease-stained fingertips, quiet deliberate movements with real tool-handling dexterity.",
        wardrobeFabric: "Faded distressed charcoal grey cotton T-shirt, loose dark grey twill work trousers",
        personalityVibe: "Heavy resting eyelids, quiet internal focus"
      },
      {
        id: "char_ramesh",
        name: "Ramesh",
        role: "supporting",
        rawInput: "Ramesh, a 58-year-old senior scrap master and father figure",
        tag: "@CHAR_RAMESH",
        archetypeTitle: "Senior Scrap Master / Mentor",
        ageGender: "58-year-old man, weathered features, silver-peppered beard stubble",
        facialTopology: "Deep eye creases, prominent cheekbones, stern watchful brow",
        skinTexture: "Sun-worn coarse skin, visible laughter and worry lines, natural age spots.",
        microKinesics: "Slow authoritative stride, habit of resting hands on hips, grounded heavy posture.",
        wardrobeFabric: "Worn beige linen kurta with authentic street dust, rolled-up forearms, dark cotton waistcloth.",
        personalityVibe: "Guarded, experienced, taciturn authority"
      }
    ],
    primaryCharacter: {
      name: "Arjun",
      tag: "@CHAR_ARJUN",
      ethnicityAge: "19-year-old South Asian young man, lean build, warm brown complexion",
      description: "Short unruly black hair, natural skin texture with visible pores and slight sleep crease, tired resting eyes",
      expression: "Heavy resting eyelids, quiet internal focus"
    },
    secondaryCharacter: {
      name: "Ramesh",
      tag: "@CHAR_RAMESH",
      ethnicityAge: "58-year-old man, senior scrap master, weathered skin",
      description: "Silver-peppered stubble, watchful eye creases, worn linen kurta",
      relationship: "Elder workshop mentor / father figure"
    },
    wardrobeLock: {
      tag: "@WARDROBE_ARJUN_HOME",
      garments: "Faded distressed charcoal grey cotton T-shirt, loose dark grey twill work trousers",
      accessories: "Worn red protection thread on right wrist. Bare feet.",
      rule: "NO mid-scene wardrobe transitions. Preserve worn fabric texture across all frames."
    },
    locationLock: {
      tag: "@LOC_SHED_INTERIOR",
      geography: "Cramped corrugated tin-sheet bedroom, wooden cot positioned frame-left, doorway open on frame-right with metal scrap visible outside",
      lightingKeys: "Warm tungsten 40W bare filament bulb frame-left; soft cool steel-blue pre-dawn skylight filtering through doorway",
      colorPalette: "Muted slate, rust-red oxide, warm amber skin accents, deep dawn blues"
    },
    opticsAndAesthetics: {
      lensFamily: "Arri Master Prime 35mm T1.3, shallow depth of field, gentle organic halation",
      grading: "35mm cinematic emulsion texture, neutral grain, lifelike skin tone fidelity"
    },
    panels: [
      {
        id: "p1",
        panelNumber: 1,
        framing: "ECU",
        angle: "Eye-level",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Tight center frame on Arjun's face on pillow; quiet intimate isolation.",
        initialPose: "Arjun is lying down asleep. Eyes firmly closed in deep slumber.",
        action: "Steady, shallow chest breathing. Eyelids twitch subtly in REM sleep, remaining closed. Natural resting face without micro-twitching.",
        screenDirection: "Face angled slightly toward camera",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Distant pre-dawn call, faint cricket hum, soft tin creak in morning breeze",
        dialogue: "",
        dialogueSpeaker: "Arjun",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "p2",
        panelNumber: 2,
        framing: "CU",
        angle: "Eye-level",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Arjun in profile frame-right looking towards doorway.",
        initialPose: "Arjun is lying on side on the worn pillow, head resting flat, eyes wide open staring pensively.",
        action: "Arjun blinks slowly once, staring into the dark room. Jaw remains slack with quiet exhaustion. Lips remain firmly shut. No vocalization.",
        screenDirection: "Profile facing frame-right toward open doorway",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Slow inhalation of morning air, subtle distant traffic rumble",
        dialogue: "फिर सुबह हो गई...",
        dialogueSpeaker: "Arjun",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 10
      },
      {
        id: "p3",
        panelNumber: 3,
        framing: "CU",
        angle: "High angle",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Cot edge diagonal frame-left to right. Arjun's planted foot lower-center.",
        initialPose: "Arjun's bare right foot is ALREADY resting firmly on the concrete floor beside the wooden cot edge and scrap paint cans. Hand rests on the crumpled bedsheet on the cot.",
        action: "Bare toes flex and grip the dusty floor slightly for traction. Hand fingers tighten into the cotton sheet as Arjun prepares to push his weight upward. Foot remains planted on floor; bedsheet stays bunched on cot.",
        screenDirection: "Cot edge runs diagonal frame-left to frame-right; foot planted lower-center",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Cot timber creaks under shifting weight, bare skin on cold concrete floor",
        dialogue: "चल... देर नहीं करनी।",
        dialogueSpeaker: "Arjun",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 6
      },
      {
        id: "p4",
        panelNumber: 4,
        framing: "MS",
        angle: "Eye-level",
        charactersInFrame: ["Arjun", "Ramesh"],
        spatialBlocking: "Vertical 9:16 depth staging: Arjun seated on cot edge foreground frame-left; Ramesh standing silhouetted in background doorway frame-right.",
        initialPose: "Arjun is sitting upright on the cot edge; Ramesh stands motionless in the background doorway holding a tin mug.",
        action: "Arjun looks up toward the doorway. Ramesh nods once with quiet, unsmiling approval before turning away. Neither speaks aloud; mouths remain shut.",
        screenDirection: "Arjun seated lower-left facing doorway; Ramesh in upper-right doorway background",
        cameraMovement: "Slow Push-In (Dolly)",
        audioAmbience: "Morning scrapyard ambience, distant clang of iron, cool breeze through doorway",
        dialogue: "आज निकलना है।",
        dialogueSpeaker: "Arjun",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 10
      }
    ]
  },
  chai_tapri_dawn: {
    projectTitle: "Morning Chai Stall",
    aspectRatio: "9:16",
    flowReferenceMode: "ingredients",
    rawRealismMode: true,
    sceneBeat: "Pre-dawn street corner tea stall. The chai vendor prepares the first brew of the morning over an old brass stove, gingerly rotating the boiling brass handi with a folded cotton cloth to insulate his hands from the scalding metal.",
    cast: [
      {
        id: "char_mahesh_chai",
        name: "Mahesh",
        role: "lead",
        rawInput: "Mahesh, a 48-year-old roadside chai stall vendor with calm observant eyes and calloused tea-stained fingers",
        tag: "@CHAR_MAHESH",
        archetypeTitle: "Roadside Chai Wallah",
        ageGender: "48-year-old man, lean wiry build, warm wheatish complexion",
        facialTopology: "Deep laugh lines around watchful eyes, salt-and-pepper mustache, calm concentrated brow",
        skinTexture: "Natural visible pores, faint sweat sheen along hairline from steam, zero plastic airbrushing.",
        microKinesics: "Economical, deliberate hand gestures; habitual head tilt when judging boiling liquid; calm grounded posture.",
        wardrobeFabric: "Faded charcoal-blue cotton kurta with rolled-up sleeves, worn utility apron, folded cotton towel on shoulder.",
        personalityVibe: "Quiet meditative focus, early morning stillness."
      }
    ],
    primaryCharacter: {
      name: "Mahesh",
      tag: "@CHAR_MAHESH",
      ethnicityAge: "48-year-old South Asian man, lean wiry build, wheatish complexion",
      description: "Salt-and-pepper mustache, focused eyes, steam sheen on skin",
      expression: "Quiet meditative focus"
    },
    wardrobeLock: {
      tag: "@WARDROBE_CHAI_MAHESH",
      garments: "Faded charcoal-blue cotton kurta with sleeves rolled past elbows, dark cotton waistcloth",
      accessories: "Folded faded indigo kitchen cotton cloth (kapda) in hand for handling hot pots",
      rule: "Cloth must always insulate fingers when touching metal vessel on burner."
    },
    locationLock: {
      tag: "@LOC_CHAI_STALL",
      geography: "Roadside wooden tapri stall under banyan tree canopy, kerosene burner on wooden counter, brass handi and clay kulhads",
      lightingKeys: "Soft pre-dawn cobalt blue skylight backlight; warm amber tungsten glow from kerosene flame below pot",
      colorPalette: "Rich tea amber, oxidized brass gold, cobalt dawn, charcoal slate"
    },
    opticsAndAesthetics: {
      lensFamily: "Leica Summilux-C 50mm T1.4, creamy focus falloff, atmospheric steam halation",
      grading: "Warm amber-gold midtones, deep natural shadows, pure 35mm photographic texture"
    },
    panels: [
      {
        id: "ch1",
        panelNumber: 1,
        framing: "CU",
        angle: "Eye-level",
        charactersInFrame: ["Mahesh"],
        spatialBlocking: "Center frame: Scalding brass handi resting on blue kerosene flame.",
        initialPose: "Brass handi is already bubbling furiously on the flame; crushed ginger and cardamom floating on milk surface.",
        action: "Violent rolling boil: spiced milk surges upward in frothy ripples. Rich white aromatic steam billows directly toward lens.",
        screenDirection: "Center frame focus",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Loud rhythmic hiss of kerosene burner, rapid bubbling froth, distant morning crow",
        dialogue: "",
        dialogueSpeaker: "Mahesh",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "ch2",
        panelNumber: 2,
        framing: "MCU",
        angle: "Eye-level",
        charactersInFrame: ["Mahesh"],
        spatialBlocking: "Mahesh framed center-right, looking down toward the flame frame-left.",
        initialPose: "Mahesh stands motionless watching the rising milk froth.",
        action: "Mahesh observes the boil with calm experienced eyes, blinking slowly once. Lips remain closed. Breath visible in cool air.",
        screenDirection: "Eyeline focused frame-lower-left toward burner",
        cameraMovement: "Subtle Handheld Breathing",
        audioAmbience: "Gentle pre-dawn wind rustling banyan leaves, rhythmic boiling hum",
        dialogue: "उबाल आ गया...",
        dialogueSpeaker: "Mahesh",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      },
      {
        id: "ch3",
        panelNumber: 3,
        framing: "CU",
        angle: "High angle",
        charactersInFrame: ["Mahesh"],
        spatialBlocking: "High angle on hot brass rim and counter. Hands entering frame.",
        initialPose: "Mahesh's hands already hold a folded thick indigo cotton cloth (kapda) wrapped around the hot metal rim.",
        action: "Using the thick cotton cloth as insulation, Mahesh's calloused fingers grip the scalding brass handi firmly and rotate it 90 degrees over the flame to prevent scorching. Bare skin never touches metal.",
        screenDirection: "Hands rotating clockwise",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Friction scrape of brass against iron stove ring, bubbling milk settling slightly",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "ch4",
        panelNumber: 4,
        framing: "MS",
        angle: "Eye-level",
        charactersInFrame: ["Mahesh"],
        spatialBlocking: "9:16 vertical depth: Mahesh in midground; clay kulhads lined in immediate foreground.",
        initialPose: "Handi lifted 18 inches above counter.",
        action: "High graceful pour: thick steaming amber chai streams in a continuous arc into two unglazed terracotta kulhads without spilling a drop.",
        screenDirection: "Stream pouring top-right to bottom-center",
        cameraMovement: "Slow Push-In (Dolly)",
        audioAmbience: "Rich splashing aeration sound of chai filling earthenware, rising steam hiss",
        dialogue: "दिन शुरू...",
        dialogueSpeaker: "Mahesh",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 10
      }
    ]
  },
  coconut_palm_harvest: {
    projectTitle: "Canopy Palm Harvest",
    aspectRatio: "9:16",
    flowReferenceMode: "ingredients",
    rawRealismMode: true,
    sceneBeat: "A seasoned palm harvester climbs a 50-foot coconut tree at sunrise. Complex physical actions are broken into focused macro close-ups: tree height drone perspective, coir climbing foot-grip, curved koitha sickle blade cutting, and lowering the heavy 12-coconut bunch with rope leverage without smashing.",
    cast: [
      {
        id: "char_devan_palm",
        name: "Devan",
        role: "lead",
        rawInput: "Devan, a 42-year-old coastal palm harvester with sinewy muscular frame, sun-baked bronze skin, and calloused climbing palms",
        tag: "@CHAR_DEVAN",
        archetypeTitle: "Coastal Palm Harvester",
        ageGender: "42-year-old man, lean sinewy athletic build, deep sun-baked bronze complexion",
        facialTopology: "Weathered squint lines from coastal glare, sharp prominent jaw, salt-crusted eyebrows",
        skinTexture: "Sun-darkened leathery skin, authentic sweat sheen on shoulder blades, visible muscle striations.",
        microKinesics: "Agile, grounded monkey-grip footing; calm deliberate knife movements; respects gravity and height.",
        wardrobeFabric: "Worn faded indigo cotton lungi tucked tight between thighs, bare torso with natural sweat, thick coir rope belt.",
        personalityVibe: "Hyper-attuned to wind and balance, quiet fearless focus."
      }
    ],
    primaryCharacter: {
      name: "Devan",
      tag: "@CHAR_DEVAN",
      ethnicityAge: "42-year-old coastal harvester, sinewy athletic build, bronze complexion",
      description: "Lean muscular back, sun-squinted eyes, sweat sheen",
      expression: "Hyper-attuned to balance, quiet fearless focus"
    },
    wardrobeLock: {
      tag: "@WARDROBE_DEVAN_CLIMB",
      garments: "Faded indigo cotton lungi hitched and tucked between legs into tight climbing shorts; bare chest",
      accessories: "Heavy coir foot-strap loop around feet, coiled lowering rope around shoulder, curved iron sickle (koitha) in rope holster",
      rule: "Preserve authentic sweat sheen and bark dust on forearms across all shots."
    },
    locationLock: {
      tag: "@LOC_PALM_GROVE",
      geography: "Towering 50-foot coconut palm tree grove beside coastal backwaters, lush green canopy against sunrise sky",
      lightingKeys: "Blinding horizontal golden morning sunbeam raking through palm fronds, deep shadows beneath canopy",
      colorPalette: "Emerald palm frond green, golden sunbeam, fibrous coconut husk amber, deep bark grey"
    },
    opticsAndAesthetics: {
      lensFamily: "Arri Ultra Prime 32mm & 85mm T1.9, crisp optical separation, deep vertical depth of field",
      grading: "Rich equatorial natural color, high dynamic range sky, authentic skin tones"
    },
    panels: [
      {
        id: "co1",
        panelNumber: 1,
        framing: "WS",
        angle: "Low angle",
        charactersInFrame: ["Devan"],
        spatialBlocking: "Devan standing lower-third center; palm trunk soaring vertically 50ft into sky.",
        initialPose: "Devan stands at tree base looking straight up, hands resting on coiled rope on his hip.",
        action: "Devan takes a slow deep breath, shading eyes with right hand to inspect the distant canopy fruit. Wind sways top fronds.",
        screenDirection: "Eyeline looking straight up frame-top",
        cameraMovement: "Slow Tilt-Up",
        audioAmbience: "Coastal breeze in palm fronds, distant crowing rooster, ocean surf whisper",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "co2",
        panelNumber: 2,
        framing: "CU",
        angle: "High angle",
        charactersInFrame: ["Devan"],
        spatialBlocking: "Crown fronds framing 12-coconut bunch centered.",
        initialPose: "Cluster of 12 ripe heavy green coconuts hanging beneath frond stalk.",
        action: "Heavy coconut bunch sways gently in the morning ocean wind. Dewdrops cling to the fibrous husks.",
        screenDirection: "Swaying gently left to right",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Hollow wooden clack of heavy coconuts knocking softly together in wind",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "co3",
        panelNumber: 3,
        framing: "WS",
        angle: "Overhead",
        charactersInFrame: ["Devan"],
        spatialBlocking: "Overhead downward drone shot: green fronds in immediate foreground; tiny ground base 50ft below.",
        initialPose: "Camera looks straight down past tree crown to ground.",
        action: "Camera holds dizzying downward perspective: palm trunk drops straight down to the tiny square footprint below.",
        screenDirection: "Top-down vertical axis",
        cameraMovement: "Slow Pull-Out",
        audioAmbience: "Sudden rush of coastal altitude wind whistling past lens",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "co4",
        panelNumber: 4,
        framing: "CU",
        angle: "Low angle",
        charactersInFrame: ["Devan"],
        spatialBlocking: "Mid-trunk vertical center: feet in coir strap.",
        initialPose: "Bare feet already looped in rough coir rope ring, clamped against rough trunk bark.",
        action: "Feet clamp tightly against bark; leg muscles flex as Devan hitches upward 2 feet in one smooth, rhythmic climbing stride.",
        screenDirection: "Moving upward along vertical axis",
        cameraMovement: "Tracking Pan",
        audioAmbience: "Coarse rasp of coir rope scraping textured coconut bark, heavy measured breathing",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "co5",
        panelNumber: 5,
        framing: "MCU",
        angle: "Eye-level",
        charactersInFrame: ["Devan"],
        spatialBlocking: "Devan nested safely beneath crown fronds frame-left; bunch frame-right.",
        initialPose: "Devan anchored firmly in palm crown crook. Right hand reaches to hip holster.",
        action: "Devan unsheathes a curved iron harvesting sickle (koitha) with a worn wooden handle. Sharp blade catches golden sunbeam.",
        screenDirection: "Reaching from hip to frame-right",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Metallic whisper of iron blade clearing rope loop, leaves rustling",
        dialogue: "पक्के हैं सारे...",
        dialogueSpeaker: "Devan",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      },
      {
        id: "co6",
        panelNumber: 6,
        framing: "CU",
        angle: "Eye-level",
        charactersInFrame: ["Devan"],
        spatialBlocking: "Macro rigging shot: bunch stalk and coir rope centered.",
        initialPose: "Coir rope already looped over a sturdy crown frond fork.",
        action: "Before cutting, Devan securely knots the thick coir lowering rope around the 12-coconut bunch stem for friction leverage.",
        screenDirection: "Hands working tight knots frame-center",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Friction groan of coir rope tightening around tough fibrous stem",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "co7",
        panelNumber: 7,
        framing: "CU",
        angle: "Eye-level",
        charactersInFrame: ["Devan"],
        spatialBlocking: "Curved sickle blade positioned at stem junction.",
        initialPose: "Curved blade hooked around fibrous 3-inch thick bunch stalk.",
        action: "With stabilizing hand anchored, Devan pulls curved sickle through stalk in two clean, sawing cuts. Fibers sever; bunch hangs free on rope.",
        screenDirection: "Blade pulls right to left",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Crisp fibrous crunch of sickle slicing green stem, sudden creak of rope taking load",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "co8",
        panelNumber: 8,
        framing: "CU",
        angle: "High angle",
        charactersInFrame: ["Devan"],
        spatialBlocking: "High angle looking over Devan's calloused hands holding rope line.",
        initialPose: "Heavy 15kg bunch suspended in air; rope wrapped around frond fork for braking friction.",
        action: "Devan's calloused hands slowly and rhythmically pay out the rough coir line inch by inch, lowering the heavy bunch gently toward the ground. No drop.",
        screenDirection: "Rope sliding through hands downward",
        cameraMovement: "Subtle Handheld Breathing",
        audioAmbience: "Controlled zipping hiss of coir rope sliding over tree wood, Devan's steady exhalation",
        dialogue: "संभल के...",
        dialogueSpeaker: "Devan",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      },
      {
        id: "co9",
        panelNumber: 9,
        framing: "MS",
        angle: "Low angle",
        charactersInFrame: ["Devan"],
        spatialBlocking: "Ground level: grassy base beneath palm trunk.",
        initialPose: "Bunch descending 2 feet above grass.",
        action: "The 12-coconut bunch touches down softly onto the grass, settling upright without bouncing, bursting, or shattering. Rope goes slack.",
        screenDirection: "Bunch settles into frame-center",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Dull, satisfying thud of coconuts nestling into soft green grass and earth",
        dialogueType: "silent",
        durationSeconds: 6
      }
    ]
  },
  morning_rush_bus: {
    projectTitle: "The Morning Rush",
    aspectRatio: "16:9",
    flowReferenceMode: "ingredients",
    rawRealismMode: true,
    sceneBeat: "A young office worker wakes up late and sprints through narrow morning alleys to catch the departure bus. Preserving strict screen direction (Right-to-Left) across all running shots, leading to a physical match-cut grab at the bus entrance.",
    cast: [
      {
        id: "char_kabir_rush",
        name: "Kabir",
        role: "lead",
        rawInput: "Kabir, a 24-year-old junior accountant sprinting in formal clothes with an unbuttoned collar and leather satchel",
        tag: "@CHAR_KABIR",
        archetypeTitle: "Hurried Office Clerk",
        ageGender: "24-year-old man, lean athletic build, wheatish complexion",
        facialTopology: "Young hurried features, disheveled black hair, panicked wide dark eyes",
        skinTexture: "Realistic skin with fine morning perspiration, natural pores, zero cosmetic filter.",
        microKinesics: "Agitated, rapid lunging strides, satchel bouncing against ribs, chest pumping with heavy breaths.",
        wardrobeFabric: "Wrinkled white cotton formal shirt with open collar, dark navy pressed formal trousers, worn brown oxford shoes.",
        personalityVibe: "Desperate urgency, racing against the clock."
      }
    ],
    primaryCharacter: {
      name: "Kabir",
      tag: "@CHAR_KABIR",
      ethnicityAge: "24-year-old man, lean build, disheveled hair",
      description: "White formal shirt, dark trousers, panicked eyes",
      expression: "Desperate urgency, racing against the clock"
    },
    wardrobeLock: {
      tag: "@WARDROBE_KABIR_FORMAL",
      garments: "White formal dress shirt unbuttoned at throat, charcoal formal trousers, leather shoulder satchel",
      accessories: "Steel wristwatch on left wrist, worn brown oxford shoes with scuffed toes",
      rule: "Maintain wrinkled shirt creases and bouncing satchel consistently."
    },
    locationLock: {
      tag: "@LOC_COMMUTE_STREET",
      geography: "Narrow residential brick alley opening out into crowded municipal bus stop lane",
      lightingKeys: "Direct morning sunlight casting long hard shadows across the asphalt",
      colorPalette: "Bright sunlit concrete, terracotta brick walls, bus crimson and chrome"
    },
    opticsAndAesthetics: {
      lensFamily: "Zeiss Super Speed 28mm T1.3, dynamic wide-angle kinetic perspective",
      grading: "High contrast morning documentary style, crisp shutter speed (45° equivalent)"
    },
    panels: [
      {
        id: "mr1",
        panelNumber: 1,
        framing: "ECU",
        angle: "Eye-level",
        charactersInFrame: ["Kabir"],
        spatialBlocking: "Extreme close-up: Kabir's eyes filling frame.",
        initialPose: "Eyes shut in bed.",
        action: "Kabir's eyes snap wide open in instant terror; pupils dilate as he registers the late morning sunlight.",
        screenDirection: "Eyes centered, darting slightly right",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Harsh piercing electric alarm buzzer blaring in small bedroom",
        dialogue: "अरे बाप रे! आठ बज गए!",
        dialogueSpeaker: "Kabir",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 4
      },
      {
        id: "mr2",
        panelNumber: 2,
        framing: "CU",
        angle: "High angle",
        charactersInFrame: ["Kabir"],
        spatialBlocking: "Alarm clock on bedside wooden stool.",
        initialPose: "Red LED digital clock displaying 08:14 AM vibrating on stool.",
        action: "Kabir's hand slams down violently on the snooze bar, knocking the clock askew and killing the alarm.",
        screenDirection: "Hand strikes from top-right to center",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Violent plastic impact clack, sudden silence, hurried footsteps scramble",
        dialogueType: "silent",
        durationSeconds: 4
      },
      {
        id: "mr3",
        panelNumber: 3,
        framing: "CU",
        angle: "Eye-level",
        charactersInFrame: ["Kabir"],
        spatialBlocking: "Mirror reflection: Kabir brushing teeth with furious speed.",
        initialPose: "Toothbrush in mouth, foam on chin.",
        action: "Kabir scrubs teeth frantically with white foam dripping down lower lip, eyes locked in terror on the wall clock behind him.",
        screenDirection: "Facing forward into mirror",
        cameraMovement: "Subtle Handheld Breathing",
        audioAmbience: "Frenzied bristles scrubbing, bathroom tap running cold water",
        dialogueType: "silent",
        durationSeconds: 4
      },
      {
        id: "mr4",
        panelNumber: 4,
        framing: "CU",
        angle: "Low angle",
        charactersInFrame: ["Kabir"],
        spatialBlocking: "Ground level tracking: Leather shoes pounding road from Screen-Right to Screen-Left.",
        initialPose: "Shoes in mid-stride.",
        action: "Low-angle fast tracking: Worn leather dress shoes pound furiously into the tarmac, kicking up grit as Kabir sprints Screen-Right to Screen-Left.",
        screenDirection: "Sprinting strictly Screen-Right to Screen-Left",
        cameraMovement: "Tracking Pan",
        audioAmbience: "Rapid slapping impacts of hard leather soles on asphalt, heavy ragged gasping",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "mr5",
        panelNumber: 5,
        framing: "WS",
        angle: "Eye-level",
        charactersInFrame: ["Kabir"],
        spatialBlocking: "Widescreen alley: Kabir enters frame-right and sprints exit frame-left.",
        initialPose: "Kabir bursting around brick alley corner.",
        action: "Kabir sprints full speed from Screen-Right across the wide frame and exits Screen-Left, satchel flapping wildly behind him.",
        screenDirection: "Consistent Screen-Right to Screen-Left cross-screen motion",
        cameraMovement: "Tracking Pan",
        audioAmbience: "Distant bus air-brake hiss, blaring city horn, Kabir's gasping breath",
        dialogue: "रुकना मत... बस छूट जाएगी!",
        dialogueSpeaker: "Kabir",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 6
      },
      {
        id: "mr6",
        panelNumber: 6,
        framing: "CU",
        angle: "Low angle",
        charactersInFrame: ["Kabir"],
        spatialBlocking: "Bus doorway entry: Stainless steel vertical grab-pole.",
        initialPose: "Bus beginning to roll forward; empty grab-pole frame-center.",
        action: "Kabir's desperate hand enters frame and slams tightly around the cold stainless-steel grab-rail, knuckles whitening with sudden braking momentum.",
        screenDirection: "Hand lunges Screen-Right to grab pole frame-center",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Loud metallic clang of hand slapping steel rail, accelerating bus diesel rumble",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "mr7",
        panelNumber: 7,
        framing: "MCU",
        angle: "Eye-level",
        charactersInFrame: ["Kabir"],
        spatialBlocking: "Match-cut interior bus: Kabir hanging from overhead strap frame-center.",
        initialPose: "Kabir aboard moving bus, hand gripped around leather strap overhead.",
        action: "Physical match-cut: Kabir catches his breath on the moving bus; chest heaves with deep relief, wiping sweat from brow with sleeve.",
        screenDirection: "Facing forward, body swaying with bus movement",
        cameraMovement: "Subtle Handheld Breathing",
        audioAmbience: "Rattling bus interior metal, ticket conductor whistle, diesel engine growl",
        dialogue: "पकड़ ली...",
        dialogueSpeaker: "Kabir",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      }
    ]
  },
  iti_scrap_mechanist: {
    projectTitle: "The ITI Mechanist & The Scrap Wall-E",
    aspectRatio: "16:9",
    flowReferenceMode: "ingredients",
    rawRealismMode: true,
    sceneBeat: "Arjun (19), a poor ITI vocational student in a faded grey workshop uniform, constructs a DIY scrap-metal robot inspired by Wall-E using salvaged auto parts, bicycle chains, and an old camera lens. Decomposed into focused macro compositions to eliminate AI complexity and avoid bizarre environmental hallucinations like washbasins in wire piles.",
    cast: [
      {
        id: "char_arjun_iti",
        name: "Arjun",
        role: "lead",
        rawInput: "Arjun, a 19-year-old vocational ITI machinist student with grease-stained cuticles, intense watchful eyes, and a quiet determination",
        tag: "@CHAR_ARJUN",
        archetypeTitle: "ITI Vocational Machinist",
        ageGender: "19-year-old man, lean sinewy build, warm brown complexion",
        facialTopology: "Focused young brow, light black grease smudge along left cheekbone, tired eyelids, natural skin pores",
        skinTexture: "Natural human skin with fine micro-pores, grease residue under fingernails, zero airbrushing.",
        microKinesics: "Economical, calibrated finger movements; habitually wipes oily palms on cotton trousers; grounded physical weight.",
        wardrobeFabric: "Faded grey cotton ITI workshop uniform shirt with twin flap pockets and steel scale in pocket, scuffed dark trousers.",
        personalityVibe: "Quiet resourceful focus, meditative mechanical craftsman."
      }
    ],
    primaryCharacter: {
      name: "Arjun",
      tag: "@CHAR_ARJUN",
      ethnicityAge: "19-year-old South Asian man, lean machinist build, warm brown complexion",
      description: "Grease smudge on cheek, focused watchful eyes, calloused fingers",
      expression: "Quiet resourceful focus"
    },
    wardrobeLock: {
      tag: "@WARDROBE_ITI_GREY",
      garments: "Faded grey cotton ITI workshop uniform shirt with rolled sleeves, steel scale visible in left chest pocket, dark work trousers",
      accessories: "Worn Bata canvas sneakers with metal filings on laces, cloth rag tucked in back pocket",
      rule: "Preserve genuine workshop dust and oil patina across all shots. No clean runway makeover."
    },
    locationLock: {
      tag: "@LOC_TIN_SHED_WORKSHOP",
      geography: "8x10 tin-roof room with concrete floor, plywood workbench on oil drums, Hindi ITI trade theory textbook, auto scrap yard outside",
      lightingKeys: "Single hanging 60W tungsten bulb over workbench; warm raking golden sunset light through wire-mesh window",
      colorPalette: "Industrial machine grey, oxidized iron rust, tea amber, tungsten gold, cool shadow slate"
    },
    opticsAndAesthetics: {
      lensFamily: "Zeiss Super Speed 50mm T1.3, razor-thin depth of field, creamy background falloff, organic 35mm grain",
      grading: "Grounded neorealist grading, deep honest blacks, natural warm skin midtones, zero digital bloom"
    },
    panels: [
      {
        id: "it1",
        panelNumber: 1,
        framing: "CU",
        angle: "Eye-level",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Lathe chuck spinning frame-left; tool bit and brass workpiece center; Arjun's eyes in soft background focus.",
        initialPose: "Three-jaw lathe chuck already spinning at 800 RPM; cutting tool engaged against brass bushing.",
        action: "High-speed steel cutting tool peels off a continuous golden spiral brass shaving (chhilka). Soluble milky coolant splashes across the hot metal. Arjun's eyes observe behind clear safety goggles.",
        screenDirection: "Lathe chuck spinning counter-clockwise",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Loud industrial lathe whine, steady sizzle of milky coolant boiling off hot brass, shop background hum",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "it2",
        panelNumber: 2,
        framing: "MS",
        angle: "Eye-level",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Framed through silhouette of rusted auto leaf-spring rack; Arjun standing by wooden scrap crate.",
        initialPose: "Arjun stands in dusty scrapyard alley, holding a salvaged black 12V Ambassador windshield wiper motor.",
        action: "Arjun wipes thick black axle grease off the motor casing with his thumb, squinting to read the stamped 12V specification. Lips remain firmly shut.",
        screenDirection: "Profile facing frame-right",
        cameraMovement: "Subtle Handheld Breathing",
        audioAmbience: "Distant hammer clanging on iron in scrap yard, passing auto rickshaw sputter, dry wind",
        dialogue: "ये मोटर काम करेगी...",
        dialogueSpeaker: "Arjun",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      },
      {
        id: "it3",
        panelNumber: 3,
        framing: "ECU",
        angle: "High angle",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Macro isolation: Brass water tap upper-center; worn porcelain basin; hands center. Shallow depth of field f/1.4.",
        initialPose: "Cold water stream already flowing over Arjun's hands; bar of red Lifebuoy soap in soap dish.",
        action: "Isolated hygiene macro: Arjun scrubs heavy black machine grease from calloused fingers. Lather turns thick slate-grey under the water stream. Strictly ZERO electrical wires, motors, or workshop tools in frame.",
        screenDirection: "Water flowing downward; hands rubbing vigorously center frame",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Steady splash of cold running tap water into porcelain, soap suds squelch, absolute quiet",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "it4",
        panelNumber: 4,
        framing: "MS",
        angle: "Eye-level",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Ozu 3-foot tatami axis: Arjun seated barefoot on jute sack on floor; scrap robot chassis resting on wooden block center.",
        initialPose: "Arjun seated cross-legged; 10mm rusted spanner engaged on chassis bolt.",
        action: "Using calibrated leverage, Arjun tightens the galvanized iron chassis bolt until it creaks. Robot's hand-bent frame sits solid with pop rivets and grease patina. No magical levitation.",
        screenDirection: "Arjun seated frame-left facing robot center",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Sharp metallic creak of bolt torquing down, rustle of jute mat on cold concrete, evening crickets",
        dialogue: "मजबूत हो गया ढांचा।",
        dialogueSpeaker: "Arjun",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      },
      {
        id: "it5",
        panelNumber: 5,
        framing: "ECU",
        angle: "High angle",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Macro circuit shot: Veroboard centered; soldering pencil tip entering from lower-right.",
        initialPose: "Soldering iron already hot; fingers grip exclusively the insulated black plastic handle.",
        action: "Fingers hold the insulated plastic grip safely clear of the hot metal barrel. Iron tip touches copper track; rosin solder wire melts into a gleaming silver dome. Thin blue rosin smoke curls upward.",
        screenDirection: "Smoke rising vertically into tungsten beam",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Tiny sizzle of rosin flux melting, faint nasal exhale, quiet room stillness",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "it6",
        panelNumber: 6,
        framing: "CU",
        angle: "Eye-level",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Robot head centered: twin mismatched camera lenses on bent aluminum bracket.",
        initialPose: "Scrap robot head motionless; one 35mm Zenit lens and one brass flashlight reflector.",
        action: "Arjun's calloused hand enters frame to rotate the knurled focus ring of the camera-lens eye. Mechanical aperture blades click into position. Pitted metal texture with zero CGI cartoon gloss.",
        screenDirection: "Hand enters frame-right to adjust lens",
        cameraMovement: "Slow Push-In (Dolly)",
        audioAmbience: "Crisp tactile mechanical click of camera lens aperture detents, dry leaf rustle outside",
        dialogue: "अब देख पाएगा तू...",
        dialogueSpeaker: "Arjun",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      },
      {
        id: "it7",
        panelNumber: 7,
        framing: "CU",
        angle: "Low angle",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Old Exide lead-acid scooter battery lower-left; robot wiper motor linkages lower-right.",
        initialPose: "Black ground alligator clip already clamped to negative lead terminal. Red clip hovering 5mm above positive.",
        action: "Arjun touches the red alligator clip to the positive terminal: a tiny spark snaps. Wiper motor linkages jerk forward 2 inches with a sudden, heavy mechanical clack, tilting the scrap lens head up 15 degrees.",
        screenDirection: "Clip snaps down left; motor linkages jerk right",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Sharp electrical snap-spark, loud heavy clack of meshing steel gears, motor hum",
        dialogue: "चल पड़ा!",
        dialogueSpeaker: "Arjun",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 6
      },
      {
        id: "it8",
        panelNumber: 8,
        framing: "MS",
        angle: "Eye-level",
        charactersInFrame: ["Arjun"],
        spatialBlocking: "Ozu Environmental Pillow: Wooden desk bathed in horizontal orange sunset; wire-mesh window frame-right.",
        initialPose: "Scrap robot sitting motionless on desk beside open Hindi ITI Machinist textbook and empty steel glass.",
        action: "Static non-narrative hold: horizontal sunset rays illuminate dust motes dancing over the robot's rusted iron chassis. The machine sits silent and patient in the fading daylight. Zero movement.",
        screenDirection: "Light pouring horizontally right-to-left",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Distant twilight temple bell, evening birds settling in banyan branches, quiet room hum",
        dialogueType: "silent",
        durationSeconds: 10
      }
    ]
  },
  cyberpunk_courier: {
    projectTitle: "Sector 9 Courier",
    aspectRatio: "16:9",
    flowReferenceMode: "ingredients",
    rawRealismMode: true,
    sceneBeat: "A wet subterranean service alley where data courier Elena meets broker Marcus under dripping pipes. Raw urban grit, zero cartoon bloom.",
    cast: [
      {
        id: "char_elena",
        name: "Elena",
        role: "lead",
        rawInput: "Elena, a 24-year-old tech-courier with angular jawline and short asymmetrical undercut",
        tag: "@CHAR_ELENA",
        archetypeTitle: "Subterranean Data Courier",
        ageGender: "24-year-old woman, athletic build, olive complexion",
        facialTopology: "Subtle cybernetic optical implant on left temple with faint teal diode, tired skin with rainwater sheen",
        skinTexture: "Realistic skin with fine water droplets, natural pores, visible fatigue under eyes.",
        microKinesics: "Hyper-vigilant, tense breathing, scanning overhead shadows with sharp head tilts.",
        wardrobeFabric: "Matte black synthetic techwear hooded shell jacket with wet reflective sheen, reinforced cargo pants",
        personalityVibe: "Guarded, highly alert, coiled energy"
      },
      {
        id: "char_marcus",
        name: "Marcus",
        role: "supporting",
        rawInput: "Marcus, a 48-year-old black-market data broker in a heavy rubberized coat",
        tag: "@CHAR_MARCUS",
        archetypeTitle: "Black-Market Data Broker",
        ageGender: "48-year-old man, heavy build, shaved head with scar tissue",
        facialTopology: "Heavy jowls, scarred left eyebrow, cold appraising gaze",
        skinTexture: "Weathered leathery skin, coarse stubble, natural imperfections.",
        microKinesics: "Still, immovable posture, hands tucked in coat pockets, slow deliberate head turns.",
        wardrobeFabric: "Heavy dark navy rubberized trench coat with reflective high-collar, wet nylon trousers",
        personalityVibe: "Calculating, emotionless, patient"
      }
    ],
    primaryCharacter: {
      name: "Elena",
      tag: "@CHAR_ELENA",
      ethnicityAge: "24-year-old tech-courier, angular jawline, short asymmetrical undercut",
      description: "Subtle cybernetic optical implant on left temple, tired skin with rainwater sheen",
      expression: "Hyper-vigilant, tense breathing, scanning overhead shadows"
    },
    secondaryCharacter: {
      name: "Marcus",
      tag: "@CHAR_MARCUS",
      ethnicityAge: "48-year-old man, data broker, heavy build",
      description: "Heavy trench coat, scarred brow, cold appraising eyes",
      relationship: "Fixer / contact"
    },
    wardrobeLock: {
      tag: "@WARDROBE_RAIN_SUIT",
      garments: "Matte black synthetic techwear hooded shell jacket with wet reflective sheen, reinforced cargo pants",
      accessories: "Fingerless high-grip gloves, heavy combat boots, encrypted sling pouch",
      rule: "Preserve wet raindrops on fabric surface across all frames. No costume alterations."
    },
    locationLock: {
      tag: "@LOC_SUB_ALLEY",
      geography: "Narrow concrete service corridor between mega-structures, leaking conduits overhead, steam vents on ground",
      lightingKeys: "Backlit neon cyan and magenta from shop signage; wet asphalt mirror reflections",
      colorPalette: "Deep obsidian shadows, electric cyan highlights, vibrant neon pink edge light"
    },
    opticsAndAesthetics: {
      lensFamily: "Cooke Anamorphic /i Full Frame Plus 50mm, horizontal blue anamorphic streaks",
      grading: "High contrast cinematic cyberpunk, deep blacks, natural shadow falloff"
    },
    panels: [
      {
        id: "c1",
        panelNumber: 1,
        framing: "WS",
        angle: "High angle",
        charactersInFrame: ["Elena"],
        spatialBlocking: "16:9 widescreen: Elena crouched lower-left third; wet alley extending back right.",
        initialPose: "Elena is crouched beneath smoking exhaust grate frame-center.",
        action: "Elena stays crouched, head tilting upward slowly to check overhead catwalks. Rain streams down jacket.",
        screenDirection: "Facing forward-right",
        cameraMovement: "Slow Pull-Out",
        audioAmbience: "Constant heavy rain drumming on metal, low sub-bass industrial hum, distant sirens",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "c2",
        panelNumber: 2,
        framing: "CU",
        angle: "Eye-level",
        charactersInFrame: ["Elena"],
        spatialBlocking: "Elena's gloved hands holding drive centered in lower third.",
        initialPose: "Gloved hands already cupping glowing amber drive in lower third.",
        action: "Fingers turn the drive 45 degrees. Water droplets roll off the glass casing. Drive light pulses gently.",
        screenDirection: "Hands centered",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Subtle electronic high-pitch initialization whine, heavy rainfall",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "c3",
        panelNumber: 3,
        framing: "MS",
        angle: "Eye-level",
        charactersInFrame: ["Elena", "Marcus"],
        spatialBlocking: "16:9 Two-Shot: Elena positioned screen-left in defensive crouch; Marcus standing screen-right under leaking conduit.",
        initialPose: "Elena looks up toward Marcus; Marcus stands with hands in deep coat pockets.",
        action: "Marcus gestures with a subtle chin nod toward the alley exit. Elena slides the drive into her chest harness. Both maintain vigilant silence.",
        screenDirection: "Elena screen-left looking right; Marcus screen-right looking left",
        cameraMovement: "Subtle Handheld Breathing",
        audioAmbience: "Sudden drone rotor whine overhead, splashing puddle footsteps",
        dialogue: "They tracked the signal.",
        dialogueSpeaker: "Elena",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      }
    ]
  },
  mumbai_model_honeytrap_noir: {
    projectTitle: "The Model's Gambit: Mumbai Noir",
    aspectRatio: "16:9",
    flowReferenceMode: "ingredients",
    rawRealismMode: true,
    sceneBeat: "A naive small-town girl enters Mumbai's predatory modeling industry, gets entangled in exploitative casting traps, orchestrates a high-stakes honeytrap against a real-estate tycoon, amasses sudden luxury, makes a fatal greedy hubris blunder, and finds the syndicate's trap snapping shut around her.",
    cast: [
      {
        id: "char_tara_model",
        name: "Tara",
        role: "lead",
        rawInput: "Tara, a 21-year-old aspiring model from small-town India, high cheekbones, anxious lip-biting that transforms into cold guarded calculating stare, natural wheatish complexion with real pores",
        tag: "@CHAR_TARA",
        archetypeTitle: "Aspiring Model turned Honeytrap Operative",
        ageGender: "21-year-old South Asian woman, slender build, wheatish complexion",
        facialTopology: "Delicate angular jawline, sharp dark eyes that shift from nervous small-town vulnerability to cold hyper-vigilance, faint humidity sheen on forehead.",
        skinTexture: "Natural visible pores, faint dark circles under eyes concealed with matte powder, zero plastic doll airbrushing.",
        microKinesics: "Habitual ring twisting when anxious, transitions into rigid spine posture, slow unblinking stare when cornered.",
        wardrobeFabric: "Early: faded cotton printed kurti, chipped sandals. Peak: tailored backless black raw silk slip dress, delicate gold chain. Fall: rumpled silk, smeared mascara.",
        personalityVibe: "Ambitious desperation hardened into reckless survivalism."
      },
      {
        id: "char_vikram_tycoon",
        name: "Vikram",
        role: "counterpart",
        rawInput: "Vikram Singhania, a 49-year-old influential South Mumbai real-estate magnate with ruthless cartel connections, bespoke pinstripe linen shirt, gold Patek watch",
        tag: "@CHAR_VIKRAM",
        archetypeTitle: "Bespoke Predatory Real-Estate Tycoon",
        ageGender: "49-year-old South Asian man, solid imposing build, salt-and-pepper slicked hair",
        facialTopology: "Heavy jowls, observant hooded dark eyes, sharp groomed stubble, deceptively calm smile masking predatory cruelty.",
        skinTexture: "Aged textured skin with deep forehead creases, subtle sunspots, natural weathered pores.",
        microKinesics: "Slow deliberate hand gestures, fingers tapping heavy crystal whiskey tumbler, never raises his voice.",
        wardrobeFabric: "Bespoke tailored white linen shirt, pinstripe navy trousers, 18k gold Patek Philippe timepiece.",
        personalityVibe: "Absolute power, polite menace, untouchable wealth."
      },
      {
        id: "char_deepak_fixer",
        name: "Deepak",
        role: "supporting",
        rawInput: "Deepak 'Sandy' Mehra, a 34-year-old shady Lokhandwala casting agent and honeytrap broker, loud printed silk shirt, multiple iPhones, greasy pomade hair",
        tag: "@CHAR_DEEPAK",
        archetypeTitle: "Shady Casting Agent & Honeytrap Handler",
        ageGender: "34-year-old South Asian man, gaunt build, dusky complexion",
        facialTopology: "Shifty eyes, sweat along sideburns, thin groomed pencil mustache, oily forehead sheen under fluorescent light.",
        skinTexture: "Uneven textured skin with acne scarring, realistic pores, humid sheen.",
        microKinesics: "Constantly checking two vibrating smartphones simultaneously, fast-talking hand gestures, restless shifting on heels.",
        wardrobeFabric: "Loud floral printed viscose shirt open at the collar, worn faux-leather loafers, gold-plated chain.",
        personalityVibe: "Opportunistic hustler, slippery mediator."
      }
    ],
    primaryCharacter: {
      name: "Tara",
      tag: "@CHAR_TARA",
      ethnicityAge: "21-year-old South Asian woman, slender build, wheatish complexion",
      description: "Angular jawline, sharp dark eyes, natural skin texture, transitioning from naive to calculating",
      expression: "Cold guarded determination"
    },
    secondaryCharacter: {
      name: "Vikram",
      tag: "@CHAR_VIKRAM",
      ethnicityAge: "49-year-old South Asian man, imposing build, salt-and-pepper hair",
      description: "Heavy jowls, hooded eyes, bespoke linen shirt, deceptive calm",
      relationship: "Predatory tycoon and honeytrap target"
    },
    wardrobeLock: {
      tag: "@WARDROBE_MUMBAI_NOIR",
      garments: "Tara wears a tailored backless black raw silk dress; Vikram in bespoke white linen; Deepak in loud floral viscose shirt",
      accessories: "Tara's gold clutch and covert smartphone; Vikram's gold Patek Philippe watch; Deepak's twin phones",
      rule: "Maintain gritty fabric textures and natural Mumbai humidity sheen. Zero Bollywood plastic gloss."
    },
    locationLock: {
      tag: "@LOC_MUMBAI_WORLI_CORRIDOR",
      geography: "Versova budget audition tenement stairs, private Juhu nightclub VIP booth, 42nd-floor Worli sea-facing glass penthouse",
      lightingKeys: "Dingy green-cyan fluorescent tubes in audition hallway; amber-gold tungsten low-key in VIP lounge; moody cobalt sea-dusk light through penthouse glass",
      colorPalette: "Moody cobalt teal, oxidized gold, sodium-vapor yellow, deep black travertine, crisp RBI banknote magenta"
    },
    opticsAndAesthetics: {
      lensFamily: "Cooke Anamorphic /i Special Edition 40mm & 75mm, subtle barrel distortion, oval bokeh, rich skin tone contrast",
      grading: "Fincher-style low-key neo-noir, deep ink blacks, desaturated highlights with rich gold skin reflections"
    },
    panels: [
      {
        id: "mn1",
        panelNumber: 1,
        framing: "MCU",
        angle: "Eye-level",
        charactersInFrame: ["Tara"],
        spatialBlocking: "Versova casting staircase: narrow corridor frame-left; Tara standing against peeling green plaster wall frame-center.",
        initialPose: "Tara clutches a worn plastic folder containing printed 8x10 modeling composite cards against her chest; forehead has fine humidity perspiration.",
        action: "Tara shifts her weight on cheap chipped wedges. A flickering fluorescent tube overhead hums; other exhausted aspiring models wait silently on plastic chairs in soft background blur.",
        screenDirection: "Profile facing frame-right toward casting room door",
        cameraMovement: "Subtle Handheld Breathing",
        audioAmbience: "Distant Mumbai traffic honking, loud ceiling fan clatter, fluorescent ballast hum, muffled director shouting inside",
        dialogue: "तीसरा ऑडिशन... जेब में सिर्फ दो सौ रुपये बचे हैं।",
        dialogueSpeaker: "Tara",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      },
      {
        id: "mn2",
        panelNumber: 2,
        framing: "MS",
        angle: "Low angle",
        charactersInFrame: ["Tara", "Vikram", "Deepak"],
        spatialBlocking: "Private Juhu VIP lounge booth: Vikram seated center; Deepak leaning in from frame-left; Tara positioned screen-right.",
        initialPose: "Vikram rests forearm on black marble table beside a crystal whiskey tumbler. Deepak leans forward with an oily smile. Tara sits with rigid, upright posture.",
        action: "Deepak gestures with open palm toward Tara, introducing her with practiced flattery. Vikram tilts his head, slowly sizing her up with calm appraisal. Tara forces a stiff, polite smile; her hands grip her clutch beneath the table.",
        screenDirection: "Deepak screen-left looking right; Vikram center; Tara screen-right looking center",
        cameraMovement: "Slow Push-In (Dolly)",
        audioAmbience: "Deep lounge bass rumble, muffled laughter, clink of heavy crystal ice cubes",
        dialogue: "सर, ये तारा है। नए चेहरे ढूंढ रहे थे न आप अपनी रियल एस्टेट कैंपेन के लिए?",
        dialogueSpeaker: "Deepak",
        dialogueType: "spoken_dialogue",
        durationSeconds: 9
      },
      {
        id: "mn3",
        panelNumber: 3,
        framing: "CU",
        angle: "Eye-level",
        charactersInFrame: ["Tara"],
        spatialBlocking: "Restroom mirror reflection: Tara's face fills center two-thirds; gold bathroom sconces in soft falloff.",
        initialPose: "Tara stands before the illuminated mirror, holding a slim secondary burner smartphone in her left hand.",
        action: "Tara checks the screen of the secondary phone: the red audio recording waveform is actively pulsing. She looks up into her own eyes in the mirror; the nervous small-town hesitation hardens into cold resolve.",
        screenDirection: "Frontal mirror gaze center",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Quiet bathroom ventilation hum, faint water drip from brass tap, heavy intake of breath",
        dialogue: "अगर खेल यही है... तो नियम मैं तय करूंगी।",
        dialogueSpeaker: "Tara",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 7
      },
      {
        id: "mn4",
        panelNumber: 4,
        framing: "ECU",
        angle: "High angle",
        charactersInFrame: ["Tara", "Vikram"],
        spatialBlocking: "Top-down macro isolation: Polished black Italian marble tabletop; frosted silver ice bucket upper-left; document center; phone lower-right.",
        initialPose: "Vikram's gold Montblanc pen nib already resting on signature line of private settlement agreement. Tara's matte-black smartphone sits flat behind ice bucket.",
        action: "Vikram's manicured hand signs the confidential document with bold strokes. The smartphone lens peeking beside the frosted ice bucket captures the document in sharp optical focus. Zero floating spy gadgets; physically grounded on table.",
        screenDirection: "Pen moves left-to-right; phone lens locked stationary",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Scratch of gold fountain pen nib on textured parchment, wet ice cracking in bucket, quiet room tone",
        dialogueType: "silent",
        durationSeconds: 6
      },
      {
        id: "mn5",
        panelNumber: 5,
        framing: "WS",
        angle: "Eye-level",
        charactersInFrame: ["Tara"],
        spatialBlocking: "16:9 Widescreen: 42nd-floor Worli penthouse terrace. Tara in backless silk dress standing on teak deck right-third; Mumbai skyline and Sea Link glowing left.",
        initialPose: "Tara stands holding a stemmed wine glass, staring out at the expansive night city lights. On the teak table beside her rests a designer handbag stuffed with crisp currency bundles.",
        action: "Tara takes a slow, solitary sip. The sea breeze catches the hem of her black silk dress. She smiles faintly, tasting total financial autonomy for the first time. Cold luxury stillness.",
        screenDirection: "Tara looking out over city left-to-right",
        cameraMovement: "Slow Pull-Out",
        audioAmbience: "Muffled roar of Mumbai coastal traffic 400 feet below, distant sea breeze howling against glass railing, crystal chime",
        dialogue: "सब कुछ मुमकिन है... बस कीमत पता होनी चाहिए।",
        dialogueSpeaker: "Tara",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 10
      },
      {
        id: "mn6",
        panelNumber: 6,
        framing: "MCU",
        angle: "Low angle",
        charactersInFrame: ["Tara"],
        spatialBlocking: "Interior luxury Mercedes Maybach rear cabin: Tara seated screen-left; tinted window reflection passing city neon screen-right.",
        initialPose: "Tara is holding her gold iPhone; screen shows 6 missed calls from Deepak flashing 'URGENT: DONT CROSS SINGHANIA'.",
        action: "Intoxicated by reckless hubris, Tara swipes away Deepak's warning without answering. She taps voice record and speaks with cold arrogance, demanding an additional five crores or the video goes to federal regulators.",
        screenDirection: "Profile looking screen-right into phone mic",
        cameraMovement: "Subtle Handheld Breathing",
        audioAmbience: "Subdued hum of V8 engine on Bandra-Worli Sea Link, rhythmic thud of expansion joints, phone beep",
        dialogue: "विक्रम को बोलो... पांच करोड़ और लगेंगे। वरना फाइल सीधे दिल्ली जाएगी।",
        dialogueSpeaker: "Tara",
        dialogueType: "spoken_dialogue",
        durationSeconds: 8
      },
      {
        id: "mn7",
        panelNumber: 7,
        framing: "MS",
        angle: "Eye-level",
        charactersInFrame: ["Tara"],
        spatialBlocking: "Private penthouse elevator vestibule: Elevator door open behind Tara; dark corridor ahead; two dark suited silhouettes standing motionless in doorway.",
        initialPose: "Tara steps out of the elevator holding her designer handbag; the corridor lights are unexpectedly off.",
        action: "Tara halts mid-step. Two suited men step forward into the dim elevator spill light, cutting off both exits. Tara's phone buzzes abruptly in her palm with a bank SMS alert: 'ALL ACCOUNTS SEIZED BY ENFORCEMENT ORDER'. Her handbag slips from her numb fingers, hitting the floor.",
        screenDirection: "Tara facing forward toward shadows; men blocking background",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Heavy elevator chime, sharp slap of leather bag hitting marble, phone vibration buzzing on stone",
        dialogue: "नहीं... ये कैसे...",
        dialogueSpeaker: "Tara",
        dialogueType: "voiceover_inner_thought",
        durationSeconds: 8
      },
      {
        id: "mn8",
        panelNumber: 8,
        framing: "CU",
        angle: "High angle",
        charactersInFrame: ["Tara", "Vikram"],
        spatialBlocking: "Interrogation suite: Tara seated in solitary wooden chair frame-left; Vikram seated in plush armchair frame-right.",
        initialPose: "Tara's mascara is smeared down her cheek; cold sweat glistens on her neck. Vikram holds Tara's secondary burner phone in his palm.",
        action: "Vikram presses play on Tara's phone. Her own voice memo plays back tinny and hollow through the speaker. Vikram looks at her with calm, unblinking paternal disappointment. Tara's hands tremble in her lap.",
        screenDirection: "Vikram screen-right looking down at Tara; Tara screen-left looking down in defeat",
        cameraMovement: "Slow Push-In (Dolly)",
        audioAmbience: "Tinny playback of Tara's extortion voice memo, rain drumming against hotel window, clock ticking",
        dialogue: "तू बच्ची है तारा... ये शहर हमने बनाया है।",
        dialogueSpeaker: "Vikram",
        dialogueType: "spoken_dialogue",
        durationSeconds: 9
      },
      {
        id: "mn9",
        panelNumber: 9,
        framing: "WS",
        angle: "Eye-level",
        charactersInFrame: ["Tara"],
        spatialBlocking: "Ozu Environmental Pillow Hold: 42nd-floor penthouse living room at 3 AM. Massive glass window frame-left overlooking dark stormy Arabian Sea.",
        initialPose: "Room is deserted except for an overturned champagne glass and scattered papers on the marble floor. Red and blue police beacon reflections wash rhythmically across the wet window glass.",
        action: "Static non-narrative hold: Wind-driven rain lashes against the double-pane glass. The scattered cash and broken glass sit abandoned in the cold luxury room. No human actors. The silent aftermath of reckless ambition.",
        screenDirection: "Rain streaming diagonal left-to-right; light pulses across ceiling",
        cameraMovement: "Static / Locked Tripod",
        audioAmbience: "Violent rainstorm drumming against glass, muffled police sirens in distance, low wind rumble",
        dialogueType: "silent",
        durationSeconds: 10
      }
    ]
  }
};

/**
 * Detects real-world physical plausibility rules for manual dexterity, heat, and rigging
 */
export function detectPhysicalSafetyDirectives(action: string): string[] {
  const directives: string[] = [];
  const lower = action.toLowerCase();

  // 1. Thermal contact & hot metal protection rule (The Tea Handi Law)
  if (
    lower.includes("tea") ||
    lower.includes("chai") ||
    lower.includes("boiling") ||
    lower.includes("handi") ||
    lower.includes("vessel") ||
    lower.includes("pot") ||
    lower.includes("stove") ||
    lower.includes("kettle") ||
    lower.includes("burner") ||
    lower.includes("skillet") ||
    lower.includes("pan")
  ) {
    directives.push(
      "THERMAL PROTECTION CONTRACT: The subject grips, lifts, and rotates boiling metal vessels exclusively using a folded, coarse cotton kitchen cloth (kapda) or tongs. Bare fingers NEVER make direct contact with scalding metal. Hands are completely insulated from heat."
    );
  }

  // 2. Heavy suspended load & rigging leverage rule (The Coconut Harvest Law)
  if (
    lower.includes("coconut") ||
    lower.includes("harvest") ||
    lower.includes("lowering") ||
    lower.includes("rope") ||
    lower.includes("bunch") ||
    lower.includes("rigging") ||
    lower.includes("coir")
  ) {
    directives.push(
      "MECHANICAL RIGGING & LEVERAGE CONTRACT: Heavy suspended loads (e.g. 10-12 coconut bunches, 15+ kg) MUST be secured and lowered via tensioned coir rope friction over a sturdy frond fork. ZERO telekinetic floating, and ZERO uncontrolled ground shattering. Calloused hands pay out rope tension rhythmically for a soft, cushioned ground arrival."
    );
  }

  // 3. Curved blade & cutting clearance rule (The Koitha Law)
  if (
    lower.includes("sickle") ||
    lower.includes("koitha") ||
    lower.includes("blade") ||
    lower.includes("knife") ||
    lower.includes("slice") ||
    lower.includes("cutting")
  ) {
    directives.push(
      "BLADE DEXTERITY & SAFETY CONTRACT: The cutting hand applies firm shearing force using the curved iron blade; the non-cutting stabilizing hand remains firmly anchored clear of the cutting line. Do not generate intersecting or floating blades."
    );
  }

  // 4. Close-Up Decomposition Law
  if (
    (lower.includes("climb") || lower.includes("tree") || lower.includes("sprint") || lower.includes("running")) &&
    (lower.includes("cut") || lower.includes("grab") || lower.includes("tie"))
  ) {
    directives.push(
      "CLOSE-UP DECOMPOSITION LAW: Complex manual dexterity is framed in a dedicated macro close-up (hands, rope tension, shoe traction) rather than cluttered into an unreadable wide shot."
    );
  }

  // 5. Water & Electrical Hazard Separation (The Washbasin / Tap Isolation Law)
  if (
    lower.includes("wash") ||
    lower.includes("basin") ||
    lower.includes("sink") ||
    lower.includes("tap") ||
    lower.includes("soap") ||
    lower.includes("splash") ||
    lower.includes("water on face")
  ) {
    directives.push(
      "WATER & ELECTRICAL ISOLATION CONTRACT: When washing hands, face, or tools, the camera frames exclusively the water stream, soap lather, and sink basin in an isolated shallow-depth macro close-up (f/1.4). Strictly PROHIBITED: exposed electrical wiring, electric motors, batteries, or live circuits anywhere in this frame. Water plumbing is quarantined completely from electrical workbenches to prevent surreal environmental hallucinations."
    );
  }

  // 6. Soldering Iron & Rosin Core Safety (The Insulated Grip Law)
  if (
    lower.includes("solder") ||
    lower.includes("soldering") ||
    lower.includes("flux") ||
    lower.includes("circuit") ||
    lower.includes("breadboard")
  ) {
    directives.push(
      "SOLDERING ERGONOMICS & THERMAL CONTRACT: Fingers hold exclusively the heat-resistant insulated plastic/bakelite grip of the soldering pencil. Bare skin NEVER contacts the stainless steel heating barrel. Thin blue rosin flux smoke curls upward naturally into ambient light."
    );
  }

  // 7. Mechanical DIY Robot & Scrap Wall-E Law (Anti-CGI Pixar Bloom)
  if (
    lower.includes("robot") ||
    lower.includes("wall-e") ||
    lower.includes("chhotu") ||
    lower.includes("wiper motor") ||
    lower.includes("scrap chassis")
  ) {
    directives.push(
      "SCRAP ROBOT REALISM CONTRACT: The robot is an authentic mechanical assemblage of salvage scrap: hand-welded 1.5mm galvanized iron, visible pop rivets, pitted grease patina, repurposed bicycle chain drive, and twin mismatched camera lens optics. Strictly ZERO Pixar 3D gloss, ZERO animated neon bloom, and ZERO magical levitation. Heavy grounded mechanical physics only."
    );
  }

  // 8. Covert Surveillance & Phone Micro-Recorder Placement Contract
  if (
    lower.includes("covert") ||
    lower.includes("record") ||
    lower.includes("recording") ||
    lower.includes("spy") ||
    lower.includes("honeytrap") ||
    lower.includes("hidden phone") ||
    lower.includes("burner")
  ) {
    directives.push(
      "COVERT SURVEILLANCE GROUNDING CONTRACT: Covert recording smartphones or micro-lenses must rest flat on solid horizontal surfaces (tabletop marble, behind an ice bucket or napkin holder). Camera lens orientation is fixed and physically grounded with genuine optical depth-of-field. Zero magical floating cameras, zero impossible X-ray perspectives."
    );
  }

  // 9. Financial Ledgers, Fountain Pens & Currency Plausibility Contract
  if (
    lower.includes("banknote") ||
    lower.includes("cash") ||
    lower.includes("bundles") ||
    lower.includes("sign") ||
    lower.includes("signing") ||
    lower.includes("document") ||
    lower.includes("extortion") ||
    lower.includes("fountain pen")
  ) {
    directives.push(
      "FINANCIAL LEDGER & TRANSACTION CONTRACT: Fountain pens make physical nib contact with textured paper grain, with genuine ink capillary absorption. Currency stacks display authentic paper band wraps with RBI / bank seal stamps resting under gravity on furniture. Strictly ZERO floating money, zero surreal distorted denominations, and zero magical glowing contracts."
    );
  }

  return directives;
}

export interface CinematicShotSpec {
  opticsProfile: string;
  cameraMountSpecs: string;
  depthPlanes: {
    z0Foreground: string;
    z1SubjectFocalPlane: string;
    z2BackgroundFalloff: string;
  };
  spatialFramingGuide: string;
  lightingKey: string;
}

/**
 * Derives rigorous 3D depth planes, optical focal geometry, and camera mount specifications
 */
export function deriveCinematicCompositionPlanes(
  panel: StoryboardPanel,
  aspectRatio: string,
  locationLock?: { lightingKeys?: string; geography?: string },
  optics?: { lensFamily?: string }
): CinematicShotSpec {
  let opticsProfile = "";
  switch (panel.framing) {
    case "ECU":
      opticsProfile = "100mm Macro Cine Prime (T2.8) • Shallow Depth of Field (f/1.4 - f/2.0) • Razor-thin focal plane with rapid optical falloff";
      break;
    case "CU":
      opticsProfile = "85mm Portrait Cine Prime (T1.5) • Intimate facial landscape • Background compressed into creamy optical bokeh";
      break;
    case "MCU":
      opticsProfile = "50mm Normal Cine Prime (T1.4) • Natural human eye perspective • True-to-life facial proportions";
      break;
    case "MS":
      opticsProfile = "35mm Storyteller Prime (T1.8) • Balanced environmental relationship • Depth-staged spatial perspective";
      break;
    case "WS":
      opticsProfile = "24mm-28mm Anamorphic Prime (T2.0) • Deep horizontal expanse • Clean rectilinear geometry";
      break;
    case "OTS":
      opticsProfile = "50mm Over-the-Shoulder Prime (T1.8) • Soft foreground shoulder bokeh (Z0) with pin-sharp eyeline focus (Z1)";
      break;
    case "POV":
      opticsProfile = "28mm Subjective Eye Prime (T2.0) • First-person field of view • Natural eye-level horizon";
      break;
    default:
      opticsProfile = optics?.lensFamily || "50mm Standard Prime (T1.4)";
  }

  let cameraMountSpecs = "";
  switch (panel.cameraMovement) {
    case "Static / Locked Tripod":
      cameraMountSpecs = "O'Connor 2575 Fluid Head on Mitchell Wooden Sticks • Zero operator drift • Absolute mechanical lock-off";
      break;
    case "Subtle Handheld Breathing":
      cameraMountSpecs = "Arri Alexa Mini LF on EasyRig Vario 5 • Natural human respiratory rhythm • Micro weight-bearing inertia";
      break;
    case "Slow Push-In (Dolly)":
      cameraMountSpecs = "Chapman Peewee Dolly on Precision Ground Steel Rails • Constant 2mm/sec creeping push-in on optical axis";
      break;
    case "Slow Pull-Out":
      cameraMountSpecs = "Precision Track Dolly • Smooth creeping deceleration backward, revealing environmental depth";
      break;
    case "Tracking Pan":
      cameraMountSpecs = "Cartoni Dutch Fluid Head • Calibrated horizontal panning arc locked to subject velocity";
      break;
    case "Whip Pan":
      cameraMountSpecs = "High-velocity snap pan with optical directional motion-blur • Instant kinetic cut transition";
      break;
    case "Pedestal Up/Down":
      cameraMountSpecs = "Hydraulic Pedestal Column • Pure vertical elevation shift with fixed optical tilt axis";
      break;
    case "Slow Tilt-Up":
    case "Slow Tilt-Down":
      cameraMountSpecs = "Geared Cine Head • Smooth mechanical handwheel tilt across vertical canvas";
      break;
    default:
      cameraMountSpecs = "Tripod Mount with calibrated fluid damping";
  }

  const isVertical = aspectRatio === "9:16";
  let z0 = "";
  let z1 = "";
  let z2 = "";

  if (panel.spatialBlocking && panel.spatialBlocking.trim().length > 0) {
    z1 = panel.spatialBlocking;
  } else {
    z1 = isVertical
      ? "Subject anchored in vertical lower-to-mid thirds; balanced head clearance."
      : "Subject balanced across Rule-of-Thirds horizontal power points; comfortable eye-room.";
  }

  if (panel.framing === "ECU" || panel.framing === "CU") {
    z0 = "Direct optical interface: Foreground edges blur into soft bokeh; zero obstruction between lens and tactile contact point.";
    z2 = "Deep optical falloff: Background architectural surfaces and props dissolve into smooth ambient defocus and ambient shadow.";
  } else if (panel.framing === "OTS") {
    z0 = "Foreground shoulder and nape of secondary actor in soft out-of-focus silhouette (Screen-Left / Screen-Right edge).";
    z2 = "Environmental mid-to-deep background with ambient practical room tone.";
  } else if (panel.framing === "WS") {
    z0 = "Clean architectural framing / natural ground plane extending forward toward camera lens.";
    z2 = "Deep space vanishing point: Fully articulated environmental horizon, architectural geometry, and natural depth perspective.";
  } else {
    z0 = "Natural environmental atmosphere: Soft foreground falloff, zero intrusive foreground clutter.";
    z2 = "Architectural background: Softly defocused environmental textures, windows, and practical fixtures in natural low-key contrast.";
  }

  const lightingKey = locationLock?.lightingKeys || "Natural motivated practical lighting with soft directional key and organic ambient shadow fill.";

  return {
    opticsProfile,
    cameraMountSpecs,
    depthPlanes: {
      z0Foreground: z0,
      z1SubjectFocalPlane: z1,
      z2BackgroundFalloff: z2,
    },
    spatialFramingGuide: `${panel.framing} (${panel.angle}) — ${isVertical ? "Vertical Depth Canvas" : "Widescreen Cinema Canvas"}`,
    lightingKey
  };
}

export interface CompilerSettings {
  nsfwMode: boolean; // false = PG-13 commercial safety compliance; true = Raw uncensored gritty R-rated indie
  negativeGuardrails: boolean; // Auto-inject anti-CGI, anti-plastic, anti-glow negative tokens
  compactMode?: boolean;
  platformSyntax?: "google_flow" | "runway_gen4" | "kling" | "midjourney";
}

export const DEFAULT_COMPILER_SETTINGS: CompilerSettings = {
  nsfwMode: false,
  negativeGuardrails: true,
  compactMode: false,
  platformSyntax: "google_flow"
};

/**
 * Compiles a Master Continuity Storyboard Prompt with Named Multi-Character Staging & Physical Rules
 */
export function compileStoryboardPrompt(
  data: ProductionContinuity,
  settings: CompilerSettings = DEFAULT_COMPILER_SETTINGS
): string {
  // Build Aspect-Ratio Composition Staging Directive
  const aspectDirective =
    data.aspectRatio === "16:9" || data.aspectRatio === "2.39:1"
      ? `• WIDESCREEN STAGING DIRECTIVE (${data.aspectRatio}):
  - Stage characters across horizontal cinematic thirds. Maintain crisp spatial separation between subjects.
  - In two-shots and three-shots, lock characters to distinct vertical axes (e.g., Screen-Left vs Screen-Right) with clear, motivated sightlines.
  - Avoid center-crowding: give subjects room to breathe within the widescreen canvas.`
      : data.aspectRatio === "9:16"
      ? `• VERTICAL COMPOSITION DIRECTIVE (9:16 Mobile Cinematic):
  - Stage characters using vertical depth planes. Frame the primary subject in intimate foreground (ECU/MCU); stack secondary subjects in vertical background depth (doorway, corridor).
  - Avoid side-by-side horizontal clustering which creates awkward shoulder clipping in vertical 9:16.`
      : `• CLASSICAL FRAMING DIRECTIVE (${data.aspectRatio}):
  - Frame with balanced classical weight, maintaining distinct spatial anchors for each named character.`;

  // Build Cast Continuity Roster
  const castList = (data.cast && data.cast.length > 0) ? data.cast : [
    {
      id: "c1",
      name: data.primaryCharacter.name || "Protagonist",
      role: "lead" as const,
      rawInput: data.primaryCharacter.description,
      tag: data.primaryCharacter.tag,
      archetypeTitle: "Lead Character",
      ageGender: data.primaryCharacter.ethnicityAge,
      facialTopology: data.primaryCharacter.description,
      skinTexture: "Natural human skin with pores, zero plastic airbrushing",
      microKinesics: "Authentic physical posture",
      wardrobeFabric: data.wardrobeLock.garments,
      personalityVibe: data.primaryCharacter.expression
    }
  ];

  const castRosterText = castList.map((c, idx) => {
    return `  - Cast Member ${idx + 1} [${c.role.toUpperCase()}]: ${c.name.toUpperCase()} (${c.tag})
    • Demographic: ${c.ageGender}
    • Facial Topology & Identity: ${c.facialTopology}
    • Skin Realism: ${c.skinTexture}
    • Kinesics & Posture: ${c.microKinesics}
    • Wardrobe Lock: ${c.wardrobeFabric}
    • Resting Vibe: ${c.personalityVibe}`;
  }).join("\n\n");

  const panelTexts = data.panels.map((p) => {
    const shotSpec = deriveCinematicCompositionPlanes(p, data.aspectRatio, data.locationLock, data.opticsAndAesthetics);
    const activeChars = p.charactersInFrame && p.charactersInFrame.length > 0
      ? p.charactersInFrame.join(" & ")
      : (castList[0]?.name || "Lead");
    
    const shotTypeDesc = (p.charactersInFrame?.length || 1) === 1
      ? `SOLO SHOT: ${activeChars}`
      : (p.charactersInFrame?.length === 2 ? `TWO-SHOT: ${activeChars}` : `THREE-SHOT: ${activeChars}`);

    const speakerInfo = p.dialogueSpeaker ? ` [Speaker: ${p.dialogueSpeaker}]` : "";
    const dialogueLine = p.dialogue ? `\n   - Dialogue / Thought (${p.dialogueType === "voiceover_inner_thought" ? "VOICEOVER / INNER THOUGHT" : "SPOKEN"}${speakerInfo}): "${p.dialogue}"` : "";
    const poseLine = p.initialPose ? `\n   - Physical Baseline (T=0): ${p.initialPose}` : "";

    const physicalDirectives = detectPhysicalSafetyDirectives(p.action);
    const physicalSection = physicalDirectives.length > 0
      ? `\n   - Physical Plausibility Safety Contracts: ${physicalDirectives.join(" | ")}`
      : "";

    return `PANEL ${p.panelNumber} // CINEMATIC SHOT FOOTAGE SPECIFICATION
   - Slate & Staging: ${shotSpec.spatialFramingGuide} • ${shotTypeDesc} • Duration: ${p.durationSeconds}s
   - Optics & Rig: ${shotSpec.opticsProfile} | ${shotSpec.cameraMountSpecs}
   - 3D Depth Layers:
     • [Z0 Foreground]: ${shotSpec.depthPlanes.z0Foreground}
     • [Z1 Focal Plane]: ${shotSpec.depthPlanes.z1SubjectFocalPlane}
     • [Z2 Deep Background]: ${shotSpec.depthPlanes.z2BackgroundFalloff}
   - Composition & Action: ${p.action}${poseLine}
   - 180° Screen Direction & Eyeline: ${p.screenDirection}
   - Photometric Lighting: ${shotSpec.lightingKey}${dialogueLine}${physicalSection}`;
  }).join("\n\n");

  const realismDirectives = data.rawRealismMode
    ? `\n• RAW CINÉMA VÉRITÉ & DEPTH PLANE DIRECTIVES:
  - FOCAL PLANE (MIDGROUND): The human subjects are the sole focus of light and optical sharpness.
  - BACKGROUND PLANE (OPTICAL FALLOFF): All background objects (furniture, tin sheets, scrap, tools) remain in deep optical defocus and ambient shadow.
  - ANTI-PROP-MAGNET CONSTRAINT: DO NOT illuminate, spotlight, add artificial rim-glow, or center background furniture/props. Background props exist strictly as unobtrusive environmental texture.
  - ZERO CGI ARTIFACTS: Zero digital gloss, zero airbrushing, zero plastic skin smoothing, zero fake volumetric glow. Authentic human skin with natural pores, subtle morning puffiness, and lifelike physical weight.`
    : "";

  return `[FILMMAKER STORYBOARD PRODUCTION DIRECTIVE]
TARGET FORMAT: ${data.panels.length}-Panel Sequential Master Storyboard
ASPECT RATIO: ${data.aspectRatio}
SCENE LOGLINE: ${data.sceneBeat}

═══════════════════════════════════════════════════════════
CONTINUITY CAST ROSTER (MAX 3 NAMED CHARACTERS — DO NOT ALTER)
═══════════════════════════════════════════════════════════
${castRosterText}

• CAST CONTINUITY CONTRACT:
  - Maintain exact facial topology, bone structure, hairstyle, skin tone and body proportions for ${castList.map((c) => c.name).join(", ")} across ALL panels.
  - Zero character identity swapping: do not cross-pollinate clothing or facial features between characters.

═══════════════════════════════════════════════════════════
ASPECT RATIO & SPATIAL GEOMETRY
═══════════════════════════════════════════════════════════
${aspectDirective}

• ENVIRONMENT & LIGHTING:
  - Environment Asset: ${data.locationLock.tag}
  - Spatial Geography: ${data.locationLock.geography}
  - Lighting Setup: ${data.locationLock.lightingKeys}
  - Color Palette: ${data.locationLock.colorPalette}
  - RULE: Fixed spatial axes and 180° line. No arbitrary repositioning of doors, windows, or light sources.${realismDirectives}

• OPTICS & CINEMATOGRAPHY:
  - Lens Package: ${data.opticsAndAesthetics.lensFamily}
  - Emulsion / Look: ${data.opticsAndAesthetics.grading}

═══════════════════════════════════════════════════════════
PANEL BREAKDOWN (INDIVIDUAL SHOT COMPOSITIONS)
═══════════════════════════════════════════════════════════
${panelTexts}

═══════════════════════════════════════════════════════════
STRICT AI PRODUCTION CONSTRAINTS
═══════════════════════════════════════════════════════════
1. Maintain exact character likeness and wardrobe consistency for each named character between panels 1 through ${data.panels.length}.
2. Zero mid-scene clothing shifts. No costume fusion.
3. Physical Action Integrity: Each panel depicts an explicit, frozen posture. Do not contradict spatial physics across panels.
4. Keep the environmental light direction and room layout identical across all angles.
5. Clean photographic frames: NO borders, watermarks, text labels, camera icons, or comic speech bubbles.
6. Render each panel as a distinct full-resolution photographic cinematic plate.
${settings.nsfwMode ? `• CONTENT RATING: [RAW UNCENSORED INDIE / R-RATED]. Visceral physical authenticity: authentic workshop blood scratches, grease burns, gritty street neorealism permitted.` : `• CONTENT RATING: [PG-13 COMMERCIAL SAFE — Google Flow, Runway, Kling & Midjourney Compliant]. Zero explicit gore, zero gratuitous nudity, zero adult content. Passed for commercial enterprise production.`}${settings.negativeGuardrails ? `\n\n═══════════════════════════════════════════════════════════
NEGATIVE PROMPT & ANTI-HALLUCINATION GUARDRAILS
═══════════════════════════════════════════════════════════
deformed hands, extra fingers, mutated limbs, plastic skin, CGI glow, Pixar 3D render, cartoon, anime, airbrushed skin, oversaturated neon, levitating objects, floating wires, washbasin inside electrical wire pile, split frames, distorted anatomy, camera icons.` : ""}`;
}

/**
 * Converts Storyboard Panels into 1-Shot Image-to-Video Prompts with Physical Plausibility Rules
 */
export function compileVideoPrompts(
  data: ProductionContinuity,
  flowIngredientsSyntax = true,
  settings: CompilerSettings = DEFAULT_COMPILER_SETTINGS
): string {
  const isIngredientsMode = data.flowReferenceMode === "ingredients";
  const castList = (data.cast && data.cast.length > 0) ? data.cast : [
    {
      id: "c1",
      name: data.primaryCharacter.name || "Protagonist",
      role: "lead" as const,
      rawInput: data.primaryCharacter.description,
      tag: data.primaryCharacter.tag,
      archetypeTitle: "Lead Character",
      ageGender: data.primaryCharacter.ethnicityAge,
      facialTopology: data.primaryCharacter.description,
      skinTexture: "Natural human skin with pores",
      microKinesics: "Authentic posture",
      wardrobeFabric: data.wardrobeLock.garments,
      personalityVibe: data.primaryCharacter.expression
    }
  ];

  const shotPrompts = data.panels.map((p) => {
    const shotSpec = deriveCinematicCompositionPlanes(p, data.aspectRatio, data.locationLock, data.opticsAndAesthetics);
    // Identify characters present in this specific panel
    const activeChars = castList.filter((c) =>
      p.charactersInFrame?.includes(c.name) ||
      p.charactersInFrame?.includes(c.tag) ||
      p.charactersInFrame?.includes(c.id)
    );
    const effectiveChars = activeChars.length > 0 ? activeChars : [castList[0]];
    const charNamesString = effectiveChars.map((c) => c.name).join(" and ");
    const charTagsString = effectiveChars.map((c) => c.tag).join(", ");
    const isSolo = effectiveChars.length === 1;

    const referenceHeader = isIngredientsMode
      ? `GOOGLE FLOW SETTING: Mode: VIDEO | Tab: INGREDIENTS | Aspect: ${data.aspectRatio} | Duration: ${p.durationSeconds}s
REFERENCE INGREDIENT: Use the provided 2x2 storyboard reference image for character identity, wardrobe, environment, lighting, and color grading.`
      : `INPUT START FRAME: Approved Storyboard Panel ${p.panelNumber} (Full-Frame ${data.aspectRatio})
ASPECT RATIO: ${data.aspectRatio} | TARGET DURATION: ${p.durationSeconds} Seconds`;

    const compositionConstraint = isIngredientsMode
      ? `\n[SINGLE-SHOT GENERATION DIRECTIVE]
Generate a SINGLE continuous cinematic video shot representing Shot ${String(p.panelNumber).padStart(2, "0")} [${p.framing} / ${p.angle.toUpperCase()} — ${isSolo ? `SOLO: ${charNamesString}` : `MULTI: ${charNamesString}`}].
Do NOT animate the 2x2 grid. Extract ${charNamesString}, wardrobe, and environment textures from the reference ingredient and render ONLY this single camera setup.`
      : "";

    // Lip sync and dialogue rule
    let dialogueSection = "";
    if (p.dialogue && p.dialogue.trim().length > 0) {
      const speaker = p.dialogueSpeaker || effectiveChars[0].name;
      if (p.dialogueType === "voiceover_inner_thought") {
        dialogueSection = `\n[AUDIO & INNER THOUGHTS (NO LIP SYNC)]
- Diegetic Ambience: ${p.audioAmbience}
- Internal Monologue / Voiceover (VO for ${speaker}): "${p.dialogue}"
- CRITICAL FACIAL & LIP RULE: ${speaker}'s mouth and lips remain naturally and completely closed throughout the entire shot. Zero lip movement. No talking animation. The line is an internal thought heard only by the audience.`;
      } else {
        dialogueSection = `\n[AUDIO & SPOKEN DIALOGUE]
- Diegetic Ambience: ${p.audioAmbience}
- Spoken Line (${speaker}): "${p.dialogue}"
- Lip Motion: Natural, understated lip movement for ${speaker} timed to the spoken words. Other characters remain listening with closed lips.`;
      }
    } else {
      dialogueSection = `\n[AUDIO & ENVIRONMENT]
- Diegetic Ambience: ${p.audioAmbience}
- Speech: None. All characters' mouths remain completely closed in natural repose.`;
    }

    const initialPoseLock = p.initialPose && p.initialPose.trim().length > 0
      ? `\n[T=0 START FRAME PHYSICAL BASELINE]\nObservable pose established by reference: "${p.initialPose}"\nCRITICAL RULE: DO NOT prompt actions that contradict or precede this state. Action moves forward only.`
      : `\n[T=0 START FRAME PHYSICAL BASELINE]\nThe reference image establishes the exact spatial posture. Do not animate backwards.`;

    // Physical safety & mechanics
    const safetyDirectives = detectPhysicalSafetyDirectives(p.action);
    const physicalSafetySection = safetyDirectives.length > 0
      ? `\n[PHYSICAL PLAUSIBILITY & CONTACT CONTRACT]\n${safetyDirectives.map((d) => `• ${d}`).join("\n")}`
      : "";

    const safetyBadgeLine = settings.nsfwMode
      ? `\n[SAFETY RATING: RAW UNCENSORED INDIE]`
      : `\n[SAFETY RATING: PG-13 COMMERCIAL COMPLIANT]`;

    const negativeDirectivesLine = settings.negativeGuardrails
      ? `\n[NEGATIVE CONSTRAINTS: Avoid deformed limbs, plastic skin, CGI neon glow, Pixar cartoon 3D, floating wires, washbasin inside electrical pile]`
      : "";

    return `══════════════════════════════════════════════════════════
FILM SHOT FOOTAGE DIRECTIVE // SHOT ${String(p.panelNumber).padStart(2, "0")}
SLATE: SCENE 01 • SHOT ${p.panelNumber} • TAKE 01 | ${data.aspectRatio} • ${p.durationSeconds} SECONDS
LENS: ${shotSpec.opticsProfile}
RIG: ${shotSpec.cameraMountSpecs}
══════════════════════════════════════════════════════════
${referenceHeader}
${flowIngredientsSyntax ? `FLOW INGREDIENTS: ${charTagsString}, ${data.locationLock.tag}` : ""}${compositionConstraint}${safetyBadgeLine}${negativeDirectivesLine}

[CINEMATIC PLACEMENT & 3D DEPTH STAGING]
• Focal Plane (Z1): ${charNamesString} positioned at ${shotSpec.depthPlanes.z1SubjectFocalPlane}.
• Foreground Layer (Z0): ${shotSpec.depthPlanes.z0Foreground}
• Deep Space (Z2): ${shotSpec.depthPlanes.z2BackgroundFalloff}
• Eyeline & 180° Axis Continuity: ${p.screenDirection}. Maintain camera axis consistency relative to adjacent shots.
• Active Cast Lock: ${charNamesString} (${charTagsString}). Zero ghost characters.

[T=0 STARTING INERTIA & MOTOR KINESICS]
${initialPoseLock}
• Directed Forward Motion (T=0 → T=End): ${p.action}
• Physical Mass & Kinetic Gravity: Organic, weight-bearing micro-movements for ${charNamesString}. Authentic human inertia, joint articulation, and realistic material friction. Strictly zero robotic twitching, floating, or rubbery distortion.

[CAMERA RIG & KINEMATICS]
• Mount & Movement: ${shotSpec.cameraMountSpecs}. Maintain precise optical axis stability with gentle cinematic breathing.

[LIGHTING ARCHITECTURE & FILM EMULATION]
• Photometric Keys: ${shotSpec.lightingKey}
• Film Look: ${data.opticsAndAesthetics.grading}
${physicalSafetySection}
${dialogueSection}

[END STATE EDITORIAL CUT]
End on a stable, unblurred final frame composition suitable for smooth editorial transition.`;
  });

  return shotPrompts.join("\n\n" + "═".repeat(58) + "\n\n");
}

/**
 * Continuity & Mistake Auditor with Multi-Character & Physical Plausibility Support
 */
export function auditPromptContinuity(data: ProductionContinuity): PromptAuditIssue[] {
  const issues: PromptAuditIssue[] = [];
  const castList = data.cast || [];

  // Check 0: Generic or Missing Character Names
  castList.forEach((char, idx) => {
    const lowerName = (char.name || "").toLowerCase().trim();
    if (!char.name || lowerName === "" || ["man", "woman", "guy", "boy", "girl", "person", "character"].includes(lowerName)) {
      issues.push({
        id: `generic_name_${char.id || idx}`,
        severity: "critical",
        title: `Cast Member ${idx + 1} Lacks a Proper Human Name`,
        explanation:
          `AI diffusion and video models suffer from identity drift when characters are referred to generically as "${char.name || "unnamed"}". Proper human names (e.g. "Arjun", "Ramesh", "Sunita") act as strong cross-attention anchors.`,
        recommendation:
          `Assign a realistic human name to Cast Member ${idx + 1} to anchor identity consistently across shots.`
      });
    }
  });

  // Check 1: Start Frame Physical State Contradiction
  for (const panel of data.panels) {
    const act = panel.action.toLowerCase();
    const pose = (panel.initialPose || "").toLowerCase();

    if (
      (pose.includes("feet on the floor") ||
        pose.includes("foot is already") ||
        pose.includes("foot planted") ||
        pose.includes("feet planted")) &&
      (act.includes("removes bedsheet from") ||
        act.includes("pulls bedsheet off") ||
        act.includes("swings legs") ||
        act.includes("swings feet") ||
        act.includes("steps out of bed") ||
        act.includes("gets out of bed"))
    ) {
      issues.push({
        id: `state_collision_panel_${panel.panelNumber}`,
        severity: "critical",
        title: `Panel ${panel.panelNumber}: T=0 Physical State Collision (Contradicting Frozen Pose)`,
        explanation:
          `In Panel ${panel.panelNumber}, the reference already shows the feet planted on the floor, but the prompt asks to remove the bedsheet or swing legs out of bed! This causes video models to hallucinate extra limbs, reverse time, or melt feet through the floor.`,
        recommendation:
          "Only prompt forward motion starting from the frozen pose: e.g. 'Toes flex against the dusty floor; hand grips the cot edge for leverage. Feet remain planted.'"
      });
    }
  }

  // Check 2: Barehanded Scalding Metal Handling (Tea Handi Law)
  for (const panel of data.panels) {
    const act = panel.action.toLowerCase();
    const isHotMetal =
      act.includes("boiling") ||
      act.includes("tea handi") ||
      act.includes("hot vessel") ||
      act.includes("pot on flame") ||
      act.includes("brass handi") ||
      act.includes("rotates vessel") ||
      act.includes("rotates pot");

    const hasClothOrTongs =
      act.includes("cloth") ||
      act.includes("kapda") ||
      act.includes("tongs") ||
      act.includes("towel") ||
      act.includes("insulated");

    if (isHotMetal && !hasClothOrTongs) {
      issues.push({
        id: `barehanded_metal_panel_${panel.panelNumber}`,
        severity: "critical",
        title: `Panel ${panel.panelNumber}: Uninsulated Barehanded Contact with Boiling Metal`,
        explanation:
          `Panel ${panel.panelNumber} depicts rotating or lifting a boiling vessel, but does not specify a cloth or tongs. In AI video, this results in the actor grabbing scalding metal barehanded without burns—a glaring physical hallucination.`,
        recommendation:
          "Specify: 'Using a folded cotton cloth (kapda) or tongs wrapped around the hot handle, the subject rotates the boiling vessel. Fingers are fully insulated from heat.'"
      });
    }
  }

  // Check 3: Heavy Suspended Load Rigging (Coconut Harvest Law)
  for (const panel of data.panels) {
    const act = panel.action.toLowerCase();
    if (
      (act.includes("coconut bunch") || act.includes("heavy bunch")) &&
      act.includes("cut") &&
      !act.includes("rope") &&
      !act.includes("rigged") &&
      !act.includes("lowered")
    ) {
      issues.push({
        id: `unrigged_harvest_panel_${panel.panelNumber}`,
        severity: "warning",
        title: `Panel ${panel.panelNumber}: Heavy Load Severed Without Rigging Leverage`,
        explanation:
          `Cutting a 15kg bunch of coconuts without securing a rope causes video AI to either drop the bunch violently or levitate it in midair.`,
        recommendation:
          "Specify knotting a coir rope around the bunch stem before cutting, paying out the line slowly to lower it without damage."
      });
    }
  }

  // Check 4: Screen Direction Reversals (Axis Jumps)
  for (let i = 0; i < data.panels.length - 1; i++) {
    const p1 = data.panels[i];
    const p2 = data.panels[i + 1];
    const dir1 = (p1.screenDirection || "").toLowerCase();
    const dir2 = (p2.screenDirection || "").toLowerCase();

    const isRun1 = p1.action.toLowerCase().includes("run") || p1.action.toLowerCase().includes("sprint");
    const isRun2 = p2.action.toLowerCase().includes("run") || p2.action.toLowerCase().includes("sprint");

    if (isRun1 && isRun2) {
      const isRightToLeft1 = dir1.includes("right to left") || dir1.includes("right-to-left");
      const isLeftToRight2 = dir2.includes("left to right") || dir2.includes("left-to-right");
      const isLeftToRight1 = dir1.includes("left to right") || dir1.includes("left-to-right");
      const isRightToLeft2 = dir2.includes("right to left") || dir2.includes("right-to-left");

      if ((isRightToLeft1 && isLeftToRight2) || (isLeftToRight1 && isRightToLeft2)) {
        issues.push({
          id: `screen_dir_flip_${p1.panelNumber}_${p2.panelNumber}`,
          severity: "warning",
          title: `Panels ${p1.panelNumber} & ${p2.panelNumber}: 180° Screen Direction Axis Reversal`,
          explanation:
            `Panel ${p1.panelNumber} moves ${dir1}, but Panel ${p2.panelNumber} moves in the opposite direction (${dir2}). In editorial cuts, this makes the character appear to have turned around or running backward.`,
          recommendation:
            "Lock the screen direction across running shots (e.g. both Screen-Right to Screen-Left), or insert a neutral head-on shot in between."
        });
      }
    }
  }

  // Check 5: Ambiguous Pronoun Check in Multi-Character Shots
  for (const panel of data.panels) {
    const charsCount = panel.charactersInFrame?.length || 0;
    if (charsCount >= 2) {
      const act = panel.action.toLowerCase();
      if (
        act.includes("he looks at him") ||
        act.includes("he watches him") ||
        act.includes("he talks to him") ||
        act.includes("she looks at her") ||
        act.includes("she watches her") ||
        act.includes("he hands him") ||
        act.includes("she hands her")
      ) {
        issues.push({
          id: `pronoun_ambiguity_panel_${panel.panelNumber}`,
          severity: "warning",
          title: `Panel ${panel.panelNumber}: Ambiguous Pronouns in Multi-Character Shot`,
          explanation:
            `Panel ${panel.panelNumber} features ${charsCount} characters, but the action uses phrases like "${act.match(/(he looks at him|he watches him|he talks to him|she looks at her|she watches her|he hands him|she hands her)/)?.[0] || "ambiguous pronouns"}". In AI video generation, this causes face morphing and swapped clothing.`,
          recommendation:
            `Explicitly replace pronouns with character names (e.g. "Arjun looks at Ramesh; Ramesh nods in response").`
        });
      }
    }
  }

  // Check 6: Prop Magnet & Token Over-Salience Check
  for (const panel of data.panels) {
    const act = panel.action.toLowerCase();
    const propWords = ["chair", "lamp", "table", "scrap metal", "bucket", "can", "mirror", "clock"];
    const foundProps = propWords.filter((w) => act.includes(w));
    if (foundProps.length > 0 && !data.rawRealismMode) {
      issues.push({
        id: `prop_magnet_${panel.panelNumber}`,
        severity: "warning",
        title: `Panel ${panel.panelNumber}: Background Prop Token Saliency Alert (${foundProps.join(", ")})`,
        explanation:
          `Mentioning background objects like "${foundProps.join(", ")}" in action beats causes diffusion cross-attention to focus on the prop, lighting it up with unnatural glows or centering it.`,
        recommendation:
          "Enable 'Raw Realism / Depth Plane' mode, or subordinate the prop to background falloff: 'Subject sits in midground while background furniture remains in soft optical shadow.'"
      });
    }
  }

  // Check 7: Accidental Lip Sync on Inner Thoughts
  for (const panel of data.panels) {
    if (panel.dialogue && panel.dialogue.trim().length > 0 && panel.dialogueType !== "voiceover_inner_thought") {
      issues.push({
        id: `dialogue_lipsync_${panel.panelNumber}`,
        severity: "tip",
        title: `Panel ${panel.panelNumber}: Check if Dialogue is Spoken Aloud or Inner Thoughts`,
        explanation:
          `If the character is alone in the room, having the mouth speak aloud can look unnatural and cause mouth-morphing in AI video models.`,
        recommendation:
          "Set Dialogue Type to 'Inner Thoughts (VO - Lips Closed)'. This locks the mouth shut and plays the dialogue as internal voiceover."
      });
    }
  }

  // Check 8: Wardrobe change inside single generation
  const wardrobeText = (data.wardrobeLock.garments + " " + data.wardrobeLock.rule).toLowerCase();
  if (
    wardrobeText.includes("change") ||
    wardrobeText.includes("switch") ||
    wardrobeText.includes("transition") ||
    wardrobeText.includes("transform") ||
    wardrobeText.includes("wearing uniform later")
  ) {
    issues.push({
      id: "wardrobe_fusion",
      severity: "critical",
      title: "Wardrobe Transformation Detected in Single Scene",
      explanation:
        "AI models struggle to transition clothing inside one scene or prompt, causing garment hallucination and color fusion.",
      recommendation:
        "Split into two scenes across an editorial cut. Scene A: Home Outfit only. CUT -> Scene B: Work Uniform only."
    });
  }

  // Check 9: Multi-action complexity overload
  for (const panel of data.panels) {
    const act = panel.action.toLowerCase();
    if (
      (act.includes("climbs") && act.includes("cuts") && act.includes("drops")) ||
      (act.includes("wakes up") && act.includes("runs") && act.includes("boards"))
    ) {
      issues.push({
        id: `complexity_overload_${panel.panelNumber}`,
        severity: "critical",
        title: `Panel ${panel.panelNumber}: Multi-Action Complexity Overload`,
        explanation:
          `Panel ${panel.panelNumber} compresses climbing, cutting, and dropping into one generation. Video AI cannot handle multiple distinct physical tasks at once.`,
        recommendation:
          "Decompose into individual close-up panels (e.g., Shot A: Climbing CU, Shot B: Cutting CU, Shot C: Lowering CU)."
      });
    }
  }

  // Check 10: Environmental Bleed (Water Basin Mixed with Electrical Wires & Motors)
  for (const panel of data.panels) {
    const act = panel.action.toLowerCase();
    const blocking = (panel.spatialBlocking || "").toLowerCase();
    const fullText = act + " " + blocking;

    const hasWaterHygiene = fullText.includes("wash") || fullText.includes("basin") || fullText.includes("sink") || fullText.includes("soap") || fullText.includes("water on face");
    const hasElectricalHazard = fullText.includes("wire") || fullText.includes("motor") || fullText.includes("battery") || fullText.includes("circuit") || fullText.includes("lathe");

    // If both water and electrical are in the same shot, ensure they are explicitly isolated
    if (hasWaterHygiene && hasElectricalHazard && !fullText.includes("zero electrical") && !fullText.includes("strictly zero")) {
      issues.push({
        id: `water_electric_clash_${panel.panelNumber}`,
        severity: "critical",
        title: `Panel ${panel.panelNumber}: Impossible Environmental Bleed (Water Basin Mixed with Electrical Motors/Wires)`,
        explanation:
          `Panel ${panel.panelNumber} mentions washing/sink alongside electrical wires and motors. In AI video generation, this triggers the absurd hallucination of a bathroom washbasin materializing directly inside a tangled pile of live high-voltage motors and wiring.`,
        recommendation:
          "Isolate the washing action into a dedicated macro close-up (shallow depth of field f/1.4). Add: 'Strictly ZERO electrical wires, motors, or workshop tools in frame; water plumbing is quarantined completely.'"
      });
    }
  }

  return issues;
}
