import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LogoAmparo from './logoAmparo';
import { cores } from '../styles/tema';
import { estilosCadastro, corLilasEscuro } from '../styles/cadastroStyles';

// Topo comum das telas de cadastro: voltar + logo, etiqueta do perfil, título e subtítulo.
//   familia  - false: etiqueta azul ("Eu uso o app") | true: etiqueta lilás ("Sou da família")
export default function CabecalhoCadastro({ onVoltar, familia, titulo, subtitulo }) {
  return (
    <>
      <View style={estilosCadastro.topo}>
        <Pressable
          onPress={onVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={estilosCadastro.botaoVoltar}
        >
          <Ionicons name="chevron-back" size={22} color={cores.azulTinta} />
        </Pressable>
        <View style={estilosCadastro.marca}>
          <LogoAmparo tamanho={24} />
        </View>
      </View>

      <View
        style={[
          estilosCadastro.etiqueta,
          familia ? estilosCadastro.etiquetaFamilia : estilosCadastro.etiquetaUsuario,
        ]}
      >
        <Ionicons
          name={familia ? 'people-outline' : 'person-outline'}
          size={16}
          color={familia ? corLilasEscuro : cores.ouro}
        />
        <Text
          style={[
            estilosCadastro.etiquetaTexto,
            familia ? estilosCadastro.etiquetaTextoFamilia : estilosCadastro.etiquetaTextoUsuario,
          ]}
        >
          {familia ? 'Sou da família' : 'Eu uso o app'}
        </Text>
      </View>

      <Text accessibilityRole="header" style={estilosCadastro.titulo}>
        {titulo}
      </Text>
      <Text style={estilosCadastro.subtitulo}>{subtitulo}</Text>
    </>
  );
}