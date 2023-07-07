import { useEffect, useState } from 'react';
import { useDeleteBlogMutation, useLazyGetUsersQuery } from './blogsApiSlice';
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PopUp from '../../components/PopUp';
import { DeleteForever } from '@mui/icons-material';
import './bloglist.css';

const BlogList = () => {
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('updatedAt');
  const [order, setOrder] = useState(1);
  const [page, setPage] = useState(0);
  const [blogData, setBlogData] = useState([]);
  const [count, setCount] = useState(0);

  const [trigger, { data: blogs, isLoading, isSuccess, isError, error }] = useLazyGetUsersQuery();
  const [deleteBlog] = useDeleteBlogMutation();

  useEffect(() => {
    // console.log('first', skip, limit, search, sort, order);
    trigger({ skip, limit, search, sort, order });
  }, [skip, limit, search, sort, order]);

  useEffect(() => {
    if (blogs?.data) {
      setBlogData([...blogs.data]);
      setCount(blogs.count);
    }
  }, [blogs?.data]);

  const handlePagination = (model) => {
    const { page, pageSize } = model;
    const offset = page * pageSize;
    setPage(page);
    console.log('latest page detail ', page, pageSize);
    console.log('offset', offset);
    if (offset < count) {
      setSkip(offset);
    }
    setLimit(pageSize);
  };

  const handleBlogFilter = (model) => {
    const { quickFilterValues } = model;
    setPage(0);
    setSkip(0);
    console.log('search model ', model, quickFilterValues?.join(' '));
    setSearch(quickFilterValues?.join(' '));
  };

  const handleSortFilter = (model) => {
    console.log('sorting model ', model);
    const [sorting] = model;
    let ordered;
    if (sorting?.sort) {
      ordered = sorting?.sort === 'asc' ? 1 : -1;
    } else {
      ordered = '';
    }
    setPage(0);
    setSkip(0);
    setSort(sorting?.field);
    setOrder(ordered);
  };

  const handleDeleteBlog = async (id) => {
    try {
      await deleteBlog({ _id: id }).unwrap();
      const filterData = blogData.filter((blog) => blog._id !== id);
      setBlogData(filterData);
      setCount(count - 1);
    } catch (err) {
      console.error('Failed to delete the post', err);
    }
  };

  // const statusOptions = [
  //   { value: 'Active', label: 'Active' },
  //   { value: 'Inactive', label: 'InActive' }
  // ];
  const columns = [
    {
      field: '_id',
      headerName: 'Id',
      flex: 0.5,
      disableColumnMenu: true,
      sortable: false,
      filterable: false
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 0.7,
      disableColumnMenu: true,
      sortable: true,
      filterable: false
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      filterable: false
    },
    {
      field: 'content',
      headerName: 'Content',
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      filterable: false
    },
    {
      field: 'updatedAt',
      headerName: 'Updated Date',
      flex: 1,
      disableColumnMenu: true,
      // sortable: false,
      filterable: false
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      renderCell: (row) => {
        console.log(' row ', row?.id);
        return (
          <>
            <Link to={`/blog/edit/${row?.id}`} style={{ color: 'black' }}>
              Edit Blog
            </Link>
            <PopUp
              buttonName="Discard"
              buttonColor="danger"
              buttonIcon={<DeleteForever />}
              note="Are you sure you want to discard this blog?"
              handleEvent={() => handleDeleteBlog(row?.id)}
            />
          </>
        );
      }
    }
  ];

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    // console.log('count ', count);
    // console.log('page ', Math.ceil(count / limit));
    content = (
      <DataGrid
        rows={blogData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0, // Math.ceil(count / limit),
              pageSize: 5 // limit,
            }
          },
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: ['']
            }
          }
        }}
        // disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
            showQuickFilter: true,
            quickFilterProps: {
              debounceMs: 500,
              sx: { backgroundColor: 'white' }
            }
          }
        }}
        rowCount={count}
        paginationMode="server"
        filterMode="server"
        sortingMode="server"
        pageSizeOptions={[5, 10]}
        getRowId={(row) => row._id}
        paginationModel={{
          page: page, // Math.ceil(count / limit),
          pageSize: limit
        }}
        onPaginationModelChange={handlePagination}
        onFilterModelChange={handleBlogFilter}
        onSortModelChange={handleSortFilter}
      />
    );
  } else if (isError) {
    console.log('error?.status', error?.status);
    content =
      error?.status === 401 ? <p>{JSON.stringify(error)}</p> : <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default BlogList;
