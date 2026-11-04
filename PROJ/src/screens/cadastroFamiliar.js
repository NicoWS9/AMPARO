import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CabecalhoCadastro from '../components/cabecalhoCadastro';
import CampoTexto from '../components/campoTexto';
import { cores } from '../styles/tema';
import { estilosCadastro } from '../styles/cadastroStyles';
import {
  formatarTelefone,
  somenteNumeros,
  nomeCompletoValido,
  telefoneValido,
  emailValido,
  senhaValida,
} from '../utils/formularios';

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

// Cadastro de familiar / cuidador (perfil "familia").
// Props (todas opcionais):
//   onCadastrar(dados) - chamada quando o formulário está certo. `dados` já vem pronto para o banco:
//       { nome, telefone, email (ou null), senha, perfil: 'familia',
//         parentesco, telefoneAcompanhado (só números), recebeAlertas (true/false) }
//       -> os três últimos alimentam a tabela vinculos_familia
//   onVoltar, onTenhoConta, onTrocarPerfil - navegação (ou use `navigation`: goBack / 'Login')
export default function CadastroFamiliar({
  navigation,
  onVoltar,
  onCadastrar,
  onTenhoConta,
  onTrocarPerfil,
}) {
  const voltar = onVoltar ?? (() => navigation?.goBack());
  const tenhoConta = onTenhoConta ?? (() => navigation?.navigate('Login'));

  const [dados, setDados] = useState(VAZIO);
  const [erros, setErros] = useState({});

  const telefoneRef = useRef(null);
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  const acompanhadoRef = useRef(null);

  const mudar = (campo, valor) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const cadastrar = () => {
    const novos = {};
    if (!nomeCompletoValido(dados.nome)) novos.nome = 'Digite seu nome e sobrenome.';
    if (!telefoneValido(dados.telefone)) novos.telefone = 'Digite o telefone com DDD. Ex.: (42) 99999-8888';
    if (dados.email.trim() && !emailValido(dados.email)) novos.email = 'Esse e-mail não parece certo. Confira.';
    if (!senhaValida(dados.senha)) novos.senha = 'A senha precisa ter pelo menos 6 caracteres.';
    if (!dados.parentesco) novos.parentesco = 'Escolha quem você é para essa pessoa.';
    if (!telefoneValido(dados.telefoneAcompanhado)) {
      novos.telefoneAcompanhado = 'Digite o telefone da pessoa, com DDD.';
    } else if (somenteNumeros(dados.telefoneAcompanhado) === somenteNumeros(dados.telefone)) {
      novos.telefoneAcompanhado = 'Esse é o seu próprio número. Digite o da pessoa que você vai acompanhar.';
    }

    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    onCadastrar?.({
      nome: dados.nome.trim(),
      telefone: somenteNumeros(dados.telefone),
      email: dados.email.trim() ? dados.email.trim().toLowerCase() : null,
      senha: dados.senha,
      perfil: 'familia',
      parentesco: dados.parentesco,
      telefoneAcompanhado: somenteNumeros(dados.telefoneAcompanhado),
      recebeAlertas: dados.recebeAlertas,
    });
  };

  return (
    <SafeAreaView style={estilosCadastro.container}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.fundoCreme} />
      <KeyboardAvoidingView
        style={estilosCadastro.teclado}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={estilosCadastro.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CabecalhoCadastro
            familia
            onVoltar={voltar}
            titulo="Criar conta de familiar"
            subtitulo="Cadastre-se para acompanhar, de pertinho, quem você cuida."
          />

          <View style={estilosCadastro.formulario}>
            <CampoTexto
              rotulo="Nome completo"
              icone="person-outline"
              valor={dados.nome}
              aoMudar={(t) => mudar('nome', t)}
              erro={erros.nome}
              placeholder="Ex.: Carlos da Silva"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => telefoneRef.current?.focus()}
            />

            <CampoTexto
              ref={telefoneRef}
              rotulo="Seu telefone (celular)"
              icone="call-outline"
              valor={dados.telefone}
              aoMudar={(t) => mudar('telefone', formatarTelefone(t))}
              erro={erros.telefone}
              placeholder="(42) 99999-8888"
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
              maxLength={15}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <CampoTexto
              ref={emailRef}
              rotulo="E-mail"
              opcional
              icone="mail-outline"
              valor={dados.email}
              aoMudar={(t) => mudar('email', t)}
              erro={erros.email}
              placeholder="seunome@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => senhaRef.current?.focus()}
            />

            <CampoTexto
              ref={senhaRef}
              rotulo="Senha do app"
              icone="lock-closed-outline"
              senha
              valor={dados.senha}
              aoMudar={(t) => mudar('senha', t)}
              erro={erros.senha}
              dica="Mínimo de 6 caracteres."
              placeholder="Crie uma senha"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="done"
            />

            {/* Parentesco */}
            <View>
              <Text style={estilosCadastro.grupoRotulo}>Quem você é para essa pessoa?</Text>
              <View style={estilosCadastro.chips} accessibilityRole="radiogroup">
                {PARENTESCOS.map((opcao) => {
                  const ativo = dados.parentesco === opcao;
                  return (
                    <Pressable
                      key={opcao}
                      onPress={() => mudar('parentesco', opcao)}
                      accessibilityRole="radio"
                      accessibilityLabel={opcao}
                      accessibilityState={{ checked: ativo }}
                      style={[estilosCadastro.chip, ativo && estilosCadastro.chipAtivo]}
                    >
                      <Text style={[estilosCadastro.chipTexto, ativo && estilosCadastro.chipTextoAtivo]}>
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
              onSubmitEditing={cadastrar}
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
                trackColor={{ false: '#D5D9E6', true: cores.azulMarinho }}
                thumbColor={cores.branco}
              />
            </View>
          </View>

          <Pressable
            onPress={cadastrar}
            accessibilityRole="button"
            accessibilityLabel="Criar conta"
            style={({ pressed }) => [estilosCadastro.botao, pressed && estilosCadastro.pressionado]}
          >
            <Text style={estilosCadastro.botaoTexto}>Criar conta</Text>
          </Pressable>

          <View style={estilosCadastro.rodape}>
            <View style={estilosCadastro.rodapeLinha}>
              <Text style={estilosCadastro.rodapeTexto}>Já tem uma conta?</Text>
              <Pressable onPress={tenhoConta} accessibilityRole="button" accessibilityLabel="Entrar">
                <Text style={estilosCadastro.rodapeLink}>Entrar</Text>
              </Pressable>
            </View>
            {onTrocarPerfil ? (
              <Pressable
                onPress={onTrocarPerfil}
                accessibilityRole="button"
                accessibilityLabel="Cadastrar como quem usa o app"
              >
                <Text style={estilosCadastro.rodapeLink}>Eu uso o app: cadastrar como usuário</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}