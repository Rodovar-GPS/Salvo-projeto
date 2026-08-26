import React, { useState } from 'react';
import { BonfimRibbon } from '../components/BonfimRibbon';
import { ClearableInput } from '../components/ClearableInput';
import { SalvadorAddressPicker, AddressSelectionData } from '../components/SalvadorAddressPicker';
import { User, UserRole } from '../types';
import {
  User as UserIcon,
  Store,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToMerchantRegister: () => void;
  onBackToExplore: () => void;
  allUsers: User[];
  onRegisterClient: (clientData: { name: string; email: string; phone?: string; neighborhood?: string }) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  onNavigateToMerchantRegister,
  onBackToExplore,
  allUsers,
  onRegisterClient,
}) => {
  // Modes: 'role_selection' | 'login' | 'register_client'
  const [authMode, setAuthMode] = useState<'role_selection' | 'login' | 'register_client'>('role_selection');
  const [selectedRoleType, setSelectedRoleType] = useState<UserRole>('client');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [clientAddress, setClientAddress] = useState<AddressSelectionData>({
    cep: '40140-110',
    neighborhood: 'Barra',
    street: 'Avenida Oceânica',
    number: '',
    complement: '',
    reference: '',
    fullAddress: 'Avenida Oceânica, Barra, Salvador - BA',
    coordinates: {
      lat: -13.0039,
      lng: -38.5326,
    },
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleClientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMsg('Por favor, informe seu nome e e-mail.');
      return;
    }
    setErrorMsg('');
    onRegisterClient({
      name,
      email,
      phone,
      neighborhood: clientAddress.neighborhood,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Informe seu e-mail cadastrado.');
      return;
    }
    const matchedUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      // Create guest user if not found
      onRegisterClient({
        name: email.split('@')[0],
        email,
        phone: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <BonfimRibbon height="h-2" />

      {/* Header */}
      <header className="max-w-xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
        <button
          onClick={onBackToExplore}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B4F8A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Mapa</span>
        </button>

        <div className="flex items-center gap-2">
          <img
            src="/salvo-logo.png"
            alt="SALVÔ"
            className="w-8 h-8 rounded-xl object-cover border border-slate-200"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
            }}
          />
          <span className="font-heading font-black text-sm text-[#0B4F8A]">SALVÔ</span>
        </div>
      </header>

      {/* Center Container */}
      <main className="max-w-xl mx-auto w-full px-6 py-6 flex-1 flex flex-col justify-center">
        {/* STEP 1: Role Selection Portal ("Sou Cliente" vs "Sou Lojista") */}
        {authMode === 'role_selection' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
            <div className="text-center mb-6">
              <span className="px-3 py-1 bg-blue-50 text-[#0B4F8A] text-[11px] font-black uppercase tracking-wider rounded-full inline-block mb-2">
                Como você quer acessar?
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
                Bem-vindo ao SALVÔ
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Guia Oficial do Comércio Local de Salvador. Escolha o seu perfil para continuar:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* SOU CLIENTE CARD */}
              <div
                onClick={() => {
                  setSelectedRoleType('client');
                  setAuthMode('register_client');
                }}
                className="bg-slate-50 hover:bg-blue-50/50 border-2 border-slate-200 hover:border-[#0B4F8A] rounded-3xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 relative group flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] text-[10px] font-black uppercase rounded-full shadow-2xs">
                    100% Grátis
                  </span>
                </div>

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0B4F8A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-1">
                    Sou Cliente
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Morador ou turista de Salvador buscando as melhores lojas, promoções no mapa e atendimento no chat.
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-[#0B4F8A] gap-1 group-hover:underline">
                  <span>Criar conta grátis</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* SOU LOJISTA CARD */}
              <div
                onClick={onNavigateToMerchantRegister}
                className="bg-slate-50 hover:bg-amber-50/50 border-2 border-slate-200 hover:border-[#FFC72C] rounded-3xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 relative group flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] text-[10px] font-black uppercase rounded-full shadow-2xs">
                    R$ 12/mês
                  </span>
                </div>

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#0B4F8A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Store className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-1">
                    Sou Lojista
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Divulgue sua loja no mapa de Salvador, publique ofertas comerciais exclusivas e atenda clientes pelo chat.
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-[#0B4F8A] gap-1 group-hover:underline">
                  <span>Cadastrar empresa</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Existing User Login Link */}
            <div className="text-center pt-2 pb-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Já tem cadastro?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-[#0B4F8A] hover:underline"
                >
                  Entrar na minha conta
                </button>
              </p>
            </div>

            {/* Quick Demo Access Quick Bar */}
            <div className="bg-slate-100/80 rounded-2xl p-3 text-center">
              <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                Acesso Rápido para Demonstração:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onLoginSuccess(u)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold shadow-2xs border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>{u.name.split(' ')[0]}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase text-white ${
                        u.role === 'merchant'
                          ? 'bg-[#0B4F8A]'
                          : u.role === 'admin'
                          ? 'bg-[#E8552B]'
                          : 'bg-[#2E9E5B]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Cadastro de Cliente (Nome, E-mail, Telefone, Senha) */}
        {authMode === 'register_client' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setAuthMode('role_selection')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Mudar perfil</span>
              </button>
              <span className="px-2.5 py-0.5 bg-[#FFC72C] text-[#0B4F8A] text-[10px] font-black uppercase rounded-full shadow-2xs">
                Cadastro 100% Grátis
              </span>
            </div>

            <div className="mb-6">
              <h2 className="font-heading font-black text-2xl text-slate-900">
                Criar Conta de Cliente
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Salve lojas favoritas, aproveite ofertas exclusivas e converse direto com os comércios de Salvador.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleClientRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <ClearableInput
                  required
                  placeholder="Ex: Carolina Bahia"
                  value={name}
                  onValueChange={setName}
                  leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail *
                </label>
                <ClearableInput
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onValueChange={setEmail}
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telefone / WhatsApp (Opcional)
                </label>
                <ClearableInput
                  type="tel"
                  placeholder="(71) 99999-9999"
                  value={phone}
                  onValueChange={setPhone}
                  leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              {/* Endereço Automático do Cliente em Salvador */}
              <SalvadorAddressPicker
                initialData={clientAddress}
                onChange={setClientAddress}
                title="Seu Bairro e Localização em Salvador"
                description="Selecione seu bairro ou digite seu CEP para ver ofertas e lojas próximas de você."
                required={false}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Criar Senha *
                </label>
                <ClearableInput
                  type="password"
                  required
                  placeholder="Mínimo 6 dígitos"
                  value={password}
                  onValueChange={setPassword}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-98 mt-2"
              >
                Concluir Cadastro Grátis
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-xs text-slate-500">
                Já possui conta?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-[#0B4F8A] hover:underline"
                >
                  Fazer Login
                </button>
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Login Form */}
        {authMode === 'login' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setAuthMode('role_selection')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              <span className="text-xs font-bold text-slate-400">Acesso ao Guia</span>
            </div>

            <div className="mb-6">
              <h2 className="font-heading font-black text-2xl text-slate-900">
                Entrar na Conta
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Acesse como Cliente, Lojista ou Administrador.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail
                </label>
                <ClearableInput
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onValueChange={setEmail}
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Senha</label>
                  <span className="text-[11px] text-slate-400 cursor-pointer hover:underline">
                    Esqueceu?
                  </span>
                </div>
                <ClearableInput
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onValueChange={setPassword}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  className="h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#0B4F8A] hover:bg-[#083a66] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-98"
              >
                Entrar
              </button>
            </form>

            {/* Quick Demonstration buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Ou acesse com 1 clique (Demonstração):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onLoginSuccess(allUsers[0])}
                  className="p-2 bg-slate-50 hover:bg-green-50 rounded-xl text-center border border-slate-200"
                >
                  <p className="text-[11px] font-bold text-slate-800">Carol</p>
                  <span className="text-[9px] text-[#2E9E5B] font-bold">Cliente</span>
                </button>

                <button
                  onClick={() => onLoginSuccess(allUsers[1])}
                  className="p-2 bg-slate-50 hover:bg-blue-50 rounded-xl text-center border border-slate-200"
                >
                  <p className="text-[11px] font-bold text-slate-800">Mateus</p>
                  <span className="text-[9px] text-[#0B4F8A] font-bold">Lojista</span>
                </button>

                <button
                  onClick={() => onLoginSuccess(allUsers[2])}
                  className="p-2 bg-slate-50 hover:bg-rose-50 rounded-xl text-center border border-slate-200"
                >
                  <p className="text-[11px] font-bold text-slate-800">Admin</p>
                  <span className="text-[9px] text-[#E8552B] font-bold">Super Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-xl mx-auto w-full px-6 pb-6 text-center text-xs text-slate-400">
        <p>SALVÔ • Guia Oficial do Comércio Local de Salvador.</p>
      </footer>
    </div>
  );
};
