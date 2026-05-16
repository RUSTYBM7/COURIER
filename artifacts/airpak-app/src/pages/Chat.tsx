import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Msg { id: string; from: "me" | "ai"; text: string; at: string; }

const INITIAL: Msg[] = [
  { id: "1", from: "ai", text: "Hi, I'm the Airpak Concierge. Ask me anything about your shipments.", at: new Date().toISOString() },
];

const REPLIES = [
  "Got it — checking your latest shipment now.",
  "Your parcel is scheduled to arrive tomorrow before 12:00.",
  "I can reschedule the pickup. What time works?",
  "I've created a support ticket for that. Reference: AE-SUP-2389.",
];

export default function Chat() {
  const [msgs, setMsgs] = React.useState<Msg[]>(INITIAL);
  const [text, setText] = React.useState("");
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = String(Date.now());
    setMsgs((m) => [...m, { id, from: "me", text: trimmed, at: new Date().toISOString() }]);
    setText("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: id + "-r",
          from: "ai",
          text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
          at: new Date().toISOString(),
        },
      ]);
      toast.success("Concierge replied");
    }, 800);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
        <div className="flex items-center gap-3 pb-4 border-b">
          <Avatar><AvatarFallback className="bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></AvatarFallback></Avatar>
          <div>
            <p className="font-semibold">Airpak Concierge</p>
            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">Online</Badge>
          </div>
        </div>

        <ScrollArea className="flex-1 py-4">
          <div className="space-y-3 pr-2">
            {msgs.map((m) => (
              <div key={m.id} className={"flex " + (m.from === "me" ? "justify-end" : "justify-start")}>
                <Card className={"max-w-[80%] px-3 py-2 text-sm " + (m.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  <p>{m.text}</p>
                  <p className={"text-[10px] mt-1 " + (m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </Card>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <div className="border-t pt-3">
          <form
            className="flex gap-2"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
            <Button type="submit"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
