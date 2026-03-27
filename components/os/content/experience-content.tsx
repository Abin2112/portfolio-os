'use client'

import { motion } from 'framer-motion'
import { Building2, Calendar } from 'lucide-react'

const experiences = [
  {
    title: 'Data Science Intern',
    company: 'Tech Solutions Inc.',
    period: 'Jun 2023 - Aug 2023',
    description: 'Developed machine learning models for customer churn prediction, achieving 92% accuracy. Built data pipelines and created interactive dashboards for stakeholders.',
    skills: ['Python', 'Scikit-learn', 'SQL', 'Tableau'],
    type: 'Internship',
  },
  {
    title: 'Backend Developer Intern',
    company: 'StartupXYZ',
    period: 'Jan 2023 - Apr 2023',
    description: 'Designed and implemented RESTful APIs for the e-commerce platform. Optimized database queries resulting in 40% faster response times.',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    type: 'Internship',
  },
  {
    title: 'Project Lead',
    company: 'University Project',
    period: 'Sep 2022 - Dec 2022',
    description: 'Led a team of 4 in developing a real-time sentiment analysis system for social media data. Implemented NLP models and a React dashboard.',
    skills: ['Python', 'TensorFlow', 'React', 'AWS'],
    type: 'Project',
  },
  {
    title: 'Open Source Contributor',
    company: 'Various Projects',
    period: '2022 - Present',
    description: 'Active contributor to open-source data science and backend tools. Contributed bug fixes and feature enhancements to popular libraries.',
    skills: ['Git', 'Python', 'Documentation'],
    type: 'Volunteer',
  },
]

export function ExperienceContent() {
  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-foreground"
      >
        Experience
      </motion.h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-secondary border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>

              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                      {exp.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                      {exp.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                  <Calendar className="w-3 h-3" />
                  {exp.period}
                </div>

                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs rounded bg-secondary text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
