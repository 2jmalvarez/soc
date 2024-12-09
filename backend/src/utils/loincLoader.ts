import csvParser from "csv-parser";
import fs from "fs";

const loincSet: Set<string> = new Set();

/**
 * Carga los códigos LOINC desde un archivo CSV y los guarda en el conjunto `loincSet`.
 * @param filePath Ruta del archivo CSV.
 * @returns Promesa que se resuelve cuando la carga está completa.
 */
export const loadLoincCodes = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: { LOINC_NUM: string }) => {
        if (row.LOINC_NUM) {
          loincSet.add(row.LOINC_NUM);
        }
      })
      .on("end", () => {
        console.log("Archivo CSV cargado en memoria.");
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

/**
 * Devuelve el conjunto de códigos LOINC cargados.
 * @returns Conjunto de códigos LOINC.
 */
export const getLoincSet = (): Set<string> => loincSet;
