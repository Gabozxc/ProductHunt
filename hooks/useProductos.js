import { useState, useEffect, useContext } from "react";
import firebaseContext from "../firebase/context";

const useProductos = (orden) => {

  const [productos, setProductos] = useState([]);

  const { firebase } = useContext(firebaseContext);

  const manejarSnapshot = (snapshop) => {
    const productos = snapshop.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
      
    });
    ///revisar el codigo de abajo malo. me lanza error
    setProductos(productos);
  };

  useEffect(() => {
    const obtenerProductos = () => {
      firebase.db
        .collection("productos")
        .orderBy(orden, "desc")
        .onSnapshot(manejarSnapshot);
    };

    obtenerProductos();
  }, []);

  return {
    productos,
  };
};

export default useProductos;
