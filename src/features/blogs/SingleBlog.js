import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetBlogQuery } from "./blogsApiSlice";

const SingleBlog = () => {
  const { id } = useParams();
  let { data, isLoading, isSuccess, isError, error } = useGetBlogQuery(id);

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    const blog = data?.data;
    content = (
      <section className="users">
        {
          <article>
            <h2>{blog.title}</h2>
            <p className="desc">{blog.description}</p>
            <p className="content">{blog.content}</p>
            <center className="edit-btn">
              <Link to={`/blog/edit/${blog._id}`}>Edit Blog</Link>
            </center>
          </article>
        }
        <Link to="/blog">Back</Link>
      </section>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};

export default SingleBlog;
