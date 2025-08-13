import { StyleSheet } from "react-native";
import { Modal } from "react-native-web";

export default StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:'#450b1e',
        padding:10,
        paddingBottom:30,
    },
    titulo:{
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    titu:{
        fontSize: 30,
        fontWeight: '1000',
        color:'#fff',
    },
    campos:{
        flex:1,
        display: 'flex',
        flexDirection: 'collum',
        padding:15,
        backgroundColor: '#450b1e'
    },
    li:{
        flex:0.3,
        display: 'flex',
        flexDirection: 'row',
    },
    valores:{
        flex:1,
        margin:2,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
    texto:{
        fontSize:40,
        color:'#fff',
    },
    teclado:{
        display:'flex',
        flexDirection: 'collum',
        flex:0.5,
        backgroundColor: '#450b1e'
    },
    linha:{
        flex:1,
        display:'flex',
        flexDirection:'row',
        padding:8
    },
    ordem:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:2,
        borderColor:'#fff',
        borderRadius:10,
        backgroundColor:'#21000f'
    },
    item:{
        fontSize:30,
        color:'#fff',
    },
    itemX:{
        fontSize:30,
        color:'#fff',
    },
    itemY:{
        fontSize:30,
        color:'#fff',
    },
    modal:{
        flex:1,
        backgroundColor:'#00000090',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    modalBox:{
        borderWidth:2,
        borderColor:'#fff',
        borderRadius:20,
        padding:'10%',
        backgroundColor:'#450b1e',
    },
    textModal:{
        fontSize:35,
        color:'#fff',
        textAlign:'center',
    },
    textAModal:{
        fontSize:42,
        color:'#4CEDBD',
        textAlign:'center',
    },
})