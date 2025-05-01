"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Download, Film } from "lucide-react"
import { toast } from "sonner"


export function ExportControls() {
  const [isRendering, setIsRendering] = useState(false)
  const [renderProgress, setRenderProgress] = useState(0)
  const [isExportReady, setIsExportReady] = useState(false)
  const [exportFormat, setExportFormat] = useState("mp4")
  const [exportQuality, setExportQuality] = useState("high")

  const handleRender = () => {
    setIsRendering(true)
    setRenderProgress(0)
    setIsExportReady(false)

    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsRendering(false)
          setIsExportReady(true)
          toast("Rendering complete. Your video is ready to download.")
          return 100
        }
        return newProgress
      })
    }, 300)
  }

  const handleDownload = () => {
    toast("Download started. Your video will be downloaded shortly.")
    setTimeout(() => {
      toast("Download complete. Your video has been downloaded successfully.")
    }, 2000)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Export Video</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat} disabled={isRendering}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4</SelectItem>
                  <SelectItem value="webm">WebM</SelectItem>
                  <SelectItem value="mov">MOV</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quality">Quality</Label>
              <Select value={exportQuality} onValueChange={setExportQuality} disabled={isRendering}>
                <SelectTrigger id="quality">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (480p)</SelectItem>
                  <SelectItem value="medium">Medium (720p)</SelectItem>
                  <SelectItem value="high">High (1080p)</SelectItem>
                  <SelectItem value="ultra">Ultra HD (4K)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isRendering && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rendering video...</span>
                <span>{renderProgress}%</span>
              </div>
              <Progress value={renderProgress} className="h-2" />
            </div>
          )}

          <div className="flex gap-4">
            <Button className="flex-1" onClick={handleRender} disabled={isRendering}>
              <Film className="mr-2 h-4 w-4" />
              {isExportReady ? "Re-render" : "Render Video"}
            </Button>

            <Button
              className="flex-1"
              variant={isExportReady ? "default" : "outline"}
              onClick={handleDownload}
              disabled={!isExportReady}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
