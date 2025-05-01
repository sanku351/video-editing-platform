"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadZone } from "@/components/upload/upload-zone"
import { Timeline } from "@/components/timeline/timeline"
import { VideoPlayer } from "@/components/preview/video-player"
import { ExportControls } from "@/components/preview/export-controls"
import { TextOverlayEditor } from "@/components/text/text-overlay-editor"
import { SubtitleEditor } from "@/components/text/subtitle-editor"
import { ImageOverlayEditor } from "@/components/image/image-overlay-editor"
import { AudioTrackEditor } from "@/components/audio/audio-track-editor"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { ModeToggle } from "@/components/theme/mode-toggle"

export function EditorLayout() {
  const { videoUrl } = useSelector((state: RootState) => state.video)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Video Editor</h1>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {!videoUrl ? (
          <div className="h-[80vh] flex items-center justify-center">
            <UploadZone />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VideoPlayer />
              <Timeline />
            </div>
            <div className="lg:col-span-1">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="subtitles">Subtitles</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4">
                  <TextOverlayEditor />
                </TabsContent>
                <TabsContent value="subtitles" className="mt-4">
                  <SubtitleEditor />
                </TabsContent>
                <TabsContent value="audio" className="mt-4">
                  <AudioTrackEditor />
                </TabsContent>
                <TabsContent value="images" className="mt-4">
                  <ImageOverlayEditor />
                </TabsContent>
              </Tabs>
              <div className="mt-6">
                <ExportControls />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
