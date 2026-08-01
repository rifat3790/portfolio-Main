import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { IWalletMonthData } from '../types/wallet';

export default function CapitalMatrixScreen({ months }: { months: IWalletMonthData[] }) {
  const [incAdjust, setIncAdjust] = useState(0);
  const [expCut, setExpCut] = useState(0);

  const globalTotalInc = months.reduce((acc, m) => {
    return acc + (m.salary || 0) + (m.addon || 0) + (m.bonus || 0) +
      (m.incomes || []).reduce((s, curr) => s + (curr.amount || 0), 0);
  }, 0);

  const globalTotalExp = months.reduce((acc, m) => {
    return acc + (m.expenses || []).reduce((s, curr) => s + (curr.amount || 0), 0);
  }, 0);

  const latestMonth = months[months.length - 1];
  const avgExp = globalTotalExp / Math.max(1, months.length);
  const avgInc = globalTotalInc / Math.max(1, months.length);

  // Latest net balance
  const carried = latestMonth?.carriedOverSavings || 0;
  const latestInc = (latestMonth?.salary || 0) + (latestMonth?.addon || 0) + (latestMonth?.bonus || 0) +
    (latestMonth?.incomes || []).reduce((s, c) => s + (c.amount || 0), 0);
  const latestExp = (latestMonth?.expenses || []).reduce((s, c) => s + (c.amount || 0), 0);
  const latestLoans = (latestMonth?.loans || []).filter((l) => l.status === 'Pending').reduce((s, c) => s + (c.amount || 0), 0);
  const netBalance = carried + latestInc - latestExp - latestLoans;

  // Stress Scenarios
  const zeroIncRunway = avgExp > 0 ? (netBalance / avgExp).toFixed(1) : '∞';
  const inflatedExp = avgExp * 1.25;
  const inflatedSavings = Math.max(0, avgInc - inflatedExp);
  const inflatedRate = avgInc > 0 ? ((inflatedSavings / avgInc) * 100).toFixed(1) : '0';

  // Sandbox simulation
  const simInc = avgInc + incAdjust;
  const simExp = avgExp * (1 - expCut / 100);
  const simMonthlySavings = Math.max(0, simInc - simExp);
  const simYear1 = netBalance + simMonthlySavings * 12;
  const simYear3 = netBalance + simMonthlySavings * 36;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header HUD */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTag}>SOVEREIGN CAPITAL INTELLIGENCE</Text>
        <Text style={styles.heroTitle}>Stress-Testing & Projections Engine</Text>
        <Text style={styles.heroSubtitle}>
          Real-time Black-Swan scenario simulator & interactive wealth decision sandbox.
        </Text>
      </View>

      {/* Black-Swan Stress Simulator */}
      <Text style={styles.sectionTitle}>🔥 Black-Swan Macro Stress Simulator</Text>

      <View style={[styles.stressCard, { borderColor: 'rgba(239, 68, 68, 0.4)' }]}>
        <Text style={[styles.stressTag, { color: '#f87171' }]}>SCENARIO A: 0 REVENUE CESSATION</Text>
        <Text style={styles.stressValue}>{zeroIncRunway} Months</Text>
        <Text style={styles.stressDesc}>Zero income survival runway at ৳{Math.round(avgExp)}/mo burn.</Text>
      </View>

      <View style={[styles.stressCard, { borderColor: 'rgba(245, 158, 11, 0.4)' }]}>
        <Text style={[styles.stressTag, { color: '#fbbf24' }]}>SCENARIO B: +25% INFLATION SURGE</Text>
        <Text style={styles.stressValue}>{inflatedRate}% Savings Rate</Text>
        <Text style={styles.stressDesc}>Burn surges to ৳{Math.round(inflatedExp)}/mo under 25% inflation.</Text>
      </View>

      {/* Interactive Sandbox */}
      <Text style={styles.sectionTitle}>🎛️ Interactive Wealth Projections Sandbox</Text>
      <View style={styles.sandboxCard}>
        <Text style={styles.sandboxLabel}>Adjust Side-Gig Income Boost: +৳{incAdjust}/mo</Text>
        <View style={styles.chipRow}>
          {[0, 5000, 10000, 20000, 30000].map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.chip, incAdjust === val && styles.chipActive]}
              onPress={() => setIncAdjust(val)}
            >
              <Text style={[styles.chipText, incAdjust === val && styles.chipTextActive]}>+৳{val}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sandboxLabel}>Expense Cut Target: -{expCut}%</Text>
        <View style={styles.chipRow}>
          {[0, 10, 20, 30, 40].map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.chip, expCut === val && styles.chipActive]}
              onPress={() => setExpCut(val)}
            >
              <Text style={[styles.chipText, expCut === val && styles.chipTextActive]}>-{val}%</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results */}
        <View style={styles.simResults}>
          <View>
            <Text style={styles.simLabel}>Simulated Monthly Savings</Text>
            <Text style={styles.simVal}>৳{Math.round(simMonthlySavings).toLocaleString()}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.simLabel}>Simulated 1-Year Liquidity</Text>
            <Text style={[styles.simVal, { color: '#60a5fa' }]}>৳{Math.round(simYear1).toLocaleString()}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.simLabel}>Simulated 3-Year Liquidity</Text>
            <Text style={[styles.simVal, { color: '#c084fc' }]}>৳{Math.round(simYear3).toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07080f', padding: 16 },
  heroCard: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(52, 211, 153, 0.3)', marginBottom: 20 },
  heroTag: { color: '#34d399', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: '#ffffff', fontSize: 20, fontWeight: '900', marginTop: 4 },
  heroSubtitle: { color: '#cbd5e1', fontSize: 12, marginTop: 4 },
  sectionTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginTop: 10, marginBottom: 12 },
  stressCard: { backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 12 },
  stressTag: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  stressValue: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 4 },
  stressDesc: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  sandboxCard: { backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.3)' },
  sandboxLabel: { color: '#e2e8f0', fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  chip: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  chipActive: { backgroundColor: 'rgba(52, 211, 153, 0.2)', borderColor: '#34d399' },
  chipText: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#34d399' },
  simResults: { marginTop: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  simLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', uppercase: true },
  simVal: { color: '#34d399', fontSize: 18, fontWeight: '900', marginTop: 2 }
});
