import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

export default function MitigationActionsScreen() {
  const navigation = useNavigation();

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ações de Mitigação</Text>
      <Text style={styles.subTitle}>Sugestões para reduzir riscos detectados</Text>

      <View style={styles.alertBox}>
        <Ionicons name="warning-outline" size={24} color="#E63946" />
        <Text style={styles.alertText}>
          Caso você esteja em área próxima a morros ou encostas, entre em contato com os órgãos competentes da sua cidade. 
          Em caso de risco iminente ou fortes chuvas, procure abrigo em local seguro imediatamente.
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
    padding: 20,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  alertText: {
    color: '#E63946',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardText: {
    marginLeft: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.text,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
});
