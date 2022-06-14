import ejs from "ejs";
import { BrowserWindow } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import { cmToMicron, cmToPx } from "./help";

const appPath = path.join(os.homedir(), "vyoo-print-photo");

const htmlFolderPath = path.resolve(appPath, "templates", "printPhoto");
const htmlPath = path.resolve(htmlFolderPath, "index.html");

const pdfFolderPath = path.join(appPath, "pdf");
const pdfPath = path.join(pdfFolderPath, "index.pdf");

interface Configs {
  width: number;
  height: number;
  printer: string;
}

interface Data {
  imgSrc: string;
  resize: "contain" | "cover";
}

export const printPhoto = (data: Data, { width, height, printer }: Configs) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.resolve(__dirname, "templates", "printPhoto", "index.ejs"),
      {
        resize: data.resize,
        img: {
          width: cmToPx(width),
          height: cmToPx(height),
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
            width: Math.round(cmToPx(width)),
            height: Math.round(cmToPx(height)),
          });

          photoWindow.loadFile(htmlPath);

          // setTimeout(async () => {
          photoWindow.webContents.print({
            silent: false,
            deviceName: printer,
            margins: {
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              marginType: "none",
            },
            pageSize: {
              width: cmToMicron(width),
              height: cmToMicron(height),
            },
            // pageSize: {
            //   width: cmToMicron(width),
            //   height: cmToMicron(height),
            // },
          });
          // }, 1000);
          // setTimeout(async () => {
          //   console.log(cmToMicron(width));

          //   const pdfBuffer = await photoWindow.webContents.printToPDF({
          //     pageSize: {
          //       width: cmToMicron(width) + 1,
          //       height: cmToMicron(height) + 1,
          //     },
          //     marginsType: 1,
          //     // pageSize: {
          //     //   width: cmToMicron(width),
          //     //   height: cmToMicron(height),
          //     // },
          //   });

          //   if (!fs.existsSync(pdfFolderPath)) {
          //     fs.mkdirSync(pdfFolderPath, { recursive: true });
          //   }

          //   fs.writeFileSync(pdfPath, pdfBuffer);

          //   await print(pdfPath, { printer });
          // }, 1000);

          resolve(true);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
