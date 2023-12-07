class ProductManager {
  //var estatica. pertenece a la clase
  static ultId = 0;

  //contructor con arreglo vacio
  constructor() {
    this.products = [];
  }

  //metodos

  addProduct(title, description, price, img, code, stock) {
    //validaciones

    //SE agregaron todos los campos?
    if (!title || !description || !price || !img || !code || !stock) {
      console.log(" todos los campos son obligatorios");
      return;
    }

    // elcodigo es unico?
    if (this.products.some((item) => item.code === code)) {
      console.log("el codigo debe ser unico");
      return;
    }

    // creamos un nuevo objeto con todos estos datos

    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      img,
      code,
      stock,
    };

    // se agrega al array
    this.products.push(newProduct);
  }
  getProductById(id) {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      console.log("producto no encontrado");
    } else {
      console.log("se encontro el producto: ", product);
    }
    return product;
  }

  getProducts() {
    console.log("Lista de productos:", this.products);
    return this.products;
  }
}

//testing
//1) instancia de la clase productmanager
const manager = new ProductManager();
// muestra array vacio
manager.getProducts();
// array con producto agregado
manager.addProduct(
  "Product correcto",
  "Lo corecto",
  10.99,
  "image1.jpg",
  "P011",
  100
);
manager.addProduct(
  "Product correcto 2",
  "Lo corecto 2",
  10.99,
  "image1.jpg",
  "P01",
  10
);
manager.addProduct(
  "Product correcto 3",
  "Lo corecto 3",
  10.99,
  "image1.jpg",
  "Ps01",
  12
);
manager.addProduct(
  //error: todos los campos son obligatorios
  "Product prueba",
  "Description 1",
  10.99,
  "image1.jpg",
  "P011"
);

manager.getProducts();

manager.addProduct(
  // eror: el codigo e unico
  "Product 1",
  "Description 1",
  10.99,
  "image1.jpg",
  "P011",
  100
);

manager.getProductById(2);
manager.getProductById(20);
