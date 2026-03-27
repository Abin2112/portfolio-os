'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Award, ExternalLink, ZoomIn } from 'lucide-react'

interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  image: string
  credentialUrl?: string
}

const certificates: Certificate[] = [
  {
    id: '1',
    title: 'Python Data Science Certification',
    issuer: 'DataCamp',
    date: 'Dec 2023',
    description: 'Completed advanced Python training covering data manipulation, visualization, and machine learning fundamentals.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/certificates/python-ds.jpg',
    credentialUrl: '#',
  },
  {
    id: '2',
    title: 'Machine Learning Specialization',
    issuer: 'Coursera - Stanford',
    date: 'Oct 2023',
    description: 'Comprehensive ML course covering supervised learning, neural networks, and recommendation systems.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/certificates/ml-stanford.jpg',
    credentialUrl: '#',
  },
  {
    id: '3',
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: 'Aug 2023',
    description: 'Foundational understanding of AWS Cloud concepts, services, security, and pricing.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/certificates/aws-cloud.jpg',
    credentialUrl: '#',
  },
  {
    id: '4',
    title: 'Full Stack Web Development',
    issuer: 'freeCodeCamp',
    date: 'Jun 2023',
    description: 'Complete web development bootcamp covering HTML, CSS, JavaScript, React, and Node.js.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/certificates/fullstack.jpg',
    credentialUrl: '#',
  },
  {
    id: '5',
    title: 'Deep Learning Fundamentals',
    issuer: 'NVIDIA DLI',
    date: 'Apr 2023',
    description: 'Hands-on deep learning training with CUDA and neural network architectures.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/certificates/nvidia-dl.jpg',
    credentialUrl: '#',
  },
  {
    id: '6',
    title: 'SQL Advanced Certification',
    issuer: 'HackerRank',
    date: 'Feb 2023',
    description: 'Advanced SQL proficiency including complex queries, optimization, and database design.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/certificates/sql-advanced.jpg',
    credentialUrl: '#',
  },
]

export function CertificatesContent() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  return (
    <div className="h-full -m-6 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 border-b border-[var(--glass-border)] bg-[var(--window-bg)]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Certificates</h2>
            <p className="text-sm text-muted-foreground">{certificates.length} certifications earned</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedCert(cert)}
            className="group relative bg-secondary/30 border border-border/50 rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg"
          >
            {/* Image placeholder */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <Award className="w-12 h-12 text-primary/40" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground text-sm line-clamp-1">{cert.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
              <p className="text-xs text-primary mt-1">{cert.date}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[var(--popover)] border border-[var(--glass-border)] rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Certificate image */}
              <div className="aspect-video bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <Award className="w-20 h-20 text-primary/50" />
              </div>

              {/* Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground">{selectedCert.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-primary font-medium">{selectedCert.issuer}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{selectedCert.date}</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {selectedCert.description}
                </p>

                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    View Credential
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
