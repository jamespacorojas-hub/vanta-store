import React, { useState, useMemo } from 'react';
import { Search, Package, Check, AlertTriangle, Layers, Tag } from 'lucide-react';
import { PRODUCTS } from '../../../data';
import { Product } from '../../../types';

export default function POSInventoryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  const categories = ['TODOS', 'Camisa', 'Camisero', 'Manga Larga', 'Clásico', 'Notch', 'Polera'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'TODOS' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fabrics.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.colors.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex-1 flex flex-col h-full bg-paper text-ink overflow-hidden">
      {/* Header and Filter Toolbar */}
      <div className="p-4 bg-paper-soft border-b border-line flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar por prenda, tela o color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel border border-line text-xs font-mono py-2 pl-9 pr-3 text-ink focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 text-[10.5px] font-mono uppercase tracking-wider border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-accent text-white border-accent font-bold'
                    : 'bg-panel text-muted hover:text-ink border-line'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-muted">
          Mostrando <b className="text-ink">{filteredProducts.length}</b> productos
        </div>
      </div>

      {/* Inventory Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredProducts.map((p) => {
            const isLowStock = p.stock <= 5;
            return (
              <div
                key={p.id}
                className="bg-panel border border-line p-3.5 flex gap-3 hover:border-muted transition-colors"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-20 h-20 object-cover border border-line bg-paper-soft shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-muted uppercase tracking-wider">
                        {p.category}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${
                          isLowStock
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        Stock: {p.stock} unds.
                      </span>
                    </div>

                    <h4 className="font-mono text-xs font-bold text-ink uppercase truncate mt-0.5">
                      {p.name}
                    </h4>

                    <div className="text-[9px] font-mono text-muted mt-1 truncate">
                      Telas: {p.fabrics.join(' • ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line/60 mt-2">
                    <span className="font-mono text-xs font-bold text-accent">
                      S/ {p.price.toFixed(2)}
                    </span>
                    <span className="text-[9px] font-mono text-muted">
                      {p.colors.length} colores disp.
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
