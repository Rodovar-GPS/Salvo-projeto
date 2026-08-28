import React from 'react';
import {
  UtensilsCrossed,
  Beer,
  Shirt,
  Scissors,
  ShoppingBag,
  HeartPulse,
  Palette,
  Car,
  Dog,
  Home,
  Hammer,
  Smartphone,
  Briefcase,
  Waves,
  GraduationCap,
  Compass,
  PartyPopper,
  Leaf,
  Wrench,
  Store as StoreIcon,
  LucideIcon,
} from 'lucide-react';
import { StoreCategory } from '../types';

export interface CategoryVisualMeta {
  name: StoreCategory;
  iconName: string;
  color: string;
  bgLight: string;
  iconComponent: LucideIcon;
  emoji: string;
}

export const CATEGORY_VISUALS: Record<StoreCategory, CategoryVisualMeta> = {
  'Restaurantes & Gastronomia': {
    name: 'Restaurantes & Gastronomia',
    iconName: 'UtensilsCrossed',
    color: '#C1502E', // Terracota Baiano
    bgLight: '#FDF2EF',
    iconComponent: UtensilsCrossed,
    emoji: '🍽️',
  },
  'Bares, Botecos & Vida Noturna': {
    name: 'Bares, Botecos & Vida Noturna',
    iconName: 'Beer',
    color: '#D97706', // Âmbar Dourado
    bgLight: '#FFFBEB',
    iconComponent: Beer,
    emoji: '🍻',
  },
  'Moda, Roupas & Acessórios': {
    name: 'Moda, Roupas & Acessórios',
    iconName: 'Shirt',
    color: '#0B3D91', // Azul Royal Salvador
    bgLight: '#EFF6FF',
    iconComponent: Shirt,
    emoji: '👗',
  },
  'Beleza, Barbearias & Estética': {
    name: 'Beleza, Barbearias & Estética',
    iconName: 'Scissors',
    color: '#8B5CF6', // Roxo Elegante
    bgLight: '#F5F3FF',
    iconComponent: Scissors,
    emoji: '✂️',
  },
  'Mercados, Padarias & Empórios': {
    name: 'Mercados, Padarias & Empórios',
    iconName: 'ShoppingBag',
    color: '#059669', // Verde Esmeralda
    bgLight: '#ECFDF5',
    iconComponent: ShoppingBag,
    emoji: '🛒',
  },
  'Saúde, Farmácias & Bem-Estar': {
    name: 'Saúde, Farmácias & Bem-Estar',
    iconName: 'HeartPulse',
    color: '#1F6E43', // Verde Dendê
    bgLight: '#EDF7F1',
    iconComponent: HeartPulse,
    emoji: '💊',
  },
  'Artesanato, Cultura & Lembranças': {
    name: 'Artesanato, Cultura & Lembranças',
    iconName: 'Palette',
    color: '#E11D48', // Coral Pelourinho
    bgLight: '#FFF1F2',
    iconComponent: Palette,
    emoji: '🏺',
  },
  'Serviços Automotivos & Mecânica': {
    name: 'Serviços Automotivos & Mecânica',
    iconName: 'Car',
    color: '#475569', // Cinza Ardósia
    bgLight: '#F8FAFC',
    iconComponent: Car,
    emoji: '🚗',
  },
  'Pet Shop, Veterinária & Acessórios': {
    name: 'Pet Shop, Veterinária & Acessórios',
    iconName: 'Dog',
    color: '#F97316', // Laranja Quente
    bgLight: '#FFF7ED',
    iconComponent: Dog,
    emoji: '🐾',
  },
  'Casa, Móveis & Decoração': {
    name: 'Casa, Móveis & Decoração',
    iconName: 'Home',
    color: '#6366F1', // Índigo Moderno
    bgLight: '#EEF2FF',
    iconComponent: Home,
    emoji: '🛋️',
  },
  'Construção, Elétrica & Reformas': {
    name: 'Construção, Elétrica & Reformas',
    iconName: 'Hammer',
    color: '#0284C7', // Azul Céu
    bgLight: '#F0F9FF',
    iconComponent: Hammer,
    emoji: '🔨',
  },
  'Tecnologia, Celulares & Informática': {
    name: 'Tecnologia, Celulares & Informática',
    iconName: 'Smartphone',
    color: '#2563EB', // Azul Cobalto
    bgLight: '#EFF6FF',
    iconComponent: Smartphone,
    emoji: '📱',
  },
  'Serviços Profissionais & Escritórios': {
    name: 'Serviços Profissionais & Escritórios',
    iconName: 'Briefcase',
    color: '#334155', // Chumbo Corporativo
    bgLight: '#F1F5F9',
    iconComponent: Briefcase,
    emoji: '💼',
  },
  'Esportes, Academias & Aventura': {
    name: 'Esportes, Academias & Aventura',
    iconName: 'Waves',
    color: '#0284C7', // Azul Oceano
    bgLight: '#F0F9FF',
    iconComponent: Waves,
    emoji: '🏄‍♂️',
  },
  'Educação, Idiomas & Cursos': {
    name: 'Educação, Idiomas & Cursos',
    iconName: 'GraduationCap',
    color: '#1D4ED8', // Azul Acadêmico
    bgLight: '#EFF6FF',
    iconComponent: GraduationCap,
    emoji: '📚',
  },
  'Turismo, Passeios & Hotelaria': {
    name: 'Turismo, Passeios & Hotelaria',
    iconName: 'Compass',
    color: '#D97706', // Dourado Solar
    bgLight: '#FFFBEB',
    iconComponent: Compass,
    emoji: '🏖️',
  },
  'Eventos, Festas & Fotografia': {
    name: 'Eventos, Festas & Fotografia',
    iconName: 'PartyPopper',
    color: '#EC4899', // Rosa Festa
    bgLight: '#FDF2F8',
    iconComponent: PartyPopper,
    emoji: '🎉',
  },

  // Legacy mappings for backward compatibility
  'Gastronomia & Açaí': {
    name: 'Gastronomia & Açaí',
    iconName: 'UtensilsCrossed',
    color: '#C1502E',
    bgLight: '#FDF2EF',
    iconComponent: UtensilsCrossed,
    emoji: '🍽️',
  },
  'Moda & Praia': {
    name: 'Moda & Praia',
    iconName: 'Shirt',
    color: '#0B3D91',
    bgLight: '#EFF6FF',
    iconComponent: Shirt,
    emoji: '👗',
  },
  'Artesanato Baiano': {
    name: 'Artesanato Baiano',
    iconName: 'Palette',
    color: '#E11D48',
    bgLight: '#FFF1F2',
    iconComponent: Palette,
    emoji: '🏺',
  },
  'Beleza & Barbearia': {
    name: 'Beleza & Barbearia',
    iconName: 'Scissors',
    color: '#8B5CF6',
    bgLight: '#F5F3FF',
    iconComponent: Scissors,
    emoji: '✂️',
  },
  'Mercadinhos & Empórios': {
    name: 'Mercadinhos & Empórios',
    iconName: 'ShoppingBag',
    color: '#059669',
    bgLight: '#ECFDF5',
    iconComponent: ShoppingBag,
    emoji: '🛒',
  },
  'Esportes & Aventura': {
    name: 'Esportes & Aventura',
    iconName: 'Waves',
    color: '#0284C7',
    bgLight: '#F0F9FF',
    iconComponent: Waves,
    emoji: '🏄‍♂️',
  },
  'Serviços & Reparos': {
    name: 'Serviços & Reparos',
    iconName: 'Wrench',
    color: '#475569',
    bgLight: '#F8FAFC',
    iconComponent: Wrench,
    emoji: '🔧',
  },
  'Saúde & Bem-Estar': {
    name: 'Saúde & Bem-Estar',
    iconName: 'Leaf',
    color: '#1F6E43',
    bgLight: '#EDF7F1',
    iconComponent: Leaf,
    emoji: '🌿',
  },
};

export const getCategoryIcon = (
  category: string,
  options: {
    size?: number;
    className?: string;
    strokeWidth?: number;
    color?: string;
  } = {}
) => {
  const { size = 20, className = '', strokeWidth = 1.5, color } = options;
  const meta = CATEGORY_VISUALS[category as StoreCategory];

  if (meta) {
    const IconComp = meta.iconComponent;
    return (
      <IconComp
        size={size}
        strokeWidth={strokeWidth}
        className={className}
        color={color || meta.color}
      />
    );
  }

  return (
    <StoreIcon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      color={color || '#0B3D91'}
    />
  );
};

export const getCategoryEmoji = (category: string): string => {
  const meta = CATEGORY_VISUALS[category as StoreCategory];
  return meta ? meta.emoji : '📍';
};
