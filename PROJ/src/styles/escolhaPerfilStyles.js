import { StyleSheet } from 'react-native';
import { cores, fonteSerifada, sombraPadrao } from './tema';

// Cores só desta tela (o tema não foi alterado)
export const corLilas = '#7B63C9';
const LILAS_FUNDO = '#E7E1F6';
const BORDA_LILAS = '#B9C0E8';

export const estilosEscolhaPerfil = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundoCreme },
  conteudo: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32, gap: 16 },

  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  botaoVoltar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombraPadrao,
  },
  marca: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: cores.azulMarinho,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titulo: {
    fontFamily: fonteSerifada,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: cores.textoEscuro,
    marginTop: 14,
  },
  subtitulo: { fontSize: 15, color: cores.textoSuave, marginBottom: 4 },

  cardEscuro: {
    backgroundColor: cores.azulMarinho,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    ...sombraPadrao,
  },
  cardClaro: {
    backgroundColor: cores.branco,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: BORDA_LILAS,
  },
  pressionado: { opacity: 0.88, transform: [{ scale: 0.99 }] },

  iconeEscuro: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeClaro: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: LILAS_FUNDO,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitulo: {
    fontFamily: fonteSerifada,
    fontSize: 27,
    fontWeight: '700',
    marginTop: 14,
  },
  tituloClaro: { color: cores.branco },
  tituloEscuro: { color: cores.textoEscuro },
  cardTexto: { fontSize: 15, lineHeight: 22, marginTop: 6 },
  textoClaro: { color: cores.textoClaro },
  textoSuave: { color: cores.textoSuave },

  link: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  linkTexto: { fontSize: 15, fontWeight: '800' },
  linkOuro: { color: cores.ouro },
  linkAzul: { color: cores.azulMarinho },

});