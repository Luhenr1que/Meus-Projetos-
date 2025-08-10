import { StatusBar } from 'expo-status-bar';
import {Pressable, Text, View, Modal} from 'react-native';
import styles from "./style";
import {useEffect, useState} from 'react';


export default function App() {
  const rInt=(min, max)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const criarMatriz = (linhas, colunas) => {
    return Array(linhas).fill(null).map(() => Array(colunas).fill(''));
  }
  const [numCerto,setNumCerto] = useState([rInt(0,10),rInt(0,10),rInt(0,10),rInt(0,10)]);
  const [resposta, setResposta] = useState(criarMatriz(6,4));  
  const [statusRodadas, setStatusRodadas] = useState(criarMatriz(6,4));
  const [rodada,setRodada] = useState(0);
  const [posi,setPosi] = useState(0);
  const [perda,setPerda] = useState(false);
  const [ganho,setGanho] = useState(false); 

  const reiniciar=()=>{
    setNumCerto(rInt(0,10),rInt(0,10),rInt(0,10),rInt(0,10));
    setResposta(criarMatriz(6,4));
    setStatusRodadas(criarMatriz(6,4));
    setRodada(0);
    setPosi(0);
    setGanho(false);
    setPerda(false);
  }

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
    newMatriz[rodada][posi-1] = apagar;

    setResposta(newMatriz);
    if(posi>0){
      setPosi(posi-1);    
    }else if(posi==0){
      newMatriz[rodada][3] = apagar;
      setResposta(newMatriz);
      setPosi(3);
    }
  }

  const enviarResposta = () => {
    if (rodada < 5) {
      const respostaAtual = resposta[rodada];
      const novaStatus = [...statusRodadas];
      const statusAtual = Array(4).fill('');
      let j = 0;
      for (let i = 0; i < 4; i++) {
        if (respostaAtual[i] == numCerto[i]) {
          j++;
          if(j>3){
            setGanho(true);
          }
          statusAtual[i] = "correta";
        }else if(respostaAtual[i] == numCerto[0] || respostaAtual[i] == numCerto[1] || respostaAtual[i] == numCerto[2] || respostaAtual[i] == numCerto[3]){
          statusAtual[i] = "existe";
        }else{
          statusAtual[i] = "errada";
        }
      }
      novaStatus[rodada] = statusAtual; 
      setStatusRodadas(novaStatus);

      setRodada(rodada + 1);
      setPosi(0);
    }else{
      const respostaAtual = resposta[rodada];
      const novaStatus = [...statusRodadas];
      const statusAtual = Array(4).fill('');
      let j = 0;
      for (let i = 0; i < 4; i++) {
        if (respostaAtual[i] == numCerto[i]) {
          statusAtual[i] = "correta";
          j++;
          if(j>3){
            setGanho(true);
          }
        }else if(respostaAtual[i] == numCerto[0] || respostaAtual[i] == numCerto[1] || respostaAtual[i] == numCerto[2] || respostaAtual[i] == numCerto[3]){
          statusAtual[i] = "existe";
          setPerda(true);
        }else{
          statusAtual[i] = "errada";
          setPerda(true);
        }
      }
      novaStatus[rodada] = statusAtual; 
      setStatusRodadas(novaStatus);
    }
  };

  const Espaço = ({ size }) => <View style={{ width: size }} />;
  const renderValores = () => {
    return resposta.map((linha, index) => (
      <View key={index} style={[styles.li]}>
        {linha.map((valor, subIndex) => {
          const status = statusRodadas[index]?.[subIndex];
          let backgroundColor = '#21000f';

          if (status === "correta") backgroundColor = "#0e5014ff";
          else if (status === "existe") backgroundColor = "#d4b609ff";
          else if (status === "errada") backgroundColor = "#140a0aff";

          const estaSelecionado = (index == rodada && subIndex == posi);
          return (
            <View key={subIndex}
              style={[styles.valores,{backgroundColor},estaSelecionado && { borderWidth: 2, borderColor: "#fff" }]}
            >
              <Text style={styles.texto}>{valor || ''}</Text>
            </View>
          );
        })}
      </View>
    ));
  };

  useEffect(() =>{
    /* console.log("Num Certo"+numCerto);
    console.log("Sua resposta: "+resposta);
    console.log("Rodada atual: "+rodada);
    console.log("Posição atual: "+posi); */
  },
    [numCerto],
    [resposta],
    [rodada],
    [posi]
  );

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
      <Modal
        visible={ganho}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setGanho(false)}
      >
        <View style={styles.modal}>
          <Text>Vc Ganhou</Text>
          <Pressable onPress={()=>{reiniciar()}}>
            <Text>Repetir</Text>
          </Pressable>  
        </View>
      </Modal>
      <Modal
        visible={perda}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setGanho(false)}
      >
        <View style={styles.modal}>
          <Text>Vc Perdeu</Text>
          <Pressable onPress={()=>{reiniciar()}}>
            <Text>Repetir</Text>
          </Pressable>  
        </View>
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}