import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useListMessageThreads, useGetMessageThread, useSendMessage } from "@workspace/api-client-react";
import { Send, User } from "lucide-react";

export default function Messages() {
  const { data: threads, isLoading: isLoadingThreads } = useListMessageThreads();
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  
  // Set first thread as selected automatically
  useEffect(() => {
    if (threads && threads.length > 0 && !selectedThreadId) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  const { data: messages, refetch } = useGetMessageThread(selectedThreadId || 0, {
    query: {
      enabled: !!selectedThreadId,
      queryKey: ["getMessageThread", selectedThreadId]
    }
  });
  const activeThread = threads?.find((t) => t.id === selectedThreadId) ?? null;

  const [message, setMessage] = useState("");
  const sendMessage = useSendMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedThreadId) return;

    sendMessage.mutate(
      { threadId: selectedThreadId, data: { body: message.trim() } },
      {
        onSuccess: () => {
          setMessage("");
          refetch();
        }
      }
    );
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-140px)] flex border rounded-2xl overflow-hidden bg-card shadow-sm">
        {/* Thread List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Support Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoadingThreads && <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>}
            {threads?.map(thread => (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full text-left p-4 border-b transition-colors hover:bg-muted/50 ${selectedThreadId === thread.id ? 'bg-primary/5' : ''}`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium truncate">{thread.subject}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {new Date(thread.lastMessageAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
              </button>
            ))}
            {!isLoadingThreads && threads?.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No message threads found.</div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col bg-muted/10">
          {selectedThreadId && activeThread && messages ? (
            <>
              <div className="p-4 border-b bg-card">
                <h3 className="font-semibold">{activeThread.subject}</h3>
                <p className="text-sm text-muted-foreground">{activeThread.participantName}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[70%] ${msg.fromMe ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className={`rounded-2xl px-4 py-2 ${msg.fromMe ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                        <p className="text-sm">{msg.body}</p>
                        <p className={`text-[10px] mt-1 ${msg.fromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 bg-card border-t">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full"
                    disabled={sendMessage.isPending}
                  />
                  <Button type="submit" size="icon" className="rounded-full" disabled={!message.trim() || sendMessage.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a thread to view messages
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
