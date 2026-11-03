import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import LogoAmparo from '../components/logoAmparo';
import AneisDecorativos from '../components/aneisDecorativos';
import { cores } from '../styles/tema';
import { estilosBoasVindas } from '../styles/boasVindasStyles';

const BENEFICIOS = [
  { id: 'lembretes', Icone: MaterialCommunityIcons, icone: 'pill', texto: 'Lembretes na hora certa' },
  { id: 'exercicios', Icone: Ionicons, icone: 'body-outline', texto: 'Exercícios leves de 15 minutos' },
  { id: 'familia', Icone: Ionicons, icone: 'people-outline', texto: 'A família acompanha de longe' },
];

// Tela de boas-vindas (mostrar só na primeira vez).
// Use por props:  <BoasVindas onComecar={...} onTenhoConta={...} />
// ou dentro de um navigator, que envia `navigation` (rotas: 'EscolhaPerfil' e 'Login').
export default function BoasVindas({ navigation, onComecar, onTenhoConta }) {
  const comecar = onComecar ?? (() => navigation?.navigate('EscolhaPerfil'));
  const tenhoConta = onTenhoConta ?? (() => navigation?.navigate('Login'));

  return (
    <SafeAreaView style={estilosBoasVindas.container}>
      <StatusBar barStyle="light-content" backgroundColor={cores.azulMarinho} />
      <AneisDecorativos tamanho={300} topo={-110} direita={-110} />

      <ScrollView
        contentContainerStyle={estilosBoasVindas.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={estilosBoasVindas.marca}>
            <LogoAmparo tamanho={30} />
            <Text style={estilosBoasVindas.marcaNome}>Amparo</Text>
          </View>

          <Text accessibilityRole="header" style={estilosBoasVindas.titulo}>
            Cuidar de você,{'\n'}todos os dias.
          </Text>
          <Text style={estilosBoasVindas.subtitulo}>
            Remédios, exercícios e a sua família por perto, de um jeito simples.
          </Text>

          <View style={estilosBoasVindas.beneficios}>
            {BENEFICIOS.map(({ id, Icone, icone, texto }) => (
              <View key={id} style={estilosBoasVindas.beneficio}>
                <View style={estilosBoasVindas.beneficioIcone}>
                  <Icone name={icone} size={22} color={cores.ouro} />
                </View>
                <Text style={estilosBoasVindas.beneficioTexto}>{texto}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={estilosBoasVindas.rodape}>
          <Pressable
            onPress={comecar}
            accessibilityRole="button"
            accessibilityLabel="Começar"
            style={({ pressed }) => [
              estilosBoasVindas.botaoPrimario,
              pressed && estilosBoasVindas.pressionado,
            ]}
          >
            <Text style={estilosBoasVindas.botaoPrimarioTexto}>Começar</Text>
          </Pressable>

          <Pressable
            onPress={tenhoConta}
            accessibilityRole="button"
            accessibilityLabel="Já tenho uma conta"
            style={({ pressed }) => [
              estilosBoasVindas.botaoSecundario,
              pressed && estilosBoasVindas.pressionado,
            ]}
          >
            <Text style={estilosBoasVindas.botaoSecundarioTexto}>Já tenho uma conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}