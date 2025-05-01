import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Scene {
    id: string
    startTime: number
    endTime: number
}

interface VideoState {
    // always a string; initialState uses empty string so <video src> never gets null
    videoUrl: string
    fileName: string | null
    duration: number
    scenes: Scene[]
}

const initialVideoState: VideoState = {
    videoUrl: "",
    fileName: null,
    duration: 0,
    scenes: [],
}

const videoSlice = createSlice({
    name: "video",
    initialState: initialVideoState,
    reducers: {
        setVideo: (state, action: PayloadAction<{ videoUrl: string; fileName: string; duration: number }>) => {
            state.videoUrl = action.payload.videoUrl
            state.fileName = action.payload.fileName
            state.duration = action.payload.duration
            state.scenes = [
                { id: `scene-${Date.now()}`, startTime: 0, endTime: action.payload.duration },
            ]
        },
        addScene: (state, action: PayloadAction<Scene>) => {
            state.scenes.push(action.payload)
        },
        removeScene: (state, action: PayloadAction<string>) => {
            state.scenes = state.scenes.filter((scene) => scene.id !== action.payload)
        },
        reorderScenes: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
            const { activeId, overId } = action.payload
            const from = state.scenes.findIndex((s) => s.id === activeId)
            const to = state.scenes.findIndex((s) => s.id === overId)
            if (from !== -1 && to !== -1) {
                const [moved] = state.scenes.splice(from, 1)
                state.scenes.splice(to, 0, moved)
            }
        },
    },
})

export const { setVideo, addScene, removeScene, reorderScenes } = videoSlice.actions
export default videoSlice.reducer