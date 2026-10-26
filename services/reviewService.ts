import axios from 'axios';
import { Platform } from 'react-native';

export type BookReview = {
  id?: number;
  bookId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
};

const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
});

export const getReviewsByBook = async (bookId: number): Promise<BookReview[]> => {
  const response = await api.get('/reviews');
  return (response.data as BookReview[]).filter(
    (review) => Number(review.bookId) === Number(bookId),
  );
};

export const createReview = async (
  payload: Omit<BookReview, 'id'>,
  token?: string | null,
): Promise<BookReview> => {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await api.post('/reviews', payload, { headers });
  return response.data as BookReview;
};

export const getAverageRating = (reviews: BookReview[]) => {
  if (!reviews.length) {
    return 0;
  }

  const total = reviews.reduce((sum, item) => sum + Number(item.rating), 0);
  return Number((total / reviews.length).toFixed(1));
};