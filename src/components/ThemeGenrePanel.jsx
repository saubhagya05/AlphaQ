import { useState } from 'react'
import GenreRadarChart, { THEME_RADAR_DATA } from './GenreRadarChart'
import GenreTag from './GenreTag'

const GENRE_TAGS = [
  { label: 'Science-Fiction', variant: 'scifi' },
  { label: 'Noir', variant: 'noir' },
  { label: 'Thriller', variant: 'thriller' },
]

const THEME_TAGS = [
  { label: 'Isolation', variant: 'scifi' },
  { label: 'Revenge', variant: 'thriller' },
  { label: 'Betrayal', variant: 'noir' },
]

export default function ThemeGenrePanel() {
  const [activeTab, setActiveTab] = useState('genre')

  return (
    <div className="flex w-full flex-col pr-[25px]">
      {/* Tabs / Buttons on top */}
      <div className="mt-[60px] ml-[170px] mb-6 flex items-center gap-20">
        <button
          onClick={() => setActiveTab('genre')}
          className={`pb-2 text-4xl sm:text-5xl md:text-6xl transition-all genre-display-heading ${
            activeTab === 'genre'
              ? 'border-b-[3px] border-[#E61C38] opacity-100'
              : 'border-b-[3px] border-transparent opacity-40 hover:opacity-70'
          }`}
        >
          <span className="ideaboard-title-board text-[1.15em] text-[#E61C38]">
            G
          </span>
          <span>enre</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`pb-2 text-4xl sm:text-5xl md:text-6xl transition-all genre-display-heading ${
            activeTab === 'theme'
              ? 'border-b-[3px] border-[#E61C38] opacity-100'
              : 'border-b-[3px] border-transparent opacity-40 hover:opacity-70'
          }`}
        >
          <span className="ideaboard-title-board text-[1.15em] text-[#E61C38]">
            t
          </span>
          <span>heme</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex shrink-0 flex-col items-start gap-6 pt-10">
          {activeTab === 'genre' ? (
            <div className="ml-[170px] flex flex-wrap gap-3.5">
              {GENRE_TAGS.map((tag) => (
                <GenreTag key={tag.label} label={tag.label} variant={tag.variant} />
              ))}
            </div>
          ) : (
            <div className="ml-[170px] flex flex-wrap gap-3.5">
              {THEME_TAGS.map((tag) => (
                <GenreTag key={tag.label} label={tag.label} variant={tag.variant} />
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto w-full max-w-[780px] -translate-x-[30px] shrink-0 lg:w-[min(780px,68%)] -mt-[40px]">
          {activeTab === 'genre' ? (
            <GenreRadarChart glowId="genre-radar-neon-glow" />
          ) : (
            <GenreRadarChart data={THEME_RADAR_DATA} glowId="theme-radar-neon-glow" />
          )}
        </div>
      </div>
    </div>
  )
}
