import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { auth } from "../../Firebase/firebase"; // Update path if necessary

import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase";

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const userId = auth?.currentUser?.uid; // Replace with authenticated user's ID

  // Fetch product and reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
          setProduct(productSnapshot.data());
        } else {
          console.error("Product not found!");
        }

        // Fetch reviews for the product
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, where("productId", "==", productId));
        const reviewsSnapshot = await getDocs(q);

        const fetchedReviews = reviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch user details for each review
        const reviewsWithUserDetails = await Promise.all(
          fetchedReviews.map(async (review) => {
            const userRef = doc(db, "users", review.userId);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.exists() ? userSnapshot.data() : {};
            return { ...review, user: userData };
          })
        );

        setReviews(reviewsWithUserDetails);

        // Check if the product is saved
        const savedRef = collection(db, "saved");
        const savedQuery = query(
          savedRef,
          where("productId", "==", productId),
          where("userId", "==", userId)
        );
        const savedSnapshot = await getDocs(savedQuery);
        setIsSaved(!savedSnapshot.empty);
      } catch (error) {
        console.error("Error fetching product or reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, userId]);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || reviewText.trim() === "") {
      alert("Please provide a rating and review text.");
      return;
    }

    try {
      const review = {
        productId,
        userId,
        rating,
        reviewText,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "reviews"), review);
      alert("Review submitted successfully!");

      // Add the new review to the state
      setReviews((prevReviews) => [...prevReviews, review]);

      // Reset form
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  // Handle adding to cart
  const handleAddToCart = async () => {
    try {
      const cartItem = {
        productId,
        userId,
        quantity: 1, // Default quantity is 1
        addedAt: new Date(),
      };

      await addDoc(collection(db, "cart"), cartItem);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  // Handle save toggle
  const handleSaveToggle = async () => {
    try {
      const savedRef = collection(db, "saved");
      const savedQuery = query(
        savedRef,
        where("productId", "==", productId),
        where("userId", "==", userId)
      );
      const savedSnapshot = await getDocs(savedQuery);

      if (!savedSnapshot.empty) {
        // If already saved, delete it
        const docId = savedSnapshot.docs[0].id;
        await deleteDoc(doc(db, "saved", docId));
        setIsSaved(false);
        alert("Product removed from saved items.");
      } else {
        // Otherwise, save it
        await addDoc(savedRef, { productId, userId, savedAt: new Date() });
        setIsSaved(true);
        alert("Product saved successfully!");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      alert("Failed to toggle save. Please try again.");
    }
  };

  if (loading) return <p>Loading product...</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container mx-auto my-20 p-5 border rounded shadow-lg text-gray-600">
      <div className="flex flex-col md:flex-row gap-10">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full md:w-1/2 h-auto rounded object-fill"
        />

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-serif text-gray-800">
              Product Name: {product.name}
            </h1>
          </div>

          <p className="text-gray-900 py-5 rounded-lg bg-gray-300 font-serif pb-10 px-20">{product.description}</p>
          <p className="text-4xl font-extrabold text-green-400">Price: ${product.price.toFixed(2)}</p>
          <p className="text-gray-600">Brand: {product.brand}</p>
          <p className="text-gray-600">Category: {product.category}</p>
          <p className="text-gray-600">Gender: {product.gender}</p>
          <p className="text-gray-600">Available Sizes: {product.sizes.join(", ")}</p>
          <p className="text-gray-600">Colors: {product.colors.join(", ")}</p>
          <p className="text-gray-900 font-extrabold text-xl">Add to Saved list:          
            <button
              onClick={handleSaveToggle}
              className="text-xl p-2 m-1 text-gray-600"
            >
              <FontAwesomeIcon
                icon={faBookmark}
                className={isSaved ? "text-amber-600 hover:text-amber-800" : "text-gray-400 hover:text-gray-600"}
              />
            </button>
          </p>
          <button
            onClick={handleAddToCart}
            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-10 mx-10 mr-40">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>

        {/* Add a Review */}
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Rating</span>
            <div className="flex space-x-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={
                    rating >= star
                      ? "text-yellow-600 text-2xl"
                      : "text-gray-300 text-2xl"
                  }
                >
                  ★
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Review</span>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full p-2 border rounded"
            ></textarea>
          </label>

          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded font-semibold"
          >
            Submit Review
          </button>
        </form>

        {/* Display Reviews */}
        {reviews.length > 0 ? (
          <div className="mt-6 space-y-4 w-4/6 p-10">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-slate-200 rounded-lg shadow-md">
                {/* Header: User info and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={review.user.profilePicture}
                      alt={`${review.user.name}'s Profile`}
                      className="w-12 h-12 rounded-full"
                    />
                    <p className="font-bold text-lg">{review.user.name}</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(review.createdAt.seconds * 1000).toLocaleDateString("en-US")}
                  </span>
                </div>

                {/* Review Text */}
                <p className="mt-4 text-gray-700 leading-relaxed">
                  <strong className="pr-2">Comment: </strong> {review.reviewText}
                </p>

                {/* Rating */}
                <div className="mt-3 flex items-center">
                  <span className="font-medium text-gray-800">Rating: </span>
                  <span className="ml-2 text-yellow-500 text-lg">
                    {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No reviews yet. Be the first!</p>
        )}

      </div>
    </div>
  );
};

export default SingleProduct;
