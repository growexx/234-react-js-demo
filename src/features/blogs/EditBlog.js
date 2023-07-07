import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDeleteBlogMutation, useGetBlogQuery, useUpdateBlogMutation } from './blogsApiSlice';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const errRef = useRef();

  const { data, isLoading, isSuccess, error } = useGetBlogQuery(id);
  const [updateBlog, updateBlogState] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [errMsg, setErrMsg] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isSuccess && data?.data) {
      const { title = '', description = '', content = '' } = data.data;
      setTitle(title);
      setDescription(description);
      setContent(content);
    }
  }, [isSuccess]);

  useEffect(() => {
    setErrMsg('');
  }, [title, description, content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updateBlogState?.isLoading) {
      try {
        await updateBlog({
          _id: id,
          title,
          description,
          content
        });
        setTitle('');
        setDescription('');
        setContent('');
        navigate(`/blog/${id}`);
      } catch (error) {
        console.log('Error', error, error?.response?.data, JSON.stringify(error));
      }
    }
  };

  const handleDeleteBlog = async () => {
    // const lock = window.confirm('Are you sure to delete this blog ?');
    // if (!lock) return;
    try {
      await deleteBlog({ _id: id });

      setTitle('');
      setDescription('');
      setContent('');
      navigate(`/blog`);
    } catch (err) {
      console.error('Failed to delete the post', err);
    }
  };

  const handleTitleInput = (e) => setTitle(e.target.value);
  const handleDescriptionInput = (e) => setDescription(e.target.value);
  const handleContentInput = (e) => setContent(e.target.value);

  let pageContent;
  if (isLoading) {
    pageContent = <p>Loading.....</p>;
  } else if (!isSuccess) {
    pageContent = <p>{JSON.stringify(error)}</p>;
  } else {
    pageContent = (
      <div className="editBlog">
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
          {errMsg}
        </p>
        <h2>Edit Blog Post</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Please Enter Blog Title"
            value={title}
            onChange={handleTitleInput}
            maxLength={40}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            placeholder="Please Enter Blog Description"
            value={description}
            onChange={handleDescriptionInput}
            maxLength={100}
            required
          />

          <label htmlFor="content">Content</label>
          <textarea
            type="text"
            id="content"
            placeholder="Please Enter Blog Content"
            value={content}
            onChange={handleContentInput}
            maxLength={1000}
            rows={10}
            required>
            {content}
          </textarea>

          <button>Update Blog</button>
        </form>
        <button id="popUp" onClick={() => handleDeleteBlog()} className="delete-btn">
          Delete Blog
        </button>
        {/* <PopUp buttonName='Delete Blog' content='Blog Deleted Successfully!!!' className='delete-btn' handleDeleteBlog={handleDeleteBlog} /> */}

        <center>
          <Link className="back-btn" onClick={() => navigate(-1)}>
            Back to View Blog
          </Link>
        </center>
      </div>
    );
  }

  return pageContent;
};

export default EditBlog;
