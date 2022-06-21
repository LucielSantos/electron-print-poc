import ejs from "ejs";
import { BrowserWindow } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import { dimensions } from "../constants/dimensions";
import { cmToMicron, cmToPx } from "./help";

const appPath = path.join(os.homedir(), "vyoo-print-photo");

const htmlFolderPath = path.resolve(appPath, "templates", "printPhoto");
const htmlPath = path.resolve(htmlFolderPath, "index.html");

const pdfFolderPath = path.join(appPath, "pdf");
const pdfPath = path.join(pdfFolderPath, "index.pdf");

interface Configs {
  printer: string;
  dimensions: string;
}

interface Data {
  imgSrc: string;
  resize: "contain" | "cover";
}

export const printPhoto = (
  data: Data,
  { printer, dimensions: dimensionsParam }: Configs
) => {
  const dimension = dimensions.find((value) => value.value === dimensionsParam);

  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, "templates", "printPhoto", "index.ejs"),
      {
        resize: data.resize,
        img: {
          width: cmToPx(dimension.width),
          height: cmToPx(dimension.height),
          widthCm: dimension.width,
          heightCm: dimension.height,
          src: data.imgSrc,
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
            width: Math.round(cmToPx(dimension.width)),
            height: Math.round(cmToPx(dimension.height)),
            frame: false,
            show: true,
          });

          photoWindow.loadFile(htmlPath);

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
                width: cmToMicron(dimension.width),
                height: cmToMicron(dimension.height),
              },
            });

            console.log("Printed Photo");
          }, 1000);
          // setTimeout(async () => {
          //   console.log(cmToMicron(width));

          //   const pdfBuffer = await photoWindow.webContents.printToPDF({
          //     // pageSize: {
          //     //   width: cmToMicron(width) + 1,
          //     //   height: cmToMicron(height) + 1,
          //     // },
          //     marginsType: 1,
          //     pageSize: {
          //       width: cmToMicron(width),
          //       height: cmToMicron(height),
          //     },
          //   });

          //   if (!fs.existsSync(pdfFolderPath)) {
          //     fs.mkdirSync(pdfFolderPath, { recursive: true });
          //   }

          //   fs.writeFileSync(pdfPath, pdfBuffer);

          //   // await print(pdfPath, { printer });
          // }, 1000);

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
