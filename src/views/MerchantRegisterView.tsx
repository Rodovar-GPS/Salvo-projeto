import React, { useState, useMemo } from 'react';
import { BonfimRibbon } from '../components/BonfimRibbon';
import { ClearableInput, ClearableTextarea } from '../components/ClearableInput';
import { SalvadorAddressPicker, AddressSelectionData } from '../components/SalvadorAddressPicker';
import { Store, StoreCategory, SalvadorNeighborhood, OperatingHours } from '../types';
import { SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import {
  parseGoogleMapsUrlOrGps,
  calculateSalvadorMapPercent,
  getSalvadorNeighborhoodLocation,
  ParsedGpsLocation,
} from '../utils/salvadorGeoDatabase';
import {
  Store as StoreIcon,
  MapPin,
  Clock,
  Phone,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Tag,
  Flame,
  Building2,
  FileCheck2,
  Instagram,
  Upload,
  Percent,
  Check,
  Zap,
  ExternalLink,
  LocateFixed,
  Navigation,
  Compass,
} from 'lucide-react';

interface MerchantRegisterViewProps {
  onRegisterStore: (newStore: Partial<Store>) => void;
  onBack: () => void;
}

interface CategoryOption {
  name: StoreCategory;
  label: string;
  icon: string;
  badge: string;
  defaultImage: string;
  description: string;
}

export const BRAZILIAN_CATEGORIES: CategoryOption[] = [
  {
    name: 'Gastronomia & Açaí',
    label: 'Gastronomia & Açaí',
    icon: '🍨',
    badge: 'Mais Popular',
    defaultImage:
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
    description: 'Açaí, tapiocas, moquecas, acarajé, lanches e restaurantes.',
  },
  {
    name: 'Moda & Praia',
    label: 'Moda Praia & Roupas',
    icon: '🩱',
    badge: 'Alta Procura',
    defaultImage:
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80',
    description: 'Biquínis, moda praia, vestidos, sapatos e acessórios de verão.',
  },
  {
    name: 'Artesanato Baiano',
    label: 'Artesanato & Lembranças',
    icon: '🏺',
    badge: 'Cultura SSA',
    defaultImage:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    description: 'Fitas do Bonfim, berimbaus, cerâmica, quadros e souvenirs.',
  },
  {
    name: 'Beleza & Barbearia',
    label: 'Barbearia & Salão de Beleza',
    icon: '💈',
    badge: 'Essencial',
    defaultImage:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    description: 'Corte de cabelo, barba, manicure, estética e spa urbano.',
  },
  {
    name: 'Mercadinhos & Empórios',
    label: 'Mercadinhos & Empórios',
    icon: '🥥',
    badge: 'Bairro',
    defaultImage:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Hortifruti, temperos baianos, conveniências e empórios locais.',
  },
  {
    name: 'Esportes & Aventura',
    label: 'Esportes, Surf & Náutica',
    icon: '🏄‍♂️',
    badge: 'Praia & Orla',
    defaultImage:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
    description: 'Aulas de surf, SUP, bike, academias e suplementos.',
  },
  {
    name: 'Saúde & Bem-Estar',
    label: 'Saúde, Farmácia & Bem-Estar',
    icon: '🌿',
    badge: 'Saúde',
    defaultImage:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'Farmácias, produtos naturais, fitoterápicos e consultórios.',
  },
  {
    name: 'Serviços & Reparos',
    label: 'Serviços Gerais & Oficinas',
    icon: '🔧',
    badge: 'Serviços',
    defaultImage:
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80',
    description: 'Chaveiros, elétrica, hidráulica, oficinas mecânicas e informática.',
  },
];

export const MerchantRegisterView: React.FC<MerchantRegisterViewProps> = ({
  onRegisterStore,
  onBack,
}) => {
  // Form State
  const [storeName, setStoreName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory>('Gastronomia & Açaí');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState<SalvadorNeighborhood>('Barra');
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [initialOfferTitle, setInitialOfferTitle] = useState('Combo Especial de Inauguração');
  const [initialOfferDiscount, setInitialOfferDiscount] = useState('20% OFF');

  // GPS / Google Maps Link State
  const [mapLink, setMapLink] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsDetectedMessage, setGpsDetectedMessage] = useState<string | null>(null);

  // Active Image Selection
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedLogoUrl, setSelectedLogoUrl] = useState(
    BRAZILIAN_CATEGORIES[0].defaultImage
  );

  // Operating Hours State
  const [hours, setHours] = useState<OperatingHours[]>([
    { day: 'Segunda a Sexta', open: '08:00', close: '20:00' },
    { day: 'Sábado', open: '09:00', close: '18:00' },
    { day: 'Domingo', open: '09:00', close: '14:00', isClosed: false },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Live parsed location from Google Maps Link / GPS input
  const parsedGpsResult: ParsedGpsLocation = useMemo(() => {
    return parseGoogleMapsUrlOrGps(mapLink, neighborhood);
  }, [mapLink, neighborhood]);

  // Handle GPS location capture from mobile / browser
  const handleCaptureLiveGps = () => {
    if (!navigator.geolocation) {
      setGpsDetectedMessage('⚠️ Geolocalização não suportada no seu navegador.');
      return;
    }
    setIsDetectingGps(true);
    setGpsDetectedMessage('📡 Obtendo sinal GPS do seu dispositivo...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMapLink(`https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`);
        setGpsDetectedMessage(`✅ GPS detectado com sucesso: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        setTimeout(() => setGpsDetectedMessage(null), 6000);
      },
      () => {
        setIsDetectingGps(false);
        setGpsDetectedMessage('⚠️ Não foi possível obter o sinal GPS. Digite ou cole o link do Google Maps da sua loja.');
        setTimeout(() => setGpsDetectedMessage(null), 6000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle Category Change & update default image
  const handleSelectCategory = (cat: CategoryOption) => {
    setSelectedCategory(cat.name);
    if (!customImageUrl) {
      setSelectedLogoUrl(cat.defaultImage);
    }
  };

  // Quick CEP auto-fill helper
  const handleCepChange = (val: string) => {
    const numeric = val.replace(/\D/g, '').slice(0, 8);
    let formatted = numeric;
    if (numeric.length > 5) {
      formatted = `${numeric.slice(0, 5)}-${numeric.slice(5)}`;
    }
    setCep(formatted);

    // Auto-fill neighborhood for common Salvador CEPs
    if (numeric.startsWith('40140') || numeric.startsWith('40130')) {
      setNeighborhood('Barra');
      if (!address) setAddress('Av. Oceânica, Barra, Salvador - BA');
    } else if (numeric.startsWith('41940') || numeric.startsWith('41950')) {
      setNeighborhood('Rio Vermelho');
      if (!address) setAddress('Rua da Paciência, Rio Vermelho, Salvador - BA');
    } else if (numeric.startsWith('41810') || numeric.startsWith('41830')) {
      setNeighborhood('Pituba');
      if (!address) setAddress('Av. Manoel Dias da Silva, Pituba, Salvador - BA');
    } else if (numeric.startsWith('40026') || numeric.startsWith('40020')) {
      setNeighborhood('Pelourinho / Centro Histórico');
      if (!address) setAddress('Largo do Pelourinho, Salvador - BA');
    }
  };

  // Phone mask formatting
  const handlePhoneMask = (val: string, setter: (v: string) => void) => {
    const num = val.replace(/\D/g, '').slice(0, 11);
    if (num.length <= 2) {
      setter(num ? `(${num}` : '');
    } else if (num.length <= 6) {
      setter(`(${num.slice(0, 2)}) ${num.slice(2)}`);
    } else if (num.length <= 10) {
      setter(`(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`);
    } else {
      setter(`(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7, 11)}`);
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) {
      setErrorMessage('Por favor, informe o nome comercial da sua loja.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Por favor, informe o endereço da sua loja em Salvador.');
      return;
    }
    setErrorMessage('');

    const finalImage = customImageUrl.trim() || selectedLogoUrl;

    // Calcula coordenadas precisas com base no Link do Google Maps / GPS ou no Bairro Oficial
    const lat = parsedGpsResult.lat;
    const lng = parsedGpsResult.lng;
    const { mapX, mapY } = calculateSalvadorMapPercent(lat, lng);

    const newStoreData: Partial<Store> = {
      name: storeName.trim(),
      slug: storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: selectedCategory,
      description:
        description.trim() ||
        `Loja de ${selectedCategory} em ${neighborhood}, Salvador - BA. Atendimento no balcão e pelo chat do SALVÔ!`,
      logo: finalImage,
      coverImage: finalImage,
      galleryImages: [finalImage],
      address: address.trim(),
      neighborhood,
      mapLink: mapLink.trim() || undefined,
      googleMapsUrl: parsedGpsResult.googleMapsUrl,
      coordinates: {
        lat,
        lng,
        mapX,
        mapY,
      },
      phone: phone || '(71) 3300-0000',
      whatsapp: whatsapp ? whatsapp.replace(/\D/g, '') : '5571999998888',
      instagram: instagram ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : undefined,
      isOpenNow: true,
      operatingHours: hours,
      rating: 5.0,
      reviewCount: 1,
      offers: initialOfferTitle
        ? [
            {
              id: `off-${Date.now()}`,
              storeId: '',
              title: initialOfferTitle.trim(),
              discountBadge: initialOfferDiscount.trim() || 'OFERTA',
              priceText: initialOfferDiscount.trim(),
              description: 'Oferta exclusiva de boas-vindas do comércio no SALVÔ.',
              expiresAt: '2026-12-31',
              category: selectedCategory,
              isFeatured: true,
              status: 'ACTIVE',
            },
          ]
        : [],
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userId: 'user-guia-official',
          userName: 'Equipe SALVÔ',
          rating: 5,
          comment: 'Seja muito bem-vindo ao ecossistema do comércio de Salvador!',
          date: 'Hoje',
        },
      ],
      subscriptionStatus: 'active',
      subscriptionPlan: {
        name: 'Plano Lojista Salvador (R$ 12/mês)',
        priceMonthly: 12.0,
        nextBillingDate: '2026-09-24',
        startedAt: '2026-08-24',
      },
      approvalStatus: 'approved',
    };

    onRegisterStore(newStoreData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <BonfimRibbon height="h-2" showText={true} />

        <header className="max-w-3xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/salvo-logo.png"
              alt="SALVÔ"
              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
              }}
            />
            <div>
              <span className="font-heading font-black text-sm text-[#0B4F8A] block leading-tight">
                SALVÔ
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Guia Oficial do Comércio Local
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-50 text-[#2E9E5B] border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <span className="px-3 py-1 bg-[#FFC72C] text-[#0B4F8A] rounded-full text-xs font-black uppercase tracking-wider mb-2 inline-block shadow-2xs">
              ⭐ Loja Oficialmente Ativa
            </span>

            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mb-2">
              Parabéns! Sua Loja Está no Ar
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              O estabelecimento <strong>{storeName}</strong> ({selectedCategory}) em{' '}
              <strong>{neighborhood}</strong> foi cadastrado e publicado com sucesso no mapa e
              na listagem de Salvador!
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 mb-6 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Status de Visibilidade:</span>
                <span className="font-black text-[#2E9E5B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2E9E5B] animate-pulse"></span>
                  Publicada & Ativa
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Plano Oficial:</span>
                <span className="font-black text-[#0B4F8A]">R$ 12,00 / mês (Sem comissão)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Oferta de Boas-Vindas:</span>
                <span className="font-black text-[#E8552B] bg-rose-50 px-2 py-0.5 rounded-md">
                  {initialOfferTitle} ({initialOfferDiscount})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Canal de Atendimento:</span>
                <span className="font-black text-slate-800">Chat Direto + WhatsApp</span>
              </div>
            </div>

            <button
              onClick={onBack}
              className="w-full h-13 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <StoreIcon className="w-4 h-4" />
              <span>Acessar Painel do Lojista & Ver Minha Loja</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const activeCategoryObj =
    BRAZILIAN_CATEGORIES.find((c) => c.name === selectedCategory) || BRAZILIAN_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <BonfimRibbon height="h-1.5" showText={true} />

      {/* Header */}
      <header className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0B4F8A] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Mapa</span>
        </button>

        <div className="flex items-center gap-2.5">
          <img
            src="/salvo-logo.png"
            alt="SALVÔ"
            className="w-9 h-9 rounded-2xl object-cover border border-slate-100"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
            }}
          />
          <div>
            <span className="font-heading font-black text-sm text-[#0B4F8A] block leading-tight">
              SALVÔ
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Cadastro de Comércio
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-200/90">
          {/* Top Banner Plan Info */}
          <div className="bg-gradient-to-r from-[#0B4F8A] via-[#105a9c] to-[#0B4F8A] rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] rounded-md text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  Portal do Lojista Salvador
                </span>
                <span className="text-xs font-bold text-sky-200">100% Brasileiro & Sem Taxas</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                Cadastre Sua Loja no SALVÔ
              </h1>
              <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
                Divulgue seu comércio, receba pagamentos via Pix direto na sua conta e atenda
                clientes de Salvador com <strong>0% de comissão</strong> sobre suas vendas.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20 text-center shrink-0 w-full sm:w-auto relative z-10">
              <span className="text-[10px] uppercase font-black tracking-wider text-sky-200 block">
                Valor Fixo Mensal
              </span>
              <p className="text-2xl font-heading font-black text-[#FFC72C] leading-tight mt-0.5">
                R$ 12<span className="text-sm font-normal text-white">,00/mês</span>
              </p>
              <span className="text-[10px] text-emerald-300 font-black uppercase mt-1 block">
                ✓ Publicação Imediata
              </span>
            </div>
          </div>

          <form onSubmit={handleComplete} className="space-y-8">
            {/* =========================================================
                SEÇÃO 1: CATEGORIA COM IMAGENS REAIS
            ========================================================= */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F8A] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h2 className="font-heading font-black text-base text-slate-900 leading-tight">
                      Escolha a Categoria do seu Negócio
                    </h2>
                    <p className="text-xs text-slate-500">
                      Selecione a categoria que melhor representa seus produtos ou serviços em
                      Salvador:
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Brazilian Categories with Photos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BRAZILIAN_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <div
                      key={cat.name}
                      onClick={() => handleSelectCategory(cat)}
                      className={`group relative rounded-2xl overflow-hidden border-2 p-2.5 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0B4F8A] bg-blue-50/70 shadow-md ring-2 ring-[#0B4F8A]/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Category Photo with Overlay */}
                      <div className="relative h-20 rounded-xl overflow-hidden mb-2">
                        <img
                          src={cat.defaultImage}
                          alt={cat.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute bottom-1.5 left-2 text-xl leading-none">
                          {cat.icon}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0B4F8A] text-white rounded-full flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-heading font-bold text-xs text-slate-900 truncate">
                            {cat.label}
                          </h3>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =========================================================
                SEÇÃO 2: DADOS DO ESTABELECIMENTO
            ========================================================= */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F8A] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h2 className="font-heading font-black text-base text-slate-900 leading-tight">
                    Dados do Comércio & Endereço em Salvador
                  </h2>
                  <p className="text-xs text-slate-500">
                    Todos os campos possuem a opção de limpar e apagar com 1 clique (ícone ✕).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome da Loja */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nome Comercial da Loja *
                  </label>
                  <ClearableInput
                    required
                    placeholder="Ex: Açaí do Porto Barra, Boutique Axé, Mercado Bonfim..."
                    value={storeName}
                    onValueChange={setStoreName}
                    leftIcon={<StoreIcon className="w-4 h-4" />}
                    className="h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                  />
                </div>

                {/* Endereço Automático Salvador & CEP */}
                <div className="sm:col-span-2">
                  <SalvadorAddressPicker
                    initialData={{
                      cep: cep || '40140-110',
                      neighborhood: neighborhood || 'Barra',
                      street: address || 'Avenida Oceânica',
                    }}
                    onChange={(data) => {
                      setCep(data.cep);
                      setNeighborhood(data.neighborhood as SalvadorNeighborhood);
                      setAddress(data.fullAddress);
                    }}
                    title="Endereço Oficial do Estabelecimento em Salvador"
                    description="Busca automática de CEP, ruas oficiais e bairros de Salvador para cadastro do lojista."
                    required
                  />
                </div>

                {/* Localização Exata / Link do Google Maps & GPS da Loja */}
                <div className="sm:col-span-2 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl p-4 border border-blue-100/80 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#0B4F8A] text-white flex items-center justify-center shadow-xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-900 leading-tight">
                          Link do Google Maps / Coordenadas GPS da Loja
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Sua loja será fixada com precisão cirúrgica no mapa interativo de Salvador.
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCaptureLiveGps}
                      disabled={isDetectingGps}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-[#0B4F8A] border border-blue-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs disabled:opacity-50"
                    >
                      <LocateFixed className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin text-amber-500' : ''}`} />
                      {isDetectingGps ? 'Detectando GPS...' : 'Usar meu GPS Atual'}
                    </button>
                  </div>

                  {gpsDetectedMessage && (
                    <div className="mb-2.5 px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-medium text-slate-700 animate-fadeIn">
                      {gpsDetectedMessage}
                    </div>
                  )}

                  <div className="relative mb-2">
                    <ClearableInput
                      placeholder="Cole aqui o link do Google Maps (ex: https://maps.app.goo.gl/... ou coordenadas -13.0039, -38.5326)"
                      value={mapLink}
                      onValueChange={setMapLink}
                      leftIcon={<Navigation className="w-4 h-4 text-[#0B4F8A]" />}
                      className="h-11 bg-white border border-slate-200 focus:border-[#0B4F8A] text-xs font-mono"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-blue-100/60 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Compass className="w-3.5 h-3.5 text-[#0B4F8A]" />
                      <span>
                        Posição no mapa: <strong>{parsedGpsResult.formattedDisplay}</strong>
                      </span>
                      {parsedGpsResult.sourceType === 'neighborhood_fallback' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100/80 text-blue-800 font-semibold">
                          Bairro: {neighborhood}
                        </span>
                      )}
                      {parsedGpsResult.sourceType !== 'neighborhood_fallback' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                          GPS Personalizado ✅
                        </span>
                      )}
                    </div>

                    {parsedGpsResult.googleMapsUrl && (
                      <a
                        href={parsedGpsResult.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#0B4F8A] hover:underline font-bold"
                      >
                        Testar no Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Descrição Curta */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Apresentação / Descrição da Loja
                  </label>
                  <ClearableTextarea
                    rows={2}
                    placeholder="Ex: Oferecemos o melhor açaí puro, frutas frescas, lanches e atendimento rápido com entrega em toda a orla de Salvador..."
                    value={description}
                    onValueChange={setDescription}
                    className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                  />
                </div>
              </div>
            </div>

            {/* =========================================================
                SEÇÃO 3: FOTO DA LOJA / BANNER
            ========================================================= */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F8A] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h2 className="font-heading font-black text-base text-slate-900 leading-tight">
                    Foto Principal & Logo da Loja
                  </h2>
                  <p className="text-xs text-slate-500">
                    A foto oficial será exibida nos cards de busca e no mapa de Salvador.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#0B4F8A] shadow-md shrink-0">
                  <img
                    src={customImageUrl.trim() || selectedLogoUrl}
                    alt="Foto da loja"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] rounded font-bold">
                    Prévia
                  </span>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Link / URL da Imagem da sua Loja (Opcional):
                  </label>
                  <ClearableInput
                    placeholder="https://suafoto.com/imagem.jpg (ou use a imagem padrão da categoria)"
                    value={customImageUrl}
                    onValueChange={setCustomImageUrl}
                    leftIcon={<Camera className="w-4 h-4" />}
                    className="h-11 bg-white border border-slate-200 focus:border-[#0B4F8A]"
                  />
                  <p className="text-[11px] text-slate-500">
                    💡 Atualmente utilizando a foto certificada de <strong>{activeCategoryObj.label}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================
                SEÇÃO 4: CONTATOS & OFERTA DE INAUGURAÇÃO
            ========================================================= */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B4F8A] flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div>
                  <h2 className="font-heading font-black text-base text-slate-900 leading-tight">
                    Contatos Comerciais & Oferta de Inauguração
                  </h2>
                  <p className="text-xs text-slate-500">
                    Canais para os moradores e turistas entrarem em contato com seu balcão.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    WhatsApp Comercial (DDD 71) *
                  </label>
                  <ClearableInput
                    placeholder="(71) 98888-8888"
                    value={whatsapp}
                    onValueChange={(val) => handlePhoneMask(val, setWhatsapp)}
                    leftIcon={<Phone className="w-4 h-4 text-emerald-600" />}
                    className="h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Instagram da Loja (Opcional)
                  </label>
                  <ClearableInput
                    placeholder="@sualoja.ssa"
                    value={instagram}
                    onValueChange={setInstagram}
                    leftIcon={<Instagram className="w-4 h-4 text-rose-500" />}
                    className="h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    CNPJ ou CPF do Titular (Opcional)
                  </label>
                  <ClearableInput
                    placeholder="12.345.678/0001-90"
                    value={cnpjCpf}
                    onValueChange={setCnpjCpf}
                    leftIcon={<FileCheck2 className="w-4 h-4" />}
                    className="h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                  />
                </div>

                {/* Oferta de Boas-Vindas */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Título da Oferta de Abertura
                  </label>
                  <ClearableInput
                    placeholder="Ex: Combo Especial de Inauguração"
                    value={initialOfferTitle}
                    onValueChange={setInitialOfferTitle}
                    leftIcon={<Flame className="w-4 h-4 text-[#E8552B]" />}
                    className="h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Selo de Desconto / Destaque
                  </label>
                  <ClearableInput
                    placeholder="Ex: 20% OFF, 2 POR 1"
                    value={initialOfferDiscount}
                    onValueChange={setInitialOfferDiscount}
                    leftIcon={<Percent className="w-4 h-4 text-amber-500" />}
                    className="h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in duration-150">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Terms and Submit */}
            <div className="pt-2">
              <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 mb-4">
                <ShieldCheck className="w-6 h-6 text-[#0B4F8A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-heading font-black text-sm text-[#0B4F8A]">
                    Garantia SALVÔ: 100% Ativo & Sem Fidelidade
                  </strong>
                  <p className="mt-0.5 text-[11px] leading-relaxed">
                    Sua loja entra <strong>imediatamente no mapa e na busca</strong> por apenas{' '}
                    <strong>R$ 12,00/mês</strong>. Você negocia diretamente com os clientes pelo
                    chat oficial e via Pix com <strong>zero comissões</strong>.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-[#FFC72C] hover:bg-[#ffbe1a] text-[#0B4F8A] font-heading font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-98"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>Ativar Minha Loja & Publicar no SALVÔ</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
