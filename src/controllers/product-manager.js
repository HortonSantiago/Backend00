const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
    this.io = null; // Socket.IO instance
  }

  // Métodos:

  attachIO(io) {
    this.io = io;
  }

  async addProduct(nuevoObjeto) {
    let { title, description, price, img, code, stock } = nuevoObjeto;

    if (!title || !description || !price || !img || !code || !stock) {
      console.log(
        "Todos los campos son obligatorios, completalo o moriras en 24 hs"
      );
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log("El codigo debe ser unico, rata de dos patas!");
      return;
    }

    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      img,
      code,
      stock,
    };

    this.products.push(newProduct);

    // Guardamos el array en el archivo:
    await this.guardarArchivo(this.products);

    // Emitimos un evento de socket para la adición de productos
    if (this.io) {
      this.io.emit("productAdded");
    }
  }

  async getProducts() {
    try {
      // Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
      const arrayProductos = await this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (!buscado) {
        console.log("Producto no encontrado");
      } else {
        console.log("Siii, lo encontramos! ");
        return buscado;
      }
    } catch (error) {
      console.log("Error al leer el archivo ", error);
    }
  }

  // Nuevos metodos desafio 2:

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Eerror al leer un archivo", error);
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  // Actualizamos algun producto:
  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        // Puedo usar el método de array splice para reemplazar el objeto en la posición del index:
        arrayProductos.splice(index, 1, productoActualizado);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("no se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }
}

module.exports = ProductManager; // Exporta la clase ProductManager
