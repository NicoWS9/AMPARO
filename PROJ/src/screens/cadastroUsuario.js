import { useRef } from 'react';

import CampoTexto from '../components/campoTexto';
import {CamposBasicos, TelaCadastro, useFormularioCadastro,} from '../components/formularioCadastro';
import { formatarData, dataParaISO, dataValida, validarDadosBasicos, montarDadosBasicos,} from '../utils/formularios';

// O nome do campo é igual ao que o servidor usa: assim um erro vindo dele
// ({ campos: { dataNascimento } }) aparece embaixo do campo certo.
const VAZIO = { nome: '', telefone: '', email: '', senha: '', dataNascimento: '' };

function validar(dados) {
  const erros = validarDadosBasicos(dados);
  if (!dataValida(dados.dataNascimento)) {
    erros.dataNascimento = 'Digite uma data válida. Ex.: 25/12/1950';
  }
  return erros;
}

const montar = (dados) => ({
  ...montarDadosBasicos(dados),
  dataNascimento: dataParaISO(dados.dataNascimento),
  perfil: 'usuario',
});

// Cadastro de quem usa o app (perfil "usuario").
// Props (todas opcionais):
//   onCadastrar(dados) - chamada quando o formulário está certo (pode devolver uma Promise
//       com { ok, erro, campos }: os erros do servidor aparecem na tela). `dados` já vem pronto para o banco:
//       { nome, telefone (só números), email (ou null), senha, dataNascimento ('AAAA-MM-DD'), perfil: 'usuario' }
//   onVoltar, onTenhoConta, onTrocarPerfil - navegação (ou use `navigation`: goBack / 'Login')
export default function CadastroUsuario({ onCadastrar, ...navegacao }) {
  const form = useFormularioCadastro({ inicial: VAZIO, validar, montar, onCadastrar });
  const { dados, erros, mudar } = form;
  const nascimentoRef = useRef(null);

  return (
    <TelaCadastro
      {...navegacao}
      titulo="Criar minha conta"
      subtitulo="Preencha seus dados para começar a usar o Amparo."
      textoTrocarPerfil="Sou da família: cadastrar como familiar"
      enviando={form.enviando}
      erroGeral={form.erroGeral}
      onCriar={form.cadastrar}
    >
      <CamposBasicos
        dados={dados}
        erros={erros}
        mudar={mudar}
        exemploNome="Ex.: Maria da Silva"
        dicaSenha="Mínimo de 6 caracteres. Toque no olho para ver o que digitou."
        aoTerminarSenha={() => nascimentoRef.current?.focus()}
      />

      <CampoTexto
        ref={nascimentoRef}
        rotulo="Data de nascimento"
        icone="calendar-outline"
        valor={dados.dataNascimento}
        aoMudar={(t) => mudar('dataNascimento', formatarData(t))}
        erro={erros.dataNascimento}
        placeholder="DD/MM/AAAA"
        keyboardType="number-pad"
        maxLength={10}
        returnKeyType="done"
        onSubmitEditing={form.cadastrar}
      />
    </TelaCadastro>
  );
}
