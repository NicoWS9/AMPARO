import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AneisDecorativos from '../components/aneisDecorativos';
import { TopoComLogo } from '../components/cabecalhoCadastro';
import { cores, estilosComuns } from '../styles/tema';
import { estilosEscolhaPerfil } from '../styles/escolhaPerfilStyles';

// Tela "Como você vai usar o Amparo?".
// Use por props:  <EscolhaPerfil onVoltar={...} onEscolher={(perfil) => ...} />
// `perfil` chega como 'usuario' ou 'familia'.
// Dentro de um navigator, sem as props: volta com goBack() e vai para a rota 'Login'
// enviando { perfil } nos parâmetros.
export default function EscolhaPerfil({ navigation, onVoltar, onEscolher }) {
  const voltar = onVoltar ?? (() => navigation?.goBack());
  const escolher = (perfil) =>
    onEscolher ? onEscolher(perfil) : navigation?.navigate('Login', { perfil });

  return (
    <SafeAreaView style={estilosComuns.telaCreme}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.fundoCreme} />
      <ScrollView
        contentContainerStyle={estilosEscolhaPerfil.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <TopoComLogo onVoltar={voltar} />

        <Text
          accessibilityRole="header"
          style={[estilosComuns.tituloSerifado, estilosEscolhaPerfil.titulo]}
        >
          Como você vai usar o Amparo?
        </Text>
        <Text style={estilosEscolhaPerfil.subtitulo}>Escolha uma opção para continuar.</Text>

        {/* Eu uso o app */}
        <Pressable
          onPress={() => escolher('usuario')}
          accessibilityRole="button"
          accessibilityLabel="Eu uso o app. Entrar com meu celular"
          style={({ pressed }) => [
            estilosEscolhaPerfil.cardEscuro,
            pressed && estilosComuns.pressionado,
          ]}
        >
          <AneisDecorativos tamanho={230} topo={-80} direita={-70} />
          <View style={estilosEscolhaPerfil.iconeEscuro}>
            <Ionicons name="person-outline" size={24} color={cores.ouro} />
          </View>
          <Text style={[estilosEscolhaPerfil.cardTitulo, estilosEscolhaPerfil.tituloClaro]}>
            Eu uso o app
          </Text>
          <Text style={[estilosEscolhaPerfil.cardTexto, estilosEscolhaPerfil.textoClaro]}>
            Quero lembrar dos meus remédios, fazer exercícios e falar com a família.
          </Text>
          <View style={estilosEscolhaPerfil.link}>
            <Text style={[estilosEscolhaPerfil.linkTexto, estilosEscolhaPerfil.linkOuro]}>
              Entrar com meu celular
            </Text>
            <Ionicons name="chevron-forward" size={18} color={cores.ouro} />
          </View>
        </Pressable>

        {/* Sou da família */}
        <Pressable
          onPress={() => escolher('familia')}
          accessibilityRole="button"
          accessibilityLabel="Sou da família. Entrar como família"
          style={({ pressed }) => [
            estilosEscolhaPerfil.cardClaro,
            pressed && estilosComuns.pressionado,
          ]}
        >
          <View style={estilosEscolhaPerfil.iconeClaro}>
            <Ionicons name="people-outline" size={24} color={cores.lilas} />
          </View>
          <Text style={[estilosEscolhaPerfil.cardTitulo, estilosEscolhaPerfil.tituloEscuro]}>
            Sou da família
          </Text>
          <Text style={[estilosEscolhaPerfil.cardTexto, estilosEscolhaPerfil.textoSuave]}>
            Quero ver se meu familiar tomou os remédios e receber alertas de emergência.
          </Text>
          <View style={estilosEscolhaPerfil.link}>
            <Text style={[estilosEscolhaPerfil.linkTexto, estilosEscolhaPerfil.linkAzul]}>
              Entrar como família
            </Text>
            <Ionicons name="chevron-forward" size={18} color={cores.azulMarinho} />
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}