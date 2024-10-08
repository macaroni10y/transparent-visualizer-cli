#!/usr/bin/env node

import path from "node:path";
import fs from "fs-extra";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { ServerStyleSheet } from "styled-components";
import ImageGallery from "./ImageGallery";
import { existsTransparentPixels } from "./existsTransparentPixels";

const inputDir = "./";
const outputDir = "./output";
const htmlFilePath = "./output/index.html";

fs.ensureDirSync(outputDir);

const processImages = async () => {
	const files = await fs.readdir(inputDir);
	const pngFiles = files.filter((file) => file.endsWith(".png"));
	const processedImages = [];

	for (const file of pngFiles) {
		const inputPath = path.join(inputDir, file);
		const outputPath = path.join(outputDir, file);

		try {
			const convertedImage = sharp(inputPath).extractChannel("alpha");
			await convertedImage.toFile(outputPath);
		} catch (error: unknown) {
			console.warn(`🚨 Skipped to process ${file}: ${error.message}`);
			continue;
		}

		const hasTransparentPixels = await existsTransparentPixels(inputPath);
		await fs.copy(inputPath, path.join(outputDir, "original", file));
		processedImages.push({ name: file, url: file, hasTransparentPixels });
	}
	return processedImages.map((image) => ({
		title: image.name,
		convertedFileName: image.url,
		originalFileName: path.join("original", image.url),
		hasTransparentPixels: image.hasTransparentPixels,
	}));
};

(async () => {
	console.info("🚀 Start finding transparent pixels in PNG images");
	const images = await processImages();
	if (images.length === 0) {
		console.warn("No PNG images found in the current directory");
		process.exit(1);
	}
	const sheet = new ServerStyleSheet();
	const html = renderToStaticMarkup(
		sheet.collectStyles(<ImageGallery images={images} />),
	);
	const styleTags = sheet.getStyleTags();
	const fullHtml = `<!DOCTYPE html><html lang="ja"><doby><head><title>Transparent Visualization Report</title>${styleTags}</head>${html}</doby></html>`;
	fs.writeFileSync(htmlFilePath, fullHtml);
	for (const image of images.filter((it) => it.hasTransparentPixels)) {
		console.warn(
			`⚠️ Image file://${path.resolve(image.title)} has transparent pixels`,
		);
	}
	console.info(`🎉 Processed ${images.length} images`);
	const hasTransparentPixels = images.filter((it) => it.hasTransparentPixels);
	const noTransparentPixels = images.filter((it) => !it.hasTransparentPixels);
	console.info(
		`🔴 Images with transparent pixels: ${hasTransparentPixels.length}`,
	);
	console.info(
		`🟢 Images without transparent pixels: ${noTransparentPixels.length}`,
	);
	console.info(`📝 report URL: file://${path.resolve(htmlFilePath)}`);
})();
