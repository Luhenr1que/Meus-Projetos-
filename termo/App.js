import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import styles from "./style";
import { useEffect, useState } from 'react';


let rodada = 1;

export default function App() {
  
  const [numCerto,getNumCerto] = useState([9,8,7,6]);
  const [resposta,getResposta] = useState([['','','',''],['','','',''],['','','',''],['','','',''],['','','',''],['','','','']])
  const [round,getRound] = useState(rodada);
  const styleDinamico=(round)=>{
    switch(round){
      case 1:
        return styles.round1;
      case 2:
        return styles.round2;
      case 3:
        return styles.round3;
      case 4:
        return styles.round4;
      case 5:
        return styles.round5;
      case 6:
        return styles.round6;
    }
  }
  const Espaço = ({ size }) => <View style={{ width: size }} />;

  useEffect(() =>{
    console.log(numCerto);
    console.log(resposta);
  },
    [numCerto],
    [resposta]
  )

  const renderValores = () => {
    return resposta.map((linha, index) => (
      <View key={index} style={[styles.li, styleDinamico(index + 1)]}>
        {linha.map((valor, subIndex) => (
          <View key={subIndex} style={[styles.valores, styleDinamico(index + 1)]}>
            <Text style={styles.texto}>{valor || ''}</Text>
          </View>
        ))}
      </View>
    ));
  }
  return (
    <View style={styles.container}>
      <View style={styles.titulo}><Text style={styles.titu}>Termo Numérico</Text></View>
      <View style={styles.campos}>
        {renderValores()}
      </View>
      <View style={styles.teclado}>
          <View style={styles.linha}>
            <Pressable style={styles.ordem} onPress={() => addNum('1')}>
              <Text style={styles.item}>1</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={() => addNum('2')}> 
              <Text style={styles.item}>2</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={() => addNum('3')}>
              <Text style={styles.item}>3</Text>
            </Pressable>
          </View>

          <View style={styles.linha}>
            <Pressable style={styles.ordem} onPress={() => addNum('4')}>
              <Text style={styles.item}>4</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={() => addNum('5')}> 
              <Text style={styles.item}>5</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={() => addNum('6')}>
              <Text style={styles.item}>6</Text>
            </Pressable>
          </View>

          <View style={styles.linha}>
            <Pressable style={styles.ordem} onPress={() => addNum('7')}>
              <Text style={styles.item}>7</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={() => addNum('8')}> 
              <Text style={styles.item}>8</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={() => addNum('9')}>
              <Text style={styles.item}>9</Text>
            </Pressable>
          </View>

          <View style={styles.linha}>
            <Pressable style={styles.ordem} onPress={()=> {del()}}>
              <Text style={styles.itemX}>X</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={() => addNum('0')}>
              <Text style={styles.item}>0</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={()=> {calc()}}>
              <Text style={styles.itemY}>✓</Text>
            </Pressable>
          </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}