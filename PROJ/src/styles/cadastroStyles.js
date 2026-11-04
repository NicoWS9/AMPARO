import { StyleSheet } from 'react-native';
import { cores, fonteSerifada, sombraPadrao } from './tema';

// Tons de lilás só das telas de cadastro (iguais aos da Escolha do perfil)
const LILAS_FUNDO = '#E7E1F6';
export const corLilasEscuro = '#4F3F94'; // texto/ícone sobre o fundo lilás (contraste ~6,7:1)

export const estilosCadastro = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundoCreme },
  teclado: { flex: 1 },
  conteudo: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 16 },

  // ----- cabeçalho -----
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
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 8,
  },
  etiquetaUsuario: { backgroundColor: cores.azulMarinho },
  etiquetaFamilia: { backgroundColor: LILAS_FUNDO },
  etiquetaTexto: { fontSize: 13, fontWeight: '800' },
  etiquetaTextoUsuario: { color: cores.ouro },
  etiquetaTextoFamilia: { color: corLilasEscuro },
  titulo: {
    fontFamily: fonteSerifada,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: cores.textoEscuro,
  },
  subtitulo: { fontSize: 15, lineHeight: 22, color: cores.textoSuave },

  // ----- formulário -----
  formulario: { gap: 18, marginTop: 8 },

  grupoRotulo: { fontSize: 15, fontWeight: '700', color: cores.textoEscuro },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  chip: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 23,
    backgroundColor: cores.branco,
    borderWidth: 1.5,
    borderColor: '#D5D9E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipAtivo: { backgroundColor: cores.azulMarinho, borderColor: cores.azulMarinho },
  chipTexto: { fontSize: 15, fontWeight: '700', color: cores.textoEscuro },
  chipTextoAtivo: { color: cores.ouro },
  erroGrupo: { fontSize: 14, fontWeight: '600', color: cores.emergencia, marginTop: 6 },

  linhaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cores.branco,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D5D9E6',
    padding: 14,
  },
  linhaSwitchTextos: { flex: 1 },
  linhaSwitchTitulo: { fontSize: 15, fontWeight: '700', color: cores.textoEscuro },
  linhaSwitchDica: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },

  // ----- botão e links -----
  botao: {
    minHeight: 58,
    borderRadius: 29,
    backgroundColor: cores.azulMarinho,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...sombraPadrao,
  },
  botaoTexto: { fontSize: 18, fontWeight: '800', color: cores.ouro },
  pressionado: { opacity: 0.88, transform: [{ scale: 0.99 }] },

  rodape: { alignItems: 'center', gap: 6, marginTop: 4 },
  rodapeLinha: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  rodapeTexto: { fontSize: 15, color: cores.textoSuave },
  rodapeLink: { fontSize: 15, fontWeight: '800', color: cores.azulMarinho },
});