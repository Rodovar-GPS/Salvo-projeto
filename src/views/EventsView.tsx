import React, { useState } from 'react';
import { EventItem, EventCategory, User, SalvadorNeighborhood } from '../types';
import { EVENT_CATEGORIES } from '../data/eventsData';
import { SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import { SalvadorAddressPicker, AddressSelectionData } from '../components/SalvadorAddressPicker';
import { ClearableInput, ClearableTextarea } from '../components/ClearableInput';
import { BonfimRibbon } from '../components/BonfimRibbon';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  PlusCircle,
  Tag,
  Search,
  Filter,
  ExternalLink,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
  Ticket,
  Users,
  Compass,
  Crown,
  Lock,
  ArrowRight,
  Navigation,
} from 'lucide-react';

interface EventsViewProps {
  events: EventItem[];
  currentUser: User;
  onAddEvent?: (newEvent: Omit<EventItem, 'id' | 'submittedAt'>) => void;
  onCreateEvent?: (newEvent: any) => void;
  onUpdateUser?: (updated: Partial<User>) => void;
  onOpenAuth?: () => void;
}

function formatBrazilianDate(dateStr?: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

const PRESET_EVENT_FLYERS = [
  {
    label: 'Ensaio de Carnaval & Bloco Afro',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Festival de Música & Orla',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Gastronomia & Feira de Rua',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Show na Concha Acústica TCA',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Samba de Roda & Cultura Popular',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Teatro & Artes Cênicas',
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
  },
];

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  currentUser,
  onAddEvent,
  onCreateEvent,
  onUpdateUser,
  onOpenAuth,
}) => {
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'Todas'>('Todas');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SalvadorNeighborhood | 'Todos os Bairros'>('Todos os Bairros');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPrice, setFilterPrice] = useState<'all' | 'gratis' | 'pago'>('all');

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<EventItem | null>(null);
  const [submissionSuccessToast, setSubmissionSuccessToast] = useState(false);

  // Event submission form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Shows & Música');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [priceType, setPriceType] = useState<'gratis' | 'pago'>('gratis');
  const [priceValue, setPriceValue] = useState('');
  const [flyerImage, setFlyerImage] = useState(PRESET_EVENT_FLYERS[0].url);
  const [customFlyerUrl, setCustomFlyerUrl] = useState('');
  const [organizerName, setOrganizerName] = useState(currentUser.name || '');
  const [organizerContact, setOrganizerContact] = useState(currentUser.phone || '');
  const [ticketLink, setTicketLink] = useState('');
  const [addressData, setAddressData] = useState<AddressSelectionData>({
    cep: '40140-110',
    neighborhood: 'Barra',
    street: 'Avenida Oceânica',
    number: 'S/N',
    complement: '',
    reference: 'Farol da Barra',
    fullAddress: 'Avenida Oceânica, S/N - Barra, Salvador - BA (CEP 40140-110)',
    coordinates: { lat: -13.0097, lng: -38.5315 },
  });
  const [formError, setFormError] = useState('');

  // Check if current user is allowed to publish
  const isSubscriber = Boolean(
    currentUser.isSubscriber ||
      currentUser.role === 'merchant' ||
      currentUser.role === 'admin'
  );

  const handleOpenPublish = () => {
    if (!isSubscriber) {
      setIsSubscriberModalOpen(true);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handleSubscribeSimulation = () => {
    if (onUpdateUser) {
      onUpdateUser({
        isSubscriber: true,
        subscriberPlan: 'vip',
      });
    }
    setIsSubscriberModalOpen(false);
    setIsSubmitModalOpen(true);
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time || !venue.trim() || !description.trim()) {
      setFormError('Por favor, preencha os campos obrigatórios marcados com *.');
      return;
    }

    const finalImage = customFlyerUrl.trim() || flyerImage;

    const eventPayload = {
      title,
      category,
      description,
      date,
      time,
      venue,
      neighborhood: addressData.neighborhood || 'Salvador',
      street: addressData.street || '',
      cep: addressData.cep || '',
      addressNumber: addressData.number || 'S/N',
      fullAddress: addressData.fullAddress || `${venue} - ${addressData.neighborhood}, Salvador - BA`,
      coordinates: addressData.coordinates,
      priceType,
      priceValue: priceType === 'pago' ? priceValue : undefined,
      priceText: priceType === 'gratis' ? 'Entrada Gratuita' : `R$ ${priceValue}`,
      flyerImage: finalImage,
      organizerName: organizerName || currentUser.name,
      organizerContact,
      ticketLink: ticketLink.trim() || undefined,
      publisherId: currentUser.id,
      publisherName: currentUser.name,
      publisherRole: currentUser.role,
      isSubscriber: true,
      status: 'pending' as const, // Sent for Admin Moderation!
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (onAddEvent) {
      onAddEvent(eventPayload);
    } else if (onCreateEvent) {
      onCreateEvent(eventPayload);
    }

    setIsSubmitModalOpen(false);
    setSubmissionSuccessToast(true);
    setTimeout(() => setSubmissionSuccessToast(false), 5000);

    // Reset Form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setVenue('');
    setPriceValue('');
    setCustomFlyerUrl('');
    setFormError('');
  };

  // Only approved events are displayed to public explore
  const approvedEvents = events.filter((e) => e.status === 'approved');

  // Filtered Events
  const filteredEvents = approvedEvents.filter((ev) => {
    if (selectedCategory !== 'Todas' && ev.category !== selectedCategory) return false;
    if (selectedNeighborhood !== 'Todos os Bairros' && ev.neighborhood !== selectedNeighborhood) return false;
    if (filterPrice !== 'all' && ev.priceType !== filterPrice) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.neighborhood.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.organizerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification on Submission */}
      {submissionSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white px-5 py-4 rounded-3xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 max-w-md">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h5 className="font-heading font-black text-sm">Evento Enviado com Sucesso!</h5>
            <p className="text-xs text-emerald-200 mt-0.5">
              Sua divulgação foi encaminhada para a <strong>Moderação do Administrador</strong> e será publicada após aprovação.
            </p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0B4F8A] via-[#083a66] to-[#04203a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-[#FFC72C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#FFC72C] text-[#0B4F8A] rounded-full text-[10px] font-black uppercase tracking-wider">
                Cultura & Agenda SSA
              </span>
              <span className="text-xs text-blue-200 font-semibold">
                Salvador, Bahia
              </span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
              Eventos, Ensaios & Festas de Salvador
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Descubra os melhores ensaios de verão, rodas de samba, shows, festivais gastronômicos e eventos culturais em todos os bairros da capital baiana.
            </p>
          </div>

          {/* CTA: Divulgar Evento */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleOpenPublish}
              className="px-6 py-3.5 bg-gradient-to-r from-[#FFC72C] to-[#f5b810] hover:from-[#ffd255] hover:to-[#FFC72C] text-[#0B4F8A] font-heading font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0B4F8A]" />
              <span>Divulgar Meu Evento</span>
              {!isSubscriber && (
                <span className="px-2 py-0.5 rounded-md bg-[#0B4F8A]/15 text-[10px] uppercase tracking-wider">
                  VIP
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/90 space-y-4">
        {/* Row 1: Search & Neighborhood */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <ClearableInput
              placeholder="Buscar evento por título, local, artista ou bairro..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
            />
          </div>

          <div className="w-full sm:w-64 relative">
            <MapPin className="w-4 h-4 text-[#0B4F8A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value as any)}
              className="w-full h-12 pl-10 pr-8 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:border-[#0B4F8A] outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="Todos os Bairros">📍 Todos os Bairros</option>
              {SALVADOR_NEIGHBORHOODS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setFilterPrice('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filterPrice === 'all' ? 'bg-[#0B4F8A] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterPrice('gratis')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filterPrice === 'gratis' ? 'bg-[#2E9E5B] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Grátis
            </button>
            <button
              onClick={() => setFilterPrice('pago')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filterPrice === 'pago' ? 'bg-[#E8552B] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Ingressos
            </button>
          </div>
        </div>

        {/* Row 2: Category Rail */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('Todas')}
            className={`h-9 px-4 rounded-2xl text-xs font-heading font-black shrink-0 transition-all flex items-center gap-1.5 border select-none ${
              selectedCategory === 'Todas'
                ? 'bg-[#0B4F8A] text-white border-[#0B4F8A] shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>TODOS ({approvedEvents.length})</span>
          </button>

          {EVENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const count = approvedEvents.filter((e) => e.category === cat.name).length;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`h-9 px-3.5 rounded-2xl text-xs font-heading font-bold shrink-0 transition-all flex items-center gap-1.5 border select-none ${
                  isSelected
                    ? 'bg-[#0B4F8A] text-white border-[#0B4F8A] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0B4F8A] mx-auto flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-heading font-black text-slate-900">
            Nenhum evento encontrado para estes filtros
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tente selecionar outra categoria, outro bairro de Salvador ou limpe a busca.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Todas');
              setSelectedNeighborhood('Todos os Bairros');
              setSearchQuery('');
              setFilterPrice('all');
            }}
            className="px-5 py-2.5 bg-[#0B4F8A] text-white font-bold text-xs rounded-2xl hover:bg-blue-800 transition-colors"
          >
            Ver Todos os Eventos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const catObj = EVENT_CATEGORIES.find((c) => c.name === event.category);

            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Event Flyer Cover */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={event.flyerImage}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-heading font-black text-[#0B4F8A] shadow-xs flex items-center gap-1">
                      <span>{catObj?.icon || '🎉'}</span>
                      <span>{event.category}</span>
                    </span>
                    {event.isFeatured && (
                      <span className="px-2 py-1 bg-[#FFC72C] text-[#0B4F8A] rounded-xl text-[10px] font-black uppercase tracking-wider shadow-xs">
                        Destaque
                      </span>
                    )}
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black uppercase shadow-xs ${
                        event.priceType === 'gratis'
                          ? 'bg-[#2E9E5B] text-white'
                          : 'bg-[#E8552B] text-white'
                      }`}
                    >
                      {event.priceText || (event.priceType === 'gratis' ? 'Grátis' : `R$ ${event.priceValue}`)}
                    </span>
                  </div>

                  {/* Date & Time Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-xl flex items-center gap-1.5 border border-white/20">
                        <Calendar className="w-3.5 h-3.5 text-[#FFC72C]" />
                        <span>{formatBrazilianDate(event.date)}</span>
                      </div>
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-xl flex items-center gap-1 border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-[#FFC72C]" />
                        <span>{event.time.startsWith('Horas:') ? event.time : `Horas: ${event.time}`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-heading font-black text-lg text-slate-900 leading-snug group-hover:text-[#0B4F8A] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Venue & Salvador Address */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#0B4F8A] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <strong className="text-xs font-bold text-slate-900 block truncate">
                          {event.venue}
                        </strong>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {event.neighborhood}, Salvador - BA {event.cep && `(CEP ${event.cep})`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Organizer & Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-medium truncate">
                      Por: <strong className="text-slate-700">{event.organizerName}</strong>
                    </span>

                    <button
                      onClick={() => setSelectedDetailEvent(event)}
                      className="px-4 py-2 bg-blue-50 hover:bg-[#0B4F8A] text-[#0B4F8A] hover:text-white font-heading font-black text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Ver Detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: VIP SUBSCRIBER GATEWAY (Only Subscribers Can Publish Events)
      ========================================================================= */}
      {isSubscriberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsSubscriberModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
                <Crown className="w-8 h-8 text-[#FFC72C]" />
              </div>
              <span className="px-3 py-1 bg-blue-50 text-[#0B4F8A] text-[10px] font-black uppercase tracking-wider rounded-full">
                Exclusivo para Assinantes
              </span>
              <h3 className="font-heading font-black text-2xl text-slate-900">
                Divulgação Oficial de Eventos
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                A publicação de eventos, shows e ensaios na agenda de Salvador é um benefício exclusivo para <strong>Clientes Assinantes VIP</strong> e <strong>Lojistas Parceiros</strong>.
              </p>
            </div>

            {/* Subscriber Benefits */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-2.5 mb-6 text-xs">
              <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Divulgação ilimitada de eventos com aprovação prioritária</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Integração direta com o mapa e busca de Salvador</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Link direto para venda de ingressos (Sympla, WhatsApp, etc.)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Selo exclusivo de Organizador Verificado no SALVÔ</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubscribeSimulation}
                className="w-full py-3.5 bg-gradient-to-r from-[#0B4F8A] to-[#083a66] text-white font-heading font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-[#FFC72C]" />
                <span>Ativar Assinatura VIP (Simular Ativação)</span>
              </button>

              <p className="text-[10px] text-center text-slate-400 font-medium">
                Garantia de moderação segura contra fraudes e conteúdo verificado para a cidade de Salvador.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EVENT CREATION / SUBMISSION FORM (With Address/CEP & Moderation)
      ========================================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#2E9E5B]/10 text-[#2E9E5B] text-[10px] font-black uppercase tracking-wider rounded-full">
                  Assinante Autorizado
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  Requer Moderação do Admin
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl text-slate-900">
                Cadastrar Nova Divulgação de Evento
              </h3>
              <p className="text-xs text-slate-500">
                Preencha as informações do evento para envio à equipe de aprovação do SALVÔ.
              </p>
            </div>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-bold flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitEvent} className="space-y-5">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título do Evento / Atração *
                </label>
                <ClearableInput
                  placeholder="Ex: Ensaio do Olodum, Festival de Verão na Barra..."
                  value={title}
                  onValueChange={setTitle}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              {/* Category, Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#0B4F8A] outline-none"
                  >
                    {EVENT_CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Data do Evento *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#0B4F8A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Horário de Início *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 19:00 ou 16h às 22h"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#0B4F8A] outline-none"
                  />
                </div>
              </div>

              {/* Venue Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Espaço / Local do Evento *
                </label>
                <ClearableInput
                  placeholder="Ex: Concha Acústica do TCA, Largo do Pelourinho, Farol da Barra..."
                  value={venue}
                  onValueChange={setVenue}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              {/* Salvador Official Address Picker (Automatic CEP & Street lookup) */}
              <SalvadorAddressPicker
                initialData={{
                  neighborhood: 'Barra',
                  cep: '40140-110',
                  street: 'Avenida Oceânica',
                }}
                onChange={setAddressData}
                title="Endereço Oficial em Salvador"
                description="Selecione o endereço com validação de CEP e ruas oficiais de Salvador."
                required
              />

              {/* Price Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Ingresso / Acesso
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPriceType('gratis')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        priceType === 'gratis' ? 'bg-[#2E9E5B] text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Entrada Gratuita
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceType('pago')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        priceType === 'pago' ? 'bg-[#E8552B] text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Ingresso Pago
                    </button>
                  </div>
                </div>

                {priceType === 'pago' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Valor do Ingresso (R$)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 50,00 ou R$ 40 a R$ 80"
                      value={priceValue}
                      onChange={(e) => setPriceValue(e.target.value)}
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#0B4F8A] outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Flyer Cover Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Foto de Capa / Flyer do Evento
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {PRESET_EVENT_FLYERS.map((f) => (
                    <div
                      key={f.label}
                      onClick={() => {
                        setFlyerImage(f.url);
                        setCustomFlyerUrl('');
                      }}
                      className={`relative h-16 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                        flyerImage === f.url && !customFlyerUrl
                          ? 'border-[#0B4F8A] ring-2 ring-blue-200 scale-105 shadow-md'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={f.url}
                        alt={f.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <ClearableInput
                  placeholder="Ou cole a URL de uma imagem personalizada..."
                  value={customFlyerUrl}
                  onValueChange={setCustomFlyerUrl}
                  className="h-10 bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição Completa do Evento *
                </label>
                <ClearableTextarea
                  placeholder="Conte os detalhes da programação, atrações confirmadas, convidados especiais e dicas para o público..."
                  value={description}
                  onValueChange={setDescription}
                  rows={3}
                  className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A] text-xs"
                />
              </div>

              {/* Organizer & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome do Organizador
                  </label>
                  <input
                    type="text"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp para Contato
                  </label>
                  <input
                    type="text"
                    placeholder="71999998888"
                    value={organizerContact}
                    onChange={(e) => setOrganizerContact(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Link de Ingressos (Sympla, etc.)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={ticketLink}
                    onChange={(e) => setTicketLink(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Moderation Alert Banner */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Processo de Moderação Ativo</strong>
                  <span>
                    Após o envio, seu pedido de divulgação ficará com status <strong>Pendente de Moderação</strong> e será analisado no painel administrativo antes de entrar na agenda oficial.
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0B4F8A] hover:bg-blue-800 text-white font-heading font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFC72C]" />
                  <span>Enviar para Moderação</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: EVENT DETAILS MODAL
      ========================================================================= */}
      {selectedDetailEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedDetailEvent(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Flyer Header */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-900">
              <img
                src={selectedDetailEvent.flyerImage}
                alt={selectedDetailEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-4 left-5 right-5 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#FFC72C] text-[#0B4F8A] rounded-xl text-[10px] font-black uppercase tracking-wider">
                    {selectedDetailEvent.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${
                      selectedDetailEvent.priceType === 'gratis'
                        ? 'bg-[#2E9E5B] text-white'
                        : 'bg-[#E8552B] text-white'
                    }`}
                  >
                    {selectedDetailEvent.priceText || (selectedDetailEvent.priceType === 'gratis' ? 'Grátis' : `R$ ${selectedDetailEvent.priceValue}`)}
                  </span>
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
                  {selectedDetailEvent.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Date, Time & Venue Keycard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0B4F8A] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Data e Horário</span>
                    <strong className="text-xs font-bold text-slate-900 block">
                      {formatBrazilianDate(selectedDetailEvent.date)} - Horas: {selectedDetailEvent.time}
                    </strong>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Local</span>
                    <strong className="text-xs font-bold text-slate-900 block truncate">
                      {selectedDetailEvent.venue}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Full Address Banner */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                <Navigation className="w-4 h-4 text-[#0B4F8A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block">Endereço em Salvador:</strong>
                  <span>{selectedDetailEvent.fullAddress}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Sobre o Evento
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedDetailEvent.description}
                </p>
              </div>

              {/* Organizer Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Divulgado por</span>
                  <strong className="text-slate-900 font-bold">{selectedDetailEvent.organizerName}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {selectedDetailEvent.organizerContact && (
                    <a
                      href={`https://wa.me/${selectedDetailEvent.organizerContact.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#2E9E5B] hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {selectedDetailEvent.ticketLink && (
                    <a
                      href={selectedDetailEvent.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#0B4F8A] hover:bg-blue-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Comprar Ingressos</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
