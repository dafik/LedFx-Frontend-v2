import { useCallback, useRef, useState } from 'react'
import { useSubscription } from '../utils/Websocket/WebSocketProvider'
import type { BeatUpdateEvent } from '../types/beat'

interface BeatTempoState {
  bpm: number
  confidence: number
  beatNow: boolean
  beatOscillator: number
  barOscillator: number
  isStable: boolean
  displayBpm: number
}

const BPM_CHANGE_THRESHOLD = 2.0
const BPM_STABLE_DURATION = 3000
const BPM_CONFIRM_DIFF = 0.5

const useBeatTempo = () => {
  const [state, setState] = useState<BeatTempoState>({
    bpm: 0,
    confidence: 0,
    beatNow: false,
    beatOscillator: 0,
    barOscillator: 0,
    isStable: false,
    displayBpm: 0
  })

  const lastBpmRef = useRef(0)
  const lastChangeTimeRef = useRef(0)
  const stableBpmRef = useRef(0)

  const handleBeatUpdate = useCallback((data: BeatUpdateEvent) => {
    const now = Date.now()

    if (data.bpm > 0) {
      const bpmDiff = Math.abs(data.bpm - lastBpmRef.current)

      if (bpmDiff >= BPM_CHANGE_THRESHOLD) {
        lastBpmRef.current = data.bpm
        lastChangeTimeRef.current = now
      }

      const timeSinceChange = now - lastChangeTimeRef.current
      const currentStable =
        lastBpmRef.current > 0 &&
        timeSinceChange >= BPM_STABLE_DURATION &&
        Math.abs(data.bpm - stableBpmRef.current) >= BPM_CONFIRM_DIFF

      if (currentStable) {
        stableBpmRef.current = data.bpm
      }
    }

    setState({
      bpm: data.bpm,
      confidence: data.confidence,
      beatNow: data.beat_now,
      beatOscillator: data.beat_oscillator,
      barOscillator: data.bar_oscillator,
      isStable:
        stableBpmRef.current > 0 &&
        Math.abs(data.bpm - stableBpmRef.current) < BPM_CHANGE_THRESHOLD,
      displayBpm: stableBpmRef.current > 0 ? stableBpmRef.current : data.bpm
    })
  }, [])

  useSubscription('beat_update', handleBeatUpdate)

  return state
}

export default useBeatTempo
