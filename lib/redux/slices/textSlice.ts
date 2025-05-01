import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface TextStyle {
    color: string
    fontSize: number
    fontWeight: string
    textShadow: string
}

export interface TextOverlay {
    id: string
    text: string
    position: { x: number; y: number }
    style: TextStyle
}

interface TextState {
    textOverlays: TextOverlay[]
}

const initialState: TextState = { textOverlays: [] }

const textSlice = createSlice({
    name: "text",
    initialState,
    reducers: {
        addTextOverlay: (state, action: PayloadAction<TextOverlay>) => {
            state.textOverlays.push(action.payload)
        },
        removeTextOverlay: (state, action: PayloadAction<string>) => {
            state.textOverlays = state.textOverlays.filter(o => o.id !== action.payload)
        },
        updateTextOverlay: (state, action: PayloadAction<{ id: string; changes: Partial<TextOverlay> }>) => {
            const { id, changes } = action.payload
            const idx = state.textOverlays.findIndex(o => o.id === id)
            if (idx === -1) return
            const ov = state.textOverlays[idx]
            state.textOverlays[idx] = {
                ...ov,
                ...changes,
                position: changes.position ? { ...ov.position, ...changes.position } : ov.position,
                style: changes.style ? { ...ov.style, ...changes.style } : ov.style,
            }
        }
    }
})

export const { addTextOverlay, removeTextOverlay, updateTextOverlay } = textSlice.actions
export default textSlice.reducer