import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatStore {
  messages: ChatMessage[]
  isOpen: boolean
  isTyping: boolean
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  toggleChat: () => void
  closeChat: () => void
  setTyping: (isTyping: boolean) => void
  clearMessages: () => void
}

// Portfolio data for the chatbot
export const portfolioData = {
  name: 'Abin Pillai',
  role: 'Data Science & Backend Developer',
  email: 'abin@example.com',
  location: 'India',
  education: {
    degree: 'Bachelor of Technology',
    field: 'Computer Science & Engineering',
    year: '2020 - 2024',
  },
  skills: {
    languages: ['Python', 'JavaScript', 'TypeScript', 'Rust', 'SQL'],
    datascience: ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
    backend: ['Node.js', 'FastAPI', 'Express', 'Django', 'PostgreSQL', 'Redis'],
    tools: ['Docker', 'Git', 'AWS', 'Linux', 'Apache Airflow'],
  },
  projects: [
    {
      name: 'ML Price Predictor',
      description: 'A machine learning model that predicts housing prices using advanced regression techniques',
      tech: ['Python', 'Scikit-learn', 'Pandas', 'FastAPI'],
    },
    {
      name: 'REST API Framework',
      description: 'A scalable backend framework for building RESTful APIs with authentication and rate limiting',
      tech: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    },
    {
      name: 'Data Pipeline Tool',
      description: 'ETL pipeline for processing large datasets with real-time monitoring',
      tech: ['Python', 'Apache Airflow', 'Docker', 'AWS'],
    },
    {
      name: 'CLI Task Manager',
      description: 'A command-line productivity tool for managing tasks and projects',
      tech: ['Rust', 'SQLite', 'Tokio'],
    },
  ],
  experience: [
    {
      title: 'Data Science Intern',
      company: 'Tech Corp',
      period: 'Summer 2023',
      description: 'Built ML models for predictive analytics',
    },
    {
      title: 'Backend Developer Intern',
      company: 'StartupXYZ',
      period: 'Winter 2022',
      description: 'Developed REST APIs and optimized database queries',
    },
  ],
  achievements: [
    'Published research paper on ML algorithms',
    'Won university hackathon 2023',
    'Top performer in data structures course',
    'Open source contributor',
  ],
}

export const useCharStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm Abin's portfolio assistant. Ask me anything about Abin's skills, projects, or experience. Try questions like:\n\n• "What are Abin's skills?"\n• "Tell me about his projects"\n• "What is his experience?"`,
      timestamp: new Date(),
    },
  ],
  isOpen: false,
  isTyping: false,

  addMessage: (message) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    set((state) => ({
      messages: [...state.messages, { ...message, id, timestamp: new Date() }],
    }))
  },

  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },

  closeChat: () => {
    set({ isOpen: false })
  },

  setTyping: (isTyping) => {
    set({ isTyping })
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hello! I'm Abin's portfolio assistant. Ask me anything about Abin's skills, projects, or experience.`,
          timestamp: new Date(),
        },
      ],
    })
  },
}))
