import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import DataInputScreen from '../screens/DataInputScreen';
import RiskViewScreen from '../screens/RiskViewScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MitigationActionsScreen from '../screens/MitigationActionsScreen';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DataInput" component={DataInputScreen} />
        <Stack.Screen name="RiskView" component={RiskViewScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Mitigation" component={MitigationActionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
