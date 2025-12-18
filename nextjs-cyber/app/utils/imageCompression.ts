import imageCompression from 'browser-image-compression'

interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  onProgress?: (progress: number) => void
}

export async function compressImage(
  file: File, 
  options: CompressionOptions = {}
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 1, // Maximum file size in MB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true, // Use web worker for better performance
    fileType: 'image/jpeg', // Convert to JPEG for better compression
    initialQuality: 0.8, // Initial quality
    ...options
  }

  try {
    console.log('[Image Compression] Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB')
    
    const compressedFile = await imageCompression(file, defaultOptions)
    
    console.log('[Image Compression] Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB')
    console.log('[Image Compression] Compression ratio:', ((1 - compressedFile.size / file.size) * 100).toFixed(1) + '%')
    
    return compressedFile
  } catch (error) {
    console.error('[Image Compression] Error:', error)
    throw error
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' }
  }

  // Check file size (max 10MB before compression)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' }
  }

  return { valid: true }
}
