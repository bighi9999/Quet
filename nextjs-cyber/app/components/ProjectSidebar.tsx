'use client'

import { useState } from 'react'
import { useProjects } from '../contexts/ProjectContext'
import { Folder, Plus, X, ChevronLeft, ChevronRight, Trash2, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProjectSidebar() {
  const { projects, currentProject, createProject, selectProject, deleteProject, isLoading } = useProjects()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const handleCreateProject = async () => {
    if (newProjectName.trim()) {
      await createProject(newProjectName.trim())
      setNewProjectName('')
      setIsCreating(false)
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-black/80 border border-cyber-primary rounded-lg p-3 hover:bg-black/90 transition-all backdrop-blur-md"
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-cyber-primary" />
        ) : (
          <ChevronRight className="w-5 h-5 text-cyber-primary" />
        )}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed left-0 top-0 h-full w-80 bg-black/95 border-r border-cyber-primary z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-cyber-primary/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-cyber-primary" />
                    <h2 className="text-lg font-bold text-cyber-primary">DỰ ÁN</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-cyber-primary/20 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-cyber-secondary" />
                  </button>
                </div>
              </div>

              {/* Project List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isLoading ? (
                  <div className="text-center text-cyber-secondary py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-cyber-primary border-t-transparent rounded-full mx-auto mb-2" />
                    Đang tải...
                  </div>
                ) : (
                  <>
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className={`group relative p-3 rounded-lg border cursor-pointer transition-all ${
                          currentProject?.id === project.id
                            ? 'bg-cyber-primary/10 border-cyber-primary'
                            : 'bg-black/50 border-cyber-primary/30 hover:border-cyber-primary/60'
                        }`}
                        onClick={() => selectProject(project.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-cyber-primary truncate">
                              {project.name}
                            </h3>
                            <p className="text-xs text-cyber-secondary mt-1">
                              {project.items.length} mục
                            </p>
                            <p className="text-[10px] text-cyber-secondary/70 mt-1">
                              {new Date(project.updatedAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm(`Xóa dự án "${project.name}"?`)) {
                                deleteProject(project.id)
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>

                        {currentProject?.id === project.id && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-primary rounded-r" />
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Create New Project */}
              <div className="p-4 border-t border-cyber-primary/50">
                {isCreating ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                      placeholder="Tên dự án..."
                      className="w-full px-3 py-2 bg-black border border-cyber-primary rounded text-sm text-cyber-primary focus:outline-none focus:ring-2 focus:ring-cyber-primary/50"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateProject}
                        className="flex-1 px-3 py-2 bg-cyber-primary text-black rounded text-sm font-semibold hover:bg-cyber-primary/80 transition-colors"
                      >
                        Tạo
                      </button>
                      <button
                        onClick={() => {
                          setIsCreating(false)
                          setNewProjectName('')
                        }}
                        className="px-3 py-2 bg-black border border-cyber-secondary/50 text-cyber-secondary rounded text-sm hover:bg-cyber-secondary/10 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black border border-cyber-primary rounded-lg text-cyber-primary hover:bg-cyber-primary/10 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">TẠO DỰ ÁN MỚI</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
