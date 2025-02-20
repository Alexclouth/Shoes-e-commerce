//const {onRequest} = require("firebase-functions/v2/https");
//const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

exports.listUsers = functions.https.onCall(async (data, context) => {
  // Check if the user making the call is an admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError("permission-denied", "Unauthorized");
  }

  const listUsers = async (nextPageToken) => {
    const userList = [];
    try {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      result.users.forEach((userRecord) => {
        userList.push({
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName || "No Name",
        });
      });

      // If there's a next page, fetch more users
      if (result.pageToken) {
        const nextPageUsers = await listUsers(result.pageToken);
        userList.push(...nextPageUsers);
      }

      return userList;
    } catch (error) {
      console.error("Error listing users:", error);
      throw new functions.https.HttpsError("unknown", "Error listing users");
    }
  };

  return listUsers();
});

