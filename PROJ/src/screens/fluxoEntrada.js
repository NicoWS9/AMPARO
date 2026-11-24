import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BoasVindas from './boasVindas';
import EscolhaPerfil from './escolhaPerfil';
import Login from './login';
import CadastroUsuario from './cadastroUsuario';
import CadastroFamiliar from './cadastroFamiliar';
import { api } from '../services/api';
import { cores, estilosComuns, sombraPadrao } from '../styles/tema';

// ---------- Armazenamento no celular (sobrevive a fechar o app) ----------
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

// ---------- Botões que flutuam por cima da tela de Login ----------
// (o Login é o seu arquivo; estes botões ficam por cima dele sem mexer nele)

// Seta redonda no canto superior esquerdo
function SetaVoltar({ onPress }) {
  const { top } = useSafeAreaInsets();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={8}
      style={[estilosComuns.botaoRedondo, estilos.flutuante, { top: top + 8, left: 16 }]}
    >
      <Ionicons name="arrow-back" size={22} color={cores.azulTinta} />
    </Pressable>
  );
}

// Pílula "Criar conta" no canto superior direito
function BotaoCriarConta({ onPress }) {
  const { top } = useSafeAreaInsets();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Criar conta"
      hitSlop={8}
      style={[estilos.pilula, estilos.pilulaAzul, estilos.flutuante, { top: top + 8, right: 16 }]}
    >
      <Text style={estilos.pilulaTexto}>Criar conta</Text>
    </Pressable>
  );
}

// ---------- Fluxo de entrada ----------

// Para onde o botão "voltar" do Android leva a partir de cada tela.
// (nas telas que não estão aqui, ele sai do app)
const VOLTAR_PARA = {
  login: 'perfil',
  perfil: 'boasVindas',
};
const ehCadastro = (passo) => passo === 'cadastroUsuario' || passo === 'cadastroFamilia';
const telaDeCadastro = (perfil) => (perfil === 'familia' ? 'cadastroFamilia' : 'cadastroUsuario');

// Telas e caminhos:
//   "Começar"             → Escolha do perfil → Cadastro (usuário ou familiar)
//   "Já tenho uma conta"  → Login
//   Login ⇄ Cadastro (pelo botão "Criar conta" e pelo link "Entrar")
// Quando o login dá certo, o AuthContext guarda o usuário e o App.js troca
// sozinho para o app: este arquivo não precisa avisar ninguém.
export default function FluxoEntrada() {
  // Começa "carregando" enquanto lê se a pessoa já viu as boas-vindas
  const [passo, setPasso] = useState('carregando');
  const [perfil, setPerfil] = useState(null); // 'usuario' ou 'familia'
  // De onde a pessoa veio ao abrir o cadastro ('perfil' ou 'login'), para o "voltar" ir ao lugar certo
  const [origemCadastro, setOrigemCadastro] = useState('login');

  // Ao abrir: quem já viu as boas-vindas vai direto para o login
  useEffect(() => {
    let ativo = true;
    boasVindasJaVistas().then((vistas) => {
      if (ativo) setPasso(vistas ? 'login' : 'boasVindas');
    });
    return () => {
      ativo = false;
    };
  }, []);

  // Botão "voltar" do Android: Cadastro → (Login ou Perfil) → Perfil → Boas-vindas
  useEffect(() => {
    const destino = ehCadastro(passo) ? origemCadastro : VOLTAR_PARA[passo];
    if (!destino) return undefined;
    const assinatura = BackHandler.addEventListener('hardwareBackPress', () => {
      setPasso(destino);
      return true;
    });
    return () => assinatura.remove();
  }, [passo, origemCadastro]);

  const sairDasBoasVindas = (proximoPasso) => {
    marcarBoasVindasVistas();
    setPasso(proximoPasso);
  };

  const abrirCadastro = (perfilEscolhido, origem) => {
    setPerfil(perfilEscolhido);
    if (origem) setOrigemCadastro(origem);
    setPasso(telaDeCadastro(perfilEscolhido));
  };

  // Quando o formulário de cadastro está certo: envia para o servidor.
  // Se der erro, devolve o resultado e a própria tela de cadastro mostra a mensagem.
  const aoCadastrar = async (dados) => {
    const resultado = await api.cadastrar(dados);
    if (resultado.ok) {
      Alert.alert('Conta criada!', 'Agora entre com seu telefone (ou e-mail) e a senha que você criou.');
      setPasso('login');
    }
    return resultado;
  };

  if (passo === 'carregando') {
    return (
      <View style={estilos.carregando}>
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
        onEscolher={(escolhido) => abrirCadastro(escolhido, 'perfil')}
      />
    );
  }

  if (ehCadastro(passo)) {
    const familia = passo === 'cadastroFamilia';
    const Tela = familia ? CadastroFamiliar : CadastroUsuario;
    return (
      <Tela
        onVoltar={() => setPasso(origemCadastro)}
        onCadastrar={aoCadastrar}
        onTenhoConta={() => setPasso('login')}
        onTrocarPerfil={() => abrirCadastro(familia ? 'usuario' : 'familia')}
      />
    );
  }

  // passo === 'login'
  return (
    <View style={estilos.tela}>
      <Login />
      <SetaVoltar onPress={() => setPasso('perfil')} />
      <BotaoCriarConta onPress={() => abrirCadastro(perfil, 'login')} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  carregando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.azulMarinho,
  },
  flutuante: { position: 'absolute', zIndex: 10 },
  pilula: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombraPadrao,
  },
  pilulaAzul: { backgroundColor: cores.azulMarinho },
  pilulaTexto: { fontSize: 15, fontWeight: '800', color: cores.ouro },
});
