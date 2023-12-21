import * as React from 'react';
import { Text, View, Button, Alert, TextInput, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// export const saveDeviceData = async (key, data) => {
//   try {
//       await AsyncStorage.setItem(key, JSON.stringify(data));
//   } catch (e) {
//     console.log(`Error saving data for key ${key}`, data);
//     throw e;
//   }
// };

// /*
// * @param key {String} Key identifier for data to load
// */
// export const loadDeviceData = async (key) => {
//   try {
//       return JSON.parse(await AsyncStorage.getItem(key))
//   } catch (e) {
//     console.log(`Error loading data for key ${key}`);
//     throw e;
//   }
// };

async function getCache(key){
    try {
        let value = await AsyncStorage.getItem(key).then(res => {
            return JSON.parse(res)
        });
        console.log('||| Value!!! ->', value)
        return value;
    }
    catch(e){
        return null;
    }

}

function SettingsScreen() {

  const Courses = ["1", "2", "3", "4"]
  const Groups = ["MOIS", "FIIT", "PIVZ"]
  const pocket = {
    backend_address:"none",
    course:"none",
    group: "none"
  }

  return (
       <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            }}>
        <View>
        <Text style={{
                    fontWeight: "bold",
                    color:"black",
                    marginBottom:30
        }}>Сервер парсинга расписания (Временное решение)</Text>
        </View>
        <View style={{
        marginBottom:20
        }}>
            <TextInput
                style = {{
                    padding: 10,
                    backgroundColor:'grey',
                    width: 200
                }}
                placeholder="Server address"
                onChangeText = {text => {
                        pocket.backend_address = text
                    }
                }
            />
        </View>
        <Text style={{
            fontWeight: "bold",
            color:"black",
            marginBottom:30

        }}> Изменить группу </Text>
        <View style={{ marginBottom:30 }}>
            <SelectDropdown
                style={{
                    marginBottom:30
                }}
                defaultButtonText={"Выберете курс"}
                data = {Courses}
                onSelect={(selectedItem, index) => {
                    if (selectedItem != "3"){
                      Alert.alert("Данный курс не доступен", "Парсер для данного курса не прописан, расписание не изменится")
                    }
                    pocket.course = selectedItem
                }}
            />
        </View>
        <View style={{ marginBottom:30 }}>
            <SelectDropdown
            defaultButtonText={"Выберете группу"}
            data = {Groups}
            onSelect={(selectedItem, index) => {
              if (selectedItem != "MOIS"){
                Alert.alert("Данная группа не доступна", "Парсер для данной группы не прописан, расписание не изменится")
              }
              pocket.group = selectedItem
          }}
            />
        </View>
        <Button
         title="Обновить"
         onPress={ async() => {
            if ((pocket.backend_address != 'none') && (pocket.group != 'none') && (pocket.course != 'none')){
                AsyncStorage.setItem('pocket', JSON.stringify(pocket));
            }
            pkg = await getCache('pocket')
            console.log(pkg.backend_address + '/' + pkg.course + '/' + pkg.group)
            schedule = await axios.get(pkg.backend_address + '/' + pkg.course + '/' + pkg.group)
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    console.log('Error: ', error)
                })
            await AsyncStorage.setItem('schedule', JSON.stringify(schedule.msg))
            console.log(await getCache('schedule'))
         }
       }/>
       </View>
  );
}

async function ScheduleScreen() {
  data = await getCache('schedule')
  if (schedule != null){
    return(
        <View>
            <Text>
                Нету кешированного расписания
            </Text>
        </View>
    );
  }

  return (
    <View>

    </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Settings"
        component={ SettingsScreen }
        options={{
            tabBarLable: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
        }}
      />
      <Tab.Screen name="Schedule"
      component={ ScheduleScreen }
      options={{
            tabBarLable: 'Schedule',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
      }}
      />

    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs component={MyTabs}/>
    </NavigationContainer>
  );
}
