import { render, screen } from '@testing-library/react';
import App from './App';

test('Should initially display the "Create homework" card', () => {
  render(<App/>);
  const element = screen.getByText("Create homework");
  expect(element).toBeInTheDocument();
});