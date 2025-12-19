import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

// Fetch all products
export const getAllProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update a product
export const updateProduct = async (id, updatedData) => {
  const productRef = doc(db, "products", id);
  await updateDoc(productRef, updatedData);
};

// Delete a product
export const deleteProductById = async (id) => {
  const productRef = doc(db, "products", id);
  await deleteDoc(productRef);
};
