import { React, useState } from 'react';
import {
  Card, CardMedia, CardContent, Typography, IconButton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import '../styles/ImageCarousel.css';

const ImageCarousel = ({
  imageList, captionList, imageHeight, cardSize,
}) => {
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <Card sx={{
      maxWidth: cardSize, marginTop: 10,
    }}
    >
      <div className="carousel">
        <IconButton
          variant="primary"
          disabled={imageIndex <= 0}
          onClick={() => {
            setImageIndex(imageIndex - 1);
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <CardMedia
          component="img"
          height={imageHeight}
          image={imageList[imageIndex]}
        />
        <IconButton
          variant="primary"
          disabled={imageIndex >= imageList.length - 1}
          onClick={() => {
            setImageIndex(imageIndex + 1);
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {captionList[imageIndex]}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ImageCarousel;
