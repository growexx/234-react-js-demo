import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useDeleteBlogMutation, useLazyGetUsersQuery } from '../blogsApiSlice';
import BlogList from '../List';

jest.mock('../blogsApiSlice');

describe('BlogList Component', () => {
  beforeEach(() => {
    useLazyGetUsersQuery.mockReturnValue([
      jest.fn().mockResolvedValue({}),
      {
        isLoading: false,
        isSuccess: true
      }
    ]);

    useDeleteBlogMutation.mockReturnValue([jest.fn().mockResolvedValue({})]);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render loading state when data is being fetched', () => {
    useLazyGetUsersQuery.mockReturnValue([
      jest.fn().mockResolvedValue({}),
      {
        isLoading: true,
        isSuccess: false
      }
    ]);

    render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error when fetching blog data throws error', () => {
    const error = { message: 'Error fetching blog' };
    useLazyGetUsersQuery.mockReturnValue([
      jest.fn().mockResolvedValue({}),
      {
        isLoading: false,
        isError: true,
        error
      }
    ]);

    render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    );

    const errorMessage = screen.getByText(JSON.stringify(error));
    expect(errorMessage).toBeInTheDocument();
  });

  it('should render blog data when fetch is successful', async () => {
    const blogData = [
      {
        _id: '1',
        title: 'Test Title 1....',
        description: 'Test Description 1....',
        content: 'Test Content 1....',
        updatedAt: '2023-07-05T12:34:56.789Z'
      },
      {
        _id: '2',
        title: 'Test Title 2....',
        description: 'Test Description 2....',
        content: 'Test Content 2....',
        updatedAt: '2023-07-05T12:34:56.789Z'
      }
    ];

    const data = {
      data: blogData,
      count: blogData.length
    };
    useLazyGetUsersQuery.mockReturnValue([
      jest.fn().mockResolvedValue({}),
      {
        isLoading: false,
        isSuccess: true,
        data
      }
    ]);

    render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Test Title 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Test Description 2/i)).toBeInTheDocument();
  });

  it('should handle delete blog event', async () => {
    const blogData = [
      {
        _id: '1',
        title: 'Test Title',
        description: 'Test Description',
        content: 'Test Content',
        updatedAt: '2023-07-05T12:34:56.789Z'
      }
    ];

    const deleteBlogMock = jest.fn();

    const data = {
      data: blogData,
      count: blogData.length
    };
    useLazyGetUsersQuery.mockReturnValue([
      jest.fn().mockResolvedValue({}),
      {
        isLoading: false,
        isSuccess: true,
        data
      }
    ]);

    useDeleteBlogMutation.mockReturnValue([deleteBlogMock]);

    render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    );

    waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: 'Discard' });

      fireEvent.click(deleteButton);

      expect(deleteBlogMock).toHaveBeenCalledTimes(1);
      expect(deleteBlogMock).toHaveBeenCalledWith({ _id: '1' });
    });
  });

  it('should render blog data when fetch is successful after next and previous page button clicked', async () => {
    const blogData = [
      {
        _id: '1',
        title: 'Test Title 1....',
        description: 'Test Description 1....',
        content: 'Test Content 1....',
        updatedAt: '2023-07-05T12:34:56.789Z'
      },
      {
        _id: '2',
        title: 'Test Title 2....',
        description: 'Test Description 2....',
        content: 'Test Content 2....',
        updatedAt: '2023-07-05T12:34:56.789Z'
      },
      {
        _id: '3',
        title: 'Test Title 1....',
        description: 'Test Description 1....',
        content: 'Test Content 1....',
        updatedAt: '2023-07-05T12:34:56.789Z'
      },
      {
        _id: '4',
        title: 'Test Title 2....',
        description: 'Test Description 2....',
        content: 'Test Content 2....',
        updatedAt: '2023-07-05T12:34:56.789Z'
      },
      {
        _id: '5',
        title: 'Test Title 1....',
        description: 'Test Description 1....',
        content: 'Test Content 1....',
        updatedAt: '2023-07-05T12:34:56.789Z'
      },
      {
        _id: '6',
        title: 'Test Title 2....',
        description: 'Test Description 2....',
        content: 'Test Content 2....',
        updatedAt: '2023-07-05T12:34:56.789Z'
      }
    ];

    const data = {
      data: blogData,
      count: blogData.length
    };
    const trigger = jest.fn().mockResolvedValue({});
    useLazyGetUsersQuery.mockReturnValue([
      trigger,
      {
        isLoading: false,
        isSuccess: true,
        data
      }
    ]);

    render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    );

    const nextPage = screen.getByRole('button', { name: 'Go to next page' });
    fireEvent.click(nextPage);

    expect(trigger).toHaveBeenCalledWith({
      skip: 5,
      limit: 5,
      order: 1,
      search: '',
      sort: 'updatedAt'
    });

    const prevPage = screen.getByRole('button', { name: 'Go to previous page' });
    fireEvent.click(prevPage);

    expect(trigger).toHaveBeenCalledWith({
      skip: 0,
      limit: 5,
      order: 1,
      search: '',
      sort: 'updatedAt'
    });

    // expect(trigger).toHaveBeenCalledWith({ skip: 0, limit: 5, order: 1, search: '', sort: 'updatedAt' });
    // screen.debug(screen.getByDisplayValue(''));
    // screen.debug(screen.getByLabelText(/page/i));
    // screen.debug();
  });
});
