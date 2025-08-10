import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import styles from "./style";
import { useEffect, useState } from 'react';


export default function App() {
  
  const [numCerto,setNumCerto] = useState([1,2,3,4]);
  const [resposta,setResposta] = useState([['','','',''],['','','',''],['','','',''],['','','',''],['','','',''],['','','','']])
  const [teste,setTeste] = useState(['','','','']);
  const [rodada,setRodada] = useState(0);
  const [posi,setPosi] = useState(0);
  
  const addNum=(number)=>{
    const newMatriz = [...resposta];
    newMatriz[rodada][posi] = number;

    setResposta(newMatriz);
    if(posi<3){
      setPosi(posi+1);    
    }else{
      setPosi(0);
    }
  }
  const delNum=(apagar)=>{
    const newMatriz = [...resposta];
    newMatriz[rodada][posi] = apagar;

    setResposta(newMatriz);
    if(posi>0){
      setPosi(posi-1);    
    }else{
      setPosi(3);
    }
  }
  const enviarResposta=()=>{
    const newMatriz = [...teste];
    if(rodada<5){
      setPosi(0);
      setRodada(rodada+1);
      for(let i=0;i<4;i++){
        if(resposta[rodada][i] == numCerto[i]){
          newMatriz[i] = 1;
        }else if(resposta[rodada][i]==(numCerto[0]||numCerto[1]||numCerto[2]||numCerto[3])){
          newMatriz[i] = 2;
        }else{
          newMatriz[i] = 0;
        }
      }
    }
    setTeste(newMatriz);
  }
    
  useEffect(() =>{
    /* console.log("Num Certo"+numCerto);
    console.log("Sua resposta: "+resposta);
    console.log("Rodada atual: "+rodada);
    console.log("Posição atual: "+posi); */
    console.log(teste);
  },
    [numCerto],
    [teste],
    [resposta],
    [rodada],
    [posi]
  )

  const Espaço = ({ size }) => <View style={{ width: size }} />;
  const renderValores = () => {
    return resposta.map((linha, index) => (
      <View key={index} style={[styles.li]}>
        {linha.map((valor, subIndex) => (
          <View key={subIndex} style={[styles.valores]}>
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
            <Pressable style={styles.ordem} onPress={()=> {delNum('')}}>
              <Text style={styles.itemX}>X</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={() => addNum('0')}>
              <Text style={styles.item}>0</Text>
            </Pressable>
            <Espaço size={8}/>
            <Pressable style={styles.ordem} onPress={()=> {enviarResposta()}}>
              <Text style={styles.itemY}>✓</Text>
            </Pressable>
          </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}