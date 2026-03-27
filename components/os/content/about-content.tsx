'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Award, MapPin } from 'lucide-react'

export function AboutContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
          AP
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Abin Pillai</h1>
          <p className="text-primary font-medium">Data Science & Backend Developer</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" />
            <span>Open to opportunities</span>
          </div>
        </div>
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-semibold text-foreground">About Me</h2>
        <p className="text-muted-foreground leading-relaxed">
          I&apos;m a passionate developer with expertise in data science and backend development.
          I love building scalable systems and extracting insights from complex data.
          My journey in tech has equipped me with a strong foundation in machine learning,
          API development, and database optimization.
        </p>
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Education
        </h2>
        <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
          <h3 className="font-medium text-foreground">Bachelor of Technology</h3>
          <p className="text-sm text-muted-foreground">Computer Science & Engineering</p>
          <p className="text-xs text-muted-foreground mt-1">2020 - 2024</p>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Achievements
        </h2>
        <ul className="space-y-2">
          {[
            'Published research paper on ML algorithms',
            'Won university hackathon 2023',
            'Top performer in data structures course',
            'Open source contributor',
          ].map((achievement, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              {achievement}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
