'use client';
import React, { useEffect } from 'react';
import { ImagePlus, Check, ImageIcon, Camera, X, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface ImageData {
  image: File | null;
  preview: string | null;
}

interface ImageUploadProps {
  videoCaptureActive: boolean;
  openFileSelector: (ref: React.RefObject<HTMLInputElement | null>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  errors: {
    image?: string;
  };
  startCamera: () => void;
  showGalleryImages: boolean;
  setShowGalleryImages: (value: boolean) => void;
  galleryImages: string[];
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  image: ImageData;
  setImage: React.Dispatch<React.SetStateAction<ImageData>>;
  handleImageSelect: (image: string) => void;
}

const Imageupload: React.FC<ImageUploadProps> = ({
  videoCaptureActive,
  openFileSelector,
  fileInputRef,
  errors,
  startCamera,
  showGalleryImages,
  setShowGalleryImages,
  galleryImages,
  handleImageChange,
  image,
  setImage,
  handleImageSelect,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGalleryImages(false);
      }
    };

    if (showGalleryImages) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showGalleryImages, setShowGalleryImages]);

  return (
    <div className="space-y-3">
      <label className="flex items-center text-sm font-medium text-purple-700 mb-2">
        <ImagePlus className="h-4 w-4 mr-2" />
        Image Upload
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-3">
          {!videoCaptureActive && (
            <div className="flex flex-col space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-label="Upload image"
                  onClick={() => openFileSelector(fileInputRef)}
                  className={`flex items-center justify-center px-4 py-4 border-2 rounded-lg transition-all duration-200 ${
                    errors.image
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200 hover:border-purple-400'
                  }`}
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  <span>Upload</span>
                </button>

                <button
                  type="button"
                  aria-label="Open camera"
                  onClick={startCamera}
                  className="flex items-center justify-center px-4 py-4 border-2 rounded-lg bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 hover:border-purple-400 transition-all duration-200"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  <span>Camera</span>
                </button>

                <div className="relative col-span-2">
                  {showGalleryImages && (
                    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-opacity-50"
                        onClick={() => setShowGalleryImages(false)}
                      />

                      <div className="bg-white rounded-lg p-6 z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Choose an Image</h3>
                          <button
                            onClick={() => setShowGalleryImages(false)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {galleryImages.map((img, index) => (
                            <div
                              key={index}
                              className="relative aspect-square cursor-pointer border rounded-md overflow-hidden hover:opacity-80 transition-opacity"
                              onClick={() => handleImageSelect(img)}
                            >
                              <Image
                                src={img}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowGalleryImages(true)}
                    className="flex items-center justify-center px-4 py-4 border-2 rounded-lg bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 hover:border-purple-400 transition-all duration-200 w-full"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    <span>Choose from Gallery</span>
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          {image.image && (
            <p className="text-sm text-purple-700 flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              {image.image.name}
            </p>
          )}

          {errors.image && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
              {errors.image}
            </p>
          )}
        </div>

        <div
          className={`relative h-48 w-full overflow-hidden rounded-lg border-2 transition-all duration-200 ${
            image.preview ? 'border-purple-400 bg-purple-50' : 'border-purple-200 bg-purple-50'
          } flex items-center justify-center cursor-pointer`}
          onClick={() => !image.preview && openFileSelector(fileInputRef)}
        >
          {image.preview ? (
            <>
              <Image
                src={image.preview}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (image.preview) URL.revokeObjectURL(image.preview);
                  setImage({ image: null, preview: null });
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="text-purple-300 flex flex-col items-center">
              <ImagePlus className="h-12 w-12" />
              <span className="text-xs mt-2">Tap to select image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Imageupload;