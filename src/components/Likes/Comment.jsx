/** @format */

import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firestore } from "../../Api/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../Api/firebase";
import "./Comment.scss";
export default function Comment({
  id,
  commentp,
  postImg,
  createdUserPhoto,
  setCommentModal,
}) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentlyLoggedinUser] = useAuthState(auth);
  const commentRef = doc(firestore, "Articles", id);
  useEffect(() => {
    const docRef = doc(firestore, "Articles", id);
    onSnapshot(docRef, (snapshot) => {
      setComments(snapshot.data().comments);
    });
  }, []);

  const handleChangeComment = (e) => {
    if (e.key === "Enter" || e == "button") {
      updateDoc(commentRef, {
        comments: arrayUnion({
          user: currentlyLoggedinUser.uid,
          userName: currentlyLoggedinUser.displayName,
          comment: comment,
          createdAt: new Date(),
          commentId: uuidv4(),
        }),
      }).then(() => {
        setComment("");
      });
    }
  };

  // delete comment function
  const handleDeleteComment = (comment) => {
    console.log(comment);
    updateDoc(commentRef, {
      comments: arrayRemove(comment),
    })
      .then((e) => {
        console.log(e);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(comments);
  return (
    <>
      <div className="comment-modal">
        <div className="modal-inner">
          <div className="close-con" onClick={() => setCommentModal(false)}>
            <img src="https://t3.ftcdn.net/jpg/03/64/30/82/360_F_364308273_cV9OrZrqUpZ8En9rC8KxBqaxkVg95ZTY.jpg" />
          </div>
          <img src={postImg} alt="" />
          <ul className="comments">
            {comments.map(
              ({ commentId, user, comment, userName, createdAt }) => (
                <li key={commentId}>
                  <p className="username">{userName}</p>
                  <p className="comment">{comment}</p>
                  <div className="delete-comment">
                    {user === currentlyLoggedinUser.uid && (
                      <i
                        className="fa fa-times"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleDeleteComment({
                            commentId,
                            user,
                            comment,
                            userName,
                            createdAt,
                          })
                        }
                      ></i>
                    )}
                  </div>
                </li>
              )
            )}
          </ul>

          <input
            type="text"
            name="comment"
            placeholder="Add a comment"
            value={comment}
            onKeyUp={(e) => {
              handleChangeComment(e);
            }}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <button onClick={() => handleChangeComment("button")}>Submit</button>
        </div>
      </div>
      <div className="w-screen"></div>
    </>
  );
}
