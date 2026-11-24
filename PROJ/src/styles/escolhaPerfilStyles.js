import { StyleSheet } from 'react-native';
import { cores, fonteSerifada, sombraPadrao } from './tema';

// Estilos só desta tela (topo, botão voltar, logo e título vêm de estilosComuns, no tema).
export const estilosEscolhaPerfil = StyleSheet.create({
  conteudo: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32, gap: 16 },

  titulo: { marginTop: 14 },
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
    borderColor: cores.lilasBorda,
  },

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
    backgroundColor: cores.lilasFundo,
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
