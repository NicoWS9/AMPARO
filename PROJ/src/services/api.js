// Todas as conversas do app com o servidor ficam aqui.
// Nas telas você usa api.cadastrar(...) sem se preocupar com endereços.
import Constants from 'expo-constants';

const PORTA_SERVIDOR = 3000;
const TEMPO_LIMITE_MS = 10000; // desiste se o servidor não responder em 10 segundos

// Descobre onde está o servidor (o backend), sem você precisar digitar o IP:
//  1) Se existir EXPO_PUBLIC_API_URL no .env.local do app, usa esse valor (manual, tem prioridade).
//  2) Senão, usa o endereço do computador que está rodando o Expo, que o próprio app já conhece.
//     Funciona nos dois notebooks sem mudar nada, desde que o backend rode no mesmo computador do Expo.
//  3) Se nada disso existir, usa localhost (só serve no navegador ou no emulador do iOS).
// Atenção: com o Expo em modo "tunnel" o passo 2 não serve; use o passo 1.
function enderecoDoServidor() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  const computador = Constants.expoConfig?.hostUri?.split(':')[0];
  if (computador) return `http://${computador}:${PORTA_SERVIDOR}`;

  return `http://localhost:${PORTA_SERVIDOR}`;
}

const BASE_URL = enderecoDoServidor();

// Token de quem está logado (o AuthContext chama setAuthToken ao entrar/sair).
// Vai automaticamente no cabeçalho de todas as requisições.
let tokenAtual = null;
export function setAuthToken(token) {
  tokenAtual = token;
}

const SEM_CONEXAO =
  'Não foi possível falar com o servidor. Confira se ele está ligado e se o celular está na mesma rede Wi-Fi.';

// Faz a requisição e NUNCA lança erro: sempre devolve
//   { ok: true, ...corpoDaResposta }                        quando deu certo
//   { ok: false, status, erro: 'mensagem', campos: {...} }  quando não deu
// `status` é o código HTTP (ex.: 401 = token inválido). Fica undefined se nem chegou resposta.
// `campos` traz a mensagem de cada campo com problema (ex.: { telefone: 'Esse telefone já está cadastrado.' })
async function requisicao(caminho, { metodo = 'GET', corpo, erroPadrao } = {}) {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  try {
    const resposta = await fetch(`${BASE_URL}${caminho}`, {
      method: metodo,
      headers: {
        ...(corpo !== undefined && { 'Content-Type': 'application/json' }),
        ...(tokenAtual && { Authorization: `Bearer ${tokenAtual}` }),
      },
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal: controle.signal,
    });
    const json = await resposta.json().catch(() => ({}));
    if (resposta.ok) return { ok: true, ...json };
    return {
      ok: false,
      status: resposta.status,
      erro: json.erro ?? erroPadrao ?? `Erro ${resposta.status}. Tente de novo.`,
      campos: json.campos ?? {},
    };
  } catch {
    return { ok: false, erro: SEM_CONEXAO, campos: {} };
  } finally {
    clearTimeout(relogio);
  }
}

// Cria a conta (usuário ou familiar). Devolve { ok: true, id, perfil } ou { ok: false, erro, campos }.
const cadastrar = (dados) =>
  requisicao('/cadastro', {
    metodo: 'POST',
    corpo: dados,
    erroPadrao: 'Não foi possível criar a conta. Tente de novo.',
  });

// Login com telefone OU e-mail + senha. Diferente das outras, LANÇA erro
// (com a mensagem pronta para mostrar na tela), porque é assim que o AuthContext espera.
// Devolve { token, usuario }.
export async function login(telefoneOuEmail, senha) {
  const resultado = await requisicao('/login', {
    metodo: 'POST',
    corpo: { login: telefoneOuEmail, senha },
    erroPadrao: 'Telefone/e-mail ou senha incorretos.',
  });
  if (!resultado.ok) throw new Error(resultado.erro);
  return { token: resultado.token, usuario: resultado.usuario };
}

// Confere o token salvo (rota protegida GET /me). Devolve { ok: true, usuario } ou { ok: false, status, erro }.
const buscarUsuarioLogado = () => requisicao('/me');

export const api = {
  cadastrar,
  login,
  buscarUsuarioLogado,
  // Estas duas ainda NÃO existem no servidor (ficam para a próxima parte):
  listarMedicamentos: (usuarioId) =>
    requisicao(`/medicamentos?usuarioId=${encodeURIComponent(usuarioId)}`),
  marcarTomado: (id) => requisicao(`/medicamentos/${encodeURIComponent(id)}/tomar`, { metodo: 'POST' }),
};
