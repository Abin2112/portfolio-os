'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, memo } from 'react'
import { ExternalLink, Github, Database, Brain, Globe, Terminal, ArrowLeft, X } from 'lucide-react'

interface Project {
  title: string
  description: string
  longDescription: string
  tech: string[]
  icon: React.ComponentType<{ className?: string }>
  color: string
  github: string
  demo?: string
  tags: string[]
  status: 'completed' | 'in-progress'
}

const projects: Project[] = [
  {
    title: 'ML Price Predictor',
    description: 'A machine learning model that predicts housing prices using advanced regression techniques and feature engineering.',
    longDescription:
      'Built a complete ML pipeline from data ingestion to model serving. Used ensemble methods (XGBoost + Random Forest) with custom feature engineering. Achieved 94% accuracy on test data. Exposed via a FastAPI REST endpoint with real-time prediction capability and model explainability (SHAP values).',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'FastAPI', 'XGBoost', 'SHAP'],
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    github: 'https://github.com/Abin2112',
    demo: 'https://github.com/Abin2112',
    tags: ['Machine Learning', 'Python', 'API'],
    status: 'completed',
  },
  {
    title: 'REST API Framework',
    description: 'A scalable backend framework for building RESTful APIs with built-in authentication and rate limiting.',
    longDescription:
      'Designed and implemented a production-ready API framework with JWT authentication, role-based access control, automatic rate limiting, request validation, and OpenAPI documentation generation. Supports PostgreSQL and Redis out of the box with connection pooling.',
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'JWT', 'OpenAPI'],
    icon: Globe,
    color: 'from-green-500 to-emerald-500',
    github: 'https://github.com/Abin2112',
    demo: 'https://github.com/Abin2112',
    tags: ['Backend', 'Node.js', 'API'],
    status: 'completed',
  },
  {
    title: 'Data Pipeline Tool',
    description: 'ETL pipeline for processing large datasets with real-time monitoring and error handling.',
    longDescription:
      'Built a distributed ETL pipeline using Apache Airflow to process millions of records daily. Features real-time monitoring, automatic retry logic, data quality checks, and Slack alerts for failures. Deployed on AWS with Docker containers and auto-scaling worker nodes.',
    tech: ['Python', 'Apache Airflow', 'Docker', 'AWS', 'PostgreSQL', 'Slack API'],
    icon: Database,
    color: 'from-orange-500 to-amber-500',
    github: 'https://github.com/Abin2112',
    tags: ['Data Engineering', 'Python', 'Cloud'],
    status: 'completed',
  },
  {
    title: 'CLI Task Manager',
    description: 'A command-line productivity tool for managing tasks and projects with sync capabilities.',
    longDescription:
      'A blazing-fast CLI tool written in Rust for managing tasks, projects, and deadlines. Features an intuitive TUI interface, SQLite local storage, cloud sync, time tracking, and export to CSV/JSON. Supports plugins for custom workflow integrations.',
    tech: ['Rust', 'SQLite', 'Tokio', 'Ratatui', 'Serde'],
    icon: Terminal,
    color: 'from-pink-500 to-rose-500',
    github: 'https://github.com/Abin2112',
    tags: ['CLI', 'Rust', 'Productivity'],
    status: 'in-progress',
  },
]

type TabId = 'overview' | 'demo' | 'code'

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const Icon = project.icon

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'demo', label: 'Demo' },
    { id: 'code', label: 'Code' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-md`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground">{project.title}</h2>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                project.status === 'completed'
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-yellow-500/20 text-yellow-500'
              }`}
            >
              {project.status === 'completed' ? '✓ Completed' : '⚡ In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-[var(--glass-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.longDescription}
              </p>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-md bg-secondary/50 text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'demo' && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center h-48 gap-4"
            >
              {project.demo ? (
                <>
                  <div className="w-full h-40 rounded-xl bg-secondary/30 border border-border/50 flex flex-col items-center justify-center gap-3">
                    <ExternalLink className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Live demo available</p>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                    >
                      Open Demo
                    </a>
                  </div>
                </>
              ) : (
                <div className="w-full h-40 rounded-xl bg-secondary/30 border border-border/50 flex flex-col items-center justify-center gap-2">
                  <X className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No live demo available</p>
                  <p className="text-xs text-muted-foreground">Check the source code instead</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <Github className="w-5 h-5 text-foreground" />
                  <span className="font-medium text-foreground">Source Code</span>
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on GitHub
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#0d1117] rounded-xl border border-border/50 font-mono text-xs">
                <p className="text-gray-500 mb-2"># Clone the repository</p>
                <p className="text-green-400">
                  git clone https://github.com/Abin2112/{project.title.toLowerCase().replace(/\s+/g, '-')}
                </p>
                <p className="text-gray-500 mt-3 mb-2"># Install dependencies</p>
                <p className="text-blue-400">
                  {project.tech.includes('Node.js')
                    ? 'npm install'
                    : project.tech.includes('Rust')
                    ? 'cargo build --release'
                    : 'pip install -r requirements.txt'}
                </p>
                <p className="text-gray-500 mt-3 mb-2"># Run</p>
                <p className="text-yellow-400">
                  {project.tech.includes('Node.js')
                    ? 'npm run dev'
                    : project.tech.includes('Rust')
                    ? 'cargo run'
                    : 'python main.py'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export const ProjectsContent = memo(function ProjectsContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
  }

  return (
    <div className="space-y-4">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-foreground mb-1"
      >
        My Projects
      </motion.h2>
      <p className="text-sm text-muted-foreground mb-4">Click a project to explore details</p>

      <div className="grid gap-3">
        {projects.map((project, index) => {
          const Icon = project.icon
          return (
            <motion.button
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => setSelectedProject(project)}
              className="group p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all hover:bg-secondary/50 text-left w-full"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        project.status === 'completed'
                          ? 'bg-green-500/15 text-green-500'
                          : 'bg-yellow-500/15 text-yellow-500'
                      }`}
                    >
                      {project.status === 'completed' ? '✓' : '⚡'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-secondary/50 text-muted-foreground">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
})
