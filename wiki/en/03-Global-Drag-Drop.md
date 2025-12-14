# Global Drag & Drop

AI Input provides a robust file handling system supporting drag-and-drop uploads, clipboard paste uploads, and traditional file selection. This feature is driven by the core `useFileUpload` Hook.

## Features

*   **Drag Support**: Drag files directly into the editor area.
*   **State Management**: Automatically tracks `pending`, `uploading`, `done`, and `error` states.
*   **Progress Feedback**: Real-time upload progress bars.
*   **Paste Support**: Paste images or files directly into the editor.

## Configuration

Configured via `AIInput` props:

| Prop | Type | Description |
| :--- | :--- | :--- |
| `uploadHandler` | `(file: File, onProgress: (p: number) => void) => Promise<any>` | **Core**. Custom upload logic. If not provided, files are saved in local state only, status becomes `done` immediately. |
| `accept` | `string` | HTML `accept` attribute, e.g., `image/*,.pdf`. |
| `maxSize` | `number` | File size limit (bytes). |
| `maxFiles` | `number` | Max number of files limit. |

## Event Flow

1.  **Trigger**: User drops file, clicks attachment button, or pastes file.
2.  **Validation**: Check file type (`accept`), size (`maxSize`), and count (`maxFiles`).
3.  **State Init**: File added to list, status `pending`, progress `0`.
4.  **Upload Processing**: 
    *   If `uploadHandler` exists, call it.
    *   If no `uploadHandler`, mark as `done`.
5.  **Completion/Failure**: Update status to `done` (with server data) or `error` based on `Promise` result.

## Code Example: Custom Upload Implementation

```typescript
// types.ts
export type UploadHandler = (
  file: File,
  onProgress: (progress: number) => void
) => Promise<any>

// Component.vue
const myUploadHandler: UploadHandler = async (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)

  // Upload using axios or fetch
  const response = await axios.post('/api/upload', formData, {
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress(percent)
    }
  })

  // Returned data is stored in attachment.serverData
  return response.data 
}
```

## Data Structure

Internal attachment object structure (`AttachmentFile`):

```typescript
interface AttachmentFile {
  id: string          // Unique ID (nanoid)
  file: File          // Original File object
  name: string        // Filename
  type: string        // MIME type
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number    // 0-100
  error?: Error       // Error object
  serverData?: any    // Data returned from server on success
}
```

## Performance & Best Practices

1.  **Large Files**: Implement chunked uploads in `uploadHandler` to avoid blocking network connections for too long.
2.  **Image Previews**: The component automatically generates local preview URLs (`URL.createObjectURL`) for image types, so no need to wait for server response.
3.  **Concurrency**: Currently, the component uploads all added files in parallel. If you need to limit concurrency, implement a queue mechanism within your `uploadHandler`.