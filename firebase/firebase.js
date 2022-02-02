import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import firebaseConfig from "./firebaseConfig";


class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
    }
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
  }

  async registrar(nombre, correo, password) {
    const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(
      correo,
      password
    );

    return await nuevoUsuario.user.updateProfile({
      displayName: nombre,
    });
  }

  async login(correo, password) {
    return this.auth.signInWithEmailAndPassword(correo, password);
  }

  async cerrarSesion() {
    await this.auth.signOut();
  }
}

const firebase = new Firebase();

export default firebase;
