import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the markdown editor app', () => {
  render(<App />);
  expect(screen.getByText(/Markdown Tool/i)).toBeInTheDocument();
});