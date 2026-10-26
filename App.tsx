import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen, { type Book } from './screens/HomeScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import { clearAuth, loadAuth, saveAuth, type AuthState } from './store/authStore';
import type { AuthResponse } from './services/authService';

export type AppScreen = 'home' | 'login' | 'register' | 'detail' | 'checkout';

const SAMPLE_BOOKS: Book[] = [
  {
    id: 1,
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Văn học',
    price: 45000,
    image: 'https://picsum.photos/seed/book1/300/450',
    description: 'Dế Mèn Phiêu Lưu Ký là một cuốn sách văn học nổi tiếng về những cuộc phiêu lưu đầy trí tuệ và cảm xúc.',
  },
  {
    id: 2,
    title: 'Lập trình React Native',
    author: 'Nguyễn Văn A',
    category: 'Công nghệ',
    price: 98000,
    image: 'https://picsum.photos/seed/book2/300/450',
    description: 'Cuốn sách hướng dẫn xây dựng ứng dụng di động hiện đại với React Native và Expo.',
  },
  {
    id: 3,
    title: 'Tư duy nhanh',
    author: 'John Smith',
    category: 'Kỹ năng',
    price: 76000,
    image: 'https://picsum.photos/seed/book3/300/450',
    description: 'Một cuốn sách giúp bạn tăng tốc khả năng suy nghĩ, quản lý thời gian và quyết định tốt hơn.',
  },
];

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ token: null, user: null });
  const [screen, setScreen] = useState<AppScreen>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [returnTo, setReturnTo] = useState<AppScreen | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const persisted = await loadAuth();
      setAuth(persisted);
      setScreen(persisted.token && persisted.user ? 'home' : 'login');
      setIsLoading(false);
    };

    bootstrap();
  }, []);

  const handleAuthSuccess = async (response: AuthResponse) => {
    const nextAuth: AuthState = {
      token: response.accessToken || response.token || null,
      user: response.user || null,
    };

    await saveAuth(nextAuth);
    setAuth(nextAuth);
    const nextScreen = returnTo || 'home';
    setReturnTo(null);
    setScreen(nextScreen);
  };

  const handleLogout = async () => {
    await clearAuth();
    setAuth({ token: null, user: null });
    setReturnTo(null);
    setScreen('login');
  };

  const openBookDetail = (book: Book) => {
    setSelectedBook(book);
    setScreen('detail');
  };

  const openCheckout = (book?: Book) => {
    if (book) {
      setSelectedBook(book);
    }

    if (!auth.token || !auth.user) {
      setReturnTo('checkout');
      setScreen('login');
      return;
    }

    setScreen('checkout');
  };

  const goHome = () => {
    setSelectedBook(null);
    setScreen('home');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải dữ liệu người dùng...</Text>
      </SafeAreaView>
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onSwitchToRegister={() => setScreen('register')}
        onLoginSuccess={handleAuthSuccess}
      />
    );
  }

  if (screen === 'register') {
    return (
      <RegisterScreen
        onSwitchToLogin={() => setScreen('login')}
        onRegisterSuccess={handleAuthSuccess}
      />
    );
  }

  if (screen === 'detail' && selectedBook) {
    return (
      <BookDetailScreen
        book={selectedBook}
        user={auth.user}
        token={auth.token}
        onBack={goHome}
        onCheckout={() => openCheckout(selectedBook)}
      />
    );
  }

  if (screen === 'checkout') {
    return (
      <CheckoutScreen
        book={selectedBook ?? SAMPLE_BOOKS[0]}
        user={auth.user}
        onBack={goHome}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <HomeScreen
      user={auth.user}
      books={SAMPLE_BOOKS}
      onLogout={handleLogout}
      onOpenBook={openBookDetail}
      onCheckout={openCheckout}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0f172a',
  },
});
