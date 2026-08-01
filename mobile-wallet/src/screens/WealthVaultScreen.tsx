import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { IWalletMonthData } from '../types/wallet';
import { addAssetItem } from '../services/api';

export default function WealthVaultScreen({ months, refreshData }: { months: IWalletMonthData[]; refreshData: () => void }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('Bank');

  const latestMonth = months[months.length - 1];
  const assets = latestMonth?.assets || [];

  const cumulativeSavings = months.reduce((acc, m) => {
    const inc = (m.salary || 0) + (m.addon || 0) + (m.bonus || 0) + (m.incomes || []).reduce((s, c) => s + c.amount, 0);
    const exp = (m.expenses || []).reduce((s, c) => s + c.amount, 0);
    return acc + (inc - exp);
  }, 0);

  const totalAssetsVal = assets.reduce((acc, a) => acc + (a.value || 0), 0);

  const pendingLoansTotal = (latestMonth?.loans || [])
    .filter((l) => l.status === 'Pending')
    .reduce((acc, l) => acc + (l.amount || 0), 0);

  const netWorth = cumulativeSavings + totalAssetsVal - pendingLoansTotal;

  const handleAddAsset = async () => {
    if (!name || !value || !latestMonth._id) return;
    const ok = await addAssetItem(latestMonth._id, {
      name,
      value: Number(value),
      category
    });
    if (ok) {
      setModalVisible(false);
      setName('');
      setValue('');
      refreshData();
    } else {
      Alert.alert('Error', 'Could not save asset.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Executive Net Worth HUD */}
      <View style={styles.vaultCard}>
        <Text style={styles.vaultTag}>TOTAL NET WORTH PORTFOLIO</Text>
        <Text style={styles.netWorthVal}>৳{netWorth.toLocaleString()}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add Asset to Vault</Text>
        </TouchableOpacity>

        <View style={styles.pillsRow}>
          <View style={styles.pill}>
            <Text style={styles.pillLabel}>Cumulative Savings</Text>
            <Text style={[styles.pillVal, { color: '#818cf8' }]}>৳{cumulativeSavings.toLocaleString()}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillLabel}>Total Assets</Text>
            <Text style={[styles.pillVal, { color: '#34d399' }]}>৳{totalAssetsVal.toLocaleString()}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillLabel}>Pending Liabilities</Text>
            <Text style={[styles.pillVal, { color: '#f87171' }]}>৳{pendingLoansTotal.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Asset Allocation Vault */}
      <Text style={styles.sectionTitle}>Briefcase Assets Allocation ({assets.length} saved)</Text>
      {assets.length === 0 ? (
        <Text style={styles.emptyText}>No assets saved in mobile vault yet.</Text>
      ) : (
        assets.map((a, idx) => (
          <View key={a._id || idx} style={styles.assetItem}>
            <View>
              <Text style={styles.assetName}>{a.name}</Text>
              <Text style={styles.assetCat}>{a.category}</Text>
            </View>
            <Text style={styles.assetVal}>৳{(a.value || 0).toLocaleString()}</Text>
          </View>
        ))
      )}

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Asset to Vault</Text>
            <Text style={styles.label}>Asset Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bank Savings / Gadgets / Crypto"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Valuation (৳)</Text>
            <TextInput
              style={styles.input}
              placeholder="Value in BDT"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={value}
              onChangeText={setValue}
            />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddAsset}>
                <Text style={styles.saveText}>Save Asset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07080f', padding: 16 },
  vaultCard: { backgroundColor: 'rgba(245, 158, 11, 0.12)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', marginBottom: 20 },
  vaultTag: { color: '#fbbf24', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  netWorthVal: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 4 },
  addBtn: { backgroundColor: '#f59e0b', borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  pillsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  pill: { flex: 1 },
  pillLabel: { color: '#64748b', fontSize: 10, fontWeight: '700' },
  pillVal: { fontSize: 13, fontWeight: '800', marginTop: 2 },
  sectionTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 12 },
  emptyText: { color: '#64748b', fontSize: 13 },
  assetItem: { backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assetName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  assetCat: { color: '#34d399', fontSize: 11, fontWeight: '600', marginTop: 2 },
  assetVal: { color: '#fbbf24', fontSize: 16, fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#0f172a', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 14 },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#07080f', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, color: '#fff', fontSize: 14, marginBottom: 14 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  cancelText: { color: '#fff', fontWeight: '700' },
  saveBtn: { flex: 2, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f59e0b', alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '900' }
});
