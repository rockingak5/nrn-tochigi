import { useEffect, useRef, type ReactNode } from 'react'

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
}

function ToolbarButton({ children, onClick, title }: { children: ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-200"
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const focused = useRef(false)

  useEffect(() => {
    if (ref.current && !focused.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value
    }
  }, [value])

  function exec(command: string, arg?: string) {
    document.execCommand(command, false, arg)
    ref.current?.focus()
    onChange(ref.current?.innerHTML ?? '')
  }

  function handleLink() {
    const url = window.prompt('Link URL')
    if (url) exec('createLink', url)
  }

  return (
    <div className="rounded-lg border border-slate-300">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <ToolbarButton title="Bold" onClick={() => exec('bold')}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => exec('italic')}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton title="Underline" onClick={() => exec('underline')}>
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton title="Heading" onClick={() => exec('formatBlock', '<h2>')}>
          H2
        </ToolbarButton>
        <ToolbarButton title="Paragraph" onClick={() => exec('formatBlock', '<p>')}>
          P
        </ToolbarButton>
        <ToolbarButton title="Bullet list" onClick={() => exec('insertUnorderedList')}>
          • List
        </ToolbarButton>
        <ToolbarButton title="Numbered list" onClick={() => exec('insertOrderedList')}>
          1. List
        </ToolbarButton>
        <ToolbarButton title="Link" onClick={handleLink}>
          Link
        </ToolbarButton>
        <ToolbarButton title="Clear formatting" onClick={() => exec('removeFormat')}>
          Clear
        </ToolbarButton>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => {
          focused.current = true
        }}
        onBlur={() => {
          focused.current = false
        }}
        onInput={() => onChange(ref.current?.innerHTML ?? '')}
        className="min-h-[200px] px-3 py-2 text-sm focus:outline-none"
      />
    </div>
  )
}
