import { db } from "@/hooks/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function handleUserInterested(activity, currentUser) {
  // 'event' is the event object containing info such as eventCreatorId, eventTitle, etc.
  // 'currentUser' is the user who just clicked "I'm Interested"

  console.log("recipientId: ", activity.posterUid);
  console.log("senderId: ", currentUser.uid);
  console.log("senderName: ", currentUser.name);
  console.log("senderPhotoURL: ", currentUser.photoURL);
  console.log("eventTitle: ", activity.title);
  console.log("createdAt: ", Date.now());

  await addDoc(collection(db, "notifications"), {
    recipientId: activity.posterUid,
    senderId: currentUser.uid,
    senderName: currentUser.name,
    senderPhotoURL: currentUser.photoURL,
    eventTitle: activity.title,
    createdAt: Date.now(),
    read: false,
    type: "INTERESTED",
  });
}
