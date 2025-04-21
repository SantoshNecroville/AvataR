import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Mic, MicOff, RefreshCw } from 'lucide-react';

interface TextToAudioInterface {
  text: string;
  audio: File | null;
}

interface FormErrors {
  text?: string;
  audio?: string;
}

const TextToAudio = () => {
  const [formData, setFormData] = useState<TextToAudioInterface>({
    text: 'The quick brown fox jumps over the lazy sleeping dog.',
    audio: null
  });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [outputAudioUrl, setOutputAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const outputAudioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Clean up any object URLs on component unmount
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (outputAudioUrl) {
        URL.revokeObjectURL(outputAudioUrl);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [audioUrl, outputAudioUrl]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, text: e.target.value }));
    setErrors(prev => ({ ...prev, text: undefined }));
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setFormData(prev => ({ ...prev, audio: file }));
    const newAudioUrl = URL.createObjectURL(file);
    setAudioUrl(newAudioUrl);
    setErrors(prev => ({ ...prev, audio: undefined }));
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        
        const newAudioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(newAudioUrl);
        setFormData(prev => ({ ...prev, audio: file }));
        setErrors(prev => ({ ...prev, audio: undefined }));
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      });
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setErrors(prev => ({ 
        ...prev, 
        audio: 'Unable to access microphone. Please check permissions.' 
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.text.trim()) {
      newErrors.text = 'Please enter some text';
    }
    
    if (!formData.audio) {
      newErrors.audio = 'Please upload or record an audio file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create form data for multipart/form-data request
      const requestData = new FormData();
      requestData.append('text', formData.text);
      if (formData.audio) {
        requestData.append('audio', formData.audio);
      }
      
      const response = await fetch('http://192.168.29.115:1234/inf', {
        method: 'POST',
        body: requestData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      
      const blob = await response.blob();
      
      if (outputAudioUrl) {
        URL.revokeObjectURL(outputAudioUrl);
      }
      
      const newOutputAudioUrl = URL.createObjectURL(blob);
      setOutputAudioUrl(newOutputAudioUrl);
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error processing request:', error);
      setErrors({ 
        text: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      text: 'The quick brown fox jumps over the lazy sleeping dog.',
      audio: null
    });
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    if (outputAudioUrl) {
      URL.revokeObjectURL(outputAudioUrl);
      setOutputAudioUrl(null);
    }
    
    setErrors({});
    setSubmitted(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md border border-purple-200">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Text to Audio Converter</h2>
      
      {submitted && outputAudioUrl ? (
        <div className="bg-purple-50 border border-purple-300 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Success icon would go here */}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">Conversion Successful!</h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>Your text has been converted to audio using your voice sample.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="text-sm font-medium text-purple-800 mb-2">Generated Audio:</h4>
            <audio
              ref={outputAudioRef}
              controls
              className="w-full"
              src={outputAudioUrl}
              autoPlay
            >
              Your browser does not support the audio element.
            </audio>
            
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  // Create an anchor element and trigger download
                  const a = document.createElement('a');
                  a.href = outputAudioUrl;
                  a.download = 'generated-audio.wav'; // Default filename
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="text-sm font-medium text-purple-700 hover:text-purple-900"
              >
                Download Audio
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-purple-800 mb-1">
              Enter Text to Convert
            </label>
            <textarea
              id="text-input"
              rows={4}
              value={formData.text}
              onChange={handleTextChange}
              className={`w-full px-3 py-2 bg-white text-purple-900 border ${errors.text ? 'border-red-500' : 'border-purple-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              placeholder="Enter the text you want to convert to audio using your voice..."
            ></textarea>
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="audio-input" className="block text-sm font-medium text-purple-800 mb-1">
              Voice Sample
            </label>
            
            <div className="flex flex-col space-y-4">
              {/* Record audio option */}
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-purple-800">Record your voice</span>
                  <div className="flex space-x-2">
                    {isRecording ? (
                      <>
                        <span className="text-sm text-red-600 mr-2">{formatTime(recordingTime)}</span>
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <MicOff className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="p-2 bg-purple-600 cursor-pointer rounded-full text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <Mic className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {isRecording
                    ? "Recording in progress... Click the stop button when finished."
                    : "Click the microphone button to start recording your voice sample."}
                </p>
              </div>
              
              {/* OR divider */}
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              {/* Upload audio file option */}
              <div className={`flex justify-center px-6 pt-5 pb-6 border-2 ${errors.audio ? 'border-red-500' : 'border-purple-200'} border-dashed rounded-md bg-white`}>
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-purple-800 justify-center">
                    <label htmlFor="audio-input" className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-800 focus-within:outline-none">
                      <span>Upload a voice sample</span>
                      <input 
                        id="audio-input" 
                        name="audio-input" 
                        type="file" 
                        accept="audio/*"
                        className="sr-only"
                        onChange={handleAudioChange}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className="pl-1 text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">WAV files recommended (up to 10MB)</p>
                </div>
              </div>
            </div>
            
            {errors.audio && (
              <p className="mt-1 text-sm text-red-600">{errors.audio}</p>
            )}
            
            {audioUrl && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-full text-purple-700">
                      {/* Audio icon would go here */}
                    </div>
                    <span className="ml-2 text-sm text-purple-800">
                      {formData.audio?.name || "Voice recording"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (audioUrl) {
                        URL.revokeObjectURL(audioUrl);
                        setAudioUrl(null);
                      }
                      setFormData(prev => ({ ...prev, audio: null }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <audio
                  ref={audioRef}
                  controls
                  className="w-full"
                  src={audioUrl}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" />
                  Processing...
                </>
              ) : 'Convert to Audio'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TextToAudio;