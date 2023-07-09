import { useEffect, useState } from "react";
import { useGetUsersQuery } from "./blogsApiSlice";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "./bloglist.css";

const UsersList = () => {
  const [limit, setLimit] = useState(9);
  const [skip, setSkip] = useState(0);
  const [blogData, setBlogData] = useState([]);

  const {
    data: blogs,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetUsersQuery({ skip, limit });

  const handelInfiniteScroll = () => {
    // console.log("scrollHeight" + document.documentElement.scrollHeight);
    // console.log("innerHeight" + window.innerHeight);
    // console.log("scrollTop" + document.documentElement.scrollTop);
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        // setLoading(true);
        const offset = skip === 0 ? limit : skip + 3;
        setSkip(offset);
        setLimit(3);
      }
    } catch (error) {
      console.log("handelInfiniteScroll :: ", error);
    }
  };

  useEffect(() => {
    if (skip !== 0) {
      refetch({ skip, limit });
    }
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, [skip, limit]);

  useEffect(() => {
    if (blogs?.data?.length) {
      setBlogData([...blogData, ...blogs?.data]);
    }
  }, [blogs?.data]);

  const columns = [
    { field: "_id", headerName: "Id", flex: 0.5 },
    // {
    //   field: "authorName",
    //   headerName: "Author Name",
    //   flex: 1,
    //   default: '---'
    // },
    {
      field: "title",
      headerName: "Title",
      // headerAlign: "left",
      // align: "left",
    },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "content", headerName: "Content", flex: 1 },
    { field: "updatedAt", headerName: "Updated Date", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (row) => {
        console.log(" row ", row?.id);
        return (
          <>
          <button>Edit</button>
          </>
        );
      },
    },
  ];

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    // content = (
    //   <>
    //     <center>
    //       <h2>Blog List</h2>
    //       <div className="cards">
    //         {blogData?.map((blog, i) => {
    //           return (
    //             <article className="card" key={i}>
    //               <h2>{blog.title}</h2>
    //               <p className="desc">{blog.description}</p>
    //               <p className="content">{`${blog.content.slice(
    //                 0,
    //                 300,
    //               )}.......`}</p>
    //               <center>
    //                 <Link to={blog._id}>Read More</Link>
    //               </center>
    //             </article>
    //           );
    //         })}
    //       </div>
    //       <Link className="back-btn" to="/welcome">
    //         Back to Welcome
    //       </Link>
    //     </center>
    //   </>
    // );
    content = (
      <DataGrid
        rows={blogData}
        columns={columns}
        slots={{
          toolbar: GridToolbar,
          // noRowsOverlay: DraftsOutlined,
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        getRowId={(row) => row._id}
        onPaginationModelChange={(model, details) => {
          console.log("model", model);
          console.log("details", details);
        }}
      />
    );
  } else if (isError) {
    console.log("error?.status", error?.status);
    content =
      error?.status === 401 ? (
        // <Navigate to="/login" />
        <p>{JSON.stringify(error)}</p>
      ) : (
        <p>{JSON.stringify(error)}</p>
      );
  }

  return content;
};
export default UsersList;
