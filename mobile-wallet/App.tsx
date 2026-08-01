import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IWalletMonthData } from './src/types/wallet';
import { fetchWalletMonths } from './src/services/api';
import DashboardScreen from './src/screens/DashboardScreen';
import CapitalMatrixScreen from './src/screens/CapitalMatrixScreen';
import WealthVaultScreen from './src/screens/WealthVaultScreen';

export default function App() {
  const [months, setMonths] = useState<IWalletMonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vault' | 'matrix'>('dashboard');
  const [activeMonthId, setActiveMonthId] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchWalletMonths();
    setMonths(data);
    if (data.length > 0) {
      setActiveMonthId(data[data.length - 1]._id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar style="light" />

      {/* Top Mobile Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandGroup}>
          <Text style={styles.brandTitle}>Personal Wallet</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live MongoDB Sync</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
          <Text style={styles.refreshBtnText}>🔄 Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Main Screen Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34d399" />
          <Text style={styles.loadingText}>Connecting to Wallet Database...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <DashboardScreen
              months={months}
              activeMonthId={activeMonthId}
              setActiveMonthId={setActiveMonthId}
              refreshData={loadData}
            />
          )}
          {activeTab === 'vault' && (
            <WealthVaultScreen months={months} refreshData={loadData} />
          )}
          {activeTab === 'matrix' && (
            <CapitalMatrixScreen months={months} />
          )}
        </View>
      )}

      {/* Bottom Native Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'dashboard' && styles.navItemActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[styles.navText, activeTab === 'dashboard' && styles.navTextActive]}>📊 Ledger</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'vault' && styles.navItemActive]}
          onPress={() => setActiveTab('vault')}
        >
          <Text style={[styles.navText, activeTab === 'vault' && styles.navTextActive]}>💼 Wealth Vault</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'matrix' && styles.navItemActive]}
          onPress={() => setActiveTab('matrix')}
        >
          <Text style={[styles.navText, activeTab === 'matrix' && styles.navTextActive]}>🛡️ Stress Matrix</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#07080f', paddingTop: 30 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0b0f19' },
  brandGroup: { flexDirection: 'column' },
  brandTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34d399' },
  liveText: { color: '#34d399', fontSize: 10, fontWeight: '700' },
  refreshBtn: { backgroundColor: 'rgba(129, 140, 248, 0.15)', borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.3)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  refreshBtnText: { color: '#818cf8', fontSize: 12, fontWeight: '700' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 12, fontSize: 14, fontWeight: '600' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#0b0f19', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingVertical: 10, paddingHorizontal: 16 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 10 },
  navItemActive: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  navText: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  navTextActive: { color: '#34d399' }
});
