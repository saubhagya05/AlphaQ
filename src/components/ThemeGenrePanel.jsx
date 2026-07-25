import { ChevronDown } from 'lucide-react'
import GenreRadarChart, { THEME_RADAR_DATA } from './GenreRadarChart'
import GenreTag from './GenreTag'

const GENRE_TAGS = [
  { label: 'Science-Fiction', variant: 'scifi' },
  { label: 'Noir', variant: 'noir' },
  { label: 'Thriller', variant: 'thriller' },
]

export default function ThemeGenrePanel() {
  const scrollToTheme = () => {
    document
      .getElementById('theme-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex w-full flex-col pr-[25px]">
      {/* ——— Genre section (unchanged layout) ——— */}
      <section
        id="genre-section"
        className="flex min-h-[calc(100vh-14rem)] w-full flex-col justify-start gap-6"
      >
        <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex shrink-0 flex-col items-start gap-6">
            <h2 className="genre-display-heading mt-[175px] ml-[170px] text-6xl text-white sm:text-7xl md:text-8xl">
              Genre
            </h2>

            <div className="ml-[170px] flex flex-wrap gap-3.5">
              {GENRE_TAGS.map((tag) => (
                <GenreTag
                  key={tag.label}
                  label={tag.label}
                  variant={tag.variant}
                />
              ))}
            </div>
          </div>

          <div className="ml-auto w-full max-w-[780px] -translate-x-[30px] shrink-0 lg:w-[min(780px,68%)]">
            <GenreRadarChart glowId="genre-radar-neon-glow" />
          </div>
        </div>

        {/* Scroll cue → Theme */}
        <div className="mt-auto flex -translate-y-[150px] justify-center pb-4 pt-8">
          <button
            type="button"
            onClick={scrollToTheme}
            className="group flex flex-col items-center gap-1 text-white/40 transition-colors hover:text-[#E61C38]"
            aria-label="Scroll to Theme"
          >
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase">
              Theme
            </span>
            <ChevronDown
              className="h-6 w-6 animate-bounce"
              strokeWidth={1.75}
            />
          </button>
        </div>
      </section>

      {/* ——— Theme section ——— */}
      <section
        id="theme-section"
        className="flex min-h-[calc(100vh-14rem)] w-full scroll-mt-6 flex-col justify-start gap-6 pt-10"
      >
        <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex shrink-0 flex-col items-start gap-6">
            <h2 className="genre-display-heading mt-[175px] ml-[170px] text-6xl text-white sm:text-7xl md:text-8xl">
              Theme
            </h2>
          </div>

          <div className="ml-auto w-full max-w-[780px] -translate-x-[30px] shrink-0 lg:w-[min(780px,68%)]">
            <GenreRadarChart
              data={THEME_RADAR_DATA}
              glowId="theme-radar-neon-glow"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
