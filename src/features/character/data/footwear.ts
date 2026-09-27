export interface FootwearOption {
  id: string;
  label: string;
  category: "heels" | "boots" | "sneakers" | "sandals" | "dress" | "barefoot" | "ethnic";
  desc: string;
}

export const FOOTWEAR_FEMALE: FootwearOption[] = [
  {
    id: "fem_strappy_heels",
    label: "Strappy Stiletto Heels",
    category: "heels",
    desc: "Slender metallic strappy stiletto heels accentuating ankle and calf curves."
  },
  {
    id: "fem_kneehigh_boots",
    label: "Knee-High Leather Boots",
    category: "boots",
    desc: "Supple black leather knee-high boots with a sleek sculpted silhouette."
  },
  {
    id: "fem_platform_combat",
    label: "Chunky Platform Ankle Boots",
    category: "boots",
    desc: "Edgy black leather lug-sole platform combat boots with silver eyelets."
  },
  {
    id: "fem_court_sneakers",
    label: "Minimalist White Sneakers",
    category: "sneakers",
    desc: "Clean retro white low-top court sneakers with minimalist design."
  },
  {
    id: "fem_espadrille_wedges",
    label: "Woven Espadrille Wedges",
    category: "sandals",
    desc: "Breezy natural jute woven espadrille wedges with ankle ribbons."
  },
  {
    id: "fem_pointed_pumps",
    label: "Pointed-Toe Leather Pumps",
    category: "heels",
    desc: "Classic glossy pointed-toe stiletto pumps for sharp feminine elegance."
  },
  {
    id: "fem_leather_slides",
    label: "Minimalist Leather Mules",
    category: "sandals",
    desc: "Soft buttery leather slip-on flat mules with an open heel."
  },
  {
    id: "fem_barefoot_anklet",
    label: "Barefoot with Dainty Anklet",
    category: "barefoot",
    desc: "Bare sun-kissed feet with a delicate thin silver chain anklet."
  },
  {
    id: "fem_ethnic_juttis",
    label: "Embroidered Velvet Juttis",
    category: "ethnic",
    desc: "Traditional handcrafted velvet juttis with intricate metallic threadwork."
  }
];

export const FOOTWEAR_MALE: FootwearOption[] = [
  {
    id: "male_chelsea_boots",
    label: "Leather Chelsea Boots",
    category: "boots",
    desc: "Polished Italian leather Chelsea boots with sharp tapered toe."
  },
  {
    id: "male_oxford_shoes",
    label: "Classic Oxford Brogues",
    category: "dress",
    desc: "Bespoke burnished calfskin Oxford dress shoes with clean lacing."
  },
  {
    id: "male_court_sneakers",
    label: "Clean White Leather Sneakers",
    category: "sneakers",
    desc: "Pristine white minimalist leather low-top sneakers."
  },
  {
    id: "male_rugged_work_boots",
    label: "Oiled Rugged Work Boots",
    category: "boots",
    desc: "Heavy-duty distressed leather work boots with durable vibram lug soles."
  },
  {
    id: "male_suede_loafers",
    label: "Italian Suede Penny Loafers",
    category: "dress",
    desc: "Soft unlined chocolate suede loafers with barefoot aesthetic."
  },
  {
    id: "male_athletic_trainers",
    label: "Athletic Running Trainers",
    category: "sneakers",
    desc: "Lightweight breathable performance athletic trainers."
  },
  {
    id: "male_leather_sandals",
    label: "Woven Leather Sandals",
    category: "sandals",
    desc: "Artisanal woven brown leather cross-strap coastal sandals."
  },
  {
    id: "male_barefoot",
    label: "Barefoot",
    category: "barefoot",
    desc: "Bare grounded natural feet."
  },
  {
    id: "male_ethnic_mojaris",
    label: "Handcrafted Leather Mojaris",
    category: "ethnic",
    desc: "Traditional royal pointed leather mojaris with subtle gold embossing."
  }
];
