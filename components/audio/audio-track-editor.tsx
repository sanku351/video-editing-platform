"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addAudioTrack, removeAudioTrack, updateAudioTrack } from "@/lib/redux/slices/audioSlice"
import { Plus, Trash2, Music, Upload, Volume2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function AudioTrackEditor() {
  const { audioTracks } = useSelector((state: RootState) => state.audio)
  const dispatch = useDispatch()
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(
    audioTracks.length > 0 ? audioTracks[0].id : null,
  )

  const selectedTrack = audioTracks.find((track) => track.id === selectedTrackId)

  const handleAddTrack = () => {
    const newTrack = {
      id: `audio-${Date.now()}`,
      name: "New Audio Track",
      type: "background",
      volume: 0.8,
      isMuted: false,
      startTime: 0,
      endTime: 60,
    }

    dispatch(addAudioTrack(newTrack))
    setSelectedTrackId(newTrack.id)
  }

  const handleRemoveTrack = () => {
    if (selectedTrackId) {
      dispatch(removeAudioTrack(selectedTrackId))
      setSelectedTrackId(audioTracks.length > 1 ? audioTracks[0].id : null)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedTrackId) {
      dispatch(
        updateAudioTrack({
          id: selectedTrackId,
          changes: { name: e.target.value },
        }),
      )
    }
  }

  const handleTypeChange = (value: string) => {
    if (selectedTrackId) {
      dispatch(
        updateAudioTrack({
          id: selectedTrackId,
          changes: { type: value },
        }),
      )
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (selectedTrackId) {
      dispatch(
        updateAudioTrack({
          id: selectedTrackId,
          changes: { volume: value[0] },
        }),
      )
    }
  }

  const handleMuteToggle = (checked: boolean) => {
    if (selectedTrackId) {
      dispatch(
        updateAudioTrack({
          id: selectedTrackId,
          changes: { isMuted: checked },
        }),
      )
    }
  }

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    if (selectedTrackId) {
      dispatch(
        updateAudioTrack({
          id: selectedTrackId,
          changes: { [field]: Number.parseFloat(value) },
        }),
      )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Audio Tracks</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRemoveTrack} disabled={!selectedTrackId}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
            <Button variant="default" size="sm" onClick={handleAddTrack}>
              <Plus className="h-4 w-4 mr-2" />
              Add Track
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {audioTracks.length === 0 ? (
          <div className="text-center py-6">
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">No audio tracks</h3>
            <p className="text-sm text-muted-foreground mt-1">Add background music or sound effects</p>
            <Button className="mt-4" onClick={handleAddTrack}>
              <Plus className="h-4 w-4 mr-2" />
              Add Audio Track
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Label htmlFor="select-track">Select Audio Track</Label>
              <Select value={selectedTrackId || ""} onValueChange={setSelectedTrackId}>
                <SelectTrigger id="select-track">
                  <SelectValue placeholder="Select an audio track" />
                </SelectTrigger>
                <SelectContent>
                  {audioTracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTrack && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="track-name">Track Name</Label>
                  <Input id="track-name" value={selectedTrack.name} onChange={handleNameChange} />
                </div>

                <div>
                  <Label htmlFor="track-type">Track Type</Label>
                  <Select value={selectedTrack.type} onValueChange={handleTypeChange}>
                    <SelectTrigger id="track-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original Audio</SelectItem>
                      <SelectItem value="background">Background Music</SelectItem>
                      <SelectItem value="voiceover">Voice Over</SelectItem>
                      <SelectItem value="sfx">Sound Effect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-time">Start Time (seconds)</Label>
                    <Input
                      id="start-time"
                      type="number"
                      min={0}
                      step={0.1}
                      value={selectedTrack.startTime}
                      onChange={(e) => handleTimeChange("startTime", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">End Time (seconds)</Label>
                    <Input
                      id="end-time"
                      type="number"
                      min={0}
                      step={0.1}
                      value={selectedTrack.endTime}
                      onChange={(e) => handleTimeChange("endTime", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="volume">Volume ({Math.round(selectedTrack.volume * 100)}%)</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="mute" className="text-sm">
                        Mute
                      </Label>
                      <Switch id="mute" checked={selectedTrack.isMuted} onCheckedChange={handleMuteToggle} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      id="volume"
                      value={[selectedTrack.volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      disabled={selectedTrack.isMuted}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Upload Audio File</Label>
                  <div className="mt-2 border-2 border-dashed rounded-md p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Drag & drop an audio file or click to browse</p>
                    <Input type="file" accept="audio/*" className="hidden" id="audio-upload" />
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <label htmlFor="audio-upload">Browse Files</label>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
