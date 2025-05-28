import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')} // substitua pelo nome correto da sua imagem
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Vigia Solo</Text>

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('DataInput')}
        >
          <Ionicons name="water-outline" size={24} color={theme.colors.white} />
          <Text style={styles.navText}>Inserir Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('RiskView')}
        >
          <Ionicons name="alert-circle-outline" size={24} color={theme.colors.white} />
          <Text style={styles.navText}>Visualizar Riscos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="time-outline" size={24} color={theme.colors.white} />
          <Text style={styles.navText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Mitigation')}
        >
          <Ionicons name="construct-outline" size={24} color={theme.colors.white} />
          <Text style={styles.navText}>Ações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 28,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  navContainer: {
    width: '100%',
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  navText: {
    color: theme.colors.white,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
