import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  createCustomerMessage,
  getRequestMessages,
  type Message,
} from "../../services/messageService";
import styles from "./RequestDetailsPage.module.css";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

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
    return <LoadingSpinner message="Loading request..." fullScreen />;
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
    <main className={styles.requestDetails}>
      <Link className={styles.backLink} to="/requests">
        ← Back to Requests
      </Link>

      <header className={styles.requestHeader}>
        <div>
          <p className={styles.eyebrow}>Support Request</p>

          <h1>{request.reference}</h1>

          <p className={styles.description}>{request.description}</p>
        </div>

        <span className={styles.status}>
          {getCustomerStatusLabel(request.status)}
        </span>
      </header>

      <section className={styles.requestMeta} aria-label="Request details">
        <dl>
          <div>
            <dt>Category</dt>
            <dd>{request.category}</dd>
          </div>

          <div>
            <dt>Urgency</dt>
            <dd>{request.urgency}</dd>
          </div>

          <div>
            <dt>Status</dt>
            <dd>{getCustomerStatusLabel(request.status)}</dd>
          </div>

          <div>
            <dt>Created</dt>
            <dd>{new Date(request.created_at).toLocaleString()}</dd>
          </div>

          <div>
            <dt>Last Updated</dt>
            <dd>{new Date(request.updated_at).toLocaleString()}</dd>
          </div>

          {request.resolved_at && (
            <div>
              <dt>Resolved</dt>
              <dd>{new Date(request.resolved_at).toLocaleString()}</dd>
            </div>
          )}
        </dl>
      </section>

      <section
        className={styles.conversationSection}
        aria-labelledby="conversation-heading"
      >
        <header className={styles.sectionHeader}>
          <h2 id="conversation-heading">Conversation</h2>

          <p>Messages about your support request.</p>
        </header>

        {messagesLoading && (
          <div className={styles.stateMessage}>
            <LoadingSpinner message="Loading conversation..." />
          </div>
        )}

        {messagesError && (
          <div
            className={`${styles.stateMessage} ${styles.error}`}
            role="alert"
          >
            <p>{messagesError}</p>
          </div>
        )}

        {!messagesLoading && !messagesError && messages.length === 0 && (
          <div className={styles.stateMessage}>
            <p>No messages yet.</p>
          </div>
        )}

        {!messagesLoading && !messagesError && messages.length > 0 && (
          <div className={styles.messagesList}>
            {messages.map((message) => (
              <article className={styles.messageCard} key={message.id}>
                <p>{message.content}</p>

                <small>{new Date(message.created_at).toLocaleString()}</small>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        className={styles.messageSection}
        aria-labelledby="add-information-heading"
      >
        <header className={styles.sectionHeader}>
          <h2 id="add-information-heading">Add Information</h2>

          <p>Send additional information to the support team.</p>
        </header>

        <form className={styles.messageForm} onSubmit={handleSendMessage}>
          <div className={styles.field}>
            <label htmlFor="message">Message</label>

            <textarea
              id="message"
              value={messageContent}
              onChange={(event) => setMessageContent(event.target.value)}
              placeholder="Add more information about your request..."
              rows={5}
              required
            />
          </div>

          {sendMessageError && (
            <p className={styles.errorMessage} role="alert">
              {sendMessageError}
            </p>
          )}

          {sendMessageSuccess && (
            <p className={styles.successMessage} role="status">
              {sendMessageSuccess}
            </p>
          )}

          <button
            className={styles.sendButton}
            type="submit"
            disabled={sendingMessage || !messageContent.trim()}
          >
            {sendingMessage ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
}
