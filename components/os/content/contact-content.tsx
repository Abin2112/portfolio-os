'use client'

import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Send } from 'lucide-react'
import { useState } from 'react'

const socialLinks = [
  {
    name: 'Email',
    value: 'abin.pillai@email.com',
    href: 'mailto:abin.pillai@email.com',
    icon: Mail,
    color: 'from-red-500 to-orange-500',
  },
  {
    name: 'GitHub',
    value: 'github.com/abinpillai',
    href: 'https://github.com',
    icon: Github,
    color: 'from-gray-600 to-gray-800',
  },
  {
    name: 'LinkedIn',
    value: 'linkedin.com/in/abinpillai',
    href: 'https://linkedin.com',
    icon: Linkedin,
    color: 'from-blue-500 to-blue-700',
  },
]

export function ContactContent() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-foreground"
      >
        Get in Touch
      </motion.h2>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-3"
      >
        {socialLinks.map((link, index) => {
          const Icon = link.icon
          return (
            <motion.a
              key={link.name}
              href={link.href}
              target={link.name !== 'Email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {link.name}
                </h3>
                <p className="text-sm text-muted-foreground">{link.value}</p>
              </div>
            </motion.a>
          )
        })}
      </motion.div>

      {/* Contact Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-4 pt-4 border-t border-border/50"
      >
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Send a Message
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <textarea
          placeholder="Your Message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4" />
          Send Message
        </motion.button>
      </motion.form>
    </div>
  )
}
