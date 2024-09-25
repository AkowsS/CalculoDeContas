import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

interface Person {
  id?: string;
  name?: string;
  value?: number;
  isFixed?: boolean;
}

interface Bill {
  id?: string;
  name?: string;
  totalAmount?: number;
  people?: Person[];
}

type PaidBillsScreenRouteProp = RouteProp<{ PaidBills: { paidBills: Bill[] } }, 'PaidBills'>;

export default function PaidBillsScreen() {
  const route = useRoute<PaidBillsScreenRouteProp>();
  const { paidBills } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={paidBills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.billContainer}>
            <Text style={styles.billTitle}>Conta: {item.name}</Text>
            <Text style={styles.billTotal}>Total: R${item.totalAmount?.toFixed(2)}</Text>
            <Text style={styles.participantsTitle}>Participantes:</Text>
            {item.people?.map((person) => (
              <Text key={person.id} style={styles.participant}>
                {person.name}: R${person.value?.toFixed(2)} {person.isFixed ? '(Fixado)' : ''}
              </Text>
            ))}
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
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
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  billTotal: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  participantsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  participant: {
    fontSize: 14,
    color: '#555',
  },
});
