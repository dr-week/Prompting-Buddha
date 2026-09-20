import { ShotFraming, CameraAngle, CameraMovement, DialogueType } from "./filmmaker-compiler";

export type CineCompositionCategory =
  | "TACTILE_CHORE_MACRO"
  | "OZU_PILLOW_SHOT"
  | "TATAMI_GROUNDED_GAZE"
  | "TOP_DOWN_FLAT_LAY"
  | "THRESHOLD_FRAME_IN_FRAME"
  | "MIRROR_REFLECTION"
  | "PROFILE_TRANSIT_WINDOW"
  | "DIRTY_SINGLE_OTS"
  | "DIRECTIONAL_MATCH_TRANSIT"
  | "NEOREALIST_DOMESTIC_PARALLEL"
  | "ENVIRONMENTAL_PILLOW_TEXTURE"
  | "MECHANICAL_FRICTION_MACRO"
  | "HYDRAULIC_LIQUID_GRAVITY";

export interface CineCompositionExample {
  title: string;
  action: string;
  actionText?: string;
  spatialBlocking: string;
  initialPose: string;
  audioAmbience: string;
  dialogue?: string;
  dialogueType?: DialogueType;
}

export interface CineComposition {
  id: string;
  name: string;
  category: CineCompositionCategory;
  categoryLabel: string;
  filmmakerTradition: string; // e.g. "Robert Bresson (Pickpocket, L'Argent)", "Yasujirō Ozu (Tokyo Story, Late Spring)"
  corePhilosophy: string;
  framing: ShotFraming;
  cameraAngle: CameraAngle;
  cameraMovement: CameraMovement;
  lensRecommendation: string;
  spatialBlockingGuide: string;
  actingProcedure: string; // Internalized, physical, zero melodrama
  t0BaselineRule: string; // Observable physical state at start frame (T=0)
  antiComplexityConstraint: string; // Rules keeping AI models from melting
  defaultAudioAmbience: string;
  physicsAndGravityLaw?: string; // Fundamental real-world physics (gravity, surface tension, thermodynamics, torque)
  commonAiMistake?: string; // Common hallucination made by diffusion models that this shot prevents
  humanDexterityCheck?: string; // Physical human body limitations, flesh burn thresholds, friction, fatigue
  examples: CineCompositionExample[];
}

export const CINE_COMPOSITIONS_DATABASE: CineComposition[] = [
  {
    id: "bresson_tactile_macro_tea",
    name: "Bressonian Tactile Macro: Hot Vessel & Pour",
    category: "TACTILE_CHORE_MACRO",
    categoryLabel: "Tactile Chore Macro",
    filmmakerTradition: "Robert Bresson (L'Argent, Pickpocket)",
    corePhilosophy: "Strip away facial melodrama. The truth of human life resides in the precise, unglamorous mechanics of calloused hands interacting with physical materials.",
    framing: "ECU",
    cameraAngle: "High angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "Macro 90mm T2.8, razor-thin depth of field, natural optical falloff",
    spatialBlockingGuide: "Hands entering frame from lower edge. Vessel positioned center-left. Pouring target center-right.",
    actingProcedure: "Economical, deliberate finger movements. No hurried rushing. Fingers treat hot metal with instinctive respect, using folded cloth insulation.",
    t0BaselineRule: "Fingers are ALREADY holding the folded cloth around the vessel handle. Vessel is already hot and steaming.",
    antiComplexityConstraint: "Focus EXCLUSIVELY on hands, cloth, and vessel. Zero background clutter. Background kitchen counters dissolve into deep optical defocus.",
    defaultAudioAmbience: "Loud bubbling simmer, metallic friction scrape against stove grate, liquid splash",
    examples: [
      {
        title: "Morning Chai Pour",
        action: "Using a folded indigo cotton cloth to insulate calloused fingers from the scalding brass rim, hands lift the handi and pour a steady, steaming stream of chai into two terracotta kulhads.",
        spatialBlocking: "Brass vessel upper-left; clay kulhads resting lower-center. Steam rising vertically.",
        initialPose: "Hands already gripping cloth-wrapped vessel rim 2 inches above wooden counter.",
        audioAmbience: "Rich bubbling splash of tea filling earthenware, gentle clink of clay",
      },
      {
        title: "Tempering Mustard Seeds in Iron Kadai",
        action: "Hand gently tips a small steel spoon, scattering crackling black mustard seeds into smoking hot mustard oil. Small fragrant vapor puffs rise immediately.",
        spatialBlocking: "Iron kadai rim filling lower half of frame; spoon hovering at center.",
        initialPose: "Spoon held motionless 1 inch above the hot oil surface.",
        audioAmbience: "Sharp, rhythmic crackle of popping mustard seeds, sizzling hot oil whisper",
      }
    ]
  },
  {
    id: "bresson_tactile_coins",
    name: "Bressonian Currency & Transaction Macro",
    category: "TACTILE_CHORE_MACRO",
    categoryLabel: "Tactile Chore Macro",
    filmmakerTradition: "Robert Bresson & Vittorio De Sica",
    corePhilosophy: "The daily weight of human survival is measured in the friction of paper currency, worn coins, and weathered wooden shop counters.",
    framing: "CU",
    cameraAngle: "High angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm T1.8, close-focus minimum distance, warm tungsten raking light",
    spatialBlockingGuide: "Countertop surface fills lower two-thirds. Customer hand enters frame-right; vendor hand enters frame-left.",
    actingProcedure: "Zero facial performance required. Hands do all the talking: thumb slides worn banknotes one by one with tactile familiarity.",
    t0BaselineRule: "Coins or currency notes are ALREADY resting flat on the wooden surface.",
    antiComplexityConstraint: "Frame ONLY the countertop contact area and four fingers. Do NOT attempt to frame customer bodies or shop interiors in this shot.",
    defaultAudioAmbience: "Faint paper rustle, metallic ring of brass coins on timber counter, street rumble",
    examples: [
      {
        title: "Counting Daily Earnings",
        action: "Calloused thumb methodically slides four creased 50-rupee banknotes across the nicked wooden counter, pressing each flat with a thumb crease.",
        spatialBlocking: "Cash drawer timber edge frame-bottom; banknotes center-frame.",
        initialPose: "Worn paper currency already arranged in a fanned stack on the wooden surface.",
        audioAmbience: "Crisp dry paper sliding over raw timber, quiet exhale of relief",
        dialogue: "आज का हिसाब हो गया।",
        dialogueType: "voiceover_inner_thought"
      }
    ]
  },
  {
    id: "bresson_shoelace_traction",
    name: "Bressonian Footwear Traction & Grounding",
    category: "TACTILE_CHORE_MACRO",
    categoryLabel: "Tactile Chore Macro",
    filmmakerTradition: "Robert Bresson & Satyajit Ray (Pather Panchali)",
    corePhilosophy: "A human being's relationship with gravity begins at their soles. Feet planting onto dusty floors or tying frayed boot laces communicates the start of work.",
    framing: "ECU",
    cameraAngle: "Low angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "65mm T2.0 Prime, raking ground-level grazing light highlighting dust motes",
    spatialBlockingGuide: "Foot planted lower-center. Dusty floorboards or concrete floor filling frame. Cot or chair leg frame-left.",
    actingProcedure: "Weight transfer is visible in flexing Achilles tendon and spreading toes. Firm tug on fabric or laces without hesitation.",
    t0BaselineRule: "Foot is ALREADY firmly planted on the floor surface. Hands are already gripping the laces or strap.",
    antiComplexityConstraint: "Zero furniture clutter. Do not show bed sheets or upper body. Keep focus strictly on the contact point of sole and earth.",
    defaultAudioAmbience: "Floorboard creak, rasp of rough canvas against skin, dust motes shifting",
    examples: [
      {
        title: "Tightening Worn Workboot Laces",
        action: "Hands cross the frayed black nylon laces, pulling taut with a firm downward yank that compresses the worn leather tongue against the ankle.",
        spatialBlocking: "Single scuffed leather workboot framed diagonal lower-left to center.",
        initialPose: "Foot resting flat on the concrete floor, laces already threaded and held in fingers.",
        audioAmbience: "Sharp friction squeak of tight nylon laces, heavy boot leather flexing",
      }
    ]
  },
  {
    id: "ozu_pillow_steaming_kettle",
    name: "Ozu Environmental Pillow: Steaming Kettle",
    category: "OZU_PILLOW_SHOT",
    categoryLabel: "Ozu Pillow Cutaway",
    filmmakerTradition: "Yasujirō Ozu (Late Spring, Tokyo Story)",
    corePhilosophy: "The 'Pillow Shot' (karakuri) is a visual pause that allows the audience to breathe and absorb the passage of time without narrative pressure.",
    framing: "MS",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm Cinema Prime, balanced natural geometric symmetry, soft atmospheric halation",
    spatialBlockingGuide: "Rigid horizontal and vertical architectural lines. Metal kettle placed dead-center or rule-of-thirds intersection.",
    actingProcedure: "NO HUMAN ACTORS in frame. The environment itself is the breathing subject.",
    t0BaselineRule: "The kettle is already boiling and steady plume of steam is already visible rising toward the ceiling.",
    antiComplexityConstraint: "Strictly eliminate random clutter. Choose 1 or 2 architectural elements (window frame, shelf edge) to anchor the geometry.",
    defaultAudioAmbience: "Quiet rhythmic whistle of tea kettle, soft rain drumming against corrugated tin roof",
    examples: [
      {
        title: "Pre-Dawn Kitchen Stillness",
        action: "Static observational hold: thin white plume of aromatic steam rises from the dark kettle spout, curling slowly upward into the cool pre-dawn blue window light.",
        spatialBlocking: "Black iron kettle resting center-right on old burner; wooden window frame dividing background vertically.",
        initialPose: "Kettle resting silently on low flame; continuous gentle steam curl already established.",
        audioAmbience: "Soft rhythmic kettle hiss, distant pre-dawn bird calls, quiet ticking wall clock",
      }
    ]
  },
  {
    id: "ozu_pillow_clothesline_monsoon",
    name: "Ozu Environmental Pillow: Swaying Clothesline",
    category: "OZU_PILLOW_SHOT",
    categoryLabel: "Ozu Pillow Cutaway",
    filmmakerTradition: "Yasujirō Ozu & Abbas Kiarostami",
    corePhilosophy: "Everyday fabrics drying on a terrace or courtyard mirror the emotional climate of the household. A breeze through linen conveys melancholy or hope.",
    framing: "MS",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "40mm Anamorphic or spherical, deep field focus capturing fabric weave and distant sky",
    spatialBlockingGuide: "Diagonal clothesline cutting across upper third. Rooftop parapet line anchored lower third.",
    actingProcedure: "Inanimate frame. Movement is driven entirely by atmospheric wind and fabric physics.",
    t0BaselineRule: "Clothes are already pinned with wooden pegs and suspended on the nylon rope.",
    antiComplexityConstraint: "Limit to 2-3 garments maximum (e.g. faded white shirt, indigo waistcloth). Do not populate complex cityscape backgrounds.",
    defaultAudioAmbience: "Wind buffeting microphone, rhythmic flap of wet heavy cotton fabric, distant train horn",
    examples: [
      {
        title: "Monsoon Wind on Rooftop",
        action: "A sudden gust of cool pre-monsoon wind lifts the hems of two faded cotton shirts, rippling the fabric into soft billowing folds against an overcast slate sky.",
        spatialBlocking: "Two shirts hung diagonal center; cracked rooftop cement wall lower frame.",
        initialPose: "Fabrics hanging limp before sudden wind gust begins.",
        audioAmbience: "Dull whip-crack flap of cotton fabric in wind, distant rolling monsoon thunder",
      }
    ]
  },
  {
    id: "ozu_tatami_seated_gaze",
    name: "Ozu Tatami Gaze (3-Foot Camera Axis)",
    category: "TATAMI_GROUNDED_GAZE",
    categoryLabel: "Tatami Grounded Gaze",
    filmmakerTradition: "Yasujirō Ozu & Satyajit Ray (Charulata)",
    corePhilosophy: "Lowering the camera to exactly 3 feet off the floor (the eye-level of a person seated on a mat or cot) grounds the audience in humble domestic reality.",
    framing: "MS",
    cameraAngle: "Eye-level", // Eye level relative to seated height (3ft)
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm Standard Prime, zero optical barrel distortion, architectural perpendicularity",
    spatialBlockingGuide: "Seated subject framed lower-half. Doorway, wall beam, or window creates clean rectangular framing around them.",
    actingProcedure: "Stillness. Micro-movements only: a slow blink, a quiet breath, hand resting flat on knee. Zero exaggerated expressions.",
    t0BaselineRule: "Subject is ALREADY seated quietly on the cot/floor with knees bent or legs crossed. No sitting-down motion.",
    antiComplexityConstraint: "Zero decorative knick-knacks. Keep walls bare or with a single calendar/peg. The human form and negative space are paramount.",
    defaultAudioAmbience: "Room tone, steady breathing, faint insect hum in garden, wooden timber creak",
    examples: [
      {
        title: "Evening Cot Contemplation",
        action: "Sitting motionless on the edge of the woven rope cot, subject stares quietly toward the open doorway. Head tilts down one centimeter in contemplative reflection. Mouth remains shut.",
        spatialBlocking: "Subject seated center-left; empty doorway frame-right revealing darkening courtyard.",
        initialPose: "Subject already seated with elbows resting on thighs, fingers loosely clasped.",
        audioAmbience: "Distant cricket chorus, twilight silence, deep slow breath",
        dialogue: "सब ठीक हो जाएगा।",
        dialogueType: "voiceover_inner_thought"
      }
    ]
  },
  {
    id: "topdown_prep_board_chopping",
    name: "Top-Down Flat Lay: Food Prep & Slicing",
    category: "TOP_DOWN_FLAT_LAY",
    categoryLabel: "Top-Down Flat Lay",
    filmmakerTradition: "Chantal Akerman (Jeanne Dielman) & Joris Ivens",
    corePhilosophy: "The geometric overhead perspective transforms repetitive domestic labor into a hypnotic, ceremonial dance of physical precision.",
    framing: "CU",
    cameraAngle: "Overhead", // 90 degree perpendicular
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "35mm Prime mounted on overhead C-stand rig, flat field, zero vignetting",
    spatialBlockingGuide: "Cutting board centered. Hands entering from bottom edge. Sliced ingredients gathered neatly on top-right quadrant.",
    actingProcedure: "Methodical, rhythmic culinary knife strokes. Eyes and hands locked on the blade. Non-cutting hand curled in protective 'claw' grip.",
    t0BaselineRule: "Cutting board, half-chopped vegetable, and knife blade are already in contact on the surface.",
    antiComplexityConstraint: "Strictly perpendicular 90° view. Exclude table legs, floor, or human torso. Show only board, ingredients, and wrists.",
    defaultAudioAmbience: "Rhythmic woody 'thok-thok' of steel knife against wood board, juicy vegetable crunch",
    examples: [
      {
        title: "Slicing Red Onions on Weathered Board",
        action: "Hands guide a worn carbon-steel chef knife in tight, rhythmic rocking strokes, slicing a peeled purple onion into paper-thin crescent rings on the stained wooden board.",
        spatialBlocking: "Scored teak cutting board filling 80% of frame; curled left hand stabilizing onion.",
        initialPose: "Knife blade already resting against onion surface; four sliced rings already detached.",
        audioAmbience: "Crisp rhythmic wood-chopping beats, wet papery slide of sliced onion layers",
      }
    ]
  },
  {
    id: "topdown_workbench_tools",
    name: "Top-Down Flat Lay: Artisan Workbench Repair",
    category: "TOP_DOWN_FLAT_LAY",
    categoryLabel: "Top-Down Flat Lay",
    filmmakerTradition: "Robert Bresson & Neo-Realist Craft Documentarians",
    corePhilosophy: "A craftsperson's workbench tells their entire life story through the patina of their hand tools, oil stains, and physical concentration.",
    framing: "CU",
    cameraAngle: "Overhead",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "45mm Tilt-Shift or 50mm Prime, perfectly perpendicular overhead lock",
    spatialBlockingGuide: "Workpiece centered. Disassembled components arranged neatly in order of removal. Tools flanked left and right.",
    actingProcedure: "Deliberate mechanical movements. Tweezers or small pliers manipulated with calibrated finger tension.",
    t0BaselineRule: "The mechanical device is already opened; parts are already resting on the mat.",
    antiComplexityConstraint: "Do not scatter random debris. Maintain clean, geometric tool placement on the workspace mat.",
    defaultAudioAmbience: "Small metallic clicks of tiny gears, brass tweezers pinging, rhythmic sandpaper rub",
    examples: [
      {
        title: "Repairing a Mechanical Wristwatch",
        action: "Using fine-tipped brass tweezers, craftsperson gingerly lowers a microscopic balance wheel into the brass clockwork housing with steady, un-trembling fingers.",
        spatialBlocking: "Green rubber workbench mat center; disassembled gear cluster upper-left.",
        initialPose: "Tweezers already clamping the tiny wheel 5mm above the open movement casing.",
        audioAmbience: "Quiet, high-frequency metallic contact click, held breath, magnifying glass shift",
      }
    ]
  },
  {
    id: "threshold_doorway_observer",
    name: "Threshold Frame-in-Frame: Doorway Gaze",
    category: "THRESHOLD_FRAME_IN_FRAME",
    categoryLabel: "Threshold Frame-in-Frame",
    filmmakerTradition: "Edward Yang (Yi Yi) & Wong Kar-Wai (In the Mood for Love)",
    corePhilosophy: "Viewing a human being through architectural thresholds (door frames, window grills, corridor pillars) creates an intimate, voyeuristic tenderness.",
    framing: "MS",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "85mm Portrait Telephoto, compressing foreground threshold against subject",
    spatialBlockingGuide: "Dark, out-of-focus door jambs or window frame border screen-left and screen-right. Subject illuminated in center aperture.",
    actingProcedure: "Subject behaves as if completely alone and unobserved. Natural unguarded posture.",
    t0BaselineRule: "Subject is already situated inside the room; camera is already positioned outside in hallway/threshold.",
    antiComplexityConstraint: "Foreground architectural frames must be dark or in deep silhouette. Do not illuminate foreground woodwork.",
    defaultAudioAmbience: "Quiet hallway room tone, ticking clock inside room, muffled distant street",
    examples: [
      {
        title: "Observer in the Doorway",
        action: "Framed within the narrow wooden doorway, subject stands with back half-turned, quietly folding a dry bedsheet against their chest under warm interior lamp glow.",
        spatialBlocking: "Dark door frame silhouetted left and right; subject illuminated center midground.",
        initialPose: "Subject already holding folded sheet, looking down at the fabric.",
        audioAmbience: "Soft rustle of clean cotton fabric, muffled night crickets outside",
      }
    ]
  },
  {
    id: "mirror_reflection_fatigue",
    name: "Mirror Reflection: Silent Inner Monologue",
    category: "MIRROR_REFLECTION",
    categoryLabel: "Mirror Reflection",
    filmmakerTradition: "Ingmar Bergman & Krzysztof Kieślowski (Three Colors: Blue)",
    corePhilosophy: "The mirror allows cinema to confront the internal monologue. The subject inspects their own exhaustion while the audience hears their inner thoughts.",
    framing: "CU",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm T1.4, sharp focus on reflection plane with water spots on foreground glass",
    spatialBlockingGuide: "Subject's reflected face centered. Real shoulder softly visible in foreground edge to establish reflective depth.",
    actingProcedure: "LIPS FIRMLY CLOSED. Eyes track tiny imperfections in reflection: dark circles, grey hair, dry lips. Heavy sigh with shoulders dropping.",
    t0BaselineRule: "Subject is already standing before the mirror; reflection is already visible and sharp.",
    antiComplexityConstraint: "Zero bathroom clutter. Limit to mirror frame, single tap or washbasin rim. No chaotic background reflections.",
    defaultAudioAmbience: "Single water droplet echoing in sink, slow nasal exhalation, absolute quiet",
    examples: [
      {
        title: "End of a 14-Hour Shift",
        action: "Subject leans forward against the ceramic washbasin, staring directly into their own reflected tired eyes. Mouth remains completely closed. Shoulders drop with profound fatigue.",
        spatialBlocking: "Reflected face filling center frame; water droplets beaded on cold mirror surface.",
        initialPose: "Hands already gripping basin rim; head raised looking at mirror reflection.",
        audioAmbience: "Slow rhythmic drip of chrome tap into porcelain basin, quiet room hum",
        dialogue: "बस आज की रात कट जाए...",
        dialogueType: "voiceover_inner_thought"
      }
    ]
  },
  {
    id: "profile_moving_transit",
    name: "Profile Lookout: Moving Window Transit",
    category: "PROFILE_TRANSIT_WINDOW",
    categoryLabel: "Profile Transit Window",
    filmmakerTradition: "Satyajit Ray (Apu Trilogy) & Abbas Kiarostami",
    corePhilosophy: "Humans on moving buses, trains, and rickshaws enter a liminal meditative trance. The passing world blurs while the human mind reflects on its journey.",
    framing: "MCU",
    cameraAngle: "Eye-level",
    cameraMovement: "Subtle Handheld Breathing",
    lensRecommendation: "50mm T1.4, shallow depth keeping subject sharp while passing exterior dissolves into motion blur",
    spatialBlockingGuide: "Subject in sharp side profile frame-left looking right. Window glass and passing blurry landscape filling frame-right.",
    actingProcedure: "Still, introspective expression. Loose hair strands fluttering in ambient window slipstream. Slow blinks.",
    t0BaselineRule: "Subject is already seated next to the open window; vehicle is already in smooth motion.",
    antiComplexityConstraint: "Do not attempt to render distinct landmarks outside window. Passing scenery must be abstract speed blur and light streaks.",
    defaultAudioAmbience: "Low diesel engine hum, wind whistling through window gap, rhythmic wheel clatter",
    examples: [
      {
        title: "Evening Bus Window Gaze",
        action: "Sitting by the rattling bus window, subject's side profile is bathed in shifting amber streetlights. Morning breeze flutters shirt collar. Mouth stays shut in quiet contemplation.",
        spatialBlocking: "Subject profile seated frame-left; window pane and blurred evening lights frame-right.",
        initialPose: "Head resting lightly against window frame pillar, eyes fixed on horizon.",
        audioAmbience: "Rattling bus window frame vibrations, distant vehicle honks, rushing wind",
        dialogue: "शहर बदल गया, पर हम वहीं हैं।",
        dialogueType: "voiceover_inner_thought"
      }
    ]
  },
  {
    id: "dirty_single_ots",
    name: "Dirty Single OTS: Conversational Intimacy",
    category: "DIRTY_SINGLE_OTS",
    categoryLabel: "Dirty Single OTS",
    filmmakerTradition: "Ken Loach & Jean-Pierre & Luc Dardenne",
    corePhilosophy: "Over-the-shoulder dirty singles maintain spatial grounding between two human beings without resorting to sterile, disconnected close-ups.",
    framing: "MCU",
    cameraAngle: "Eye-level",
    cameraMovement: "Subtle Handheld Breathing",
    lensRecommendation: "75mm Portrait Lens, soft bokeh blurring foreground listening character's ear/shoulder",
    spatialBlockingGuide: "Listening character's shoulder/collar blurred in foreground third (e.g. frame-right). Speaking/reacting character sharp in midground third (frame-left).",
    actingProcedure: "Authentic listening reactions: slight eyebrow furrow, chin nod, steady eye contact. Natural physical posture.",
    t0BaselineRule: "Both characters are already locked into their spatial seats/standing positions. Eye lines are established.",
    antiComplexityConstraint: "Max 2 characters. Do not include background bystanders or extraneous furniture between the two subjects.",
    defaultAudioAmbience: "Gentle room tone, distant neighborhood sounds, quiet clothes rustle",
    examples: [
      {
        title: "Father & Son Kitchen Table Conversation",
        action: "Framed over elder's dark shoulder, younger character looks across the wooden table with earnest, attentive eyes, nodding once with quiet respect. Lips remain closed.",
        spatialBlocking: "Elder's shoulder blurred frame-right; younger character seated sharp frame-left.",
        initialPose: "Both characters seated across from each other; eye contact already locked.",
        audioAmbience: "Quiet ceiling fan whir, gentle clinking of tea cup in saucer",
        dialogue: "बाबूजी की बात सही थी...",
        dialogueType: "voiceover_inner_thought"
      }
    ]
  },
  {
    id: "directional_match_transit",
    name: "Directional Match Transit: Cross-Screen Momentum",
    category: "DIRECTIONAL_MATCH_TRANSIT",
    categoryLabel: "Directional Match Transit",
    filmmakerTradition: "Buster Keaton & Classical French New Wave",
    corePhilosophy: "Preserving strict 180° screen direction (e.g. consistently running Screen-Right to Screen-Left) gives action natural momentum without spatial disorientation.",
    framing: "WS",
    cameraAngle: "Low angle",
    cameraMovement: "Tracking Pan",
    lensRecommendation: "35mm Wide Cinema Lens, dynamic perspective, ground-level gravel texture",
    spatialBlockingGuide: "Subject sprints diagonally across frame from right to left. Camera pans smoothly to follow lateral momentum.",
    actingProcedure: "Full-bodied physical effort: pumping arms, forward-tilted torso, determined brow. Heavy physical footsteps.",
    t0BaselineRule: "Subject is ALREADY at full sprint stride across the frame; camera is already tracking.",
    antiComplexityConstraint: "Keep alleyway or sidewalk clear of dense crowds. A simple textured brick wall or corrugated tin fence provides clean lateral backdrop.",
    defaultAudioAmbience: "Pounding rubber shoe soles on asphalt, heavy ragged gasps for air, satchel leather flapping",
    examples: [
      {
        title: "Sprint Through Narrow Alley (Screen-Right to Left)",
        action: "Subject sprints at top speed from Screen-Right toward Screen-Left through the narrow brick alleyway, satchel swinging wildly against his hip. Footsteps strike gravel with heavy urgency.",
        spatialBlocking: "Brick wall backdrop parallel to track; subject crosses right-to-left.",
        initialPose: "Subject already mid-stride in full running momentum entering frame-right.",
        audioAmbience: "Echoing slap of running shoes on hard alley floor, ragged breath",
      }
    ]
  },
  {
    id: "neorealist_domestic_parallel",
    name: "Neorealist Two-Shot: Parallel Domestic Labor",
    category: "NEOREALIST_DOMESTIC_PARALLEL",
    categoryLabel: "Parallel Domestic Two-Shot",
    filmmakerTradition: "Vittorio De Sica (Bicycle Thieves) & Satyajit Ray (Aparajito)",
    corePhilosophy: "Real families live in parallel: one washes dishes while another mends fabric. Staging them in vertical depth reveals their shared bond without melodrama.",
    framing: "MS",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "35mm Deep Focus Lens, preserving clarity across both foreground and background planes",
    spatialBlockingGuide: "Depth Staging: Character A seated working in foreground-left. Character B standing working in background doorway-right.",
    actingProcedure: "Both characters engrossed in their respective manual tasks. No forced conversation. Mutual comfortable silence.",
    t0BaselineRule: "Both characters are already actively working on their respective tasks at T=0.",
    antiComplexityConstraint: "Separate the two characters clearly across the frame so their bodies never overlap or create confusing AI silhouette merges.",
    defaultAudioAmbience: "Layered domestic sounds: water splashing in basin, needle pulling through cloth, wall clock",
    examples: [
      {
        title: "Morning Courtyard Chores",
        action: "Depth-staged two-shot: in intimate foreground-left, mother cleans lentils in a brass platter; in background doorway-right, son laces his school shoes. Neither speaks.",
        spatialBlocking: "Mother seated lower-left; son framed in doorway upper-right.",
        initialPose: "Mother already sorting grains; son already seated on wooden stool tying shoe.",
        audioAmbience: "Dry rattle of lentils swirling on brass thali, shoe leather creaking, morning sparrows",
      }
    ]
  },
  {
    id: "hygiene_isolated_grease_wash",
    name: "Isolated Hygiene Macro: Tap & Grease Wash",
    category: "TACTILE_CHORE_MACRO",
    categoryLabel: "Tactile Chore Macro",
    filmmakerTradition: "Ken Loach & Vittorio De Sica",
    corePhilosophy: "Quarantine wet hygiene from electrical workshops. Eliminate hallucination traps by capturing dirty hands under running tap in tight, shallow-depth macro with zero surrounding electrical gear.",
    framing: "CU",
    cameraAngle: "High angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "Macro 85mm f/1.4, shallow depth of field, background fully defocused into muted olive concrete",
    spatialBlockingGuide: "Brass water tap at top center; stained washbasin below; hands scrubbing beneath stream at center.",
    actingProcedure: "Rigorous scrubbing of knuckles and palms. Soap bar slipping slightly in wet hands; black grease foaming into slate grey suds.",
    t0BaselineRule: "Hands are already wet under running tap; water stream is continuous.",
    antiComplexityConstraint: "Zero electrical motors, batteries, or loose wires anywhere in the frame. Only water, brass faucet, stone/porcelain basin, and soap foam.",
    defaultAudioAmbience: "Continuous rushing tap water, wet hand lathering friction, water slapping porcelain drain",
    examples: [
      {
        title: "Washing Grease Off Calloused Hands",
        action: "Macro shot of two calloused hands rigorously scrubbing under a streaming brass wall tap. A bar of Lifebuoy soap lathers as thick black automotive grease dissolves into charcoal-grey foam and swirls down the drain.",
        spatialBlocking: "Brass faucet at top edge; hands rubbing center; dark water draining downwards.",
        initialPose: "Wet hands already cupped beneath cold tap water stream, soap bar held in right palm.",
        audioAmbience: "Hissing tap water stream, wet slippery skin friction, dripping echo"
      }
    ]
  },
  {
    id: "iti_lathe_machinist_macro",
    name: "Vocational Workshop: Lathe Machine Turning",
    category: "TACTILE_CHORE_MACRO",
    categoryLabel: "Tactile Chore Macro",
    filmmakerTradition: "Dziga Vertov & Harun Farocki",
    corePhilosophy: "Physical mechanical labor captured through industrial geometry. The lathe spindle spins steel rod while cold coolant liquid drips; operator maintains steady handwheel tension.",
    framing: "MCU",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm T1.8 Cine Prime, crisp focus on lathe chuck and metal shavings",
    spatialBlockingGuide: "Lathe bed foreground; rotating chuck center-left; operator hands on handwheels center-right.",
    actingProcedure: "Deliberate, calibrated rotation of cross-slide handwheel. Eyes shielded by safety goggles; calm concentration.",
    t0BaselineRule: "Spindle is already rotating at speed; curly steel shavings already accumulating in chip tray.",
    antiComplexityConstraint: "Strict single-plane composition. Prevent loose flying debris or chaotic sparks. Steady, predictable mechanical movement.",
    defaultAudioAmbience: "Heavy rhythmic lathe motor hum, steady hiss of cutting tool peeling mild steel, coolant drip",
    examples: [
      {
        title: "Lathe Facing Pass",
        action: "In the vocational workshop, apprentice turns the cross-slide handwheel with millimeter precision. The carbide tool bites into spinning mild steel rod, peeling a glowing curling metal ribbon as milky coolant drips.",
        spatialBlocking: "Spinning metal rod center; cutting tool pressing from right; coolant dripping lower-left.",
        initialPose: "Right hand resting on calibrated handwheel, tool bit already in light contact with spinning steel rod.",
        audioAmbience: "High-pitched metallic slicing resonance, steady motor purr, wet drip of emulsion fluid"
      }
    ]
  },
  {
    id: "iti_salvaged_electronics_soldering",
    name: "Scrap Electronics: Insulated Soldering Iron Macro",
    category: "TACTILE_CHORE_MACRO",
    categoryLabel: "Tactile Chore Macro",
    filmmakerTradition: "Robert Bresson (Precision Mechanical)",
    corePhilosophy: "Physical plausibility in electronics fabrication. The technician grips ONLY the insulated black bakelite handle, applying thin resin-core solder wire to salvaged circuit contacts.",
    framing: "ECU",
    cameraAngle: "High angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "100mm Macro T2.8, razor-sharp focus on copper trace and solder tip",
    spatialBlockingGuide: "Perforated circuit board flat on bench; soldering tip entering from right; solder wire entering from left.",
    actingProcedure: "Solder wire touches heated copper pad; gentle puff of blue rosin smoke curls upwards; silver pool melts and hardens.",
    t0BaselineRule: "Soldering iron tip already resting against wire joint; light flux residue visible on copper.",
    antiComplexityConstraint: "Isolate the contact point. Keep power cords and background apparatus out of focal plane. Hand touches insulated handle only.",
    defaultAudioAmbience: "Faint electric sizzle of flux activating, quiet workbench room tone, breath of technician",
    examples: [
      {
        title: "Soldering Salvaged Wiper Motor Leads",
        action: "Extreme macro of calloused fingers holding the insulated handle of a soldering iron, pressing the chiseled copper tip to a stranded copper lead. Thin silver solder melts instantly into a mirror bead as a wispy curl of fragrant white-blue rosin smoke drifts upward.",
        spatialBlocking: "Stripped stranded wire lower-left; tinned iron tip frame-right; smoke rising center.",
        initialPose: "Soldering tip touching terminal pad; solder wire positioned 1mm above junction.",
        audioAmbience: "Tiny sharp sizzle of rosin flux melting, subtle inhalation, quiet stillness"
      }
    ]
  },
  {
    id: "diy_scrap_robot_optics",
    name: "Scrap Robot Realism: Twin Lens Eye Focus",
    category: "TACTILE_CHORE_MACRO",
    categoryLabel: "Tactile Chore Macro",
    filmmakerTradition: "Guillermo del Toro (Pinocchio Mechanics) & Original Trilogy Kitbashing",
    corePhilosophy: "Anti-Pixar realism. No glowing CGI eyes or cartoon expressions. The robot's eyes are dual mechanical 35mm Zenit manual camera lenses attached by hand-bent sheet metal brackets.",
    framing: "CU",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm f/1.4, intimate focal plane on glass elements and scratched knurled focus rings",
    spatialBlockingGuide: "DIY robot head assembly filling center frame; mechanical lens barrels facing forward.",
    actingProcedure: "A calloused hand slowly twists the knurled focus ring of the left camera lens, locking the optical barrel into place with mechanical tactile resistance.",
    t0BaselineRule: "Robot head is securely clamped on workbench; lenses are already mounted on bracket.",
    antiComplexityConstraint: "Raw brushed aluminum, matte galvanized steel, visible pop rivets. Zero neon bloom, zero cartoon smiling mouth, zero floating parts.",
    defaultAudioAmbience: "Damped click of manual aperture ring, dry mechanical friction of focus helicoid, dust drifting in light beam",
    examples: [
      {
        title: "Calibrating Optical Zenit Lenses",
        action: "Apprentice's grease-stained thumb and forefinger grip the knurled focus ring of a salvaged vintage Zenit 35mm camera lens serving as the scrap robot's left eye, gently rotating it until the internal mechanical iris stops with a faint metal detent.",
        spatialBlocking: "Robot scrap metal brow above; twin camera lenses centered; fingers adjusting left lens barrel.",
        initialPose: "Fingers already gripping knurled rubber focus ring of vintage lens.",
        audioAmbience: "Quiet ratcheting click of aperture ring, breath of artisan, faint distant horn"
      }
    ]
  },
  {
    id: "battery_alligator_motor_pulse",
    name: "DIY Actuation: 12V Battery Spark & Wiper Motor",
    category: "TACTILE_CHORE_MACRO",
    categoryLabel: "Tactile Chore Macro",
    filmmakerTradition: "Shane Carruth (Primer) & David Fincher",
    corePhilosophy: "The magic of kinetic life born from mundane automotive refuse. An alligator clip snaps onto a 12V lead-acid battery terminal, producing a faint contact spark as a salvaged car wiper motor jerks and rotates.",
    framing: "CU",
    cameraAngle: "High angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "85mm Macro, selective focus on lead battery terminal and rubber-coated brass clip",
    spatialBlockingGuide: "Car battery top lower-left; alligator clip hovering above terminal; wiper motor gear center-right.",
    actingProcedure: "Hand clamps red alligator tooth onto lead terminal. Tiny blue contact spark fires; arm-linkage on wiper motor gives an abrupt mechanical twitch.",
    t0BaselineRule: "Clip is 2mm above lead terminal post; motor linkage is stationary.",
    antiComplexityConstraint: "Realistic low-voltage electrical behavior: one brief micro-spark at contact, not continuous theatrical arc lightning.",
    defaultAudioAmbience: "Single sharp electrical pop/crackle, heavy 12V motor whine kicking into low gear, metallic arm clunk",
    examples: [
      {
        title: "First Electrical Impulse",
        action: "Apprentice touches an insulated red alligator clip to the positive lead post of a scratched Exide motorcycle battery. A microscopic blue spark jumps at the contact point, and the salvaged wiper motor arm twitches forward two inches with a deep mechanical buzz.",
        spatialBlocking: "Battery terminal bottom-left; alligator clip entering from top; motor armature shaking right.",
        initialPose: "Alligator clip held 3mm above lead terminal post.",
        audioAmbience: "Tiny crisp spark snap, sudden mechanical motor gear whine, surprised quiet exhale"
      }
    ]
  },
  {
    id: "mumbai_noir_honeytrap_covert_macro",
    name: "Tactile Covert Macro: Grounded Blackmail Optics",
    category: "TACTILE_CHORE_MACRO",
    categoryLabel: "Tactile Chore Macro",
    filmmakerTradition: "David Fincher & Bong Joon-ho",
    corePhilosophy: "Cinematic tension is heightened when espionage is grounded in mundane physical objects. A smartphone camera propped behind a cocktail glass or ice bucket, physically recording an extortion signature without floating or sci-fi gimmicks.",
    framing: "ECU",
    cameraAngle: "High angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "100mm Macro T2.8, razor-sharp focus plane on document signature and phone lens reflection",
    spatialBlockingGuide: "Frosted crystal ice bucket upper-left; signed agreement center; smartphone lens peeking from lower-right.",
    actingProcedure: "Manicured hand finishes ink flourish with luxury fountain pen. Stabilizing hand remains motionless. Subtle red recording waveform pulses on phone screen.",
    t0BaselineRule: "Phone is already resting flat on marble; fountain pen is already mid-signature.",
    antiComplexityConstraint: "Isolate the tabletop plane. Strictly prohibit hovering spy gadgets or impossible x-ray overlays.",
    defaultAudioAmbience: "Crisp scratch of fountain pen nib on rag paper, melting ice crackle, muted lounge bass",
    examples: [
      {
        title: "The Covert Agreement Signature",
        action: "Top-down macro: Vikram's gold-nib fountain pen signs the confidential deed on textured paper. Positioned flat on the black marble behind a condensation-beaded crystal ice bucket, Tara's matte-black smartphone captures the document with a tiny pulsing red recording dot.",
        spatialBlocking: "Ice bucket upper-left; signed parchment center; phone lower-right.",
        initialPose: "Pen nib already touching paper; phone flat on stone surface.",
        audioAmbience: "Delicate paper friction, ice cube shifting in bucket, quiet breathing"
      }
    ]
  },
  {
    id: "bollywood_casting_audition_queue",
    name: "Threshold Corridor: The Audition Holding Cell",
    category: "THRESHOLD_FRAME_IN_FRAME",
    categoryLabel: "Threshold Frame-in-Frame",
    filmmakerTradition: "Madhur Bhandarkar (Fashion) & Satyajit Ray",
    corePhilosophy: "The unglamorous grind of ambition. Framing a hopeful aspirant through a narrow, peeling tenement corridor reveals the suffocating weight of commodification and institutional indifference.",
    framing: "MCU",
    cameraAngle: "Eye-level",
    cameraMovement: "Subtle Handheld Breathing",
    lensRecommendation: "35mm Cine Prime, natural depth falloff, green-tinted fluorescent halation",
    spatialBlockingGuide: "Dark doorway silhouette foreground-left; model standing center; blurred line of competing aspirants background-right.",
    actingProcedure: "Subject clutches portfolio composite folder tightly against chest. Eyes alternate between nervous floor glance and watchful stare toward the audition door. Natural humidity sheen.",
    t0BaselineRule: "Subject is already standing in queue; fluorescent tube overhead is already flickering.",
    antiComplexityConstraint: "Keep the foreground doorway clean to anchor composition. Avoid crowding foreground with confusing silhouettes.",
    defaultAudioAmbience: "Humming fluorescent ballast, distant street horns, loud ceiling fan squeak, muffled director shouts",
    examples: [
      {
        title: "Versova Tenement Audition Queue",
        action: "Framed through a narrow doorway, Tara stands in a stifling corridor clutch-holding her 8x10 modeling composite card. Her posture is taut, heels aching, makeup slightly glistening under humid monsoon heat.",
        spatialBlocking: "Doorway frame-left; Tara center; other waiting girls in deep background blur.",
        initialPose: "Tara clutching clear plastic folder to chest.",
        audioAmbience: "Monsoon humidity stillness, rattling ceiling fan, distant auto rickshaw horn"
      }
    ]
  },
  {
    id: "gilded_penthouse_downward_gaze",
    name: "Luxury Gilded Cage: The High-Rise Abyss",
    category: "PROFILE_TRANSIT_WINDOW",
    categoryLabel: "Profile Transit & Window Gaze",
    filmmakerTradition: "Edward Yang (Yi Yi) & Park Chan-wook",
    corePhilosophy: "Sudden wealth brings isolation rather than peace. Filming a subject against floor-to-ceiling glass overlooking the sprawling city below exposes the fatal hubris and loneliness of ill-gotten luxury.",
    framing: "WS",
    cameraAngle: "Eye-level",
    cameraMovement: "Slow Pull-Out",
    lensRecommendation: "40mm Anamorphic Prime, rich vertical oval bokeh, subtle reflections in double-glazed glass",
    spatialBlockingGuide: "Full-height glass window fills frame; subject framed in silhouette or rim light screen-right; sprawling night city lights below.",
    actingProcedure: "Subject stands holding a stemmed glass, motionless. Lip muscles relaxed; eyes scanning distant city lights with cold, solitary detachment.",
    t0BaselineRule: "Subject is already standing on teak terrace; city lights are already fully illuminated.",
    antiComplexityConstraint: "Ensure glass reflections are optically coherent (subject silhouette reflected faintly in glass). Zero CGI floating city holograms.",
    defaultAudioAmbience: "Muffled ocean wind against high-rise glass, distant city hum 40 floors below, faint ice clink",
    examples: [
      {
        title: "Worli Penthouse Dusk Reflection",
        action: "Wide anamorphic shot of Tara standing in her backless black silk dress on the 42nd-floor terrace, gazing through glass at the glowing Bandra-Worli Sea Link. Beside her on the teak table rests an open Birkin bag with banded currency stacks.",
        spatialBlocking: "City skyline filling left two-thirds; Tara standing right-third looking out.",
        initialPose: "Tara standing motionless with champagne glass raised slightly.",
        audioAmbience: "High-altitude coastal wind whisper, distant muffled drone of traffic below"
      }
    ]
  },
  {
    id: "monsoon_corrugated_tin_drip",
    name: "Monsoon Roof Overhang: Gravity Water Drip & Ripple",
    category: "HYDRAULIC_LIQUID_GRAVITY",
    categoryLabel: "Hydraulic Liquids & Gravity",
    filmmakerTradition: "Satyajit Ray (Pather Panchali) & Abbas Kiarostami",
    corePhilosophy: "Liquids behave strictly by hydrostatic pressure and gravity. Capturing water beads coalescing at the edge of corrugated tin and dropping vertically grounds a film in authentic monsoon reality.",
    framing: "CU",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "90mm Macro Cine Prime T2.8, shallow depth of field, focused on water bead",
    spatialBlockingGuide: "Rusted corrugated iron overhang along top third; water drop path vertical down center; dented brass pot lower-third.",
    actingProcedure: "Zero humans. Pure environmental physics: water droplet swells, breaks free from surface tension, drops 18 inches, and splatters into concentric ripple rings.",
    t0BaselineRule: "Overhang is already wet with sheets of rainwater; water bead is already formed at lowest tin tooth.",
    antiComplexityConstraint: "Frame strictly the edge of the roof and the surface of the water pot. Zero background alley clutter.",
    defaultAudioAmbience: "Continuous drumming rain on tin roof, single hollow metallic 'tink' resonance of droplet hitting brass",
    physicsAndGravityLaw: "Gravitational acceleration (9.8 m/s²) pulls droplets strictly perpendicular to Earth. Surface tension holds bead at lowest metal tooth until gravitational mass overcomes adhesion; drop snaps and falls straight.",
    commonAiMistake: "AI diffusion frequently creates sideways rain streaks inside covered porches, floating droplets without gravity, or water falling without splashback.",
    humanDexterityCheck: "Inanimate physical shot. Zero human error possible.",
    examples: [
      {
        title: "Tin Eaves Monsoon Drop",
        action: "Close-up macro of an oxidized corrugated iron roof overhang during a quiet monsoon pause. A heavy water droplet coalesces at the lowest rusted zinc tooth, elongates, snaps free under gravity, and falls 18 inches directly into a battered brass lota, generating a crisp concentric surface ripple.",
        spatialBlocking: "Rusted tin tooth upper-center; water bead dropping center; water surface lower-center.",
        initialPose: "Water droplet already suspended at the tip of the metal tooth, glistening with ambient skylight.",
        audioAmbience: "Gentle rain murmur, crisp single water droplet metallic resonance"
      }
    ]
  },
  {
    id: "kettle_whistle_steam_jet_condensation",
    name: "Thermal Physics: Boiling Kettle Spout & Window Mist",
    category: "ENVIRONMENTAL_PILLOW_TEXTURE",
    categoryLabel: "Environmental Texture & Ozu Pillow",
    filmmakerTradition: "Yasujirō Ozu & Chantal Akerman",
    corePhilosophy: "Thermodynamics and phase transitions: boiling water creates high-velocity vapor jetting from brass kettle spout, hitting cold glass and condensing into running rivulets.",
    framing: "MCU",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm Prime T1.4 with soft directional backlighting illuminating steam",
    spatialBlockingGuide: "Boiling kettle spout frame-left; cold glass windowpane frame-right; steam plume angling across center.",
    actingProcedure: "Inanimate thermodynamic action: white steam jet billows from spout, meets cold glass pane, micro-droplets coalesce into heavy liquid beads that run downwards.",
    t0BaselineRule: "Water is already boiling at 100°C; steam jet is already actively billowing.",
    antiComplexityConstraint: "Do not attempt to show the whole stove or kitchen room. Isolate spout, vapor cone, and window glass.",
    defaultAudioAmbience: "High-pitch whistling hiss of steam pressure, boiling water gurgle inside kettle body",
    physicsAndGravityLaw: "Steam expands and jets out of narrow aperture due to internal vapor pressure. Vapor contacts cold glass below dew point, condensing into liquid water beads that run vertically downward under gravity.",
    commonAiMistake: "AI models generate glowing cartoon steam, steam that flows backwards into the kettle, or show human hands touching the boiling kettle spout with bare fingers.",
    humanDexterityCheck: "Inanimate thermodynamics. If human hands enter, they MUST grip insulated cloth or wooden handle.",
    examples: [
      {
        title: "Morning Kettle Vapor Jet",
        action: "Side-profile of an antique brass kettle spout on a kerosene stove. A dense, high-velocity jet of white steam erupts horizontally from the whistle hole, striking a nearby cold glass window. The glass fogs instantly, and tiny condensation rivulets trickle downward under gravity.",
        spatialBlocking: "Brass spout frame-left; vapor plume rushing center; condensation windowpane frame-right.",
        initialPose: "Steam jet actively blasting from spout nozzle against foggy glass.",
        audioAmbience: "Sharp metallic steam whistle hiss, bubbling water rolling boil, cold morning stillness"
      }
    ]
  },
  {
    id: "leaking_brass_faucet_stone_echo",
    name: "Courtyard Tap: Gravity Droplet & Wet Mossy Basin",
    category: "HYDRAULIC_LIQUID_GRAVITY",
    categoryLabel: "Hydraulic Liquids & Gravity",
    filmmakerTradition: "Andrei Tarkovsky & Vittorio De Sica",
    corePhilosophy: "The slow passage of time in mundane domestic life: a weathered brass wall faucet in a stone courtyard, releasing a rhythmic droplet onto slick black stone.",
    framing: "CU",
    cameraAngle: "High angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "85mm Macro T2.0, sharp plane on falling water bead and wet moss patina",
    spatialBlockingGuide: "Brass tap faucet top-center; water bead swelling center; mossy carved stone basin lower-center.",
    actingProcedure: "Droplet swells into pear shape, snaps free, falls straight down, and slaps the wet stone floor with a sharp droplet bounce.",
    t0BaselineRule: "Stone basin is already wet with dark water sheen; tap is already slowly dripping.",
    antiComplexityConstraint: "Isolate tap mouth and splash zone. Strictly quarantine from electrical appliances or wires.",
    defaultAudioAmbience: "Rhythmic hollow 'plink... plink' water droplet echo in enclosed courtyard, faint distant pigeon coo",
    physicsAndGravityLaw: "Hydrostatic valve leakage creates periodic droplet formation. Surface tension holds droplet until weight exceeds capillary adhesion, causing clean vertical separation.",
    commonAiMistake: "AI places modern chrome bathroom faucets in outdoor courtyards or surrounds taps with electric motors and loose cables.",
    humanDexterityCheck: "Pure environmental focus. Quarantined from electrical workshop apparatus.",
    examples: [
      {
        title: "Courtyard Solitary Drip",
        action: "Macro shot looking down at an ancient green-patinated brass wall tap. A solitary, crystal water droplet bulges from the brass rim, breaks surface tension, drops 2 feet straight down, and slaps the dark, mossy stone basin floor with a tiny circular splash.",
        spatialBlocking: "Brass faucet upper edge; falling water bead center; stone basin floor lower half.",
        initialPose: "Water droplet poised at the faucet tip; stone basin dark and damp.",
        audioAmbience: "Solitary resonant water droplet slap on stone, courtyard acoustic reverb"
      }
    ]
  },
  {
    id: "carpenter_handplane_timber_curl",
    name: "Mechanical Friction: Cast Iron Handplane & Translucent Shaving",
    category: "MECHANICAL_FRICTION_MACRO",
    categoryLabel: "Mechanical Friction & Kinetic Work",
    filmmakerTradition: "Robert Bresson & Harun Farocki",
    corePhilosophy: "Physical labor requires authentic mechanical leverage and shear friction. A carpenter's calloused hands drive a jack plane across seasoned teak wood, peeling a paper-thin curl.",
    framing: "ECU",
    cameraAngle: "Low angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "90mm Macro T2.8, razor-thin depth on blade mouth and curling wood grain",
    spatialBlockingGuide: "Teak timber plank horizontal across bottom; wooden handplane body moving left-to-right; curled shaving rising center.",
    actingProcedure: "Two calloused hands apply heavy downward bodyweight and forward thrust. Carbide/steel iron bites into grain, peeling a continuous translucent curly wood shaving that rolls up through the throat.",
    t0BaselineRule: "Handplane is already seated flat on the timber surface; shavings from previous stroke rest on bench.",
    antiComplexityConstraint: "Isolate plane mouth and timber contact plane. Do not render messy workshop background.",
    defaultAudioAmbience: "Deep, rhythmic swishing scrape of sharp tool iron shearing dry teak grain, carpenter's quiet exhale",
    physicsAndGravityLaw: "Wedge action of 25° hardened carbon steel iron shearing wood fibers parallel to grain. Requires full bodyweight forward lean and bilateral hand clamping.",
    commonAiMistake: "AI models show wood shavings exploding into air like confetti with zero tool contact, or planes floating above timber.",
    humanDexterityCheck: "Two hands firmly locked: left hand on front wooden knob, right hand pressing rear tote. Knuckles white with downward force.",
    examples: [
      {
        title: "The Teak Shaving Pass",
        action: "Extreme macro of a seasoned wooden jack plane sliding along a rough teak joist. The sharpened iron tool edge shears the top layer, curling a paper-thin, golden wood shaving smoothly upward through the wooden throat as sawdust dust motes drift.",
        spatialBlocking: "Plank base frame-bottom; handplane pushing forward right; curl rising center.",
        initialPose: "Plane mouth already engaged with timber grain; shaving beginning to curl.",
        audioAmbience: "Dry metallic-wood shearing resonance, carpenter's steady nasal breath"
      }
    ]
  },
  {
    id: "clay_chulha_ember_blowpipe",
    name: "Combustion & Airflow: Metal Blowpipe & Cowdung Embers",
    category: "ENVIRONMENTAL_PILLOW_TEXTURE",
    categoryLabel: "Environmental Texture & Ozu Pillow",
    filmmakerTradition: "Satyajit Ray (The World of Apu) & Ritwik Ghatak",
    corePhilosophy: "The ancient thermodynamics of village cooking: a hollow iron pipe (phukni) concentrates human breath onto dormant charcoal ash, reigniting glowing orange embers and scattering fine ash particles.",
    framing: "CU",
    cameraAngle: "High angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm T1.8 Cine Prime with natural ember light illuminating textures",
    spatialBlockingGuide: "Mud chulha rim upper-left; iron blowpipe entering lower-right; glowing ember bed center.",
    actingProcedure: "A steady breath issues from the iron pipe tip. Dormant grey ash blows aside to reveal glowing crimson and orange coals that flare bright with intense heat, illuminating the curved clay walls.",
    t0BaselineRule: "Blowpipe tip is held 1 inch above charcoal embers; coals are glowing dull red.",
    antiComplexityConstraint: "Keep flame realistic: coals flare orange-yellow; zero fantasy dragon fireballs or blue explosions.",
    defaultAudioAmbience: "Deep resonant hollow blowing sound of breath through iron pipe, sharp crackle of wood embers igniting",
    physicsAndGravityLaw: "Forced convection airflow injects oxygen directly into carbon fuel bed, raising temperature from 400°C to glowing 800°C incandescence. Ash particles drift upward with rising thermal updraft.",
    commonAiMistake: "AI models generate fantasy magical fireballs or electric neon flames inside mud stoves.",
    humanDexterityCheck: "Human lips pressed to cool end of blowpipe; iron pipe is 18 inches long to prevent heat conduction to face.",
    examples: [
      {
        title: "Reviving Chulha Coals",
        action: "High-angle close-up into the dark belly of a clay stove. A slender iron tube gently blows a steady stream of air into dormant grey wood ash. The ash swirls aside, revealing glowing crimson embers that flare into vibrant orange incandescence, casting flickering warmth across the mud rim.",
        spatialBlocking: "Clay stove rim top-left; blowpipe tip bottom-right; glowing coals center.",
        initialPose: "Blowpipe tip held motionless above grey ash; faint red glow underneath.",
        audioAmbience: "Soft rushing breath tone through metal tube, sudden rhythmic crackle of hot embers"
      }
    ]
  },
  {
    id: "vintage_ceiling_fan_wobble_downward",
    name: "Room Tone Atmospheric Hold: Three-Blade Ceiling Fan & Shadow",
    category: "ENVIRONMENTAL_PILLOW_TEXTURE",
    categoryLabel: "Environmental Texture & Ozu Pillow",
    filmmakerTradition: "Edward Yang (A Brighter Summer Day) & Wong Kar-Wai",
    corePhilosophy: "The rhythmic heartbeat of an Indian room: an old Usha three-blade ceiling fan spinning on a rusted downrod, casting lazy rotating shadow slats across cracked lime-plastered walls.",
    framing: "MCU",
    cameraAngle: "Low angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "35mm Wide Cine Prime T1.8, wide perspective with natural architectural geometry",
    spatialBlockingGuide: "Ceiling fan motor hub center; three stamped metal blades spinning in upper plane; wall shadow lower-left.",
    actingProcedure: "Inanimate mechanical hold: Three faded green steel blades spin at medium speed. A 2mm mechanical wobble in the downrod bearing gives the rotation an authentic, hypnotic rhythmic imperfection.",
    t0BaselineRule: "Fan is already spinning at constant velocity; motor hum is steady.",
    antiComplexityConstraint: "Strictly three blades. Blades rotate clockwise as viewed from below. Zero blurred blade multiplication.",
    defaultAudioAmbience: "Steady electric induction motor hum, rhythmic 'thrum... thrum' air displacement, quiet room silence",
    physicsAndGravityLaw: "Angular momentum of three stamped steel blades on induction motor with slight mechanical bearing eccentricity causing a 2mm rhythmic wobble.",
    commonAiMistake: "AI models generate fans with 5 to 7 blades, blades rotating in impossible opposite directions, or missing downrods.",
    humanDexterityCheck: "Inanimate architectural room hold. Conveys stifling summer afternoon heat.",
    examples: [
      {
        title: "Lazy Summer Fan Hold",
        action: "Low-angle shot looking directly up at an antique three-blade ceiling fan rotating steadily against a pale lime-washed ceiling. A subtle 2mm mechanical wobble in the mounting rod creates a gentle, hypnotic orbital rhythm as blade shadows glide across the wall.",
        spatialBlocking: "Fan hub center frame; blades sweeping circumference; plaster ceiling background.",
        initialPose: "Fan blades spinning at steady cruising speed.",
        audioAmbience: "Deep rhythmic motor drone, gentle whirring blade air displacement"
      }
    ]
  },
  {
    id: "damp_cotton_clothesline_wind",
    name: "Domestic Gravity & Wind: Coir Clothesline & Wet Sari Drip",
    category: "ENVIRONMENTAL_PILLOW_TEXTURE",
    categoryLabel: "Environmental Texture & Ozu Pillow",
    filmmakerTradition: "Chantal Akerman & Vittorio De Sica",
    corePhilosophy: "Domestic labor captured in the heavy vertical sag of wet hand-washed laundry pegged to a taut coir rope swaying in the monsoon afternoon wind.",
    framing: "MS",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm Prime T2.0, natural perspective and organic cloth texture",
    spatialBlockingGuide: "Taut coir clothesline horizontal across top third; indigo and white cotton fabrics hanging vertical; dry courtyard grass below.",
    actingProcedure: "Wind gusts gently from screen-left: heavy wet cotton fabric sways with realistic physical inertia. Water droplets drip from the lowest hem corners into the dirt below. Heavy gravity.",
    t0BaselineRule: "Clothes are already pinned with wooden clothespins; fabric is already wet and heavy.",
    antiComplexityConstraint: "Do not let clothes fly weightlessly. Heavy wet fabric maintains vertical weight and authentic drag.",
    defaultAudioAmbience: "Flapping rustle of heavy wet cotton cloth in gusting wind, distant crows calling, afternoon stillness",
    physicsAndGravityLaw: "Water-saturated woven cotton cloth has high specific mass, pulling the coir rope into a catenary curve. Wind exerts drag, lifting the lower corners while heavy wet hems pull straight down.",
    commonAiMistake: "AI generates floating silk flying weightlessly like banners in zero gravity.",
    humanDexterityCheck: "Split bamboo or wooden spring clothespins pinching cloth firmly over rope.",
    examples: [
      {
        title: "Afternoon Clothesline Sway",
        action: "Static mid-shot of a damp indigo cotton sari hanging from a weathered coir clothesline. A warm afternoon breeze lifts the dry frayed bottom corners while the heavy, water-soaked center fabric remains grounded by gravity, dripping occasional clear droplets into the dust.",
        spatialBlocking: "Coir line across top third; indigo fabric centered; courtyard ground bottom.",
        initialPose: "Sari hanging vertically with wooden pegs securing the top border.",
        audioAmbience: "Heavy wet cloth flapping softly in wind, cicadas buzzing in distant tree"
      }
    ]
  },
  {
    id: "auto_rickshaw_exhaust_puddle_sputter",
    name: "Urban Street Texture: 2-Stroke Exhaust & Wet Asphalt Puddle",
    category: "MECHANICAL_FRICTION_MACRO",
    categoryLabel: "Mechanical Friction & Kinetic Work",
    filmmakerTradition: "Anurag Kashyap & French New Wave",
    corePhilosophy: "The unvarnished mechanical breath of the city: an idling Bajaj auto-rickshaw exhaust pipe vibrating at 12 Hz, spitting tiny grey smoke puffs and condensation droplets that shatter mirror reflections in black asphalt puddles.",
    framing: "ECU",
    cameraAngle: "Low angle",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "85mm Macro T2.8, deep focus on oily puddle reflection and vibrating chrome pipe",
    spatialBlockingGuide: "Black asphalt surface fills lower two-thirds; rusted chrome exhaust tip lower-left; puddle reflection center.",
    actingProcedure: "Exhaust pipe vibrates rapidly on rubber engine mounts. Tiny rhythmic puffs of translucent two-stroke exhaust vapor spit into air, while water spray rings ripple across the shallow street puddle.",
    t0BaselineRule: "Engine is already idling; puddle already mirrors passing amber streetlights.",
    antiComplexityConstraint: "Macro isolation of tailpipe and ground. Zero wide traffic congestion in frame.",
    defaultAudioAmbience: "Chugging two-stroke engine idle rattle, metallic exhaust pop, wet tire splash in distance",
    physicsAndGravityLaw: "Internal combustion 2-stroke exhaust pressure pulses ejecting unburned oil droplets into standing water. Rhythmic surface capillary wave disturbance.",
    commonAiMistake: "AI depicts pristine spotless luxury cars with no mechanical exhaust vibrations or clean dry roads in monsoons.",
    humanDexterityCheck: "Pure mechanical environmental detail.",
    examples: [
      {
        title: "Monsoon Rickshaw Idle Macro",
        action: "Ground-level macro shot beside the rear tire of an idling yellow-and-black auto-rickshaw. The rusted tailpipe trembles with rapid mechanical vibration, ejecting rhythmic puffs of faint grey smoke. Tiny oil-flecked condensation droplets spit onto the wet asphalt, breaking the reflection of neon streetlights.",
        spatialBlocking: "Tire tread frame-left; exhaust pipe lower-left; puddle ripples center-right.",
        initialPose: "Tailpipe vibrating actively; puddle surface shimmering with oil rainbow sheen.",
        audioAmbience: "Throaty 2-stroke engine chug, rhythmic exhaust spitting, distant rain drizzle"
      }
    ]
  },
  {
    id: "tea_glass_surface_tension_meniscus",
    name: "Fluid Dynamics: Surface Tension Meniscus on Chai Glass",
    category: "HYDRAULIC_LIQUID_GRAVITY",
    categoryLabel: "Hydraulic Liquids & Gravity",
    filmmakerTradition: "Robert Bresson & Yasujirō Ozu",
    corePhilosophy: "The physics of a roadside pour: hot milky tea poured to the brim of a fluted cutting glass, where fluid surface tension forms a curved positive meniscus bulging above the glass rim before settling.",
    framing: "ECU",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "100mm Macro Cine Prime T2.8, razor-sharp focus on liquid meniscus and steam",
    spatialBlockingGuide: "Fluted roadside cutting glass centered; tea rim in pin-sharp macro focus; wooden tapri counter below.",
    actingProcedure: "A steady, steaming amber stream of hot tea fills the glass. As the pour ceases, the amber liquid crowns the rim, bulging upward in a delicate convex dome held by liquid cohesion without spilling.",
    t0BaselineRule: "Glass is already four-fifths full; tea is steaming.",
    antiComplexityConstraint: "Extreme close-up on glass rim and liquid dome. Zero vendor bodies or street background.",
    defaultAudioAmbience: "Gurgling pour sound filling glass, subtle clink of glass on wooden bench, gentle tea steam hiss",
    physicsAndGravityLaw: "Cohesive forces between liquid molecules exceed adhesive forces to glass edge, creating convex liquid dome (1.2mm height) until gravitational potential overcomes surface tension.",
    commonAiMistake: "AI models show liquid pouring through glass or liquid defying gravity with jagged polygonal edges.",
    humanDexterityCheck: "Pouring ceases exactly when meniscus crowns the glass rim.",
    examples: [
      {
        title: "The Cutting Chai Meniscus",
        action: "Extreme close-up of a fluted glass on a weathered wooden tea stall counter. Hot spiced tea fills the glass to the very edge, crowning into a convex liquid meniscus that bulges 1mm above the rim without overflowing. Steam rises vertically in the morning sunlight.",
        spatialBlocking: "Glass rim fills center third; counter below; steam drifting upward.",
        initialPose: "Glass nearly full; final droplets falling from brass pot into center.",
        audioAmbience: "Liquid pouring gurgle slowing to silence, delicate clink of glass base on wood"
      }
    ]
  },
  {
    id: "dust_motes_golden_sunbeam_stillness",
    name: "Classical Ozu Pillow Hold: Amber Light & Thermal Dust Motes",
    category: "ENVIRONMENTAL_PILLOW_TEXTURE",
    categoryLabel: "Environmental Texture & Ozu Pillow",
    filmmakerTradition: "Yasujirō Ozu (Late Spring) & Andrei Tarkovsky",
    corePhilosophy: "The timeless Buddhist pause (mono no aware): a horizontal beam of 5:30 PM golden sunlight slicing across a quiet room, illuminating microscopic cotton dust motes suspended in Brownian thermal motion.",
    framing: "MS",
    cameraAngle: "Eye-level",
    cameraMovement: "Static / Locked Tripod",
    lensRecommendation: "50mm Cine Prime T1.4 with anamorphic bokeh and natural golden hour light",
    spatialBlockingGuide: "Horizontal amber sunbeam cutting diagonally through center; wooden window shutter frame-right; empty cot in soft shadow lower-left.",
    actingProcedure: "Zero human movement. Pure contemplative stillness: fine microscopic dust motes drift lazily inside the warm golden light beam, dancing with invisible thermal air currents.",
    t0BaselineRule: "Sunbeam is steady; room is completely quiet.",
    antiComplexityConstraint: "No magical glittering stars or sparkling fairy dust. Natural, subtle atmospheric dust particles visible only in direct backlight.",
    defaultAudioAmbience: "Complete ambient room tone stillness, faint distant temple bell, slow breath of quiet home",
    physicsAndGravityLaw: "Rayleigh scattering of light through suspended micro-particulates (<50 μm) demonstrating Brownian motion and convection airflow. Zero unnatural glowing dust.",
    commonAiMistake: "AI draws giant glowing glitter or floating fireflies inside daytime bedrooms.",
    humanDexterityCheck: "Absolute environmental stillness. Subject has just left the room.",
    examples: [
      {
        title: "Late Afternoon Sunbeam Pause",
        action: "Static non-narrative hold: An empty bedroom at golden hour. A single beam of low amber sunlight cuts through a wooden jali window, illuminating hundreds of tiny cotton dust motes dancing in slow Brownian drift over an empty rope cot. Complete, tranquil stillness.",
        spatialBlocking: "Golden light beam slicing left-to-right; rope cot lower frame; shadowy lime wall background.",
        initialPose: "Sunlight beam already resting across room; dust motes suspended in air.",
        audioAmbience: "Quiet ambient room tone, distant evening sparrows, quiet breeze outside"
      }
    ]
  }
];

/**
 * LocalStorage storage key for user-customized shot database
 */
const CINE_DB_LOCAL_STORAGE_KEY = "prompting_buddha_cine_database_v1";

/**
 * Helper to get all compositions (seed database + user created)
 */
export function getAvailableCineCompositions(): CineComposition[] {
  if (typeof window === "undefined") {
    return CINE_COMPOSITIONS_DATABASE;
  }
  try {
    const raw = localStorage.getItem(CINE_DB_LOCAL_STORAGE_KEY);
    if (!raw) return CINE_COMPOSITIONS_DATABASE;
    const userList: CineComposition[] = JSON.parse(raw);
    return [...CINE_COMPOSITIONS_DATABASE, ...userList];
  } catch (e) {
    console.error("Failed to parse local cine database", e);
    return CINE_COMPOSITIONS_DATABASE;
  }
}

/**
 * Helper to save a custom composition to local database
 */
export function saveCustomCineComposition(comp: CineComposition): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CINE_DB_LOCAL_STORAGE_KEY);
    const list: CineComposition[] = raw ? JSON.parse(raw) : [];
    const existingIdx = list.findIndex((c) => c.id === comp.id);
    if (existingIdx >= 0) {
      list[existingIdx] = comp;
    } else {
      list.push(comp);
    }
    localStorage.setItem(CINE_DB_LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save custom composition", e);
  }
}
