import { Notification } from "electron";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {
  dimensions,
  rotateLandscape,
  rotatePortrait,
  sizesByValue,
  sizesValues,
} from "../constants/dimensions";
import { appPath, imgPath } from "../constants/paths";
import NativePrinter from "../lib";
import { calculateAspectRatio } from "./aspectRatio";
// 6x4
// const width = 576;
// const height = 384;

// 6x8
// const width = 768;
// const height = 576;

const createResizeImg = async (imgSrc: string, dimensionValue: string) => {
  const img = sharp(imgSrc);
  const originalMetadata = await img.metadata();
  const isLandscape = originalMetadata.width > originalMetadata.height;
  let rotateAngle: number | undefined;
  const width = sizesByValue[dimensionValue].width;
  const height = sizesByValue[dimensionValue].height;
  const invertResize = dimensionValue === sizesValues.xs;

  let ratio = calculateAspectRatio(
    width,
    height,
    originalMetadata.width,
    originalMetadata.height
  );

  if (rotateLandscape.includes(dimensionValue)) {
    rotateAngle = isLandscape ? 90 : undefined;

    ratio = calculateAspectRatio(
      width,
      height,
      originalMetadata.height,
      originalMetadata.width
    );
  }

  if (rotatePortrait.includes(dimensionValue)) {
    rotateAngle = isLandscape ? undefined : 90;
  }

  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath);
  }

  if (!fs.existsSync(imgPath)) {
    fs.mkdirSync(imgPath);
  }

  const imgPathSaved = path.join(imgPath, "resized-image.jpg");

  if (invertResize) {
    await img
      .rotate(rotateAngle)
      .resize(ratio.height, ratio.width, {
        fit: "contain",
        position: "right",
        background: "white",
      })
      .toFile(imgPathSaved);
  } else {
    await img
      .rotate(rotateAngle)
      .resize(ratio.width, ratio.height, {
        fit: "cover",
      })
      .toFile(imgPathSaved);
  }

  return imgPathSaved;
};

interface Params {
  imgSrc: string;
  printer: string;
  dimensions: string;
}

export const nativePrint = async ({
  imgSrc,
  printer: printerName,
  dimensions: dimensionsParam,
}: Params) => {
  const printer = new NativePrinter();
  const dimension = dimensions.find((value) => value.value === dimensionsParam);

  try {
    const imgPath = await createResizeImg(imgSrc, dimension.value);

    try {
      await printer.print(
        imgPath,
        { paperSize: dimension.paperSize },
        printerName
      );

      console.log("Success on Print");
    } catch (error) {
      console.log(error);
      new Notification({ title: "Erro ao imprimir", body: error }).show();
    }
  } catch (error) {
    console.log(error);

    new Notification({
      title: "Erro ao fazer redimensionamento",
      body: error.message,
    }).show();
  }
};
