import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

export default function MitigationActionsScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }, 2000); // 2 segundos de delay

    // Limpar o timeout se a tela for desmontada antes
    return () => clearTimeout(timeout);
  }, []);

  const actions = [
    {
      id: 1,
      title: 'Instalar Barreiras de Contenção',
      description: 'Indicado para áreas com inclinação acima de 30°.',
      icon: 'shield-checkmark-outline',
    },
    {
      id: 2,
      title: 'Plantar Vegetação',
      description: 'Ajuda a estabilizar o solo e reduzir a erosão em áreas expostas.',
      icon: 'leaf-outline',
    },
    {
      id: 3,
      title: 'Redirecionar Água de Drenagem',
      description: 'Evita acúmulo de umidade em pontos críticos.',
      icon: 'water-outline',
    },
    {
      id: 4,
      title: 'Monitoramento Contínuo',
      description: 'Acompanhar regularmente áreas de risco com o app.',
      icon: 'eye-outline',
    },
  ];

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subTitle}>Sugestões para reduzir riscos detectados</Text>

      <View style={styles.alertBox}>
        <Ionicons name="warning-outline" size={24} color="#E63946" />
        <Text style={styles.alertText}>
          Caso você esteja em área próxima a morros, entre em contato com os órgãos competentes da sua cidade. 
          Em caso de risco iminente, procure abrigo em local seguro imediatamente.
        </Text>
      </View>

      {actions.map((action) => (
        <View key={action.id} style={styles.card}>
          <Ionicons name={action.icon} size={30} color={theme.colors.primary} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{action.title}</Text>
            <Text style={styles.cardDescription}>{action.description}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RiskView')}
      >
        <Ionicons name="arrow-back-outline" size={20} color={theme.colors.white} />
        <Text style={styles.buttonText}>Voltar para Riscos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: theme.colors.background,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FFE5E5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  alertText: {
    color: '#E63946',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  cardText: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  cardDescription: {
    fontSize: 12,
    color: theme.colors.text,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0, // deixa mais próximo dos cards
  },
  
  buttonText: {
    color: theme.colors.white,
    fontSize: 14,
    marginLeft: 6,
  },
});
