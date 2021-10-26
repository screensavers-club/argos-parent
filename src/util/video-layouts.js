const layouts = {
  Default: {
    icon: "/images/layout-icons/layout-default.svg",
  },
  A: {
    icon: "/images/layout-icons/layout-a.svg",
    slots: [{ size: [100, 100], position: [0, 0] }],
  },
  B: {
    icon: "/images/layout-icons/layout-b.svg",
    slots: [
      { size: [50, 50], position: [0, 25] },
      { size: [50, 50], position: [50, 25] },
    ],
  },
  C: {
    icon: "/images/layout-icons/layout-c.svg",
    slots: [
      { size: [50, 50], position: [25, 0] },
      { size: [50, 50], position: [25, 50] },
    ],
  },
  D: {
    icon: "/images/layout-icons/layout-d.svg",
    slots: [
      { size: [50, 50], position: [0, 0] },
      { size: [50, 50], position: [50, 0] },
      { size: [50, 50], position: [25, 50] },
    ],
  },
  E: {
    icon: "/images/layout-icons/layout-e.svg",
    slots: [
      { size: [50, 50], position: [25, 0] },
      { size: [50, 50], position: [0, 50] },
      { size: [50, 50], position: [50, 50] },
    ],
  },
  F: {
    icon: "/images/layout-icons/layout-f.svg",
    slots: [
      { size: [50, 50], position: [0, 0] },
      { size: [50, 50], position: [0, 50] },
      { size: [50, 100], position: [50, 0] },
    ],
  },
  G: {
    icon: "/images/layout-icons/layout-g.svg",
    slots: [
      { size: [50, 100], position: [0, 0] },
      { size: [50, 50], position: [50, 0] },
      { size: [50, 50], position: [50, 50] },
    ],
  },
  H: {
    icon: "/images/layout-icons/layout-h.svg",

    slots: [
      { size: [50, 50], position: [0, 0] },
      { size: [50, 50], position: [50, 0] },
      { size: [50, 50], position: [0, 50] },
      { size: [50, 50], position: [50, 50] },
    ],
  },
  I: {
    icon: "/images/layout-icons/layout-i.svg",
    slots: [
      { size: [33.333, 33.333], position: [0, 33.33] },
      { size: [33.333, 33.333], position: [33.333, 33.33] },
      { size: [33.333, 33.333], position: [66.6666, 33.33] },
    ],
  },
  J: {
    icon: "/images/layout-icons/layout-j.svg",
    slots: [
      { size: [33.33, 100], position: [0, 0] },
      { size: [33.333, 100], position: [33.333, 0] },
      { size: [33.33, 100], position: [66.666, 0] },
    ],
  },
  K: {
    icon: "/images/layout-icons/layout-k.svg",
    slots: [
      { size: [25, 100], position: [0, 0] },
      { size: [25, 100], position: [25, 0] },
      { size: [25, 100], position: [50, 0] },
      { size: [25, 100], position: [75, 0] },
    ],
  },
};
export default layouts;
