import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
  });
  const db = getFirestore();


  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
        setLoading(false);
      } catch (err) {
        setError("Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [db]);

  // Handle updating product details
  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
  };

  const handleSaveProduct = async () => {
    try {
      const productRef = doc(db, "products", currentProduct.id);
      await updateDoc(productRef, currentProduct);
      setIsEditing(false);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === currentProduct.id ? currentProduct : product
        )
      );
    } catch (err) {
      setError("Error saving product");
    }
  };

  // Handle deleting product
  const handleDeleteProduct = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (err) {
      setError("Error deleting product");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 text-gray-700 pt-20">
      <h2 className="text-2xl font-bold text-center mb-6">Product Management</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white p-4 rounded mb-6 shadow-lg shadow-slate-400">
          <h3 className="text-xl font-bold mb-4">Edit Product</h3>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={currentProduct.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={currentProduct.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={currentProduct.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="stock" className="block text-gray-700">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={currentProduct.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveProduct}
              className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="ml-2 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      <table className="min-w-full table-auto border-collapse shadow-lg shadow-slate-400">
        <thead>
          <tr className="bg-gray-300 text-black py-40 m-10">
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Available stock</th>
            <th className="border px-4 py-2">Edit</th>
            <th className="border px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2 text-center">{product.name}</td>
              <td className="border px-4 py-2 text-center">${product.price}</td>
              <td className="border px-4 py-2 text-center">{product.stock}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-slate-500 text-white px-4 py-1 rounded hover:bg-slate-600"
                >
                  Edit
                </button>
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-400 text-black px-4 py-1 rounded hover:bg-red-500 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
