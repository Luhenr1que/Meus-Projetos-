import React, { useState, useCallback } from "react";
import { View, Image, ActivityIndicator, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function TelaImagem({ route }) {
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const routePacienteId = route?.params?.id; // se tiver params

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function carregarImagem() {
        try {
          setLoading(true);
          if (isActive) {
            setImagem("http://10.67.4.206:8003/uploads/campanhas/1759883797.png");
          }
        } catch (e) {
          console.warn("Erro ao carregar imagem:", e?.message || e);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      carregarImagem();

      return () => {
        isActive = false;
      };
    }, [routePacienteId])
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      {!loading && imagem && (
        <Image
          source={{ uri: imagem }}
          style={{ width: 300, height: 300 }}
          onLoad={() => console.log("Imagem carregada")}
          onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)}
        />
      )}
      {!loading && !imagem && <Text>Imagem não disponível</Text>}
    </View>
  );
}
