// Servidor do Amparo: CADASTRO e LOGIN (com token JWT).
// Como rodar:  npm install  e depois  npm start
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './db.js'; // o db.js também carrega o .env
import { validarCadastro, validarLogin } from './validacoes.js';

// Segredo que "assina" os tokens. Fica no .env, nunca no código.
// Quem não conhece o segredo não consegue criar nem alterar um token.
const SEGREDO = process.env.JWT_SEGREDO;
if (!SEGREDO) {
  console.error('Falta o JWT_SEGREDO no arquivo .env do BACKEND.');
  process.exit(1);
}
const VALIDADE_TOKEN = '7d'; // depois de 7 dias a pessoa precisa entrar de novo

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Token (JWT) ----------

// Cria o token de quem acabou de entrar. Dentro dele vão só o id e o perfil
// (nunca a senha: o conteúdo de um JWT pode ser lido por qualquer um, só não pode ser alterado).
function gerarToken(usuario) {
  return jwt.sign({ id: usuario.id, perfil: usuario.perfil }, SEGREDO, { expiresIn: VALIDADE_TOKEN });
}

// "Porteiro" das rotas protegidas: só deixa passar quem mandar um token válido
// no cabeçalho  Authorization: Bearer <token>.  Se passar, req.usuario = { id, perfil }.
function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Faça login para continuar.' });
  }
  try {
    req.usuario = jwt.verify(token, SEGREDO); // confere a assinatura e a validade
    next(); // token certo: segue para a rota
  } catch {
    res.status(401).json({ erro: 'Sua sessão expirou. Entre de novo.' });
  }
}

// Só os dados que podem voltar para o app (sem senha_hash)
const dadosPublicos = (u) => ({
  id: u.id,
  nome: u.nome,
  telefone: u.telefone,
  email: u.email,
  perfil: u.perfil,
});

// ---------- Cadastro ----------

// Grava uma pessoa na tabela usuarios e devolve o id novo.
// `conexao` é a conexão da transação em andamento.
async function inserirUsuario(conexao, dados, senhaHash) {
  const [resultado] = await conexao.execute(
    `INSERT INTO usuarios (nome, telefone, email, senha_hash, perfil, data_nascimento)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [dados.nome, dados.telefone, dados.email, senhaHash, dados.perfil, dados.dataNascimento]
  );
  return resultado.insertId;
}

// Mensagem para cada coluna UNIQUE da tabela usuarios (nome do índice no MySQL -> mensagem)
const MENSAGENS_DUPLICADO = {
  telefone: 'Esse telefone já está cadastrado.',
  email: 'Esse e-mail já está cadastrado.',
};

// POST /cadastro
// O app manda, em JSON:
//   usuário:  { perfil: 'usuario', nome, telefone, email, senha, dataNascimento: 'AAAA-MM-DD' }
//   familiar: { perfil: 'familia', nome, telefone, email, senha,
//               parentesco, telefoneAcompanhado, recebeAlertas }
app.post('/cadastro', async (req, res) => {
  // 1) Conferir os dados (o servidor nunca confia só no app)
  const { campos, dados } = validarCadastro(req.body);
  if (Object.keys(campos).length > 0) {
    return res.status(400).json({ erro: 'Confira os dados informados.', campos });
  }

  let conexao;
  try {
    // 2) Guardar só o "hash" da senha, nunca a senha em si
    const senhaHash = await bcrypt.hash(dados.senha, 10);

    // 3) Tudo abaixo é uma transação: ou grava tudo, ou não grava nada
    conexao = await pool.getConnection();
    await conexao.beginTransaction();

    // Familiar: primeiro acha a pessoa que ele vai acompanhar (tem que ser do perfil 'usuario')
    let idPessoaAcompanhada = null;
    if (dados.perfil === 'familia') {
      const [achados] = await conexao.execute(
        "SELECT id FROM usuarios WHERE telefone = ? AND perfil = 'usuario'",
        [dados.telefoneAcompanhado]
      );
      if (achados.length === 0) {
        await conexao.rollback();
        return res.status(404).json({
          erro: 'Não encontramos ninguém com esse telefone. A pessoa precisa se cadastrar primeiro.',
          campos: { telefoneAcompanhado: 'Ninguém cadastrado com esse telefone.' },
        });
      }
      idPessoaAcompanhada = achados[0].id;
    }

    // Grava a pessoa (usuário ou familiar) na tabela usuarios
    const novoId = await inserirUsuario(conexao, dados, senhaHash);

    // Familiar: grava também a ligação com a pessoa acompanhada
    if (dados.perfil === 'familia') {
      await conexao.execute(
        `INSERT INTO vinculos_familia (acompanhado_id, familiar_id, parentesco, recebe_alertas)
         VALUES (?, ?, ?, ?)`,
        [idPessoaAcompanhada, novoId, dados.parentesco, dados.recebeAlertas ? 1 : 0]
      );
    }

    await conexao.commit();
    res.status(201).json({ id: novoId, perfil: dados.perfil }); // a senha nunca volta na resposta
  } catch (erro) {
    if (conexao) await conexao.rollback().catch(() => {}); // desfaz o que tiver sido gravado

    // Telefone ou e-mail já cadastrado (as colunas são UNIQUE)
    if (erro.code === 'ER_DUP_ENTRY') {
      const chave = /for key '(?:\w+\.)?(\w+)'/.exec(erro.message)?.[1];
      const mensagem = MENSAGENS_DUPLICADO[chave];
      return res.status(409).json(
        mensagem ? { erro: mensagem, campos: { [chave]: mensagem } } : { erro: 'Esse cadastro já existe.' }
      );
    }

    console.error('Erro no cadastro:', erro.code ?? erro.message); // o detalhe fica só no servidor
    res.status(500).json({ erro: 'Não foi possível concluir o cadastro. Tente de novo.' });
  } finally {
    if (conexao) conexao.release(); // devolve a conexão ao pool, sempre
  }
});

// ---------- Login ----------

// POST /login
// O app manda: { login: telefone ou e-mail, senha }
// Responde:    { token, usuario: { id, nome, telefone, email, perfil } }
app.post('/login', async (req, res) => {
  const { campos, dados } = validarLogin(req.body);
  if (Object.keys(campos).length > 0) {
    return res.status(400).json({ erro: 'Preencha o telefone (ou e-mail) e a senha.', campos });
  }

  try {
    // Procura pelo telefone OU pelo e-mail (o mesmo valor nos dois "?")
    const [achados] = await pool.execute(
      'SELECT id, nome, telefone, email, perfil, senha_hash FROM usuarios WHERE telefone = ? OR email = ?',
      [dados.login, dados.login]
    );
    const usuario = achados[0];

    // bcrypt.compare gera o hash da senha digitada e compara com o hash guardado
    const senhaCerta = usuario ? await bcrypt.compare(dados.senha, usuario.senha_hash) : false;

    // A mesma mensagem para "não existe" e "senha errada": assim ninguém descobre
    // quais telefones estão cadastrados tentando entrar.
    if (!senhaCerta) {
      return res.status(401).json({ erro: 'Telefone/e-mail ou senha incorretos.' });
    }

    res.json({ token: gerarToken(usuario), usuario: dadosPublicos(usuario) });
  } catch (erro) {
    console.error('Erro no login:', erro.code ?? erro.message);
    res.status(500).json({ erro: 'Não foi possível entrar agora. Tente de novo.' });
  }
});

// GET /me  (rota protegida: precisa do token)
// O app chama ao abrir, para conferir se o token salvo ainda vale e pegar os dados atualizados.
app.get('/me', autenticar, async (req, res) => {
  try {
    const [achados] = await pool.execute(
      'SELECT id, nome, telefone, email, perfil FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    if (achados.length === 0) {
      return res.status(401).json({ erro: 'Conta não encontrada. Entre de novo.' });
    }
    res.json({ usuario: dadosPublicos(achados[0]) });
  } catch (erro) {
    console.error('Erro no /me:', erro.code ?? erro.message);
    res.status(500).json({ erro: 'Não foi possível carregar seus dados.' });
  }
});

// JSON mal formado no pedido
app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'Pedido inválido.' });
  }
  next(erro);
});

const PORTA = Number(process.env.PORTA ?? 3000); // o .env já é lido pelo db.js
app.listen(PORTA, () => console.log(`API rodando em http://localhost:${PORTA}`));