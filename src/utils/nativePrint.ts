import { Notification } from "electron";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { imgPath } from "../constants/paths";
import NativePrinter from "../lib";
import { calculateAspectRatio } from "./aspectRatio";
// 6x4
const width = 576;
const height = 384;

// 6x8
// const width = 768;
// const height = 576;

const createResizeImg = async (imgSrc: string) => {
  const img = sharp(imgSrc);
  const originalMetadata = await img.metadata();

  const ratio = calculateAspectRatio(
    width,
    height,
    originalMetadata.width,
    originalMetadata.height
  );

  let rotateAngle: number | undefined;

  if (originalMetadata.width < originalMetadata.height) {
    rotateAngle = 90;
  }

  const resizeImg = await img
    .rotate(rotateAngle)
    .resize(ratio.width, ratio.height, {
      fit: "cover",
    });

  if (!fs.existsSync(imgPath)) {
    fs.mkdirSync(imgPath);
  }

  const imgPathSaved = path.join(imgPath, "resized-image.jpg");

  await resizeImg.toFile(imgPathSaved);

  return imgPathSaved;
};

interface Params {
  imgSrc: string;
  printer: string;
}

export const nativePrint = async ({ imgSrc, printer: printerName }: Params) => {
  const printer = new NativePrinter();

  try {
    const imgPath = await createResizeImg(imgSrc);

    try {
      await printer.print(imgPath, { paperSize: "(6x4)" }, printerName);

      console.log("Success on Print");
    } catch (error) {
      new Notification({ title: "Erro ao imprimir", body: error }).show();
    }
  } catch (error) {
    new Notification({
      title: "Erro ao fazer redimensionamento",
      body: error.message,
    }).show();
  }
};
