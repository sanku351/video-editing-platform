import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ImageStyle {
    opacity: number
    border: boolean
    borderColor: string
}

export interface Image {
    id: string
    name: string
    url: string
    position: {
        x: number
        y: number
    }
    size: {
        width: number
        height: number
    }
    style: ImageStyle
}

interface ImageState {
    images: Image[]
}

const initialState: ImageState = {
    images: [],
}

const imageSlice = createSlice({
    name: "image",
    initialState,
    reducers: {
        addImage: (state, action: PayloadAction<Image>) => {
            state.images.push(action.payload)
        },
        removeImage: (state, action: PayloadAction<string>) => {
            state.images = state.images.filter((image) => image.id !== action.payload)
        },
        updateImage: (state, action: PayloadAction<{ id: string; changes: Partial<Image> }>) => {
            const { id, changes } = action.payload
            const idx = state.images.findIndex((img) => img.id === id)
            if (idx === -1) return

            const image = state.images[idx]
            state.images[idx] = {
                ...image,
                ...changes,
                // deep-merge nested objects to ensure required fields are always present
                position: changes.position ? { ...image.position, ...changes.position } : image.position,
                size: changes.size ? { ...image.size, ...changes.size } : image.size,
                style: changes.style ? { ...image.style, ...changes.style } : image.style,
            }
        },
    },
})

export const { addImage, removeImage, updateImage } = imageSlice.actions
export default imageSlice.reducer