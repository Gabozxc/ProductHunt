import firebase, { firebaseContext } from "../firebase";
import useAutenticado from "../hooks/useAutenticado";
import "../styles/querisFix.css";

const myApp = (Props) => {
  const usuario = useAutenticado();
  const { Component, pageProps } = Props;

  return (
    <firebaseContext.Provider
      value={{
        firebase,
        usuario,
      }}
    >
      <Component {...pageProps} />
    </firebaseContext.Provider>
  );
};

export default myApp;
