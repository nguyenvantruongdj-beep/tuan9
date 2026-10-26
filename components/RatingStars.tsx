import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type RatingStarsProps = {
  value: number;
  size?: number;
};

export default function RatingStars({ value, size = 18 }: RatingStarsProps) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < Math.round(value);

    return (
      <Text
        key={index}
        style={[
          styles.star,
          { color: isFilled ? '#fbbf24' : '#cbd5e1', fontSize: size },
        ]}
      >
        ★
      </Text>
    );
  });

  return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
});