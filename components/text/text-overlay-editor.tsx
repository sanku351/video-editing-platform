"use client"

import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import type { TextOverlay, TextStyle } from "@/lib/redux/slices/textSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addTextOverlay, removeTextOverlay, updateTextOverlay } from "@/lib/redux/slices/textSlice"
import { Plus, Trash2, Type } from "lucide-react"

export function TextOverlayEditor() {
    const { textOverlays } = useSelector((state: RootState) => state.text)
    const dispatch = useDispatch()
    const [selectedId, setSelectedId] = useState<string | null>(textOverlays[0]?.id || null)
    const sel = textOverlays.find(o => o.id === selectedId) || null

    const handleAdd = () => {
        const newOv: TextOverlay = {
            id: `text-${Date.now()}`,
            text: "New Text",
            position: { x: 50, y: 50 },
            style: { color: "#ffffff", fontSize: 24, fontWeight: "normal", textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }
        }
        dispatch(addTextOverlay(newOv))
        setSelectedId(newOv.id)
    }
    const handleRemove = () => {
        if (!selectedId) return
        dispatch(removeTextOverlay(selectedId))
        setSelectedId(textOverlays.find(o => o.id !== selectedId)?.id || null)
    }
    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedId) return
        dispatch(updateTextOverlay({ id: selectedId, changes: { text: e.target.value } }))
    }
    const handlePosition = (axis: "x" | "y", [v]: number[]) => {
        if (!selectedId || !sel) return
        const newPos = { x: axis === "x" ? v : sel.position.x, y: axis === "y" ? v : sel.position.y }
        dispatch(updateTextOverlay({ id: selectedId, changes: { position: newPos } }))
    }
    const handleStyle = <K extends keyof TextStyle>(prop: K, val: TextStyle[K]) => {
        if (!selectedId || !sel) return
        const newStyle: TextStyle = { ...sel.style, [prop]: val }
        dispatch(updateTextOverlay({ id: selectedId, changes: { style: newStyle } }))
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle>Text Overlay</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleRemove} disabled={!selectedId}><Trash2 className="h-4 w-4 mr-2" />Remove</Button>
                        <Button variant="default" size="sm" onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add Text</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {textOverlays.length === 0 ? (
                    <div className="text-center py-6">
                        <Type className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No text overlays</h3>
                        <p className="text-sm text-muted-foreground mt-1">Add text to overlay on your video</p>
                        <Button className="mt-4" onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add Text</Button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <Label htmlFor="select-text">Select Text</Label>
                            <Select value={selectedId || ""} onValueChange={setSelectedId}>
                                <SelectTrigger id="select-text"><SelectValue placeholder="Select text" /></SelectTrigger>
                                <SelectContent>{textOverlays.map(o => <SelectItem key={o.id} value={o.id}>{o.text.slice(0, 20)}{o.text.length > 20 ? "..." : ""}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        {sel && (
                            <div className="space-y-4">
                                <div><Label htmlFor="text-content">Text</Label><Input id="text-content" value={sel.text} onChange={handleText} /></div>
                                <div><Label>Horizontal Position ({sel.position.x}%)</Label><Slider value={[sel.position.x]} min={0} max={100} step={1} onValueChange={v => handlePosition("x", v)} className="mt-2" /></div>
                                <div><Label>Vertical Position ({sel.position.y}%)</Label><Slider value={[sel.position.y]} min={0} max={100} step={1} onValueChange={v => handlePosition("y", v)} className="mt-2" /></div>
                                <div><Label htmlFor="text-color">Color</Label><div className="flex gap-2 mt-2"><Input id="text-color" type="color" value={sel.style.color} onChange={e => handleStyle("color", e.target.value)} className="w-12 h-10 p-1" /><Input value={sel.style.color} onChange={e => handleStyle("color", e.target.value)} className="flex-1" /></div></div>
                                <div><Label>Font Size ({sel.style.fontSize}px)</Label><Slider value={[sel.style.fontSize]} min={12} max={72} step={1} onValueChange={v => handleStyle("fontSize", v[0])} className="mt-2" /></div>
                                <div><Label>Font Weight</Label><Select value={sel.style.fontWeight} onValueChange={v => handleStyle("fontWeight", v)}><SelectTrigger id="font-weight"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="bold">Bold</SelectItem></SelectContent></Select></div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
