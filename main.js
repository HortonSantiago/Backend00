const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(nuevoObj) {
    let { title, description, price, img, code, stock } = nuevoObj;

    if (!title || !description || !price || !img || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log("El código debe ser único");
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
    await this.guardarArchivo(this.products);
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (!buscado) {
        throw new Error("Producto no encontrado");
      }

      return buscado;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async getProducts() {
    try {
      const arrayProductos = await this.leerArchivo();
      console.log("Lista de productos:", arrayProductos);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1, { ...arrayProductos[index], ...productoActualizado });
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer un archivo", error);
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }
}

// testing del metodo usado
const manager = new ProductManager("./productos.json");

(async () => {
  await manager.getProducts();

  const productoPrueba = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    img: "Sin imagen",
    code: "abc123",
    stock: 25,
  };

  await manager.addProduct(productoPrueba);
  await manager.getProducts();
  await manager.getProductById(1);

  const updatedProduct = {
    title: "Producto Modificado",
  };
  await manager.updateProduct(1, updatedProduct);
  await manager.getProducts();

  await manager.deleteProduct(1);
  await manager.getProducts();
})();
