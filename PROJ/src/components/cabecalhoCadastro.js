import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LogoAmparo from './logoAmparo';
import { cores, estilosComuns } from '../styles/tema';
import { estilosCadastro } from '../styles/cadastroStyles';

// Linha do topo: botão redondo de voltar à esquerda e logo à direita.
// Usada nas telas de cadastro e na Escolha do perfil.
export function TopoComLogo({ onVoltar }) {
  return (
    <View style={estilosComuns.topo}>
      <Pressable
        onPress={onVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        style={estilosComuns.botaoRedondo}
      >
        <Ionicons name="chevron-back" size={22} color={cores.azulTinta} />
      </Pressable>
      <View style={estilosComuns.marca}>
        <LogoAmparo tamanho={24} />
      </View>
    </View>
  );
}

// Topo comum das telas de cadastro: voltar + logo, etiqueta do perfil, título e subtítulo.
//   familia  - false: etiqueta azul ("Eu uso o app") | true: etiqueta lilás ("Sou da família")
export default function CabecalhoCadastro({ onVoltar, familia, titulo, subtitulo }) {
  return (
    <>
      <TopoComLogo onVoltar={onVoltar} />

      <View
        style={[
          estilosCadastro.etiqueta,
          familia ? estilosCadastro.etiquetaFamilia : estilosCadastro.etiquetaUsuario,
        ]}
      >
        <Ionicons
          name={familia ? 'people-outline' : 'person-outline'}
          size={16}
          color={familia ? cores.lilasEscuro : cores.ouro}
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

      <Text accessibilityRole="header" style={estilosComuns.tituloSerifado}>
        {titulo}
      </Text>
      <Text style={estilosCadastro.subtitulo}>{subtitulo}</Text>
    </>
  );
}
