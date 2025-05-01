"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scissors, Plus, Trash2 } from "lucide-react"
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { addScene, removeScene, reorderScenes } from "@/lib/redux/slices/videoSlice"

interface SceneProps {
  id: string
  startTime: number
  endTime: number
  width: number
  left: number
}

function Scene({ id, startTime, endTime, width, left }: SceneProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const dispatch = useDispatch()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${width}%`,
    left: `${left}%`,
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(removeScene(id))
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="timeline-segment flex items-center justify-center"
      {...attributes}
      {...listeners}
    >
      <div className="text-xs text-white font-medium truncate px-2">
        {Math.floor(startTime)}s - {Math.floor(endTime)}s
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="h-6 w-6 absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleRemove}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )
}

export function Timeline() {
  const { scenes, duration } = useSelector((state: RootState) => state.video)
  const dispatch = useDispatch()
  const [currentTime, setCurrentTime] = useState(0)

  const handleAddScene = () => {
    const newScene = {
      id: `scene-${Date.now()}`,
      startTime: Math.max(0, currentTime - 5),
      endTime: Math.min(duration, currentTime + 5),
    }

    dispatch(addScene(newScene))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      dispatch(
        reorderScenes({
          activeId: active.id as string,
          overId: over.id as string,
        }),
      )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Timeline</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Scissors className="h-4 w-4 mr-2" />
              Split
            </Button>
            <Button variant="default" size="sm" onClick={handleAddScene}>
              <Plus className="h-4 w-4 mr-2" />
              Add Scene
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-16 bg-muted rounded-md mb-4">
          <div className="absolute inset-0 flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-gray-300 last:border-r-0">
                <div className="text-xs text-muted-foreground h-4 pl-1">{Math.floor((duration / 10) * i)}s</div>
              </div>
            ))}
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={scenes.map((scene) => scene.id)} strategy={horizontalListSortingStrategy}>
              <div className="timeline-track mt-4">
                {scenes.map((scene) => {
                  const width = ((scene.endTime - scene.startTime) / duration) * 100
                  const left = (scene.startTime / duration) * 100

                  return (
                    <Scene
                      key={scene.id}
                      id={scene.id}
                      startTime={scene.startTime}
                      endTime={scene.endTime}
                      width={width}
                      left={left}
                    />
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Audio Track</h3>
            <div className="h-12 bg-muted rounded-md relative overflow-hidden">
              <div className="absolute inset-0 waveform"></div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Subtitles Track</h3>
            <div className="h-8 bg-muted rounded-md relative">
              {/* Subtitle markers would go here */}
              <div className="absolute h-full w-[15%] left-[10%] bg-yellow-400/30 rounded"></div>
              <div className="absolute h-full w-[20%] left-[35%] bg-yellow-400/30 rounded"></div>
              <div className="absolute h-full w-[15%] left-[65%] bg-yellow-400/30 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
