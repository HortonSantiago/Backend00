const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const productos = await this.leerArchivo();
      return productos.length > 0
        ? productos
        : { error: "No hay productos disponibles" };
    } catch (error) {
      console.log("Error al obtener los productos", error);
      return { error: "Error interno del servidor" };
    }
  }

  async getProductById(id) {
    try {
      const productos = await this.leerArchivo();
      const producto = productos.find((producto) => producto.id === id);
      return producto ? producto : { error: "Producto no encontrado" };
    } catch (error) {
      console.log("Error al obtener el producto", error);
      return { error: "Error interno del servidor" };
    }
  }

  async addProduct(nuevoProducto) {
    try {
      const productos = await this.leerArchivo();
      const id =
        productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
      const productoNuevo = { id, ...nuevoProducto };
      productos.push(productoNuevo);
      await this.guardarArchivo(productos);
      return { message: "Producto agregado correctamente" };
    } catch (error) {
      console.log("Error al agregar el producto", error);
      return { error: "Error interno del servidor" };
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      let productos = await this.leerArchivo();
      const index = productos.findIndex((producto) => producto.id === id);
      if (index !== -1) {
        productos[index] = { ...productos[index], ...productoActualizado };
        await this.guardarArchivo(productos);
        return { message: "Producto actualizado correctamente" };
      } else {
        return { error: "Producto no encontrado" };
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      return { error: "Error interno del servidor" };
    }
  }

  async deleteProduct(id) {
    try {
      let productos = await this.leerArchivo();
      productos = productos.filter((producto) => producto.id !== id);
      await this.guardarArchivo(productos);
      return { message: "Producto eliminado correctamente" };
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      return { error: "Error interno del servidor" };
    }
  }

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const productos = JSON.parse(respuesta);
      return productos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      return [];
    }
  }

  async guardarArchivo(productos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }
}

module.exports = ProductManager;
