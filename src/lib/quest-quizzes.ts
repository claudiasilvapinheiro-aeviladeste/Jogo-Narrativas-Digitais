// Sample quiz questions for the 30 example missions (pt-PT, ages 8–9).
// Each entry: [question, options, index of the correct option].

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

type Q = [string, [string, string, string], number];

const RAW: Q[][] = [
  // 1 O Mapa da Coruja
  [
    ["O que é uma personagem?", ["Quem participa na história", "O título do livro", "O nome do autor"], 0],
    ["Onde aparece o título de um livro?", ["Na última página", "Na capa", "Dentro de cada capítulo"], 1],
    ["Como se chama quem escreve um livro?", ["Ilustrador", "Leitor", "Autor"], 2],
  ],
  // 2 As Bolotas Mágicas
  [
    ["Quanto é 25 + 30?", ["55", "45", "65"], 0],
    ["Quanto é 40 + 38?", ["68", "78", "88"], 1],
    ["Quanto é 19 + 21?", ["30", "41", "40"], 2],
  ],
  // 3 Folhas Misteriosas
  [
    ["De que precisam as plantas para fazer o seu alimento?", ["Luz do sol, água e ar", "Apenas pedras", "Apenas sombra"], 0],
    ["Que parte da planta fica normalmente debaixo da terra?", ["A flor", "A raiz", "A folha"], 1],
    ["No outono, muitas folhas…", ["ficam azuis", "crescem mais", "mudam de cor e caem"], 2],
  ],
  // 4 A Carta do Esquilo
  [
    ["Como começa normalmente uma carta?", ["Com uma saudação, como «Querido…»", "Com a assinatura", "Com um ponto final"], 0],
    ["Uma frase completa termina com…", ["uma vírgula", "um sinal de pontuação, como o ponto final", "um hífen"], 1],
    ["Onde escrevemos quem enviou a carta?", ["No meio do texto", "No título", "Na assinatura, no fim"], 2],
  ],
  // 5 A Ponte dos Números
  [
    ["Quanto é 2 × 7?", ["14", "12", "16"], 0],
    ["Quanto é 5 × 6?", ["25", "30", "35"], 1],
    ["Que número vem a seguir: 5, 10, 15, …?", ["16", "25", "20"], 2],
  ],
  // 6 O Ciclo da Água
  [
    ["Quando o sol aquece a água do mar, ela…", ["evapora e sobe para o céu", "fica mais salgada", "congela"], 0],
    ["As nuvens são feitas de…", ["algodão", "pequenas gotas de água", "fumo"], 1],
    ["Quando as gotas das nuvens ficam pesadas, cai…", ["areia", "fumo", "chuva"], 2],
  ],
  // 7 Palavras Escondidas
  [
    ["Qual destas palavras é um nome?", ["gato", "bonito", "correr"], 0],
    ["Qual destas palavras é um adjetivo?", ["mesa", "alegre", "saltar"], 1],
    ["Na frase «O cão castanho ladra», qual é o adjetivo?", ["cão", "ladra", "castanho"], 2],
  ],
  // 8 O Mercado dos Duendes
  [
    ["Quantos cêntimos tem 1 euro?", ["100", "10", "50"], 0],
    ["Pagas 1 € por algo que custa 80 cêntimos. Quanto recebes de troco?", ["10 cêntimos", "20 cêntimos", "30 cêntimos"], 1],
    ["Duas moedas de 50 cêntimos valem…", ["50 cêntimos", "2 euros", "1 euro"], 2],
  ],
  // 9 Os Animais da Floresta
  [
    ["O coelho é um…", ["mamífero", "réptil", "inseto"], 0],
    ["Quantas patas tem um inseto?", ["4", "6", "8"], 1],
    ["Qual destes animais é uma ave?", ["lagartixa", "raposa", "coruja"], 2],
  ],
  // 10 O Portão de Musgo
  [
    ["Em que parte da história conhecemos as personagens?", ["No princípio", "No fim", "Em nenhuma"], 0],
    ["Em que parte costuma acontecer o problema ou a aventura?", ["Na capa", "No meio", "No índice"], 1],
    ["Como se chama a parte em que o problema fica resolvido?", ["Princípio", "Título", "Fim"], 2],
  ],
  // 11 Cristais em Grupos
  [
    ["24 cristais em grupos de 2 fazem quantos grupos?", ["12", "10", "14"], 0],
    ["24 cristais em grupos de 4 fazem quantos grupos?", ["4", "6", "8"], 1],
    ["24 cristais em grupos de 6 fazem quantos grupos?", ["6", "3", "4"], 2],
  ],
  // 12 Luz e Sombra
  [
    ["Uma sombra forma-se quando um objeto…", ["tapa a luz", "brilha", "fica molhado"], 0],
    ["Se aproximares a lanterna do objeto, a sombra fica…", ["mais pequena", "maior", "invisível"], 1],
    ["Ao meio-dia, com o sol bem alto, as sombras são…", ["muito compridas", "coloridas", "curtas"], 2],
  ],
  // 13 O Eco Poeta
  [
    ["Que palavra rima com «cristal»?", ["natal", "pedra", "luz"], 0],
    ["Que palavra rima com «brilhar»?", ["cristal", "cantar", "noite"], 1],
    ["Cada linha de um poema chama-se…", ["parágrafo", "capítulo", "verso"], 2],
  ],
  // 14 Medir o Túnel
  [
    ["Quantos centímetros tem 1 metro?", ["100", "10", "1000"], 0],
    ["Para medir um lápis usamos…", ["quilómetros", "centímetros", "litros"], 1],
    ["Qual destes objetos é o mais comprido?", ["uma borracha", "um lápis", "uma mesa"], 2],
  ],
  // 15 Rochas e Minerais
  [
    ["Uma rocha muito dura é difícil de…", ["riscar", "ver", "tocar"], 0],
    ["Qual destas é uma rocha?", ["madeira", "granito", "plástico"], 1],
    ["A textura de uma pedra diz-nos se ela é…", ["pesada ou leve", "quente ou fria", "lisa ou rugosa"], 2],
  ],
  // 16 O Diário do Mineiro
  [
    ["Num diário escrevemos…", ["o que nos aconteceu no dia", "receitas de bolos", "só números"], 0],
    ["Uma página de diário costuma começar com…", ["o nome do livro", "a data", "um poema"], 1],
    ["Quem escreve um diário fala de si usando…", ["«ele»", "«tu»", "«eu»"], 2],
  ],
  // 17 O Relógio de Cristal
  [
    ["O ponteiro grande está no 12 e o pequeno no 3. Que horas são?", ["3 horas", "12 horas", "3 e meia"], 0],
    ["Meia hora são quantos minutos?", ["15", "30", "60"], 1],
    ["Um quarto de hora são…", ["30 minutos", "45 minutos", "15 minutos"], 2],
  ],
  // 18 Estados da Água
  [
    ["O gelo é água no estado…", ["sólido", "líquido", "gasoso"], 0],
    ["Quando o gelo aquece, ele…", ["fica mais duro", "derrete", "fica azul"], 1],
    ["O vapor de água é água no estado…", ["sólido", "líquido", "gasoso"], 2],
  ],
  // 19 Frações de Gemas
  [
    ["Divides uma pizza em 2 partes iguais. Cada parte é…", ["uma metade", "um terço", "um quarto"], 0],
    ["Quantos quartos fazem uma pizza inteira?", ["2", "4", "3"], 1],
    ["O que é maior: uma metade ou um quarto da mesma pizza?", ["um quarto", "são iguais", "uma metade"], 2],
  ],
  // 20 A Porta das Adivinhas
  [
    ["Uma adivinha é…", ["uma pergunta com pistas para descobrir algo", "uma conta de somar", "um desenho"], 0],
    ["«Tem dentes mas não morde.» O que é?", ["um cão", "um pente", "uma maçã"], 1],
    ["«Cai do céu e molha o chão.» O que é?", ["o sol", "o vento", "a chuva"], 2],
  ],
  // 21 Nuvens e Vento
  [
    ["Um cata-vento roda quando…", ["sopra o vento", "está sol", "está escuro"], 0],
    ["O vento é…", ["água a cair", "ar em movimento", "luz do sol"], 1],
    ["Que objeto mostra para onde sopra o vento?", ["um termómetro", "uma régua", "um cata-vento"], 2],
  ],
  // 22 Escadas para o Céu
  [
    ["Quanto é 500 − 200?", ["300", "200", "700"], 0],
    ["Quanto é 750 − 50?", ["650", "700", "800"], 1],
    ["Quanto é 1000 − 1?", ["900", "990", "999"], 2],
  ],
  // 23 A Biblioteca Flutuante
  [
    ["Ao apresentar um livro, devemos dizer…", ["o título e de que trata", "só o número de páginas", "nada"], 0],
    ["Quem faz os desenhos de um livro é o…", ["autor", "ilustrador", "leitor"], 1],
    ["Para falar bem à turma, devemos…", ["falar muito baixinho", "virar as costas", "olhar para a turma e falar claro"], 2],
  ],
  // 24 O Sistema Solar
  [
    ["Qual é o planeta mais perto do Sol?", ["Mercúrio", "Terra", "Júpiter"], 0],
    ["Em que planeta vivemos?", ["Marte", "Terra", "Vénus"], 1],
    ["Qual é o maior planeta do Sistema Solar?", ["Mercúrio", "Marte", "Júpiter"], 2],
  ],
  // 25 Formas da Torre
  [
    ["Quantos lados tem um triângulo?", ["3", "4", "5"], 0],
    ["Que forma tem 4 lados iguais?", ["círculo", "quadrado", "triângulo"], 1],
    ["Que forma não tem lados nem cantos?", ["retângulo", "triângulo", "círculo"], 2],
  ],
  // 26 A Mensagem do Dragão
  [
    ["Quando lemos uma frase com ponto de interrogação (?), a voz…", ["sobe, como numa pergunta", "fica calada", "fica sempre igual"], 0],
    ["Numa vírgula, fazemos…", ["uma pausa longa", "uma pequena pausa", "um grito"], 1],
    ["O ponto de exclamação (!) mostra…", ["uma pergunta", "o fim do livro", "emoção, como surpresa ou alegria"], 2],
  ],
  // 27 Plantas nas Nuvens
  [
    ["De que precisa um feijão para germinar?", ["água e calor", "só escuridão", "sal"], 0],
    ["A primeira parte a sair da semente é normalmente…", ["a flor", "a raiz", "o fruto"], 1],
    ["As plantas crescem em direção…", ["ao chão", "à parede", "à luz"], 2],
  ],
  // 28 O Tesouro das Moedas
  [
    ["Quanto é 3 × 4?", ["12", "7", "14"], 0],
    ["Quanto é 6 × 5?", ["25", "30", "35"], 1],
    ["7 baús com 5 moedas cada têm…", ["30 moedas", "40 moedas", "35 moedas"], 2],
  ],
  // 29 A Lenda da Turma
  [
    ["Uma lenda é…", ["uma história antiga e maravilhosa", "uma receita", "uma notícia de hoje"], 0],
    ["Cada frase começa com…", ["letra minúscula", "letra maiúscula", "um número"], 1],
    ["Para escrever em grupo, é importante…", ["falarem todos ao mesmo tempo", "só um decidir tudo", "ouvir as ideias de todos"], 2],
  ],
  // 30 O Farol das Estrelas
  [
    ["Antes de uma experiência, fazemos…", ["uma previsão do que vai acontecer", "a conclusão", "uma festa"], 0],
    ["Para registar o que observamos, podemos…", ["esquecer", "desenhar e escrever", "adivinhar"], 1],
    ["Um farol serve para…", ["fazer chuva", "guardar livros", "guiar os barcos à noite"], 2],
  ],
];

export function sampleQuiz(index: number): QuizQuestion[] {
  return (RAW[index] ?? []).map(([question, options, answer]) => ({
    question,
    options: [...options],
    answer,
  }));
}
