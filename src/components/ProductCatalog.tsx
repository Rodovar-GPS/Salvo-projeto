// ==============================================================================
// 🛍️ PRODUCT CATALOG — CATÁLOGO DE PRODUTOS & PREÇOS ATUALIZADOS DA LOJA
// ==============================================================================

import React from 'react';
import { ProductItem } from '../types';
import { ShoppingBag, Tag, MessageCircle } from 'lucide-react';

interface ProductCatalogProps {
  products: ProductItem[];
  storeName: string;
  onAskAboutProduct?: (product: ProductItem) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  storeName,
  onAskAboutProduct,
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
        <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">
          Nenhum produto cadastrado no catálogo digital no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-[#0F4C81]" />
          <span>Catálogo & Cardápio</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">{products.length} itens</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex gap-3 shadow-xs"
          >
            {item.image && (
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {item.name}
                  </h4>
                  {item.isPopular && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Top
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-black text-[#0F4C81] dark:text-cyan-400 font-display">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </div>

                {onAskAboutProduct && (
                  <button
                    onClick={() => onAskAboutProduct(item)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#0F4C81] hover:text-white transition-colors"
                    title="Perguntar sobre este item no chat"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
