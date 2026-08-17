import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  createCustomerMessage,
  getRequestMessages,
  type Message,
} from "../services/messageService";

interface RequestDetails {
  id: string;
  reference: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high";
  status:
    | "open"
    | "in_progress"
    | "waiting_for_customer"
    | "resolved"
    | "closed";
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [error, setError] = useState("");
  const [messagesError, setMessagesError] = useState("");

  const [messageContent, setMessageContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendMessageError, setSendMessageError] = useState("");
  const [sendMessageSuccess, setSendMessageSuccess] = useState("");

  useEffect(() => {
    const loadRequest = async () => {
      if (!id) {
        setError("Request not found or you don't have permission to view it.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("requests")
          .select(
            "id, reference, description, category, urgency, status, created_at, updated_at, resolved_at",
          )
          .eq("id", id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        setRequest(data);
      } catch {
        setError("Request not found or you don't have permission to view it.");
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [id]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!id) {
        return;
      }

      try {
        setMessagesLoading(true);
        setMessagesError("");

        const { data, error } = await getRequestMessages(id);

        if (error) {
          throw new Error(error.message);
        }

        setMessages(data ?? []);
      } catch {
        setMessagesError("Failed to load the conversation.");
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [id]);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !messageContent.trim()) {
      return;
    }

    try {
      setSendingMessage(true);
      setSendMessageError("");
      setSendMessageSuccess("");

      const { error } = await createCustomerMessage(id, messageContent.trim());

      if (error) {
        throw new Error(error.message);
      }

      setMessageContent("");
      setSendMessageSuccess("Message sent successfully.");

      const { data, error: messagesError } = await getRequestMessages(id);

      if (messagesError) {
        throw new Error(messagesError.message);
      }

      setMessages(data ?? []);
    } catch (error) {
      setSendMessageError(
        error instanceof Error ? error.message : "Failed to send message.",
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const getCustomerStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "New";

      case "in_progress":
        return "Being handled";

      case "waiting_for_customer":
        return "Waiting for your response";

      case "resolved":
        return "Resolved";

      case "closed":
        return "Completed";

      default:
        return status;
    }
  };

  if (loading) {
    return <p>Loading request...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <p>Request not found or you don't have permission to view it.</p>
        <Link to="/requests">Back to Requests</Link>
      </div>
    );
  }

  if (!request) {
    return (
      <div>
        <p>Request not found.</p>
        <Link to="/requests">Back to Requests</Link>
      </div>
    );
  }

  return (
    <section>
      <Link to="/requests">← Back to Requests</Link>

      <h1>{request.reference}</h1>

      <p>{request.description}</p>

      <p>Category: {request.category}</p>

      <p>Urgency: {request.urgency}</p>

      <p>Status: {getCustomerStatusLabel(request.status)}</p>

      <p>Created: {request.created_at}</p>

      <p>Last updated: {request.updated_at}</p>

      {request.resolved_at && <p>Resolved: {request.resolved_at}</p>}

      <hr />

      <h2>Conversation</h2>

      {messagesLoading && <p>Loading conversation...</p>}

      {messagesError && <p>{messagesError}</p>}

      {!messagesLoading && !messagesError && messages.length === 0 && (
        <p>No messages yet.</p>
      )}

      {!messagesLoading && !messagesError && messages.length > 0 && (
        <div>
          {messages.map((message) => (
            <article key={message.id}>
              <p>{message.content}</p>
              <small>{message.created_at}</small>
            </article>
          ))}
        </div>
      )}

      <h2>Add Information</h2>

      <form onSubmit={handleSendMessage}>
        <div>
          <label htmlFor="message">Message</label>

          <textarea
            id="message"
            value={messageContent}
            onChange={(event) => setMessageContent(event.target.value)}
            placeholder="Add more information about your request..."
            required
          />
        </div>

        {sendMessageError && <p>{sendMessageError}</p>}

        {sendMessageSuccess && <p>{sendMessageSuccess}</p>}

        <button
          type="submit"
          disabled={sendingMessage || !messageContent.trim()}
        >
          {sendingMessage ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
