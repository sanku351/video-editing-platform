"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileVideo } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useDispatch, useSelector } from "react-redux"
import { setVideo } from "@/lib/redux/slices/videoSlice"
import { toast } from "sonner"
import { RootState } from "@/lib/redux/store"

export function UploadZone() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const dispatch = useDispatch()
  const { videoUrl, fileName } = useSelector((state: RootState) => state.video)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith("video/")) {
      simulateUpload(file)
    } else {
      toast.error("Invalid file type. Please upload a video file.")
    }
  }, [])

  const simulateUpload = (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    const videoUrl = URL.createObjectURL(file)
    let progress = 0

    const interval = setInterval(() => {
      progress += 5

      if (progress >= 100) {
        clearInterval(interval)
        setUploadProgress(100)
        setIsUploading(false)

        dispatch(
          setVideo({
            videoUrl,
            fileName: file.name,
            duration: 120,
          }),
        )
        toast.success(`${file.name} has been uploaded successfully.`)
      } else {
        setUploadProgress(progress)
      }
    }, 200)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    disabled: isUploading,
    maxFiles: 1,
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary/50"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <>
              <FileVideo className="h-16 w-16 text-primary animate-pulse" />
              <h3 className="text-xl font-medium">Uploading video...</h3>
              <div className="w-full max-w-md">
                <Progress value={uploadProgress} className="h-2" />
                <p className="mt-2 text-sm text-gray-500">{uploadProgress}%</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-16 w-16 text-gray-400" />
              <h3 className="text-xl font-medium">
                {isDragActive ? "Drop your video here" : "Drag & drop your video here"}
              </h3>
              <p className="text-sm text-gray-500">or click to browse your files</p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: MP4, WebM, MOV (max 500MB)
              </p>
            </>
          )}
        </div>
      </div>

      {videoUrl && !isUploading && (
        <div className="mt-6 text-center">
          <video src={videoUrl} controls className="w-full max-w-md mx-auto rounded-lg shadow" />
          <p className="mt-2 text-sm text-gray-600">{fileName}</p>
        </div>
      )}
    </div>
  )
}
