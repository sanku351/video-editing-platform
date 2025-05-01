"use client"

import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import type { Subtitle, SubtitleStyle } from "@/lib/redux/slices/subtitleSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addSubtitle, removeSubtitle, updateSubtitle } from "@/lib/redux/slices/subtitleSlice"
import { Plus, Trash2, FileText } from "lucide-react"

export function SubtitleEditor() {
  const { subtitles } = useSelector((state: RootState) => state.subtitle)
  const dispatch = useDispatch()
  const [selectedId, setSelectedId] = useState<string | null>(
    subtitles.length > 0 ? subtitles[0].id : null
  )

  const sel = subtitles.find((s) => s.id === selectedId) || null

  const handleAdd = () => {
    const newSub: Subtitle = {
      id: `subtitle-${Date.now()}`,
      text: "New subtitle text",
      startTime: 0,
      endTime: 5,
      style: { fontSize: 18, fontWeight: "normal" },
    }
    dispatch(addSubtitle(newSub))
    setSelectedId(newSub.id)
  }

  const handleRemove = () => {
    if (!selectedId) return
    dispatch(removeSubtitle(selectedId))
    setSelectedId(subtitles.length > 1 ? subtitles.find((s) => s.id !== selectedId)!.id : null)
  }

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedId) return
    dispatch(updateSubtitle({ id: selectedId, changes: { text: e.target.value } }))
  }

  const handleTime = (field: "startTime" | "endTime", v: string) => {
    if (!selectedId) return
    const num = parseFloat(v) || 0
    dispatch(updateSubtitle({ id: selectedId, changes: { [field]: num } }))
  }

  const handleStyle = <K extends keyof SubtitleStyle>(prop: K, val: SubtitleStyle[K]) => {
    if (!selectedId || !sel) return
    const newStyle: SubtitleStyle = { ...sel.style, [prop]: val }
    dispatch(updateSubtitle({ id: selectedId, changes: { style: newStyle } }))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Subtitles</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRemove} disabled={!selectedId}>
              <Trash2 className="h-4 w-4 mr-2" /> Remove
            </Button>
            <Button variant="default" size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Subtitle
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {subtitles.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">No subtitles</h3>
            <p className="text-sm text-muted-foreground mt-1">Add subtitles to your video</p>
            <Button className="mt-4" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Subtitle
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Label htmlFor="select-subtitle">Select Subtitle</Label>
              <Select value={selectedId||""} onValueChange={setSelectedId}>
                <SelectTrigger id="select-subtitle">
                  <SelectValue placeholder="Select a subtitle" />
                </SelectTrigger>
                <SelectContent>
                  {subtitles.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.text.slice(0,20)}{s.text.length>20?"...":""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {sel && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sub-text">Text</Label>
                  <Textarea id="sub-text" value={sel.text} onChange={handleText} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-time">Start Time (s)</Label>
                    <Input id="start-time" type="number" min={0} step={0.1} value={sel.startTime}
                      onChange={(e)=>handleTime("startTime",e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="end-time">End Time (s)</Label>
                    <Input id="end-time" type="number" min={0} step={0.1} value={sel.endTime}
                      onChange={(e)=>handleTime("endTime",e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="font-size">Font Size ({sel.style.fontSize}px)</Label>
                  <Input id="font-size" type="number" min={12} max={36} value={sel.style.fontSize}
                    onChange={(e)=>handleStyle("fontSize",parseInt(e.target.value)||12)} />
                </div>
                <div>
                  <Label htmlFor="font-weight">Font Weight</Label>
                  <Select value={sel.style.fontWeight} onValueChange={(v)=>handleStyle("fontWeight",v)}>
                    <SelectTrigger id="font-weight"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}