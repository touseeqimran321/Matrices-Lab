import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Filter,
  Download,
  Palette,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const ImageProcessor = () => {
  const [originalImageSrc, setOriginalImageSrc] = useState(null);
  const [originalImageObject, setOriginalImageObject] = useState(null);
  const [processedImageSrc, setProcessedImageSrc] = useState(null);
  const [transformation, setTransformation] = useState('none');
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();

  const MAX_DISPLAY_WIDTH = 300;
  const MAX_DISPLAY_HEIGHT = 300;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImageObject(img);
          setOriginalImageSrc(e.target.result);
          setProcessedImageSrc(e.target.result);
          toast({
            title: 'Image Loaded!',
            description: 'Your image has been successfully loaded.',
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTransformation = () => {
    if (!originalImageObject) {
      toast({
        title: 'No Image',
        description: 'Please upload an image first',
        variant: 'destructive',
      });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let { naturalWidth: width, naturalHeight: height } = originalImageObject;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    switch (transformation) {
      case 'rotate90':
        canvas.width = height;
        canvas.height = width;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(originalImageObject, -width / 2, -height / 2, width, height);
        break;
      case 'flipH':
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(originalImageObject, 0, 0, width, height);
        break;
      case 'flipV':
        ctx.translate(0, height);
        ctx.scale(1, -1);
        ctx.drawImage(originalImageObject, 0, 0, width, height);
        break;
      case 'invert':
        ctx.drawImage(originalImageObject, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i]; // red
          data[i + 1] = 255 - data[i + 1]; // green
          data[i + 2] = 255 - data[i + 2]; // blue
        }
        ctx.putImageData(imageData, 0, 0);
        break;
      case 'blur':
        ctx.filter = 'blur(3px)';
        ctx.drawImage(originalImageObject, 0, 0, width, height);
        ctx.filter = 'none';
        break;
      case 'grayscale':
        ctx.filter = 'grayscale(100%)';
        ctx.drawImage(originalImageObject, 0, 0, width, height);
        ctx.filter = 'none';
        break;
      default:
        ctx.drawImage(originalImageObject, 0, 0, width, height);
    }

    ctx.restore();
    setProcessedImageSrc(canvas.toDataURL('image/png'));

    toast({
      title: 'Transformation Applied!',
      description: `Applied ${transformation} transformation`,
    });
  };

  const exportImage = () => {
    if (!processedImageSrc) {
      toast({
        title: 'No Processed Image',
        description: 'Please process an image first.',
        variant: 'destructive',
      });
      return;
    }

    const a = document.createElement('a');
    a.href = processedImageSrc;
    a.download = `processed_image_${transformation || 'original'}.png`;
    a.click();

    toast({
      title: 'Image Exported!',
      description: 'The processed image has been downloaded.',
    });
  };

  const renderImageDisplay = (src, title) => {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-center">{title}</h3>
        <div className="p-4 bg-muted rounded-lg overflow-hidden flex justify-center items-center min-h-[200px] h-[320px]">
          {src ? (
            <img
              src={src}
              alt={title}
              className="max-w-full max-h-full rounded-md object-contain"
            />
          ) : (
            <div className="text-muted-foreground text-center">
              {title.toLowerCase().includes('original')
                ? 'Upload an image to see it here.'
                : 'Apply a transformation to see the result.'}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Image Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="image-upload">Upload Image</Label>
            <div className="flex gap-2">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="flex-1"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="icon"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Image Transformation</Label>
            <div className="flex gap-2">
              <Select value={transformation} onValueChange={setTransformation}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select transformation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="rotate90">
                    <RotateCw className="inline-block h-4 w-4 mr-2" />
                    Rotate 90°
                  </SelectItem>
                  <SelectItem value="flipH">
                    <FlipHorizontal className="inline-block h-4 w-4 mr-2" />
                    Flip Horizontal
                  </SelectItem>
                  <SelectItem value="flipV">
                    <FlipVertical className="inline-block h-4 w-4 mr-2" />
                    Flip Vertical
                  </SelectItem>
                  <SelectItem value="invert">
                    <Palette className="inline-block h-4 w-4 mr-2" />
                    Invert Colors
                  </SelectItem>
                  <SelectItem value="blur">
                    <Filter className="inline-block h-4 w-4 mr-2" />
                    Blur Filter
                  </SelectItem>
                  <SelectItem value="grayscale">
                    <Palette className="inline-block h-4 w-4 mr-2" />
                    Grayscale
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={applyTransformation}
                className="pulse-glow"
                disabled={!originalImageObject}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderImageDisplay(originalImageSrc, 'Original Image')}
            {renderImageDisplay(processedImageSrc, 'Processed Image')}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {processedImageSrc && (
            <div className="flex justify-end">
              <Button onClick={exportImage} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ImageProcessor;
