'use client'

import { useMemo, useState } from 'react'
import { menuCategories, restaurant } from '@/app/menu-data'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Page() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showVegOnly, setShowVegOnly] = useState(false)
  const [sortBy, setSortBy] = useState('popular')

  const allItems = useMemo(
    () =>
      menuCategories.flatMap((section) =>
        section.items.map((item) => ({
          ...item,
          category: section.name,
        })),
      ),
    [],
  )

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const items = allItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory
      const matchesVeg = !showVegOnly || item.isVeg
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesVeg && matchesSearch
    })

    return items.sort((first, second) => {
      if (sortBy === 'price-low') {
        return first.price - second.price
      }

      if (sortBy === 'price-high') {
        return second.price - first.price
      }

      if (sortBy === 'time') {
        return first.prepTime - second.prepTime
      }

      return Number(second.isBestSeller) - Number(first.isBestSeller)
    })
  }, [activeCategory, allItems, searchTerm, showVegOnly, sortBy])

  const categories = ['All', ...menuCategories.map((section) => section.name)]
  const bestSellers = allItems.filter((item) => item.isBestSeller).slice(0, 4)
  const totalMenuItems = allItems.length

  return (
    <main className="page-shell">
      <div className="app-shell">
        <header className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Digital menu</p>
            <h1>{restaurant.name}</h1>
            <p className="hero-description">{restaurant.description}</p>

            <div className="hero-stats">
              <div>
                <span>Rating</span>
                <strong>{restaurant.rating}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{restaurant.deliveryTime}</strong>
              </div>
              <div>
                <span>Cuisine</span>
                <strong>{restaurant.cuisine}</strong>
              </div>
            </div>
          </div>

          <aside className="hero-summary" aria-label="Restaurant summary">
            <div className="summary-card">
              <span className="summary-label">Open today</span>
              <strong>{restaurant.hours}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Menu items</span>
              <strong>{totalMenuItems} dishes</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Top picks</span>
              <strong>{bestSellers.length} best sellers</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Location</span>
              <strong>{restaurant.location}</strong>
            </div>
          </aside>
        </header>

        <section className="controls-panel">
          <label className="search-field">
            <span className="sr-only">Search dishes</span>
            <input
              type="search"
              placeholder="Search dishes, categories, or keywords"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="veg-toggle">
            <input
              type="checkbox"
              checked={showVegOnly}
              onChange={(event) => setShowVegOnly(event.target.checked)}
            />
            <span>Veg only</span>
          </label>

          <label className="sort-select">
            <span className="sr-only">Sort dishes</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="popular">Sort: Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="time">Fastest first</option>
            </select>
          </label>
        </section>

        <nav className="category-bar" aria-label="Menu categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={category === activeCategory ? 'active' : ''}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>

        <section className="content-grid">
          <section className="menu-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Browse menu</p>
                <h2>{activeCategory === 'All' ? 'All dishes' : activeCategory}</h2>
              </div>
              <span>{filteredItems.length} items</span>
            </div>

            <div className="menu-grid">
              {filteredItems.map((item) => (
                <article key={item.id} className="dish-card">
                  <div className="dish-topline">
                    <span className={`dish-type ${item.isVeg ? 'veg' : 'non-veg'}`}>
                      {item.isVeg ? 'Veg' : 'Non-veg'}
                    </span>
                    {item.isBestSeller ? (
                      <span className="dish-badge">Best seller</span>
                    ) : null}
                  </div>

                  <div className="dish-content">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>

                    <div className="dish-meta">
                      <span>{formatCurrency(item.price)}</span>
                      <span>{item.prepTime} mins</span>
                      <span>{item.spiceLevel}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <div className="empty-state">
                <h3>No dishes match this filter</h3>
                <p>Try another category or remove the veg/search filter.</p>
              </div>
            ) : null}
          </section>

          <aside className="sidebar-panel">
            <div className="sidebar-card">
              <p className="eyebrow">Best sellers</p>
              <h2>Quick picks</h2>
              <ul className="mini-list">
                {bestSellers.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.category}</span>
                    </div>
                    <span>{formatCurrency(item.price)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-card">
              <p className="eyebrow">Categories</p>
              <h2>Menu sections</h2>
              <ul className="section-list">
                {menuCategories.map((section) => (
                  <li key={section.name}>
                    <div>
                      <strong>{section.name}</strong>
                      <p>{section.description}</p>
                    </div>
                    <span>{section.items.length}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
