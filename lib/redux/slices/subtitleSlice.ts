import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface SubtitleStyle {
    fontSize: number
    fontWeight: string
}

export interface Subtitle {
    id: string
    text: string
    startTime: number
    endTime: number
    style: SubtitleStyle
}

interface SubtitleState {
    subtitles: Subtitle[]
}

const initialState: SubtitleState = {
    subtitles: [],
}

const subtitleSlice = createSlice({
    name: "subtitle",
    initialState,
    reducers: {
        addSubtitle: (state, action: PayloadAction<Subtitle>) => {
            state.subtitles.push(action.payload)
        },
        removeSubtitle: (state, action: PayloadAction<string>) => {
            state.subtitles = state.subtitles.filter((sub) => sub.id !== action.payload)
        },
        updateSubtitle: (state, action: PayloadAction<{ id: string; changes: Partial<Subtitle> }>) => {
            const { id, changes } = action.payload
            const idx = state.subtitles.findIndex((sub) => sub.id === id)
            if (idx === -1) return

            const sub = state.subtitles[idx]
            state.subtitles[idx] = {
                ...sub,
                ...changes,
                // deep-merge style so fontSize & fontWeight are always defined
                style: changes.style ? { ...sub.style, ...changes.style } : sub.style,
            }
        },
    },
})

export const { addSubtitle, removeSubtitle, updateSubtitle } = subtitleSlice.actions
export default subtitleSlice.reducer