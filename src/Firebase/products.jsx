import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // Assuming firebase.js exports the Firestore instance

export const getProductById = async (productId) => {
  const productRef = doc(db, "products", productId);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    throw new Error("Product not found");
  }

  return { id: productSnap.id, ...productSnap.data() };
};
