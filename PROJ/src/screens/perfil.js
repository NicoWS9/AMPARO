import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import { cores, estilosComuns } from '../styles/tema';

// Tela de Perfil (por enquanto: mostra quem está logado e o botão de sair).
export default function Perfil() {
  const { usuario, sair } = useAuth();

  return (
    <SafeAreaView style={[estilosComuns.telaCreme, estilos.conteudo]}>
      <Text accessibilityRole="header" style={estilosComuns.tituloSerifado}>
        {usuario?.nome}
      </Text>
      <Text style={estilos.info}>
        {usuario?.perfil === 'familia' ? 'Conta de familiar' : 'Conta de usuário'}
      </Text>

      {/* sair() apaga o token do celular; o App.js volta sozinho para a tela de login */}
      <Pressable
        onPress={sair}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
        style={({ pressed }) => [estilos.botaoSair, pressed && estilosComuns.pressionado]}
      >
        <Text style={estilos.botaoSairTexto}>Sair da conta</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { justifyContent: 'center', alignItems: 'center', padding: 24, gap: 8 },
  info: { fontSize: 16, color: cores.textoSuave },
  botaoSair: {
    marginTop: 24,
    minHeight: 58,
    paddingHorizontal: 32,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: cores.emergencia,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoSairTexto: { fontSize: 18, fontWeight: '800', color: cores.emergencia },
});
