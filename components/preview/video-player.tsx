"use client"

import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

export function VideoPlayer() {
  const { videoUrl } = useSelector((state: RootState) => state.video)
  const { textOverlays } = useSelector((state: RootState) => state.text)
  const { subtitles } = useSelector((state: RootState) => state.subtitle)
  const { images } = useSelector((state: RootState) => state.image)

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handleEnd = () => setIsPlaying(false)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", handleEnd)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", handleEnd)
    }
  }, [videoUrl])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeChange = (value: number[]) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return
    const newVolume = value[0]
    videoRef.current.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Find current subtitle
  const currentSubtitle = subtitles.find((sub) => currentTime >= sub.startTime && currentTime <= sub.endTime)

  return (
    <Card className="mb-6">
      <CardContent className="p-0 relative">
        <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
          <video ref={videoRef} src={videoUrl} className="w-full h-full object-contain" />

          {/* Text Overlays */}
          {textOverlays.map((overlay, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                top: `${overlay.position.y}%`,
                left: `${overlay.position.x}%`,
                color: overlay.style.color,
                fontSize: `${overlay.style.fontSize}px`,
                fontWeight: overlay.style.fontWeight,
                textShadow: overlay.style.textShadow,
                transform: "translate(-50%, -50%)",
              }}
            >
              {overlay.text}
            </div>
          ))}

          {/* Image Overlays */}
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                top: `${image.position.y}%`,
                left: `${image.position.x}%`,
                width: `${image.size.width}px`,
                height: `${image.size.height}px`,
                opacity: image.style.opacity,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt="Overlay"
                className="w-full h-full object-contain"
                style={{
                  border: image.style.border ? `2px solid ${image.style.borderColor}` : "none",
                }}
              />
            </div>
          ))}

          {/* Current Subtitle */}
          {currentSubtitle && (
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded text-white text-center max-w-[80%]"
              style={{
                fontSize: `${currentSubtitle.style.fontSize}px`,
                fontWeight: currentSubtitle.style.fontWeight,
              }}
            >
              {currentSubtitle.text}
            </div>
          )}
        </div>

        <div className="bg-card p-4 rounded-b-lg border-t">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>

            <span className="text-sm text-muted-foreground w-16">{formatTime(currentTime)}</span>

            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              className="flex-1"
            />

            <span className="text-sm text-muted-foreground w-16 text-right">{formatTime(duration)}</span>

            <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>

            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
