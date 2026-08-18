import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const PALAVRA = 'REACT'; 
const MAX_ERROS = 6;
const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function App() {
  const [acertos, setAcertos] = useState<string[]>([]);
  const [erros, setErros] = useState<string[]>([]);

  const jogar = (letra: string) => {
    if (acertos.includes(letra) || erros.includes(letra)) return;
    if (PALAVRA.includes(letra)) {
      setAcertos((prev) => [...prev, letra]);
    } else {
      setErros((prev) => [...prev, letra]);
    }
  };

  const reiniciar = () => {
    setAcertos([]);
    setErros([]);
  };

  const numErros = erros.length;
  const perdeu = numErros >= MAX_ERROS;
  const venceu = PALAVRA.split('').every((l) => acertos.includes(l));
  const fimDeJogo = perdeu || venceu;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho */}
        <Text style={styles.title}>JOGO DA FORCA</Text>

        {/* Card com o desenho da forca */}
        <View style={styles.drawingCard}>
          <View style={styles.board}>
            <View style={styles.gallowsBase} />
            <View style={styles.gallowsPole} />
            <View style={styles.gallowsTop} />
            <View style={styles.gallowsRope} />

            {numErros >= 1 && <View style={styles.head} />}
            {numErros >= 2 && <View style={styles.body} />}
            {numErros >= 3 && <View style={[styles.limb, styles.armLeft]} />}
            {numErros >= 4 && <View style={[styles.limb, styles.armRight]} />}
            {numErros >= 5 && <View style={[styles.limb, styles.legLeft]} />}
            {numErros >= 6 && <View style={[styles.limb, styles.legRight]} />}

            {numErros >= 1 && (
              <>
                <View style={[styles.eye, { left: 172 }]} />
                <View style={[styles.eye, { left: 186 }]} />
                {perdeu && <View style={styles.mouthSad} />}
              </>
            )}
          </View>
        </View>

        {/* Contador de erros */}
        <View style={styles.errorRow}>
          {Array.from({ length: MAX_ERROS }).map((_, i) => (
            <View
              key={i}
              style={[styles.errorDot, i < numErros && styles.errorDotFilled]}
            />
          ))}
        </View>

        {/* Palavra oculta — chips ao invés de linha */}
        <View style={styles.wordRow}>
          {PALAVRA.split('').map((letra, i) => {
            const revelada = acertos.includes(letra) || fimDeJogo;
            return (
              <View
                key={i}
                style={[styles.letterChip, venceu && styles.letterChipWin]}
              >
                <Text style={styles.letterText}>{revelada ? letra : ''}</Text>
              </View>
            );
          })}
        </View>

        {/* Status */}
        <View
          style={[
            styles.statusPill,
            fimDeJogo && (venceu ? styles.statusPillWin : styles.statusPillLose),
          ]}
        >
          <Text style={styles.statusText}>
            {venceu
              ? '🏆 Você acertou!'
              : perdeu
              ? `✗ Fim de jogo — era "${PALAVRA}"`
              : `Restam ${MAX_ERROS - numErros} chances`}
          </Text>
        </View>

        {/* Teclado */}
        <View style={styles.keyboard}>
          {ALFABETO.map((letra) => {
            const usada = acertos.includes(letra) || erros.includes(letra);
            const correta = acertos.includes(letra);
            return (
              <TouchableOpacity
                key={letra}
                disabled={usada || fimDeJogo}
                onPress={() => jogar(letra)}
                style={[
                  styles.key,
                  usada && (correta ? styles.keyCorrect : styles.keyWrong),
                ]}
              >
                <Text style={[styles.keyText, usada && styles.keyTextUsed]}>
                  {letra}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={reiniciar}>
          <Text style={styles.resetText}>REINICIAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const TEAL = '#159D8C';
const TEAL_ESCURO = '#0E7A6C';
const CREME = '#FDF7E8';
const CARVAO = '#2B2B2B';
const OURO = '#E8B93C';
const VERDE = '#33B05C';
const CORAL = '#E0574C';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TEAL },
  container: { padding: 24, alignItems: 'center', paddingBottom: 48 },

  title: {
    color: CREME,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 18,
  },

  drawingCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: CREME,
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  board: { width: 260, height: 200 },
  gallowsBase: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    width: 100,
    height: 4,
    backgroundColor: TEAL_ESCURO,
    borderRadius: 2,
  },
  gallowsPole: {
    position: 'absolute',
    bottom: 0,
    left: 50,
    width: 4,
    height: 190,
    backgroundColor: TEAL_ESCURO,
    borderRadius: 2,
  },
  gallowsTop: {
    position: 'absolute',
    top: 0,
    left: 50,
    width: 130,
    height: 4,
    backgroundColor: TEAL_ESCURO,
    borderRadius: 2,
  },
  gallowsRope: {
    position: 'absolute',
    top: 4,
    left: 178,
    width: 2,
    height: 22,
    backgroundColor: TEAL_ESCURO,
  },
  head: {
    position: 'absolute',
    top: 24,
    left: 158,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: OURO,
  },
  body: {
    position: 'absolute',
    top: 68,
    left: 178,
    width: 4,
    height: 56,
    backgroundColor: OURO,
    borderRadius: 2,
  },
  limb: { position: 'absolute', width: 4, backgroundColor: OURO, borderRadius: 2 },
  armLeft: { top: 80, left: 179, height: 34, transform: [{ rotate: '35deg' }] },
  armRight: { top: 80, left: 179, height: 34, transform: [{ rotate: '-35deg' }] },
  legLeft: { top: 120, left: 179, height: 38, transform: [{ rotate: '25deg' }] },
  legRight: { top: 120, left: 179, height: 38, transform: [{ rotate: '-25deg' }] },
  eye: {
    position: 'absolute',
    top: 40,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: CARVAO,
  },
  mouthSad: {
    position: 'absolute',
    top: 52,
    left: 170,
    width: 20,
    height: 8,
    borderBottomWidth: 2,
    borderColor: CORAL,
    borderRadius: 10,
    transform: [{ rotate: '180deg' }],
  },

  errorRow: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  errorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 3,
  },
  errorDotFilled: { backgroundColor: CORAL },

  wordRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 },
  letterChip: {
    width: 38,
    height: 46,
    borderRadius: 10,
    backgroundColor: TEAL_ESCURO,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    marginVertical: 3,
  },
  letterChipWin: { backgroundColor: VERDE },
  letterText: { color: CREME, fontSize: 22, fontWeight: '900' },

  statusPill: {
    backgroundColor: TEAL_ESCURO,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusPillWin: { backgroundColor: VERDE },
  statusPillLose: { backgroundColor: CORAL },
  statusText: { color: CREME, fontWeight: '700', fontSize: 13, letterSpacing: 0.3 },

  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 340,
  },
  key: {
    width: 32,
    height: 38,
    margin: 3,
    borderRadius: 10,
    backgroundColor: CREME,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyCorrect: { backgroundColor: VERDE },
  keyWrong: { backgroundColor: CORAL, opacity: 0.55 },
  keyText: { color: CARVAO, fontWeight: '800', fontSize: 13 },
  keyTextUsed: { color: CREME },

  resetBtn: {
    marginTop: 22,
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: OURO,
    borderRadius: 24,
  },
  resetText: { color: CARVAO, fontWeight: '900', letterSpacing: 1.2, fontSize: 13 },
});
