import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { IWalletMonthData } from '../types/wallet';
import { addExpenseItem, addIncomeItem } from '../services/api';

const categoryColors: Record<string, string> = {
  Food: '#ff9800',
  Travel: '#00bcd4',
  Rent: '#4caf50',
  Utility: '#2196f3',
  Gadgets: '#9c27b0',
  Server: '#f44336',
  Entertainment: '#e91e63',
  'Parents (Baba Ma)': '#ff5722',
  Other: '#607d8b'
};

const quickPresets = [
  { name: 'Nasta / Snack', amount: 150, category: 'Food' },
  { name: 'Travel / Transport', amount: 80, category: 'Travel' },
  { name: 'Mess Deposit', amount: 500, category: 'Food' },
  { name: 'Wi-Fi / Internet', amount: 1000, category: 'Utility' },
  { name: 'Tea / Coffee', amount: 30, category: 'Food' }
];

export default function DashboardScreen({
  months,
  activeMonthId,
  setActiveMonthId,
  refreshData
}: {
  months: IWalletMonthData[];
  activeMonthId: string;
  setActiveMonthId: (id: string) => void;
  refreshData: () => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'expense' | 'income'>('expense');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [submitting, setSubmitting] = useState(false);

  const activeMonth = months.find((m) => m._id === activeMonthId) || months[months.length - 1];

  if (!activeMonth) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#34d399" />
        <Text style={styles.loadingText}>Syncing Ledger Database...</Text>
      </View>
    );
  }

  // Calculations
  const salary = activeMonth.salary || 0;
  const addon = activeMonth.addon || 0;
  const bonus = activeMonth.bonus || 0;
  const extraIncomes = (activeMonth.incomes || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalIncome = salary + addon + bonus + extraIncomes;

  const totalExpense = (activeMonth.expenses || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const carriedSavings = activeMonth.carriedOverSavings || 0;

  const activeLoans = (activeMonth.loans || [])
    .filter((l) => l.status === 'Pending')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const netSavings = carriedSavings + totalIncome - totalExpense - activeLoans;
  const savingsRate = totalIncome > 0 ? Math.max(0, (netSavings / (totalIncome + carriedSavings)) * 100).toFixed(1) : '0';

  const handleQuickLog = async (preset: typeof quickPresets[0]) => {
    if (!activeMonth._id) return;
    const success = await addExpenseItem(activeMonth._id, {
      description: preset.name,
      amount: preset.amount,
      category: preset.category,
      date: new Date().toISOString().split('T')[0]
    });
    if (success) {
      Alert.alert('Logged!', `Added ৳${preset.amount} for ${preset.name}`);
      refreshData();
    } else {
      Alert.alert('Error', 'Could not sync expense to server.');
    }
  };

  const handleSubmitModal = async () => {
    if (!desc || !amount) {
      Alert.alert('Validation Error', 'Please enter description and amount.');
      return;
    }
    setSubmitting(true);
    let ok = false;
    if (modalType === 'expense') {
      ok = await addExpenseItem(activeMonth._id, {
        description: desc,
        amount: Number(amount),
        category,
        date: new Date().toISOString().split('T')[0]
      });
    } else {
      ok = await addIncomeItem(activeMonth._id, {
        description: desc,
        amount: Number(amount),
        category: category || 'Freelance',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setSubmitting(false);
    if (ok) {
      setModalVisible(false);
      setDesc('');
      setAmount('');
      refreshData();
    } else {
      Alert.alert('Error', 'Failed to save to server.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Month Selector Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthPickerContainer}>
        {months.map((m, idx) => {
          const isActive = m._id === activeMonth._id;
          const isLatest = idx === months.length - 1;
          return (
            <TouchableOpacity
              key={m._id}
              style={[styles.monthChip, isActive && styles.monthChipActive]}
              onPress={() => setActiveMonthId(m._id)}
            >
              <Text style={[styles.monthChipText, isActive && styles.monthChipTextActive]}>
                {m.monthName} {isLatest && '⚡'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Financial Executive Summary HUD */}
      <View style={styles.hudCard}>
        <Text style={styles.hudTitle}>EXECUTIVE FINANCIAL LEDGER</Text>
        <Text style={styles.netSavingsValue}>৳{netSavings.toLocaleString()}</Text>
        <Text style={styles.hudSubtitle}>Available Liquid Balance ({savingsRate}% Savings Rate)</Text>

        <View style={styles.hudGrid}>
          <View style={styles.hudMetric}>
            <Text style={styles.metricLabel}>Total Inflow</Text>
            <Text style={[styles.metricValue, { color: '#34d399' }]}>+৳{totalIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.hudMetric}>
            <Text style={styles.metricLabel}>Total Outflow</Text>
            <Text style={[styles.metricValue, { color: '#f87171' }]}>-৳{totalExpense.toLocaleString()}</Text>
          </View>
          <View style={styles.hudMetric}>
            <Text style={styles.metricLabel}>Active Debts</Text>
            <Text style={[styles.metricValue, { color: '#fbbf24' }]}>৳{activeLoans.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Quick 1-Touch Expense Logger */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⚡ 1-Touch Quick Expense Chips</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickBar}>
        {quickPresets.map((preset, idx) => (
          <TouchableOpacity key={idx} style={styles.quickChip} onPress={() => handleQuickLog(preset)}>
            <Text style={styles.quickChipText}>+ {preset.name} (৳{preset.amount})</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#10b981' }]}
          onPress={() => {
            setModalType('income');
            setCategory('Freelance');
            setModalVisible(true);
          }}
        >
          <Text style={styles.btnText}>+ Log Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#ef4444' }]}
          onPress={() => {
            setModalType('expense');
            setCategory('Food');
            setModalVisible(true);
          }}
        >
          <Text style={styles.btnText}>+ Log Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Expenses Ledger */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💸 Cash Outflows ({activeMonth.expenses?.length || 0} items)</Text>
      </View>
      {(activeMonth.expenses || []).map((exp, idx) => {
        const catColor = categoryColors[exp.category] || '#607d8b';
        return (
          <View key={exp._id || idx} style={styles.ledgerItem}>
            <View style={styles.ledgerItemHeader}>
              <View style={[styles.catTag, { backgroundColor: `${catColor}20`, borderColor: catColor }]}>
                <Text style={[styles.catTagText, { color: catColor }]}>{exp.category}</Text>
              </View>
              <Text style={styles.expAmount}>-৳{exp.amount.toLocaleString()}</Text>
            </View>
            <Text style={styles.itemDesc}>{exp.description}</Text>
            <Text style={styles.itemDate}>{exp.date}</Text>
          </View>
        );
      })}

      {/* Add Item Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modalType === 'expense' ? 'Log New Expense' : 'Log New Income'}
            </Text>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sokaler Nasta or Project Client Payment"
              placeholderTextColor="#64748b"
              value={desc}
              onChangeText={setDesc}
            />

            <Text style={styles.label}>Amount (৳)</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount in BDT"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            {modalType === 'expense' && (
              <>
                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  {Object.keys(categoryColors).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catPickerOption, category === cat && styles.catPickerOptionActive]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.catPickerText, category === cat && { color: '#34d399' }]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitModal} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Save to Ledger</Text>}
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
  centerContainer: { flex: 1, backgroundColor: '#07080f', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 12, fontSize: 14, fontWeight: '600' },
  monthPickerContainer: { marginBottom: 16 },
  monthChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  monthChipActive: { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#34d399' },
  monthChipText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  monthChipTextActive: { color: '#34d399' },
  hudCard: { backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(52, 211, 153, 0.3)', marginBottom: 20 },
  hudTitle: { color: '#34d399', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  netSavingsValue: { color: '#ffffff', fontSize: 32, fontWeight: '900', marginTop: 4 },
  hudSubtitle: { color: '#cbd5e1', fontSize: 12, marginTop: 4, fontWeight: '600' },
  hudGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  hudMetric: { flex: 1 },
  metricLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', uppercase: true },
  metricValue: { fontSize: 15, fontWeight: '800', marginTop: 2 },
  sectionHeader: { marginTop: 10, marginBottom: 10 },
  sectionTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
  quickBar: { marginBottom: 16 },
  quickChip: { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  quickChipText: { color: '#fbbf24', fontSize: 12, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  ledgerItem: { backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 10 },
  ledgerItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  catTagText: { fontSize: 11, fontWeight: '800' },
  expAmount: { color: '#f87171', fontSize: 16, fontWeight: '900' },
  itemDesc: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 6 },
  itemDate: { color: '#64748b', fontSize: 11, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#0f172a', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 16 },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#07080f', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, color: '#fff', fontSize: 14, marginBottom: 16 },
  catPickerOption: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 8, borderWidth: 1, borderColor: 'transparent' },
  catPickerOptionActive: { borderColor: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.15)' },
  catPickerText: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontWeight: '700' },
  submitBtn: { flex: 2, paddingVertical: 12, borderRadius: 10, backgroundColor: '#10b981', alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '900' }
});
