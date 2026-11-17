// Todas as conversas do app com o servidor ficam aqui.
// Nas telas você usa api.cadastrar(...) sem se preocupar com endereços.
import Constants from 'expo-constants';

const PORTA_SERVIDOR = 3000;

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

const TEMPO_LIMITE_MS = 10000; // desiste se o servidor não responder em 10 segundos

async function requisicao(caminho, opcoes) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, opcoes);
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return resposta.json();
}

// Cria a conta (usuário ou familiar). Nunca lança erro: sempre devolve
//   { ok: true, id, perfil }                       quando deu certo
//   { ok: false, erro: 'mensagem', campos: {...} } quando não deu
// `campos` traz a mensagem de cada campo com problema (ex.: { telefone: 'Esse telefone já está cadastrado.' })
async function cadastrar(dados) {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  try {
    const resposta = await fetch(`${BASE_URL}/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
      signal: controle.signal,
    });
    const corpo = await resposta.json().catch(() => ({}));
    if (resposta.ok) return { ok: true, ...corpo };
    return {
      ok: false,
      erro: corpo.erro ?? 'Não foi possível criar a conta. Tente de novo.',
      campos: corpo.campos ?? {},
    };
  } catch {
    return {
      ok: false,
      erro: 'Não foi possível falar com o servidor. Confira se ele está ligado e se o celular está na mesma rede Wi-Fi.',
      campos: {},
    };
  } finally {
    clearTimeout(relogio);
  }
}

export const api = {
  cadastrar,
  // Estas duas ainda NÃO existem no servidor (ficam para a próxima parte):
  listarMedicamentos: (usuarioId) => requisicao(`/medicamentos?usuarioId=${usuarioId}`),
  marcarTomado: (id) => requisicao(`/medicamentos/${id}/tomar`, { method: 'POST' }),
};