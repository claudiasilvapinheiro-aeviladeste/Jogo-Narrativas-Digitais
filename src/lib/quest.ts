// Pure game rules for the classroom quest. No React, no browser APIs.

export type ZoneId = "forest" | "caverns" | "citadel";
export type PresetId = "math" | "reading" | "science";
export type CheckpointStatus = "locked" | "active" | "completed";

export interface Zone {
  id: ZoneId;
  name: string;
  shortName: string;
  lore: string;
}

export interface Checkpoint {
  id: string;
  zone: ZoneId;
  week: number; // 1-based, one mission per week
  title: string;
  description: string;
  preset: PresetId | null;
  image: string | null; // data URL of the uploaded worksheet
  imageName: string | null;
  lore: string;
}

export interface QuestState {
  version: 1;
  className: string;
  completed: number; // how many missions are done, in order
  checkpoints: Checkpoint[];
}

export const MISSIONS_PER_ZONE = 10;
export const POINTS_PER_MISSION = 50;
export const ZONE_BONUS = 150;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ZONES: Zone[] = [
  {
    id: "forest",
    name: "A Floresta dos Sussurros",
    shortName: "Floresta dos Sussurros",
    lore: "Diz-se que as árvores antigas respondem a quem fala com bondade.",
  },
  {
    id: "caverns",
    name: "As Cavernas de Cristal",
    shortName: "Cavernas de Cristal",
    lore: "Cada resposta certa acende um cristal novo nas paredes da caverna.",
  },
  {
    id: "citadel",
    name: "A Cidadela do Céu",
    shortName: "Cidadela do Céu",
    lore: "A Cidadela só se revela a turmas que nunca desistem.",
  },
];

export const PRESETS: Record<PresetId, { label: string; title: string; description: string }> = {
  math: {
    label: "Desafio de Matemática",
    title: "Desafio de Matemática",
    description: "Resolvam em equipa 5 problemas de matemática da aula de hoje.",
  },
  reading: {
    label: "Leitura em Grupo",
    title: "Leitura em Grupo",
    description: "Leiam juntos um texto e respondam a 3 perguntas sobre a história.",
  },
  science: {
    label: "Laboratório de Ciências",
    title: "Laboratório de Ciências",
    description: "Façam uma pequena experiência e registem o que observaram.",
  },
};

type Sample = [PresetId, string, string, string];

const SAMPLE_MISSIONS: Sample[] = [
  // Floresta dos Sussurros
  ["reading", "O Mapa da Coruja", "Leiam juntos o primeiro capítulo do livro da turma e digam quem são as personagens.", "A coruja Lumi encontrou um mapa antigo escondido num tronco oco."],
  ["math", "As Bolotas Mágicas", "Resolvam 5 contas de somar até 100 para encher o cesto de bolotas.", "Cada bolota brilha quando alguém resolve uma conta certa."],
  ["science", "Folhas Misteriosas", "Recolham 3 folhas diferentes e descrevam a forma e a cor de cada uma.", "As folhas da floresta mudam de cor quando ouvem uma boa ideia."],
  ["reading", "A Carta do Esquilo", "Escrevam uma pequena carta ao esquilo guardião com 3 frases completas.", "O esquilo guardião coleciona cartas desde o tempo dos reis."],
  ["math", "A Ponte dos Números", "Completem a tabuada do 2 e do 5 para atravessar a ponte.", "A ponte só aparece a quem sabe contar de 2 em 2 e de 5 em 5."],
  ["science", "O Ciclo da Água", "Desenhem o ciclo da água: evaporação, nuvem, chuva e rio.", "A chuva da floresta vem de uma nuvem que adora cantar."],
  ["reading", "Palavras Escondidas", "Encontrem 10 nomes e 5 adjetivos num texto da aula.", "As palavras perdidas transformam-se em pirilampos."],
  ["math", "O Mercado dos Duendes", "Façam trocos com moedas de 1 €, 50 e 20 cêntimos em 4 compras.", "Os duendes pagam tudo com botões dourados."],
  ["science", "Os Animais da Floresta", "Classifiquem 6 animais: mamíferos, aves, répteis ou insetos.", "O veado prateado só aparece a quem respeita a floresta."],
  ["reading", "O Portão de Musgo", "Contem a história da semana com princípio, meio e fim.", "O portão de musgo abriu-se: o caminho para as Cavernas de Cristal está livre!"],
  // Cavernas de Cristal
  ["math", "Cristais em Grupos", "Organizem 24 cristais em grupos iguais de 2, 3, 4 e 6.", "Os cristais cantam baixinho quando estão bem arrumados."],
  ["science", "Luz e Sombra", "Usem uma lanterna para ver como a sombra muda de tamanho.", "Nas cavernas, as sombras contam histórias antigas."],
  ["reading", "O Eco Poeta", "Inventem um poema de 4 versos com rimas sobre cristais.", "O eco só repete os poemas mais bonitos."],
  ["math", "Medir o Túnel", "Meçam 5 objetos da sala em centímetros e ponham-nos por ordem.", "O túnel tem exatamente 1000 passos de coruja."],
  ["science", "Rochas e Minerais", "Comparem 3 pedras: dureza, cor e textura.", "Um mineral raro brilha com todas as cores do arco-íris."],
  ["reading", "O Diário do Mineiro", "Leiam uma página de diário e respondam a 3 perguntas.", "O velho mineiro deixou um diário cheio de pistas."],
  ["math", "O Relógio de Cristal", "Leiam 6 horas no relógio: horas certas, meias horas e quartos.", "O relógio de cristal marca o tempo das estrelas."],
  ["science", "Estados da Água", "Observem gelo a derreter e registem quanto tempo demora.", "No fundo da caverna há um lago que nunca congela."],
  ["math", "Frações de Gemas", "Dividam uma pizza de papel em metades, terços e quartos.", "As gemas partem-se em pedaços iguais, como por magia."],
  ["reading", "A Porta das Adivinhas", "Criem 3 adivinhas e desafiem outra equipa.", "A porta das adivinhas abriu-se: o caminho para o céu está livre!"],
  // Cidadela do Céu
  ["science", "Nuvens e Vento", "Construam um cata-vento e testem-no no recreio.", "A Cidadela flutua graças a um vento muito bem-educado."],
  ["math", "Escadas para o Céu", "Resolvam 5 problemas de subtração com números até 1000.", "Cada degrau da escada esconde um número secreto."],
  ["reading", "A Biblioteca Flutuante", "Escolham um livro e apresentem-no à turma em 1 minuto.", "Os livros da biblioteca voam até quem os quer ler."],
  ["science", "O Sistema Solar", "Ordenem os planetas do mais perto ao mais longe do Sol.", "Da torre mais alta vê-se Saturno a sorrir."],
  ["math", "Formas da Torre", "Encontrem 4 formas geométricas na sala e contem os lados.", "As torres foram construídas com triângulos e quadrados."],
  ["reading", "A Mensagem do Dragão", "Leiam um texto em voz alta com boa entoação.", "O dragão das nuvens só fala com quem lê com alegria."],
  ["science", "Plantas nas Nuvens", "Semeiem um feijão e registem o crescimento durante a semana.", "O jardim suspenso cresce com gargalhadas."],
  ["math", "O Tesouro das Moedas", "Usem a multiplicação para contar o tesouro: 3×4, 6×5 e 7×2.", "O tesouro está guardado em 7 baús com 5 moedas cada."],
  ["reading", "A Lenda da Turma", "Escrevam juntos a lenda da vossa aventura em 5 frases.", "A vossa lenda ficou gravada nas paredes da Cidadela."],
  ["science", "O Farol das Estrelas", "Mostrem à turma a experiência favorita do ano.", "O farol acendeu-se: a turma salvou o reino!"],
];

export const TOTAL_MISSIONS = ZONES.length * MISSIONS_PER_ZONE;

export function createInitialQuest(className = "4.º B"): QuestState {
  return {
    version: 1,
    className,
    completed: 0,
    checkpoints: SAMPLE_MISSIONS.map(([preset, title, description, lore], i) => ({
      id: `cp-${i + 1}`,
      zone: ZONES[Math.floor(i / MISSIONS_PER_ZONE)]!.id,
      week: i + 1,
      title,
      description,
      preset,
      image: null,
      imageName: null,
      lore,
    })),
  };
}

export function statusOf(state: QuestState, index: number): CheckpointStatus {
  if (index < state.completed) return "completed";
  if (index === state.completed) return "active";
  return "locked";
}

export function zoneIndex(zone: ZoneId): number {
  return ZONES.findIndex((z) => z.id === zone);
}

export function isZoneUnlocked(state: QuestState, zone: ZoneId): boolean {
  return state.completed >= zoneIndex(zone) * MISSIONS_PER_ZONE;
}

export function zonesCleared(completed: number): number {
  return Math.floor(completed / MISSIONS_PER_ZONE);
}

export function scoreFor(completed: number): number {
  return completed * POINTS_PER_MISSION + zonesCleared(completed) * ZONE_BONUS;
}

export function progressPercent(state: QuestState): number {
  return Math.round((state.completed / state.checkpoints.length) * 100);
}

export function isQuestComplete(state: QuestState): boolean {
  return state.completed >= state.checkpoints.length;
}

export function hasTask(cp: Pick<Checkpoint, "description">): boolean {
  return cp.description.trim().length > 0;
}

export type CompleteResult =
  | { ok: false; reason: "missing-task" | "already-complete" }
  | {
      ok: true;
      state: QuestState;
      completedIndex: number;
      pointsEarned: number;
      zoneCleared: ZoneId | null;
      zoneEntered: ZoneId | null;
      questComplete: boolean;
    };

export function completeActive(state: QuestState): CompleteResult {
  if (isQuestComplete(state)) return { ok: false, reason: "already-complete" };
  const index = state.completed;
  const cp = state.checkpoints[index]!;
  if (!hasTask(cp)) return { ok: false, reason: "missing-task" };

  const nextCompleted = index + 1;
  const next: QuestState = { ...state, completed: nextCompleted };
  const clearedZone = nextCompleted % MISSIONS_PER_ZONE === 0 ? cp.zone : null;
  const questComplete = nextCompleted === state.checkpoints.length;
  const enteredZone =
    clearedZone && !questComplete ? state.checkpoints[nextCompleted]!.zone : null;

  return {
    ok: true,
    state: next,
    completedIndex: index,
    pointsEarned: scoreFor(nextCompleted) - scoreFor(index),
    zoneCleared: clearedZone,
    zoneEntered: enteredZone,
    questComplete,
  };
}

export function updateCheckpoint(
  state: QuestState,
  id: string,
  patch: Partial<Pick<Checkpoint, "title" | "description" | "preset" | "image" | "imageName">>,
): QuestState {
  return {
    ...state,
    checkpoints: state.checkpoints.map((cp) => (cp.id === id ? { ...cp, ...patch } : cp)),
  };
}

export function restartJourney(state: QuestState): QuestState {
  return { ...state, completed: 0 };
}

export function blankParchment(state: QuestState): QuestState {
  return {
    ...state,
    completed: 0,
    checkpoints: state.checkpoints.map((cp) => ({
      ...cp,
      title: "",
      description: "",
      preset: null,
      image: null,
      imageName: null,
    })),
  };
}

export function isParchmentEmpty(state: QuestState): boolean {
  return state.checkpoints.every((cp) => !cp.title.trim() && !cp.description.trim());
}

export type UploadError = "too-large" | "not-image";

export function validateUpload(file: { size: number; type: string }): UploadError | null {
  if (!file.type.startsWith("image/")) return "not-image";
  if (file.size > MAX_UPLOAD_BYTES) return "too-large";
  return null;
}

/** Accept only well-formed saved state; anything else falls back to a fresh quest. */
export function parseSavedQuest(raw: string | null): QuestState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<QuestState>;
    if (data.version !== 1 || !Array.isArray(data.checkpoints)) return null;
    if (data.checkpoints.length !== TOTAL_MISSIONS) return null;
    const completed = Math.max(0, Math.min(TOTAL_MISSIONS, Number(data.completed) || 0));
    return {
      version: 1,
      className: typeof data.className === "string" ? data.className : "4.º B",
      completed,
      checkpoints: data.checkpoints as Checkpoint[],
    };
  } catch {
    return null;
  }
}

// ---------- Copy (pt-PT) ----------

export const COPY = {
  missingTask: "Todas as missões precisam de uma pista! Escreve o que os alunos têm de fazer.",
  network: "Um duende travesso emaranhou os fios da bússola! Vamos tentar outra vez.",
  uploadTooLarge: "Esse pergaminho é pesado demais para a nossa coruja-correio (Limite: 10MB).",
  uploadNotImage: "A coruja-correio só transporta imagens (JPG, PNG, GIF ou WebP).",
  checkpointCleared: "Hurra! Missão concluída! O trilho revela um novo segredo! ✨",
  zoneEntered: (cls: string, zone: string) =>
    `Que trabalho de equipa incrível! A turma ${cls} entrou n${zone.startsWith("A ") ? "a" : "as"} ${zone.replace(/^(A|As) /, "")}!`,
  questComplete: "MISSÃO CUMPRIDA! Todos os mistérios resolvidos. Hora de receber os vossos brasões!",
  emptyParchment: "O pergaminho está em branco. Clica em qualquer pedra do mapa para escrever a primeira missão!",
};

export const STATUS_LABEL: Record<CheckpointStatus, string> = {
  locked: "Bloqueada",
  active: "Missão atual",
  completed: "Concluída",
};

// ---------- Map geometry ----------

export const ZONE_WIDTH = 2000;
export const MAP_HEIGHT = 600;
export const MAP_WIDTH = ZONE_WIDTH * ZONES.length;

export function nodePosition(index: number): { x: number; y: number } {
  const z = Math.floor(index / MISSIONS_PER_ZONE);
  const i = index % MISSIONS_PER_ZONE;
  const x = z * ZONE_WIDTH + 150 + i * 190;
  const y = 345 + Math.round(115 * Math.sin(index * 0.85 + 0.6));
  return { x, y };
}

/** Smooth Catmull-Rom curve through all points, as an SVG path. */
export function trailPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  const p = [points[0]!, ...points, points[points.length - 1]!];
  let d = `M ${p[1]!.x} ${p[1]!.y}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1]!, p[i]!, p[i + 1]!, p[i + 2]!];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
}
