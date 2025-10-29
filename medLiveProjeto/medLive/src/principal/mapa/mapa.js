import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

// Dados dos mercados (você pode substituir por dados reais da sua API)
const MERCADOS = [
  {
    id: 1,
    nome: "Mercado Central",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: 2,
    nome: "Supermercado Norte",
    latitude: -23.5405,
    longitude: -46.6433,
  },
  {
    id: 3,
    nome: "Mercado Leste",
    latitude: -23.5605,
    longitude: -46.6233,
  },
  {
    id: 4,
    nome: "Supermercado Oeste",
    latitude: -23.5305,
    longitude: -46.6533,
  },
  {
    id: 5,
    nome: "Mercado Sul",
    latitude: -23.5705,
    longitude: -46.6133,
  }
];

export default function MapaMercados() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marcador da localização do usuário */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Sua localização"
          pinColor="blue"
        />

        {/* Marcadores dos mercados */}
        {MERCADOS.map(mercado => (
          <Marker
            key={mercado.id}
            coordinate={{
              latitude: mercado.latitude,
              longitude: mercado.longitude,
            }}
            title={mercado.nome}
            description="Mercado"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});