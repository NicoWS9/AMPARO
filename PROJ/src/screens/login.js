import { useState } from 'react';
import {View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { entrar } = useAuth();
  const [login, setLogin] = useState(''); // telefone ou e-mail
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleEntrar() {
    if (!login.trim() || !senha) {
      setErro('Preencha o telefone (ou e-mail) e a senha.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      // O AuthContext manda para o servidor (POST /login), que confere no banco
      // e devolve um token. Ao dar certo, o App troca a tela sozinho (usuario deixa de ser null).
      await entrar(login.trim(), senha);
    } catch (e) {
      setErro(e.message); // a mensagem já vem pronta do servidor (ex.: senha incorreta)
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.conteudo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.titulo}>Olá!</Text>
        <Text style={styles.subtitulo}>Entre na sua conta para continuar</Text>

        <Text style={styles.label}>Telefone ou e-mail</Text>
        <TextInput
          style={styles.input}
          value={login}
          onChangeText={setLogin}
          placeholder="(42) 99999-8888 ou seu e-mail"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="username"
          autoComplete="username"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.senhaBox}>
          <TextInput
            style={[styles.input, styles.inputSenha]}
            value={senha}
            onChangeText={setSenha}
            placeholder="Sua senha"
            secureTextEntry={!mostrarSenha}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            autoComplete="password"
            onSubmitEditing={handleEntrar}
          />
          <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.olho}>
            <Ionicons name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'} size={22} color="#555" />
          </Pressable>
        </View>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <Pressable
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleEntrar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FC' },
  conteudo: { flex: 1, justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 34, fontWeight: '800', color: '#1F2D3D' },
  subtitulo: { fontSize: 16, color: '#333', marginBottom: 28 },
  label: { fontSize: 15, fontWeight: '600', color: '#1F2D3D', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2B7BD6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    marginBottom: 16,
  },
  senhaBox: { justifyContent: 'center' },
  inputSenha: { paddingRight: 48 },
  olho: { position: 'absolute', right: 14, top: 14 },
  erro: { color: '#C62828', fontSize: 15, marginBottom: 12 },
  botao: {
    backgroundColor: '#2B7BD6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoDesabilitado: { opacity: 0.7 },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: '700' },
});