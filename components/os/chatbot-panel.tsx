'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User, Sparkles, Trash2, MessageCircle } from 'lucide-react'
import { useCharStore, portfolioData } from '@/lib/chat-store'

const quickSuggestions = [
  { label: 'About Abin', query: 'Tell me about Abin' },
  { label: 'Skills', query: 'What are his skills?' },
  { label: 'Projects', query: 'Show me his projects' },
  { label: 'Experience', query: 'What is his experience?' },
]

function generateResponse(query: string): string {
  const q = query.toLowerCase().trim()
  const { name, role, skills, projects, experience, education, achievements } = portfolioData

  // Greetings
  if (/^(hi|hello|hey|greetings|howdy)/i.test(q)) {
    return `Hello! I'm ${name}'s portfolio assistant. I can tell you about his skills, projects, experience, and more. What would you like to know?`
  }

  // About/Introduction
  if (q.includes('who') || q.includes('about') || q.includes('introduce') || q.includes('abin') || q.includes('tell me')) {
    return `**${name}** is a ${role} based in ${portfolioData.location}.\n\nHe is passionate about building scalable systems and extracting insights from complex data. With expertise in data science and backend development, he combines analytical thinking with strong engineering skills.\n\n**Education:** ${education.degree} in ${education.field} (${education.year})`
  }

  // Skills
  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('know') || q.includes('can do') || q.includes('proficient')) {
    return `**${name}'s Technical Skills:**\n\n**Languages:** ${skills.languages.join(', ')}\n\n**Data Science:** ${skills.datascience.join(', ')}\n\n**Backend:** ${skills.backend.join(', ')}\n\n**Tools:** ${skills.tools.join(', ')}`
  }

  // Projects
  if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('create') || q.includes('portfolio')) {
    const projectList = projects
      .map((p) => `**${p.name}**\n${p.description}\n_Tech: ${p.tech.join(', ')}_`)
      .join('\n\n')
    return `**${name}'s Notable Projects:**\n\n${projectList}`
  }

  // Experience
  if (q.includes('experience') || q.includes('intern') || q.includes('job') || q.includes('company') || q.includes('work history')) {
    const expList = experience
      .map((e) => `**${e.title}** at ${e.company}\n_${e.period}_\n${e.description}`)
      .join('\n\n')
    return `**Professional Experience:**\n\n${expList}`
  }

  // Education
  if (q.includes('education') || q.includes('study') || q.includes('degree') || q.includes('university') || q.includes('college') || q.includes('school')) {
    return `**Education:**\n\n${name} holds a **${education.degree}** in ${education.field}.\n\nGraduation: ${education.year}`
  }

  // Achievements
  if (q.includes('achievement') || q.includes('award') || q.includes('accomplish') || q.includes('certification')) {
    return `**${name}'s Achievements:**\n\n${achievements.map((a) => `• ${a}`).join('\n')}`
  }

  // Contact
  if (q.includes('contact') || q.includes('reach') || q.includes('email') || q.includes('hire') || q.includes('connect')) {
    return `You can reach **${name}** through the Contact app on the desktop!\n\nJust double-click the Contact icon to open the contact form and social links.`
  }

  // Resume
  if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
    return `You can view and download ${name}'s resume by opening the **Resume** app on the desktop.\n\nIt contains a comprehensive overview of his education, skills, and experience.`
  }

  // Help / General
  if (q.includes('help') || q.includes('what can')) {
    return `I can help you learn about **${name}**! Here's what I know:\n\n• **About** - Introduction and background\n• **Skills** - Technical expertise\n• **Projects** - Work samples and portfolio\n• **Experience** - Professional history\n• **Education** - Academic background\n• **Achievements** - Awards and certifications\n• **Contact** - How to reach him\n\nJust ask me anything about these topics!`
  }

  // Thanks
  if (q.includes('thank') || q.includes('thanks')) {
    return `You're welcome! Feel free to ask if you have more questions about ${name}'s portfolio.`
  }

  // Off-topic response
  const offTopicResponses = [
    `I'm specifically designed to answer questions about **${name}'s portfolio**. Try asking about his skills, projects, or experience!`,
    `That's outside my area of expertise. I can tell you about ${name}'s technical skills, projects, and professional background though!`,
    `I'm here to help you learn about ${name}. Would you like to know about his skills, projects, or experience?`,
  ]
  
  return offTopicResponses[Math.floor(Math.random() * offTopicResponses.length)]
}

export function ChatbotPanel() {
  const { messages, isOpen, isTyping, toggleChat, closeChat, addMessage, setTyping, clearMessages } = useCharStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    addMessage({ role: 'user', content: userMessage })

    // Simulate typing with realistic delay
    setTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 800))
    setTyping(false)

    const response = generateResponse(userMessage)
    addMessage({ role: 'assistant', content: response })
  }

  const handleQuickSuggestion = (query: string) => {
    setInput(query)
    // Auto-submit after a brief delay
    setTimeout(() => {
      addMessage({ role: 'user', content: query })
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        addMessage({ role: 'assistant', content: generateResponse(query) })
      }, 600 + Math.random() * 600)
    }, 100)
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 300 }}
        onClick={toggleChat}
        className={`fixed left-4 bottom-20 z-[9980] w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all ${
          isOpen
            ? 'bg-primary text-primary-foreground'
            : 'bg-[var(--popover)] border border-[var(--glass-border)] text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -350, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-4 top-12 bottom-24 w-80 z-[9981] rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[var(--window-bg)] backdrop-blur-xl" />
            <div className="absolute inset-0 border border-[var(--glass-border)] rounded-xl" />

            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground text-sm">Portfolio Assistant</span>
                    <p className="text-[10px] text-muted-foreground">Ask about Abin</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearMessages}
                    className="p-1.5 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-1.5 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 py-3 border-b border-[var(--glass-border)]">
                  <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.label}
                        onClick={() => handleQuickSuggestion(suggestion.query)}
                        className="px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-primary/20'
                          : 'bg-gradient-to-br from-primary to-accent'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-secondary/50">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="p-3 border-t border-[var(--glass-border)]"
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Abin..."
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
