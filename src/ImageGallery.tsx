import React from "react";
import styled from "styled-components";

interface Image {
	title: string;
	convertedFileName: string;
	originalFileName: string;
	hasTransparentPixels: boolean;
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
	flex-direction: row;
	justify-content: center;
	margin: 20px;
	padding: 20px;
	gap: 20px;
	max-width: 100%;
	border-radius: 5px;
	background-color: antiquewhite;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
`;

const ImgWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const StyledImg = styled.img`
	width: 100%;
	max-width: 300px;
	height: auto;
	border: none;
	margin: 0;
`;

const ImageGallery = (props: ImageGalleryProps) => {
	const {length} = props.images.filter((image) => image.hasTransparentPixels);
	return (

		<>
			<h1>Transparent Visualization Report</h1>
			<div>
				{
					length > 0 ? (
					<p style={{ color: "red", fontWeight: "bold" }}>
						There are  {length} images with transparent pixels
					</p>
				) : (
					<p style={{ color: "green" }}>There are no images with transparent pixels</p>
				)}
			</div>
			<Gallery>
				{props.images.map((image, index) => (
					<Item key={image.title}>
						<p>{image.title}</p>
						{image.hasTransparentPixels ? (
							<p style={{ color: "red", fontWeight: "bold" }}>has transparent pixels</p>
						) : (
							<p style={{color: "green"}}>does not have transparent pixels</p>
						)}
						<Diff>
							<ImgWrapper>
								<StyledImg src={image.originalFileName} alt={image.title} />
								<p>original</p>
							</ImgWrapper>
							<ImgWrapper>
								<StyledImg src={image.convertedFileName} alt={image.title} />
								<p>alpha channel</p>
							</ImgWrapper>
						</Diff>
					</Item>
				))}
			</Gallery>
		</>
	);
};

export default ImageGallery;
