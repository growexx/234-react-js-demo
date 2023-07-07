import { Link } from "react-router-dom";

const Public = () => {
  const token = localStorage.getItem("token"); // useSelector(selectCurrentToken);

  const content = (
    <section className="public">
      <header>
        <h1>Welcome to My First React App!</h1>
      </header>
      <main>
        <p>
          Located in Beautiful Downtown Foo City, React Store provides a trained
          staff ready to meet your react needs.
        </p>
        <p>&nbsp;</p>
        <address>
          React Store
          <br />
          555 Foo Drive
          <br />
          Foo City, CA 12345
          <br />
          <a href="tel:+12222222222">(111) 123-4567</a>
        </address>
      </main>
      <footer>{!token ? <Link to="/login">User Login</Link> : ""}</footer>
    </section>
  );
  return content;
};
export default Public;
