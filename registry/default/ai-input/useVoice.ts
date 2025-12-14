import { ref, onMounted, onUnmounted } from 'vue'

export type VoiceState = 'idle' | 'listening' | 'processing'

export function useVoice(onResult: (text: string) => void) {
  const state = ref<VoiceState>('idle')
  const recognition = ref<any>(null)
  const isSupported = ref(false)

  onMounted(() => {
    const Win = window as any
    const SpeechRecognition = Win.SpeechRecognition || Win.webkitSpeechRecognition

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

      sr.onresult = (event: any) => {
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

      sr.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        state.value = 'idle'
      }

      recognition.value = sr
    }
  })

  onUnmounted(() => {
    recognition.value?.stop()
  })

  const start = () => {
    if (!isSupported.value) return
    recognition.value?.start()
  }

  const stop = () => {
    recognition.value?.stop()
  }

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
