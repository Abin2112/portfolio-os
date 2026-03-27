'use client'

import { motion } from 'framer-motion'
import { Download, Eye, FileText } from 'lucide-react'

export function ResumeContent() {
  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-foreground"
      >
        Resume
      </motion.h2>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative p-6 rounded-xl bg-secondary/30 border border-border/50"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-border/50 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Abin_Pillai_Resume.pdf</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Updated March 2024
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PDF Document • 156 KB
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </motion.button>
        </div>
      </motion.div>

      {/* Resume Sections Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Quick Overview
        </h3>

        <div className="grid gap-3">
          {[
            { label: 'Education', value: 'B.Tech in Computer Science' },
            { label: 'Experience', value: '2 Internships + Projects' },
            { label: 'Skills', value: 'Python, ML, Backend Dev' },
            { label: 'Location', value: 'Open to Remote/Hybrid' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.3 }}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/30"
            >
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium text-foreground">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
      >
        <p className="text-sm text-foreground/90 text-center">
          Interested in working together? Feel free to reach out through the Contact section!
        </p>
      </motion.div>
    </div>
  )
}
