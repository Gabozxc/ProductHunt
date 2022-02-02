import firebase, {firebaseContext} from '../firebase'
import useAutenticado from '../hooks/useAutenticado'
import '../styles/querisFix.css'

const myApp = Props => {
      const usuario = useAutenticado()
      
      //Esto es una forma para agregarlo de forma dinamica en los componentes, component es el componente actul, y los props son los pageProps
      const {Component, pageProps} = Props

      return(
            <firebaseContext.Provider 
            
                  value= {
                        {
                              firebase,
                              usuario
                              
                        }
                  }
            >
                  <Component {...pageProps} />
            </firebaseContext.Provider>
      )
}


export default myApp