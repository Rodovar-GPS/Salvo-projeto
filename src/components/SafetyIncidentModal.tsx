import React, { useState } from 'react';
import { TheftIncident, TheftIncidentType, UserRole } from '../types';
import {
  THEFT_TYPE_LABELS,
  SALVADOR_EMERGENCY_CONTACTS,
} from '../data/mockSafetyData';
import { SALVADOR_NEIGHBORHOODS } from '../data/mockData';
import { ClearableInput } from './ClearableInput';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Plus,
  Send,
  Info,
  ExternalLink,
  Lock,
  Camera,
} from 'lucide-react';

interface SafetyIncidentModalProps {
  // Mode: View an incident vs Create a new report
  mode: 'view' | 'create';
  incident?: TheftIncident | null;
  userCoordinates?: { lat: number; lng: number } | null;
  onClose: () => void;
  onSubmitIncident?: (newIncident: Omit<TheftIncident, 'id' | 'createdAt' | 'status' | 'verifiedByAdmin'>) => void;
}

export const SafetyIncidentModal: React.FC<SafetyIncidentModalProps> = ({
  mode,
  incident,
  userCoordinates,
  onClose,
  onSubmitIncident,
}) => {
  // Form State for Report Mode
  const [type, setType] = useState<TheftIncidentType>('furto_celular');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('Barra');
  const [street, setStreet] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [incidentDate, setIncidentDate] = useState(
    new Date().toLocaleDateString('pt-BR')
  );
  const [incidentTime, setIncidentTime] = useState(
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
  const [imageUrl, setImageUrl] = useState('');
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Add image to list
  const handleAddImage = () => {
    if (imageUrl.trim() && !imagesList.includes(imageUrl.trim())) {
      setImagesList([...imagesList, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesList(imagesList.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const coords = userCoordinates || { lat: -13.0039, lng: -38.5326 };

    if (onSubmitIncident) {
      onSubmitIncident({
        type,
        title: title.trim(),
        description: description.trim(),
        neighborhood,
        street: street.trim() || undefined,
        referencePoint: referencePoint.trim() || undefined,
        coordinates: coords,
        date: incidentDate,
        time: incidentTime,
        images: imagesList.length > 0 ? imagesList : (imageUrl.trim() ? [imageUrl.trim()] : []),
        videoUrl: videoUrl.trim() || undefined,
        reporterName: isAnonymous ? 'Morador Anônimo' : reporterName.trim() || 'Cidadão de Salvador',
        reporterRole: 'client',
        severity: 'media',
      });
    }

    setIsSubmittedSuccess(true);
  };

  // ==========================================
  // 1. VIEW INCIDENT FLOATING MODAL (Pop-up Flutuante)
  // ==========================================
  if (mode === 'view' && incident) {
    const typeConfig = THEFT_TYPE_LABELS[incident.type] || THEFT_TYPE_LABELS['furto_celular'];

    return (
      <div
        id="safety-incident-view-popup"
        className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp text-slate-800">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-md shrink-0">
                {typeConfig.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
                    {typeConfig.label}
                  </span>
                  <span className="text-[11px] font-semibold text-rose-100 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {incident.date} às {incident.time}
                  </span>
                </div>
                <h3 className="font-heading font-black text-sm sm:text-base text-white leading-tight mt-0.5">
                  Alerta Comunitário de Furto
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* Title & Location */}
            <div className="space-y-1">
              <h4 className="font-heading font-black text-base sm:text-lg text-slate-900 leading-tight">
                {incident.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>
                  {incident.neighborhood} {incident.street ? `• ${incident.street}` : ''}
                </span>
              </div>
              {incident.referencePoint && (
                <p className="text-[11px] text-slate-500 italic">
                  Ponto de referência: {incident.referencePoint}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <p className="font-semibold text-rose-950 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Relato da Ocorrência:
              </p>
              {incident.description}
            </div>

            {/* Photos / Images Gallery */}
            {incident.images && incident.images.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#0B3D91]" />
                  Fotos / Evidências Anexadas ({incident.images.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {incident.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 h-32 bg-slate-100 block shadow-xs hover:shadow-md transition-all"
                    >
                      <img
                        src={img}
                        alt={`Evidência ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <ExternalLink className="w-4 h-4" />
                        <span>Ver Foto</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Video Attachment (YouTube / Video Player) */}
            {incident.videoUrl && (
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-red-600" />
                  Vídeo da Ocorrência
                </span>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video relative">
                  {incident.videoUrl.includes('youtube.com') || incident.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={
                        incident.videoUrl.includes('embed')
                          ? incident.videoUrl
                          : `https://www.youtube-nocookie.com/embed/${
                              incident.videoUrl.includes('v=')
                                ? incident.videoUrl.split('v=')[1].split('&')[0]
                                : incident.videoUrl.split('/').pop()
                            }`
                      }
                      title="Vídeo do Alerta"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      src={incident.videoUrl}
                      className="w-full h-full object-cover"
                    >
                      Seu navegador não suporta reprodução deste vídeo.
                    </video>
                  )}
                </div>
              </div>
            )}

            {/* Verification Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  Alerta Aprovado pela Moderação do SALVÔ
                </p>
                <p className="text-[11px] text-emerald-800 leading-snug mt-0.5">
                  {incident.adminNote ||
                    'Esta ocorrência foi revisada e aprovada pelo administrador para fins de segurança comunitária e prevenção coletiva.'}
                </p>
              </div>
            </div>

            {/* Emergency Contacts in Salvador */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Contatos de Emergência em Salvador
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SALVADOR_EMERGENCY_CONTACTS.slice(0, 4).map((c, i) => (
                  <a
                    key={i}
                    href={`tel:${c.number.replace(/\D/g, '')}`}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-xs font-bold text-slate-700"
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-red-600 font-heading font-black shrink-0">
                      {c.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Informante: {incident.reporterName || 'Cidadão'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Fechar Alerta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. CREATE REPORT MODAL (Sinalizar Furto / Ocorrência)
  // ==========================================
  return (
    <div
      id="safety-incident-create-modal"
      className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center text-lg">
              🛡️
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base leading-tight">
                Sinalizar Furto / Alerta de Segurança
              </h3>
              <p className="text-[11px] text-rose-100">
                Ajude a manter Salvador mais segura e informada
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmittedSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
              ⏳
            </div>
            <div className="space-y-1.5">
              <h4 className="font-heading font-black text-lg text-slate-900">
                Alerta Enviado para Moderação!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Por questões de segurança jurídica e integridade coletiva, todas as ocorrências são revisadas pela equipe do administrador do SALVÔ antes de aparecerem no mapa público.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-900 font-semibold text-left max-w-sm mx-auto">
              <div className="flex items-center gap-1.5 mb-1 font-bold text-[#0B3D91]">
                <ShieldCheck className="w-4 h-4" />
                <span>O que acontece agora?</span>
              </div>
              <span>
                Nossa equipe avaliará as informações e liberará o pin no mapa em instantes. Obrigado por contribuir com a segurança de Salvador!
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0B3D91] hover:bg-[#082C69] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Concluir e Voltar ao Mapa
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {/* Informational Banner */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Aviso importante: </span>
                <span>
                  Ocorrências falsas ou trotes não são tolerados. As postagens só serão liberadas no mapa após aprovação expressa do administrador.
                </span>
              </div>
            </div>

            {/* Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Tipo de Ocorrência *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TheftIncidentType)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all cursor-pointer"
              >
                {Object.entries(THEFT_TYPE_LABELS).map(([key, conf]) => (
                  <option key={key} value={key}>
                    {conf.icon} {conf.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Neighborhood & Street */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Bairro de Salvador *
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all cursor-pointer"
                >
                  {SALVADOR_NEIGHBORHOODS.map((nh) => (
                    <option key={nh} value={nh}>
                      {nh}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Rua ou Avenida
                </label>
                <ClearableInput
                  placeholder="Ex: Av. Oceânica, Rua Chile..."
                  value={street}
                  onValueChange={setStreet}
                  className="h-11 bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            {/* Reference Point */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Ponto de Referência
              </label>
              <ClearableInput
                placeholder="Ex: Em frente ao Farol, próximo à farmácia..."
                value={referencePoint}
                onValueChange={setReferencePoint}
                className="h-11 bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Título Resumido *
              </label>
              <ClearableInput
                placeholder="Ex: Furto de celular na calçada da orla"
                value={title}
                onValueChange={setTitle}
                className="h-11 bg-slate-50 border border-slate-200 text-xs font-bold"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Descrição Detalhada do Fato *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Descreva como ocorreu a abordagem, características, veículos envolvidos ou orientações para quem transita no local..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all resize-none"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Data da Ocorrência
                </label>
                <ClearableInput
                  placeholder="DD/MM/AAAA"
                  value={incidentDate}
                  onValueChange={setIncidentDate}
                  leftIcon={<Calendar className="w-3.5 h-3.5 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Horário Estimado
                </label>
                <ClearableInput
                  placeholder="HH:mm"
                  value={incidentTime}
                  onValueChange={setIncidentTime}
                  leftIcon={<Clock className="w-3.5 h-3.5 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            {/* Images Addition */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Adicionar Fotos / Imagens da Ocorrência
              </label>
              <div className="flex gap-2">
                <ClearableInput
                  placeholder="Link ou URL da imagem (https://...)"
                  value={imageUrl}
                  onValueChange={setImageUrl}
                  leftIcon={<ImageIcon className="w-3.5 h-3.5 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 text-xs font-bold flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Anexar</span>
                </button>
              </div>

              {imagesList.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {imagesList.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Addition */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Link de Vídeo (YouTube ou Câmera de Segurança)
              </label>
              <ClearableInput
                placeholder="https://youtube.com/... ou link direto de vídeo"
                value={videoUrl}
                onValueChange={setVideoUrl}
                leftIcon={<Video className="w-3.5 h-3.5 text-slate-400" />}
                className="h-11 bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>

            {/* Reporter Info */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Identificação do Informante
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span>Enviar como Anônimo</span>
                </label>
              </div>

              {!isAnonymous && (
                <ClearableInput
                  placeholder="Seu nome ou apelido (ex: Marcos - Morador)"
                  value={reporterName}
                  onValueChange={setReporterName}
                  className="h-11 bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl text-xs font-heading font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Alerta para Aprovação</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
