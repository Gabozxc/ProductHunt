import  { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, funcion) => {


  const [state, setState] = useState(stateInicial);
  const [errores, setErrores] = useState({});
  const [SubmitForm, setSubmitForm] = useState(false);

  useEffect(() => {
    if (SubmitForm) {
      const noErrores = Object.keys(errores).length === 0;

      if (noErrores) {
        funcion();
      }
    }
    setSubmitForm(false);


  }, [SubmitForm, errores]);


  //Funcion que se ejecuta cuando el usuario esta escribiendo

  const handleChange = e => {
      setState(
           {
            ...state,
            [e.target.name] : e.target.value
           }
      )

  }

 //Funcion que se ejecuta cuando usuario hace submit para la validacion
  const handleSubmit = e => {

      e.preventDefault();
      
      const erroresValidacion = validar(state)
      setErrores(erroresValidacion)
      setSubmitForm(true)

  }

  const handleBlur = e => {


    const erroresValidacion = validar(state)
    setErrores(erroresValidacion)

  }


  return {
  
      state,
      errores,
      handleChange,
      handleSubmit,
      handleBlur
  
  };
};

export default useValidacion;
