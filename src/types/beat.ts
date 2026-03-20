export interface BeatUpdateEvent {
  bpm: number
  confidence: number
  beat_now: boolean
  beat_oscillator: number
  bar_oscillator: number
}
