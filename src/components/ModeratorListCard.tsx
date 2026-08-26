import React from 'react';
import { ModeratorProfile } from '../types';
import { ShieldCheck, Phone, Mail, Award, Clock, Star, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ModeratorListCardProps {
  moderator: ModeratorProfile;
  onContactModerator?: (moderator: ModeratorProfile) => void;
  onAssignTicket?: (moderator: ModeratorProfile) => void;
}

export const ModeratorListCard: React.FC<ModeratorListCardProps> = ({
  moderator,
  onContactModerator,
  onAssignTicket,
}) => {
  const statusColor =
    moderator.status === 'online'
      ? 'bg-emerald-500'
      : moderator.status === 'em_atendimento'
      ? 'bg-amber-500'
      : 'bg-slate-400';

  const statusLabel =
    moderator.status === 'online'
      ? 'Disponível Online'
      : moderator.status === 'em_atendimento'
      ? 'Em Atendimento'
      : 'Fora do Horário';

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      {/* Top Profile Header */}
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <img
            src={moderator.avatar}
            alt={moderator.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
          />
          <span
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusColor}`}
            title={statusLabel}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-heading font-black text-sm text-slate-900 truncate">
              {moderator.name}
            </h3>
            <span className="p-0.5 bg-blue-50 text-[#0B4F8A] rounded-full" title="Moderador Oficial SSA">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <p className="text-xs font-semibold text-[#0B4F8A] truncate">{moderator.roleTitle}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
            {moderator.specialty}
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Casos Resolvidos</span>
          <span className="font-heading font-black text-slate-800 text-sm">
            {moderator.resolvedTicketsCount} atendimentos
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Avaliação SSA</span>
          <span className="font-heading font-black text-amber-600 text-sm flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
            {moderator.rating.toFixed(2)} / 5.0
          </span>
        </div>
      </div>

      {/* Shift & Contact Info */}
      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{moderator.shift}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-mono">{moderator.phoneContact}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        {onContactModerator && (
          <button
            onClick={() => onContactModerator(moderator)}
            className="flex-1 h-9 bg-slate-100 hover:bg-blue-50 text-[#0B4F8A] hover:text-[#083a66] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Falar com Moderador</span>
          </button>
        )}

        {onAssignTicket && (
          <button
            onClick={() => onAssignTicket(moderator)}
            className="flex-1 h-9 bg-[#0B4F8A] hover:bg-[#083a66] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Atribuir Caso</span>
          </button>
        )}
      </div>
    </div>
  );
};
