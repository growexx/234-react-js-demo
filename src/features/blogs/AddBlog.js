import React, { useEffect, useRef, useState } from 'react';
import { useAddBlogMutation } from './blogsApiSlice';
import { useNavigate } from 'react-router-dom';

const AddBlog = () => {
  const navigate = useNavigate();
  const errRef = useRef();

  const [addBlog, { isLoading }] = useAddBlogMutation();

  const [errMsg, setErrMsg] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [title, description, content]);

  const handleTitleInput = (e) => setTitle(e.target.value);
  const handleDescriptionInput = (e) => setDescription(e.target.value);
  const handleContentInput = (e) => setContent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoading) {
      try {
        await addBlog({
          title,
          description,
          content
        }).unwrap();
        setTitle('');
        setDescription('');
        setContent('');
        navigate('/blog');
      } catch (error) {
        // console.log('Error', error, error?.response?.data, JSON.stringify(error));
        setErrMsg(error?.data?.message);
      }
    }
  };

  let pageContent;
  if (isLoading) {
    pageContent = <p>Loading.....</p>;
  } else {
    pageContent = (
      <div className="editBlog">
        <p
          data-testid="err-para"
          ref={errRef}
          className={errMsg ? 'errmsg' : 'offscreen'}
          aria-live="assertive">
          {errMsg}
        </p>
        <h2>New Blog Post</h2>

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

          <button>Add Blog</button>
        </form>
      </div>
    );
  }

  return pageContent;
};

export default AddBlog;
