import path from "node:path";
import fs from "fs-extra";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { ServerStyleSheet } from "styled-components";
import ImageGallery from "./ImageGallery";

const inputDir = "./input_images";
const outputDir = "./output";
const htmlFilePath = "./output/index.html";

const pinkColor = { r: 255, g: 105, b: 180, alpha: 1 };

fs.ensureDirSync(outputDir);

const processImages = async () => {
	const files = await fs.readdir(inputDir);
	const pngFiles = files.filter((file) => file.endsWith(".png"));
	const processedImages = [];

	for (const file of pngFiles) {
		const inputPath = path.join(inputDir, file);
		const outputPath = path.join(outputDir, file);

		const convertedImage = sharp(inputPath)
			.flatten({ background: pinkColor })
			.composite([
				{
					input: Buffer.from(
						`<svg><rect x="0" y="0" width="100%" height="100%" fill="rgba(${pinkColor.r},${pinkColor.g},${pinkColor.b},${pinkColor.alpha})" /></svg>`,
					),
					blend: "dest-over",
				},
			]);

		await convertedImage.toFile(outputPath);
		await fs.copy(inputPath, path.join(outputDir, "original", file));

		processedImages.push({ name: file, url: file });
	}
	return processedImages.map((image) => ({
		title: image.name,
		convertedFileName: image.url,
		originalFileName: path.join("original", image.url),
	}));
};

(async () => {
	const images = await processImages();
	const sheet = new ServerStyleSheet();
	const html = renderToStaticMarkup(
		sheet.collectStyles(<ImageGallery images={images} />),
	);
	const styleTags = sheet.getStyleTags();
	const fullHtml = `<!DOCTYPE html><html lang="ja"><doby><head><title>Converted PNG Images</title>${styleTags}</head>${html}</doby></html>`;
	fs.writeFileSync(htmlFilePath, fullHtml);
	console.log(`report URL: file://${path.resolve(htmlFilePath)}`);
})();
