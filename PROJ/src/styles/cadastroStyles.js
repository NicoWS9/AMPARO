import { StyleSheet } from 'react-native';
import { cores, sombraPadrao } from './tema';

// Estilos só das telas de cadastro (topo, botão voltar e logo vêm de estilosComuns, no tema).
export const estilosCadastro = StyleSheet.create({
  teclado: { flex: 1 },
  conteudo: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 16 },

  // ----- cabeçalho -----
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
  etiquetaFamilia: { backgroundColor: cores.lilasFundo },
  etiquetaTexto: { fontSize: 13, fontWeight: '800' },
  etiquetaTextoUsuario: { color: cores.ouro },
  etiquetaTextoFamilia: { color: cores.lilasEscuro },
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
    borderColor: cores.borda,
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
    borderColor: cores.borda,
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
  botaoDesativado: { opacity: 0.7 },
  erroGeral: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    color: cores.emergencia,
    textAlign: 'center',
  },

  rodape: { alignItems: 'center', gap: 6, marginTop: 4 },
  rodapeLinha: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  rodapeTexto: { fontSize: 15, color: cores.textoSuave },
  rodapeLink: { fontSize: 15, fontWeight: '800', color: cores.azulMarinho },
});
