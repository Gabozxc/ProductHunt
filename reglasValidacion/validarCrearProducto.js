export default function validarCrearProducto(valores) {
  let errores = {};

  if (!valores.nombre) {
      errores.nombre = "El nombre es obligatorio";
    }

  if (!valores.empresa) {
    errores.empresa = "La empresa es obligatorio";
  }


  if(!valores.url) {
      errores.url = 'La URL del producto es obligatoria';
  } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
      errores.url = "URL mal formateada o no válida"
  }


  if (!valores.descripcion) {
      errores.descripcion = "La descripcion es obligatorio";
    }

  return errores;
}
