import { useUserChats } from "@/hooks/firebase";
import { useAuthState } from "@/hooks/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, onValue, getDatabase } from "firebase/database";
import { ArrowLeft } from "lucide-react";

const ChatsListPage = () => {
  const [user] = useAuthState();
  const navigate = useNavigate();
  const userChats = useUserChats(user?.uid);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const db = getDatabase();
    const chatsRef = ref(db, "chats");

    const unsubscribe = onValue(chatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();

        const userChatList = Object.entries(chatData)
          .filter(([chatId, chat]) => chat.users?.[user.uid])
          .map(([chatId, chat]) => ({
            id: chatId,
            participant: Object.keys(chat.users).filter(
              (uid) => uid !== user.uid,
            ), // other user
            latestMessage: chat.messages
              ? Object.values(chat.messages).pop()?.text
              : "No messages yet",
          }));

        setChats(userChatList);
      } else {
        setChats([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex flex-row justify-start items-center gap-4 pl-2 pt-4 pb-4">
        <ArrowLeft onClick={() => navigate(-1)} />
        <h1 className="text-xl font-bold">Chats</h1>
      </div>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="my-2 p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition"
            onClick={() => navigate(`/chat/${chat.id}`)}
          >
            <p className="font-semibold">Chat with: {chat.participant}</p>
            <p className="text-sm text-gray-600">
              Latest: {chat.latestMessage}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatsListPage;
