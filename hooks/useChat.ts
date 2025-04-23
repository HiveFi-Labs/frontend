import { useCallback, useState } from "react";
import type { ChatMessage } from "@/types/strategy-development";

type UseChatResponse = {
  messages: ChatMessage[];
  error?: Error;
  postChat: (input: string) => Promise<void>;
  isLoading: boolean;
};

type UseChatProps = {
  onSuccess?: (messages: ChatMessage[]) => void;
  initialMessages?: ChatMessage[];
};

export default function useChat({
  onSuccess,
  initialMessages = [],
}: UseChatProps = {}): UseChatResponse {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const postChat = useCallback(
    async (input: string) => {
      setIsLoading(true);
      setError(undefined);

      // Add user message
      const userMessage: ChatMessage = {
        agent: "user",
        message: input,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      try {
        // Make the actual API request here
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        // Add AI response
        const aiMessage: ChatMessage = {
          agent: "strategist", // or get from response
          message: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          attachment: data.attachment,
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        
        if (onSuccess) {
          onSuccess(finalMessages);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An error occurred while sending chat");
        setError(error);
        console.error("Chat sending error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, onSuccess],
  );

  return { messages, error, postChat, isLoading };
} 