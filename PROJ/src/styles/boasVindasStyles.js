import { StyleSheet } from 'react-native';
import { cores, fonteSerifada } from './tema';

export const estilosBoasVindas = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.azulMarinho },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },

  marca: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  marcaNome: {
    fontFamily: fonteSerifada,
    fontSize: 24,
    fontWeight: '700',
    color: cores.branco,
  },

  titulo: {
    fontFamily: fonteSerifada,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    color: cores.branco,
    marginTop: 40,
  },
  subtitulo: {
    fontSize: 16,
    lineHeight: 23,
    color: cores.textoClaro,
    marginTop: 14,
  },

  beneficios: { marginTop: 30, gap: 18 },
  beneficio: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  beneficioIcone: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beneficioTexto: { flex: 1, fontSize: 16, fontWeight: '700', color: cores.branco },

  rodape: { gap: 12, marginTop: 32 },
  botaoPrimario: {
    minHeight: 58,
    borderRadius: 29,
    backgroundColor: cores.ouro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPrimarioTexto: { fontSize: 18, fontWeight: '800', color: cores.azulTinta },
  botaoSecundario: {
    minHeight: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: cores.ouro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoSecundarioTexto: { fontSize: 17, fontWeight: '700', color: cores.branco },
  pressionado: { opacity: 0.85 },
});