import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddBlog from '../AddBlog';
import { server } from '../../../mocks/testServer';
import { store } from '../../../app/store';
import { Provider } from 'react-redux';
import SingleBlog from '../SingleBlog';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { handlers } from '../../../mocks/handlers';
import { useGetBlogQuery } from '../blogsApiSlice';

jest.mock('../blogsApiSlice');

describe('Single Blog Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it("displays loading message while fetching blog data", () => {
    useGetBlogQuery.mockReturnValue({ isLoading: true });

    render(<SingleBlog />);

    const loadingMessage = screen.getByText(/Loading/i);
    expect(loadingMessage).toBeInTheDocument();
  });

  it('displays blog content when data is successfully fetched', async () => {
    const blog = {
      _id: '123',
      title: 'Test Blog',
      description: 'Test Description',
      content: 'Test Content'
    };
    useGetBlogQuery.mockReturnValue({ data: { data: blog }, isSuccess: true, isLoading: false });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/blog/123']}>
          <Routes>
            <Route path="/blog/:id" element={<SingleBlog />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const blogTitle = screen.getByText('Test Blog');
    const blogDescription = screen.getByText('Test Description');
    const blogContent = screen.getByText('Test Content');
    const editLink = screen.getByRole('link', { name: 'Edit Blog' });
    const backLink = screen.getByRole('link', { name: 'Back' });

    expect(blogTitle).toBeInTheDocument();
    expect(blogDescription).toBeInTheDocument();
    expect(blogContent).toBeInTheDocument();
    expect(editLink).toHaveAttribute('href', '/blog/edit/123');
    expect(backLink).toHaveAttribute('href', '/blog');
  });

  it('displays error message when data fetching encounters an error', () => {
    const error = { message: 'Error fetching blog' };
    useGetBlogQuery.mockReturnValue({ isError: true, error });

    render(<SingleBlog />);

    const errorMessage = screen.getByText(JSON.stringify(error));
    expect(errorMessage).toBeInTheDocument();
  });
});
