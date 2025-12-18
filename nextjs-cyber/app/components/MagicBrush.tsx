'use client'

import { useState, useRef, useEffect } from 'react'
import { Brush, Eraser, Undo, Redo, Download, Wand2, Loader2 } from 'lucide-react'

interface MagicBrushProps {
  imageUrl: string
  onInpaintComplete?: (result: string) => void
  onClose?: () => void
}

export default function MagicBrush({ imageUrl, onInpaintComplete, onClose }: MagicBrushProps) {
  const [brushSize, setBrushSize] = useState(20)
  const [isEraser, setIsEraser] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // ===== INITIALIZE CANVAS =====
  useEffect(() => {
    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current
    if (!canvas || !maskCanvas) return

    const ctx = canvas.getContext('2d')
    const maskCtx = maskCanvas.getContext('2d')
    if (!ctx || !maskCtx) return

    // Load image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Set canvas size to image size
      const maxWidth = 800
      const scale = Math.min(1, maxWidth / img.width)
      
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      maskCanvas.width = canvas.width
      maskCanvas.height = canvas.height

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      // Initialize mask (transparent)
      maskCtx.fillStyle = 'rgba(0, 0, 0, 0)'
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)

      imageRef.current = img

      // Save initial state
      const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
      setHistory([imageData])
      setHistoryIndex(0)
    }
    img.src = imageUrl
  }, [imageUrl])

  // ===== SAVE STATE TO HISTORY =====
  const saveState = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    const maskCtx = maskCanvas.getContext('2d')
    if (!maskCtx) return

    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    
    // Remove any states after current index (branching)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    
    // Limit history to 20 states
    if (newHistory.length > 20) {
      newHistory.shift()
    } else {
      setHistoryIndex(historyIndex + 1)
    }
    
    setHistory(newHistory)
  }

  // ===== UNDO/REDO =====
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      
      const maskCanvas = maskCanvasRef.current
      const maskCtx = maskCanvas?.getContext('2d')
      if (maskCtx && history[newIndex]) {
        maskCtx.putImageData(history[newIndex], 0, 0)
        redrawComposite()
      }
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      
      const maskCanvas = maskCanvasRef.current
      const maskCtx = maskCanvas?.getContext('2d')
      if (maskCtx && history[newIndex]) {
        maskCtx.putImageData(history[newIndex], 0, 0)
        redrawComposite()
      }
    }
  }

  // ===== REDRAW COMPOSITE (IMAGE + MASK) =====
  const redrawComposite = () => {
    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current
    if (!canvas || !maskCanvas || !imageRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Redraw original image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height)

    // Draw mask overlay (red tint)
    ctx.globalAlpha = 0.5
    ctx.drawImage(maskCanvas, 0, 0)
    ctx.globalAlpha = 1.0
  }

  // ===== DRAWING HANDLERS =====
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true
    draw(e)
  }

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false
      saveState()
      redrawComposite()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return

    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current
    if (!canvas || !maskCanvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    const maskCtx = maskCanvas.getContext('2d')
    if (!ctx || !maskCtx) return

    // Draw on mask canvas
    maskCtx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over'
    maskCtx.fillStyle = 'rgba(255, 0, 0, 1)' // Red mask
    maskCtx.beginPath()
    maskCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
    maskCtx.fill()

    // Redraw composite
    redrawComposite()
  }

  // ===== DOWNLOAD MASK =====
  const downloadMask = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    const dataUrl = maskCanvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'mask.png'
    link.href = dataUrl
    link.click()
  }

  // ===== INPAINT (API CALL) =====
  const handleInpaint = async () => {
    if (!prompt.trim()) {
      alert('Vui lòng nhập mô tả chỉnh sửa!')
      return
    }

    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    setIsProcessing(true)

    try {
      // Convert mask to base64
      const maskDataUrl = maskCanvas.toDataURL('image/png')

      // Call API (placeholder - replace with actual inpainting API)
      const response = await fetch('/api/inpaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageUrl,
          maskBase64: maskDataUrl,
          prompt: prompt
        })
      })

      if (!response.ok) {
        throw new Error('Inpainting failed')
      }

      const result = await response.json()
      
      if (result.success && result.image) {
        onInpaintComplete?.(result.image)
        alert('Chỉnh sửa thành công!')
      } else {
        throw new Error(result.error || 'Unknown error')
      }

    } catch (error: any) {
      console.error('[MagicBrush] Inpaint error:', error)
      alert(`Lỗi: ${error.message}\n\nChức năng Inpainting đang trong giai đoạn phát triển.`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="magic-brush-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.95)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Header */}
      <div className="brush-header" style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '600' }}>
          ✨ Magic Brush - Sửa Ảnh AI
        </h2>
        <button onClick={onClose} style={{
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Đóng
        </button>
      </div>

      {/* Canvas */}
      <div className="canvas-wrapper" style={{
        position: 'relative',
        marginBottom: '20px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            display: 'block',
            cursor: isEraser ? 'cell' : 'crosshair',
            maxWidth: '100%',
            maxHeight: '60vh'
          }}
        />
        <canvas
          ref={maskCanvasRef}
          style={{ display: 'none' }}
        />
      </div>

      {/* Toolbar */}
      <div className="brush-toolbar" style={{
        width: '100%',
        maxWidth: '900px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Tools Row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsEraser(false)}
            style={{
              background: !isEraser ? '#667eea' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Brush size={18} />
            Brush
          </button>

          <button
            onClick={() => setIsEraser(true)}
            style={{
              background: isEraser ? '#667eea' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Eraser size={18} />
            Eraser
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
            <label style={{ color: '#fff', fontSize: '14px' }}>Size:</label>
            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              style={{ width: '150px' }}
            />
            <span style={{ color: '#fff', fontSize: '14px', minWidth: '40px' }}>
              {brushSize}px
            </span>
          </div>

          <button onClick={undo} disabled={historyIndex <= 0} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            cursor: historyIndex <= 0 ? 'not-allowed' : 'pointer',
            opacity: historyIndex <= 0 ? 0.5 : 1,
            marginLeft: 'auto'
          }}>
            <Undo size={18} />
          </button>

          <button onClick={redo} disabled={historyIndex >= history.length - 1} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            cursor: historyIndex >= history.length - 1 ? 'not-allowed' : 'pointer',
            opacity: historyIndex >= history.length - 1 ? 0.5 : 1
          }}>
            <Redo size={18} />
          </button>

          <button onClick={downloadMask} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <Download size={18} />
          </button>
        </div>

        {/* Prompt Row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Nhập mô tả chỉnh sửa (VD: Đổi thành áo đỏ)"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontSize: '14px'
            }}
          />

          <button
            onClick={handleInpaint}
            disabled={isProcessing || !prompt.trim()}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: isProcessing || !prompt.trim() ? 'not-allowed' : 'pointer',
              opacity: isProcessing || !prompt.trim() ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                Áp dụng
              </>
            )}
          </button>
        </div>

        <div style={{ color: '#888', fontSize: '12px', textAlign: 'center' }}>
          💡 Tip: Vẽ vùng cần sửa (màu đỏ), nhập mô tả, rồi nhấn "Áp dụng"
        </div>
      </div>
    </div>
  )
}
