// Máscaras e validações usadas nos formulários de cadastro.

export const somenteNumeros = (texto = '') => texto.replace(/\D/g, '');

// 42999998888 -> (42) 99999-8888
export function formatarTelefone(texto) {
  const d = somenteNumeros(texto).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// 10 ou 11 números, DDD válido e, com 11 números, celular começando em 9
export function telefoneValido(texto) {
  const d = somenteNumeros(texto);
  if (d.length !== 10 && d.length !== 11) return false;
  if (Number(d.slice(0, 2)) < 11) return false;
  if (d.length === 11 && d[2] !== '9') return false;
  return true;
}

// 25121950 -> 25/12/1950
export function formatarData(texto) {
  const d = somenteNumeros(texto).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

// Data real (não aceita 31/02), a partir de 1900 e que não seja no futuro
export function dataValida(texto, hoje = new Date()) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!m) return false;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  if (ano < 1900) return false;
  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    return false;
  }
  return data <= hoje;
}

// 25/12/1950 -> 1950-12-25 (o formato que o MySQL espera na coluna DATE)
export function dataParaISO(texto) {
  const [dia, mes, ano] = texto.split('/');
  return `${ano}-${mes}-${dia}`;
}

export function emailValido(texto = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto.trim());
}

// Pelo menos nome e sobrenome
export function nomeCompletoValido(texto = '') {
  const partes = texto.trim().split(/\s+/).filter(Boolean);
  return partes.length >= 2 && texto.trim().length >= 5;
}

export const senhaValida = (texto = '') => texto.length >= 6;

// ---------- Partes comuns aos dois cadastros (usuário e familiar) ----------

// Mensagens de erro dos campos nome, telefone, e-mail e senha ({} se estiver tudo certo)
export function validarDadosBasicos({ nome, telefone, email, senha }) {
  const erros = {};
  if (!nomeCompletoValido(nome)) erros.nome = 'Digite seu nome e sobrenome.';
  if (!telefoneValido(telefone)) erros.telefone = 'Digite o telefone com DDD. Ex.: (42) 99999-8888';
  if (email.trim() && !emailValido(email)) erros.email = 'Esse e-mail não parece certo. Confira.';
  if (!senhaValida(senha)) erros.senha = 'A senha precisa ter pelo menos 6 caracteres.';
  return erros;
}

// Os mesmos campos já limpos, no formato que o servidor espera
export function montarDadosBasicos({ nome, telefone, email, senha }) {
  const emailLimpo = email.trim().toLowerCase();
  return {
    nome: nome.trim(),
    telefone: somenteNumeros(telefone),
    email: emailLimpo || null,
    senha,
  };
}