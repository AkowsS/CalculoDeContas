import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Person {
  id: string;
  name: string;
  value: number;
  isFixed: boolean;
}

interface Bill {
  id: string;
  name: string;
  totalAmount: number;
  people: Person[];
}

export default function AddBillScreen() {
  const [billName, setBillName] = useState<string>('');
  const [billAmount, setBillAmount] = useState<string>('');
  const [people, setPeople] = useState<Person[]>([]);
  const [personName, setPersonName] = useState<string>('');
  const [unpaidBills, setUnpaidBills] = useState<Bill[]>([]);
  const [paidBills, setPaidBills] = useState<Bill[]>([]);

  const navigation = useNavigation();

  const addPerson = () => {
    if (!personName) {
      Alert.alert('Erro', 'O nome da pessoa não pode estar em branco.');
      return;
    }

    const person: Person = {
      id: Math.random().toString(),
      name: personName,
      value: 0,
      isFixed: false,
    };

    setPeople((prevPeople) => [...prevPeople, person]);
    setPersonName('');
  };

  const editPersonValue = (id: string, newValue: string) => {
    if (newValue === '') {
      setPeople((prevPeople) =>
        prevPeople.map((person) =>
          person.id === id
            ? { ...person, value: 0, isFixed: true }
            : person
        )
      );
    } else {
      const value = parseFloat(newValue.replace(',', '.'));
      if (isNaN(value)) {
        return;
      }

      setPeople((prevPeople) =>
        prevPeople.map((person) =>
          person.id === id
            ? { ...person, value: value, isFixed: true }
            : person
        )
      );
    }
  };

  const calculateBill = () => {
    const totalAmount = parseFloat(billAmount.replace(',', '.'));

    if (isNaN(totalAmount) || totalAmount <= 0 || people.length === 0) {
      Alert.alert('Erro', 'Insira um valor válido para a conta e adicione pessoas.');
      return;
    }

    const fixedTotal = people.reduce(
      (acc, person) => (person.isFixed ? acc + person.value : acc),
      0
    );

    const remainingAmount = totalAmount - fixedTotal;

    const peopleWithoutFixedValue = people.filter((person) => !person.isFixed);

    if (remainingAmount < 0) {
      Alert.alert('Erro', 'Os valores fixados excedem o total da conta.');
      return;
    }

    if (peopleWithoutFixedValue.length === 0) {
      Alert.alert('Erro', 'Todos os valores foram editados.');
      return;
    }

    const amountPerPerson = remainingAmount / peopleWithoutFixedValue.length;

    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.isFixed ? person : { ...person, value: amountPerPerson }
      )
    );
  };

  const saveBill = () => {
    const totalAmount = parseFloat(billAmount.replace(',', '.'));

    if (!billName || isNaN(totalAmount) || totalAmount <= 0 || people.length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
      return;
    }

    const newBill: Bill = {
      id: Math.random().toString(),
      name: billName,
      totalAmount: totalAmount,
      people: people,
    };

    setUnpaidBills((prevBills) => [...prevBills, newBill]);
    Alert.alert('Sucesso', 'Conta salva com sucesso!');
    clearFields();
  };

  const payBill = (billId: string) => {
    const paidBill = unpaidBills.find((bill) => bill.id === billId);
    if (paidBill) {
      setPaidBills((prevPaidBills) => [...prevPaidBills, paidBill]);
      setUnpaidBills((prevUnpaidBills) =>
        prevUnpaidBills.filter((bill) => bill.id !== billId)
      );
    }
  };

  const clearFields = () => {
    setBillName('');
    setBillAmount('');
    setPeople([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Conta:</Text>
      <TextInput
        style={styles.input}
        value={billName}
        onChangeText={setBillName}
        placeholder="Insira o nome da conta"
      />

      <Text style={styles.label}>Valor da Conta:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={billAmount}
        onChangeText={setBillAmount}
        placeholder="Insira o valor total da conta"
      />

      <Text style={styles.label}>Nome da Pessoa:</Text>
      <TextInput
        style={styles.input}
        value={personName}
        onChangeText={setPersonName}
        placeholder="Insira o nome da pessoa"
      />

      <Button title="Adicionar Pessoa" onPress={addPerson} />

      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.personContainer}>
            <Text style={styles.personName}>{item.name}</Text>
            <TextInput
              style={styles.personInput}
              value={item.value.toString()}
              onChangeText={(newValue) => editPersonValue(item.id, newValue)}
              keyboardType="numeric"
            />
          </View>
        )}
      />

      <Button title="Calcular" onPress={calculateBill} />
      <Button title="Salvar Conta" onPress={saveBill} />

      <Text style={styles.label}>Contas não pagas:</Text>
      <FlatList
        data={unpaidBills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.billContainer}>
            <Text style={styles.billName}>Conta: {item.name}</Text>
            <Button title="Pagar" onPress={() => payBill(item.id)} />
          </View>
        )}
      />

      <Button
        title="Ver Contas Pagas"
        onPress={() => navigation.navigate('Contas pagas', { paidBills })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  personName: {
    flex: 1,
    fontSize: 16,
  },
  personInput: {
    height: 40,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  billContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  billName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
});
