import { mkdir, readdir, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import sharp, { type OverlayOptions } from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DIR = path.resolve(__dirname, "../raw");
const OUTPUT_DIR = path.resolve(__dirname, "../generated/assets");

const WEBP_QUALITY = 90;

type SpritePositions = Record<string, [number, number]>;

interface SpriteManifest {
  cellSize: number;
  width: number;
  height: number;
  icons: SpritePositions;
}

interface SpriteSheetConfig {
  name: string;
  sourceDir: string;
  cellSize: number;
  columns: number;
  transform?: (
    image: sharp,
    cellSize: number,
  ) => Promise<Buffer>;
}

const spriteSheets: SpriteSheetConfig[] = [
  {
    name: "heraldry",
    sourceDir: path.join(RAW_DIR, "heraldry"),
    cellSize: 100,
    columns: 9,
    transform: createBlackIcon,
  },
  {
    name: "avatars",
    sourceDir: path.join(RAW_DIR, "avatars"),
    cellSize: 200,
    columns: 20,
  },
];

async function createBlackIcon(
  image: sharp,
  cellSize: number,
): Promise<Buffer> {
  const alphaChannel = await image.extractChannel("alpha").toBuffer();

  return sharp({
    create: {
      width: cellSize,
      height: cellSize,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .joinChannel(alphaChannel)
    .png()
    .toBuffer();
}

async function generateSpriteSheet(
  config: SpriteSheetConfig,
): Promise<void> {
  const files = (await readdir(config.sourceDir))
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    throw new Error(`No PNG files found in ${config.sourceDir}`);
  }

  const rows = Math.ceil(files.length / config.columns);

  const sheetWidth = config.columns * config.cellSize;
  const sheetHeight = rows * config.cellSize;

  const composites: OverlayOptions[] = [];
  const icons: SpritePositions = {};

  for (const [index, file] of files.entries()) {
    const inputPath = path.join(config.sourceDir, file);
    const iconId = path.basename(file, path.extname(file));

    const column = index % config.columns;
    const row = Math.floor(index / config.columns);

    const x = column * config.cellSize;
    const y = row * config.cellSize;

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (
      metadata.width !== config.cellSize ||
      metadata.height !== config.cellSize
    ) {
      throw new Error(
        `Expected ${file} to be ${config.cellSize}x${config.cellSize}, ` +
          `got ${metadata.width}x${metadata.height}`,
      );
    }

    const input = config.transform
      ? await config.transform(image, config.cellSize)
      : inputPath;

    composites.push({
      input,
      left: x,
      top: y,
    });

    icons[iconId] = [x, y];
  }

  const outputImage = path.join(
    OUTPUT_DIR,
    `${config.name}.webp`,
  );

  const outputMap = path.join(
    OUTPUT_DIR,
    `${config.name}-map.json`,
  );

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
    .toFile(outputImage);

  const manifest: SpriteManifest = {
    cellSize: config.cellSize,
    width: sheetWidth,
    height: sheetHeight,
    icons,
  };

  await writeFile(
    outputMap,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log(`Created spritesheet: ${outputImage}`);
  console.log(`Created mapping: ${outputMap}`);
  console.log(`Images: ${files.length}`);
  console.log(
    `Grid: ${config.columns} columns x ${rows} rows`,
  );
  console.log(
    `Size: ${sheetWidth}x${sheetHeight}`,
  );
}

async function main(): Promise<void> {
  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const config of spriteSheets) {
    console.log(`Generating ${config.name}...`);

    await generateSpriteSheet(config);

    console.log();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});