export const hero = {
  title: "Six teas.\nOne cup, poured six ways.",
  body: "Chai Mahal is a small interactive atlas — scroll through six teas from around the world and watch the same cup take on each one's colour, strength, and character.",
};

export const teas = [
  {
    id: "masala",
    name: "Masala Chai",
    origin: "India",
    color: "#c97c3d",
    align: "left",
    garnish: "spice",
    body: "Black tea simmered in milk with ginger, cardamom, and clove until it turns the colour of clay. The spice blend varies house to house — this is the one with cardamom leading.",
    specs: [
      { label: "base", value: "Black (Assam/CTC)" },
      { label: "caffeine", value: "Medium-high" },
      { label: "brew", value: "5-7 min, simmered" },
      { label: "served", value: "Hot, with milk" },
    ],
  },
  {
    id: "green",
    name: "Green Tea",
    origin: "China",
    color: "#8fae7c",
    align: "right",
    garnish: "sprig",
    body: "Steamed or pan-fired right after picking, so the leaf never oxidises — that's what keeps the colour pale and the flavour grassy rather than deep.",
    specs: [
      { label: "base", value: "Unoxidised leaf" },
      { label: "caffeine", value: "Low-medium" },
      { label: "brew", value: "2-3 min, 80°C" },
      { label: "served", value: "Hot or cold" },
    ],
  },
  {
    id: "earlgrey",
    name: "Earl Grey",
    origin: "England (blend)",
    color: "#8b5e3c",
    align: "left",
    garnish: "curl",
    garnishColor: "#d9822b",
    body: "Black tea scented with bergamot oil — a British blend, not a growing region. The citrus note is what tells it apart from a plain black tea at a glance.",
    specs: [
      { label: "base", value: "Black + bergamot oil" },
      { label: "caffeine", value: "Medium-high" },
      { label: "brew", value: "3-4 min, boiling" },
      { label: "served", value: "Hot, splash of milk" },
    ],
  },
  {
    id: "oolong",
    name: "Oolong",
    origin: "Taiwan",
    color: "#b5793a",
    align: "right",
    garnish: "sprig",
    body: "Partially oxidised, somewhere between green and black tea — the same leaf can be rolled lighter for a floral cup or darker for something closer to roasted.",
    specs: [
      { label: "base", value: "Partially oxidised" },
      { label: "caffeine", value: "Medium" },
      { label: "brew", value: "3 min, multiple steeps" },
      { label: "served", value: "Hot, gongfu style" },
    ],
  },
  {
    id: "matcha",
    name: "Matcha",
    origin: "Japan",
    color: "#6fa85b",
    align: "left",
    garnish: "sprig",
    body: "Shade-grown leaf, stone-ground into powder, and whisked rather than steeped — you drink the whole leaf, not an infusion of it.",
    specs: [
      { label: "base", value: "Ground whole leaf" },
      { label: "caffeine", value: "Medium" },
      { label: "brew", value: "Whisked, no steep" },
      { label: "served", value: "Hot or as a latte" },
    ],
  },
  {
    id: "chamomile",
    name: "Chamomile",
    origin: "Egypt (major grower)",
    color: "#e9d18b",
    align: "right",
    garnish: "petal",
    body: "Not tea at all, technically — a herbal infusion of dried flowers, caffeine-free, usually reached for at the end of the day rather than the start.",
    specs: [
      { label: "base", value: "Dried flower, no tea leaf" },
      { label: "caffeine", value: "None" },
      { label: "brew", value: "5 min, boiling" },
      { label: "served", value: "Hot, honey optional" },
    ],
  },
];

export const atlas = {
  title: "The full spectrum, in one cup.",
  body: "Drag to rotate. Every colour on this page has been the same cup, just poured differently.",
};