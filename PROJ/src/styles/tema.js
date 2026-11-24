// Valores compartilhados entre os arquivos de estilo (cores, sombra, fonte, medidas).
import { Platform, StyleSheet } from 'react-native';

export const cores = {
  azulMarinho: '#1B2A5E',
  azulTinta: '#1B2A4E',
  ouro: '#EBCB8B',
  ouroEscuro: '#A66A12',
  fundoCreme: '#F6F0E6',
  textoEscuro: '#14213D',
  textoSuave: '#5B6475',
  textoClaro: '#D9DEEA',
  inativo: '#4A5578', // ~6,4:1 sobre #F4F0EA
  emergencia: '#B23A2A',
  emergenciaSuave: '#FBE3DF',
  branco: '#fff',
  borda: '#D5D9E6', // borda de campos, chips e cartões claros
  placeholder: '#7A8296',
  // tons de lilás do perfil "família"
  lilas: '#7B63C9',
  lilasFundo: '#E7E1F6',
  lilasEscuro: '#4F3F94', // texto/ícone sobre o fundo lilás (contraste ~6,7:1)
  lilasBorda: '#B9C0E8',
};

// Altura da barra inferior (sem contar a área segura do celular)
export const BARRA_ALTURA = 64;

export const fonteSerifada = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

export const sombraPadrao = Platform.select({
  ios: {
    shadowColor: cores.azulTinta,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 4 },
});

// Peças de layout que se repetem em várias telas
export const estilosComuns = StyleSheet.create({
  telaCreme: { flex: 1, backgroundColor: cores.fundoCreme },
  // linha do topo: botão voltar à esquerda, logo à direita
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  botaoRedondo: {
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
  tituloSerifado: {
    fontFamily: fonteSerifada,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: cores.textoEscuro,
  },
  pressionado: { opacity: 0.88, transform: [{ scale: 0.99 }] },
});
