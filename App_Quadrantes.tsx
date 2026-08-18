import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';

type Quadrante = {
  imagem: any;
  label: string;
  cor: string;
  corTexto: string;
};

const QUADRANTES: Quadrante[] = [
  { imagem: require('./assets/luffy.jpg'), label: 'Luffy', cor: '#F2432D', corTexto: '#FFFFFF' },
  { imagem: require('./assets/nami.jpg'), label: 'Nami', cor: '#F2882D', corTexto: '#FFFFFF' },
  { imagem: require('./assets/zoro.jpg'), label: 'Zoro', cor: '#33B05C', corTexto: '#FFFFFF' },
  { imagem: require('./assets/sanji.jpg'), label: 'Sanji', cor: '#F4C430', corTexto: '#3A2E00' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Cabeçalho fixo por cima da grade */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MEU APP</Text>
        <Text style={styles.headerSubtitle}>escolha uma seção</Text>
      </View>

      {/* Grade 2x2 */}
      <View style={styles.grid}>
        {QUADRANTES.map((q, i) => (
          <TouchableOpacity
            key={q.label}
            activeOpacity={0.8}
            style={[
              styles.quadrante,
              { backgroundColor: q.cor },
              i % 2 === 0 && styles.bordaDireita,
              i < 2 && styles.bordaBaixo,
            ]}
          >
            <View style={styles.avatarCirculo}>
              <Image source={q.imagem} style={styles.avatarImagem} />
            </View>
            <Text style={[styles.label, { color: q.corTexto }]}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1B1B1B' },

  header: {
    paddingTop: 12,
    paddingBottom: 18,
    alignItems: 'center',
    backgroundColor: '#1B1B1B',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#9A9A9A',
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.5,
  },

  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quadrante: {
    width: '50%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordaDireita: { borderRightWidth: 2, borderRightColor: 'rgba(0,0,0,0.08)' },
  bordaBaixo: { borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.08)' },

  avatarCirculo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarImagem: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
