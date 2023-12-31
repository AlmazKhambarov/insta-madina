/** @format */
// thisssss dapsdjao[ifhufhsafg]

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth, firestore, storage } from "../Api/firebase";
import { toHaveErrorMessage } from "@testing-library/jest-dom/dist/matchers";
import { errorMessage } from "./loginSlice/loginSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Timestamp, addDoc, collection } from "firebase/firestore";
export const createUser = createAsyncThunk(
  "user/createUserAndProfile",
  async (data, thunkAPI) => {
    console.log(data);
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        // thisssss dapsdjao[ifhufhsafg]
        data.password
      );
      const usersData = {
        userPhoto: data.photo,
        userName: data.name,
        userEmail: data.email,
      };
      const usersRef = collection(firestore, "Users");
      await addDoc(usersRef, usersData);
      await updateProfile(auth.currentUser, {
        // thisssss dapsdjao[ifhufhsafg]
        displayName: data.name,
        photoURL: data.photo,
        phoneNumber:data.phone
      });

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
      // thisssss dapsdjao[ifhufhsafg]
    }
  }
);

export const UserLogin = createAsyncThunk("login", async (data, thunkAPI) => {
  try {
    const user = await signInWithEmailAndPassword(
      // thisssss dapsdjao[ifhufhsafg]
      auth,
      data.email,
      data.password
    );
    return user;
  } catch (error) {
    // dispatch(errorMessage(error))
    console.log(error);
  }
});

// thisssss dapsdjao[ifhufhsafg]
export const publishPosts = createAsyncThunk(
  "posts/publish",
  async (data, thunkAPI) => {
    const { title, imageUpload, user, description } = data;
    // thisssss dapsdjao[ifhufhsafg]
    try {
      const storageRef = ref(
        storage,
        `/images/${Date.now()}${imageUpload?.name}`
        // thisssss dapsdjao[ifhufhsafg]
      );

      const uploadImage = uploadBytesResumable(storageRef, imageUpload);
      // Await the uploadImage to complete
      // thisssss dapsdjao[ifhufhsafg]
      await uploadImage;

      const url = await getDownloadURL(uploadImage.snapshot.ref);

      const articleData = {
        title: title,
        description: description,
        // thisssss dapsdjao[ifhufhsafg]
        imageUrl: url,
        createdAt: Timestamp.now().toDate(),
        createdUserPhoto: user?.photoURL,
        createdBy: user?.displayName,
        userId: user?.uid,
        likes: [],
        comments: [],
      };

      const articleRef = collection(firestore, "Articles");
      // thisssss dapsdjao[ifhufhsafg]
      await addDoc(articleRef, articleData);

      return {}; // You can return data if needed
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateDisplayNameAsync = createAsyncThunk(
  "user/updateDisplayName",
  // thisssss dapsdjao[ifhufhsafg]
  async (newDisplayName, { rejectWithValue }) => {
    console.log(newDisplayName);
    try {
      await auth.currentUser.updateProfile({
        displayName: newDisplayName,
        // thisssss dapsdjao[ifhufhsafg]
      });

      return newDisplayName;
      // thisssss dapsdjao[ifhufhsafg]
    } catch (error) {
      // Handle errors here and reject the promise with an error message
      return rejectWithValue("Failed to update displayName");
    }
  }
);
