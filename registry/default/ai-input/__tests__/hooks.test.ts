import { describe, it, expect } from 'vitest'
import { useFileUpload } from '../hooks/use-file-upload'

describe('useFileUpload', () => {
  it('should initialize with empty files', () => {
    const { files, isUploading } = useFileUpload()
    expect(files.value).toHaveLength(0)
    expect(isUploading.value).toBe(false)
  })

  it('should add files correctly', async () => {
    const { addFiles, files } = useFileUpload()
    const mockFile = new File([''], 'test.png', { type: 'image/png' })

    await addFiles([mockFile])

    expect(files.value).toHaveLength(1)
    expect(files.value[0].name).toBe('test.png')
    expect(files.value[0].status).toBe('done') // No handler provided -> done immediately
    expect(files.value[0].progress).toBe(100)
  })

  it('should handle upload process with handler', async () => {
    const mockHandler = async (file: File, onProgress?: (p: number) => void) => {
      onProgress?.(50)
      return {
        id: 'test-id',
        url: 'http://example.com/test.png',
        name: file.name,
        type: file.type,
      }
    }

    const { addFiles, files } = useFileUpload({ handler: mockHandler })
    const mockFile = new File([''], 'test.png', { type: 'image/png' })

    const uploadPromise = addFiles([mockFile])

    // Immediate check
    expect(files.value[0].status).toBe('uploading')

    await uploadPromise

    expect(files.value[0].status).toBe('done')
    expect(files.value[0].serverData).toEqual({
      id: 'test-id',
      url: 'http://example.com/test.png',
      name: 'test.png',
      type: 'image/png',
    })
  })

  it('should remove file correctly', async () => {
    const { addFiles, removeFile, files } = useFileUpload()
    const mockFile = new File([''], 'test.png', { type: 'image/png' })

    await addFiles([mockFile])
    expect(files.value).toHaveLength(1)

    const id = files.value[0].id
    removeFile(id)

    expect(files.value).toHaveLength(0)
  })
})
