import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// [PRODUÇÃO 1/4] descomente o import abaixo:
// import AsyncStorage from '@react-native-async-storage/async-storage';

import BoasVindas from './boasVindas';
import EscolhaPerfil from './escolhaPerfil';
import Login from './login';
import CadastroUsuario from './cadastroUsuario';
import CadastroFamiliar from './cadastroFamiliar';
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

// ---------- Botões que flutuam por cima da tela de Login ----------
// (o Login é o seu arquivo; estes botões ficam por cima dele sem mexer nele)

const SOMBRA_BOTAO = {
  elevation: 4,
  shadowColor: cores.azulTinta,
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
};

// Seta redonda no canto superior esquerdo
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
        ...SOMBRA_BOTAO,
      }}
    >
      <Ionicons name="arrow-back" size={22} color={cores.azulTinta} />
    </Pressable>
  );
}

// Pílula "Criar conta" no canto superior direito
function BotaoCriarConta({ onPress }) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Criar conta"
      hitSlop={8}
      style={{
        position: 'absolute',
        top: insets.top + 8,
        right: 16,
        height: 48,
        paddingHorizontal: 18,
        borderRadius: 24,
        backgroundColor: cores.azulMarinho,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        ...SOMBRA_BOTAO,
      }}
    >
      <Text style={{ color: cores.ouro, fontSize: 15, fontWeight: '800' }}>Criar conta</Text>
    </Pressable>
  );
}

// SÓ DESENVOLVIMENTO: quando o app abre com alguém já logado, o Login aparece normalmente
// e este botão no rodapé deixa você entrar no app sem digitar a senha de novo.
function BotaoContinuarLogado({ onPress }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: insets.bottom + 16,
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Continuar no app"
        style={{
          height: 48,
          paddingHorizontal: 20,
          borderRadius: 24,
          backgroundColor: cores.branco,
          alignItems: 'center',
          justifyContent: 'center',
          ...SOMBRA_BOTAO,
        }}
      >
        <Text style={{ color: cores.azulMarinho, fontSize: 15, fontWeight: '800' }}>
          Continuar no app (modo teste)
        </Text>
      </Pressable>
    </View>
  );
}

// ---------- Fluxo de entrada ----------

const ESTILO_CARREGANDO = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: cores.azulMarinho,
};

// Telas e caminhos:
//   "Começar"             → Escolha do perfil → Cadastro (usuário ou familiar)
//   "Já tenho uma conta"  → Login
//   Login ⇄ Cadastro (pelo botão "Criar conta" e pelo link "Entrar")
// Props (vindas do App.js, só usadas no modo desenvolvimento):
//   usuario    - quem está logado (ou null)
//   onConcluir - avisa o App.js que já pode abrir o app
export default function FluxoEntrada({ usuario, onConcluir }) {
  // MODO DESENVOLVIMENTO: sempre começa nas boas-vindas
  const [passo, setPasso] = useState('boasVindas');
  // [PRODUÇÃO 3/4] apague a linha acima e descomente esta:
  // const [passo, setPasso] = useState('carregando');

  const [perfil, setPerfil] = useState(null); // 'usuario' ou 'familia'
  // De onde a pessoa veio ao abrir o cadastro ('perfil' ou 'login'), para o "voltar" ir ao lugar certo
  const [origemCadastro, setOrigemCadastro] = useState('login');

  // Quem já estava logado quando o app abriu (modo desenvolvimento)
  const usuarioInicial = useRef(usuario);

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

  // Fez login agora (a pessoa que entrou é diferente de quem estava ao abrir o app):
  // avisa o App.js para abrir o app.
  useEffect(() => {
    if (passo === 'login' && usuario && usuario !== usuarioInicial.current) onConcluir?.();
  }, [passo, usuario, onConcluir]);

  // Botão "voltar" do Android: Cadastro → Login → Perfil → Boas-vindas (nas outras telas, sai do app)
  useEffect(() => {
    const aoVoltar = () => {
      if (passo === 'cadastroUsuario' || passo === 'cadastroFamilia') {
        setPasso(origemCadastro);
        return true;
      }
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
  }, [passo, origemCadastro]);

  const sairDasBoasVindas = (proximoPasso) => {
    // [PRODUÇÃO] descomente a linha abaixo para gravar que a pessoa já viu as boas-vindas:
    // marcarBoasVindasVistas();
    setPasso(proximoPasso);
  };

  // Quando o formulário de cadastro está certo
  const aoCadastrar = (dados) => {
    // AMANHÃ: aqui entra a chamada ao banco (enviar `dados` para o servidor).
    const { senha, ...semSenha } = dados; // a senha nunca vai para o console
    console.log('Cadastro recebido (ainda sem banco):', semSenha);
    Alert.alert(
      'Formulário preenchido',
      'Os dados ainda não são salvos: o banco será ligado em seguida.'
    );
    setPasso('login');
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
          setOrigemCadastro('perfil');
          setPasso(escolhido === 'familia' ? 'cadastroFamilia' : 'cadastroUsuario');
        }}
      />
    );
  }

  if (passo === 'cadastroUsuario') {
    return (
      <CadastroUsuario
        onVoltar={() => setPasso(origemCadastro)}
        onCadastrar={aoCadastrar}
        onTenhoConta={() => setPasso('login')}
        onTrocarPerfil={() => {
          setPerfil('familia');
          setPasso('cadastroFamilia');
        }}
      />
    );
  }

  if (passo === 'cadastroFamilia') {
    return (
      <CadastroFamiliar
        onVoltar={() => setPasso(origemCadastro)}
        onCadastrar={aoCadastrar}
        onTenhoConta={() => setPasso('login')}
        onTrocarPerfil={() => {
          setPerfil('usuario');
          setPasso('cadastroUsuario');
        }}
      />
    );
  }

  // passo === 'login'
  const jaEstavaLogado = !!usuario && usuario === usuarioInicial.current;
  return (
    <View style={{ flex: 1 }}>
      <Login />
      <SetaVoltar onPress={() => setPasso('perfil')} />
      <BotaoCriarConta
        onPress={() => {
          setOrigemCadastro('login');
          setPasso(perfil === 'familia' ? 'cadastroFamilia' : 'cadastroUsuario');
        }}
      />
      {jaEstavaLogado ? <BotaoContinuarLogado onPress={() => onConcluir?.()} /> : null}
    </View>
  );
}