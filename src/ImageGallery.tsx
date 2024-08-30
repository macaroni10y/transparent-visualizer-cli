import React from "react";
import styled, { createGlobalStyle } from "styled-components";

interface Image {
	title: string;
	convertedFileName: string;
	originalFileName: string;
}

interface ImageGalleryProps {
	images: Image[];
}

const Gallery = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	padding: 20px;
	background-color: #fff;
`;

const Item = styled.div`
	margin: 20px;
	text-align: center;
	border-radius: 5px;
	overflow: hidden;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
`;

const Diff = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin: 20px;
	padding: 20px;
	gap: 20px;
	max-width: 100%;
	border-radius: 5px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
`;

const StyledImg = styled.img`
	width: 100%;
	max-width: 300px;
	height: auto;
	border: none;
	margin: 0;
`;

const ImageGallery = (props: ImageGalleryProps) => {
	return (
		<>
			<h1>Converted PNG Images</h1>
			<Gallery>
				{props.images.map((image, index) => (
					<Item key={image.title}>
						<p>{image.title}</p>
						<Diff>
							<StyledImg src={image.convertedFileName} alt={image.title} />
							<StyledImg src={image.originalFileName} alt={image.title} />
						</Diff>
					</Item>
				))}
			</Gallery>
		</>
	);
};

export default ImageGallery;
