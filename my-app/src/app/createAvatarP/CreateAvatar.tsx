"use client"
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { toast } from "sonner"
import { useSearchParams } from 'next/navigation'
import {
  Upload,
  ImagePlus,
  Check,
  Mic,
  Music,
  Loader2,
  Trash2,
  AlertTriangle,
  Text,
  Camera,
  StopCircle,
  Save,
  Play,
  RefreshCcw,
  X,
  Image as ImageIcon,
  Headphones,
  ArrowLeft
} from 'lucide-react'

interface Inputs {
  image: File | null
  preview: string | null
}

interface FormErrors {
  text?: string
  image?: string
  audio?: string
}

export default function UploadContentForm() {
  const searchParams = useSearchParams()
  const [text, setText] = useState('')
  const [image, setImage] = useState<Inputs>({
    image: null,
    preview: null,
  })
  const [audio, setAudio] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [recordingAudio, setRecordingAudio] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])
  const [videoCaptureActive, setVideoCaptureActive] = useState(false)
  const [fullscreenCamera, setFullscreenCamera] = useState(false)
  const [showGalleryImages,setShowGalleryImages]=useState(false);
  const [showGalleryAudios,setShowGalleryAudios]=useState(false);
  
  const [outputVideo, setOutputVideo] = useState<string | null>(null)
  const [processingVideo, setProcessingVideo] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const outputVideoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const galleryImages = [
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
  ];
  const galleryAudios = [
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
  ];
  
  // Function to handle image selection
  const handleImageSelect = (imageUrl) => {
    console.log('Selected image:', imageUrl);
    // You would typically do something with the selected image here
    setShowGalleryImages(false);
  };
  const handleAudioSelect = (AudioUrl) => {
    console.log('Selected Audio:', AudioUrl);
    // You would typically do something with the selected Audio here
    setShowGalleryAudios(false);
  };

  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  useEffect(() => {
    const avatar = searchParams.get('avatar')
    const imagePath = searchParams.get('image')
    const audioPath = searchParams.get('audio')

    if (avatar) {
      setText(avatar)
    }

    if (imagePath) {
      loadImageFromUrl(imagePath)
    }

    if (audioPath) {
      loadAudioFromUrl(audioPath)
    }
  }, [searchParams])

  const loadImageFromUrl = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`)
      }
      
      const blob = await response.blob()
      const file = new File([blob], url.split('/').pop() || 'prefilled-image.jpg', { type: blob.type })
      
      setImage({
        image: file,
        preview: URL.createObjectURL(blob)
      })
    } catch (error) {
      console.error('Error loading image:', error)
      toast.error("Failed to load prefilled image")
    }
  }

  const loadAudioFromUrl = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`)
      }
      
      const blob = await response.blob()
      const file = new File([blob], url.split('/').pop() || 'prefilled-audio.mp3', { type: blob.type })
      
      setAudio(file)
      setAudioUrl(URL.createObjectURL(blob))
    } catch (error) {
      console.error('Error loading audio:', error)
      toast.error("Failed to load prefilled audio")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (image.preview) {
      URL.revokeObjectURL(image.preview)
    }

    setImage({
      image: file,
      preview: URL.createObjectURL(file),
    })

    setErrors(prev => ({ ...prev, image: undefined }))
  }

  const startCamera = async () => {
    try {
      setVideoCaptureActive(true)
      setFullscreenCamera(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast.error("Could not access camera")
      setVideoCaptureActive(false)
      setFullscreenCamera(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setVideoCaptureActive(false)
    setFullscreenCamera(false)
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          if (blob) {
            if (image.preview) {
              URL.revokeObjectURL(image.preview)
            }

            const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" })
            const imageUrl = URL.createObjectURL(blob)

            setImage({
              image: file,
              preview: imageUrl
            })

            toast.success("Photo captured")
            stopCamera()
          }
        }, 'image/jpeg', 0.9)
      }
    }
  }

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    setAudio(file)
    const newAudioUrl = URL.createObjectURL(file)
    setAudioUrl(newAudioUrl)

    setErrors(prev => ({ ...prev, audio: undefined }))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

      setMediaRecorder(recorder)
      setAudioChunks([])

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data])
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }

        const audioFile = new File([audioBlob], "recorded-audio.webm", { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)

        setAudio(audioFile)
        setAudioUrl(url)
        setRecordingAudio(false)

        stream.getAudioTracks().forEach(track => track.stop())
        
        toast.success("Audio recording saved")
      }

      recorder.start()
      setRecordingAudio(true)
      toast.info("Recording started", { description: "Speak clearly into your microphone" })
    } catch (err) {
      console.error("Error starting audio recording:", err)
      toast.error("Could not start audio recording")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    setErrors(prev => ({ ...prev, text: undefined }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (!text.trim()) {
      newErrors.text = "Text input is required"
      isValid = false
    }

    if (!image.image) {
      newErrors.image = "Please select or capture an image"
      isValid = false
    }

    if (!audio) {
      newErrors.audio = "Please select or record an audio file"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please complete all fields", {
        description: "All fields are required to continue",
      })
      return
    }

    setLoading(true)
    setProcessingVideo(true)
    
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (image.image) formData.append('image', image.image);
      if (audio) formData.append('audio', audio);
      
      console.log("Sending request to the /inf endpoint...");
      const response = await fetch('http://127.0.0.1:1000/inf', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API failed with status: ${response.status}`);
      }
      
      const videoBlob = await response.blob();
      console.log("Received video response", videoBlob);
      
      if (outputVideo) {
        URL.revokeObjectURL(outputVideo);
      }
      
      const videoUrl = URL.createObjectURL(videoBlob);
      setOutputVideo(videoUrl);
      
      toast.success("Video generated successfully", {
        description: now,
      });
    } catch (error) {
      console.error('Processing failed:', error)
      toast.error("Video generation failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setLoading(false)
      setProcessingVideo(false)
    }
  }

  const resetForm = () => {
    setText('')
    if (image.preview) URL.revokeObjectURL(image.preview)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    if (outputVideo) URL.revokeObjectURL(outputVideo)
    setImage({ image: null, preview: null })
    setAudio(null)
    setAudioUrl(null)
    setOutputVideo(null)
    setErrors({})
    stopCamera()
    if (recordingAudio) {
      stopRecording()
    }
    toast("Form Cleared", {
      description: now,
    })
  }

  // Close full screen camera with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenCamera) {
        stopCamera();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [fullscreenCamera]);

  // Helper for file selection
  const openFileSelector = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  return (
    <>
      {/* Fullscreen Camera Modal */}
      {fullscreenCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-black bg-opacity-70">
            <button 
              onClick={stopCamera}
              className="text-white p-2 rounded-full hover:bg-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h2 className="text-white text-lg font-medium">Take a Photo</h2>
            <div className="w-10"></div>
          </div>
          
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="p-6 bg-black bg-opacity-70 flex justify-center">
            <button
              type="button"
              onClick={takePhoto}
              className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-all"
            >
              <Camera className="h-8 w-8 text-black" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full rounded-md bg-white shadow-2xl overflow-hidden border border-purple-200">
        {/* Header with gradient */}
        <div className="p-3 rounded-sm">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent flex items-center justify-center gap-2 underline decoration-2 decoration-purple-300">
            <Upload className="w-6 h-6" />
            Upload Content
          </h1>
        </div>

        <form onSubmit={handleUpload} className="p-10 space-y-8">
          {/* Text Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-purple-700 mb-2">
              <Text className="w-4 h-4 mr-2" />
              Text Input
            </label>
            <div className={`relative rounded-lg overflow-hidden transition-all duration-200 ${errors.text ? 'ring-2 ring-red-500' : 'hover:ring-2 hover:ring-purple-400'}`}>
              <input
                type="text"
                value={text}
                onChange={handleTextChange}
                className={`w-full px-4 py-3 bg-purple-50 text-purple-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.text ? 'border-red-500' : 'border-purple-200'}`}
                placeholder="Enter your text here"
              />
            </div>
            {errors.text && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
                {errors.text}
              </p>
            )}
          </div>

          {/* Image Upload */}
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
                        onClick={() => openFileSelector(fileInputRef)}
                        className={`flex cursor-pointer items-center justify-center px-4 py-4 border-2 rounded-lg transition-all duration-200 ${errors.image
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200 hover:border-purple-400'
                          }`}
                      >
                        <ImageIcon className="h-5 w-5 mr-2" />
                        <span>Upload</span>
                      </button>

                      
                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex items-center cursor-pointer justify-center px-4 py-4 border-2 rounded-lg bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 hover:border-purple-400 transition-all duration-200"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        <span>Camera</span>
                      </button>
                      {/* {showGalleryImages && 
                      <div className='absolute z-10 flex justify-center items-center align-middle'>
                        choosing from gal
                      </div>
                      }
                      <button
                        type="button"
                        onClick={()=>{setShowGalleryImages(true)}}
                        className="flex items-center cursor-pointer justify-center px-4 py-4 border-2 rounded-lg bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 hover:border-purple-400 transition-all duration-200"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        <span>Choose from Gallery</span>
                      </button> */}
                      <div className="relative">
                        {/* Modal overlay - appears when gallery is open */}
                        {showGalleryImages && (
                          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            {/* Dark overlay that disables background */}
                            <div 
                              className="absolute inset-0  bg-opacity-50" 
                              onClick={() => setShowGalleryImages(false)}
                            />
                            
                            {/* Gallery modal */}
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
                                {galleryImages.map((image, index) => (
                                  <div 
                                    key={index} 
                                    className="aspect-square cursor-pointer border rounded-md overflow-hidden hover:opacity-80 transition-opacity"
                                    onClick={() => handleImageSelect(image)}
                                  >
                                    <img 
                                      src={image} 
                                      alt={`Gallery image ${index + 1}`} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Gallery button trigger */}
                        <button
                          type="button"
                          onClick={() => setShowGalleryImages(true)}
                          className="flex items-center cursor-pointer justify-center px-4 py-4 border-2 rounded-lg bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 hover:border-purple-400 transition-all duration-200"
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
                  <Image
                    src={image.preview}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="text-purple-300 flex flex-col items-center">
                    <ImagePlus className="h-12 w-12" />
                    <span className="text-xs mt-2">Tap to select image</span>
                  </div>
                )}
                
                {image.preview && (
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
                )}
              </div>
            </div>
          </div>

          {/* Audio Upload */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-purple-700 mb-2">
              <Mic className="h-4 w-4 mr-2" />
              Audio Upload
            </label>

            <div className="grid lg:grid-cols-3 lg:grid-col-2 gap-3">
              <button
                type="button"
                onClick={() => openFileSelector(audioInputRef)}
                className={`flex items-center justify-center cursor-pointer px-4 py-4 border-2 rounded-lg transition-all duration-200 ${errors.audio
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200 hover:border-purple-400'
                  }`}
              >
                <Headphones className="h-5 w-5 mr-2" />
                <span>Upload Audio</span>
              </button>

              <button
                type="button"
                onClick={recordingAudio ? stopRecording : startRecording}
                className={`flex items-center justify-center px-4 cursor-pointer py-4 border-2 rounded-lg transition-all duration-200 ${recordingAudio
                  ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200 hover:border-red-400'
                  : 'bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 hover:border-purple-400'
                  }`}
              >
                {recordingAudio ? (
                  <>
                    <StopCircle className="h-5 w-5 mr-2 text-red-600" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    <span>Record Voice</span>
                  </>
                )}
              </button>
              {/* <button
                type="button"
                className={`flex items-center justify-center px-4 cursor-pointer py-4 border-2 rounded-lg transition-all duration-200 ${errors.audio
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200 hover:border-purple-400'
                  }`}
              >
                <Headphones className="h-5 w-5 mr-2" />
                <span>Upload Audio from gallery</span>
              </button> */}
              
              <button
                type="button"
                onClick={() => setShowGalleryAudios(true)}
                className="flex items-center cursor-pointer justify-center px-4 py-4 border-2 rounded-lg bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 hover:border-purple-400 transition-all duration-200"
              >
                <Camera className="h-5 w-5 mr-2" />
                <span>Choose from Gallery</span>
              </button>

              <div className="relative">
                  {/* Modal overlay - appears when gallery is open */}
                  {showGalleryAudios && (
                    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      {/* Dark overlay that disables background */}
                      <div 
                        className="absolute inset-0  bg-opacity-50" 
                        onClick={() => setShowGalleryAudios(false)}
                      />
                      
                      {/* Gallery modal */}
                      <div className="bg-white rounded-lg p-6 z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Choose an Image</h3>
                          <button 
                            onClick={() => setShowGalleryAudios(false)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {galleryAudios.map((audio, index) => (
                            <div 
                              key={index} 
                              className="aspect-square cursor-pointer border rounded-md overflow-hidden hover:opacity-80 transition-opacity"
                              onClick={() => handleAudioSelect(audio)}
                            >
                              <img 
                                src={audio} 
                                alt={`Gallery image ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              

              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="hidden"
              />
            </div>

            {recordingAudio && (
              <div className="mt-3 bg-red-50 p-4 rounded-lg border-2 border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-700">Recording in progress...</span>
                  </div>
                  <span className="text-xs text-red-500">{recordingAudio && "Click to stop"}</span>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="p-3 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-all"
                  >
                    <StopCircle className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            )}

            {errors.audio && (
              <p className="text-sm text-red-600 flex items-center mt-2">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
                {errors.audio}
              </p>
            )}

            {audio && !recordingAudio && (
              <div className="mt-4 bg-purple-50 p-5 rounded-lg border-2 border-purple-200 transition-all duration-200 hover:border-purple-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full text-purple-700">
                      <Music className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-purple-800 truncate">{audio.name}</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (audioUrl) URL.revokeObjectURL(audioUrl);
                      setAudio(null);
                      setAudioUrl(null);
                    }}
                    className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {audioUrl && (
                  <div>
                    <p className="text-xs font-medium text-purple-600 mb-2">Audio Preview:</p>
                    <audio
                      ref={audioRef}
                      controls
                      className="w-full h-10"
                      src={audioUrl}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Output Video Section */}
          {(outputVideo || processingVideo) && (
            <div className="space-y-3 mt-6 pt-6 border-t-2 border-purple-100 ">
              <h2 className="flex items-center text-lg font-medium text-purple-800 mb-2  ">
                <Play className="h-5 w-5 mr-2" />
                Generated Avatar Video
              </h2>
              
              {processingVideo && !outputVideo && (
                <div className="bg-purple-50 p-8 rounded-lg border-2 border-purple-200 flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
                  <p className="text-purple-700 font-medium ">Generating your avatar video...</p>
                  <p className="text-purple-500 text-sm mt-2">This may take a moment</p>
                </div>
              )}
              
              {outputVideo && (
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-300">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black mb-4">
                    <video 
                      ref={outputVideoRef}
                      src={outputVideo}
                      controls
                      autoPlay
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-purple-700 font-medium">Your avatar is speaking the text with your voice!</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (outputVideoRef.current) {
                          outputVideoRef.current.currentTime = 0;
                          outputVideoRef.current.play();
                        }
                      }}
                      className="flex items-center px-4 py-2 bg-purple-200 text-purple-800 rounded-lg hover:bg-purple-300 transition-all"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Replay
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit and Reset Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || processingVideo}
              className="flex-1 bg-gradient-to-r cursor-pointer from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-purple-300"
            >
              {loading || processingVideo ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  {processingVideo ? "Processing Video..." : "Uploading..."}
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-5 w-5 mr-2" />
                  Generate Avatar Video
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center border border-gray-300 hover:border-gray-400"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  )
}










































// "use client"
// import React, { useState, useRef } from 'react'
// import Image from 'next/image'
// import { toast } from "sonner"
// import {
//   Upload,
//   ImagePlus,
//   Check,
//   Mic,
//   Plus,
//   Music,
//   Loader2,
//   Trash2,
//   AlertTriangle,
//   Text,
//   Camera,
//   StopCircle,
//   Save,
//   Play,
//   RefreshCcw
// } from 'lucide-react'

// interface Inputs {
//   image: File | null
//   preview: string | null
// }

// interface FormErrors {
//   text?: string
//   image?: string
//   audio?: string
// }

// export default function UploadContentForm() {
//   const [text, setText] = useState('')
//   const [image, setImage] = useState<Inputs>({
//     image: null,
//     preview: null,
//   })
//   const [audio, setAudio] = useState<File | null>(null)
//   const [audioUrl, setAudioUrl] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [errors, setErrors] = useState<FormErrors>({})
//   const [recordingAudio, setRecordingAudio] = useState(false)
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
//   const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])
//   const [videoCaptureActive, setVideoCaptureActive] = useState(false)
  
//   // Add state for output video
//   const [outputVideo, setOutputVideo] = useState<string | null>(null)
//   const [processingVideo, setProcessingVideo] = useState(false)

//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const audioRef = useRef<HTMLAudioElement>(null)
//   const outputVideoRef = useRef<HTMLVideoElement>(null)

//   const now = new Date().toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//   })

//   // Image functions
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     if (image.preview) {
//       URL.revokeObjectURL(image.preview)
//     }

//     setImage({
//       image: file,
//       preview: URL.createObjectURL(file),
//     })

//     setErrors(prev => ({ ...prev, image: undefined }))
//   }

//   const startCamera = async () => {
//     try {
//       setVideoCaptureActive(true)
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true })

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//       }
//     } catch (err) {
//       console.error("Error accessing camera:", err)
//       toast.error("Could not access camera")
//       setVideoCaptureActive(false)
//     }
//   }

//   const stopCamera = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream
//       const tracks = stream.getTracks()

//       tracks.forEach(track => track.stop())
//       videoRef.current.srcObject = null
//     }
//     setVideoCaptureActive(false)
//   }

//   const takePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current
//       const canvas = canvasRef.current

//       canvas.width = video.videoWidth
//       canvas.height = video.videoHeight

//       const ctx = canvas.getContext('2d')
//       if (ctx) {
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

//         canvas.toBlob((blob) => {
//           if (blob) {
//             if (image.preview) {
//               URL.revokeObjectURL(image.preview)
//             }

//             const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" })
//             const imageUrl = URL.createObjectURL(blob)

//             setImage({
//               image: file,
//               preview: imageUrl
//             })

//             toast.success("Photo captured")
//             stopCamera()
//           }
//         }, 'image/jpeg', 0.9)
//       }
//     }
//   }

//   // Audio functions
//   const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     if (audioUrl) {
//       URL.revokeObjectURL(audioUrl)
//     }

//     setAudio(file)
//     const newAudioUrl = URL.createObjectURL(file)
//     setAudioUrl(newAudioUrl)

//     setErrors(prev => ({ ...prev, audio: undefined }))
//   }

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       const recorder = new MediaRecorder(stream)

//       setMediaRecorder(recorder)
//       setAudioChunks([])

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           setAudioChunks(prev => [...prev, e.data])
//         }
//       }

//       recorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
//         if (audioUrl) {
//           URL.revokeObjectURL(audioUrl)
//         }

//         const audioFile = new File([audioBlob], "recorded-audio.webm", { type: "audio/webm" })
//         const url = URL.createObjectURL(audioBlob)

//         setAudio(audioFile)
//         setAudioUrl(url)
//         setRecordingAudio(false)

//         // Stop all audio tracks
//         stream.getAudioTracks().forEach(track => track.stop())
//       }

//       recorder.start()
//       setRecordingAudio(true)
//     } catch (err) {
//       console.error("Error starting audio recording:", err)
//       toast.error("Could not start audio recording")
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state !== 'inactive') {
//       mediaRecorder.stop()
//     }
//   }

//   const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setText(e.target.value)
//     setErrors(prev => ({ ...prev, text: undefined }))
//   }

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {}
//     let isValid = true

//     if (!text.trim()) {
//       newErrors.text = "Text input is required"
//       isValid = false
//     }

//     if (!image.image) {
//       newErrors.image = "Please select or capture an image"
//       isValid = false
//     }

//     if (!audio) {
//       newErrors.audio = "Please select or record an audio file"
//       isValid = false
//     }

//     setErrors(newErrors)
//     return isValid
//   }

//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       toast.error("Please complete all fields", {
//         description: "All fields are required to continue",
//       })
//       return
//     }

//     setLoading(true)
//     setProcessingVideo(true)
    
//     try {
//       // Text to Audio API call
//       const T2A = new FormData();
//       T2A.append('text', text)
//       if (audio) T2A.append('audio', audio)
      
//       console.log("Sending text to audio request...")
//       const responseT2A = await fetch('http://127.0.0.1:1234/inf', {
//         method: 'POST',
//         body: T2A
//       });
      
//       if (!responseT2A.ok) {
//         throw new Error(`Text to Audio API failed with status: ${responseT2A.status}`);
//       }
      
//       const audioBlob = await responseT2A.blob();
//       console.log("Received audio response", audioBlob);
      
//       // Avatar generation API call
//       const Avatar = new FormData();
//       if (image.image) Avatar.append('image', image.image)
//       if (audioBlob) Avatar.append('audio', audioBlob)
      
//       console.log("Sending avatar generation request...")
//       const responseAvatar = await fetch("http://127.0.0.1:5000/run", {
//         method: 'POST',
//         body: Avatar
//       });
      
//       if (!responseAvatar.ok) {
//         throw new Error(`Avatar API failed with status: ${responseAvatar.status}`);
//       }
      
//       // Handle video response
//       const videoBlob = await responseAvatar.blob();
//       console.log("Received video response", videoBlob);
      
//       // Create URL for video and set it to state
//       if (outputVideo) {
//         URL.revokeObjectURL(outputVideo);
//       }
      
//       const videoUrl = URL.createObjectURL(videoBlob);
//       setOutputVideo(videoUrl);
      
//       toast.success("Video generated successfully", {
//         description: now,
//       });
//     } catch (error) {
//       console.error('Processing failed:', error)
//       toast.error("Video generation failed", {
//         description: error instanceof Error ? error.message : "Unknown error occurred"
//       });
//     } finally {
//       setLoading(false)
//       setProcessingVideo(false)
//     }
//   }

//   const resetForm = () => {
//     setText('')
//     if (image.preview) URL.revokeObjectURL(image.preview)
//     if (audioUrl) URL.revokeObjectURL(audioUrl)
//     if (outputVideo) URL.revokeObjectURL(outputVideo)
//     setImage({ image: null, preview: null })
//     setAudio(null)
//     setAudioUrl(null)
//     setOutputVideo(null)
//     setErrors({})
//     stopCamera()
//     if (recordingAudio) {
//       stopRecording()
//     }
//     toast("Form Cleared", {
//       description: now,
//     })
//   }

//   return (
//     <div className="w-full rounded-md bg-white shadow-2xl overflow-hidden border border-purple-200">
//       {/* Header with gradient */}
//       <div className="p-3 rounded-sm">
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent flex items-center justify-center gap-2 underline decoration-2 decoration-purple-300">
//           <Upload className="w-6 h-6" />
//           Upload Content
//         </h1>
//       </div>

//       <form onSubmit={handleUpload} className="p-10 space-y-8">
//         {/* Text Input */}
//         <div className="space-y-2">
//           <label className="flex items-center text-sm font-medium text-purple-700 mb-2">
//             <Text className="w-4 h-4 mr-2" />
//             Text Input
//           </label>
//           <div className={`relative rounded-lg overflow-hidden transition-all duration-200 ${errors.text ? 'ring-2 ring-red-500' : 'hover:ring-2 hover:ring-purple-400'}`}>
//             <input
//               type="text"
//               value={text}
//               onChange={handleTextChange}
//               className={`w-full px-4 py-3 bg-purple-50 text-purple-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.text ? 'border-red-500' : 'border-purple-200'}`}
//               placeholder="Enter your text here"
//             />
//           </div>
//           {errors.text && (
//             <p className="mt-2 text-sm text-red-600 flex items-center">
//               <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
//               {errors.text}
//             </p>
//           )}
//         </div>

//         {/* Image Upload */}
//         <div className="space-y-3">
//           <label className="flex items-center text-sm font-medium text-purple-700 mb-2">
//             <ImagePlus className="h-4 w-4 mr-2" />
//             Image Upload
//           </label>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex flex-col space-y-3">
//               {!videoCaptureActive && (
//                 <div className="flex space-x-3">
//                   <label className={`cursor-pointer flex items-center justify-center flex-1 px-4 py-4 border-2 rounded-lg transition-all duration-200 ${errors.image
//                     ? 'bg-red-100 text-red-700 border-red-300'
//                     : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200 hover:border-purple-400'
//                     }`}>
//                     <Plus className="h-5 w-5 mr-2" />
//                     <span>Choose Image</span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                     />
//                   </label>

//                   <button
//                     type="button"
//                     onClick={startCamera}
//                     className="flex-1 flex items-center justify-center px-4 py-4 border-2 rounded-lg bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 hover:border-purple-400 transition-all duration-200"
//                   >
//                     <Camera className="h-5 w-5 mr-2" />
//                     <span>Take Photo</span>
//                   </button>
//                 </div>
//               )}

//               {videoCaptureActive && (
//                 <div className="space-y-3">
//                   <div className="relative overflow-hidden rounded-lg border-2 border-purple-400 bg-white">
//                     <video
//                       ref={videoRef}
//                       autoPlay
//                       playsInline
//                       className="w-full h-48 object-cover"
//                     />
//                     <canvas ref={canvasRef} className="hidden" />

//                     <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-3">
//                       <button
//                         type="button"
//                         onClick={takePhoto}
//                         className="p-2 bg-purple-600 rounded-full shadow-lg hover:bg-purple-500 transition-all"
//                       >
//                         <Camera className="h-6 w-6 text-white" />
//                       </button>

//                       <button
//                         type="button"
//                         onClick={stopCamera}
//                         className="p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 transition-all"
//                       >
//                         <Trash2 className="h-6 w-6 text-gray-700" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {image.image && (
//                 <p className="text-sm text-purple-700 flex items-center">
//                   <Check className="h-4 w-4 mr-1 text-green-600" />
//                   {image.image.name}
//                 </p>
//               )}

//               {errors.image && (
//                 <p className="text-sm text-red-600 flex items-center">
//                   <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
//                   {errors.image}
//                 </p>
//               )}
//             </div>

//             <div className={`relative h-48 w-full overflow-hidden rounded-lg border-2 transition-all duration-200 ${image.preview ? 'border-purple-400 bg-purple-50' : 'border-purple-200 bg-purple-50'} flex items-center justify-center`}>
//               {image.preview ? (
//                 <Image
//                   src={image.preview}
//                   alt="Preview"
//                   fill
//                   sizes="(max-width: 768px) 100vw, 300px"
//                   style={{ objectFit: "contain" }}
//                   className="rounded-lg"
//                 />
//               ) : (
//                 <div className="text-purple-300 flex flex-col items-center">
//                   <ImagePlus className="h-12 w-12" />
//                   <span className="text-xs mt-2">Image preview</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Audio Upload */}
//         <div className="space-y-3">
//           <label className="flex items-center text-sm font-medium text-purple-700 mb-2">
//             <Mic className="h-4 w-4 mr-2" />
//             Audio Upload
//           </label>

//           <div className="flex space-x-3">
//             <label className={`cursor-pointer flex-1 flex items-center justify-center px-4 py-4 border-2 rounded-lg transition-all duration-200 ${errors.audio
//               ? 'bg-red-100 text-red-700 border-red-300'
//               : 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200 hover:border-purple-400'
//               }`}>
//               <Plus className="h-5 w-5 mr-2" />
//               <span>Upload Audio</span>
//               <input
//                 type="file"
//                 accept="audio/*"
//                 onChange={handleAudioChange}
//                 className="hidden"
//               />
//             </label>

//             <button
//               type="button"
//               onClick={recordingAudio ? stopRecording : startRecording}
//               className={`flex-1 flex items-center justify-center px-4 py-4 border-2 rounded-lg transition-all duration-200 ${recordingAudio
//                 ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200 hover:border-red-400'
//                 : 'bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 hover:border-purple-400'
//                 }`}
//             >
//               {recordingAudio ? (
//                 <>
//                   <StopCircle className="h-5 w-5 mr-2 text-red-600" />
//                   <span>Stop Recording</span>
//                 </>
//               ) : (
//                 <>
//                   <Mic className="h-5 w-5 mr-2" />
//                   <span>Record Audio</span>
//                 </>
//               )}
//             </button>
//           </div>

//           {recordingAudio && (
//             <div className="mt-3 bg-red-50 p-4 rounded-lg border-2 border-red-200 flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="mr-3 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
//                 <span className="text-red-700">Recording in progress...</span>
//               </div>
//               <span className="text-xs text-red-500">Click {"'Stop Recording'"} when finished</span>
//             </div>
//           )}

//           {errors.audio && (
//             <p className="text-sm text-red-600 flex items-center mt-2">
//               <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
//               {errors.audio}
//             </p>
//           )}

//           {audio && !recordingAudio && (
//             <div className="mt-4 bg-purple-50 p-5 rounded-lg border-2 border-purple-200 transition-all duration-200 hover:border-purple-300">
//               <div className="flex items-center space-x-3 mb-3">
//                 <div className="p-2 bg-purple-100 rounded-full text-purple-700">
//                   <Music className="h-4 w-4" />
//                 </div>
//                 <span className="text-sm text-purple-800 truncate">{audio.name}</span>
//               </div>

//               {audioUrl && (
//                 <div>
//                   <p className="text-xs font-medium text-purple-600 mb-2">Audio Preview:</p>
//                   <audio
//                     ref={audioRef}
//                     controls
//                     className="w-full h-10"
//                     src={audioUrl}
//                   >
//                     Your browser does not support the audio element.
//                   </audio>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Output Video Section */}
//         {(outputVideo || processingVideo) && (
//           <div className="space-y-3 mt-6 pt-6 border-t-2 border-purple-100">
//             <h2 className="flex items-center text-lg font-medium text-purple-800 mb-2">
//               <Play className="h-5 w-5 mr-2" />
//               Generated Avatar Video
//             </h2>
            
//             {processingVideo && !outputVideo && (
//               <div className="bg-purple-50 p-8 rounded-lg border-2 border-purple-200 flex flex-col items-center justify-center">
//                 <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
//                 <p className="text-purple-700 font-medium">Generating your avatar video...</p>
//                 <p className="text-purple-500 text-sm mt-2">This may take a moment</p>
//               </div>
//             )}
            
//             {outputVideo && (
//               <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-300">
//                 <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black mb-4">
//                   <video 
//                     ref={outputVideoRef}
//                     src={outputVideo}
//                     controls
//                     autoPlay
//                     className="w-full h-full"
//                   >
//                     Your browser does not support the video tag.
//                   </video>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <p className="text-purple-700 font-medium">Your avatar is speaking the text with your voice!</p>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       if (outputVideoRef.current) {
//                         outputVideoRef.current.currentTime = 0;
//                         outputVideoRef.current.play();
//                       }
//                     }}
//                     className="flex items-center px-4 py-2 bg-purple-200 text-purple-800 rounded-lg hover:bg-purple-300 transition-all"
//                   >
//                     <RefreshCcw className="h-4 w-4 mr-2" />
//                     Replay
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Submit and Reset Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 pt-4">
//           <button
//             type="submit"
//             disabled={loading || processingVideo}
//             className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-purple-300"
//           >
//             {loading || processingVideo ? (
//               <span className="flex items-center justify-center">
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
//                 {processingVideo ? "Processing Video..." : "Uploading..."}
//               </span>
//             ) : (
//               <span className="flex items-center">
//                 <Save className="h-5 w-5 mr-2" />
//                 Generate Avatar Video
//               </span>
//             )}
//           </button>
//           <button
//             type="button"
//             onClick={resetForm}
//             className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center border border-gray-300 hover:border-gray-400"
//           >
//             <Trash2 className="h-5 w-5 mr-2" />
//             Reset
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }









