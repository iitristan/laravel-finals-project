'use client'

import { Game } from '@/types/game'
import { GameInput } from '@/types/gameInput'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Plus, Loader2 } from 'lucide-react'

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
            className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Game</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search for a game..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ease-in-out"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {loading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              )}

              <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {searchResults.map((game) => (
                    <motion.li
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <span className="font-medium text-gray-900 dark:text-white">{game.name}</span>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Price"
                            value={gameInputs[game.id]?.price || ''}
                            onChange={(e) => onInputChange(game.id, 'price', e.target.value)}
                            className="border rounded px-3 py-2 w-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                          />
                          <input
                            type="number"
                            placeholder="Quantity"
                            value={gameInputs[game.id]?.quantity || ''}
                            onChange={(e) => onInputChange(game.id, 'quantity', e.target.value)}
                            className="border rounded px-3 py-2 w-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => onAddGame(game)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add</span>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

