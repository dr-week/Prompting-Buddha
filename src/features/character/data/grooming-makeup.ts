import type { GroomingOption, ConditionOption } from "./types";

export const MAKEUP_OPTIONS_FEMALE: GroomingOption[] = [
  {
    id: "fem_soft_glam",
    label: "Soft Glam & Glossy Lips",
    desc: "Flawless dewy skin finish, delicate winged eyeliner, fluttery defined eyelashes, softly contoured cheekbones with warm champagne highlighter, nude glossy lips."
  },
  {
    id: "fem_bold_red_lip",
    label: "Bold Red Lip & Minimal Eyes",
    desc: "Vibrant matte scarlet red lipstick, clean luminous porcelain skin, brushed feathered brows, subtle tightline mascara, captivating confident allure."
  },
  {
    id: "fem_nomakeup_glow",
    label: "No-Makeup Natural Radiant Glow",
    desc: "Zero heavy cosmetics; ultra-hydrated dewy skin with authentic micro-pores, groomed natural eyebrows, clear lip balm, soft natural rosy cheek flush."
  },
  {
    id: "fem_sunkissed_bronzed",
    label: "Sun-Kissed Bronzed & Freckles",
    desc: "Golden warm bronzer across cheekbones and bridge of nose, faint natural sun freckles, peachy nude lips, beachy glowing summer aesthetic."
  },
  {
    id: "fem_smokey_kohl",
    label: "Smokey Kohl Dramatic Eyes",
    desc: "Deep smudged black kohl eyeliner, bronze and charcoal eyeshadow blending, intense magnetic gaze, neutral matte muted lips."
  },
  {
    id: "fem_postworkout_sweaty",
    label: "Sweaty Post-Workout Flush",
    desc: "Fine glistening beads of sweat on collarbones and forehead, flushed pink cheeks, parted lips, heated athletic intensity and natural allure."
  },
  {
    id: "fem_editorial_wetlook",
    label: "High-Fashion Editorial Wet-Look",
    desc: "Glass-skin reflective sheen, architectural brow lamination, wet-look glossy eyelids, sculpted avant-garde facial contours."
  },
  {
    id: "fem_tear_stained",
    label: "Tear-Stained Vulnerable Beauty",
    desc: "Subtle mascara smudge trace, glistening moist lower eyelids, flushed nose tip and cheeks, raw vulnerable emotional authenticity."
  }
];

export const GROOMING_OPTIONS_MALE: GroomingOption[] = [
  {
    id: "male_heavy_stubble",
    label: "Heavy 5 O'Clock Stubble",
    desc: "Dark defined 3-day masculine shadow along jawline and upper lip, sharp angular jawline definition, rugged charismatic sex appeal."
  },
  {
    id: "male_clean_shaven",
    label: "Clean-Shaven & Chiseled",
    desc: "Smooth close shave highlighting sharp mandible bone structure and clean neck lines, pristine grooming, fresh aftershave aesthetic."
  },
  {
    id: "male_short_boxed_beard",
    label: "Groomed Short Boxed Beard",
    desc: "Neatly trimmed short full beard with sharp razor-lined cheek boundaries and faded neckline, mature masculine composure."
  },
  {
    id: "male_sweaty_athletic",
    label: "Sweaty Athletic Sheen",
    desc: "Glistening sheen of sweat over broad brow, temples, and neck; flushed athletic skin, veins subtly pronounced from physical exertion."
  },
  {
    id: "male_tousled_scruff",
    label: "Tousled Bedroom Scruff",
    desc: "Soft unkempt facial scruff, relaxed approachable warmth, effortless early-morning charm without harsh styling."
  },
  {
    id: "male_weathered_rugged",
    label: "Weathered Sun-Tanned Scruff",
    desc: "Deep sun-tanned skin, subtle sun crinkles around intense squinting eyes, working man's rugged stubble, hardened and magnetic."
  }
];

export const PERSON_CONDITIONS: ConditionOption[] = [
  {
    id: "cond_fresh_radiant",
    label: "Fresh & Radiant",
    desc: "Luminous rested eyes, vibrant healthy skin circulation, relaxed upright posture, brimming with vitality."
  },
  {
    id: "cond_seductive_magnetic",
    label: "Seductive & Alluring",
    desc: "Intense lingering eye contact, subtle knowing half-smile, relaxed magnetic tension in shoulders and jaw, palpable sex appeal."
  },
  {
    id: "cond_sweaty_heated",
    label: "Sweaty & Heated",
    desc: "Glistening moisture on collarbones and throat, flushed warm skin undertones, slightly parted lips, physically active."
  },
  {
    id: "cond_exhausted_strained",
    label: "Exhausted & Fatigued",
    desc: "Subtle dark circles under eyes, weary posture, vulnerable tired gaze, heavy eyelids bearing emotional weight."
  },
  {
    id: "cond_disheveled_wild",
    label: "Disheveled & Windblown",
    desc: "Tousled loose hair strands falling across forehead, undone top button, intense electric eye focus, chaotic energy."
  },
  {
    id: "cond_pristine_composed",
    label: "Pristine & Impeccable",
    desc: "Flawlessly poised, razor-sharp focus, immaculate posture, commanding aristocratic elegance."
  }
];
