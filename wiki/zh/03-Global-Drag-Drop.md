# Global Drag & Drop (全局拖拽)

AI Input 提供了一个强大的文件处理系统，支持拖拽上传、剪贴板粘贴上传以及传统的文件选择上传。该功能由 `useFileUpload` Hook 核心驱动。

## 功能特性

*   **拖拽支持**: 支持将文件直接拖入编辑器区域。
*   **状态管理**: 自动跟踪文件的 `pending`, `uploading`, `done`, `error` 状态。
*   **进度反馈**: 支持实时上传进度条显示。
*   **粘贴上传**: 支持直接在编辑器中粘贴图片或文件。

## 配置说明

通过 `AIInput` 的 props 进行配置：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `uploadHandler` | `(file: File, onProgress: (p: number) => void) => Promise<any>` | **核心**。自定义上传逻辑。如果不提供，文件将仅保存在本地状态中，状态直接变为 `done`。 |
| `accept` | `string` | HTML `accept` 属性，例如 `image/*,.pdf`。 |
| `maxSize` | `number` | 文件大小限制（字节）。 |
| `maxFiles` | `number` | 最大文件数量限制。 |

## 事件处理流程

1.  **触发**: 用户拖拽文件释放、点击附件按钮选择或粘贴文件。
2.  **验证**: 检查文件类型 (`accept`)、大小 (`maxSize`) 和数量 (`maxFiles`)。
3.  **状态初始化**: 文件被添加到列表，状态设为 `pending`，进度 `0`。
4.  **上传处理**: 
    *   如果有 `uploadHandler`，调用该函数。
    *   如果没有 `uploadHandler`，直接标记为 `done`。
5.  **完成/失败**: 根据 `Promise` 结果更新状态为 `done` (附带服务器返回数据) 或 `error`。

## 代码示例：实现自定义上传

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

  // 使用 axios 或 fetch 上传
  const response = await axios.post('/api/upload', formData, {
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress(percent)
    }
  })

  // 返回的数据将存储在 attachment.serverData 中
  return response.data 
}
```

## 数据格式规范

组件内部使用的附件对象结构 (`AttachmentFile`)：

```typescript
interface AttachmentFile {
  id: string          // 唯一 ID (nanoid)
  file: File          // 原始 File 对象
  name: string        // 文件名
  type: string        // MIME 类型
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number    // 0-100
  error?: Error       // 错误对象
  serverData?: any    // 上传成功后服务端返回的数据
}
```

## 性能与最佳实践

1.  **大文件处理**: 建议在 `uploadHandler` 中实现分片上传逻辑，避免长时间占用网络连接。
2.  **图片预览**: 组件内部会自动为图片类型的文件生成本地预览 URL (`URL.createObjectURL`)，无需等待服务器返回。
3.  **并发限制**: 目前组件并行上传所有添加的文件。如需限制并发数，需在 `uploadHandler` 内部实现队列机制。