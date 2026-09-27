import type { OutfitOption } from "./types";

export const OUTFITS_FEMALE: OutfitOption[] = [
  // 1. ALLURING CASUAL & MODERN STREETWEAR
  {
    id: "fem_sexy_casual_denim",
    label: "Fitted Crop Tank & High-Waist Denim",
    type: "sexy_casual",
    pieces: "Form-fitting ribbed knit crop tank top, high-waisted distressed straight-leg denim jeans, minimal gold pendant necklace, leather ankle boots.",
    fitDesc: "Flattering figure-hugging crop silhouette highlighting toned waist and midriff with effortless modern street appeal."
  },
  {
    id: "fem_halter_backless_top",
    label: "Tie-Back Halter Top & Flare Jeans",
    type: "sexy_casual",
    pieces: "Silky draped halter neck top tied open at the back, high-waisted vintage washed flare jeans, platform leather mules, chunky hoop earrings.",
    fitDesc: "Reveals sun-warmed bare shoulders and lower back with seductive 70s-inspired feminine casual elegance."
  },
  {
    id: "fem_corset_cargo_pants",
    label: "Satin Corset Bustier & Low-Rise Baggy Cargos",
    type: "sexy_casual",
    pieces: "Structured boned satin corset bustier with sweetheart neckline, relaxed low-rise parachute cargo trousers, chunky designer sneakers.",
    fitDesc: "Sensual high-contrast silhouette pairing tight structured waist-slimming corsetry with relaxed urban street energy."
  },
  {
    id: "fem_leather_shorts_camisole",
    label: "Lace Camisole & Tailored Leather Shorts",
    type: "sexy_casual",
    pieces: "Delicate silk camisole trimmed with eyelash lace, tailored high-rise lambskin leather shorts, sheer tights, pointed ankle boots.",
    fitDesc: "Magnetic, sultry, and confident; blends delicate romantic silk with polished edgy leather textures."
  },

  // 2. EVENING GLAMOUR & SEDUCTION
  {
    id: "fem_evening_slip_dress",
    label: "Backless Silk Satin Slip Dress",
    type: "evening_glam",
    pieces: "Bias-cut liquid silk satin midi slip dress with a cowl neckline and low backless drape, delicate strap stiletto heels, diamond drop earrings.",
    fitDesc: "Sensual fluid silk clinging naturally to feminine curves, radiating luxurious evening glamour and understated red-carpet allure."
  },
  {
    id: "fem_plunging_velvet_gown",
    label: "Plunging Velvet Gown with Thigh Slit",
    type: "evening_glam",
    pieces: "Deep plunge neckline midnight velvet floor-length gown with high architectural leg slit, crystal strap accents, strappy metallic heels.",
    fitDesc: "Rich opulent texture hugging hips and bust, revealing leg movement with magnetic dramatic high-society seduction."
  },
  {
    id: "fem_sheer_corset_gown",
    label: "Sheer Boned Corset Gown & Chiffon Skirt",
    type: "evening_glam",
    pieces: "Translucent mesh corset gown with exposed satin boning, flowing tiered chiffon floor-length skirt, delicate waist jewelry.",
    fitDesc: "Ethereal and breathtakingly sensual; showcases sculpted waistline with dramatic diaphanous skirt motion."
  },
  {
    id: "fem_bodycon_cocktail_dress",
    label: "Asymmetric Cutout Bodycon Cocktail Mini",
    type: "evening_glam",
    pieces: "One-shoulder bodycon mini dress with diagonal ribcage cutout, metallic mesh clutch, sculptural strappy heels.",
    fitDesc: "Body-sculpting stretch knit highlighting athletic curves and collarbones with modern nightlife sophistication."
  },

  // 3. ATHLETIC, GYM & FITNESS
  {
    id: "fem_athletic_gym_set",
    label: "Seamless Compression Workout Set",
    type: "athletic",
    pieces: "Molded scoop-neck athletic sports bra, high-waisted seamless compression leggings with contour shading, lightweight running trainers.",
    fitDesc: "Sculpted athletic fit accentuating toned abs, glutes, and feminine silhouette with functional activewear realism."
  },
  {
    id: "fem_tennis_skirt_set",
    label: "Pleated Tennis Skort & Cropped Zip Top",
    type: "athletic",
    pieces: "High-waisted knife-pleated athletic mini tennis skort, fitted cropped quarter-zip mock neck top, retro white court sneakers with crew socks.",
    fitDesc: "Youthful, energetic, and leg-lengthening sporty aesthetic with playful athletic charm."
  },
  {
    id: "fem_yoga_bodysuit",
    label: "Open-Back Ribbed Yoga Bodysuit",
    type: "athletic",
    pieces: "One-piece seamless ribbed knit unitard bodysuit with crisscross open back, slip-on canvas slides, gym gym towel slung over shoulder.",
    fitDesc: "Streamlined second-skin silhouette emphasizing dancer posture, spinal alignment, and athletic grace."
  },

  // 4. SUMMER, RESORT, BEACH & SUNSET
  {
    id: "fem_summer_resort_slit",
    label: "Breezy Linen Sundress with Thigh Slit",
    type: "resort_summer",
    pieces: "Sun-drenched lightweight washed linen sundress with thin spaghetti straps, thigh-high side slit, woven espadrille wedges, shell necklace.",
    fitDesc: "Airy flowing fabric fluttering in the breeze, revealing sun-kissed legs and bare shoulders with relaxed coastal sensuality."
  },
  {
    id: "fem_crochet_knit_coverup",
    label: "Open Crochet Knit Maxi Dress & Swimwear",
    type: "resort_summer",
    pieces: "Hand-crocheted open-weave semi-sheer knit maxi coverup dress over minimalist matching bikini, woven straw beach tote, bare sun-tanned feet.",
    fitDesc: "Effortlessly sexy bohemian beach luxury; sheer textured knit reveals swimwear silhouette with golden hour luminescence."
  },
  {
    id: "fem_floral_wrap_dress",
    label: "Silk Chiffon Deep V-Neck Wrap Dress",
    type: "resort_summer",
    pieces: "Flowing silk chiffon wrap dress with plunging crossover neckline, ruffled high-low hemline, leather ankle-tie sandals.",
    fitDesc: "Feminine, romantic, and alluring with every step as the fluttering hemline catches the warm sea breeze."
  },
  {
    id: "fem_linen_palazzo_set",
    label: "Tie-Front Linen Crop Top & Wide Palazzo Pants",
    type: "resort_summer",
    pieces: "Knotted tie-front linen crop top exposing midriff, high-rise breezy pleated wide-leg palazzo trousers, oversized dark sunglasses.",
    fitDesc: "Sophisticated Mediterranean yacht resort look; chic, elongated leg silhouette, sun-drenched glamour."
  },

  // 5. BUSINESS CHIC & POWER GLAMOUR
  {
    id: "fem_power_suit_corset",
    label: "Tailored Blazer over Satin Corset & Cigarette Pants",
    type: "business_chic",
    pieces: "Sharp structured wool blazer draped open over a fitted satin bustier, high-waisted cigarette trousers, pointed stiletto pumps.",
    fitDesc: "Striking juxtaposition of razor-sharp authority over seductive fitted corsetry; confident, powerful, and captivating."
  },
  {
    id: "fem_deep_v_blazer_dress",
    label: "Tuxedo Blazer Mini Dress",
    type: "business_chic",
    pieces: "Double-breasted tailored tuxedo mini dress worn solo with plunging shawl lapels, cinched crystal belt, sheer stockings, classic stilettos.",
    fitDesc: "Commanding executive seduction; sharp shoulders taper to a cinched waist and bare sculpted legs."
  },
  {
    id: "fem_unbuttoned_silk_shirt",
    label: "Plunging Silk Blouse & Leather Pencil Skirt",
    type: "business_chic",
    pieces: "Liquid silk button-down shirt unbuttoned to sternum with rolled cuffs, high-waisted buttery leather pencil skirt with back kick-slit, pumps.",
    fitDesc: "Effortless high-powered allure; fluid silk drape contrasted against body-hugging structured leather."
  },

  // 6. STREET REBEL & LEATHER EDGE
  {
    id: "fem_leather_biker_dress",
    label: "Cropped Biker Leather Jacket & Bodycon Mini",
    type: "street_rebel",
    pieces: "Distressed black leather motorcycle jacket over a ribbed bodycon mini dress, sheer patterned tights, chunky combat platform boots.",
    fitDesc: "Edgy, rebellious, and magnetically sexy with sharp rock-and-roll attitude and silhouette-defining lines."
  },
  {
    id: "fem_leather_corset_jeans",
    label: "Molded Leather Corset & Distressed Black Denim",
    type: "street_rebel",
    pieces: "Structured black leather corset top with zip front, low-slung distressed washed black skinny jeans, layered silver chains, pointed boots.",
    fitDesc: "Dark, dangerous, and provocative street aesthetic accentuating waistline and clavicles."
  },

  // 7. SENSUAL LOUNGEWEAR & INTIMATE
  {
    id: "fem_cozy_off_shoulder",
    label: "Off-Shoulder Cashmere Knit & Boyshorts",
    type: "loungewear",
    pieces: "Plush oversized cashmere sweater slipping off one bare shoulder, soft ribbed knit boy shorts, cozy wool crew socks, messy bun.",
    fitDesc: "Intimate, warm, and casually seductive loungewear highlighting exposed clavicles, bare legs, and tactile softness."
  },
  {
    id: "fem_silk_camisole_shorts",
    label: "Lace-Trimmed Mulberry Silk Tap Set",
    type: "loungewear",
    pieces: "Sheer French lace-trimmed mulberry silk camisole with thin adjustable straps, matching flirty silk tap shorts, silk robe loosely tied.",
    fitDesc: "Delicate boudoir elegance; shimmering liquid silk draping softly against bare skin with quiet feminine allure."
  },

  // 8. ETHNIC GLAMOUR & REGAL HERITAGE
  {
    id: "fem_ethnic_georgette_saree",
    label: "Embroidered Georgette Saree & Sleeveless Blouse",
    type: "ethnic_glam",
    pieces: "Flowing semi-sheer georgette saree with delicate zari border drape, fitted sleeveless sweetheart blouse, slender silver bangles, dangling jhumkas.",
    fitDesc: "Timeless sensual drape celebrating traditional feminine grace, accentuating the waistline and midriff with shimmering fabric movement."
  },
  {
    id: "fem_velvet_lehenga_choli",
    label: "Sweetheart Velvet Lehenga & Sheer Dupatta",
    type: "ethnic_glam",
    pieces: "Fitted royal velvet choli blouse with a deep sweetheart neckline, voluminous flared kalidar lehenga skirt, featherlight embroidered organza dupatta.",
    fitDesc: "Regal bridal majesty; opulent embroidery highlighting collarbone contour and statuesque waistline."
  },
  {
    id: "fem_chikankari_kurti_sharara",
    label: "Chikankari Short Kurti & Flared Sharara",
    type: "ethnic_glam",
    pieces: "Fine pastel Lucknowi chikankari embroidered short kurti top, flared dramatic georgette sharara trousers, sheer scalloped dupatta.",
    fitDesc: "Poised aristocratic grace; sheer threadwork and flowing flared silhouette creating mesmerizing movement."
  },
  // ── POOR INDIAN WOMEN — everyday, working, festive-budget, and sensual variants ──
  // All entries carry lifestyle:"poor" + culture:"india" so the eligibility
  // filter surfaces them automatically when lifestyle = poor & origin = india.

  // — Daily wear —
  {
    id: "fem_poor_ind_cotton_salwar_faded",
    label: "Faded Cotton Salwar-Kameez",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Faded printed cotton kameez, simple salwar trousers with frayed cuffs, mismatched dupatta, rubber chappal sandals, small cloth tote.",
    fitDesc: "Everyday Indian working-class wear; washed-out colour, honest visible wear, modest silhouette."
  },
  {
    id: "fem_poor_ind_kurti_leggings",
    label: "Basic Kurti & Worn Leggings",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Plain cotton short kurti with minimal neckline embroidery, thinning black leggings faded at the knees, worn chappals.",
    fitDesc: "Common urban-village Indian outfit; functional and unselfconscious, fabric pilled from repeated washing."
  },
  {
    id: "fem_poor_ind_synthetic_kurti_dupatta",
    label: "Synthetic Kurti & Thin Dupatta",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Bright polyester kurti in a floral print, thin dupatta over one shoulder, rubber chappals, thin glass bangle stack.",
    fitDesc: "Affordable synthetic fabric; vivid but slightly shiny under light; typical of budget market stalls."
  },
  {
    id: "fem_poor_ind_cotton_sari_plain",
    label: "Plain Cotton Saree & Blouse",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Simple cotton saree in solid or checked fabric, practical pre-stitched pleating, worn short blouse, rubber sandals or bare feet.",
    fitDesc: "Rural-everyday saree draping; cotton slightly crumpled and creased from a full day of wear."
  },
  {
    id: "fem_poor_ind_half_sari",
    label: "Half-Saree (Langa Voni)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Simple cotton langa skirt with a tucked half-saree drape, printed blouse, minimal plastic bangles, rubber flats.",
    fitDesc: "South-Indian regional everyday garment; modest, colourful, often slightly faded at the border."
  },
  {
    id: "fem_poor_ind_kurta_patiala",
    label: "Loose Kurta & Patiala Salwar",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Oversize printed cotton kurta, gathered Patiala-cut salwar ballooning at the thighs, inexpensive dupatta, rubber block sandals.",
    fitDesc: "Practical Punjabi-influenced silhouette; comfortable and modest, fabric soft from many washes."
  },
  {
    id: "fem_poor_ind_maxi_dress",
    label: "Printed Cotton Maxi Dress",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Full-length cotton maxi dress in floral block-print, elasticised waistband, plain neckline, worn flat chappals.",
    fitDesc: "Simple loose-fitting maxi common in coastal and lower-income households; slightly sun-bleached."
  },

  // — Working & labour wear —
  {
    id: "fem_poor_ind_domestic_worker",
    label: "Domestic Worker Cotton Set",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Worn cotton salwar-kameez (often second-hand), mismatched dupatta repurposed as head-cover, cracked rubber sandals, no jewellery.",
    fitDesc: "Domestic-worker realism; laundered but visibly aged fabric, modest silhouette, unselfconscious practicality."
  },
  {
    id: "fem_poor_ind_field_saree",
    label: "Tucked Field-Work Saree",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Coarse cotton saree tucked high at the waist for mobility, short blouse with missing hooks, bare feet dusty from the field.",
    fitDesc: "Rural agricultural woman; saree lifted and knotted for labour movement, practical not decorative."
  },
  {
    id: "fem_poor_ind_street_vendor",
    label: "Bright Saree & Cloth Apron (vendor)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Bright patterned synthetic saree, faded cotton blouse, cloth apron tucked at the waist, rubber sandals.",
    fitDesc: "Street-vendor or market-stall character; colourful despite wear, fabric stretched at the back and waist."
  },

  // — Budget festive & occasion —
  {
    id: "fem_poor_ind_festive_cotton_saree",
    label: "Festive Cotton Saree (budget)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Better-condition cotton saree with a simple zari or printed border, tighter blouse, a few glass bangles, rubber block-heel sandals.",
    fitDesc: "Effort-dressed occasion wear within limited budget; tidy and intentional, without luxury detail."
  },
  {
    id: "fem_poor_ind_synthetic_lehenga_budget",
    label: "Synthetic Budget Lehenga Skirt",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Polyester lehenga skirt with printed border, plain short blouse, thin dupatta, imitation-silver jewellery, flat sandals.",
    fitDesc: "Inexpensive festive wear; shiny synthetic fabric catches light cheaply; visibly different from embroidered originals."
  },
  {
    id: "fem_poor_ind_churidar_suit",
    label: "Simple Churidar Suit",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Plain churidar bottoms, modest kameez top, small dupatta draped over the chest, cheap studs, worn flat chappals.",
    fitDesc: "Affordable and tidy everyday-to-festive suit; relies on colour rather than embellishment."
  },

  // — Layered & climate-adaptive —
  {
    id: "fem_poor_ind_shawl_layer",
    label: "Cotton Salwar with Woollen Shawl",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Cotton salwar-kameez under a thick hand-spun woollen shawl wrapped tightly, inexpensive socks under rubber sandals.",
    fitDesc: "Winter layering for low-income Indian character; shawl worn as a practical warmth layer, not a fashion statement."
  },
  {
    id: "fem_poor_ind_dupatta_headscarf",
    label: "Headscarf Kurti & Salwar",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Cotton kurti and salwar, dupatta repurposed as a practical headscarf protecting from sun or dust, plain rubber sandals.",
    fitDesc: "Functional headscarf styling common in rural northern India; modest and weather-adaptive."
  },

  // — Youth kurti-jeans variant —
  {
    id: "fem_poor_ind_kurti_faded_jeans",
    label: "Short Kurti & Faded Jeans",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Bright synthetic short kurti with simple neckline embroidery, heavily faded and slightly torn skinny jeans, low wedge sandals, imitation-jewellery hoops.",
    fitDesc: "Young urban-poor Indian streetwear; mixed modern-traditional with affordable fabrics and confident everyday energy."
  },

  // — More normal everyday outfits —

  {
    id: "fem_poor_ind_lungi_blouse",
    label: "Lungi & Blouse (coastal/south India)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Checked cotton lungi wrapped around the waist, short cotton blouse, bare feet or rubber slippers, hair tied at the nape.",
    fitDesc: "Coastal south-Indian lower-income daily wear; practical and cool, unselfconscious regional style."
  },
  {
    id: "fem_poor_ind_ghagra_choli_rajasthani",
    label: "Simple Ghagra-Choli (Rajasthani village)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Faded cotton ghagra skirt with mirror-work border, short knotted choli blouse, thin odhni worn over the head, worn juttis or bare feet.",
    fitDesc: "Rajasthani village-woman everyday garment; cotton washed repeatedly, mirrors slightly tarnished, vibrant under sunlight."
  },
  {
    id: "fem_poor_ind_saree_north_tuck",
    label: "North-Indian Working Tuck Saree",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Plain cotton saree with a quick front-tuck, blouse with visible wear at the armpits, waist cloth belt knotted for support, worn canvas sneakers.",
    fitDesc: "Urban-north-India working saree style; tucked in front for ease of movement, very lived-in fabric."
  },
  {
    id: "fem_poor_ind_tribal_drape",
    label: "Tribal Cotton Wrap Drape",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Handwoven cotton wrap in earthy stripes, tied across the chest and knotted at the hip, bare feet, simple beaded necklace.",
    fitDesc: "Tribal-community or adivasi garment; minimalist, organic texture, genuine hand-craft without embellishment."
  },
  {
    id: "fem_poor_ind_college_budget",
    label: "Budget Kurti & Churidar (college girl)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Inexpensive printed cotton kurti, plain churidar, small backpack made of cheap nylon, worn flat sandals, single thin dupatta draped at the neck.",
    fitDesc: "Young poor urban student; neat but inexpensive, fabric faded at collar and cuffs from frequent washing."
  },
  {
    id: "fem_poor_ind_night_salwar",
    label: "Cotton Night Salwar Set (home)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Loose floral cotton nightwear top and salwar, bare feet on a concrete floor, hair open or in a loose braid.",
    fitDesc: "Home evening wear for a low-income Indian household; threadbare at the collar and elbows, practically comfortable."
  },
  {
    id: "fem_poor_ind_monsoon_wear",
    label: "Monsoon Salwar & Plastic Sandals",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Short cotton salwar-kameez hitched slightly at the hem, cheap plastic sandals, dupatta tucked in at the waist, wet-slicked hair, rain-dotted fabric.",
    fitDesc: "Indian monsoon everyday — fabric damp and sticking at the arms, practical concessions to heavy rain on a budget."
  },
  {
    id: "fem_poor_ind_tea_stall_worker",
    label: "Tea-Stall Worker Saree",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Worn synthetic saree in a dull colour, blouse with rolled-up sleeves, cloth wrapped around the wrist as a towel, rubber sandals, hair pulled back tightly.",
    fitDesc: "Small-roadside-dhaba or tea-stall worker character; stained at the blouse cuffs, saree pallu tucked in for work."
  },
  {
    id: "fem_poor_ind_construction_labour",
    label: "Construction-Site Labour Wear",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Rough cotton saree in a dark or faded colour, short blouse with visible mending, head-cloth tied as a sun-shield, worn rubber sandals, calloused hands.",
    fitDesc: "Female construction-site worker realism; dust on the fabric, sun-darkened skin, posture of physical labour."
  },
  {
    id: "fem_poor_ind_widow_white",
    label: "Plain White Cotton Saree (widow)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Plain unbleached or off-white cotton saree, simple blouse without embellishment, no bangles or jewellery, worn flat sandals.",
    fitDesc: "Traditional widowhood attire in parts of rural India; austere, quiet, and without colour or ornamentation."
  },
  {
    id: "fem_poor_ind_hospital_worker",
    label: "Basic Cotton Uniform (hospital aide)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Plain cotton salwar-kameez in an institution colour (pale blue or white), worn flat shoes, hair netted or tightly braided, no jewellery.",
    fitDesc: "Low-grade hospital or clinic aide; regulation clothing worn many times, functional and unadorned."
  },
  {
    id: "fem_poor_ind_street_nighttime",
    label: "Night-Street Kurti & Shawl",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Plain cotton kurti and leggings, thick dupatta pulled around the shoulders for warmth and modesty, worn sandals, cautious posture on a lit street.",
    fitDesc: "Night-time inner-city street look for a lower-income Indian woman; layers of modesty and warmth, careful posture."
  },
  {
    id: "fem_poor_ind_stitched_patch_suit",
    label: "Patched & Repaired Salwar Suit",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    pieces: "Cotton kameez with a clearly visible patch on one sleeve, mismatched thread repair at the collar, faded salwar, worn flat chappals, no dupatta.",
    fitDesc: "Extreme-budget visible-mending realism; fabric tells a story of repeated repair and careful stewardship of a single garment."
  },

  // — Confident / sensual variants (matureOnly) —
  {
    id: "fem_poor_ind_form_fitting_kurti",
    label: "Fitted Cotton Kurti (confident)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Slim-fit cotton kurti with a modest V-neckline, slightly stretched fabric outlining the torso, worn leggings, simple chappals.",
    fitDesc: "Everyday cotton that happens to be form-fitting; confident posture within budget clothing, no luxury staging."
  },
  {
    id: "fem_poor_ind_blouse_petticoat",
    label: "Blouse & Petticoat (undressed saree)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Short cotton saree blouse and floor-length petticoat, saree partially unwound resting on the shoulder, barefoot on a plain floor.",
    fitDesc: "Intimate home-setting styling; blouse and petticoat are standard base layers under a saree, shown in a private resting moment."
  },
  {
    id: "fem_poor_ind_wet_cotton_saree",
    label: "Wet Cotton Saree (post-work)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Plain cotton saree clinging from water or sweat, short blouse, bare feet, wet hair tied loosely at the back.",
    fitDesc: "Dramatic realism — after fetching water or working in rain; fabric heavy and translucent, no romanticisation of poverty."
  },
  {
    id: "fem_poor_ind_sleeveless_blouse_saree",
    label: "Sleeveless Blouse & Thin Saree (summer)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Sleeveless fitted cotton blouse, thin transparent cotton saree draped loosely, bare feet, slight visible waist midriff.",
    fitDesc: "Hot-weather practical dressing; sensuality arising from climate necessity rather than styling choice."
  },
  {
    id: "fem_poor_ind_unbuttoned_blouse",
    label: "Open-Collar Blouse & Saree (private)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Cotton saree blouse with top two hooks unfastened, plain cotton saree draped loosely, bare feet, relaxed shoulder posture.",
    fitDesc: "Private home moment — fastening partly undone; domestic intimacy without luxury, authentic to the garment's fastenings."
  },
  {
    id: "fem_poor_ind_open_pallu_saree",
    label: "Open-Pallu Saree (breeze, summer)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Thin cotton saree with the pallu dropped and trailing loose, short blouse, waist midriff exposed, bare feet, damp skin from heat.",
    fitDesc: "Summer-heat saree carelessness; pallu allowed to fall free exposing midriff and back, natural and unstaged."
  },
  {
    id: "fem_poor_ind_ghat_bathing",
    label: "Ghat-Bathing Saree (river)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Single thin cotton saree worn over a short blouse, standing at water's edge, saree wet and clinging, hair loose and damp, bare feet on stone.",
    fitDesc: "Rural open-air bathing at a river ghat; cotton plastered to the body by water, unselfconscious dignity, no staging."
  },
  {
    id: "fem_poor_ind_low_hip_saree",
    label: "Low-Hip Saree Drape (working posture)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Cotton saree draped very low at the hip showing midriff broadly, short blouse, waist rolls unguarded, bare feet or flat sandals.",
    fitDesc: "Common low-hip draping in certain regions — unselfconsciously revealing broad midriff without any modelling intent."
  },
  {
    id: "fem_poor_ind_back_blouse_exposed",
    label: "Deep-Back Blouse & Cotton Saree",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Cotton saree blouse cut with a deep U-back (common in southern styles), plain cotton saree, bare back visible above the waist, simple posture.",
    fitDesc: "South-Indian deep-back blouse styling, standard in many regions; not a luxury feature — common in affordable cotton blouses."
  },
  {
    id: "fem_poor_ind_night_slip",
    label: "Cotton Night-Slip & Bare Shoulders",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Simple loose cotton slip/chemise worn as nightwear, thin straps, bare shoulders and arms, bare feet on a concrete floor, hair loose or braided.",
    fitDesc: "Low-income household nighttime intimacy; cheap cotton sleveless slip is common nightwear; private setting, soft available light."
  },
  {
    id: "fem_poor_ind_mirror_scene",
    label: "Kurti & Leggings (mirror scene)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Fitted cotton kurti slightly raised while adjusting in a cracked mirror, worn leggings, bare feet, caught in a private self-aware moment.",
    fitDesc: "Private dressing-room moment in a modest home; ordinary budget clothing, self-appraisal, natural body posture."
  },
  {
    id: "fem_poor_ind_post_bath_towel",
    label: "Post-Bath Towel Wrap (home, private)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Thin worn cotton bath towel wrapped around the torso, hair dripping loose, bare feet on a damp concrete bathroom floor, plain wall behind.",
    fitDesc: "Intimate post-bath moment in a low-income home; threadbare towel, unposed, completely private setting."
  },
  {
    id: "fem_poor_ind_sweat_kurta",
    label: "Sweat-Soaked Kurta & Salwar (noon)",
    type: "ethnic_glam",
    culture: "india",
    lifestyle: "poor",
    matureOnly: true,
    pieces: "Cotton kurta darkened with sweat at the back, underarms, and collar, salwar slightly crumpled, rubber sandals, hair stuck to the neck.",
    fitDesc: "Midday summer labour realism; sweat-transparent fabric, no glamour, honest physical effort visible in the clothing and posture."
  },
  {
    id: "fem_mature_sensual_saree",
    label: "Satin Saree & Fitted Blouse",
    type: "ethnic_glam",
    matureOnly: true,
    pieces: "Fluid satin saree with a controlled waist drape, fitted short-sleeve blouse, delicate waist chain, small earrings, low block heels.",
    fitDesc: "Adult sensual Indian evening styling with elegant drape, confident posture, and tasteful emphasis on silhouette and movement."
  },
  {
    id: "fem_mature_glam_lehenga",
    label: "Modern Lehenga & Draped Dupatta",
    type: "ethnic_glam",
    matureOnly: true,
    pieces: "Modern fitted lehenga blouse with a high-waisted embroidered skirt, lightweight dupatta draped over one shoulder, metallic bangles, heeled sandals.",
    fitDesc: "Mature celebration styling with polished glamour, confident adult presence, and refined Indian textile detail."
  }
];
