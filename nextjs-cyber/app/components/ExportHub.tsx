'use client'

import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download, FileArchive, Loader2 } from 'lucide-react'

interface ExportHubProps {
  projectName: string
  originalImage?: string
  generatedImages?: Array<{
    url: string
    name: string
  }>
  analysisData?: any
  marketingContent?: string
}

export default function ExportHub({
  projectName,
  originalImage,
  generatedImages = [],
  analysisData,
  marketingContent
}: ExportHubProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  // ===== HELPER: BASE64 TO BLOB =====
  const base64ToBlob = async (base64: string): Promise<Blob> => {
    const response = await fetch(base64)
    return response.blob()
  }

  // ===== EXPORT PROJECT TO ZIP =====
  const handleExport = async () => {
    if (isExporting) return

    setIsExporting(true)
    setExportProgress(0)

    try {
      const zip = new JSZip()
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const folderName = `${projectName.replace(/[^a-z0-9]/gi, '_')}_${timestamp}`

      // Create project folder
      const projectFolder = zip.folder(folderName)

      if (!projectFolder) {
        throw new Error('Failed to create project folder')
      }

      let progress = 0
      const totalSteps = 1 + (originalImage ? 1 : 0) + generatedImages.length + (analysisData ? 1 : 0) + (marketingContent ? 1 : 0)

      // 1. Add original product image
      if (originalImage) {
        console.log('[Export] Adding original image...')
        const blob = await base64ToBlob(originalImage)
        projectFolder.file('00_original_product.jpg', blob)
        progress++
        setExportProgress(Math.round((progress / totalSteps) * 100))
      }

      // 2. Add generated model images
      for (let i = 0; i < generatedImages.length; i++) {
        const img = generatedImages[i]
        console.log(`[Export] Adding generated image ${i + 1}/${generatedImages.length}...`)
        
        try {
          const blob = await base64ToBlob(img.url)
          const fileName = img.name || `model_image_${i + 1}.jpg`
          projectFolder.file(`01_generated/${fileName}`, blob)
        } catch (error) {
          console.error(`[Export] Failed to add image ${i + 1}:`, error)
        }
        
        progress++
        setExportProgress(Math.round((progress / totalSteps) * 100))
      }

      // 3. Add analysis data (JSON)
      if (analysisData) {
        console.log('[Export] Adding analysis data...')
        const analysisJson = JSON.stringify(analysisData, null, 2)
        projectFolder.file('02_analysis_data.json', analysisJson)
        progress++
        setExportProgress(Math.round((progress / totalSteps) * 100))
      }

      // 4. Add marketing content (TXT)
      if (marketingContent) {
        console.log('[Export] Adding marketing content...')
        projectFolder.file('03_marketing_content.txt', marketingContent)
        progress++
        setExportProgress(Math.round((progress / totalSteps) * 100))
      }

      // 5. Add README.txt with project info
      const readme = `
BG AI TOOLS - PROJECT EXPORT
=============================

Tên dự án: ${projectName}
Ngày xuất: ${new Date().toLocaleString('vi-VN')}

NỘI DUNG PACKAGE:
- 00_original_product.jpg: Ảnh sản phẩm gốc
- 01_generated/: Thư mục chứa ảnh model AI đã tạo
- 02_analysis_data.json: Dữ liệu phân tích AI chi tiết
- 03_marketing_content.txt: Nội dung Marketing đã tạo

Được tạo bởi BG AI Tools
Website: https://mochiphoto.click
`.trim()

      projectFolder.file('README.txt', readme)
      progress++
      setExportProgress(Math.round((progress / totalSteps) * 100))

      // Generate ZIP
      console.log('[Export] Generating ZIP file...')
      setExportProgress(95)

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        }
      })

      // Download ZIP
      const fileName = `${folderName}.zip`
      saveAs(zipBlob, fileName)

      setExportProgress(100)
      console.log('[Export] Export completed successfully!')

      // Reset after 2 seconds
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
      }, 2000)

    } catch (error) {
      console.error('[Export] Error:', error)
      alert('Xuất file thất bại! Vui lòng thử lại.')
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  // Calculate total items
  const totalItems = (originalImage ? 1 : 0) + generatedImages.length + (analysisData ? 1 : 0) + (marketingContent ? 1 : 0)

  return (
    <div className="export-hub">
      <button
        onClick={handleExport}
        disabled={isExporting || totalItems === 0}
        className="export-button relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          border: 'none',
          cursor: isExporting || totalItems === 0 ? 'not-allowed' : 'pointer',
          opacity: isExporting || totalItems === 0 ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        }}
      >
        {isExporting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Đang xuất... {exportProgress}%</span>
          </>
        ) : (
          <>
            <FileArchive size={18} />
            <span>Xuất Hồ Sơ (ZIP)</span>
            {totalItems > 0 && (
              <span className="item-count" style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                {totalItems} items
              </span>
            )}
          </>
        )}

        {/* Progress bar overlay */}
        {isExporting && (
          <div
            className="progress-overlay"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${exportProgress}%`,
              background: 'rgba(255,255,255,0.2)',
              transition: 'width 0.3s ease',
              pointerEvents: 'none'
            }}
          />
        )}
      </button>

      {/* Export info tooltip */}
      {totalItems > 0 && !isExporting && (
        <div className="export-info" style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#888',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Download size={14} />
          <span>
            {originalImage && '1 ảnh gốc'}
            {originalImage && generatedImages.length > 0 && ' • '}
            {generatedImages.length > 0 && `${generatedImages.length} ảnh model`}
            {(originalImage || generatedImages.length > 0) && (analysisData || marketingContent) && ' • '}
            {analysisData && 'Phân tích AI'}
            {analysisData && marketingContent && ' • '}
            {marketingContent && 'Nội dung Marketing'}
          </span>
        </div>
      )}
    </div>
  )
}
