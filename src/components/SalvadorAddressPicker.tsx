import React, { useState, useEffect, useRef } from 'react';
import { SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import {
  POPULAR_SALVADOR_LOCATIONS,
  lookupSalvadorCep,
  formatCep,
  cleanCep,
  SalvadorAddressRecord,
  getApproximateSalvadorCoordinates,
} from '../utils/salvadorAddresses';
import {
  MapPin,
  Search,
  Check,
  Building2,
  Sparkles,
  Loader2,
  Navigation,
  Compass,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export interface AddressSelectionData {
  cep: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
  fullAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface SalvadorAddressPickerProps {
  initialData?: Partial<AddressSelectionData>;
  onChange: (data: AddressSelectionData) => void;
  title?: string;
  description?: string;
  showPopularShortcuts?: boolean;
  required?: boolean;
}

export const SalvadorAddressPicker: React.FC<SalvadorAddressPickerProps> = ({
  initialData,
  onChange,
  title = 'Endereço em Salvador - BA',
  description = 'Digite o CEP ou selecione o bairro para preenchimento automático oficial.',
  showPopularShortcuts = true,
  required = false,
}) => {
  const [cep, setCep] = useState(initialData?.cep || '');
  const [neighborhood, setNeighborhood] = useState(initialData?.neighborhood || 'Barra');
  const [street, setStreet] = useState(initialData?.street || '');
  const [number, setNumber] = useState(initialData?.number || '');
  const [complement, setComplement] = useState(initialData?.complement || '');
  const [reference, setReference] = useState(initialData?.reference || '');

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepStatus, setCepStatus] = useState<'idle' | 'success' | 'not_found' | 'error'>('idle');
  const [streetSuggestionsOpen, setStreetSuggestionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter street suggestions for active neighborhood or query
  const availableStreets: SalvadorAddressRecord[] = POPULAR_SALVADOR_LOCATIONS.filter(
    (loc) => loc.neighborhood.toLowerCase() === neighborhood.toLowerCase()
  );

  const filteredStreets = availableStreets.filter((loc) =>
    street ? loc.street.toLowerCase().includes(street.toLowerCase()) : true
  );

  // Emit change upstream
  useEffect(() => {
    const coords = getApproximateSalvadorCoordinates(neighborhood);
    const parts = [
      street ? `${street}${number ? `, ${number}` : ''}` : '',
      complement ? `(${complement})` : '',
      neighborhood,
      'Salvador - BA',
      cep ? `CEP ${formatCep(cep)}` : '',
    ].filter(Boolean);

    const fullAddress = parts.join(' - ');

    onChange({
      cep: formatCep(cep),
      neighborhood,
      street,
      number,
      complement,
      reference,
      fullAddress,
      coordinates: coords,
    });
  }, [cep, neighborhood, street, number, complement, reference]);

  // Handle CEP input and auto-lookup
  const handleCepChange = async (val: string) => {
    const formatted = formatCep(val);
    setCep(formatted);

    const digits = cleanCep(val);
    if (digits.length === 8) {
      setIsLoadingCep(true);
      setCepStatus('idle');
      try {
        const res = await lookupSalvadorCep(digits);
        if (res) {
          setCepStatus('success');
          if (res.neighborhood) {
            // Find best matching Salvador neighborhood in our standard list
            const matchNeighborhood = SALVADOR_NEIGHBORHOODS.find(
              (n) => n.toLowerCase() === res.neighborhood.toLowerCase()
            );
            if (matchNeighborhood) {
              setNeighborhood(matchNeighborhood);
            } else {
              setNeighborhood(res.neighborhood);
            }
          }
          if (res.street) {
            setStreet(res.street);
          }
        } else {
          setCepStatus('not_found');
        }
      } catch {
        setCepStatus('error');
      } finally {
        setIsLoadingCep(false);
      }
    } else {
      setCepStatus('idle');
    }
  };

  // Quick pick popular location
  const handleSelectPopularLocation = (loc: SalvadorAddressRecord) => {
    setCep(loc.cep);
    setNeighborhood(loc.neighborhood);
    setStreet(loc.street);
    if (loc.reference) setReference(loc.reference);
    setCepStatus('success');
    setStreetSuggestionsOpen(false);
  };

  return (
    <div className="bg-slate-50/80 rounded-3xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
      {/* Header with Salvador Icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#0B4F8A] text-white flex items-center justify-center shadow-xs shrink-0">
            <MapPin className="w-5 h-5 text-[#FFC72C]" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-black text-slate-900 flex items-center gap-1.5">
              <span>{title}</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#0B4F8A] text-white">
                Oficial SSA
              </span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
          </div>
        </div>
      </div>

      {/* Quick Location Shortcuts */}
      {showPopularShortcuts && (
        <div>
          <span className="text-[11px] font-bold text-slate-600 block mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Sugestões Rápidas de Endereços em Salvador:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {POPULAR_SALVADOR_LOCATIONS.slice(0, 6).map((loc) => (
              <button
                key={`${loc.neighborhood}-${loc.street}`}
                type="button"
                onClick={() => handleSelectPopularLocation(loc)}
                className="px-3 py-1.5 bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-[#0B4F8A] rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0B4F8A] shrink-0 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-[#0B4F8A] rounded">
                  {loc.neighborhood}
                </span>
                <span className="truncate max-w-[140px]">{loc.street}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* CEP Field (Auto-Lookup) */}
        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            CEP (Salvador) {required && <span className="text-rose-500">*</span>}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="40140-130"
              value={cep}
              onChange={(e) => handleCepChange(e.target.value)}
              maxLength={9}
              className={`w-full h-11 px-3.5 pr-10 bg-white border rounded-2xl text-xs font-mono font-bold text-slate-800 placeholder:text-slate-400 outline-none transition-all ${
                cepStatus === 'success'
                  ? 'border-emerald-500 ring-2 ring-emerald-100'
                  : cepStatus === 'not_found'
                  ? 'border-amber-400'
                  : 'border-slate-200 focus:border-[#0B4F8A] focus:ring-2 focus:ring-blue-100'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              {isLoadingCep ? (
                <Loader2 className="w-4 h-4 text-[#0B4F8A] animate-spin" />
              ) : cepStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : cepStatus === 'not_found' ? (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              ) : (
                <Search className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>
          {cepStatus === 'success' && (
            <p className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Localização Salvador identificada!
            </p>
          )}
          {cepStatus === 'not_found' && (
            <p className="text-[10px] text-amber-700 font-semibold mt-1">
              CEP não mapeado. Você pode preencher rua e bairro manualmente abaixo.
            </p>
          )}
        </div>

        {/* Neighborhood Select Field */}
        <div className="sm:col-span-8">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Bairro de Salvador {required && <span className="text-rose-500">*</span>}
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-[#0B4F8A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={neighborhood}
              onChange={(e) => {
                setNeighborhood(e.target.value);
                // Pre-fill first popular street for this neighborhood if empty
                const popular = POPULAR_SALVADOR_LOCATIONS.find(
                  (l) => l.neighborhood.toLowerCase() === e.target.value.toLowerCase()
                );
                if (popular && !street) {
                  setStreet(popular.street);
                  setCep(popular.cep);
                }
              }}
              className="w-full h-11 pl-10 pr-8 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:border-[#0B4F8A] focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
            >
              {SALVADOR_NEIGHBORHOODS.map((b) => (
                <option key={b} value={b}>
                  📍 {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Street Field with Auto-Suggestions */}
        <div className="sm:col-span-8 relative" ref={dropdownRef}>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Logradouro (Avenida, Rua, Praça, Largo) {required && <span className="text-rose-500">*</span>}
          </label>
          <input
            type="text"
            placeholder="Ex: Av. Sete de Setembro, Rua das Laranjeiras..."
            value={street}
            onChange={(e) => {
              setStreet(e.target.value);
              setStreetSuggestionsOpen(true);
            }}
            onFocus={() => setStreetSuggestionsOpen(true)}
            className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:border-[#0B4F8A] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />

          {/* Suggestions popup */}
          {streetSuggestionsOpen && filteredStreets.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-48 overflow-y-auto">
              <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Ruas conhecidas em {neighborhood}:
              </div>
              {filteredStreets.map((s) => (
                <button
                  key={`${s.street}-${s.cep}`}
                  type="button"
                  onClick={() => {
                    setStreet(s.street);
                    setCep(s.cep);
                    if (s.reference) setReference(s.reference);
                    setStreetSuggestionsOpen(false);
                    setCepStatus('success');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-xs text-slate-700 hover:text-[#0B4F8A] font-medium flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
                >
                  <span className="font-bold">{s.street}</span>
                  <span className="text-[10px] font-mono text-slate-400">{s.cep}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Number Field */}
        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Número
          </label>
          <input
            type="text"
            placeholder="Ex: 3250 ou S/N"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:border-[#0B4F8A] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        {/* Complement & Reference */}
        <div className="sm:col-span-6">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Complemento (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ex: Loja 04, Sala 201, Térreo"
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
            className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#0B4F8A] outline-none transition-all"
          />
        </div>

        <div className="sm:col-span-6">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Ponto de Referência Salvador
          </label>
          <input
            type="text"
            placeholder="Ex: Em frente ao Farol, próximo à praia"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#0B4F8A] outline-none transition-all"
          />
        </div>
      </div>

      {/* Address Confirmation Banner */}
      {(street || neighborhood) && (
        <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Navigation className="w-4 h-4 text-[#0B4F8A] shrink-0" />
            <span className="text-slate-600 truncate font-medium">
              <strong className="text-slate-900 font-bold">Endereço formatado:</strong>{' '}
              {street ? `${street}${number ? `, ${number}` : ''}` : 'Salvador'}{' '}
              {complement && `(${complement})`} - {neighborhood}, Salvador - BA{' '}
              {cep && `(CEP ${cep})`}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
            Salvador, BA
          </span>
        </div>
      )}
    </div>
  );
};
