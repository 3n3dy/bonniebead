import { useState } from 'react'
import { useAdmin } from './AdminContext'
import CategoryForm from './CategoryForm'
import ProductForm from './ProductForm'
import { Btn, ConfirmModal } from './AdminUI'

export default function AdminPanel() {
  const {
    logout, catalog,
    addCategory, updateCategory, deleteCategory, moveCategoryUp, moveCategoryDown,
    addProduct, updateProduct, deleteProduct, moveProductUp, moveProductDown,
    resetToDefaults,
  } = useAdmin()

  const [activeCatId, setActiveCatId]   = useState(null)
  const [showAddCat, setShowAddCat]     = useState(false)
  const [editCat, setEditCat]           = useState(null)
  const [deleteCat, setDeleteCat]       = useState(null)
  const [showAddProd, setShowAddProd]   = useState(false)
  const [editProd, setEditProd]         = useState(null)
  const [deleteProd, setDeleteProd]     = useState(null)
  const [toast, setToast]               = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const activeCategory = catalog.find(c => c.id === activeCatId)

  return (
    <div className="min-h-screen bg-stone-950 text-cream-200 flex flex-col">

      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <div className="bg-stone-900 border-b border-stone-800 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveCatId(null)}
            className="font-display text-xl tracking-widest2 text-cream-100 hover:opacity-70 transition-opacity"
          >
            BONNIEBEAD
          </button>
          <span className="text-stone-600 text-xs">·</span>
          <span className="text-xs tracking-widest uppercase text-stone-500">Адмін-панель</span>
          {activeCatId && (
            <>
              <span className="text-stone-600 text-xs">·</span>
              <button
                onClick={() => setActiveCatId(null)}
                className="text-xs tracking-widest uppercase text-stone-500 hover:text-cream-100 transition-colors"
              >
                ← Назад
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Btn variant="ghost" onClick={() => { if (confirm('Скинути до дефолтних даних?')) { resetToDefaults(); setActiveCatId(null); showToast('Дані скинуто') } }}>
            Скинути
          </Btn>
          <Btn variant="ghost" onClick={logout}>Вийти</Btn>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">

        {!activeCatId ? (
          /* ── СПИСОК КАТЕГОРІЙ ─────────────────────────────────────── */
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl font-medium text-cream-100">Категорії</h1>
                <p className="text-xs text-stone-500 mt-1">{catalog.length} категорій</p>
              </div>
              <Btn onClick={() => setShowAddCat(true)}>+ Категорія</Btn>
            </div>

            <div className="space-y-1">
              {catalog.map((cat, i) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-4 bg-stone-900 border border-stone-800 hover:border-stone-700 px-5 py-4 group transition-colors"
                >
                  {/* Order controls */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveCategoryUp(cat.id)}
                      disabled={i === 0}
                      className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-cream-100 disabled:opacity-20 transition-colors text-xs"
                    >▲</button>
                    <button
                      onClick={() => moveCategoryDown(cat.id)}
                      disabled={i === catalog.length - 1}
                      className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-cream-100 disabled:opacity-20 transition-colors text-xs"
                    >▼</button>
                  </div>

                  {/* Index */}
                  <span className="index-label w-5 text-center">{String(i + 1).padStart(2, '0')}</span>

                  {/* Info */}
                  <button
                    className="flex-1 text-left"
                    onClick={() => setActiveCatId(cat.id)}
                  >
                    <p className="text-sm font-medium text-cream-100 group-hover:text-white">{cat.name}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{cat.nameLatin} · {cat.products.length} товарів</p>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setActiveCatId(cat.id)}
                      className="text-xs text-stone-400 hover:text-cream-100 tracking-wider transition-colors"
                    >
                      Товари →
                    </button>
                    <button
                      onClick={() => setEditCat(cat)}
                      className="text-xs text-stone-400 hover:text-cream-100 tracking-wider transition-colors"
                    >
                      Редаг.
                    </button>
                    <button
                      onClick={() => setDeleteCat(cat)}
                      className="text-xs text-red-700 hover:text-red-400 tracking-wider transition-colors"
                    >
                      Видал.
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ── ТОВАРИ КАТЕГОРІЇ ─────────────────────────────────────── */
          <>
            <div className="flex items-start justify-between mb-8 gap-4">
              <div>
                <h1 className="font-display text-3xl font-medium text-cream-100">{activeCategory?.name}</h1>
                <p className="text-xs text-stone-500 mt-1">{activeCategory?.products.length} товарів</p>
              </div>
              <Btn onClick={() => setShowAddProd(true)}>+ Товар</Btn>
            </div>

            {activeCategory?.products.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-stone-800">
                <p className="text-stone-600 text-sm mb-4">Товарів ще немає</p>
                <Btn onClick={() => setShowAddProd(true)}>Додати перший</Btn>
              </div>
            ) : (
              <div className="space-y-1">
                {activeCategory.products.map((prod, i) => (
                  <div
                    key={prod.id}
                    className="flex items-center gap-4 bg-stone-900 border border-stone-800 hover:border-stone-700 px-5 py-4 group transition-colors"
                  >
                    {/* Order */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveProductUp(activeCatId, prod.id)}
                        disabled={i === 0}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-cream-100 disabled:opacity-20 text-xs transition-colors"
                      >▲</button>
                      <button
                        onClick={() => moveProductDown(activeCatId, prod.id)}
                        disabled={i === activeCategory.products.length - 1}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-cream-100 disabled:opacity-20 text-xs transition-colors"
                      >▼</button>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-stone-800 flex-shrink-0 overflow-hidden">
                      {prod.image
                        ? <img src={prod.image} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs">фото</div>
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cream-100 truncate">{prod.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5 truncate">{prod.material}{prod.price ? ` · ${prod.price}` : ''}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditProd(prod)}
                        className="text-xs text-stone-400 hover:text-cream-100 tracking-wider transition-colors"
                      >
                        Редаг.
                      </button>
                      <button
                        onClick={() => setDeleteProd(prod)}
                        className="text-xs text-red-700 hover:text-red-400 tracking-wider transition-colors"
                      >
                        Видал.
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-stone-800 border border-stone-700 text-cream-100 text-xs tracking-wide px-5 py-3 shadow-xl animate-fade-up">
          {toast}
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {showAddCat && (
        <CategoryForm
          onSave={(data) => { addCategory(data); showToast('Категорію додано') }}
          onClose={() => setShowAddCat(false)}
        />
      )}
      {editCat && (
        <CategoryForm
          initial={editCat}
          onSave={(data) => { updateCategory(editCat.id, data); showToast('Збережено') }}
          onClose={() => setEditCat(null)}
        />
      )}
      {deleteCat && (
        <ConfirmModal
          text={`Видалити категорію "${deleteCat.name}" та всі ${deleteCat.products.length} товарів?`}
          onConfirm={() => { deleteCategory(deleteCat.id); setDeleteCat(null); if (activeCatId === deleteCat.id) setActiveCatId(null); showToast('Видалено') }}
          onClose={() => setDeleteCat(null)}
        />
      )}
      {showAddProd && (
        <ProductForm
          onSave={(data) => { addProduct(activeCatId, data); showToast('Товар додано') }}
          onClose={() => setShowAddProd(false)}
        />
      )}
      {editProd && (
        <ProductForm
          initial={editProd}
          onSave={(data) => { updateProduct(activeCatId, editProd.id, data); showToast('Збережено') }}
          onClose={() => setEditProd(null)}
        />
      )}
      {deleteProd && (
        <ConfirmModal
          text={`Видалити товар "${deleteProd.name}"?`}
          onConfirm={() => { deleteProduct(activeCatId, deleteProd.id); setDeleteProd(null); showToast('Видалено') }}
          onClose={() => setDeleteProd(null)}
        />
      )}
    </div>
  )
}
