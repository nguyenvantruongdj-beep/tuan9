import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as authService from '../services/authService';

type RegisterScreenProps = {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (response: authService.AuthResponse) => Promise<void>;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ onSwitchToLogin, onRegisterSuccess }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {
      name: '',
      email: '',
      password: '',
    };

    if (name.trim() && name.trim().length < 2) {
      nextErrors.name = 'Tên phải có ít nhất 2 ký tự';
    }

    if (!email.trim()) {
      nextErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = 'Email không đúng định dạng';
    }

    if (!password) {
      nextErrors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 6) {
      nextErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    }

    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.email && !nextErrors.password;
  };

  const handleSubmit = async () => {
    setServerError('');
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(email.trim(), password, name.trim() || undefined);
      await onRegisterSuccess(response);
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Đăng ký thất bại'
          : 'Đăng ký thất bại';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản mới</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: '' }));
              }
            }}
            placeholder="Nhập họ tên"
            autoCapitalize="words"
            style={[styles.input, errors.name ? styles.inputError : null]}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: '' }));
              }
            }}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, errors.email ? styles.inputError : null]}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: '' }));
              }
            }}
            placeholder="Nhập mật khẩu"
            secureTextEntry
            style={[styles.input, errors.password ? styles.inputError : null]}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

          <Pressable style={[styles.primaryButton, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Đã có tài khoản?</Text>
            <Pressable onPress={onSwitchToLogin}>
              <Text style={styles.linkText}>Đăng nhập</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fff1f2',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginBottom: 10,
  },
  serverError: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    gap: 6,
  },
  footerText: {
    color: '#475569',
    fontSize: 14,
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 14,
  },
});