import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AudioTrack {
  id: string
  name: string
  type: string
  volume: number
  isMuted: boolean
  startTime: number
  endTime: number
}

interface AudioState {
  audioTracks: AudioTrack[]
}

const initialState: AudioState = {
  audioTracks: [
    {
      id: "original-audio",
      name: "Original Audio",
      type: "original",
      volume: 1,
      isMuted: false,
      startTime: 0,
      endTime: 60,
    },
  ],
}

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    addAudioTrack: (state, action: PayloadAction<AudioTrack>) => {
      state.audioTracks.push(action.payload)
    },
    removeAudioTrack: (state, action: PayloadAction<string>) => {
      state.audioTracks = state.audioTracks.filter((track) => track.id !== action.payload)
    },
    updateAudioTrack: (state, action: PayloadAction<{ id: string; changes: Partial<AudioTrack> }>) => {
      const { id, changes } = action.payload
      const trackIndex = state.audioTracks.findIndex((track) => track.id === id)

      if (trackIndex !== -1) {
        state.audioTracks[trackIndex] = {
          ...state.audioTracks[trackIndex],
          ...changes,
        }
      }
    },
  },
})

export const { addAudioTrack, removeAudioTrack, updateAudioTrack } = audioSlice.actions
export default audioSlice.reducer
