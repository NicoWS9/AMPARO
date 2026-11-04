import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
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
  formatarData,
  somenteNumeros,
  dataParaISO,
  nomeCompletoValido,
  telefoneValido,
  emailValido,
  senhaValida,
  dataValida,
} from '../utils/formularios';

const VAZIO = { nome: '', telefone: '', email: '', senha: '', nascimento: '' };

// Cadastro de quem usa o app (perfil "usuario").
// Props (todas opcionais):
//   onCadastrar(dados) - chamada quando o formulário está certo. `dados` já vem pronto para o banco:
//       { nome, telefone (só números), email (ou null), senha, dataNascimento ('AAAA-MM-DD'), perfil: 'usuario' }
//   onVoltar, onTenhoConta, onTrocarPerfil - navegação (ou use `navigation`: goBack / 'Login')
export default function CadastroUsuario({
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
  const nascimentoRef = useRef(null);

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
    if (!dataValida(dados.nascimento)) novos.nascimento = 'Digite uma data válida. Ex.: 25/12/1950';

    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    onCadastrar?.({
      nome: dados.nome.trim(),
      telefone: somenteNumeros(dados.telefone),
      email: dados.email.trim() ? dados.email.trim().toLowerCase() : null,
      senha: dados.senha,
      dataNascimento: dataParaISO(dados.nascimento),
      perfil: 'usuario',
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
            onVoltar={voltar}
            titulo="Criar minha conta"
            subtitulo="Preencha seus dados para começar a usar o Amparo."
          />

          <View style={estilosCadastro.formulario}>
            <CampoTexto
              rotulo="Nome completo"
              icone="person-outline"
              valor={dados.nome}
              aoMudar={(t) => mudar('nome', t)}
              erro={erros.nome}
              placeholder="Ex.: Maria da Silva"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => telefoneRef.current?.focus()}
            />

            <CampoTexto
              ref={telefoneRef}
              rotulo="Telefone (celular)"
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
              dica="Mínimo de 6 caracteres. Toque no olho para ver o que digitou."
              placeholder="Crie uma senha"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => nascimentoRef.current?.focus()}
            />

            <CampoTexto
              ref={nascimentoRef}
              rotulo="Data de nascimento"
              icone="calendar-outline"
              valor={dados.nascimento}
              aoMudar={(t) => mudar('nascimento', formatarData(t))}
              erro={erros.nascimento}
              placeholder="DD/MM/AAAA"
              keyboardType="number-pad"
              maxLength={10}
              returnKeyType="done"
              onSubmitEditing={cadastrar}
            />
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
                accessibilityLabel="Cadastrar como familiar"
              >
                <Text style={estilosCadastro.rodapeLink}>Sou da família: cadastrar como familiar</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}