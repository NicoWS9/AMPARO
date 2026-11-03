import { View } from 'react-native';
import { cores } from '../styles/tema';

// Símbolo do Amparo: três arcos concêntricos (desenhados com Views, sem biblioteca extra).
export default function LogoAmparo({ tamanho = 28, cor = cores.ouro }) {
  const espessura = Math.max(2, Math.round(tamanho / 11));
  const arcos = [1, 0.66, 0.32];

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Logo do Amparo"
      style={{
        width: tamanho,
        height: tamanho,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {arcos.map((escala) => {
        const lado = tamanho * escala;
        return (
          <View
            key={escala}
            style={{
              position: 'absolute',
              bottom: 0,
              width: lado,
              height: lado,
              borderTopLeftRadius: lado / 2,
              borderTopRightRadius: lado / 2,
              borderWidth: espessura,
              borderBottomWidth: 0,
              borderColor: cor,
            }}
          />
        );
      })}
    </View>
  );
}