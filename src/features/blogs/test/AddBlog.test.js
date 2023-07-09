import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddBlog from '../AddBlog';
import { server } from '../../../mocks/testServer';
import { store } from '../../../app/store';
import { Provider } from 'react-redux';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

describe('AddBlog', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it('renders form inputs and button', () => {
    render(
      <Provider store={store}>
        <AddBlog />
      </Provider>
    );
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const contentInput = screen.getByLabelText('Content');
    const addButton = screen.getByRole('button', { name: 'Add Blog' });

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(contentInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  it('updates state on input change', () => {
    render(
      <Provider store={store}>
        <AddBlog />
      </Provider>
    );
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const contentInput = screen.getByLabelText('Content');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });

    expect(titleInput.value).toBe('Test Title');
    expect(descriptionInput.value).toBe('Test Description');
    expect(contentInput.value).toBe('Test Content');
  });

  it('calls addBlog mutation and navigates on form submission', async () => {
    render(
      <Provider store={store}>
        <AddBlog />
      </Provider>
    );
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const contentInput = screen.getByLabelText('Content');
    const addButton = screen.getByRole('button', { name: 'Add Blog' });

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Title').value).toBe('');
      expect(screen.getByLabelText('Description').value).toBe('');
      expect(screen.getByLabelText('Content').value).toBe('');
    });
  });

  it('display error message when addBlog mutation throws an error on incorrect input', async () => {
    render(
      <Provider store={store}>
        <AddBlog />
      </Provider>
    );
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const contentInput = screen.getByLabelText('Content');
    const addButton = screen.getByRole('button', { name: 'Add Blog' });

    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(contentInput, { target: { value: '' } });

    fireEvent.click(addButton);
    expect(await screen.findByText(/Loading/i)).toBeInTheDocument();

    const errorMsg = await screen.findByText(/Bad request/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
