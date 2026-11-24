import { useRef } from 'react';
import { View, Text, Pressable, Switch } from 'react-native';

import CampoTexto from '../components/campoTexto';
import {
  CamposBasicos,
  TelaCadastro,
  useFormularioCadastro,
} from '../components/formularioCadastro';
import { cores } from '../styles/tema';
import { estilosCadastro } from '../styles/cadastroStyles';
import {
  formatarTelefone,
  somenteNumeros,
  telefoneValido,
  validarDadosBasicos,
  montarDadosBasicos,
} from '../utils/formularios';

// Mesma lista do backend (BACKEND/validacoes.js): se mudar aqui, mude lá também.
const PARENTESCOS = ['Filho(a)', 'Neto(a)', 'Cônjuge', 'Irmão(ã)', 'Cuidador(a)', 'Outro'];

const VAZIO = {
  nome: '',
  telefone: '',
  email: '',
  senha: '',
  parentesco: '',
  telefoneAcompanhado: '',
  recebeAlertas: true,
};

function validar(dados) {
  const erros = validarDadosBasicos(dados);
  if (!dados.parentesco) erros.parentesco = 'Escolha quem você é para essa pessoa.';
  if (!telefoneValido(dados.telefoneAcompanhado)) {
    erros.telefoneAcompanhado = 'Digite o telefone da pessoa, com DDD.';
  } else if (somenteNumeros(dados.telefoneAcompanhado) === somenteNumeros(dados.telefone)) {
    erros.telefoneAcompanhado = 'Esse é o seu próprio número. Digite o da pessoa que você vai acompanhar.';
  }
  return erros;
}

const montar = (dados) => ({
  ...montarDadosBasicos(dados),
  perfil: 'familia',
  parentesco: dados.parentesco,
  telefoneAcompanhado: somenteNumeros(dados.telefoneAcompanhado),
  recebeAlertas: dados.recebeAlertas,
});

// Cadastro de familiar / cuidador (perfil "familia").
// Props (todas opcionais):
//   onCadastrar(dados) - chamada quando o formulário está certo (pode devolver uma Promise
//       com { ok, erro, campos }: os erros do servidor aparecem na tela). `dados` já vem pronto para o banco:
//       { nome, telefone, email (ou null), senha, perfil: 'familia',
//         parentesco, telefoneAcompanhado (só números), recebeAlertas (true/false) }
//       -> os três últimos alimentam a tabela vinculos_familia
//   onVoltar, onTenhoConta, onTrocarPerfil - navegação (ou use `navigation`: goBack / 'Login')
export default function CadastroFamiliar({ onCadastrar, ...navegacao }) {
  const form = useFormularioCadastro({ inicial: VAZIO, validar, montar, onCadastrar });
  const { dados, erros, mudar } = form;
  const acompanhadoRef = useRef(null);

  return (
    <TelaCadastro
      {...navegacao}
      familia
      titulo="Criar conta de familiar"
      subtitulo="Cadastre-se para acompanhar, de pertinho, quem você cuida."
      textoTrocarPerfil="Eu uso o app: cadastrar como usuário"
      enviando={form.enviando}
      erroGeral={form.erroGeral}
      onCriar={form.cadastrar}
    >
      <CamposBasicos
        dados={dados}
        erros={erros}
        mudar={mudar}
        exemploNome="Ex.: Carlos da Silva"
        rotuloTelefone="Seu telefone (celular)"
      />

      {/* Parentesco */}
      <View>
        <Text style={estilosCadastro.grupoRotulo}>Quem você é para essa pessoa?</Text>
        <View style={estilosCadastro.chips} accessibilityRole="radiogroup">
          {PARENTESCOS.map((opcao) => {
            const escolhido = dados.parentesco === opcao;
            return (
              <Pressable
                key={opcao}
                onPress={() => {
                  mudar('parentesco', opcao);
                  acompanhadoRef.current?.focus(); // já leva para o próximo campo
                }}
                accessibilityRole="radio"
                accessibilityLabel={opcao}
                accessibilityState={{ checked: escolhido }}
                style={[estilosCadastro.chip, escolhido && estilosCadastro.chipAtivo]}
              >
                <Text style={[estilosCadastro.chipTexto, escolhido && estilosCadastro.chipTextoAtivo]}>
                  {opcao}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {erros.parentesco ? (
          <Text accessibilityLiveRegion="polite" style={estilosCadastro.erroGrupo}>
            {erros.parentesco}
          </Text>
        ) : null}
      </View>

      <CampoTexto
        ref={acompanhadoRef}
        rotulo="Telefone da pessoa que você vai acompanhar"
        icone="people-outline"
        valor={dados.telefoneAcompanhado}
        aoMudar={(t) => mudar('telefoneAcompanhado', formatarTelefone(t))}
        erro={erros.telefoneAcompanhado}
        dica="É o número que ela usa no Amparo, para ligarmos as duas contas."
        placeholder="(42) 98888-7777"
        keyboardType="phone-pad"
        maxLength={15}
        returnKeyType="done"
        onSubmitEditing={form.cadastrar}
      />

      {/* Alertas */}
      <View style={estilosCadastro.linhaSwitch}>
        <View style={estilosCadastro.linhaSwitchTextos}>
          <Text style={estilosCadastro.linhaSwitchTitulo}>Receber alertas</Text>
          <Text style={estilosCadastro.linhaSwitchDica}>
            Emergências, doses atrasadas e quando ela disser que não está bem.
          </Text>
        </View>
        <Switch
          value={dados.recebeAlertas}
          onValueChange={(v) => mudar('recebeAlertas', v)}
          accessibilityLabel="Receber alertas"
          trackColor={{ false: cores.borda, true: cores.azulMarinho }}
          thumbColor={cores.branco}
        />
      </View>
    </TelaCadastro>
  );
}
