// Regras de validação do cadastro.
// O servidor SEMPRE confere os dados de novo, mesmo que o app já tenha conferido:
// qualquer pessoa pode mandar um pedido direto para a API, sem passar pelo app.

export const PERFIS = ['usuario', 'familia'];
export const PARENTESCOS = ['Filho(a)', 'Neto(a)', 'Cônjuge', 'Irmão(ã)', 'Cuidador(a)', 'Outro'];

const somenteNumeros = (valor) => String(valor ?? '').replace(/\D/g, '');
const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

// 10 ou 11 números, DDD válido (11 a 99) e, com 11 números, celular começando em 9
function telefoneValido(digitos) {
  if (digitos.length !== 10 && digitos.length !== 11) return false;
  if (Number(digitos.slice(0, 2)) < 11) return false;
  if (digitos.length === 11 && digitos[2] !== '9') return false;
  return true;
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Data no formato AAAA-MM-DD, que exista de verdade, a partir de 1900 e que não seja no futuro
function dataValida(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return false;
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (ano < 1900) return false;
  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    return false;
  }
  return data <= new Date();
}

// Recebe o corpo do pedido (o que o app mandou) e devolve:
//   campos - mensagens de erro por campo ({} se estiver tudo certo)
//   dados  - os valores já limpos, prontos para gravar
export function validarCadastro(corpo) {
  const c = corpo && typeof corpo === 'object' ? corpo : {};
  const campos = {};

  const perfil = texto(c.perfil);
  const nome = texto(c.nome);
  const telefone = somenteNumeros(c.telefone);
  const email = texto(c.email).toLowerCase();
  const senha = typeof c.senha === 'string' ? c.senha : '';
  const dataNascimento = texto(c.dataNascimento);
  const parentesco = texto(c.parentesco);
  const telefoneAcompanhado = somenteNumeros(c.telefoneAcompanhado);

  if (!PERFIS.includes(perfil)) campos.perfil = 'Perfil inválido.';

  if (nome.split(/\s+/).filter(Boolean).length < 2 || nome.length < 5) {
    campos.nome = 'Digite nome e sobrenome.';
  } else if (nome.length > 100) {
    campos.nome = 'O nome pode ter no máximo 100 caracteres.';
  }

  if (!telefoneValido(telefone)) campos.telefone = 'Digite o telefone com DDD.';

  if (email && (!emailValido(email) || email.length > 150)) campos.email = 'E-mail inválido.';

  if (senha.length < 6) {
    campos.senha = 'A senha precisa ter pelo menos 6 caracteres.';
  } else if (Buffer.byteLength(senha) > 72) {
    campos.senha = 'A senha pode ter no máximo 72 caracteres.'; // limite do bcrypt
  }

  let recebeAlertas = true;

  if (perfil === 'usuario' && !dataValida(dataNascimento)) {
    campos.dataNascimento = 'Informe uma data de nascimento válida (AAAA-MM-DD).';
  }

  if (perfil === 'familia') {
    if (!PARENTESCOS.includes(parentesco)) campos.parentesco = 'Escolha o parentesco.';

    if (!telefoneValido(telefoneAcompanhado)) {
      campos.telefoneAcompanhado = 'Digite o telefone da pessoa que você vai acompanhar.';
    } else if (telefoneAcompanhado === telefone) {
      campos.telefoneAcompanhado = 'Esse é o seu próprio número.';
    }

    if (c.recebeAlertas !== undefined) {
      if (typeof c.recebeAlertas === 'boolean') recebeAlertas = c.recebeAlertas;
      else campos.recebeAlertas = 'Valor inválido.';
    }
  }

  return {
    campos,
    dados: {
      perfil,
      nome,
      telefone,
      email: email || null,
      senha,
      dataNascimento: perfil === 'usuario' ? dataNascimento : null,
      parentesco,
      telefoneAcompanhado,
      recebeAlertas,
    },
  };
}

// Login: a pessoa pode entrar com o TELEFONE (obrigatório no cadastro) ou com o E-MAIL.
// Devolve:
//   campos - mensagens de erro por campo ({} se estiver tudo certo)
//   dados  - { login, senha }, com o login já limpo:
//            e-mail em minúsculas, ou telefone só com números
export function validarLogin(corpo) {
  const c = corpo && typeof corpo === 'object' ? corpo : {};
  const campos = {};

  const digitado = texto(c.login);
  const senha = typeof c.senha === 'string' ? c.senha : '';

  if (!digitado) campos.login = 'Digite seu telefone ou e-mail.';
  if (!senha) campos.senha = 'Digite sua senha.';

  // Tem "@"? Então é e-mail. Senão, tratamos como telefone.
  const login = digitado.includes('@') ? digitado.toLowerCase() : somenteNumeros(digitado);

  return { campos, dados: { login, senha } };
}