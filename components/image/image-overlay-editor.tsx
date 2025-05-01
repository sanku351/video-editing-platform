"use client"

import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import type { Image, ImageStyle } from "@/lib/redux/slices/imageSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addImage, removeImage, updateImage } from "@/lib/redux/slices/imageSlice"
import { Plus, Trash2, ImageIcon, Upload } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function ImageOverlayEditor() {
    const { images } = useSelector((state: RootState) => state.image)
    const dispatch = useDispatch()
    const [selectedImageId, setSelectedImageId] = useState<string | null>(
        images.length > 0 ? images[0].id : null
    )

    const selectedImage = images.find((img) => img.id === selectedImageId) || null

    const handleAddImage = () => {
        const newImage: Image = {
            id: `image-${Date.now()}`,
            name: "New Image",
            url: "/placeholder.svg?height=200&width=200",
            position: { x: 50, y: 50 },
            size: { width: 200, height: 200 },
            style: { opacity: 1, border: false, borderColor: "#ffffff" },
        }

        dispatch(addImage(newImage))
        setSelectedImageId(newImage.id)
    }


    const handleRemoveImage = () => {
        if (selectedImageId) {
            dispatch(removeImage(selectedImageId))
            setSelectedImageId(images.length > 1 ? images[0].id : null)
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedImageId) {
            dispatch(
                updateImage({
                    id: selectedImageId,
                    changes: { name: e.target.value },
                }),
            )
        }
    }

    const handlePositionChange = (axis: "x" | "y", [val]: number[]) => {
        if (!selectedImageId || !selectedImage) return

        const newPosition = {
            x: axis === "x" ? val : selectedImage.position.x,
            y: axis === "y" ? val : selectedImage.position.y,
        }

        dispatch(
            updateImage({ id: selectedImageId, changes: { position: newPosition } }),
        )
    }


    const handleSizeChange = (dimension: "width" | "height", raw: string) => {
        if (!selectedImageId || !selectedImage) return
        const v = parseInt(raw) || 200

        const newSize = {
            width: dimension === "width" ? v : selectedImage.size.width,
            height: dimension === "height" ? v : selectedImage.size.height,
        }

        dispatch(
            updateImage({ id: selectedImageId, changes: { size: newSize } }),
        )
    }


    const handleStyleChange = <K extends keyof ImageStyle>(prop: K, value: ImageStyle[K]) => {
        if (!selectedImageId || !selectedImage) return

        const newStyle: ImageStyle = {
            ...selectedImage.style,
            [prop]: value,
        }

        dispatch(
            updateImage({ id: selectedImageId, changes: { style: newStyle } }),
        )
    }


    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle>Image Overlays</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleRemoveImage} disabled={!selectedImageId}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                        </Button>
                        <Button variant="default" size="sm" onClick={handleAddImage}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Image
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {images.length === 0 ? (
                    <div className="text-center py-6">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No image overlays</h3>
                        <p className="text-sm text-muted-foreground mt-1">Add images to overlay on your video</p>
                        <Button className="mt-4" onClick={handleAddImage}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Image Overlay
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <Label htmlFor="select-image">Select Image</Label>
                            <Select value={selectedImageId || ""} onValueChange={setSelectedImageId}>
                                <SelectTrigger id="select-image">
                                    <SelectValue placeholder="Select an image" />
                                </SelectTrigger>
                                <SelectContent>
                                    {images.map((image) => (
                                        <SelectItem key={image.id} value={image.id}>
                                            {image.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedImage && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="image-name">Image Name</Label>
                                    <Input id="image-name" value={selectedImage.name} onChange={handleNameChange} />
                                </div>

                                <div>
                                    <Label>Upload Image</Label>
                                    <div className="mt-2 border-2 border-dashed rounded-md p-4 text-center">
                                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mt-2">Drag & drop an image or click to browse</p>
                                        <Input type="file" accept="image/*" className="hidden" id="image-upload" />
                                        <Button variant="outline" size="sm" className="mt-2" asChild>
                                            <label htmlFor="image-upload">Browse Files</label>
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="image-width">Width (px)</Label>
                                        <Input
                                            id="image-width"
                                            type="number"
                                            min={10}
                                            value={selectedImage.size.width}
                                            onChange={(e) => handleSizeChange("width", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="image-height">Height (px)</Label>
                                        <Input
                                            id="image-height"
                                            type="number"
                                            min={10}
                                            value={selectedImage.size.height}
                                            onChange={(e) => handleSizeChange("height", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Horizontal Position ({selectedImage.position.x}%)</Label>
                                    <Slider
                                        value={[selectedImage.position.x]}
                                        min={0}
                                        max={100}
                                        step={1}
                                        onValueChange={(value) => handlePositionChange("x", value)}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Vertical Position ({selectedImage.position.y}%)</Label>
                                    <Slider
                                        value={[selectedImage.position.y]}
                                        min={0}
                                        max={100}
                                        step={1}
                                        onValueChange={(value) => handlePositionChange("y", value)}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Opacity ({Math.round(selectedImage.style.opacity * 100)}%)</Label>
                                    <Slider
                                        value={[selectedImage.style.opacity]}
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        onValueChange={(value) => handleStyleChange("opacity", value[0])}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="border-toggle"
                                        checked={selectedImage.style.border}
                                        onCheckedChange={(checked) => handleStyleChange("border", checked)}
                                    />
                                    <Label htmlFor="border-toggle">Add Border</Label>
                                </div>

                                {selectedImage.style.border && (
                                    <div>
                                        <Label htmlFor="border-color">Border Color</Label>
                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                id="border-color"
                                                type="color"
                                                value={selectedImage.style.borderColor}
                                                onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                                                className="w-12 h-10 p-1"
                                            />
                                            <Input
                                                value={selectedImage.style.borderColor}
                                                onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}