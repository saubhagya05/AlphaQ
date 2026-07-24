import { Mic } from 'lucide-react'

export default function SpeakPage() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 50% 50%, rgba(230,28,56,0.06), rgba(0,0,0,0) 70%)',
        }}
      />
      <p className="relative z-10 max-w-xl text-center text-lg font-light text-gray-300 md:text-xl">
        For optimal AI assistance, keep your spoken story brief and concise.
      </p>
      <Mic
        className="relative z-10 mt-10 h-6 w-6 text-gray-600"
        strokeWidth={1.25}
      />
    </section>
  )
}
