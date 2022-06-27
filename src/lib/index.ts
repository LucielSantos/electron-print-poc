import edge from "electron-edge-js";
import fs from "fs";
import os from "os";

const dllPath = fs
  .realpathSync(__dirname + "/dllWin/windows_printer.dll")
  .replace(".asar", ".asar.unpacked");

interface PrintOptions {
  collate?: boolean;
  duplex?: string;
  fromPage?: number;
  toPage?: number;
  color?: boolean;
  landscape?: boolean;
  paperSize?: string;
  copies?: number;
}

export default class {
  printer;

  constructor() {
    this.printer = "";
  }

  /**
   * Get a list of installed printers
   * @returns {Promise<string[]>}
   */
  listPrinters() {
    const list = edge.func({
      assemblyFile: dllPath,
      typeName: "windows_printer.API",
      methodName: "ListPrinters", // This must be Func<object,Task<object>>
    });

    return new Promise((resolve, reject) => {
      list("", function (error, response) {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }

  /**
   * Get the name of default printer
   * @returns {Promise<string>}
   */
  defaultPrinterName() {
    const defaultName = edge.func({
      assemblyFile: dllPath,
      typeName: "windows_printer.API",
      methodName: "DefaultPrinterName", // This must be Func<object,Task<object>>
    });

    return new Promise((resolve, reject) => {
      defaultName("", function (error, response) {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }

  /**
   * Set the name of the printer to use in this module
   * @param {string} printer
   */
  setPrinter(printer: string) {
    this.printer = printer;
  }

  /**
   * Get the name of current printer set with `setPrinter()`
   * @returns {string}
   */
  getCurrentPrinter() {
    return this.printer;
  }

  /**
   * Get all jobs active of supplied printer or, if not supplied, of printer set with `setPrinter()`.
   * If no printer is set or supplied, it will be take the default printer.
   * @param {string?} printer
   * @returns {Promise<any[]>}
   */
  printerInfo(printer = "") {
    const infos = edge.func({
      assemblyFile: dllPath,
      typeName: "windows_printer.API",
      methodName: "PrinterInfo", // This must be Func<object,Task<object>>
    });

    return new Promise((resolve, reject) => {
      infos(printer || this.printer, function (error, response) {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }

  /**
   * Get options of supplied printer of, if not supplied, of printer set with `setPrinter()`.
   * If no printer is set or supplied, it will be take the default printer.
   * @param {string?} printer
   * @returns {Promise<{
   *     Collate?: string[],
   *     Duplexing?: string[],
   *     MaxCopy?: number,
   *     SupportsColor?: boolean,
   *     PaperSheets?: string[],
   *     Resolutions?: string[]
   * }>}
   */
  printerOptions(printer = "") {
    const getOptions = edge.func({
      assemblyFile: dllPath,
      typeName: "windows_printer.API",
      methodName: "GetOptions", // This must be Func<object,Task<object>>
    });

    return new Promise((resolve, reject) => {
      getOptions(printer || this.printer, function (error, response) {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }

  /**
   * Print a file.
   * @param {string} filename
   * @param {{
   *     collate?: boolean,
   *     duplex?: string,
   *     fromPage?: number,
   *     toPage?: number
   *     color?: boolean,
   *     landscape?: boolean,
   *     paperSize?: string,
   *     copies?: number
   * }} userOptions
   * @param {string?} printer
   * @returns {Promise<boolean>}
   */
  print(filename: string = null, userOptions: PrintOptions = {}, printer = "") {
    if (!printer) {
      if (this.printer) printer = this.printer;
      else console.warn("No printer specified. Will be used default printer");
    }

    const defaultOptions = {
      collate: true,
      duplex: "Default",
      fromPage: 0,
      toPage: 0,
      color: true,
      landscape: false,
      paperSize: "",
      printerName: printer,
      copies: 1,
      filePath: filename,
    };

    const options: Record<string, any> = {};
    Object.keys(defaultOptions).forEach((value) => {
      if (
        userOptions[value as keyof PrintOptions] != null ||
        userOptions[value as keyof PrintOptions] != undefined
      )
        options[value] = userOptions[value as keyof PrintOptions];
      else options[value] = defaultOptions[value as keyof PrintOptions];
    });

    const printFile = edge.func({
      assemblyFile: dllPath,
      typeName: "windows_printer.API",
      methodName: "Print", // This must be Func<object,Task<object>>
    });

    if (!filename) throw "File path not specified";

    return new Promise((resolve, reject) => {
      printFile(options, function (error, response) {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }

  /**
   * Print a string directly.
   * @param {string} text
   * @param {{
   *     collate?: boolean,
   *     duplex?: string,
   *     fromPage?: number,
   *     toPage?: number
   *     color?: boolean,
   *     landscape?: boolean,
   *     paperSize?: string,
   *     copies?: number
   * }} options
   * @param {string?} printer
   */
  printText(text = "", options: PrintOptions = {}, printer = "") {
    const filepath = os.tmpdir() + "/nnp_tmp.txt";

    fs.writeFileSync(filepath, text);

    this.print(filepath, options, printer);
  }
}
