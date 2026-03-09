const CATEGORIES = [
  { id: 'CARRI', label: 'Carri', icon: '🎠' },
  { id: 'GRUPPI', label: 'Gruppi', icon: '🎭' },
  { id: 'TENDINE', label: 'Tendine', icon: '🎪' },
  { id: 'GUGGEN', label: 'Guggen', icon: '🎺' }
]

function CategoryTabs({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium
            transition-all duration-200 text-lg
            ${activeCategory === category.id
              ? 'bg-carnival-yellow text-carnival-red-dark scale-105 shadow-lg'
              : 'bg-carnival-red/50 text-carnival-yellow/80 hover:bg-carnival-red hover:text-carnival-yellow border border-carnival-yellow/20'
            }
          `}
        >
          <span className="text-xl">{category.icon}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  )
}

export { CATEGORIES }
export default CategoryTabs
