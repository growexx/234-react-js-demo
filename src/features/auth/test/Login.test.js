import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import Login from '../Login';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import userEvent from '@testing-library/user-event';
import { useForm } from './mock';
import { act } from 'react-dom/test-utils';
import { server } from '../../../mocks/testServer';
import React from 'react';
import Welcome from '../Welcome';
import { setCredentials } from '../authSlice';

jest.mock('../authSlice', () => ({
  setCredentials: jest.fn(),
  selectCurrentUser: jest.fn()
}));

describe('Login Component', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  beforeEach(() => {
    const login = (
      <Provider store={store}>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </Provider>
    );
    render(login, { wrapper: BrowserRouter });
  });
  afterEach(() => server.resetHandlers());

  it('should render User Login form', async () => {
    const usernameLabel = await screen.getByLabelText('Username:');
    expect(usernameLabel).toBeInTheDocument();
    expect(usernameLabel).toHaveFocus();
    userEvent.hover(usernameLabel);

    const usernamePlaceholder = screen.getByPlaceholderText(/Enter your Email here.../i);
    expect(usernamePlaceholder).toBeInTheDocument();

    const pwdLabel = screen.getByLabelText('Password:');
    expect(pwdLabel).toBeInTheDocument();

    const pwdPlaceholder = screen.getByPlaceholderText(/Enter your Password here.../i);
    expect(pwdPlaceholder).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Log In' });
    expect(button).toBeInTheDocument();
  });

  it('should change form input on user type event', () => {
    const usernameLabel = screen.getByLabelText('Username:');
    expect(usernameLabel).toBeInTheDocument();

    const pwdLabel = screen.getByLabelText('Password:');
    expect(pwdLabel).toBeInTheDocument();

    const { result } = renderHook(useForm);
    act(() => result.current.handleUserInput('demo@test.com'));
    act(() => result.current.handlePwdInput('Demo@test123.com'));

    expect(result.current.user).toBe('demo@test.com');
    expect(result.current.pwd).toBe('Demo@test123.com');
    expect(result.current.errMsg).toBe('');
  });

  it('should render same text passed into user form input', async () => {
    const usernameLabel = screen.getByLabelText('Username:');
    expect(usernameLabel).toBeInTheDocument();

    const pwdLabel = screen.getByLabelText('Password:');
    expect(pwdLabel).toBeInTheDocument();

    // fireEvent.change(usernameLabel, { target: { value: "demo@test.com" } });
    // fireEvent.change(pwdLabel, { target: { value: "Demo@test123.com" } });
    const { result } = renderHook(useForm);
    act(() => {
      userEvent.type(usernameLabel, 'demo@test.com');
      result.current.handleUserInput('demo@test.com');
    });

    act(() => {
      userEvent.type(pwdLabel, 'Demo@test123.com');
      result.current.handlePwdInput('Demo@test123.com');
    });

    expect(usernameLabel).toHaveValue('demo@test.com');
    expect(pwdLabel).toHaveValue('Demo@test123.com');
  });

  it('should display error when user click on Login button with blank details', async () => {
    const button = screen.getByRole('button', { name: 'Log In' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    const { result } = renderHook(useForm);
    act(() => result.current.handleError('Missing Username or Password'));

    const errorMsg = await screen.findByText('Missing Username or Password');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveClass('errmsg');
  });

  it('should display error when user click on Login button with incorrect details', async () => {
    const { result } = renderHook(useForm);

    const usernameLabel = screen.getByLabelText('Username:');
    expect(usernameLabel).toBeInTheDocument();

    const pwdLabel = screen.getByLabelText('Password:');
    expect(pwdLabel).toBeInTheDocument();

    act(() => {
      userEvent.type(usernameLabel, 'demo@test.com');
      result.current.handleUserInput('demo@test.com');
    });

    act(() => {
      userEvent.type(pwdLabel, 'Demo@test123.in');
      result.current.handlePwdInput('Demo@test123.in');
    });

    const button = await screen.findByRole('button', { name: 'Log In' });
    expect(button).toBeInTheDocument();

    act(() => result.current.handleError('Unauthorized'));
    fireEvent.click(button);

    const errorMsg = await screen.findByText('Unauthorized');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveClass('errmsg');
  });

  it('should success when user click on Login button with correct details', async () => {
    const { result } = renderHook(useForm);

    const usernameLabel = screen.getByLabelText('Username:');
    expect(usernameLabel).toBeInTheDocument();

    const pwdLabel = screen.getByLabelText('Password:');
    expect(pwdLabel).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Log In' });
    expect(button).toBeInTheDocument();

    act(() => {
      userEvent.type(usernameLabel, 'demo@test.com');
      result.current.handleUserInput('demo@test.com');
    });

    act(() => {
      userEvent.type(pwdLabel, 'Demo@test123.com');
      result.current.handlePwdInput('Demo@test123.com');
    });

    fireEvent.click(button);

    expect(await screen.findByText('Loading...')).toBeInTheDocument();
    setCredentials.mockReturnValue({
      type: 'auth/setCredentials',
    });

    const errorMsg = await screen.findByText(/welcome/i);
    screen.debug();
    expect(errorMsg).toBeInTheDocument();
  });
});
