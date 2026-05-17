import { useState, useRef, useEffect, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useListMessageThreads,
  useGetMessageThread,
  useSendMessage,
} from "@workspace/api-client-react";
import { ArrowUp, Search, Plus, Phone, Video, Info, Camera, Mic } from "lucide-react";

export default function Messages() {
  const { data: threads, isLoading: isLoadingThreads } = useListMessageThreads();
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (threads && threads.length > 0 && selectedThreadId === null) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  const { data: messages, refetch } = useGetMessageThread(selectedThreadId || 0, {
    query: {
      enabled: !!selectedThreadId,
      queryKey: ["getMessageThread", selectedThreadId],
    },
  });
  const activeThread = threads?.find((t) => t.id === selectedThreadId) ?? null;

  const [message, setMessage] = useState("");
  const sendMessage = useSendMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredThreads = useMemo(() => {
    if (!threads) return [];
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        t.participantName?.toLowerCase().includes(q) ||
        t.lastMessage?.toLowerCase().includes(q),
    );
  }, [threads, query]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedThreadId) return;
    sendMessage.mutate(
      { threadId: selectedThreadId, data: { body: message.trim() } },
      {
        onSuccess: () => {
          setMessage("");
          refetch();
        },
      },
    );
  };

  // Group messages and detect last in run for tails
  const grouped = useMemo(() => {
    if (!messages) return [] as Array<NonNullable<typeof messages>[number] & { isLastInRun: boolean; showTime: boolean }>;
    const arr = messages;
    return arr.map((m, i) => {
      const next = i + 1 < arr.length ? arr[i + 1] : undefined;
      const prev = i > 0 ? arr[i - 1] : undefined;
      const isLastInRun = !next || next.fromMe !== m.fromMe;
      const showTime =
        !prev ||
        new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() >
          1000 * 60 * 30;
      return { ...m, isLastInRun, showTime };
    });
  }, [messages]);

  return (
    <AppShell>
      <div className="-m-4 md:-m-8 h-[calc(100vh-3.5rem-1px)] flex bg-white dark:bg-[#0a0a0a]">
        {/* Threads sidebar */}
        <aside className="w-[320px] shrink-0 border-r border-black/5 dark:border-white/5 bg-[#f6f6f6] dark:bg-[#1c1c1e] flex flex-col">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h2 className="text-[22px] font-bold tracking-tight text-[#1d1d1f] dark:text-white">
              Messages
            </h2>
            <button className="h-8 w-8 grid place-items-center rounded-full bg-black/5 dark:bg-white/10 text-[#0a84ff] hover:bg-black/10">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="pl-8 h-9 rounded-xl bg-black/5 dark:bg-white/10 border-0 focus-visible:ring-1 focus-visible:ring-[#0a84ff] text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-1.5 pb-3">
            {isLoadingThreads && (
              <div className="p-4 text-center text-sm text-muted-foreground">Loading…</div>
            )}
            {filteredThreads.map((thread) => {
              const active = selectedThreadId === thread.id;
              const initial = (thread.participantName || thread.subject || "?").charAt(0);
              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full text-left flex items-start gap-3 px-2.5 py-2 rounded-xl transition-colors ${
                    active
                      ? "bg-[#0a84ff] text-white"
                      : "hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarFallback
                      className={`text-sm font-semibold ${
                        active ? "bg-white text-[#0a84ff]" : "bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-white"
                      }`}
                    >
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`text-[14px] font-semibold truncate ${
                          active ? "text-white" : "text-[#1d1d1f] dark:text-white"
                        }`}
                      >
                        {thread.participantName || thread.subject}
                      </span>
                      <span
                        className={`text-[11px] whitespace-nowrap ${
                          active ? "text-white/80" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(thread.lastMessageAt).toLocaleDateString(undefined, {
                          month: "numeric",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p
                      className={`text-[13px] truncate mt-0.5 ${
                        active ? "text-white/85" : "text-muted-foreground"
                      }`}
                    >
                      {thread.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
            {!isLoadingThreads && filteredThreads.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No conversations.
              </div>
            )}
          </div>
        </aside>

        {/* Chat */}
        <section className="flex-1 flex flex-col bg-white dark:bg-[#0a0a0a]">
          {selectedThreadId && activeThread ? (
            <>
              {/* Conversation header */}
              <header className="h-14 px-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] text-white text-sm font-semibold">
                      {(activeThread.participantName || "A").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold truncate text-[#1d1d1f] dark:text-white">
                      {activeThread.participantName || activeThread.subject}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {activeThread.subject}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#0a84ff]">
                  <HeaderBtn><Phone className="h-[18px] w-[18px]" /></HeaderBtn>
                  <HeaderBtn><Video className="h-[18px] w-[18px]" /></HeaderBtn>
                  <HeaderBtn><Info className="h-[18px] w-[18px]" /></HeaderBtn>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-0.5">
                {grouped.map((msg) => (
                  <div key={msg.id} className={msg.showTime ? "pt-4" : ""}>
                    {msg.showTime && (
                      <div className="text-center text-[11px] text-muted-foreground py-2">
                        {new Date(msg.createdAt).toLocaleString(undefined, {
                          weekday: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                    <div
                      className={`flex ${
                        msg.fromMe ? "justify-end" : "justify-start"
                      } ${msg.isLastInRun ? "mb-2" : "mb-0.5"}`}
                    >
                      <div
                        className={`relative max-w-[68%] px-3.5 py-2 text-[15px] leading-snug whitespace-pre-wrap break-words ${
                          msg.fromMe
                            ? "bg-gradient-to-br from-[#0a84ff] to-[#0066d6] text-white rounded-[20px]"
                            : "bg-[#e9e9eb] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white rounded-[20px]"
                        } ${msg.isLastInRun ? (msg.fromMe ? "rounded-br-[6px]" : "rounded-bl-[6px]") : ""}`}
                      >
                        {msg.body}
                      </div>
                    </div>
                    {msg.isLastInRun && (
                      <div
                        className={`text-[10px] text-muted-foreground ${
                          msg.fromMe ? "text-right pr-2" : "text-left pl-2"
                        }`}
                      >
                        {msg.fromMe ? "Delivered" : ""}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Composer */}
              <form
                onSubmit={handleSend}
                className="px-3 py-3 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl"
              >
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    className="h-9 w-9 grid place-items-center rounded-full bg-black/5 dark:bg-white/10 text-[#0a84ff]"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <div className="flex-1 flex items-end rounded-[20px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 pl-3 pr-1 py-1">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="iMessage"
                      className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-[15px] px-0"
                      disabled={sendMessage.isPending}
                    />
                    {message.trim() ? (
                      <Button
                        type="submit"
                        size="icon"
                        disabled={sendMessage.isPending}
                        className="h-8 w-8 rounded-full bg-[#0a84ff] hover:bg-[#0a84ff]/90"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    ) : (
                      <button
                        type="button"
                        className="h-8 w-8 grid place-items-center rounded-full text-[#0a84ff]"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] grid place-items-center text-white">
                <ArrowUp className="h-6 w-6" />
              </div>
              <div className="text-sm">Select a conversation</div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function HeaderBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#0a84ff]">
      {children}
    </button>
  );
}
