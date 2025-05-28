"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import {
  Upload,
  Loader2,
  Trash2,
  Camera,
  Save,
  Play,
  RefreshCcw,
  ArrowLeft,
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
  
  // Get parameters from URL
  const avatarId = searchParams.get('avatar')
  const imageUrl = searchParams.get('image')
  const audioUrl = searchParams.get('audio')
  
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
  
  // Terms and conditions modal state
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

  // Load image from URL on component mount
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
  
  // Load audio from URL on component mount
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

  // Function to handle image selection
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
    
    // Reset to original values from URL params
    setImage({ 
      image: null, 
      preview: imageUrl 
    })
    setAudio(null)
    setAudioSrc(audioUrl)
    setOutputVideo(null)
    setErrors({})
    stopCamera()
    if (recordingAudio) {
      stopRecording()
    }
    toast("Form Reset to Original Avatar", {
      description: now,
    })
    
    // Reload image and audio from original URLs
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

  // Close full screen camera with escape key
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

  // Helper for file selection
  const openFileSelector = (ref: React.RefObject<HTMLInputElement | null>): void => {
    if (ref.current) {
      ref.current.click()
    }
  }

  return (
    <>
      {/* Terms and Conditions Modal */}
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setShowTermsModal(false)
          handleUpload()
        }}
      />

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
          {/* {avatarId && <p className="text-center text-purple-600 mt-1">Avatar ID: {avatarId}</p>} */}
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Text Input */}
          <TextInput text={text} handleTextChange={handleTextChange} errors={errors}></TextInput>

          {/* Image Upload */}
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

          {/* Audio Upload */}
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
                          outputVideoRef.current.currentTime = 0
                          outputVideoRef.current.play()
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