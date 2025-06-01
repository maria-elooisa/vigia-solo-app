import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getEnvironmentalData } from '../services/environmentalData';

const screenWidth = Dimensions.get('window').width;

const VisualizarRiscosScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');

  // ANIMAÇÃO: valor inicial acima da tela (-100)
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // Função para animar a notificação
  const showNotification = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 400,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start();
      }, 3000);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const environmentalData = await getEnvironmentalData();
      setData(environmentalData);

      const uniqueRegions = [
        ...new Set(environmentalData.map((item) => item.region).filter(Boolean)),
      ];
      setRegions(uniqueRegions);
    };

    fetchData();
  }, []);

  // Trigger da animação da notificação quando a região selecionada tem risco alto
  useEffect(() => {
    const lastData = data
      .filter((d) => d.region === selectedRegion)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (
      selectedRegion &&
      lastData &&
      (lastData.soilMoisture > 70 || lastData.terrainInclination > 30)
    ) {
      showNotification();
    }
  }, [selectedRegion, data]);

  // --- restante do seu código ---

  // Função para agrupar e calcular média por dia para uma região (ou todas as regiões)
  const agruparMediaPorDia = (dados, region = null) => {
    const agrupados = {};

    dados.forEach(({ date, region: reg, soilMoisture, terrainInclination }) => {
      if (region && reg !== region) return;

      const dia = date.split('T')[0];

      if (!agrupados[dia]) {
        agrupados[dia] = { soilMoistureSoma: 0, terrainInclinationSoma: 0, count: 0 };
      }

      agrupados[dia].soilMoistureSoma += parseFloat(soilMoisture);
      agrupados[dia].terrainInclinationSoma += parseFloat(terrainInclination);
      agrupados[dia].count += 1;
    });

    const resultado = Object.entries(agrupados)
      .map(([dia, valores]) => ({
        dia,
        soilMoistureMedia: valores.soilMoistureSoma / valores.count,
        terrainInclinationMedia: valores.terrainInclinationSoma / valores.count,
      }))
      .sort((a, b) => new Date(a.dia) - new Date(b.dia));

    return resultado;
  };

  const obterTodasDatas = () => {
    const diasSet = new Set();

    regions.forEach((region) => {
      const dadosAgrupados = agruparMediaPorDia(data, region);
      dadosAgrupados.forEach(({ dia }) => diasSet.add(dia));
    });

    return Array.from(diasSet).sort((a, b) => new Date(a) - new Date(b));
  };

  const allDates = obterTodasDatas();

  const getChartDataByRegion = () => {
    const datasets = regions.map((region, idx) => {
      const dadosAgrupados = agruparMediaPorDia(data, region);

      const soilMoisturePorDia = allDates.map((dia) => {
        const entry = dadosAgrupados.find((d) => d.dia === dia);
        return entry ? entry.soilMoistureMedia : 0;
      });

      return {
        data: soilMoisturePorDia,
        color: () => `hsl(${(idx * 60) % 360}, 70%, 50%)`,
        strokeWidth: 2,
        name: region,
      };
    });

    return {
      labels: allDates,
      datasets,
    };
  };

  const getChartDataByRegionFiltered = () => {
    const dadosAgrupados = agruparMediaPorDia(data, selectedRegion);

    return {
      labels: dadosAgrupados.map((d) => d.dia),
      datasets: [
        {
          data: dadosAgrupados.map((d) => d.soilMoistureMedia),
          color: () => '#1976D2',
          strokeWidth: 2,
          name: 'Umidade (%)',
        },
        {
          data: dadosAgrupados.map((d) => d.terrainInclinationMedia),
          color: () => '#64B5F6',
          strokeWidth: 2,
          name: 'Inclinação (°)',
        },
      ],
    };
  };

  const lastData = data
    .filter((d) => d.region === selectedRegion)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const riskLevel =
    lastData && (lastData.soilMoisture > 70 || lastData.terrainInclination > 30)
      ? '⚠️ ALTO'
      : lastData
      ? '✅ OK'
      : '–';

  const riskColor =
    riskLevel === '⚠️ ALTO' ? '#D32F2F' : riskLevel === '✅ OK' ? '#1976D2' : '#1976D2';

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
    },
  };

  return (
    <>
      {/* NOTIFICAÇÃO ANIMADA */}
      <Animated.View
        style={[
          styles.notification,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.notificationText}>
          ⚠️ Atenção! Risco ALTO na região selecionada. Tome cuidado!
        </Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Filtrar Região:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRegion}
            onValueChange={(itemValue) => setSelectedRegion(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Todas" value="" />
            {regions.map((region, idx) => (
              <Picker.Item key={idx} label={region} value={region} />
            ))}
          </Picker>
        </View>

        <Text style={[styles.riskText, { color: riskColor }]}>
          Risco Atual: {riskLevel}
        </Text>

        <Text style={styles.subTitle}>
          {selectedRegion ? `Dados de ${selectedRegion}` : 'Umidade por Região'}
        </Text>

        {(selectedRegion === '' ? allDates.length > 0 : data.length > 0) && (
          <LineChart
            data={
              selectedRegion === ''
                ? getChartDataByRegion()
                : getChartDataByRegionFiltered()
            }
            width={screenWidth - 40}
            height={300}
            chartConfig={chartConfig}
            bezier
            formatXLabel={(label) => {
              if (!label) return '';
              const parts = label.split('-');
              if (parts.length !== 3) return label;
              const [year, month, day] = parts;
              return `${day}/${month}`;
            }}
            withInnerLines={false}
            verticalLabelRotation={45}
          />
        )}

        <View style={styles.legendContainer}>
          {selectedRegion === ''
            ? regions.map((region, idx) => (
                <Text
                  key={idx}
                  style={{
                    color: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
                    fontSize: 14,
                    marginVertical: 2,
                  }}
                >
                  ● {region}
                </Text>
              ))
            : ['Umidade (%)', 'Inclinação (°)'].map((label, idx) => (
                <Text
                  key={idx}
                  style={{
                    color: idx === 0 ? '#1976D2' : '#64B5F6',
                    fontSize: 14,
                    marginVertical: 2,
                  }}
                >
                  ● {label}
                </Text>
              ))}
        </View>

        {selectedRegion !== '' && riskLevel === '⚠️ ALTO' && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Mitigation')}
          >
            <Text style={styles.buttonText}>Mitigar Riscos</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
};

export default VisualizarRiscosScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16, 
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14, 
    marginBottom: 6, 
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6, 
    marginBottom: 10, 
    height: 38, 
    justifyContent: 'center',
  },
  picker: {
    height: 38, 
  },
  riskText: {
    fontSize: 16, 
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18, 
    fontWeight: '600',
    marginVertical: 6, 
    color: '#00416d',
  },
  button: {
    backgroundColor: '#00416d',
    padding: 12, 
    borderRadius: 6,
    marginTop: 8, 
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14, 
  },
  legendContainer: {
    marginTop: 12, 
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    zIndex: 9999,
    elevation: 10,
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
