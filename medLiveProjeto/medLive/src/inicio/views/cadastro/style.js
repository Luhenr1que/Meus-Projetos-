import{StyleSheet, Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function getStyles (isDarkMode){

  const backgroundColor = isDarkMode ? '#3b3b3bff' : '#ffffffff';
  const backgroundColorBotoes = isDarkMode ? '#186858ff' : '#186858ff';
  const textColor = isDarkMode ? "#fff" : "#131F3C";
  const textLoginColor1 = isDarkMode ? "#fff" : '#40666B';
  const textLoginColor2 = isDarkMode ? "#1b6abdff" : '#1812cdff';

return StyleSheet.create({
    botoes:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-end',
        width: '100%',  
        height:'10%',
        backgroundColor:backgroundColorBotoes,
        marginTop:25,
    },
    container:{
        width:'100%',
        paddingTop:'55',
        height:'100%',
        backgroundColor: backgroundColor ,
        alignItems: 'center',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
    },
    logo: {
        width: width*0.408,
        height:width*0.458,     
        alignSelf: 'center',
    },
    titulo:{
        marginBottom: 30,
        width: '80%',
        borderRadius: 15,
        paddingHorizontal: 10,
        fontSize:30,
        color: textColor,
        textAlign:'center',
        fontFamily:'inter',
        fontWeight:600,
    },
    text: {
        marginTop: 20,
        width: '80%',
        height: 70,
        borderBottomWidth:2,
        borderColor: isDarkMode ? "#fff" : "#000",
        borderRadius: 0,
        paddingHorizontal: 10,
        fontSize: 20,
        color: isDarkMode ? "#fff" : "#000",
        fontWeight:'600',
      },
      textInput:{
        flex: 1,
        fontSize:18,
        color:textColor,
      },
    textBtn:{
        color:'#fff',
        fontSize:28,
        textAlignVertical:'center',
        textAlign:'center',
        fontWeight:600,
    },
    btn:{
        marginTop:20,
        width: '70%',
        padding:10,
        borderRadius: 25,

    },
    gradient: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ModalConatiner:{
        width:'100%',
        height:'100%',
        backgroundColor:'#454545d8',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    ModalBox:{
        display:'flex',
        alignItems:'center',
        width:'80%',
        height:'80%',
        borderRadius:15,
        backgroundColor:'#f8f4ecff',
        position:'relative',
        padding:20,
        elevation:10,
    },
    modalContent: {
        width: '100%',
        height: '100%',
        paddingTop: 30, 
    },
    close:{
        width:40,
        height:40,
        backgroundColor:'#e4e4e4ff',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:'50%',
        top:-15,
        left:-15,
        position:'absolute',
    },
    closeImg:{
        width:20,
        height:20,
        tintColor:'#2c2c2cff',
    },
    titutMIni:{
        fontSize: 29,
        fontWeight: '700',
        textAlign: 'center',
        color: '#222',
        marginBottom: 15,
        letterSpacing: 0.5
    },
    textMIni: {
        lineHeight:28,
        fontWeight:'500',
        fontSize: 20,
        color: '#333',
        lineHeight: 24, 
        textAlign: 'center', 
        paddingHorizontal: 10, 
        marginBottom:20,
    },
    imgMIni:{
        width:width*0.6,
        height:height*0.33,
        marginHorizontal:'10%',
        marginBottom:10,
        marginTop:20,
    },
    scrollContainer: {
        width: '100%',
        flex: 1, 
    },
    loginText:{
        display:'flex',
        textAlign:'center',
        justifyContent:'center',
        alignItems:'center',
        fontSize:19,
        marginBottom:3,
        color: textLoginColor1,
  },
  loginbtn:{
        textAlign:'center',
        fontSize:18,
        marginLeft:6,
        color: textLoginColor2,
  },
  login:{
        marginTop:20,
        display:'flex',
        textAlign:'center',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
  },
  senhaContainer: {
    flexDirection: 'row',
    height: 60,
    width: '80%',
    borderBottomWidth:3,
    borderRadius: 0,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  senhaInput: {
    height: 60,
    flex: 1,
    fontSize: 18,
    color:textColor,
  },

  olhoBotao: {
    padding: 5,
  },

  olhoIcone: {
    width: 34,
    height: 27,
    tintColor: isDarkMode ? '#fff' :'#000000ff', 
  },
})
}

