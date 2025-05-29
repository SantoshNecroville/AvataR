'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Check, ImageIcon, Camera, X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 6;
  
  const paginatedImages = useMemo(() => {
    const startIndex = currentPage * imagesPerPage;
    return galleryImages.slice(startIndex, startIndex + imagesPerPage);
  }, [galleryImages, currentPage, imagesPerPage]);
  
  const totalPages = Math.ceil(galleryImages.length / imagesPerPage);
  

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGalleryImages(false);
      } else if (e.key === 'ArrowLeft' && showGalleryImages) {
        setCurrentPage(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' && showGalleryImages) {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
      }
    };

    if (showGalleryImages) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showGalleryImages, setShowGalleryImages, currentPage, totalPages]);


  useEffect(() => {
    if (showGalleryImages) {
      setCurrentPage(0);
    }
  }, [showGalleryImages]);

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
                    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowGalleryImages(false)}>
                      <div 
                        className="bg-white rounded-xl shadow-xl p-6 z-50 w-full max-w-2xl max-h-[80vh] overflow-hidden transition-all duration-300 ease-in-out"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                          <h3 className="text-lg font-medium text-purple-800">Choose an Image</h3>
                          <button
                            onClick={() => setShowGalleryImages(false)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close gallery"
                          >
                            <X className="h-6 w-6 text-purple-700 cursor-pointer" />
                          </button>
                        </div>
                        
                        {galleryImages.length > 0 ? (
                          <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2 overflow-y-auto max-h-[50vh]">
                              {paginatedImages.map((img, index) => (
                                <div
                                  key={index}
                                  className="relative aspect-square cursor-pointer border rounded-lg overflow-hidden group hover:ring-2 hover:ring-purple-500 transition-all duration-200"
                                  onClick={() => handleImageSelect(img)}
                                >
                                  <Image
                                    src={img}
                                    alt={`Gallery image ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    loading="eager"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-2 left-2 bg-white/70 backdrop-blur-sm text-purple-700 px-2 py-1 rounded-md text-xs">
                                      Select
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {totalPages > 1 && (
                              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                                <button 
                                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                  disabled={currentPage === 0}
                                  className={`flex items-center px-3 py-1 cursor-pointer rounded-md ${
                                    currentPage === 0 
                                      ? 'text-gray-400 cursor-not-allowed' 
                                      : 'text-purple-700 hover:bg-purple-100'
                                  }`}
                                >
                                  <ChevronLeft className="h-5 w-5 mr-1" />
                                  Previous
                                </button>
                                
                                <span className="text-sm text-gray-600">
                                  Page {currentPage + 1} of {totalPages}
                                </span>
                                
                                <button 
                                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                  disabled={currentPage === totalPages - 1}
                                  className={`flex items-center px-3 py-1 rounded-md cursor-pointer ${
                                    currentPage === totalPages - 1 
                                      ? 'text-gray-400 cursor-not-allowed' 
                                      : 'text-purple-700 hover:bg-purple-100'
                                  }`}
                                >
                                  Next
                                  <ChevronRight className="h-5 w-5 ml-1" />
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                            <ImageIcon className="h-12 w-12 mb-2 text-gray-300" />
                            <p>No images available in the gallery</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowGalleryImages(true)}
                    className="flex items-center justify-center px-4 py-4 border-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300 hover:from-purple-200 hover:to-purple-300 hover:shadow-md transition-all duration-200 w-full"
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
            image.preview ? 'border-purple-400 bg-purple-50 shadow-md' : 'border-purple-200 bg-purple-50'
          } flex items-center justify-center cursor-pointer group hover:border-purple-500`}
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
                className="rounded-lg p-2"
                priority
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (image.preview) URL.revokeObjectURL(image.preview);
                  setImage({ image: null, preview: null });
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all shadow-sm hover:shadow"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="text-purple-300 flex flex-col items-center transform group-hover:scale-110 transition-transform duration-200">
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
