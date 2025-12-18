'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface ProjectData {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  items: ProjectItem[]
}

interface ProjectItem {
  id: string
  type: 'analysis' | 'generated-image' | 'marketing-content'
  timestamp: number
  data: any
  thumbnail?: string
}

interface ProjectContextType {
  projects: ProjectData[]
  currentProject: ProjectData | null
  createProject: (name: string) => Promise<void>
  selectProject: (id: string) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addItemToProject: (item: Omit<ProjectItem, 'id' | 'timestamp'>) => Promise<void>
  isLoading: boolean
}

interface BGAiToolsDB extends DBSchema {
  projects: {
    key: string
    value: ProjectData
  }
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<IDBPDatabase<BGAiToolsDB> | null>(null)
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize IndexedDB
  useEffect(() => {
    async function initDB() {
      try {
        const database = await openDB<BGAiToolsDB>('bg-ai-tools-db', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('projects')) {
              db.createObjectStore('projects', { keyPath: 'id' })
            }
          },
        })
        
        setDb(database)
        
        // Load all projects
        const allProjects = await database.getAll('projects')
        setProjects(allProjects.sort((a, b) => b.updatedAt - a.updatedAt))
        
        // Select first project or create default
        if (allProjects.length > 0) {
          setCurrentProject(allProjects[0])
        } else {
          // Create default project
          await createDefaultProject(database)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('[IndexedDB] Initialization error:', error)
        setIsLoading(false)
      }
    }

    initDB()
  }, [])

  async function createDefaultProject(database: IDBPDatabase<BGAiToolsDB>) {
    const defaultProject: ProjectData = {
      id: `project-${Date.now()}`,
      name: 'Dự án mặc định',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      items: []
    }

    await database.add('projects', defaultProject)
    setProjects([defaultProject])
    setCurrentProject(defaultProject)
  }

  const createProject = async (name: string) => {
    if (!db) return

    const newProject: ProjectData = {
      id: `project-${Date.now()}`,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      items: []
    }

    await db.add('projects', newProject)
    setProjects(prev => [newProject, ...prev])
    setCurrentProject(newProject)
  }

  const selectProject = async (id: string) => {
    if (!db) return

    const project = await db.get('projects', id)
    if (project) {
      setCurrentProject(project)
    }
  }

  const deleteProject = async (id: string) => {
    if (!db) return

    await db.delete('projects', id)
    setProjects(prev => prev.filter(p => p.id !== id))
    
    if (currentProject?.id === id) {
      const remaining = projects.filter(p => p.id !== id)
      setCurrentProject(remaining[0] || null)
    }
  }

  const addItemToProject = async (item: Omit<ProjectItem, 'id' | 'timestamp'>) => {
    if (!db || !currentProject) return

    const newItem: ProjectItem = {
      ...item,
      id: `item-${Date.now()}`,
      timestamp: Date.now()
    }

    const updatedProject = {
      ...currentProject,
      items: [newItem, ...currentProject.items],
      updatedAt: Date.now()
    }

    await db.put('projects', updatedProject)
    setCurrentProject(updatedProject)
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        createProject,
        selectProject,
        deleteProject,
        addItemToProject,
        isLoading
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within ProjectProvider')
  }
  return context
}
