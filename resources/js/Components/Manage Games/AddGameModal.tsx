'use client'

import { Game } from '@/types/game'
import { GameInput } from '@/types/gameInput'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Plus, Loader2, ImageOff } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  loading: boolean
  searchResults: Game[]
  gameInputs: Record<number, GameInput>
  onInputChange: (gameId: number, field: 'price' | 'quantity', value: string) => void
  onAddGame: (game: Game) => void
}

export default function AddGameModal({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  loading,
  searchResults,
  gameInputs,
  onInputChange,
  onAddGame,
}: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-gray-900 rounded-lg shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Add Game</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 border-b border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search for a game..."
                  className="w-full bg-gray-800 text-white px-4 py-3 pl-10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((game) => (
                    <div
                      key={game.id}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-6 hover:bg-gray-800/70 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/fallback-game-image.jpg'
                          }}
                        />
                        <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={gameInputs[game.id]?.price || ''}
                        onChange={(e) => onInputChange(game.id, 'price', e.target.value)}
                        className="w-[120px] bg-gray-700/50 text-white px-3 py-2 rounded-md 
                                 focus:ring-2 focus:ring-indigo-500 focus:outline-none
                                 border border-gray-600 hover:border-gray-500 transition-colors"
                        placeholder="Price ($)"
                      />
                      <input
                        type="number"
                        min="0"
                        value={gameInputs[game.id]?.quantity || ''}
                        onChange={(e) => onInputChange(game.id, 'quantity', e.target.value)}
                        className="w-[120px] bg-gray-700/50 text-white px-3 py-2 rounded-md 
                                 focus:ring-2 focus:ring-indigo-500 focus:outline-none
                                 border border-gray-600 hover:border-gray-500 transition-colors"
                        placeholder="Quantity"
                      />
                      <button
                        onClick={() => onAddGame(game)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white h-[38px] px-6 rounded-md 
                                 transition-all duration-300 flex items-center gap-2
                                 hover:shadow-lg active:scale-95"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
