import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import RatingStars from '../components/RatingStars';
import { createReview, getAverageRating, getReviewsByBook, type BookReview } from '../services/reviewService';
import type { AuthUser } from '../store/authStore';
import type { Book } from './HomeScreen';

type BookDetailScreenProps = {
  book: Book;
  user: AuthUser | null;
  token: string | null;
  onBack: () => void;
  onCheckout: () => void;
};

export default function BookDetailScreen({ book, user, token, onBack, onCheckout }: BookDetailScreenProps) {
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviewsByBook(book.id);
      setReviews(data);
      setAverageRating(getAverageRating(data));
    };

    fetchReviews();
  }, [book.id]);

  const handleSubmitReview = async () => {
    if (!user) {
      setSubmitMessage('Bạn cần đăng nhập để gửi đánh giá.');
      return;
    }

    if (!comment.trim()) {
      setSubmitMessage('Vui lòng nhập bình luận trước khi gửi.');
      return;
    }

    setLoading(true);
    setSubmitMessage('');

    try {
      const newReview: BookReview = {
        bookId: book.id,
        userId: user.id,
        userName: user.name || user.email,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      const createdReview = await createReview(newReview, token);
      const nextReviews = [createdReview, ...reviews];
      setReviews(nextReviews);
      setAverageRating(getAverageRating(nextReviews));
      setComment('');
      setRating(5);
    } catch (error) {
      setSubmitMessage('Gửi đánh giá thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Quay lại</Text>
      </Pressable>

      <Image source={{ uri: book.image }} style={styles.image} />

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.meta}>{book.author} • {book.category}</Text>
      <Text style={styles.price}>{book.price.toLocaleString('vi-VN')}đ</Text>
      <Text style={styles.description}>{book.description}</Text>

      <Pressable style={styles.checkoutButton} onPress={onCheckout}>
        <Text style={styles.checkoutText}>Thanh toán</Text>
      </Pressable>

      <View style={styles.ratingSection}>
        <Text style={styles.sectionTitle}>Đánh giá trung bình</Text>
        <View style={styles.ratingRow}>
          <RatingStars value={averageRating} size={22} />
          <Text style={styles.averageText}>{averageRating.toFixed(1)} / 5</Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>Danh sách đánh giá</Text>

        {reviews.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có đánh giá nào cho sách này.</Text>
        ) : (
          reviews.map((review, index) => (
            <View key={`${review.userId}-${review.createdAt || index}`} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.userName}>{review.userName}</Text>
                <RatingStars value={Number(review.rating)} size={16} />
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))
        )}
      </View>

      {user ? (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Gửi đánh giá của bạn</Text>

          <Text style={styles.label}>Chọn số sao</Text>
          <View style={styles.starSelectorRow}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable key={value} onPress={() => setRating(value)} style={styles.starButton}>
                <Text style={[styles.starButtonText, value <= rating ? styles.starSelected : null]}>★</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Viết bình luận của bạn..."
            multiline
            style={styles.input}
          />

          {submitMessage ? <Text style={styles.submitMessage}>{submitMessage}</Text> : null}

          <Pressable style={styles.submitButton} onPress={handleSubmitReview} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Gửi đánh giá</Text>
            )}
          </Pressable>
        </View>
      ) : (
        <Text style={styles.loginHint}>Đăng nhập để gửi đánh giá mới.</Text>
      )}
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
    paddingBottom: 36,
  },
  backButton: {
    marginBottom: 14,
  },
  backText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
  },
  title: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14,
  },
  price: {
    marginTop: 10,
    color: '#2563eb',
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
  checkoutButton: {
    marginTop: 18,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  ratingSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  averageText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewSection: {
    marginTop: 24,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewComment: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    marginTop: 24,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  starSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  starButton: {
    paddingHorizontal: 6,
  },
  starButtonText: {
    fontSize: 28,
    color: '#cbd5e1',
  },
  starSelected: {
    color: '#fbbf24',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#0f172a',
    marginBottom: 12,
  },
  submitMessage: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  loginHint: {
    marginTop: 18,
    color: '#475569',
    fontSize: 14,
  },
});