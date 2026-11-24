// Tudo o que as telas de cadastro (usuário e familiar) têm em comum:
import { useEffect, useRef, useState } from 'react';
import {View, Text, ScrollView, Pressable, StatusBar, KeyboardAvoidingView, Platform,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CabecalhoCadastro from './cabecalhoCadastro';
import CampoTexto from './campoTexto';
import { cores, estilosComuns } from '../styles/tema';
import { estilosCadastro } from '../styles/cadastroStyles';
import { formatarTelefone } from '../utils/formularios';

//Estado e envio
//   inicial     - valores iniciais dos campos
//   validar     - (dados) => { campo: 'mensagem' }  ({} se estiver tudo certo)
//   montar      - (dados) => objeto pronto para mandar ao servidor
//   onCadastrar - (pacote) => Promise<{ ok, erro, campos }> (vem do fluxoEntrada)
export function useFormularioCadastro({ inicial, validar, montar, onCadastrar }) {
  const [dados, setDados] = useState(inicial);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');

  // ref (e não só o state) para bloquear dois toques rápidos seguidos no botão
  const enviandoRef = useRef(false);
  // evita atualizar a tela depois que ela já foi fechada
  const ativo = useRef(true);
  useEffect(() => () => { ativo.current = false; }, []);

  const mudar = (campo, valor) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const cadastrar = async () => {
    if (enviandoRef.current) return;

    const novos = validar(dados);
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    enviandoRef.current = true;
    setErroGeral('');
    setEnviando(true);
    try {
      const resultado = await onCadastrar?.(montar(dados));
      if (!ativo.current || !resultado || resultado.ok !== false) return;

      // Erros do servidor: aparecem embaixo do campo certo. Se algum não tiver
      // campo na tela (ex.: 'perfil'), mostra a mensagem geral para não sumir.
      const doServidor = resultado.campos ?? {};
      const semCampoNaTela = Object.keys(doServidor).some((campo) => !(campo in dados));
      setErros(doServidor);
      setErroGeral(
        Object.keys(doServidor).length === 0 || semCampoNaTela
          ? resultado.erro ?? 'Não foi possível cadastrar.'
          : ''
      );
    } finally {
      enviandoRef.current = false;
      if (ativo.current) setEnviando(false);
    }
  };

  return { dados, erros, mudar, enviando, erroGeral, cadastrar };
}

// ---------- Nome, telefone, e-mail e senha ----------
//   exemploNome    - placeholder do nome
//   rotuloTelefone - rótulo do telefone
//   dicaSenha      - texto de ajuda da senha
//   aoTerminarSenha - chamado no "próximo" do teclado depois da senha (se não vier, o botão é "ok")
export function CamposBasicos({
  dados,
  erros,
  mudar,
  exemploNome,
  rotuloTelefone = 'Telefone (celular)',
  dicaSenha = 'Mínimo de 6 caracteres.',
  aoTerminarSenha,
}) {
  const telefoneRef = useRef(null);
  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  return (
    <>
      <CampoTexto
        rotulo="Nome completo"
        icone="person-outline"
        valor={dados.nome}
        aoMudar={(t) => mudar('nome', t)}
        erro={erros.nome}
        placeholder={exemploNome}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => telefoneRef.current?.focus()}
      />

      <CampoTexto
        ref={telefoneRef}
        rotulo={rotuloTelefone}
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
        dica={dicaSenha}
        placeholder="Crie uma senha"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password-new"
        textContentType="newPassword"
        returnKeyType={aoTerminarSenha ? 'next' : 'done'}
        onSubmitEditing={aoTerminarSenha}
      />
    </>
  );
}

// ---------- Moldura da tela ----------
//   familia, titulo, subtitulo - repassados ao CabecalhoCadastro
//   enviando, erroGeral, onCriar - vêm do useFormularioCadastro
//   onVoltar, onTenhoConta      - navegação (ou use `navigation`: goBack / 'Login')
//   onTrocarPerfil + textoTrocarPerfil - link opcional para o outro tipo de cadastro
//   children - os campos do formulário
export function TelaCadastro({
  navigation,
  familia,
  titulo,
  subtitulo,
  enviando,
  erroGeral,
  onCriar,
  onVoltar,
  onTenhoConta,
  onTrocarPerfil,
  textoTrocarPerfil,
  children,
}) {
  const voltar = onVoltar ?? (() => navigation?.goBack());
  const tenhoConta = onTenhoConta ?? (() => navigation?.navigate('Login'));

  return (
    <SafeAreaView style={estilosComuns.telaCreme}>
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
            familia={familia}
            onVoltar={voltar}
            titulo={titulo}
            subtitulo={subtitulo}
          />

          <View style={estilosCadastro.formulario}>{children}</View>

          {erroGeral ? (
            <Text accessibilityLiveRegion="polite" style={estilosCadastro.erroGeral}>
              {erroGeral}
            </Text>
          ) : null}

          <Pressable
            onPress={onCriar}
            disabled={enviando}
            accessibilityRole="button"
            accessibilityLabel="Criar conta"
            accessibilityState={{ busy: enviando, disabled: enviando }}
            style={({ pressed }) => [
              estilosCadastro.botao,
              enviando && estilosCadastro.botaoDesativado,
              pressed && estilosComuns.pressionado,
            ]}
          >
            <Text style={estilosCadastro.botaoTexto}>
              {enviando ? 'Criando conta...' : 'Criar conta'}
            </Text>
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
                accessibilityLabel={textoTrocarPerfil}
              >
                <Text style={estilosCadastro.rodapeLink}>{textoTrocarPerfil}</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
