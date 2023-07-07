import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logOut } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const Header = () => {
  const [isAuthenticated] = useAuth();
  const dispatch = useDispatch();
  // const token = localStorage.getItem("token");
  // console.log("Header page token :: ", isAuthenticated);

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <div className="header">
      <Link to="/">
        <h3>Blog Panel</h3>
      </Link>
      <div className="header-right">
        {!isAuthenticated ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <Link to="/blog">Blogs</Link>
            <Link to="/blog/add">Add Blog</Link>
            {/* <Link to="/table">Table</Link> */}
            {/* <Link to='/popup' >Popup</Link> */}
            <Link to="" onClick={handleLogout}>
              Logout
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
