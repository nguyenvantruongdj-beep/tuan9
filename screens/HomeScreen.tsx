import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { AuthUser } from '../store/authStore';

export type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

type HomeScreenProps = {
  user: AuthUser | null;
  books: Book[];
  onLogout: () => void;
  onOpenBook: (book: Book) => void;
  onCheckout: (book: Book) => void;
};

export default function HomeScreen({ user, books, onLogout, onOpenBook, onCheckout }: HomeScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Trang chủ</Text>
          <Text style={styles.welcome}>Xin chào, {user?.name || user?.email || 'Người dùng'}</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      </View>

      {books.map((book) => (
        <View key={book.id} style={styles.card}>
          <Pressable onPress={() => onOpenBook(book)}>
            <Image source={{ uri: book.image }} style={styles.image} />
          </Pressable>

          <View style={styles.infoContainer}>
            <Pressable onPress={() => onOpenBook(book)}>
              <Text style={styles.bookTitle}>{book.title}</Text>
            </Pressable>
            <Text style={styles.bookMeta}>{book.author} • {book.category}</Text>
            <Text style={styles.description}>{book.description}</Text>
            <View style={styles.bottomRow}>
              <Text style={styles.price}>{book.price.toLocaleString('vi-VN')}đ</Text>
              <Pressable style={styles.buyButton} onPress={() => onCheckout(book)}>
                <Text style={styles.buyText}>Thanh toán</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  welcome: {
    fontSize: 15,
    color: '#475569',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#e2e8f0',
  },
  infoContainer: {
    padding: 16,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  bookMeta: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
  },
  bottomRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
  },
  buyButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buyText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});