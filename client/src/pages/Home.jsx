import { useAuth0 } from "@auth0/auth0-react";
import Hero from "../components/hero/Hero";

export default function Home() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <div>
      <Hero />
    </div>

    // <div className="home">
    //   <h1>Assignment 3</h1>
    //   <div>
    //     <button className="btn-primary" onClick={loginWithRedirect}>
    //       Login
    //     </button>
    //     <p>Loading: {String(isLoading)} </p>
    //     <p>User Authenticated: {String(isAuthenticated)}</p>
    //   </div>
    // </div>
  );
}
