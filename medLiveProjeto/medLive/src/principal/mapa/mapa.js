import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Linking, ActivityIndicator } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Sua chave da API Google Places
const GOOGLE_API_KEY = 'AIzaSyCAckKLHl-T6HPk2pTVfxrjHXf4yLojpfw';

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapaMercados() {
  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [raio, setRaio] = useState(2000);
  const [mercadosProximos, setMercadosProximos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return alert("Permissão negada!");

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      buscarMercadosProximos(loc.coords.latitude, loc.coords.longitude, raio);
    })();
  }, []);

  useEffect(() => {
    if(location) {
      buscarMercadosProximos(location.coords.latitude, location.coords.longitude, raio);
    }
  }, [raio]);

  async function buscarMercadosProximos(lat, lon, raioMetros) {
    setCarregando(true);
    try {
      const raioBusca = Math.min(raioMetros, 50000);
      
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${raioBusca}&type=supermarket|grocery_or_supermarket&key=${GOOGLE_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK') {
        const mercados = data.results.map((place, index) => ({
          id: place.place_id || index.toString(),
          nome: place.name,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          endereco: place.vicinity,
          aberto: place.opening_hours?.open_now,
          avaliacao: place.rating
        }));
        
        const filtrados = mercados.filter(m => 
          calcularDistancia(lat, lon, m.latitude, m.longitude) <= (raioMetros / 1000)
        );
        
        setMercadosProximos(filtrados);
      } else {
        console.log('Erro na API:', data.status);
        setMercadosProximos([]);
      }
    } catch (error) {
      console.error('Erro ao buscar mercados:', error);
      setMercadosProximos([]);
    } finally {
      setCarregando(false);
    }
  }

  function abrirRota(mercado) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mercado.latitude},${mercado.longitude}&destination_place_id=${mercado.id}`;
    Linking.openURL(url);
  }

  function abrirDetalhesMercado(mercado) {
    const url = `https://www.google.com/maps/search/?api=1&query=${mercado.latitude},${mercado.longitude}&query_place_id=${mercado.id}`;
    Linking.openURL(url);
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.carregandoTexto}>Obtendo localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER PERSONALIZADO */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.btnVoltar} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Mercados Próximos</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* MAPA COM MAIS ZOOM */}
      <MapView
        style={styles.map}
        showsUserLocation
        showsMyLocationButton={true}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02, // Reduzido para mais zoom
          longitudeDelta: 0.02  // Reduzido para mais zoom
        }}
        customMapStyle={mapStyle}>

        {/* CÍRCULO DO RAIO COM DESIGN MELHORADO */}
        <Circle
          center={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          radius={raio}
          strokeColor="rgba(74, 144, 226, 0.8)"
          fillColor="rgba(74, 144, 226, 0.2)"
          strokeWidth={2}
        />

        {/* MARCADORES PERSONALIZADOS */}
        {mercadosProximos.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.nome}
            description={m.endereco}
            onPress={() => abrirDetalhesMercado(m)}
          >
            <View style={styles.marcador}>
              <Ionicons name="storefront" size={16} color="#fff" />
            </View>
          </Marker>
        ))}

      </MapView>

      {/* BOTÕES DE RAIO ESTILIZADOS */}
      <View style={styles.raioContainer}>
        <Text style={styles.raioTitulo}>Raio de busca</Text>
        <View style={styles.raioBox}>
          {[
            { valor: 1000, label: '1km' },
            { valor: 2000, label: '2km' },
            { valor: 5000, label: '5km' },
            { valor: 10000, label: '10km' }
          ].map(({ valor, label }) => (
            <TouchableOpacity 
              key={valor} 
              onPress={() => setRaio(valor)}
              style={[
                styles.btnRaio, 
                raio === valor && styles.btnRaioAtivo
              ]}
            >
              <Text style={[
                styles.txtRaio, 
                raio === valor && styles.txtRaioAtivo
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* LISTA MELHORADA */}
      <View style={styles.lista}>
        <View style={styles.listaHeader}>
          <View>
            <Text style={styles.tituloLista}>Mercados encontrados</Text>
            <Text style={styles.subtituloLista}>
              {mercadosProximos.length} resultado{mercadosProximos.length !== 1 ? 's' : ''}
            </Text>
          </View>
          {carregando && <ActivityIndicator size="small" color="#4A90E2" />}
        </View>
        
        {mercadosProximos.length === 0 && !carregando ? (
          <View style={styles.semResultados}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.textoSemResultados}>
              Nenhum mercado encontrado neste raio
            </Text>
            <Text style={styles.textoSemResultadosPequeno}>
              Tente aumentar o raio de busca
            </Text>
          </View>
        ) : (
          <FlatList
            data={mercadosProximos}
            keyExtractor={(i) => i.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.item} 
                onPress={() => abrirRota(item)}
              >
                <View style={styles.itemIcon}>
                  <Ionicons name="storefront-outline" size={20} color="#4A90E2" />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.nomeMercado}>{item.nome}</Text>
                  <Text style={styles.enderecoMercado}>{item.endereco}</Text>
                  <View style={styles.detalhesMercado}>
                    {item.avaliacao && (
                      <View style={styles.avaliacaoContainer}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.avaliacao}>{item.avaliacao}</Text>
                      </View>
                    )}
                    {item.aberto !== undefined && (
                      <View style={[
                        styles.statusContainer,
                        item.aberto ? styles.statusAberto : styles.statusFechado
                      ]}>
                        <Ionicons 
                          name={item.aberto ? "time" : "close-circle"} 
                          size={10} 
                          color={item.aberto ? "#2e7d32" : "#c62828"} 
                        />
                        <Text style={[
                          styles.status,
                          item.aberto ? styles.statusTextoAberto : styles.statusTextoFechado
                        ]}>
                          {item.aberto ? 'Aberto' : 'Fechado'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.rotaContainer}>
                  <Ionicons name="navigate" size={20} color="#4A90E2" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

    </View>
  );
}

// Estilo personalizado para o mapa
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "on" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  }
];

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  map: { 
    width: '100%', 
    height: '100%' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f8f9fa'
  },
  carregandoTexto: {
    fontSize: 16,
    color: '#666',
    marginTop: 10
  },

  // Header
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    zIndex: 10
  },
  btnVoltar: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 8,
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tituloHeader: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  headerPlaceholder: {
    width: 40
  },

  // Marcador personalizado
  marcador: {
    backgroundColor: '#4A90E2',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },

  // Controles de Raio
  raioContainer: {
    position: 'absolute',
    top: 100,
    left: 15,
    right: 15,
    zIndex: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  raioTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  raioBox: {
    flexDirection: 'row',
    gap: 8
  },
  btnRaio: {
    backgroundColor: "#f1f3f4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center'
  },
  btnRaioAtivo: {
    backgroundColor: "#4A90E2"
  },
  txtRaio: {
    fontWeight: '600',
    color: "#666",
    fontSize: 13
  },
  txtRaioAtivo: {
    color: "#fff"
  },

  // Lista
  lista: {
    position: 'absolute',
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    maxHeight: "45%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10
  },
  listaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  tituloLista: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#1a1a1a'
  },
  subtituloLista: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },

  // Item da lista
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  itemInfo: {
    flex: 1
  },
  nomeMercado: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: '#1a1a1a'
  },
  enderecoMercado: {
    color: '#666',
    fontSize: 14,
    marginBottom: 6
  },
  detalhesMercado: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  avaliacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  avaliacao: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusAberto: {
    backgroundColor: '#e8f5e8'
  },
  statusFechado: {
    backgroundColor: '#ffeaea'
  },
  status: {
    fontSize: 11,
    fontWeight: '600'
  },
  statusTextoAberto: {
    color: '#2e7d32'
  },
  statusTextoFechado: {
    color: '#c62828'
  },
  rotaContainer: {
    padding: 8
  },
  semResultados: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12
  },
  textoSemResultados: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontWeight: '500'
  },
  textoSemResultadosPequeno: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14
  }
});