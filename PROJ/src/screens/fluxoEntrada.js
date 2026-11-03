import { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// [PRODUÇÃO 1/4] descomente o import abaixo:
// import AsyncStorage from '@react-native-async-storage/async-storage';

import BoasVindas from './boasVindas';
import EscolhaPerfil from './escolhaPerfil';
import Login from './login';
import { cores } from '../styles/tema';

// =====================================================================
//  MODO DESENVOLVIMENTO: as telas de entrada aparecem TODA vez que o
//  app abre. Para voltar ao normal (boas-vindas só na 1ª vez), faça os
//  4 passos marcados com [PRODUÇÃO] neste arquivo e, no App.js, troque
//  o bloco do Rotas pela linha indicada lá.
// =====================================================================

// ---------- Armazenamento no celular (sobrevive a fechar o app) ----------
// [PRODUÇÃO 2/4] descomente todo o bloco abaixo (de /* até */):

/*
const CHAVE_BOAS_VINDAS = '@amparo:boasVindasVistas';

// true se a pessoa já passou pela tela de boas-vindas
async function boasVindasJaVistas() {
  try {
    return (await AsyncStorage.getItem(CHAVE_BOAS_VINDAS)) === 'true';
  } catch {
    return false; // se falhar a leitura, mostra as boas-vindas por segurança
  }
}

async function marcarBoasVindasVistas() {
  try {
    await AsyncStorage.setItem(CHAVE_BOAS_VINDAS, 'true');
  } catch {
    // sem problema: na pior das hipóteses a tela aparece de novo
  }
}

// Só para testes: faz a tela de boas-vindas aparecer de novo
export async function reiniciarBoasVindas() {
  try {
    await AsyncStorage.removeItem(CHAVE_BOAS_VINDAS);
  } catch {
    // ignora
  }
}
*/

// ---------- Seta de voltar (aparece por cima da tela de Login) ----------

function SetaVoltar({ onPress }) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={8}
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: cores.branco,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        elevation: 4,
        shadowColor: cores.azulTinta,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      }}
    >
      <Ionicons name="arrow-back" size={22} color={cores.azulTinta} />
    </Pressable>
  );
}

// ---------- Fluxo de entrada ----------

const ESTILO_CARREGANDO = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: cores.azulMarinho,
};

// Tudo o que aparece ANTES do login:
//   Boas-vindas → Escolha do perfil → Login
// Props (vindas do App.js, só usadas no modo desenvolvimento):
//   usuario    - quem está logado (ou null)
//   onConcluir - avisa o App.js que já pode abrir o app
export default function FluxoEntrada({ usuario, onConcluir }) {
  // MODO DESENVOLVIMENTO: sempre começa nas boas-vindas
  const [passo, setPasso] = useState('boasVindas');
  // [PRODUÇÃO 3/4] apague a linha acima e descomente esta:
  // const [passo, setPasso] = useState('carregando');

  // eslint-disable-next-line no-unused-vars
  const [perfil, setPerfil] = useState(null); // 'usuario' ou 'familia' (ainda não é usado)

  // [PRODUÇÃO 4/4] descomente este bloco (lê se as boas-vindas já foram vistas):
  // useEffect(() => {
  //   let ativo = true;
  //   boasVindasJaVistas().then((vistas) => {
  //     if (ativo) setPasso(vistas ? 'login' : 'boasVindas');
  //   });
  //   return () => {
  //     ativo = false;
  //   };
  // }, []);

  // Se já existe alguém logado quando chega no passo do login, não precisa pedir
  // login de novo: avisa o App.js para abrir o app.
  useEffect(() => {
    if (passo === 'login' && usuario) onConcluir?.();
  }, [passo, usuario, onConcluir]);

  // Botão "voltar" do Android: Login → Perfil → Boas-vindas (nas outras telas, sai do app)
  useEffect(() => {
    const aoVoltar = () => {
      if (passo === 'login') {
        setPasso('perfil');
        return true;
      }
      if (passo === 'perfil') {
        setPasso('boasVindas');
        return true;
      }
      return false;
    };
    const assinatura = BackHandler.addEventListener('hardwareBackPress', aoVoltar);
    return () => assinatura.remove();
  }, [passo]);

  const sairDasBoasVindas = (proximoPasso) => {
    // [PRODUÇÃO] descomente a linha abaixo para gravar que a pessoa já viu as boas-vindas:
    // marcarBoasVindasVistas();
    setPasso(proximoPasso);
  };

  if (passo === 'carregando') {
    return (
      <View style={ESTILO_CARREGANDO}>
        <ActivityIndicator size="large" color={cores.ouro} />
      </View>
    );
  }

  if (passo === 'boasVindas') {
    return (
      <BoasVindas
        onComecar={() => sairDasBoasVindas('perfil')}
        onTenhoConta={() => sairDasBoasVindas('login')}
      />
    );
  }

  if (passo === 'perfil') {
    return (
      <EscolhaPerfil
        onVoltar={() => setPasso('boasVindas')}
        onEscolher={(escolhido) => {
          setPerfil(escolhido);
          setPasso('login');
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Login />
      <SetaVoltar onPress={() => setPasso('perfil')} />
    </View>
  );
}