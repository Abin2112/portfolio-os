'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useWindowStore, type WindowId } from '@/lib/window-store'

const PROMPT = 'abin@portfolio:~$ '
const TOP_BAR_HEIGHT = 32

interface HistoryEntry {
  input: string
  output: string[]
  isError?: boolean
}

const ABOUT_LINES = [
  '╔════════════════════════════════════════╗',
  '║           Abin Pillai                  ║',
  '╠════════════════════════════════════════╣',
  '║  Role    : Data Science & Backend Dev  ║',
  '║  Location: India                       ║',
  '║  Email   : abin@example.com            ║',
  '╚════════════════════════════════════════╝',
  '',
  'Passionate about building scalable systems',
  'and extracting insights from complex data.',
  '',
  'Education: B.Tech in Computer Science (2020-2024)',
]

const HELP_LINES = [
  'Portfolio OS Terminal v2.0',
  '─────────────────────────────────────────',
  'COMMANDS:',
  '  abin --about        Show profile info',
  '  show projects       Open Projects window',
  '  show skills         Open Skills window',
  '  show experience     Open Experience window',
  '  show contact        Open Contact window',
  '  show resume         Open Resume window',
  '  ls                  List home directory',
  '  ls <folder>         List folder contents',
  '  cat <file>          Read a file',
  '  pwd                 Print working directory',
  '  whoami              Current user',
  '  date                Current date/time',
  '  clear               Clear terminal',
  '  help                Show this message',
  '─────────────────────────────────────────',
]

const LS_HOME = [
  'total 8',
  'drwxr-xr-x  projects/',
  'drwxr-xr-x  certificates/',
  'drwxr-xr-x  resume/',
  '-rw-r--r--  about.txt',
  '-rw-r--r--  skills.txt',
  '-rw-r--r--  contact.txt',
]

const LS_PROJECTS = [
  'total 4',
  '-rw-r--r--  ml-price-predictor.md',
  '-rw-r--r--  rest-api-framework.md',
  '-rw-r--r--  data-pipeline-tool.md',
  '-rw-r--r--  cli-task-manager.md',
]

const LS_CERTS = [
  'total 3',
  '-rw-r--r--  aws-certification.pdf',
  '-rw-r--r--  ml-specialization.pdf',
  '-rw-r--r--  hackathon-2023.pdf',
]

const LS_RESUME = [
  'total 1',
  '-rw-r--r--  Abin_Pillai_Resume.pdf',
]

const CAT_ABOUT = [
  'Name    : Abin Pillai',
  'Role    : Data Science & Backend Developer',
  'Location: India',
  'Email   : abin@example.com',
  '',
  'I am passionate about building scalable systems',
  'and extracting insights from complex data.',
  'Combining analytical thinking with strong',
  'engineering skills.',
  '',
  'Education:',
  '  B.Tech Computer Science & Engineering',
  '  Class of 2024',
]

const CAT_SKILLS = [
  'TECHNICAL SKILLS',
  '─────────────────',
  'Languages : Python, JavaScript, TypeScript, Rust, SQL',
  'Data Sci  : Pandas, NumPy, Scikit-learn, TensorFlow',
  'Backend   : Node.js, FastAPI, Express, PostgreSQL',
  'DevOps    : Docker, Git, AWS, Linux',
  'Tools     : Apache Airflow, Redis, SQLite',
]

const CAT_CONTACT = [
  'CONTACT INFORMATION',
  '────────────────────',
  'Email   : abin@example.com',
  'GitHub  : github.com/abin2112',
  'LinkedIn: linkedin.com/in/abin-pillai',
  '',
  'Open the Contact window for a message form!',
]

function processCommand(
  cmd: string,
  openWindow: (id: WindowId) => void
): { output: string[]; isError: boolean } {
  const trimmed = cmd.trim()
  const lower = trimmed.toLowerCase()

  if (!trimmed) return { output: [], isError: false }

  if (lower === 'clear') return { output: ['__CLEAR__'], isError: false }
  if (lower === 'help' || lower === '--help' || lower === '-h')
    return { output: HELP_LINES, isError: false }
  if (lower === 'abin --about' || lower === 'about')
    return { output: ABOUT_LINES, isError: false }
  if (lower === 'whoami') return { output: ['abin'], isError: false }
  if (lower === 'pwd') return { output: ['/home/abin'], isError: false }
  if (lower === 'date') return { output: [new Date().toString()], isError: false }

  if (lower === 'ls' || lower === 'ls .' || lower === 'ls /home/abin' || lower === 'ls ~')
    return { output: LS_HOME, isError: false }
  if (lower === 'ls projects' || lower === 'ls projects/')
    return { output: LS_PROJECTS, isError: false }
  if (lower === 'ls certificates' || lower === 'ls certificates/')
    return { output: LS_CERTS, isError: false }
  if (lower === 'ls resume' || lower === 'ls resume/')
    return { output: LS_RESUME, isError: false }

  if (lower === 'cat about.txt') return { output: CAT_ABOUT, isError: false }
  if (lower === 'cat skills.txt') return { output: CAT_SKILLS, isError: false }
  if (lower === 'cat contact.txt') return { output: CAT_CONTACT, isError: false }

  if (lower === 'show projects') {
    openWindow('projects')
    return { output: ['✓ Opening Projects window...'], isError: false }
  }
  if (lower === 'show skills') {
    openWindow('skills')
    return { output: ['✓ Opening Skills window...'], isError: false }
  }
  if (lower === 'show experience') {
    openWindow('experience')
    return { output: ['✓ Opening Experience window...'], isError: false }
  }
  if (lower === 'show contact') {
    openWindow('contact')
    return { output: ['✓ Opening Contact window...'], isError: false }
  }
  if (lower === 'show resume') {
    openWindow('resume')
    return { output: ['✓ Opening Resume window...'], isError: false }
  }
  if (lower === 'show files' || lower === 'show file-explorer') {
    openWindow('file-explorer')
    return { output: ['✓ Opening File Explorer...'], isError: false }
  }

  if (lower.startsWith('echo ')) {
    return { output: [trimmed.slice(5)], isError: false }
  }

  if (lower === 'uname' || lower === 'uname -a') {
    return {
      output: ['Portfolio-Linux 2.0 x86_64 Next.js/16 (Portfolio OS) GNU/Linux'],
      isError: false,
    }
  }

  if (lower === 'uptime') {
    return { output: [`up ${Math.floor(Math.random() * 60 + 5)} min, 1 user, load average: 0.12`], isError: false }
  }

  return {
    output: [`bash: ${trimmed}: command not found. Type 'help' for available commands.`],
    isError: true,
  }
}

export const TerminalContent = memo(function TerminalContent() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      input: '',
      output: [
        '╔══════════════════════════════════════════╗',
        '║   Portfolio OS Terminal v2.0             ║',
        '║   Welcome, Abin!                         ║',
        '╚══════════════════════════════════════════╝',
        '',
        "Type 'help' to see available commands.",
        '',
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { openWindow } = useWindowStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    // Auto-focus when the terminal mounts
    const timer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const cmd = input

      if (cmd.toLowerCase().trim() === 'clear') {
        setHistory([])
        setInput('')
        setCmdHistory((prev) => (cmd.trim() ? [cmd, ...prev].slice(0, 50) : prev))
        setHistIdx(-1)
        return
      }

      const { output, isError } = processCommand(cmd, openWindow)
      if (cmd.trim()) {
        setCmdHistory((prev) => [cmd, ...prev].slice(0, 50))
      }
      setHistIdx(-1)
      setHistory((prev) => [...prev, { input: cmd, output, isError }])
      setInput('')
    },
    [input, openWindow]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const newIdx = Math.min(histIdx + 1, cmdHistory.length - 1)
        setHistIdx(newIdx)
        if (cmdHistory[newIdx] !== undefined) setInput(cmdHistory[newIdx])
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const newIdx = Math.max(histIdx - 1, -1)
        setHistIdx(newIdx)
        setInput(newIdx === -1 ? '' : cmdHistory[newIdx])
      } else if (e.key === 'Tab') {
        e.preventDefault()
        // Simple tab completion for commands
        const partial = input.toLowerCase().trim()
        const cmds = [
          'help',
          'clear',
          'abin --about',
          'show projects',
          'show skills',
          'show experience',
          'show contact',
          'show resume',
          'ls',
          'pwd',
          'whoami',
          'date',
          'cat about.txt',
          'cat skills.txt',
          'cat contact.txt',
        ]
        const match = cmds.find((c) => c.startsWith(partial) && c !== partial)
        if (match) setInput(match)
      }
    },
    [histIdx, cmdHistory, input]
  )

  return (
    <div
      className="h-full -m-6 bg-[#0d1117] font-mono text-sm overflow-auto p-4 cursor-text select-text"
      style={{ minHeight: `${TOP_BAR_HEIGHT}px` }}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((entry, i) => (
        <div key={i} className="mb-1">
          {(entry.input !== '' || i > 0) && (
            <div className="flex flex-wrap">
              <span className="text-green-400 select-none whitespace-pre">{PROMPT}</span>
              <span className="text-white">{entry.input}</span>
            </div>
          )}
          {entry.output.map((line, j) => (
            <div
              key={j}
              className={
                entry.isError
                  ? 'text-red-400'
                  : line.startsWith('✓')
                  ? 'text-green-400'
                  : line.startsWith('║') || line.startsWith('╔') || line.startsWith('╚') || line.startsWith('╠') || line.startsWith('─')
                  ? 'text-cyan-400'
                  : 'text-gray-300'
              }
            >
              {line || '\u00A0'}
            </div>
          ))}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex mt-1">
        <span className="text-green-400 select-none whitespace-pre">{PROMPT}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white outline-none caret-green-400 min-w-0"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  )
})
