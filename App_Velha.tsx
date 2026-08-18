import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

// Salve a imagem do personagem em: ./assets/personagem.png
const PERSONAGEM = require('./assets/personagem.png');

// ============================================================
// JOGO DA VELHA — tema teal/creme (baseado no print enviado)
// Adiciona: placar por jogador, indicador de vez animado por
// destaque, histórico de "melhor de 5" com bolinhas, e
// mensagem de vitória/empate.
// ============================================================

type Celula = 'X' | 'O' | null;

const LINHAS_VITORIA = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export default function App() {
  const [tabuleiro, setTabuleiro] = useState<Celula[]>(Array(9).fill(null));
  const [vez, setVez] = useState<'X' | 'O'>('X');
  const [placar, setPlacar] = useState({ X: 0, O: 0 });
  const [historico, setHistorico] = useState<('X' | 'O' | 'E')[]>([]);
  const [mostrarPersonagem, setMostrarPersonagem] = useState(false);

  const vencedor = calcularVencedor(tabuleiro);
  const empate = !vencedor && tabuleiro.every((c) => c !== null);

  function calcularVencedor(t: Celula[]): 'X' | 'O' | null {
    for (const [a, b, c] of LINHAS_VITORIA) {
      if (t[a] && t[a] === t[b] && t[a] === t[c]) return t[a];
    }
    return null;
  }

  const jogar = (i: number) => {
    if (tabuleiro[i] || vencedor || empate) return;
    const novo = [...tabuleiro];
    novo[i] = vez;
    setTabuleiro(novo);

    const ganhou = calcularVencedor(novo);
    const empatou = !ganhou && novo.every((c) => c !== null);

    if (ganhou) {
      setPlacar((p) => ({ ...p, [ganhou]: p[ganhou] + 1 }));
      setHistorico((h) => [...h, ganhou].slice(-5));
    } else if (empatou) {
      setHistorico((h) => [...h, 'E' as const].slice(-5));
    }

    setVez(vez === 'X' ? 'O' : 'X');
  };

  const reiniciar = () => {
    setTabuleiro(Array(9).fill(null));
    setVez('X');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>JOGO DA VELHA</Text>
          {mostrarPersonagem && (
            <Image source={PERSONAGEM} style={styles.mascotePeek} />
          )}
        </View>

        {/* Placar */}
        <View style={styles.scoreRow}>
          <View style={[styles.scoreCard, vez === 'X' && !vencedor && !empate && styles.scoreActive]}>
            <Text style={styles.scoreSymbolX}>X</Text>
            <Text style={styles.scoreValue}>{placar.X}</Text>
          </View>
          {mostrarPersonagem && (
            <Image source={PERSONAGEM} style={styles.mascoteMeio} />
          )}
          <View style={[styles.scoreCard, vez === 'O' && !vencedor && !empate && styles.scoreActive]}>
            <Text style={styles.scoreSymbolO}>O</Text>
            <Text style={styles.scoreValue}>{placar.O}</Text>
          </View>
        </View>

        {/* Indicador de vez / resultado */}
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>
            {vencedor
              ? `🏆 ${vencedor} venceu!`
              : empate
              ? '🤝 Empate!'
              : `Vez de ${vez}`}
          </Text>
        </View>

        {/* Tabuleiro */}
        <View style={styles.board}>
          {mostrarPersonagem && (
            <Image source={PERSONAGEM} style={styles.mascoteMarcaDagua} />
          )}
          {tabuleiro.map((celula, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.cell,
                (i + 1) % 3 !== 0 && styles.cellBorderRight,
                i < 6 && styles.cellBorderBottom,
              ]}
              onPress={() => jogar(i)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.cellText,
                  celula === 'X' ? styles.cellTextX : styles.cellTextO,
                ]}
              >
                {celula}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Histórico das últimas partidas (melhor de 5) */}
        <View style={styles.historyRow}>
          {Array.from({ length: 5 }).map((_, i) => {
            const resultado = historico[i];
            return (
              <View
                key={i}
                style={[
                  styles.historyDot,
                  resultado === 'X' && styles.historyDotX,
                  resultado === 'O' && styles.historyDotO,
                  resultado === 'E' && styles.historyDotE,
                ]}
              >
                {resultado && (
                  <Text style={styles.historyDotText}>
                    {resultado === 'E' ? '–' : resultado}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Ações */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.btnSecondary} onPress={reiniciar}>
            <Text style={styles.btnSecondaryText}>NOVA RODADA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => setMostrarPersonagem((v) => !v)}
          >
            <Text style={styles.btnPrimaryText}>ESCOLHER PERSONAGEM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const TEAL = '#159D8C';
const TEAL_ESCURO = '#0E7A6C';
const CREME = '#FDF7E8';
const CARVAO = '#2B2B2B';
const OURO = '#E8B93C';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TEAL },
  container: { flex: 1, alignItems: 'center', paddingTop: 32, paddingHorizontal: 20 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    color: CREME,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  mascotePeek: {
    width: 40,
    height: 40,
    marginLeft: 8,
    marginTop: -6,
  },
  mascoteMeio: {
    width: 44,
    height: 44,
    marginHorizontal: 4,
  },
  mascoteMarcaDagua: {
    position: 'absolute',
    width: 130,
    height: 130,
    alignSelf: 'center',
    top: '50%',
    marginTop: -65,
    opacity: 0.12,
    zIndex: -1,
  },

  scoreRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  scoreCard: {
    width: 130,
    backgroundColor: CREME,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    opacity: 0.85,
  },
  scoreActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: OURO,
    transform: [{ scale: 1.04 }],
  },
  scoreSymbolX: { color: CARVAO, fontSize: 22, fontWeight: '900' },
  scoreSymbolO: { color: TEAL_ESCURO, fontSize: 22, fontWeight: '900' },
  scoreValue: { color: '#7A7A7A', fontSize: 13, fontWeight: '700', marginTop: 2 },

  statusPill: {
    backgroundColor: '#0E7A6C',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: { color: CREME, fontWeight: '700', fontSize: 14, letterSpacing: 0.5 },

  board: {
    width: 264,
    height: 264,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: CREME,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cell: {
    width: '33.333%',
    height: '33.333%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellBorderRight: { borderRightWidth: 3, borderRightColor: TEAL },
  cellBorderBottom: { borderBottomWidth: 3, borderBottomColor: TEAL },
  cellText: { fontSize: 46, fontWeight: '900' },
  cellTextX: { color: CARVAO },
  cellTextO: { color: TEAL_ESCURO },

  historyRow: { flexDirection: 'row', gap: 8, marginTop: 20, marginBottom: 22 },
  historyDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDotX: { backgroundColor: CREME },
  historyDotO: { backgroundColor: OURO },
  historyDotE: { backgroundColor: '#0E7A6C' },
  historyDotText: { fontSize: 12, fontWeight: '800', color: CARVAO },

  actionsRow: { flexDirection: 'row', gap: 10 },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: CREME,
    marginHorizontal: 5,
  },
  btnSecondaryText: { color: CREME, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  btnPrimary: {
    backgroundColor: OURO,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  btnPrimaryText: {
    color: CARVAO,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.4,
  },
});
