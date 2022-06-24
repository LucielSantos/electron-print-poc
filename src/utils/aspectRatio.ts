export const calculateAspectRatio = (
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return {
    width: Math.round(Math.round(srcWidth * ratio * 100) / 100),
    height: Math.round(Math.round(srcHeight * ratio * 100) / 100),
  };
};
