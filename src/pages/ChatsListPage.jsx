import { useAuthState } from "@/hooks/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, onValue, get, update, getDatabase } from "firebase/database";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatsListPage = () => {
  const [user, loading] = useAuthState();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const db = getDatabase();
    const chatsRef = ref(db, "chats");

    const unsubscribe = onValue(chatsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        const userChatList = await Promise.all(
          Object.entries(chatData)
            .filter(([_, chat]) => chat.users?.[user.uid])
            .map(async ([chatId, chat]) => {
              const participantId = Object.keys(chat.users).find(
                (uid) => uid !== user.uid,
              );

              let participantInfo = { name: "Unknown", photoURL: "" };
              if (participantId) {
                const participantRef = ref(db, `users/${participantId}`);
                const participantSnapshot = await get(participantRef);
                if (participantSnapshot.exists()) {
                  participantInfo = participantSnapshot.val();
                }
              }

              const messages = chat.messages
                ? Object.values(chat.messages)
                : [];
              const lastMessage =
                messages.length > 0 ? messages[messages.length - 1] : null;

              const unreadCount = messages.filter(
                (msg) => msg.sender !== user.uid && msg.read === false,
              ).length;

              return {
                id: chatId,
                participant: participantInfo,
                latestMessage: lastMessage?.text || "No messages yet",
                lastMessageTime: lastMessage?.timestamp
                  ? new Date(lastMessage.timestamp).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      },
                    )
                  : null,
                unreadCount,
              };
            }),
        );

        setChats(userChatList);
      } else {
        setChats([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  if (!user || loading) return <p>Loading...</p>;

  const handleChatClick = async (chatId) => {
    const db = getDatabase();
    const messagesRef = ref(db, `chats/${chatId}/messages`);

    const snapshot = await get(messagesRef);
    if (snapshot.exists()) {
      const updates = {};
      snapshot.forEach((childSnapshot) => {
        const messageKey = childSnapshot.key;
        const messageData = childSnapshot.val();
        if (messageData.sender !== user.uid && messageData.read === false) {
          updates[`/chats/${chatId}/messages/${messageKey}/read`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
    }

    navigate(`/chat/${chatId}`);
  };

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
            className="flex flex-row justify-between my-2 p-2 cursor-pointer hover:bg-gray-200 transition"
            onClick={() => handleChatClick(chat.id)}
          >
            <div className="flex flex-row items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={chat.participant.photoURL}
                  alt={chat.participant.name}
                />
                <AvatarFallback>
                  {chat.participant.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 flex flex-col">
                <p className="font-semibold">{chat.participant.name}</p>
                <p className="max-w-50 truncate overflow-hidden text-ellipsis">
                  {chat.latestMessage}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center">
              <p>{chat.lastMessageTime}</p>
              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 rounded-full bg-orange-400 justify-center text-center text-[12px] text-white font-semibold">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatsListPage;
