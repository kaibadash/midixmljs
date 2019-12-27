#!/usr/bin/env node

import { readFile, writeFile } from "fs";
import { resolve, basename } from "path";
import commander from "commander";

import { convertMIDI } from "./convert-midi";

let filePathArg;

commander.option(
  "-o, --out [output path]",
`Path to file where the resulting MusicXML file should be written
  If the path is omitted, it will write to the same filename, but with the extension replaced by ".musicxml" and in the current working directory.
  If this option is omitted entirely, it will write the MusicXML file to stdout.`
).arguments(
  "<filename>"
).action(
  function(filename) {
    filePathArg = filename;
  }
).parse(process.argv);

if (!filePathArg) {
  commander.outputHelp();
  process.exit(0);
}

const filePath = resolve(process.cwd(), filePathArg);

let outPath:string|boolean = commander.out as string|boolean;

if (outPath === true) {
  outPath = `${basename(filePath).replace(/\.[^.]+$/, "")}.musicxml`;
}

if (typeof outPath === "string") {
  outPath = resolve(process.cwd(), outPath);
}

new Promise(
  (resolve, reject) => readFile(
    filePath,
    (err, text) => {
      if (err) {
        return reject(err);
      }

      return resolve(text);
    }
  )
).then(
  (buffer:Buffer) => {
    return convertMIDI({ midiFile: buffer });
  }
).then(
  async (file:string) => {
    if (outPath && typeof outPath === "string") {
      return new Promise(
        (resolve, reject) => writeFile(
          outPath as string,
          file,
          (err) => {
            if (err) {
              return reject(err);
            }

            return resolve();
          }
        )
      );
    }
    else {
      const writePromise = new Promise(
        (resolve, reject) => {
          process.stdout.once("error", reject);

          process.stdout.once("drain", resolve);
        }
      );

      process.stdout.write(file);

      return writePromise;
    }
  },
).then(
  () => process.exit(0),
).catch(
  (err) => {
    console.error(err);

    process.exit(1);
  }
);