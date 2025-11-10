"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Copy } from "lucide-react"
import { useState } from "react"

export function RequestDetail({ requestId, onClose }: { requestId: string; onClose: () => void }) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Request Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Request Line */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">REQUEST LINE</p>
          <Card className="bg-background/50 border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-sm">
                <Badge variant="outline" className="font-mono text-xs mr-2">
                  GET
                </Badge>
                /api/users/123
              </p>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard("GET /api/users/123", "method")}>
                <Copy size={14} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Response Status */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">RESPONSE</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status Code</span>
              <Badge className="bg-green-500/20 text-green-400">200 OK</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Response Time</span>
              <span className="font-semibold">145ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Response Size</span>
              <span className="font-semibold">12.5KB</span>
            </div>
          </div>
        </div>

        {/* Headers */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">REQUEST HEADERS</p>
          <Card className="bg-background/50 border-border p-3 text-xs font-mono space-y-1">
            {[
              "Host: api.example.com",
              "User-Agent: Mozilla/5.0 (Windows NT 10.0)",
              "Accept: application/json",
              "Authorization: Bearer token_xxxx",
              "Content-Type: application/json",
              "X-Request-ID: req_12345",
            ].map((header, i) => (
              <div key={i} className="text-muted-foreground truncate" title={header}>
                {header}
              </div>
            ))}
          </Card>
        </div>

        {/* Response Headers */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">RESPONSE HEADERS</p>
          <Card className="bg-background/50 border-border p-3 text-xs font-mono space-y-1">
            {[
              "Server: nginx/1.19.0",
              "Content-Type: application/json",
              "Content-Length: 12824",
              "Cache-Control: public, max-age=3600",
              "X-Response-Time: 145ms",
              "Vary: Accept-Encoding",
            ].map((header, i) => (
              <div key={i} className="text-muted-foreground truncate" title={header}>
                {header}
              </div>
            ))}
          </Card>
        </div>

        {/* Response Body */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">RESPONSE BODY</p>
          <Card className="bg-background/50 border-border p-3 text-xs font-mono max-h-40 overflow-auto">
            <pre className="text-muted-foreground">{`{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z",
  "last_login": "2024-11-10T14:32:00Z"
}`}</pre>
          </Card>
        </div>

        {/* Timing Breakdown */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">TIMING BREAKDOWN</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>DNS Lookup</span>
              <span className="text-right">2ms</span>
            </div>
            <div className="flex justify-between">
              <span>TCP Connection</span>
              <span className="text-right">5ms</span>
            </div>
            <div className="flex justify-between">
              <span>TLS Handshake</span>
              <span className="text-right">15ms</span>
            </div>
            <div className="flex justify-between">
              <span>Request Send</span>
              <span className="text-right">3ms</span>
            </div>
            <div className="flex justify-between">
              <span>Wait (TTFB)</span>
              <span className="text-right">112ms</span>
            </div>
            <div className="flex justify-between">
              <span>Response Download</span>
              <span className="text-right">8ms</span>
            </div>
            <div className="border-t border-border/50 pt-2 mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>145ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
