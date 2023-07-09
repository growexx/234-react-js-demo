import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Welcome from '../Welcome';

const initialState = {
  auth: {
    user: {
      firstName: 'John',
      lastName: 'Doe'
    }
  }
};
const mockStore = createStore(() => initialState);

describe('Welcome component', () => {
  beforeAll(() => {
    localStorage.setItem('token', 'er123456789120');
  });
  afterAll(() => {
    localStorage.removeItem('token');
  });

  beforeEach(() => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Welcome />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render the welcome message', () => {
    const welcomeMessage = screen.getByRole('heading', { name: /welcome john doe!/i });
    expect(welcomeMessage).toBeInTheDocument();
  });

  it('should render a link to the blog list', () => {
    const link = screen.getByRole('link', { name: /go to the blog list/i });
    expect(link).toBeInTheDocument();
  });
});
