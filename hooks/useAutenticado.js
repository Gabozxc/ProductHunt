import { useEffect, useState } from "react";
import firebase from "../firebase";

const autenticacion = () => {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  useEffect(() => {
    const unsuscribe = firebase.auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        setUsuarioAutenticado(usuario);
      } else {
        setUsuarioAutenticado(null);
      }
    });
    return () => unsuscribe;
  }, []);

  return usuarioAutenticado;
};

export default autenticacion;
