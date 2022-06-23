const sizesValues = {
  sm: "10x15",
  lg: "20x15",
};

export const rotatePortrait = [sizesValues.sm];

export const rotateLandscape = [sizesValues.lg];

export const dimensions = [
  {
    value: sizesValues.sm,
    label: "10 x 15",
    width: {
      px: 576,
      cm: 15.24,
      micron: 152400,
      in: 6,
    },
    height: {
      px: 384,
      cm: 10.16,
      micron: 101600,
      in: 4,
    },
  },
  {
    value: sizesValues.lg,
    label: "20 x 15",
    width: {
      px: 576,
      cm: 15.24,
      micron: 152400,
      in: 6,
    },
    height: {
      px: 768,
      cm: 20.32,
      micron: 203200,
      in: 8,
    },
  },
];
