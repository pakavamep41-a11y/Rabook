import { ChatMessage } from "../types";

class MockSocket {
  private handlers: Record<string, Function[]> = {};

  on(event: string, handler: Function) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
  }

  off(event: string, handler: Function) {
    if (!this.handlers[event]) return;
    this.handlers[event] = this.handlers[event].filter(h => h !== handler);
  }

  emit(event: string, data: any, callback?: Function) {
    if (event === "join_room") {
      console.log("Joined room", data);
    }
    else if (event === "send_message") {
      const msg: ChatMessage = data;
      // Assign fake ID and date
      const finalMsg = { ...msg, id: Math.random().toString(36).substring(7), createdAt: new Date().toISOString() };
      
      // Acknowledge sent
      if (callback) callback(finalMsg);

      // Trigger "new_message" broadcast for the room
      setTimeout(() => {
        this.trigger("new_message", finalMsg);
        
        // Auto-reply simulation if customer sends text
        if (msg.senderRole === "customer" && msg.type === "text") {
          setTimeout(() => {
            this.trigger("new_message", {
              id: Math.random().toString(36).substring(7),
              type: "text",
              content: "پیام شما دریافت شد. در اسرع وقت پاسخ داده می‌شود.",
              senderId: "admin_1",
              senderName: "پشتیبانی انتشارات رابوک",
              senderRole: "admin",
              sessionId: msg.sessionId,
              createdAt: new Date().toISOString(),
              seen: false
            });
          }, 3000);
        }
      }, 500);
    }
  }

  trigger(event: string, data: any) {
    if (this.handlers[event]) {
      this.handlers[event].forEach(h => h(data));
    }
  }

  connect() {
    console.log("Mock socket connected");
  }

  disconnect() {
    console.log("Mock socket disconnected");
  }
}

export const socket = new MockSocket();
