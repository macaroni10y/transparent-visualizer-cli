import sharp from "sharp";

export const existsTransparentPixels = async (
	imagePath: string,
): Promise<boolean> => {
	const image = sharp(imagePath);
	const { data, info } = await image
		.extractChannel("alpha")
		.threshold()
		.raw()
		.toBuffer({ resolveWithObject: true });

	for (let i = 0; i < info.width * info.height; i++) {
		if (data[i] === 0) {
			return true;
		}
	}

	return false;
};
