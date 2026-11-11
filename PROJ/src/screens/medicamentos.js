import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// ---------- Cores e fontes (ajuste para as suas constantes, se quiser) ----------
const COR = {
  fundo: '#F6F1E7',
  marinho: '#1B2F5E',
  marinhoClaro: '#E3E9F5',
  branco: '#FFFFFF',
  tomado: '#F1EADB',
  texto: '#1F2D3D',
  textoSuave: '#5F6B7A',
  dourado: '#B8860B',
  trilho: 'rgba(255,255,255,0.18)',
  progresso: '#E8B84A',
};
const FONTE_TITULO = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

const MESES = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

// Lista inicial (depois você pode trocar por dados do backend / AsyncStorage)
const MEDICAMENTOS_INICIAIS = [
  { id: '1', hora: '08:00', nome: 'Metformina', dose: '850 mg · 1 comprimido', tomado: true },
  { id: '2', hora: '09:00', nome: 'Losartana', dose: '50 mg · 1 comprimido', tomado: false },
  { id: '3', hora: '12:00', nome: 'Omeprazol', dose: '20 mg · 1 cápsula', tomado: false },
  { id: '4', hora: '21:00', nome: 'Sinvastatina', dose: '20 mg · 1 comprimido', tomado: false },
];

// ---------- Anel de progresso (só com Views, sem biblioteca extra) ----------
function AnelProgresso({ progresso, tamanho = 56, espessura = 6, children }) {
  const p = Math.max(0, Math.min(1, progresso));
  const metade = tamanho / 2;

  const circuloBase = {
    position: 'absolute',
    width: tamanho,
    height: tamanho,
    borderRadius: metade,
    borderWidth: espessura,
    borderColor: 'transparent',
    borderTopColor: COR.progresso,
    borderRightColor: COR.progresso,
  };

  const giroDireita = Math.min(p, 0.5) * 360 - 135;
  const giroEsquerda = Math.max(p, 0.5) * 360 - 135;

  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      {/* trilho */}
      <View
        style={{
          position: 'absolute',
          width: tamanho,
          height: tamanho,
          borderRadius: metade,
          borderWidth: espessura,
          borderColor: COR.trilho,
        }}
      />
      {p > 0 && (
        <>
          {/* metade direita */}
          <View style={{ position: 'absolute', left: metade, width: metade, height: tamanho, overflow: 'hidden' }}>
            <View style={[circuloBase, { left: -metade, transform: [{ rotate: `${giroDireita}deg` }] }]} />
          </View>
          {/* metade esquerda */}
          <View style={{ position: 'absolute', left: 0, width: metade, height: tamanho, overflow: 'hidden' }}>
            <View style={[circuloBase, { left: 0, transform: [{ rotate: `${giroEsquerda}deg` }] }]} />
          </View>
        </>
      )}
      {children}
    </View>
  );
}

// ---------- Tela ----------
export default function Medicamentos({ navigation }) {
  const insets = useSafeAreaInsets();
  const [lista, setLista] = useState(MEDICAMENTOS_INICIAIS);

  const hoje = new Date();
  const dataTexto = `HOJE · ${hoje.getDate()} DE ${MESES[hoje.getMonth()]}`;

  const total = lista.length;
  const qtdTomados = lista.filter((m) => m.tomado).length;
  const proximo = lista.find((m) => !m.tomado);

  const marcarTomado = (id) => {
    setLista((atual) => atual.map((m) => (m.id === id ? { ...m, tomado: true } : m)));
  };

  const voltar = () => {
    if (navigation?.canGoBack?.()) navigation.goBack();
  };

  return (
    <View style={[estilos.tela, { paddingTop: insets.top + 12 }]}>
      <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={voltar}
              style={estilos.botaoCircular}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="chevron-back" size={22} color={COR.texto} />
            </Pressable>
            <Text style={estilos.data}>{dataTexto}</Text>
            <Text style={estilos.titulo}>Meus{'\n'}medicamentos</Text>
          </View>

          <Pressable
            onPress={() => {
              // TODO: abrir tela de cadastro de medicamento
            }}
            style={[estilos.botaoCircular, estilos.botaoAdicionar]}
            accessibilityRole="button"
            accessibilityLabel="Adicionar medicamento"
          >
            <Ionicons name="add" size={26} color={COR.branco} />
          </Pressable>
        </View>

        {/* Resumo */}
        <View style={estilos.resumo}>
          <AnelProgresso progresso={total ? qtdTomados / total : 0}>
            <Text style={estilos.resumoFracao}>
              {qtdTomados}/{total}
            </Text>
          </AnelProgresso>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={estilos.resumoTitulo}>
              {qtdTomados} de {total} tomados
            </Text>
            <Text style={estilos.resumoSub}>
              {proximo ? `Próximo: ${proximo.nome} às ${proximo.hora}` : 'Tudo certo por hoje!'}
            </Text>
          </View>
        </View>

        {/* Lista */}
        {lista.map((med) => {
          const ehProximo = proximo && proximo.id === med.id;
          return (
            <View
              key={med.id}
              style={[
                estilos.cartao,
                med.tomado && estilos.cartaoTomado,
                ehProximo && estilos.cartaoProximo,
              ]}
            >
              <Text style={estilos.hora}>{med.hora}</Text>

              <View style={{ flex: 1 }}>
                <Text style={estilos.nome}>{med.nome}</Text>
                <Text style={estilos.dose}>{med.dose}</Text>
              </View>

              {med.tomado ? (
                <View style={[estilos.botaoAcao, estilos.botaoTomado]}>
                  <Ionicons name="checkmark" size={16} color={COR.marinho} />
                  <Text style={estilos.textoTomado}>Tomado</Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => marcarTomado(med.id)}
                  style={[estilos.botaoAcao, ehProximo ? estilos.botaoTomei : estilos.botaoTomeiContorno]}
                  accessibilityRole="button"
                  accessibilityLabel={`Marcar ${med.nome} como tomado`}
                >
                  <Text style={[estilos.textoTomei, !ehProximo && { color: COR.marinho }]}>Tomei</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------- Estilos ----------
const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: COR.fundo },
  conteudo: { paddingHorizontal: 20, paddingBottom: 24 },

  cabecalho: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  botaoCircular: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COR.branco,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  botaoAdicionar: { backgroundColor: COR.marinho },
  data: { fontSize: 12, fontWeight: '700', letterSpacing: 1, color: COR.dourado, marginBottom: 2 },
  titulo: { fontFamily: FONTE_TITULO, fontSize: 32, lineHeight: 36, fontWeight: '700', color: COR.texto },

  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.marinho,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  resumoFracao: { color: COR.branco, fontSize: 14, fontWeight: '700' },
  resumoTitulo: { fontFamily: FONTE_TITULO, color: COR.branco, fontSize: 22, fontWeight: '700' },
  resumoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },

  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COR.branco,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cartaoTomado: { backgroundColor: COR.tomado },
  cartaoProximo: { borderColor: COR.marinho },

  hora: { fontFamily: FONTE_TITULO, fontSize: 22, fontWeight: '700', color: COR.texto, width: 72 },
  nome: { fontSize: 17, fontWeight: '700', color: COR.texto },
  dose: { fontSize: 13, color: COR.textoSuave, marginTop: 2 },

  botaoAcao: {
    minWidth: 92,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 8,
  },
  botaoTomei: { backgroundColor: COR.marinho },
  botaoTomeiContorno: { backgroundColor: COR.branco, borderWidth: 2, borderColor: COR.marinho },
  textoTomei: { color: COR.branco, fontSize: 15, fontWeight: '700' },
  botaoTomado: { backgroundColor: COR.marinhoClaro },
  textoTomado: { color: COR.marinho, fontSize: 14, fontWeight: '700', marginLeft: 4 },
});