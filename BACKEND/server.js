// Servidor do Amparo - por enquanto só o CADASTRO.
// Como rodar:  npm install  e depois  npm start
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';
import { validarCadastro } from './validacoes.js';

const app = express();
app.use(cors());
app.use(express.json());

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
      if (chave === 'telefone') {
        return res.status(409).json({
          erro: 'Esse telefone já está cadastrado.',
          campos: { telefone: 'Esse telefone já está cadastrado.' },
        });
      }
      if (chave === 'email') {
        return res.status(409).json({
          erro: 'Esse e-mail já está cadastrado.',
          campos: { email: 'Esse e-mail já está cadastrado.' },
        });
      }
      return res.status(409).json({ erro: 'Esse cadastro já existe.' });
    }

    console.error('Erro no cadastro:', erro.message); // o detalhe fica só no servidor
    res.status(500).json({ erro: 'Não foi possível concluir o cadastro. Tente de novo.' });
  } finally {
    if (conexao) conexao.release(); // devolve a conexão ao pool, sempre
  }
});

// JSON mal formado no pedido
app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'Pedido inválido.' });
  }
  next(erro);
});

const PORTA = 3000;
app.listen(PORTA, () => console.log(`API rodando em http://localhost:${PORTA}`));