// ==============================================================================
// 📍 HERANÇA DIGITAL DE BAIRRO — RECADOS VIRTUAIS GEOLOCALIZADOS
// Salvador: Memórias, dicas secretas e histórias gravadas na maré de cada local
// ==============================================================================

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Heart, MapPin, Send, MessageSquarePlus, Sparkles } from 'lucide-react';

export const HerancaDigitalModal: React.FC = () => {
  const isOpen = useAppStore((s) => s.isHerancaDigitalOpen);
  const setIsOpen = useAppStore((s) => s.setIsHerancaDigitalOpen);
  const recados = useAppStore((s) => s.recadosDigitais);
  const postRecado = useAppStore((s) => s.postRecadoDigital);
  const likeRecado = useAppStore((s) => s.likeRecadoDigital);
  const currentUser = useAppStore((s) => s.currentUser);

  const [message, setMessage] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('Rio Vermelho');
  const [locationName, setLocationName] = useState<string>('Largo de Santana (Dinha)');
  const [tag, setTag] = useState<string>('Dica Secreta');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    postRecado({
      authorName: currentUser?.name || 'Soteropolitano Anônimo',
      authorAvatar: currentUser?.avatar,
      neighborhood,
      locationName,
      coordinates: { lat: -13.0142, lng: -38.4912 },
      message: message.trim(),
      tag,
    });

    setMessage('');
    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C81]/10 text-[#0F4C81] dark:text-cyan-400 flex items-center justify-center font-black">
              📜
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
                Herança Digital de Salvador
              </h3>
              <p className="text-xs text-slate-500">
                Memórias e recados deixados nas ruas e praias
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Recados virtuais cravados na geografia soteropolitana.
          </p>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E89F3C] to-[#E76F51] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Deixar Recado (+30 🌊)</span>
          </button>
        </div>

        {/* Formulário de Novo Recado */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex flex-col gap-3 animate-in slide-in-from-top-2"
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Bairro
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Rio Vermelho">Rio Vermelho</option>
                  <option value="Barra">Barra</option>
                  <option value="Pelourinho">Pelourinho</option>
                  <option value="Itapuã">Itapuã</option>
                  <option value="Santo Antônio Além do Carmo">Santo Antônio Além do Carmo</option>
                  <option value="Pituba">Pituba</option>
                  <option value="Bonfim">Bonfim</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Ponto de Referência
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Ex: Perto do banco do Farol"
                  className="w-full bg-white dark:bg-slate-800 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Seu Recado para a Cidade
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Conte uma história, dica gastronômica ou segredo desse local..."
                rows={3}
                className="w-full bg-white dark:bg-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#0F4C81] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Cravar na Maré</span>
              </button>
            </div>
          </form>
        )}

        {/* Lista de Recados */}
        <div className="flex flex-col gap-3">
          {recados.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    {rec.authorAvatar ? (
                      <img src={rec.authorAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-600">
                        {rec.authorName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {rec.authorName}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span>
                        {rec.locationName} • <strong>{rec.neighborhood}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {rec.tag}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                "{rec.message}"
              </p>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => likeRecado(rec.id)}
                  className="flex items-center gap-1 text-xs text-rose-500 font-bold hover:opacity-80 active:scale-95 transition-transform"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>{rec.likesCount} curtiram</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
