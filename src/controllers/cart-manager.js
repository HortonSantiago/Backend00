const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const cartsData = await fs.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartsData);
      return carts;
    } catch (error) {
      console.error("Error al leer el archivo de carritos", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const newCartId = carts.length + 1;
      const newCart = { id: newCartId, products: [] };
      carts.push(newCart);
      await this.saveCarts(carts);
      return newCart;
    } catch (error) {
      console.error("Error al crear un nuevo carrito", error);
      throw error;
    }
  }

  async getCart(cartId) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id === parseInt(cartId));
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cartId));
      if (cartIndex === -1) {
        throw new Error("Cart not found");
      }
      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(
        (product) => product.id === productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }
      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito", error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cartId));
      if (cartIndex === -1) {
        throw new Error("Cart not found");
      }
      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(
        (product) => product.id === productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
      } else {
        throw new Error("Product not found in cart");
      }
      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad de producto en el carrito",
        error
      );
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cartId));
      if (cartIndex === -1) {
        throw new Error("Cart not found");
      }
      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(
        (product) => product.id === productId
      );
      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
      } else {
        throw new Error("Product not found in cart");
      }
      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      console.error("Error al eliminar un producto del carrito", error);
      throw error;
    }
  }

  async saveCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.error("Error al guardar los carritos en el archivo", error);
      throw error;
    }
  }
}

module.exports = CartManager;
