import type { Lifestyle } from "../domain/lifestyle-rules";
import type { FootwearOption } from "./footwear";
import type { OutfitOption } from "./types";

export type CulturalContext = "india" | "western";
export type WardrobeMode = "normal" | "mature";

const outfit = (
  id: string,
  label: string,
  type: OutfitOption["type"],
  pieces: string,
  fitDesc: string,
  culture: CulturalContext,
  lifestyle: Lifestyle,
  matureOnly = false,
): OutfitOption => ({ id, label, type, pieces, fitDesc, culture, lifestyle, matureOnly });

const CONTEXTUAL_OUTFITS: Record<"female" | "male", OutfitOption[]> = {
  female: [
    // ── POOR INDIAN FEMALE — Daily Wear ──
    outfit("in_f_poor_salwar",          "Faded Cotton Salwar Suit",           "daily_wear",  "Faded cotton kameez, simple salwar trousers, reused dupatta, rubber sandals.",                                                          "Affordable, repeatedly worn; visible mending, no luxury.",                                   "india", "poor"),
    outfit("in_f_poor_sari",            "Simple Cotton Sari",                 "daily_wear",  "Inexpensive printed cotton sari, plain reused blouse, cloth shopping bag, worn flat sandals.",                                          "Practical everyday; soft fading, repaired seams.",                                           "india", "poor"),
    outfit("in_f_poor_kurti_leggings",  "Old Kurti and Leggings",             "daily_wear",  "Older cotton kurti, plain leggings, reused scarf.",                                                                                    "Low-cost daily wear; pilled from repeated washing.",                                         "india", "poor"),
    outfit("in_f_poor_synthetic_kurti", "Synthetic Kurti & Thin Dupatta",     "daily_wear",  "Bright polyester kurti in a floral print, thin dupatta over one shoulder, rubber chappals, thin glass bangle stack.",                  "Affordable synthetic; vivid but slightly shiny under light.",                                 "india", "poor"),
    outfit("in_f_poor_lungi_blouse",    "Lungi & Blouse (south India)",       "daily_wear",  "Checked cotton lungi wrapped at the waist, short cotton blouse, rubber slippers, hair tied at nape.",                                  "Coastal south-Indian lower-income daily wear; practical and cool.",                           "india", "poor"),
    outfit("in_f_poor_half_sari",       "Half-Saree (Langa Voni)",            "daily_wear",  "Simple cotton langa skirt, tucked half-saree drape, printed blouse, plastic bangles, rubber flats.",                                   "South-Indian regional everyday; modest, colourful, often faded at the border.",               "india", "poor"),
    outfit("in_f_poor_kurta_patiala",   "Loose Kurta & Patiala Salwar",       "daily_wear",  "Oversize printed cotton kurta, gathered Patiala-cut salwar, inexpensive dupatta, rubber block sandals.",                               "Practical Punjabi-influenced silhouette; soft from many washes.",                             "india", "poor"),
    outfit("in_f_poor_maxi_dress",      "Printed Cotton Maxi Dress",          "daily_wear",  "Full-length cotton maxi dress in floral block-print, elasticised waistband, worn flat chappals.",                                      "Simple loose-fitting maxi common in coastal households; sun-bleached.",                       "india", "poor"),
    outfit("in_f_poor_ghagra_choli",    "Simple Ghagra-Choli (Rajasthani)",   "daily_wear",  "Faded cotton ghagra skirt with mirror-work border, knotted choli blouse, thin odhni over the head, worn juttis.",                      "Rajasthani village garment; repeatedly washed, mirrors tarnished.",                          "india", "poor"),
    outfit("in_f_poor_tribal_wrap",     "Tribal Cotton Wrap Drape",           "daily_wear",  "Handwoven cotton wrap in earthy stripes, tied across the chest and knotted at the hip, bare feet, simple beaded necklace.",            "Tribal / adivasi garment; minimalist, organic, genuine hand-craft.",                         "india", "poor"),
    outfit("in_f_poor_monsoon",         "Monsoon Salwar & Plastic Sandals",   "daily_wear",  "Short cotton salwar-kameez hitched at the hem, cheap plastic sandals, dupatta tucked at waist, wet-slicked hair, rain-dotted fabric.", "Indian monsoon everyday; fabric damp, practical concessions on a budget.",                   "india", "poor"),
    outfit("in_f_poor_college_suit",    "Budget Kurti & Churidar (college)",  "daily_wear",  "Inexpensive printed cotton kurti, plain churidar, cheap nylon backpack, worn flat sandals, thin dupatta at neck.",                     "Young poor urban student; neat but inexpensive, faded at collar and cuffs.",                  "india", "poor"),
    outfit("in_f_poor_shawl_layer",     "Cotton Salwar with Woollen Shawl",   "daily_wear",  "Cotton salwar-kameez under a thick hand-spun woollen shawl wrapped tightly, socks under rubber sandals.",                             "Winter layering; shawl worn for warmth, not fashion.",                                       "india", "poor"),
    outfit("in_f_poor_patched_suit",    "Patched & Repaired Salwar Suit",     "daily_wear",  "Cotton kameez with a visible patch on one sleeve, mismatched thread repair at collar, faded salwar, worn chappals, no dupatta.",       "Extreme-budget visible-mending realism; fabric tells a story of careful stewardship.",        "india", "poor"),
    outfit("in_f_poor_street_night",    "Night-Street Kurti & Shawl",         "daily_wear",  "Plain cotton kurti and leggings, thick dupatta pulled around the shoulders for warmth, worn sandals, cautious posture on a lit street.","Night-time inner-city look; layered for modesty and warmth.",                                "india", "poor"),

    // ── POOR INDIAN FEMALE — Home & Rest ──
    outfit("in_f_poor_house_dress",     "Printed House Dress",                "loungewear",  "Inexpensive printed cotton house dress, simple slip-on sandals.",                                                                      "Loose practical home wear; repeatedly washed.",                                              "india", "poor"),
    outfit("in_f_poor_night_salwar",    "Cotton Night Salwar Set",            "loungewear",  "Loose floral cotton nightwear top and salwar, bare feet on a concrete floor, hair open or loosely braided.",                           "Home evening wear in a low-income household; threadbare at collar and elbows.",               "india", "poor"),

    // ── POOR INDIAN FEMALE — Work & Labour ──
    outfit("in_f_poor_work_sari",       "Work Cotton Sari",                   "work_labour", "Plain cotton sari, practical blouse, tied-back pallu.",                                                                                "Durable Indian workwear with visible use and careful repair.",                               "india", "poor"),
    outfit("in_f_poor_north_tuck_sari", "North-Indian Working Tuck Sari",     "work_labour", "Plain cotton sari with a quick front-tuck, blouse with visible armpit wear, waist cloth belt knotted for support, canvas sneakers.",   "Urban north-India working sari; tucked for ease of movement.",                               "india", "poor"),
    outfit("in_f_poor_tea_stall",       "Tea-Stall Worker Saree",             "work_labour", "Worn synthetic saree in a dull colour, blouse with rolled-up sleeves, cloth towel at wrist, rubber sandals, hair pulled tight.",       "Roadside dhaba or tea-stall worker; pallu tucked in, blouse cuffs stained.",                 "india", "poor"),
    outfit("in_f_poor_construction",    "Construction-Site Labour Wear",      "work_labour", "Rough cotton saree in a dark faded colour, blouse with visible mending, head-cloth as sun-shield, worn rubber sandals.",               "Female construction-site worker; dust on fabric, sun-darkened skin.",                        "india", "poor"),
    outfit("in_f_poor_hospital_aide",   "Basic Cotton Uniform (hospital)",    "work_labour", "Plain cotton salwar-kameez in pale blue or white, worn flat shoes, hair netted or tightly braided, no jewellery.",                    "Low-grade hospital aide; regulation clothing, functional and unadorned.",                     "india", "poor"),

    // ── POOR INDIAN FEMALE — Traditional / Festive ──
    outfit("in_f_poor_festive_sari",         "Festive Cotton Sari (budget)",       "ethnic_glam", "Cotton sari with a simple zari or printed border, tighter blouse, glass bangles, rubber block-heel sandals.",                          "Effort-dressed occasion wear within limited budget; tidy, without luxury.",                   "india", "poor"),
    outfit("in_f_poor_synthetic_lehenga",    "Synthetic Budget Lehenga Skirt",     "ethnic_glam", "Polyester lehenga skirt with printed border, plain short blouse, thin dupatta, imitation-silver jewellery, flat sandals.",            "Inexpensive festive wear; shiny synthetic, visibly different from embroidered originals.",    "india", "poor"),
    outfit("in_f_poor_churidar_suit",        "Simple Churidar Suit",               "ethnic_glam", "Plain churidar bottoms, modest kameez top, small dupatta over chest, cheap studs, worn flat chappals.",                               "Affordable everyday-to-festive suit; relies on colour rather than embellishment.",           "india", "poor"),

    // ── POOR INDIAN FEMALE — Mature: Daily Wear ──
    outfit("in_f_poor_mature_fitted_kurti",  "Fitted Cotton Kurti",                "daily_wear",  "Slim-fit cotton kurti with a modest V-neckline, slightly stretched fabric outlining the torso, worn leggings, simple chappals.",       "Everyday cotton that happens to be form-fitting; confident posture, no luxury staging.",      "india", "poor", true),
    outfit("in_f_poor_mature",               "Fitted Budget Sari",                 "daily_wear",  "Low-cost synthetic sari, fitted plain blouse, reused bangles and worn sandals.",                                                       "Adult Indian styling; modest, affordable and visibly well-used.",                            "india", "poor", true),
    outfit("in_f_poor_mature_open_pallu",    "Open-Pallu Saree (summer heat)",     "daily_wear",  "Thin cotton saree with the pallu dropped and trailing loose, short blouse, midriff exposed, bare feet, damp skin from heat.",          "Summer-heat carelessness; pallu falls free, natural and unstaged.",                          "india", "poor", true),
    outfit("in_f_poor_mature_low_hip",       "Low-Hip Saree Drape",                "daily_wear",  "Cotton saree draped low at the hip showing midriff broadly, short blouse, waist unguarded, bare feet or flat sandals.",               "Common low-hip draping in certain regions; unselfconscious midriff.",                        "india", "poor", true),
    outfit("in_f_poor_mature_deep_back",     "Deep-Back Blouse & Cotton Saree",    "daily_wear",  "Cotton saree blouse cut with a deep U-back (common in south India), plain cotton saree, bare back visible above the waist.",           "South-Indian standard style; not a luxury feature, common in affordable blouses.",           "india", "poor", true),
    outfit("in_f_poor_mature_sleeveless_saree", "Sleeveless Blouse & Thin Saree", "daily_wear",  "Sleeveless fitted cotton blouse, thin transparent cotton saree draped loosely, bare feet, visible waist midriff.",                    "Hot-weather practical; sensuality from climate necessity, not styling.",                      "india", "poor", true),

    // ── POOR INDIAN FEMALE — Mature: Home & Rest ──
    outfit("in_f_poor_mature_blouse_petticoat","Blouse & Petticoat (resting)",     "loungewear",  "Short cotton saree blouse and floor-length petticoat, saree partially unwound on the shoulder, barefoot on a plain floor.",           "Intimate home-setting; standard saree base layers in a private resting moment.",             "india", "poor", true),
    outfit("in_f_poor_mature_night_slip",    "Cotton Night-Slip & Bare Shoulders", "loungewear",  "Simple loose cotton slip worn as nightwear, thin straps, bare shoulders and arms, bare feet on concrete floor, hair loose.",           "Low-income nighttime intimacy; cheap sleeveless cotton slip, private setting.",              "india", "poor", true),
    outfit("in_f_poor_mature_post_bath",     "Post-Bath Towel Wrap",               "loungewear",  "Thin worn cotton bath towel wrapped around the torso, hair dripping loose, bare feet on a damp concrete floor.",                      "Intimate post-bath moment; threadbare towel, completely private setting.",                    "india", "poor", true),
    outfit("in_f_poor_mature_mirror",        "Kurti & Leggings (mirror scene)",    "loungewear",  "Fitted cotton kurti slightly raised while adjusting in a cracked mirror, worn leggings, bare feet, private self-aware moment.",        "Private dressing moment in a modest home; ordinary clothing, self-appraisal.",               "india", "poor", true),
    outfit("in_f_poor_mature_open_collar",   "Open-Collar Blouse & Saree",         "loungewear",  "Cotton saree blouse with top hooks unfastened, plain cotton saree draped loosely, bare feet, relaxed shoulder posture.",               "Private home moment — fastening partly undone; domestic intimacy without luxury.",            "india", "poor", true),

    // ── POOR INDIAN FEMALE — Mature: Work & Labour ──
    outfit("in_f_poor_mature_wet_saree",     "Wet Cotton Saree (post-work)",       "work_labour", "Plain cotton saree clinging from water or sweat, short blouse, bare feet, wet hair tied loosely at the back.",                        "Realism after fetching water or working in rain; fabric heavy and translucent.",              "india", "poor", true),
    outfit("in_f_poor_mature_ghat",          "Ghat-Bathing Saree (river)",         "work_labour", "Single thin cotton saree over a short blouse, standing at water's edge, saree wet and clinging, hair loose and damp, bare feet.",     "Rural open-air bathing; cotton plastered to the body, unselfconscious dignity.",             "india", "poor", true),
    outfit("in_f_poor_mature_sweat_kurta",   "Sweat-Soaked Kurta & Salwar",        "work_labour", "Cotton kurta darkened with sweat at the back, underarms and collar, salwar crumpled, rubber sandals, hair stuck to the neck.",         "Midday summer labour; sweat-transparent fabric, honest physical effort.",                    "india", "poor", true),
    outfit("in_f_middle_kurta", "Everyday Kurta and Trousers", "ethnic_glam", "Clean cotton kurta, straight trousers, simple dupatta and modest flat sandals.", "Neat, affordable Indian middle-class daily wear.", "india", "middle_class"),
    outfit("in_f_middle_sari", "Office Cotton Sari", "business_chic", "Neat cotton sari, fitted plain blouse and simple watch.", "Practical Indian office wear with clean finishing.", "india", "middle_class"),
    outfit("in_f_middle_kurti_jeans", "Kurti and Jeans", "sexy_casual", "Printed cotton kurti, regular blue jeans and simple flats.", "Common Indian casual wear using affordable pieces.", "india", "middle_class"),
    outfit("in_f_middle_salwar", "Clean Salwar Suit", "ethnic_glam", "Coordinated cotton salwar suit, light dupatta and flat sandals.", "Maintained Indian daywear with modest detailing.", "india", "middle_class"),
    outfit("in_f_middle_formal", "Blouse and Trousers", "business_chic", "Clean modest blouse, straight trousers and practical closed shoes.", "Accessible Indian professional wear without luxury branding.", "india", "middle_class"),
    outfit("in_f_rich_sari", "Tailored Silk Sari", "ethnic_glam", "Fine silk sari, tailored blouse, restrained gold jewelry and polished sandals.", "Affluent Indian styling with premium fabric and precise tailoring.", "india", "rich"),
    outfit("in_f_rich_anarkali", "Tailored Anarkali Set", "ethnic_glam", "Fine Anarkali set, coordinated dupatta and handcrafted juttis.", "Affluent Indian occasion wear with precise tailoring.", "india", "rich"),
    outfit("in_f_rich_pantsuit", "Premium Pantsuit", "business_chic", "Tailored linen-blend pantsuit, silk inner top and fine leather shoes.", "Affluent Indian professional styling with restrained luxury.", "india", "rich"),
    outfit("in_f_rich_lehenga", "Modern Lehenga Set", "evening_glam", "Tailored lehenga, structured blouse, light embroidered dupatta and fine jewelry.", "Premium Indian celebration wear with balanced detailing.", "india", "rich"),
    outfit("in_f_rich_kurta", "Silk Kurta Set", "ethnic_glam", "Fine silk kurta, tailored trousers and premium flat sandals.", "Polished affluent Indian daywear.", "india", "rich"),
    outfit("west_f_poor_denim", "Second-hand Tee and Faded Jeans", "sexy_casual", "Washed second-hand cotton T-shirt, faded straight jeans, thrifted jacket and worn canvas shoes.", "Practical low-income Western clothing with repeated wear and no luxury accessories.", "western", "poor"),
    outfit("west_f_poor_hoodie", "Worn Hoodie and Work Trousers", "street_rebel", "Pilled basic hoodie, inexpensive work trousers and repaired trainers.", "Functional Western clothing chosen for cost, warmth and durability.", "western", "poor"),
    outfit("west_f_middle_casual", "Clean Tee and Everyday Jeans", "sexy_casual", "Clean cotton T-shirt, regular-fit denim, light jacket and simple sneakers.", "Ordinary Western middle-class casual wear without designer details.", "western", "middle_class"),
    outfit("west_f_rich_tailored", "Tailored Blouse and Trousers", "business_chic", "Premium blouse, tailored wool trousers, fine leather belt and polished shoes.", "Affluent Western styling with premium fabric and professional tailoring.", "western", "rich"),
    outfit("in_f_poor_mature", "Fitted Budget Sari", "ethnic_glam", "Low-cost synthetic sari, fitted plain blouse, reused bangles and worn sandals.", "Adult Indian styling that remains modest, affordable and visibly well-used.", "india", "poor", true),
    outfit("west_f_poor_mature", "Fitted Thrifted Top and Jeans", "sexy_casual", "Thrifted fitted cotton top, faded jeans and worn canvas shoes.", "Adult Western styling built from inexpensive second-hand basics.", "western", "poor", true),
    outfit("in_f_middle_mature", "Fitted Kurta Set", "ethnic_glam", "Fitted cotton-blend kurta, straight trousers, light dupatta and block-heel sandals.", "Adult Indian middle-class evening styling with affordable fabrics.", "india", "middle_class", true),
    outfit("west_f_middle_mature", "Fitted Knit and Dark Jeans", "sexy_casual", "Fitted knit top, clean dark jeans and simple ankle boots.", "Adult Western middle-class styling without luxury materials.", "western", "middle_class", true),
    outfit("in_f_rich_mature", "Designer Silk Sari", "ethnic_glam", "Designer silk sari, sculpted tailored blouse, fine jewelry and premium heels.", "Affluent adult Indian evening styling.", "india", "rich", true),
    outfit("west_f_rich_mature", "Silk Evening Dress", "evening_glam", "Bias-cut silk evening dress, fine jewelry and designer heels.", "Affluent adult Western evening styling.", "western", "rich", true),
  ],
  male: [
    outfit("in_m_poor_shirt", "Faded Shirt and Work Trousers", "sexy_casual", "Faded cotton shirt, loose inexpensive work trousers, repaired belt and worn rubber sandals.", "Practical low-income Indian clothing with sweat fading and repaired seams.", "india", "poor"),
    outfit("in_m_poor_kurta", "Simple Kurta and Pajama", "ethnic_glam", "Plain washed cotton kurta, loose pajama trousers and worn sandals.", "Basic everyday Indian clothing, repeatedly washed and carefully reused.", "india", "poor"),
    outfit("in_m_poor_lungi", "Shirt and Lungi", "loungewear", "Faded half-sleeve shirt, checked cotton lungi and worn sandals.", "Low-cost regional Indian daily wear with repeated use.", "india", "poor"),
    outfit("in_m_poor_vest", "Vest and Work Trousers", "loungewear", "Plain cotton vest, loose work trousers and inexpensive rubber sandals.", "Practical clothing for manual work and hot weather.", "india", "poor"),
    outfit("in_m_poor_uniform", "Old Work Uniform", "business_chic", "Faded work shirt, matching trousers and repaired belt.", "Reused Indian workwear with visible mending.", "india", "poor"),
    outfit("in_m_middle_casual", "Checked Shirt and Trousers", "sexy_casual", "Clean checked cotton shirt, regular trousers, simple belt and practical shoes.", "Ordinary Indian middle-class daily wear.", "india", "middle_class"),
    outfit("in_m_middle_kurta", "Cotton Kurta and Chinos", "ethnic_glam", "Clean cotton kurta, regular chinos and simple sandals.", "Contemporary Indian middle-class casual wear.", "india", "middle_class"),
    outfit("in_m_middle_office", "Office Shirt and Trousers", "business_chic", "Pressed cotton shirt, regular formal trousers and affordable leather shoes.", "Accessible Indian office wear with neat maintenance.", "india", "middle_class"),
    outfit("in_m_middle_polo", "Polo and Jeans", "sexy_casual", "Cotton polo shirt, regular jeans and clean basic sneakers.", "Common Indian weekend clothing without premium branding.", "india", "middle_class"),
    outfit("in_m_middle_nehru", "Nehru Jacket and Kurta", "ethnic_glam", "Cotton kurta, simple Nehru jacket and straight trousers.", "Moderate-cost Indian occasion wear.", "india", "middle_class"),
    outfit("in_m_rich_bundgala", "Tailored Bandhgala Set", "ethnic_glam", "Premium tailored bandhgala, fine trousers and polished leather shoes.", "Affluent Indian formal styling with fine fabric and precise tailoring.", "india", "rich"),
    outfit("in_m_rich_suit", "Tailored Business Suit", "business_chic", "Fine wool-blend suit, premium cotton shirt and polished leather shoes.", "Affluent Indian professional styling with precise fit.", "india", "rich"),
    outfit("in_m_rich_kurta", "Silk Kurta Set", "ethnic_glam", "Fine silk kurta, tailored churidar and handcrafted mojaris.", "Premium Indian celebration wear with restrained detailing.", "india", "rich"),
    outfit("in_m_rich_linen", "Premium Linen Casual", "resort_summer", "Fine linen shirt, tailored trousers and premium loafers.", "Affluent Indian warm-weather casual wear.", "india", "rich"),
    outfit("in_m_rich_sherwani", "Tailored Sherwani", "evening_glam", "Tailored sherwani, fitted trousers and handcrafted mojaris.", "Formal affluent Indian occasion wear.", "india", "rich"),
    outfit("west_m_poor_workwear", "Second-hand Tee and Work Trousers", "sexy_casual", "Washed second-hand T-shirt, inexpensive work trousers, thrifted overshirt and worn trainers.", "Practical low-income Western clothing with repeated wear.", "western", "poor"),
    outfit("west_m_poor_flannel", "Faded Flannel and Jeans", "street_rebel", "Faded flannel shirt, plain undershirt, worn jeans and repaired work shoes.", "Affordable Western workwear with no premium details.", "western", "poor"),
    outfit("west_m_middle_casual", "Polo and Everyday Chinos", "sexy_casual", "Cotton polo, regular chinos, simple belt and clean basic sneakers.", "Ordinary Western middle-class casual wear.", "western", "middle_class"),
    outfit("west_m_rich_suit", "Tailored Wool Suit", "business_chic", "Fine wool suit, premium cotton shirt, silk tie and polished leather shoes.", "Affluent Western business styling with bespoke finishing.", "western", "rich"),
    outfit("in_m_poor_mature", "Open-collar Budget Shirt", "sexy_casual", "Low-cost cotton shirt with open collar, worn work trousers and repaired sandals.", "Adult Indian styling that remains practical and low-cost.", "india", "poor", true),
    outfit("west_m_poor_mature", "Fitted Thrifted Tee and Jeans", "sexy_casual", "Thrifted fitted T-shirt, faded jeans and worn work boots.", "Adult Western styling using inexpensive second-hand basics.", "western", "poor", true),
    outfit("in_m_middle_mature", "Open-collar Shirt and Trousers", "sexy_casual", "Clean cotton shirt with open collar, regular trousers and simple leather shoes.", "Adult Indian middle-class evening styling.", "india", "middle_class", true),
    outfit("west_m_middle_mature", "Fitted Henley and Dark Jeans", "sexy_casual", "Fitted cotton henley, clean dark jeans and simple boots.", "Adult Western middle-class casual styling.", "western", "middle_class", true),
    outfit("in_m_rich_mature", "Silk Bandhgala Evening Set", "ethnic_glam", "Fine silk bandhgala, tailored trousers and premium leather shoes.", "Affluent adult Indian evening styling.", "india", "rich", true),
    outfit("west_m_rich_mature", "Open-collar Silk Evening Suit", "evening_glam", "Silk open-collar shirt, tailored evening trousers and designer leather shoes.", "Affluent adult Western evening styling.", "western", "rich", true),
  ],
};

const CONTEXTUAL_FOOTWEAR: Record<"female" | "male", Record<CulturalContext, Record<Lifestyle, FootwearOption[]>>> = {
  female: {
    india: {
      poor: [{ id: "in_f_rubber_sandals", label: "Worn Rubber Sandals", category: "sandals", desc: "Inexpensive repaired rubber sandals." }, { id: "in_f_old_flats", label: "Old Flat Sandals", category: "sandals", desc: "Older everyday flat sandals." }, { id: "in_f_basic_slippers", label: "Basic Slippers", category: "sandals", desc: "Low-cost slip-on slippers." }],
      middle_class: [{ id: "in_f_simple_flats", label: "Simple Flat Sandals", category: "sandals", desc: "Clean affordable everyday flat sandals." }, { id: "in_f_basic_juttis", label: "Simple Juttis", category: "ethnic", desc: "Affordable lightly decorated juttis." }, { id: "in_f_everyday_sneakers", label: "Everyday Sneakers", category: "sneakers", desc: "Clean basic sneakers." }],
      rich: [{ id: "in_f_premium_heels", label: "Premium Heeled Sandals", category: "heels", desc: "Fine leather heeled sandals." }, { id: "in_f_fine_juttis", label: "Handcrafted Juttis", category: "ethnic", desc: "Fine handcrafted juttis." }, { id: "in_f_leather_flats", label: "Premium Leather Flats", category: "sandals", desc: "Fine leather flat sandals." }],
    },
    western: {
      poor: [{ id: "west_f_worn_canvas", label: "Worn Canvas Shoes", category: "sneakers", desc: "Inexpensive canvas shoes with repaired wear." }],
      middle_class: [{ id: "west_f_basic_sneakers", label: "Basic Sneakers", category: "sneakers", desc: "Clean everyday sneakers." }],
      rich: [{ id: "west_f_designer_heels", label: "Designer Leather Heels", category: "heels", desc: "Premium designer leather heels." }],
    },
  },
  male: {
    india: {
      poor: [{ id: "in_m_rubber_sandals", label: "Worn Rubber Sandals", category: "sandals", desc: "Inexpensive repaired rubber sandals." }, { id: "in_m_old_slippers", label: "Old Slippers", category: "sandals", desc: "Older low-cost slip-on slippers." }, { id: "in_m_repaired_shoes", label: "Repaired Work Shoes", category: "dress", desc: "Affordable work shoes with visible repairs." }],
      middle_class: [{ id: "in_m_practical_shoes", label: "Practical Shoes", category: "dress", desc: "Clean affordable everyday shoes." }, { id: "in_m_basic_sneakers", label: "Basic Sneakers", category: "sneakers", desc: "Clean everyday sneakers." }, { id: "in_m_simple_sandals", label: "Simple Leather Sandals", category: "sandals", desc: "Affordable everyday leather sandals." }],
      rich: [{ id: "in_m_premium_mojaris", label: "Premium Leather Mojaris", category: "ethnic", desc: "Fine handcrafted leather mojaris." }, { id: "in_m_polished_oxfords", label: "Polished Oxford Shoes", category: "dress", desc: "Fine polished leather dress shoes." }, { id: "in_m_premium_loafers", label: "Premium Loafers", category: "dress", desc: "Fine leather loafers." }],
    },
    western: {
      poor: [{ id: "west_m_repaired_trainers", label: "Repaired Trainers", category: "sneakers", desc: "Worn inexpensive trainers with visible repairs." }],
      middle_class: [{ id: "west_m_basic_sneakers", label: "Basic Sneakers", category: "sneakers", desc: "Clean everyday sneakers." }],
      rich: [{ id: "west_m_premium_oxfords", label: "Premium Oxford Shoes", category: "dress", desc: "Fine polished leather Oxford shoes." }],
    },
  },
};

export function getContextualOutfits(gender: "female" | "male", culture: CulturalContext, lifestyle: Lifestyle, mode: WardrobeMode = "normal") {
  return CONTEXTUAL_OUTFITS[gender].filter((item) => item.culture === culture && item.lifestyle === lifestyle && Boolean(item.matureOnly) === (mode === "mature"));
}

export function getContextualFootwear(gender: "female" | "male", culture: CulturalContext, lifestyle: Lifestyle) {
  return CONTEXTUAL_FOOTWEAR[gender][culture][lifestyle];
}
