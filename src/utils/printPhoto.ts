import ejs from "ejs";
import { BrowserWindow } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import {
  dimensions,
  rotateLandscape,
  rotatePortrait,
} from "../constants/dimensions";

import sharp from "sharp";
import { bufferToBase64 } from "./image";

const appPath = path.join(os.homedir(), "vyoo-print-photo");

const htmlFolderPath = path.resolve(appPath, "templates", "printPhoto");
const htmlPath = path.resolve(htmlFolderPath, "index.html");

const pdfFolderPath = path.join(appPath, "pdf");
const pdfPath = path.join(pdfFolderPath, "index.pdf");

interface Configs {
  printer: string;
  dimensions: string;
  savePDF: boolean;
}

interface Data {
  imgSrc: string;
  imgPath: string;
  resize: "contain" | "cover";
}

export const printPhoto = async (
  data: Data,
  { printer, dimensions: dimensionsParam, savePDF }: Configs
) => {
  let img = data.imgSrc;
  const dimension = dimensions.find((value) => value.value === dimensionsParam);

  let isRotateLandscape = false;
  let isRotatePortrait = false;

  const buffer = fs.readFileSync(data.imgPath);
  const imageSharp = sharp(buffer);
  const metadata = await sharp(buffer).metadata();

  // Entra nesse if se a imagem estiver em modo paisagem e no else se for retrato
  if (metadata.width > metadata.height) {
    isRotatePortrait = !!rotateLandscape.find(
      (value) => value === dimension.value
    );
  } else {
    isRotateLandscape = !!rotatePortrait.find(
      (value) => value === dimension.value
    );
  }

  if (isRotateLandscape || isRotatePortrait) {
    const rotatedBuffer = await imageSharp.rotate(90).toBuffer();

    img = await bufferToBase64(rotatedBuffer);
  }

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, "templates", "printPhoto", "index.ejs"),
      {
        resize: data.resize,
        img: {
          // rotate,
          // width: dimension.width.px,
          // height: dimension.height.px,
          // widthCm: dimension.width.cm,
          // heightCm: dimension.height.cm,
          widthIn: dimension.height.in,
          heightIn: dimension.width.in,
          src: img,
        },
      },
      async (err, htmlContent) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          if (!fs.existsSync(htmlFolderPath)) {
            fs.mkdirSync(htmlFolderPath, { recursive: true });
          }

          fs.writeFileSync(htmlPath, htmlContent);

          const photoWindow = new BrowserWindow({
            width: Math.round(dimension.width.px),
            height: Math.round(dimension.height.px),
            frame: false,
            show: true,
          });

          photoWindow.loadFile(htmlPath);

          if (savePDF) {
            setTimeout(async () => {
              const pdfBuffer = await photoWindow.webContents.printToPDF({
                // pageSize: {
                //   width: cmToMicron(width) + 1,
                //   height: cmToMicron(height) + 1,
                // },
                marginsType: 1,
                pageSize: {
                  width: dimension.width.micron,
                  height: dimension.height.micron,
                },
              });

              if (!fs.existsSync(pdfFolderPath)) {
                fs.mkdirSync(pdfFolderPath, { recursive: true });
              }

              fs.writeFileSync(pdfPath, pdfBuffer);

              // await print(pdfPath, { printer });
            }, 1000);
          } else {
            setTimeout(async () => {
              photoWindow.webContents.print({
                silent: true,
                deviceName: printer,
                margins: {
                  bottom: 0,
                  left: 0,
                  right: 0,
                  top: 0,
                  marginType: "none",
                },
                pageSize: {
                  width: dimension.width.micron,
                  height: dimension.height.micron,
                },
              });

              console.log("Printed Photo");
            }, 1000);
          }

          setTimeout(() => {
            photoWindow.close();

            resolve(true);
          }, 2000);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
