import styles from "../../styles/Home.module.css";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { useUser } from "@clerk/nextjs";
import React from "react";
import styled from "@emotion/styled";

const mockGetPosts = (userId) => {
  return Promise.resolve([{ title: "A Post", content: "Hello from Clerk + Remix" }]);
};

const StyledButton = styled.button`
  color: hotpink;
  background-color: gainsboro;
  padding: 1rem;
  margin: 1rem;
  font-size: 2rem;
`;

const StyledButton2 = styled(StyledButton)`
  background-color: greenyellow;
`;

export const getServerSideProps = withServerSideAuth(
  async ({ req, resolvedUrl }) => {
    const { sessionId, getToken, userId } = req.auth;
    console.log("Use getAuth() to access the auth state:", userId, sessionId, getToken);

    if (!userId) {
      return { redirect: { destination: "/sign-up?redirect_url=" + resolvedUrl } };
    }

    const posts = await mockGetPosts(userId);
    return { props: { posts } };
  },
  { loadUser: true }
);

const SSRDemoPage = ({ posts }) => {
  const { isSignedIn, isLoaded, user } = useUser();

  // Code hightlighting
  React.useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  });

  return (
    <div className={styles.container}>
      <StyledButton className={"cl-styled-button"}>StyledButton</StyledButton>
      <StyledButton2 className={"cl-styled-button"}>StyledButton2</StyledButton2>
      <StyledButton2>StyledButton2 no class</StyledButton2>
      <main className={styles.main}>
        <h1 className={styles.title}>SSR Demo page</h1>
        <p className={styles.description}>
          This page and any displayed data are fully rendered on the server side. Reload this page to try it out.
        </p>

        <div className={styles.preContainer}>
          <h2>Data returned from getServerSideProps</h2>
          <p className={styles.description}>
            The loader uses getAuth to get the userId and fetch the posts from a remote database
          </p>
          <pre>
            <code className="language-js">{JSON.stringify({ posts }, null, 2)}</code>
          </pre>
        </div>

        <div className={styles.preContainer}>
          <h2>useUser hook</h2>
          <p className={styles.description}>
            Passing {`{ loadeUser: true }`} to the root loader makes all Clerk data available both during SSR and CSR
          </p>
          <pre>
            <code className="language-js">{JSON.stringify({ isLoaded })}</code>
          </pre>
          <pre>
            <code className="language-js">{JSON.stringify({ isSignedIn })}</code>
          </pre>
          <pre>
            <code className="language-js">{JSON.stringify({ user }, null, 2)}</code>
          </pre>
        </div>
      </main>
    </div>
  );
};

export default SSRDemoPage;
