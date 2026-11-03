import { useState } from 'react';
import { Pressable, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import FluxoEntrada from './src/screens/fluxoEntrada';
import BarraInferior from './src/components/BarraInferior';

// IMPORTAÇÕES DAS TELAS (Verifique se as letras maiúsculas/minúsculas dos arquivos estão certas)
import Inicio from './src/screens/Inicio';
import Agenda from './src/screens/agenda';
import Perfil from './src/screens/perfil';
import Medicamentos from './src/screens/medicamentos';
import Exercicios from './src/screens/exercicios';
import Emergencia from './src/screens/emergencia';
import Contatos from './src/screens/contatos';

const Tab = createBottomTabNavigator();

// Telas que aparecem na barra (o botão de cada uma é desenhado em BarraInferior)
const TELAS_PRINCIPAIS = [
  { nome: 'Início', componente: Inicio },
  { nome: 'Agenda', componente: Agenda },
  { nome: 'Perfil', componente: Perfil },
];

// Telas "internas": registradas no navigator, sem botão na barra,
// com cabeçalho próprio e seta de voltar.
const botaoVoltar = (navigation) => () => (
  <Pressable onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
    <Ionicons name="arrow-back" size={24} color="#1F2D3D" />
  </Pressable>
);

const opcoesInterna = (titulo) => ({ navigation }) => ({
  title: titulo,
  headerShown: true,
  headerLeft: botaoVoltar(navigation),
});

// As opções são criadas uma única vez, fora do componente
const TELAS_INTERNAS = [
  { nome: 'Medicamentos', componente: Medicamentos, titulo: 'Meus Remédios' },
  { nome: 'Exercicios', componente: Exercicios, titulo: 'Exercícios Diários' },
  { nome: 'Contatos', componente: Contatos, titulo: 'Meus Contatos' },
  { nome: 'Emergencia', componente: Emergencia, titulo: 'Telefone de Emergência' },
].map((tela) => ({ ...tela, opcoes: opcoesInterna(tela.titulo) }));

// Referências estáveis: não são recriadas a cada render
const OPCOES_NAVEGADOR = { headerShown: false };
const renderBarra = (props) => <BarraInferior {...props} />;
const ESTILO_CARREGANDO = { flex: 1 };

// Tudo o que o usuário vê DEPOIS de logar
function AppLogado() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        backBehavior="history"
        tabBar={renderBarra}
        screenOptions={OPCOES_NAVEGADOR}
      >
        {TELAS_PRINCIPAIS.map(({ nome, componente }) => (
          <Tab.Screen key={nome} name={nome} component={componente} />
        ))}
        {TELAS_INTERNAS.map(({ nome, componente, opcoes }) => (
          <Tab.Screen key={nome} name={nome} component={componente} options={opcoes} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Decide qual "lado" do app mostrar
function Rotas() {
  const { usuario, carregando } = useAuth();
  const [entradaConcluida, setEntradaConcluida] = useState(false);

  if (carregando) {
    return <ActivityIndicator style={ESTILO_CARREGANDO} size="large" color="#2B7BD6" />;
  }

  // MODO DESENVOLVIMENTO: as telas de entrada aparecem sempre que o app abre,
  // mesmo que já exista alguém logado.
  if (!usuario || !entradaConcluida) {
    return <FluxoEntrada usuario={usuario} onConcluir={() => setEntradaConcluida(true)} />;
  }
  return <AppLogado />;

  // [PRODUÇÃO] apague o bloco "MODO DESENVOLVIMENTO" acima, o useState de
  // entradaConcluida e o import do useState, e descomente a linha abaixo:
  // return usuario ? <AppLogado /> : <FluxoEntrada />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Rotas />
      </AuthProvider>
    </SafeAreaProvider>
  );
}