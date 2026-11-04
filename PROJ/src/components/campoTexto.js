import { forwardRef, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cores } from '../styles/tema';
import { estilosCampoTexto, corPlaceholder } from '../styles/campoTextoStyles';

// Campo de formulário: rótulo em cima, caixa com ícone, dica ou mensagem de erro embaixo.
//   rotulo   - texto acima do campo
//   opcional - mostra "(opcional)" ao lado do rótulo
//   valor / aoMudar - o texto e a função chamada a cada digitação
//   erro     - mensagem de erro (deixa a borda vermelha)
//   dica     - texto de ajuda (some quando há erro)
//   icone    - nome de um ícone Ionicons
//   senha    - esconde o texto e mostra o botão "olho" para revelar
// Qualquer outra prop (keyboardType, placeholder, maxLength...) vai direto para o TextInput.
const CampoTexto = forwardRef(function CampoTexto(
  { rotulo, opcional, valor, aoMudar, erro, dica, icone, senha, ...resto },
  ref
) {
  const [focado, setFocado] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  return (
    <View style={estilosCampoTexto.grupo}>
      <Text style={estilosCampoTexto.rotulo}>
        {rotulo}
        {opcional ? <Text style={estilosCampoTexto.opcional}> (opcional)</Text> : null}
      </Text>

      <View
        style={[
          estilosCampoTexto.caixa,
          focado && estilosCampoTexto.caixaFocada,
          !!erro && estilosCampoTexto.caixaErro,
        ]}
      >
        {icone ? (
          <Ionicons name={icone} size={22} color={focado ? cores.azulMarinho : cores.textoSuave} />
        ) : null}

        <TextInput
          placeholderTextColor={corPlaceholder}
          {...resto}
          ref={ref}
          value={valor}
          onChangeText={aoMudar}
          accessibilityLabel={opcional ? `${rotulo} (opcional)` : rotulo}
          secureTextEntry={!!senha && !mostrar}
          style={estilosCampoTexto.input}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
        />

        {senha ? (
          <Pressable
            onPress={() => setMostrar((v) => !v)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
            style={estilosCampoTexto.botaoOlho}
          >
            <Ionicons
              name={mostrar ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={cores.textoSuave}
            />
          </Pressable>
        ) : null}
      </View>

      {erro ? (
        <Text accessibilityLiveRegion="polite" style={estilosCampoTexto.erro}>
          {erro}
        </Text>
      ) : dica ? (
        <Text style={estilosCampoTexto.dica}>{dica}</Text>
      ) : null}
    </View>
  );
});

export default CampoTexto;