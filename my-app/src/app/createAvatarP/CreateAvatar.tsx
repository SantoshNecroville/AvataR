"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import {
  Loader2,
  Trash2,
  Camera,
  Save,
  Play,
  RefreshCcw,
  ArrowLeft,
  Sun,
  Moon,
  Crop,
  Image as ImageIcon,
  Mic,
  Type
} from 'lucide-react'
import TextInput from './TextInput'
import Imageupload from './Imageupload'
import Audioupload from './Audioupload'
import TermsModal from './TermsModel'

interface Inputs {
  image: File | null;
  preview: string | null;
}

interface FormErrors {
  text?: string
  image?: string
  audio?: string
}

export default function CreateAvatarP() {
  const searchParams = useSearchParams()
  
  const avatarId = searchParams.get('avatar')
  const imageUrl = searchParams.get('image')
  const audioUrl = searchParams.get('audio')
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [cropImage, setCropImage] = useState(false)
  const [text, setText] = useState('')
  const [image, setImage] = useState<Inputs>({
    image: null,
    preview: imageUrl || null,
  })
  const [audio, setAudio] = useState<File | null>(null)
  const [audioSrc, setAudioSrc] = useState<string | null>(audioUrl || null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [recordingAudio, setRecordingAudio] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])
  const [videoCaptureActive, setVideoCaptureActive] = useState(false)
  const [fullscreenCamera, setFullscreenCamera] = useState(false)
  const [showGalleryImages, setShowGalleryImages] = useState(false)
  const [showGalleryAudios, setShowGalleryAudios] = useState(false)

  const [outputVideo, setOutputVideo] = useState<string | null>(null)
  const [processingVideo, setProcessingVideo] = useState(false)
  
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [, setFormValidated] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const outputVideoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const galleryImages = [
    '/avatars/builder.png',
    '/avatars/guardian.png',
    '/avatars/hacker.png',
    '/avatars/knight.png',
    '/avatars/mage.png',
    '/avatars/monk.png',
    '/avatars/ninja.png',
    '/avatars/queen.png',
    '/avatars/sage.png',
    '/avatars/samurai.png',
    '/avatars/space.png',
    '/avatars/wizard.png',
  ]
  const galleryAudios = [
    '/audio/builder.mp3',
    '/audio/guardian.mp3',
    '/audio/hacker.mp3',
    '/audio/knight.mp3',
    '/audio/mage.mp3',
    '/audio/monk.mp3',
    '/audio/ninja.mp3',
    '/audio/queen.mp3',
    '/audio/sage.mp3',
    '/audio/samurai.mp3',
    '/audio/space.mp3',
    '/audio/wizard.mp3',
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
      if (savedTheme) {
        setTheme(savedTheme)
      }
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
  }

  useEffect(() => {
    const fetchImageAsFile = async () => {
      if (imageUrl) {
        try {
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          const file = new File([blob], imageUrl.split('/').pop() || 'avatar-image.png', {
            type: blob.type,
          })
          
          setImage({
            image: file,
            preview: imageUrl,
          })
        } catch (err) {
          console.error("Failed to load image:", err)
          toast.error("Failed to load avatar image")
        }
      }
    }
    
    fetchImageAsFile()
  }, [imageUrl])
  
  useEffect(() => {
    const fetchAudioAsFile = async () => {
      if (audioUrl) {
        try {
          const response = await fetch(audioUrl)
          const blob = await response.blob()
          const file = new File([blob], audioUrl.split('/').pop() || 'avatar-audio.mp3', {
            type: blob.type,
          })
          
          setAudio(file)
          setAudioSrc(audioUrl)
        } catch (err) {
          console.error("Failed to load audio:", err)
          toast.error("Failed to load avatar audio")
        }
      }
    }
    
    fetchAudioAsFile()
  }, [audioUrl])

  const handleImageSelect = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], imageUrl.split('/').pop() || 'selected-image.png', {
        type: blob.type,
      })
  
      if (image.preview) {
        URL.revokeObjectURL(image.preview)
      }
  
      const previewUrl = URL.createObjectURL(blob)
  
      setImage({
        image: file,
        preview: previewUrl,
      })
  
      setErrors(prev => ({ ...prev, image: undefined }))
      toast.success("Image selected from gallery")
    } catch (err) {
      console.error("Failed to select image:", err)
      toast.error("Failed to load image")
    } finally {
      setShowGalleryImages(false)
    }
  }
  
  const handleAudioSelect = async (audioUrl: string) => {
    try {
      const response = await fetch(audioUrl)
      const blob = await response.blob()
      const file = new File([blob], audioUrl.split('/').pop() || 'selected-audio.mp3', {
        type: blob.type,
      })
  
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc)
      }
  
      const previewUrl = URL.createObjectURL(blob)
  
      setAudio(file)
      setAudioSrc(previewUrl)
  
      setErrors(prev => ({ ...prev, audio: undefined }))
      toast.success("Audio selected from gallery")
    } catch (err) {
      console.error("Failed to select audio:", err)
      toast.error("Failed to load audio")
    } finally {
      setShowGalleryAudios(false)
    }
  }

  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

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

    if (audioSrc) {
      URL.revokeObjectURL(audioSrc)
    }

    setAudio(file)
    const newAudioUrl = URL.createObjectURL(file)
    setAudioSrc(newAudioUrl)

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
        if (audioSrc) {
          URL.revokeObjectURL(audioSrc)
        }

        const audioFile = new File([audioBlob], "recorded-audio.webm", { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)

        setAudio(audioFile)
        setAudioSrc(url)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please complete all fields", {
        description: "All fields are required to continue",
      })
      return
    }
    
    setFormValidated(true)
    setShowTermsModal(true)
  }

  const handleUpload = async () => {
    setLoading(true)
    setProcessingVideo(true)

    try {
      const formData = new FormData()
      formData.append('text', text)
      formData.append('avatarId', avatarId || '')
      formData.append('crop', cropImage.toString())
      if (image.image) formData.append('image', image.image)
      if (audio) formData.append('audio', audio)

      console.log("Sending request to the /createAvatar endpoint...")
      const response = await fetch('http://127.0.0.1:1000/inf', {
        method: 'POST',
        body: formData
      })
 
      if (!response.ok) {
        throw new Error(`API failed with status: ${response.status}`)
      }

      const videoBlob = await response.blob()
      console.log("Received video response", videoBlob)

      if (outputVideo) {
        URL.revokeObjectURL(outputVideo)
      }

      const videoUrl = URL.createObjectURL(videoBlob)
      setOutputVideo(videoUrl)

      toast.success("Video generated successfully", {
        description: now,
      })
    } catch (error) {
      console.error('Processing failed:', error)
      toast.error("Video generation failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      })
    } finally {
      setLoading(false)
      setProcessingVideo(false)
    }
  }

  const resetForm = () => {
    setText('')
    if (image.preview && image.preview !== imageUrl) URL.revokeObjectURL(image.preview)
    if (audioSrc && audioSrc !== audioUrl) URL.revokeObjectURL(audioSrc)
    if (outputVideo) URL.revokeObjectURL(outputVideo)
    
    setImage({ 
      image: null, 
      preview: imageUrl 
    })
    setAudio(null)
    setAudioSrc(audioUrl)
    setOutputVideo(null)
    setErrors({})
    setCropImage(false)
    stopCamera()
    if (recordingAudio) {
      stopRecording()
    }
    toast("Form Reset to Original Avatar", {
      description: now,
    })
    
    if (imageUrl) {
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], imageUrl.split('/').pop() || 'avatar-image.png', {
            type: blob.type,
          })
          setImage({
            image: file,
            preview: imageUrl,
          })
        })
    }
    
    if (audioUrl) {
      fetch(audioUrl)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], audioUrl.split('/').pop() || 'avatar-audio.mp3', {
            type: blob.type,
          })
          setAudio(file)
        })
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenCamera) {
        stopCamera()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [fullscreenCamera])

  const openFileSelector = (ref: React.RefObject<HTMLInputElement | null>): void => {
    if (ref.current) {
      ref.current.click()
    }
  }

  const containerClass = theme === 'dark' 
    ? 'min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white rounded-3xl' 
    : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900 rounded-3xl'

  const cardClass = theme === 'dark'
    ? 'w-full max-w-7xl mx-auto rounded-2xl bg-black shadow-2xl backdrop-blur-lg border border-gray-700/50'
    : 'w-full max-w-7xl mx-auto rounded-2xl bg-white/80 shadow-2xl backdrop-blur-lg border border-blue-200/50'

  const sectionClass = theme === 'dark'
    ? 'bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm'
    : 'bg-white/60 rounded-xl p-6 border border-blue-100 backdrop-blur-sm'

  return (
    <div className={containerClass}>
      <div className="container mx-auto p-6">

        <div className="flex justify-between items-center mb-8">
          <div className="text-4xl font-semibold ml-5 tracking-wide">
            Avatar Ai Studio
          </div>
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-yellow-400 shadow-lg' 
                : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 shadow-lg'
            }`}
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>

        <TermsModal 
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onAccept={() => {
            setShowTermsModal(false)
            handleUpload()
          }}
        />

        {fullscreenCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-lg">
              <button
                onClick={stopCamera}
                className="text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h2 className="text-white text-xl font-semibold">Take a Photo</h2>
              <div className="w-12"></div>
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

            <div className="p-8 bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-lg flex justify-center">
              <button
                type="button"
                onClick={takePhoto}
                className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110"
              >
                <Camera className="h-10 w-10 text-white" />
              </button>
            </div>
          </div>
        )}

        <div className={cardClass}>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className={sectionClass}>
              <h2 className={`flex items-center text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <Type className="h-6 w-6 mr-3 text-blue-500" />
                Text Content
              </h2>
              <TextInput text={text} handleTextChange={handleTextChange} errors={errors} />
            </div>

            <div className={sectionClass}>
              <h2 className={`flex items-center text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <ImageIcon className="h-6 w-6 mr-3 text-purple-500" />
                Avatar Image
              </h2>
              <Imageupload 
                videoCaptureActive={videoCaptureActive}
                openFileSelector={openFileSelector}
                fileInputRef={fileInputRef}
                errors={errors}
                startCamera={startCamera}
                showGalleryImages={showGalleryImages}
                setShowGalleryImages={setShowGalleryImages}
                galleryImages={galleryImages}
                handleImageChange={handleImageChange}
                image={image}
                setImage={setImage}
                handleImageSelect={handleImageSelect} 
              />
            </div>

            <div className={sectionClass}>
              <h2 className={`flex items-center text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <Crop className="h-6 w-6 mr-3 text-green-500" />
                Image Processing Options
              </h2>
              
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id="cropImage"
                  checked={cropImage}
                  onChange={(e) => setCropImage(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                />
                <label htmlFor="cropImage" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Auto-crop face from image for better results
                </label>
              </div>
            </div>

            <div className={sectionClass}>
              <h2 className={`flex items-center text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <Mic className="h-6 w-6 mr-3 text-red-500" />
                Voice Audio
              </h2>
              <Audioupload 
                openFileSelector={openFileSelector}
                audioInputRef={audioInputRef}
                recordingAudio={recordingAudio}
                stopRecording={stopRecording}
                startRecording={startRecording}
                setShowGalleryAudios={setShowGalleryAudios}
                showGalleryAudios={showGalleryAudios}
                galleryAudios={galleryAudios}
                handleAudioChange={handleAudioChange}
                errors={errors}
                audio={audio}
                handleAudioSelect={handleAudioSelect}
                setAudio={setAudio}
                setAudioUrl={setAudioSrc}
                audioRef={audioRef}
                audioUrl={audioSrc} 
              />
            </div>

            {(outputVideo || processingVideo) && (
              <div className={sectionClass}>
                <h2 className={`flex items-center text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  <Play className="h-6 w-6 mr-3 text-green-500" />
                  Generated Avatar Video
                </h2>

                {processingVideo && !outputVideo && (
                  <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} p-12 rounded-xl border-2 ${theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200'} flex flex-col items-center justify-center backdrop-blur-sm`}>
                    <div className="relative">
                      <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-6" />
                      <div className="absolute inset-0 h-16 w-16 border-4 border-blue-500/20 rounded-full animate-pulse"></div>
                    </div>
                    <p className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-blue-700'}`}>
                      Generating your avatar video...
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-blue-600'}`}>
                      This magical process may take a moment
                    </p>
                  </div>
                )}

                {outputVideo && (
                  <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-green-900/20 to-blue-900/20' : 'bg-gradient-to-r from-green-50 to-blue-50'} p-6 rounded-xl border-2 ${theme === 'dark' ? 'border-green-500/30' : 'border-green-200'}`}>
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black mb-6 shadow-2xl">
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
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-green-700'}`}>
                        🎉 Your avatar is speaking the text with your voice!
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (outputVideoRef.current) {
                            outputVideoRef.current.currentTime = 0
                            outputVideoRef.current.play()
                          }
                        }}
                        className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white shadow-lg' 
                            : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white shadow-lg'
                        }`}
                      >
                        <RefreshCcw className="h-5 w-5 mr-2" />
                        Replay
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <button
                type="submit"
                disabled={loading || processingVideo}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center shadow-xl ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white hover:shadow-blue-500/25'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25'
                }`}
              >
                {loading || processingVideo ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                    {processingVideo ? "Creating Magic..." : "Uploading..."}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-6 w-6 mr-3" />
                    Generate Avatar Video
                  </span>
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-xl ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600 hover:shadow-gray-500/25'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border border-gray-300 hover:shadow-gray-400/25'
                }`}
              >
                <Trash2 className="h-6 w-6 mr-3" />
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}