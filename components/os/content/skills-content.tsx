'use client'

import { motion } from 'framer-motion'

const skillCategories = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'SQL', level: 85 },
      { name: 'Rust', level: 60 },
    ],
  },
  {
    title: 'Data Science',
    skills: [
      { name: 'Machine Learning', level: 85 },
      { name: 'Data Analysis', level: 90 },
      { name: 'Deep Learning', level: 75 },
      { name: 'NLP', level: 70 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'FastAPI', level: 88 },
      { name: 'Node.js', level: 82 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'Redis', level: 75 },
      { name: 'Docker', level: 80 },
    ],
  },
  {
    title: 'Tools & Frameworks',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'AWS', level: 70 },
      { name: 'TensorFlow', level: 75 },
      { name: 'Pandas', level: 92 },
    ],
  },
]

export function SkillsContent() {
  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-foreground"
      >
        Technical Skills
      </motion.h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
              {category.title}
            </h3>
            <div className="space-y-2.5">
              {category.skills.map((skill, skillIndex) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/90">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{
                        delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.3,
                        duration: 0.8,
                        ease: 'easeOut',
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
