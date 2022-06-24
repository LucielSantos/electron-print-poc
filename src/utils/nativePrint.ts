import fs from "fs";
import path from "path";
import sharp from "sharp";
import { imgPath } from "../constants/paths";
import NativePrinter from "../lib";
import { calculateAspectRatio } from "./aspectRatio";

const width = 576;
const height = 384;

const createResizeImg = async (imgSrc: string) => {
  const img = sharp(imgSrc);
  const originalMetadata = await img.metadata();

  const ratio = calculateAspectRatio(
    width,
    height,
    originalMetadata.width,
    originalMetadata.height
  );

  const resizeImg = await img.resize(ratio.width, ratio.height);

  if (!fs.existsSync(imgPath)) {
    fs.mkdirSync(imgPath);
  }

  const imgPathSaved = path.join(imgPath, "resize.jpg");

  await resizeImg.toFile(imgPathSaved);

  return imgPathSaved;
};

interface Params {
  imgSrc: string;
  printer: string;
}

export const nativePrint = async ({ imgSrc, printer: printerName }: Params) => {
  const printer = new NativePrinter();

  const imgPath = await createResizeImg(imgSrc);

  console.log(imgPath);

  printer.print(imgPath, { paperSize: "(6x8)" }, printerName);
};
