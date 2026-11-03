import { View } from 'react-native';

// Anéis concêntricos bem discretos, usados como enfeite no canto dos fundos azuis.
// `tamanho` é o diâmetro do anel maior; `topo` e `direita` posicionam o centro do conjunto.
export default function AneisDecorativos({ tamanho = 260, topo = -90, direita = -90 }) {
  const aneis = [1, 0.72, 0.46];

  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={{
        position: 'absolute',
        top: topo,
        right: direita,
        width: tamanho,
        height: tamanho,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {aneis.map((escala) => (
        <View
          key={escala}
          style={{
            position: 'absolute',
            width: tamanho * escala,
            height: tamanho * escala,
            borderRadius: tamanho,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        />
      ))}
    </View>
  );
}