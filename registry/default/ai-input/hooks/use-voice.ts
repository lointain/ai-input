import { ref, onMounted, onUnmounted } from 'vue'

/**
 * State of the voice recognition
 */
export type VoiceState = 'idle' | 'listening' | 'processing'

// Basic type definitions for Web Speech API since they might not be in standard lib yet
/**
 * Event interface for speech recognition results
 */
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
  interpretation: any
}

/**
 * Event interface for speech recognition errors
 */
interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

/**
 * Web Speech API Recognition interface
 */
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: (event: Event) => void
  onend: (event: Event) => void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

/**
 * Hook for using the Web Speech API (Speech-to-Text).
 * Handles browser support detection, recording state, and transcription results.
 * 
 * @param {function} onResult - Callback fired when text is transcribed
 * @returns {Object} Voice control methods and state
 */
export function useVoice(onResult: (text: string) => void) {
  const state = ref<VoiceState>('idle')
  const recognition = ref<SpeechRecognition | null>(null)
  const isSupported = ref(false)

  onMounted(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      isSupported.value = true
      const sr = new SpeechRecognition()
      sr.continuous = true
      sr.interimResults = true
      sr.lang = 'en-US'

      sr.onstart = () => {
        state.value = 'listening'
      }

      sr.onend = () => {
        state.value = 'idle'
      }

      sr.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0]?.transcript ?? ''
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript)
        }
      }

      sr.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        state.value = 'idle'
      }

      recognition.value = sr
    }
  })

  onUnmounted(() => {
    if (recognition.value && state.value === 'listening') {
      recognition.value.stop()
    }
  })

  /**
   * Start listening
   */
  const start = () => {
    if (!isSupported.value || state.value === 'listening') return
    try {
      recognition.value?.start()
    } catch (e) {
      console.error('Failed to start speech recognition', e)
    }
  }

  /**
   * Stop listening
   */
  const stop = () => {
    if (state.value !== 'listening') return
    recognition.value?.stop()
  }

  /**
   * Toggle listening state
   */
  const toggle = () => {
    if (state.value === 'listening') {
      stop()
    } else {
      start()
    }
  }

  return {
    state,
    isSupported,
    start,
    stop,
    toggle,
  }
}
