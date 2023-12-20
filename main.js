const express = require("express");
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
        arrayProductos.splice(index, 1, {
          ...arrayProductos[index],
          ...productoActualizado,
        });
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

const app = express();
const port = 8080;
const manager = new ProductManager("./productos.json");

app.get("/", (req, res) => {
  res.send("¡Bienvenido a la aplicación de gestión de productos!");
});

app.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit) || undefined;
  const allProducts = await manager.getProducts();

  if (limit) {
    res.json(allProducts.slice(0, limit));
  } else {
    res.json(allProducts);
  }
});

app.get("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  const product = await manager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// testing del método usado
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
