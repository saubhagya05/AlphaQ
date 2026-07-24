import { useState } from 'react'
import { Mic } from 'lucide-react'
import GeminiSparkle from '../components/GeminiSparkle'
import { useApp } from '../context/AppContext'

export default function WritePage() {
  const { focusMode, setFocusMode } = useApp()
  const [text, setText] = useState('')

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Express Yourself in Solitude.
          </h2>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            अपने मन को एकांत में रखें।
          </h2>
        </div>

        {!focusMode && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setFocusMode(true)}
              className="rounded-full border border-[#E61C38]/40 px-5 py-2 text-sm font-medium text-[#E61C38] transition-colors hover:bg-[#E61C38]/10"
            >
              Enter Focus Mode
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-red-900/40 bg-[#121212] p-4 shadow-[0_0_40px_rgba(230,28,56,0.05)]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="मेरे नए Pocket FM कहानी के लिए विचार हैं..."
            className="h-48 w-full resize-none bg-transparent text-base text-white outline-none placeholder:text-gray-600"
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              className="rounded-full p-2 text-gray-500 transition-colors hover:text-[#E61C38]"
              title="Voice input"
            >
              <Mic className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-gray-200 active:scale-[0.98]">
              <GeminiSparkle className="h-4 w-4" />
              Send to AI
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
