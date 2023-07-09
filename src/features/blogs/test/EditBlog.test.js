import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditBlog from '../EditBlog';
import { useDeleteBlogMutation, useGetBlogQuery, useUpdateBlogMutation } from '../blogsApiSlice';
import { act } from 'react-dom/test-utils';

jest.mock('../blogsApiSlice');

describe('Edit Blog Component', () => {
  beforeEach(() => {
    useUpdateBlogMutation.mockReturnValue([
      jest
        .fn()
        .mockResolvedValue()
        .mockImplementation(() => ({ unwrap: jest.fn().mockResolvedValue({}) })),
      { isSuccess: true, isLoading: false }
    ]);

    useDeleteBlogMutation.mockReturnValue([jest.fn().mockResolvedValue({})]);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays loading message while fetching blog data', () => {
    useGetBlogQuery.mockReturnValue({ isLoading: true });

    render(
      <MemoryRouter initialEntries={['/blog/edit/123']}>
        <Routes>
          <Route path="/blog/edit/:id" element={<EditBlog />} />
        </Routes>
      </MemoryRouter>
    );

    const loadingMessage = screen.getByText('Loading.....');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('displays error when fetching blog data throws error', () => {
    const error = { message: 'Error fetching blog' };
    useGetBlogQuery.mockReturnValue({ isLoading: false, isError: true, error });

    render(
      <MemoryRouter initialEntries={['/blog/edit/123']}>
        <Routes>
          <Route path="/blog/edit/:id" element={<EditBlog />} />
        </Routes>
      </MemoryRouter>
    );

    const errorMessage = screen.getByText(JSON.stringify(error));
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays blog data when successfully fetched blog data', () => {
    const blogData = {
      _id: '123',
      title: 'Test Blog',
      description: 'Test Description',
      content: 'Test Content'
    };
    useGetBlogQuery.mockReturnValue({
      data: { data: blogData },
      isSuccess: true,
      isLoading: false
    });

    render(
      <MemoryRouter initialEntries={['/blog/edit/123']}>
        <Routes>
          <Route path="/blog/edit/:id" element={<EditBlog />} />
        </Routes>
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const contentInput = screen.getByLabelText('Content');

    expect(titleInput.value).toBe('Test Blog');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(contentInput).toHaveValue('Test Content');
  });

  it('should update blog data when user clicked on update button', async () => {
    const blogData = {
      _id: '123',
      title: 'Test Blog',
      description: 'Test Description',
      content: 'Test Content'
    };
    useGetBlogQuery.mockReturnValue({
      data: { data: blogData },
      isSuccess: true,
      isLoading: false
    });

    render(
      <MemoryRouter initialEntries={['/blog/edit/123']}>
        <Routes>
          <Route path="/blog/edit/:id" element={<EditBlog />} />
        </Routes>
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const contentInput = screen.getByLabelText('Content');
    const updateButton = screen.getByRole('button', { name: 'Update Blog' });

    expect(titleInput.value).toBe('Test Blog');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(contentInput).toHaveValue('Test Content');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });

    expect(contentInput).toHaveValue('Test Content');

    act(() => fireEvent.click(updateButton));

    waitFor(() => {
      expect(screen.getByLabelText('Title').value).toBe('');
      expect(screen.getByLabelText('Description').value).toBe('');
      expect(screen.getByLabelText('Content').value).toBe('');
    });
  });

  it('should delete blog when user clicked on Delete button', async () => {
    const blogData = {
      _id: '123',
      title: 'Test Blog',
      description: 'Test Description',
      content: 'Test Content'
    };
    useGetBlogQuery.mockReturnValue({
      data: { data: blogData },
      isSuccess: true,
      isLoading: false
    });

    const deleteBlogMock = jest.fn().mockResolvedValue({});
    useDeleteBlogMutation.mockReturnValue([deleteBlogMock]);

    render(
      <MemoryRouter initialEntries={['/blog/edit/123']}>
        <Routes>
          <Route path="/blog/edit/:id" element={<EditBlog />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Title').value).toBe('Test Blog');

    const deleteButton = screen.getByRole('button', { name: 'Delete Blog' });
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    expect(deleteBlogMock).toHaveBeenCalledWith({ _id: '123' });
  });
});
