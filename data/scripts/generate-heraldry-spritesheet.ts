import { mkdir, readdir, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

// @ts-expect-error
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(__dirname, "../raw/heraldry");
const OUTPUT_DIR = path.resolve(__dirname, "../generated/assets");
const OUTPUT_IMAGE = path.join(OUTPUT_DIR, "heraldry.webp");
const OUTPUT_MAP = path.join(OUTPUT_DIR, "heraldry-map.json");

const CELL_SIZE = 100;
const COLUMNS = 9;
const WEBP_QUALITY = 90;

type HeraldryIcons = Record<string, [number, number]>;

interface HeraldryManifest {
  cellSize: number;
  width: number;
  height: number;
  icons: HeraldryIcons;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(SOURCE_DIR))
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    throw new Error(`No PNG files found in ${SOURCE_DIR}`);
  }

  const rows = Math.ceil(files.length / COLUMNS);
  const sheetWidth = COLUMNS * CELL_SIZE;
  const sheetHeight = rows * CELL_SIZE;

  // @ts-expect-error
  const composites: sharp.OverlayOptions[] = [];
  const icons: HeraldryIcons = {};

  // @ts-expect-error
  for (const [index, file] of files.entries()) {
    const inputPath = path.join(SOURCE_DIR, file);
    const iconId = path.basename(file, ".png");

    const column = index % COLUMNS;
    const row = Math.floor(index / COLUMNS);

    const x = column * CELL_SIZE;
    const y = row * CELL_SIZE;

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (metadata.width !== CELL_SIZE || metadata.height !== CELL_SIZE) {
      throw new Error(
        `Expected ${file} to be ${CELL_SIZE}x${CELL_SIZE}, got ${metadata.width}x${metadata.height}`,
      );
    }

    const alphaChannel = await image.extractChannel("alpha").toBuffer();

    const blackIconBuffer = await sharp({
      create: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .joinChannel(alphaChannel)
      .png()
      .toBuffer();

    composites.push({
      input: blackIconBuffer,
      left: x,
      top: y,
    });

    icons[iconId] = [x, y];
  }

  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .webp({
      quality: WEBP_QUALITY,
      effort: 6,
    })
    .toFile(OUTPUT_IMAGE);

  const manifest: HeraldryManifest = {
    cellSize: CELL_SIZE,
    width: sheetWidth,
    height: sheetHeight,
    icons,
  };

  await writeFile(OUTPUT_MAP, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`Created spritesheet: ${OUTPUT_IMAGE}`);
  console.log(`Created mapping: ${OUTPUT_MAP}`);
  console.log(`Icons: ${files.length}`);
  console.log(`Grid: ${COLUMNS} columns x ${rows} rows`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
