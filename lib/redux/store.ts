import { configureStore } from "@reduxjs/toolkit"
import videoReducer from "./slices/videoSlice"
import audioReducer from "./slices/audioSlice"
import textReducer from "./slices/textSlice"
import subtitleReducer from "./slices/subtitleSlice"
import imageReducer from "./slices/imageSlice"

export const store = configureStore({
  reducer: {
    video: videoReducer,
    audio: audioReducer,
    text: textReducer,
    subtitle: subtitleReducer,
    image: imageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
