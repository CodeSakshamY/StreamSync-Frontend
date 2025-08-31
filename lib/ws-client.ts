type Message =
  | { type: "play"; at: number; sender?: string }
  | { type: "pause"; at: number; sender?: string }
  | { type: "seek"; to: number; sender?: string }
  | { type: "state"; playing: boolean; at: number; sender?: string }
  | { type: "chat"; text: string; user: string; ts: number; sender?: string }

type Handler = (msg: Message) => void

export class SyncChannel {
  private ws?: WebSocket
  private bc?: BroadcastChannel
  private handler: Handler
  private id: string
  private url?: string

  constructor(roomId: string, handler: Handler) {
    this.handler = handler
    this.id = Math.random().toString(36).slice(2)
    this.url = process.env.NEXT_PUBLIC_WS_URL

    if (typeof window === "undefined") return

    if (this.url) {
      try {
        const wsUrl = `${this.url.replace(/\/$/, "")}/rooms/${encodeURIComponent(roomId)}`
        this.ws = new WebSocket(wsUrl)
        this.ws.onmessage = (e) => {
          const data = JSON.parse(e.data)
          if (data.sender === this.id) return
          this.handler(data)
        }
      } catch {
        this.setupBroadcast(roomId)
      }
    } else {
      this.setupBroadcast(roomId)
    }
  }

  private setupBroadcast(roomId: string) {
    this.bc = new BroadcastChannel(`wp_room_${roomId}`)
    this.bc.onmessage = (e) => {
      const data = e.data as Message
      if ((data as any).sender === this.id) return
      this.handler(data)
    }
  }

  send(msg: Omit<Message, "sender">) {
    const message: Message = { ...(msg as any), sender: this.id }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else if (this.bc) {
      this.bc.postMessage(message)
    }
  }

  close() {
    try {
      this.ws?.close()
    } catch {}
    try {
      this.bc?.close()
    } catch {}
  }
}
