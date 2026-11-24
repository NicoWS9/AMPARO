import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, setAuthToken } from '../services/api';

// O contexto guarda "quem está logado" e deixa qualquer tela acessar isso com useAuth().
const AuthContext = createContext(null);

// Nomes das "gavetas" no SecureStore (armazenamento criptografado do celular)
const CHAVE_TOKEN = 'token';
const CHAVE_USUARIO = 'usuario';

async function apagarLoginSalvo() {
  setAuthToken(null);
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
  await SecureStore.deleteItemAsync(CHAVE_USUARIO);
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app: se houver um token salvo, pergunta ao servidor se ele ainda vale.
  useEffect(() => {
    async function restaurar() {
      try {
        const token = await SecureStore.getItemAsync(CHAVE_TOKEN);
        if (!token) return; // ninguém logado: vai para as telas de entrada

        setAuthToken(token); // a partir daqui, as requisições levam o token
        const resposta = await api.buscarUsuarioLogado(); // GET /me

        if (resposta.ok) {
          // Token válido: usa os dados atualizados que vieram do banco
          setUsuario(resposta.usuario);
          await SecureStore.setItemAsync(CHAVE_USUARIO, JSON.stringify(resposta.usuario));
        } else if (resposta.status === 401) {
          // Token vencido ou inválido: apaga e a pessoa entra de novo
          await apagarLoginSalvo();
        } else {
          // Servidor fora do ar / sem internet: usa o que estava salvo no celular
          const salvo = await SecureStore.getItemAsync(CHAVE_USUARIO);
          if (salvo) setUsuario(JSON.parse(salvo));
        }
      } catch {
        // se algo falhar, a pessoa simplesmente vê a tela de login
      } finally {
        setCarregando(false);
      }
    }
    restaurar();
  }, []);

  // Chamado pela tela de Login. Se der errado, o erro (com a mensagem) sobe para a tela.
  async function entrar(telefoneOuEmail, senha) {
    const { token, usuario: dadosUsuario } = await api.login(telefoneOuEmail, senha);
    setAuthToken(token);
    await SecureStore.setItemAsync(CHAVE_TOKEN, token);
    await SecureStore.setItemAsync(CHAVE_USUARIO, JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario); // o App.js percebe e abre o app
  }

  async function sair() {
    await apagarLoginSalvo();
    setUsuario(null); // o App.js percebe e volta para as telas de entrada
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
