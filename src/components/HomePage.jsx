import React from 'react';
import { useMetaTags } from '../hooks/useMetaTags';

const HomePage = () => {
  // Set meta tags for the homepage
  useMetaTags({
    title: 'Home - BonnieBead',
    description: 'Welcome to BonnieBead, your go-to destination for beautiful handmade beads.',
    canonical: 'https://bonniebead.com/',
    hreflang: {
      'en': 'https://bonniebead.com/',
      'uk': 'https://bonniebead.com/uk'
    }
  });

  return (
    <div>
      <h1>Welcome to BonnieBead</h1>
      <p>Your go-to destination for beautiful handmade beads.</p>
    </div>
  );
};

export default HomePage;