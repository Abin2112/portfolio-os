'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Database, Brain, Globe, Terminal } from 'lucide-react'

const projects = [
  {
    title: 'ML Price Predictor',
    description: 'A machine learning model that predicts housing prices using advanced regression techniques and feature engineering.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'FastAPI'],
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    github: '#',
    demo: '#',
  },
  {
    title: 'REST API Framework',
    description: 'A scalable backend framework for building RESTful APIs with built-in authentication and rate limiting.',
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    icon: Globe,
    color: 'from-green-500 to-emerald-500',
    github: '#',
    demo: '#',
  },
  {
    title: 'Data Pipeline Tool',
    description: 'ETL pipeline for processing large datasets with real-time monitoring and error handling.',
    tech: ['Python', 'Apache Airflow', 'Docker', 'AWS'],
    icon: Database,
    color: 'from-orange-500 to-amber-500',
    github: '#',
  },
  {
    title: 'CLI Task Manager',
    description: 'A command-line productivity tool for managing tasks and projects with sync capabilities.',
    tech: ['Rust', 'SQLite', 'Tokio'],
    icon: Terminal,
    color: 'from-pink-500 to-rose-500',
    github: '#',
  },
]

export function ProjectsContent() {
  return (
    <div className="space-y-4">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-foreground mb-4"
      >
        My Projects
      </motion.h2>

      <div className="grid gap-4">
        {projects.map((project, index) => {
          const Icon = project.icon
          return (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all hover:bg-secondary/50"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <a
                      href={project.github}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Code
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
