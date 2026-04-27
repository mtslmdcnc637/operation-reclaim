import { Mission, Achievement, Rank, Addiction, PricingPlan } from '@/types';

// ==================== ADDICTIONS ====================

export const ADDICTIONS: Addiction[] = [
  {
    id: 'socialMedia',
    name: 'Redes Sociais',
    icon: '📱',
    description: 'O ladrão invisível do tempo. Infinite scroll, FOMO, dopamina barata.',
    power: 100,
    color: '#3b82f6',
  },
  {
    id: 'pornography',
    name: 'Pornografia',
    icon: '🔞',
    description: 'O inimigo silencioso. Destrói dopamina real e conexões genuínas.',
    power: 100,
    color: '#ef4444',
  },
  {
    id: 'games',
    name: 'Jogos',
    icon: '🎮',
    description: 'Conquistas virtuais que substituem as reais. O escapismo perfeito.',
    power: 100,
    color: '#8b5cf6',
  },
];

// ==================== MISSIONS ====================

export const MISSION_POOL: Mission[] = [
  { id: 'M01', title: 'Desinstale um app de rede social por 24h', description: 'Remova o gatilho. Instagram, TikTok, Twitter — escolha um e desinstale.', difficulty: 'hard', xp: 150, addiction: 'socialMedia', damage: 5 },
  { id: 'M02', title: 'Modo avião por 1h — leia um livro', description: 'Desconecte do mundo digital e reconecte com o real.', difficulty: 'medium', xp: 100, addiction: 'socialMedia', damage: 3 },
  { id: 'M03', title: 'Bloqueie um site gatilho com blocker', description: 'Use um blocker para impedir acesso a sites que te puxam de volta.', difficulty: 'medium', xp: 120, addiction: 'pornography', damage: 4 },
  { id: 'M04', title: 'Escreva "Eu sou alguém que..."', description: 'Complete a frase com a identidade que você quer construir.', difficulty: 'easy', xp: 80, addiction: 'socialMedia', damage: 2 },
  { id: 'M05', title: '20 flexões quando sentir vontade de jogar', description: 'Substitua o impulso por ação física. O corpo responde.', difficulty: 'medium', xp: 100, addiction: 'games', damage: 3 },
  { id: 'M06', title: 'Meditação de 10 minutos', description: 'Sente. Feche os olhos. Observe os pensamentos sem julgar.', difficulty: 'easy', xp: 90, addiction: 'pornography', damage: 2 },
  { id: 'M07', title: 'Caminhe 30min sem celular', description: 'Deixe o celular em casa. Caminhe. Observe o mundo ao redor.', difficulty: 'medium', xp: 110, addiction: 'socialMedia', damage: 3 },
  { id: 'M08', title: 'Comece tarefa importante (2min rule)', description: 'Comprometa-se com apenas 2 minutos. O resto vem por inércia.', difficulty: 'easy', xp: 70, addiction: 'games', damage: 2 },
  { id: 'M09', title: 'Sem telas após 22h', description: 'Desligue tudo. O cérebro precisa de silêncio para se reconstruir.', difficulty: 'hard', xp: 130, addiction: 'socialMedia', damage: 4 },
  { id: 'M10', title: 'Journaling: 3 gratidões + 1 lição', description: 'Escreva o que te fez grato hoje e o que aprendeu.', difficulty: 'easy', xp: 80, addiction: 'pornography', damage: 2 },
  { id: 'M11', title: 'Remova gatilhos visuais do ambiente', description: 'Identifique e remova objetos que te lembram do vício.', difficulty: 'medium', xp: 120, addiction: 'pornography', damage: 4 },
  { id: 'M12', title: 'Conversa real de 15min com alguém', description: 'Sem celular. Olho no olho. Conexão humana real.', difficulty: 'medium', xp: 100, addiction: 'games', damage: 3 },
  { id: 'M13', title: 'Banho frio de 2 minutos', description: 'Disciplina começa no desconforto. Enfrente o frio.', difficulty: 'hard', xp: 140, addiction: 'games', damage: 4 },
  { id: 'M14', title: 'Estude algo novo por 30 minutos', description: 'Substitua o consumo passivo por aprendizado ativo.', difficulty: 'medium', xp: 110, addiction: 'games', damage: 3 },
  { id: 'M15', title: 'Digital detox: sem redes o dia inteiro', description: 'Um dia completo. Sem feeds, sem stories, sem likes.', difficulty: 'hard', xp: 200, addiction: 'socialMedia', damage: 6 },
  { id: 'M16', title: 'Crie e siga uma rotina matinal', description: 'Manhãs intencionais criam dias intencionais.', difficulty: 'medium', xp: 100, addiction: 'socialMedia', damage: 3 },
  { id: 'M17', title: 'Conte sobre seu vício a alguém de confiança', description: 'Vulnerabilidade é coragem. Compartilhe sua luta.', difficulty: 'hard', xp: 150, addiction: 'pornography', damage: 5 },
  { id: 'M18', title: 'Exercício físico de 45 minutos', description: 'Corpo forte, mente forte. Movimento é resistência.', difficulty: 'medium', xp: 130, addiction: 'games', damage: 4 },
];

// ==================== ACHIEVEMENTS ====================

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'A01', name: 'Primeiro Passo', description: 'Complete seu primeiro dia no sistema.', condition: 'totalDays ≥ 1', xp: 100, rarity: 'common', icon: '👣' },
  { id: 'A02', name: 'Iniciante', description: 'Complete sua primeira missão.', condition: 'totalMissions ≥ 1', xp: 100, rarity: 'common', icon: '⚔️' },
  { id: 'A03', name: 'Guerreiro Semanal', description: 'Mantenha um streak de 7 dias.', condition: 'streak ≥ 7', xp: 300, rarity: 'uncommon', icon: '🔥' },
  { id: 'A04', name: 'Mestre Mensal', description: 'Mantenha um streak de 30 dias.', condition: 'streak ≥ 30', xp: 1000, rarity: 'rare', icon: '👑' },
  { id: 'A05', name: 'Em Progresso', description: 'Alcance o nível 5.', condition: 'level ≥ 5', xp: 200, rarity: 'common', icon: '📈' },
  { id: 'A06', name: 'Duplo Dígito', description: 'Alcance o nível 10.', condition: 'level ≥ 10', xp: 500, rarity: 'uncommon', icon: '🔟' },
  { id: 'A07', name: 'Veterano', description: 'Alcance o nível 20.', condition: 'level ≥ 20', xp: 1000, rarity: 'rare', icon: '🏅' },
  { id: 'A08', name: 'Militante', description: 'Complete 10 missões.', condition: 'totalMissions ≥ 10', xp: 300, rarity: 'common', icon: '💪' },
  { id: 'A09', name: 'Máquina de Guerra', description: 'Complete 50 missões.', condition: 'totalMissions ≥ 50', xp: 800, rarity: 'uncommon', icon: '⚙️' },
  { id: 'A10', name: 'Caçador', description: 'Reduza qualquer vício abaixo de 50%.', condition: 'any addiction < 50%', xp: 400, rarity: 'uncommon', icon: '🎯' },
  { id: 'A11', name: 'Exterminador', description: 'Derrote completamente um inimigo.', condition: 'any addiction ≤ 0%', xp: 1500, rarity: 'epic', icon: '💀' },
  { id: 'A12', name: 'Perfeccionista', description: 'Complete todas as missões do dia.', condition: 'All daily missions', xp: 500, rarity: 'uncommon', icon: '✨' },
];

// ==================== RANKS ====================

export const RANKS: Rank[] = [
  { minLevel: 1, maxLevel: 2, rank: 'Recruta', title: 'O Primeiro Passo', color: '#6b7280' },
  { minLevel: 3, maxLevel: 5, rank: 'Operativo', title: 'Em Treinamento', color: '#e5e7eb' },
  { minLevel: 6, maxLevel: 9, rank: 'Agente', title: 'O Despertar', color: '#3b82f6' },
  { minLevel: 10, maxLevel: 14, rank: 'Especialista', title: 'Domínio Inicial', color: '#22c55e' },
  { minLevel: 15, maxLevel: 19, rank: 'Comandante', title: 'Liderança Própria', color: '#eab308' },
  { minLevel: 20, maxLevel: 29, rank: 'Diretor', title: 'Controle Total', color: '#f59e0b' },
  { minLevel: 30, maxLevel: 39, rank: 'Fantasma', title: 'Invisível ao Vício', color: '#a855f7' },
  { minLevel: 40, maxLevel: 49, rank: 'Lenda', title: 'Inspiração Viva', color: '#ef4444' },
  { minLevel: 50, maxLevel: 50, rank: 'Mito', title: 'Lenda Absoluta', color: '#dc2626' },
];

// ==================== MULTIPLIERS ====================

export const STREAK_MULTIPLIERS = [
  { minDays: 0, maxDays: 7, multiplier: 1.0, label: 'Normal' },
  { minDays: 8, maxDays: 14, multiplier: 1.5, label: 'Focado' },
  { minDays: 15, maxDays: 30, multiplier: 2.0, label: 'Determinado' },
  { minDays: 31, maxDays: 999, multiplier: 3.0, label: 'Implacável' },
];

// ==================== PRICING ====================

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'recruta',
    name: 'Recruta',
    rank: 'Nível 1',
    price: 0,
    currency: 'BRL',
    interval: 'month',
    missionsPerDay: 3,
    features: [
      '3 missões por dia',
      'Rastreamento de 3 vícios',
      'Sistema de XP básico',
      'Check-in diário',
      'Conquistas básicas',
    ],
  },
  {
    id: 'agente',
    name: 'Agente',
    rank: 'Nível 6',
    price: 29,
    currency: 'BRL',
    interval: 'month',
    missionsPerDay: 5,
    popular: true,
    features: [
      '5 missões por dia',
      'Modo de Emergência',
      'Estatísticas semanais',
      'Personalização de avatar',
      'Diário de reflexão',
      'Multiplicadores avançados',
    ],
  },
  {
    id: 'diretor',
    name: 'Diretor',
    rank: 'Nível 20',
    price: 79,
    currency: 'BRL',
    interval: 'month',
    missionsPerDay: 'unlimited',
    features: [
      'Missões ilimitadas',
      'Coach virtual com IA',
      'Modo Accountability',
      'Missões customizadas',
      'Acesso à comunidade secreta',
      'Ranking global',
      'Suporte prioritário',
    ],
  },
];

// ==================== QUOTES ====================

export const DAILY_QUOTES = [
  { text: 'Toda pessoa que encontrei tem um vício. A diferença está em quem decide lutar.', author: 'Operation Reclaim' },
  { text: 'Você não está no controle. Eles estão.', author: 'O Protocolo' },
  { text: 'A batalha mais difícil é contra o homem que você era.', author: 'Operation Reclaim' },
  { text: 'Cada dia de resistência enfraquece o inimigo.', author: 'O Protocolo' },
  { text: 'Não é sobre força de vontade. É sobre sistema.', author: 'James Clear' },
  { text: 'Você é a média das 5 coisas que consome todos os dias.', author: 'Operation Reclaim' },
  { text: 'O inimigo conta cada segundo que você cede. Comece a contar os que você retoma.', author: 'O Protocolo' },
  { text: 'Identidade não é o que você diz. É o que você faz repetidamente.', author: 'Operation Reclaim' },
  { text: 'A dopamina barata custa caro. Pague com disciplina agora ou com arrependimento depois.', author: 'O Protocolo' },
  { text: 'Quem controla seus gatilhos, controla sua vida. Retome o controle.', author: 'Operation Reclaim' },
];

// ==================== EMERGENCY QUOTES ====================

export const EMERGENCY_QUOTES = [
  'A vontade é uma onda. Ela vai passar. Resista.',
  'Você não precisa disso. Você precisa de 10 minutos.',
  'Lembre-se de quem você quer ser. Essa pessoa não cede agora.',
  'O inimigo está desesperado. Ele sabe que está perdendo.',
  'Cada segundo de resistência é uma vitória.',
  'Respire. 4 segundos. 7 segundos. 8 segundos.',
  'Você já sobreviveu 100% dos seus piores dias. Este é só mais um.',
  'A recaída dura minutos. O arrependimento dura dias.',
];
