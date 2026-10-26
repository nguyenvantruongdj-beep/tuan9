import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AuthUser } from '../store/authStore';
import type { Book } from './HomeScreen';

type CheckoutScreenProps = {
  book: Book;
  user: AuthUser | null;
  onBack: () => void;
  onLogout: () => void;
};

export default function CheckoutScreen({ book, user, onBack, onLogout }: CheckoutScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>
      <Text style={styles.subtitle}>Xác nhận đơn hàng</Text>

      <View style={styles.card}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookMeta}>{book.author}</Text>
        <Text style={styles.price}>{book.price.toLocaleString('vi-VN')}đ</Text>
      </View>

      <View style={styles.userCard}>
        <Text style={styles.label}>Người đặt</Text>
        <Text style={styles.userText}>{user?.name || user?.email || 'Khách'}</Text>
      </View>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryText}>Xác nhận thanh toán</Text>
      </Pressable>

      <View style={styles.footerRow}>
        <Pressable style={styles.secondaryButton} onPress={onBack}>
          <Text style={styles.secondaryText}>Quay lại</Text>
        </Pressable>
        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 8,
    color: '#475569',
    fontSize: 15,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bookTitle: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700',
  },
  bookMeta: {
    color: '#64748b',
    marginTop: 6,
  },
  price: {
    marginTop: 12,
    color: '#2563eb',
    fontSize: 28,
    fontWeight: '700',
  },
  userCard: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  label: {
    color: '#0369a1',
    fontWeight: '600',
    fontSize: 13,
  },
  userText: {
    marginTop: 6,
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});