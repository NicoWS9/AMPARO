import { StyleSheet } from 'react-native';
import { cores } from './tema';

export const corPlaceholder = '#7A8296';

export const estilosCampoTexto = StyleSheet.create({
  grupo: { gap: 6 },
  rotulo: { fontSize: 15, fontWeight: '700', color: cores.textoEscuro },
  opcional: { fontWeight: '500', color: cores.textoSuave },

  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: cores.branco,
    borderWidth: 1.5,
    borderColor: '#D5D9E6',
    paddingHorizontal: 14,
    gap: 10,
  },
  caixaFocada: { borderColor: cores.azulMarinho },
  caixaErro: { borderColor: cores.emergencia },

  input: { flex: 1, fontSize: 17, color: cores.textoEscuro, paddingVertical: 12 },
  botaoOlho: { padding: 6 },

  dica: { fontSize: 13, color: cores.textoSuave },
  erro: { fontSize: 14, fontWeight: '600', color: cores.emergencia },
});