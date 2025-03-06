import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useChatMessages, sendMessage } from "@/hooks/firebase";
import { useAuthState } from "@/hooks/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send } from "lucide-react";
import { getDatabase, ref, get } from "firebase/database";

const ChatPage = () => {
  const navigate = useNavigate();

  const { chatId } = useParams();
  const [user, loading] = useAuthState();

  const messages = useChatMessages(chatId);
  const [newMessage, setNewMessage] = useState("");

  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    if (!chatId || !user?.uid) return;

    const fetchRecipientInfo = async () => {
      const db = getDatabase();
      const chatRef = ref(db, `chats/${chatId}`);
      const chatSnapshot = await get(chatRef);

      if (chatSnapshot.exists()) {
        const chatData = chatSnapshot.val();
        const recipientId = Object.keys(chatData.users).find(
          (uid) => uid !== user.uid,
        );

        if (recipientId) {
          const recipientRef = ref(db, `users/${recipientId}`);
          const recipientSnapshot = await get(recipientRef);

          if (recipientSnapshot.exists()) {
            setRecipient(recipientSnapshot.val());
          }
        }
      }
    };
    fetchRecipientInfo();
  }, [chatId, user]);

  if (loading || !recipient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await sendMessage(chatId, user.uid, newMessage);
    setNewMessage("");
  };

  const name = recipient?.name || "Unknown";

  return (
    <div className="flex flex-col h-screen">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-6 h-6"
      />
      <div className="flex flex-col justify-center items-center p-4 border-b-2 border-gray-100 text-black text-center text-lg font-semibold">
        <Avatar className="w-16 h-16">
          <AvatarImage src={recipient?.photoURL} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        {name}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-80 w-fit p-1 my-2 px-4 pt-2 rounded-3xl text-[18px] ${
              msg.sender === user.uid
                ? "rounded-br-none bg-gray-100 text-black justify-self-end"
                : "rounded-bl-none bg-orange-500 text-white justify-self-start"
            }`}
          >
            {msg.text}
            <div className="justify-end text-[10px] pl-4 pr-4 self-end">
              {new Date(msg.timestamp).toLocaleTimeString("en-US")}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t-2 border-gray-100 flex">
        <input
          className="flex-1 p-2 text-orange-500 rounded-md"
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="ml-2 text-orange-500 px-2 py-2 rounded-md"
        >
          <Send className="rotate-z-45" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
