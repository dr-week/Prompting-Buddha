import type { OutfitOption } from "./types";

export const OUTFITS_MALE: OutfitOption[] = [
  // 1. MASCULINE CASUAL & RUGGED STREET
  {
    id: "male_fitted_crew_denim",
    label: "Fitted Dark Crewneck & Raw Selvedge Denim",
    type: "sexy_casual",
    pieces: "Form-fitting heavy cotton dark crewneck t-shirt accentuating shoulder width, dark indigo raw selvedge denim jeans, rugged oiled leather work boots, silver wrist cuff.",
    fitDesc: "Effortlessly masculine and attractive; fabric hugs broad shoulders, chest, and biceps with grounded rugged charm."
  },
  {
    id: "male_rolled_oxford_chinos",
    label: "Crisp Oxford Shirt with Rolled Forearms & Chinos",
    type: "sexy_casual",
    pieces: "Pristine white cotton Oxford button-down shirt with sleeves rolled past forearms, slim tailored sand chinos, brown leather belt, minimalist dress watch.",
    fitDesc: "Classic timeless appeal; shows off toned vascular forearms and broad shoulders with effortless handsome composure."
  },
  {
    id: "male_ribbed_knit_polo",
    label: "Fitted Ribbed Knit Polo & Pleated Trousers",
    type: "sexy_casual",
    pieces: "Tailored fine-gauge ribbed knit open-collar polo shirt hugging chest, high-waisted pleated charcoal wool trousers, Belgian leather loafers.",
    fitDesc: "Vintage Italian Riviera sophistication; contours athletic torso with cultured debonair masculinity."
  },
  {
    id: "male_tactical_overshirt",
    label: "Heavy Utility Overshirt over Fitted White Tank",
    type: "sexy_casual",
    pieces: "Unbuttoned heavy cotton drill utility overshirt worn open over a ribbed white muscle tank, straight-leg black denim, combat boots.",
    fitDesc: "Raw working-class charisma; open overshirt reveals muscular chest and defined collarbones."
  },

  // 2. EVENING GLAMOUR & DEBONAIR SEDUCTION
  {
    id: "male_silk_open_collar",
    label: "Open-Collar Black Silk Shirt & Tailored Pants",
    type: "evening_glam",
    pieces: "Relaxed unbuttoned black silk-blend button-down shirt with rolled forearms, tailored slim-taper pleated charcoal trousers, Italian leather Chelsea boots.",
    fitDesc: "Alluring evening seduction; exposed collarbone and upper chest, sleeves casually pushed to elbows showing athletic forearms."
  },
  {
    id: "male_velvet_dinner_jacket",
    label: "Midnight Velvet Dinner Jacket & Open Dress Shirt",
    type: "evening_glam",
    pieces: "Deep midnight blue plush velvet dinner jacket with satin shawl lapels, crisp unbuttoned white dress shirt, tailored black tuxedo trousers, patent leather shoes.",
    fitDesc: "Magnetic James Bond red-carpet presence; luxurious velvet catches light, exuding high-status confidence."
  },
  {
    id: "male_turtleneck_overcoat",
    label: "Fine Merino Turtleneck & Sharp Wool Overcoat",
    type: "evening_glam",
    pieces: "Fitted black merino wool turtleneck sweater accentuating jawline, sharp tailored charcoal wool overcoat, slim black trousers, leather dress boots.",
    fitDesc: "Brooding cinematic silhouette; turtleneck frames sharp jawline while overcoat adds commanding stature."
  },

  // 3. ATHLETIC, GYM & FITNESS
  {
    id: "male_athletic_compression",
    label: "Dry-Fit Compression Tee & Training Shorts",
    type: "athletic",
    pieces: "Breathable athletic performance compression shirt, lined 5-inch running training shorts, minimalist training trainers, sweatband.",
    fitDesc: "Highlights muscular torso, defined pectoral contours, and athletic quad definition with gym-ready intensity."
  },
  {
    id: "male_stringer_sweatpants",
    label: "Drop-Armhole Muscle Stringer & Tapered Joggers",
    type: "athletic",
    pieces: "Deep-cut drop armhole cotton muscle tank revealing lats and shoulder striations, tapered heavyweight fleece joggers, cross-trainers.",
    fitDesc: "Raw powerhouse physique showcase; highlights muscular back, traps, and vascular arms in peak physical condition."
  },

  // 4. SUMMER, COASTAL RESORT & VACATION
  {
    id: "male_coastal_linen_unbuttoned",
    label: "Breezy Unbuttoned Linen Shirt & Shorts",
    type: "resort_summer",
    pieces: "Lightweight washed white linen shirt worn half-unbuttoned, tailored sand linen shorts, woven leather sandals, braided wrist cord.",
    fitDesc: "Carefree Mediterranean summer allure; sun-warmed chest exposed, sleeves loosely rolled, radiant and relaxed."
  },
  {
    id: "male_camp_collar_silk",
    label: "Camp-Collar Printed Silk Shirt & White Linen Pants",
    type: "resort_summer",
    pieces: "Retro Cuban camp-collar printed silk short-sleeve shirt worn open over white ribbed tank, relaxed fluid white linen trousers, woven slides.",
    fitDesc: "Sensual tropical elegance; airy lightweight fabrics fluttering with movement during coastal sunsets."
  },

  // 5. SHARP BUSINESS & EXECUTIVE HIGH-STATUS
  {
    id: "male_bespoke_threepiece",
    label: "Bespoke Three-Piece Charcoal Wool Suit",
    type: "business_chic",
    pieces: "Custom-tailored three-piece wool suit with fitted waistcoat, crisp light blue poplin dress shirt, silk grenadine tie, Oxford brogues.",
    fitDesc: "Peak sartorial authority; structured waistcoat contours the torso, radiating power and aristocratic polish."
  },
  {
    id: "male_bespoke_suit_tshirt",
    label: "Tailored Blazer over Crisp White Fitted Tee",
    type: "business_chic",
    pieces: "Sharp bespoke dark navy wool blazer over a pristine white tailored crewneck tee, slim matching suit trousers, clean white leather sneakers.",
    fitDesc: "Modern sophisticated high-status aesthetic; sharp silhouette contours the V-taper frame with confident debonair charm."
  },

  // 6. STREET REBEL & VINTAGE BIKER
  {
    id: "male_leather_moto_rebel",
    label: "Vintage Leather Cafe Racer & Distressed Denim",
    type: "street_rebel",
    pieces: "Distressed black lambskin cafe racer leather jacket over a heather gray fitted tee, washed black slim jeans, harness leather motorcycle boots.",
    fitDesc: "Classic dangerous edge; leather jacket accentuates shoulder breadth and masculine jawline with charismatic bad-boy energy."
  },
  {
    id: "male_shearling_aviator",
    label: "Shearling Suede Aviator Jacket & Henley",
    type: "street_rebel",
    pieces: "Heavy brown suede bomber jacket with plush cream shearling collar, fitted oatmeal waffle henley shirt, raw denim, rugged lace-up boots.",
    fitDesc: "Rugged cinematic hero aesthetic; heavy textured outerwear framing a broad powerful upper frame."
  },

  // 7. LOUNGEWEAR & INTIMATE OFF-DUTY
  {
    id: "male_cashmere_slouch_lounge",
    label: "Thermal Waffle Henley & Drawstring Lounge Trousers",
    type: "loungewear",
    pieces: "Fitted thermal waffle knit henley shirt with top buttons undone, soft charcoal cotton drawstring lounge trousers, barefoot.",
    fitDesc: "Intimate and handsome off-duty look; fabric clings to chest and arms while remaining comfortable and warm."
  },

  // 8. ETHNIC ROYALTY & HERITAGE
  {
    id: "male_ethnic_kurta_bundi",
    label: "Tailored Linen Kurta with Embroidered Bundi Vest",
    type: "ethnic_glam",
    pieces: "Crisp mandarin collar ivory linen short kurta, tailored textured Nehru bundi vest in rich jewel tone, fitted churidar trousers, leather juttis.",
    fitDesc: "Regal ethnic elegance; sharp structured vest framing broad shoulders with refined royal charismatic posture."
  },
  {
    id: "male_bandhgala_suit",
    label: "Midnight Silk Bandhgala Jodhpuri Suit",
    type: "ethnic_glam",
    pieces: "High mandarin collar tailored silk bandhgala jacket with hand-carved brass buttons, matching slim-cut trousers, polished velvet slippers.",
    fitDesc: "Commanding royal dignity; high structured collar accentuates masculine posture, neck, and aristocratic jawline."
  }
];
