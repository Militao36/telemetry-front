"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { formatNsToMsOrSeconds } from "@/lib/utils";

export function RequestDetail({
  requestId,
  onClose,
}: {
  requestId: string;
  onClose: () => void;
}) {
  const [requestDetails, setRequestDetails] = useState<{
    traceId: string;
    spanId: string;
    parentSpanId: string;
    serviceName: string;
    serviceVersion: string;
    serviceEnvironment: string;
    kind: string;
    name: string;
    startTime: string;
    endTime: string;
    durationNs: string;
    httpUrl: string;
    httpMethod: string;
    httpTarget: string;
    httpStatus: string;
    attributes: Array<{ key: string; value: { stringValue?: string; intValue?: number } }>;
    ingestionTime: string;
    typeTrace: string;
  }>({} as any);

  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  const openTraceLogs = () => {
    if (!requestDetails.traceId) return;
    window.location.href = `/logs?traceId=${encodeURIComponent(requestDetails.traceId)}`;
  };

  async function fetchRequestDetails(id: string) {
    const response = await api.get(`/traces/${id}`);

    const data = response.data[0]

    setRequestDetails({
      traceId: data.traceId,
      spanId: data.spanId,
      parentSpanId: data.parentSpanId,
      serviceName: data.serviceName,
      serviceVersion: data.serviceVersion,
      serviceEnvironment: data.serviceEnvironment,
      kind: data.kind,
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      durationNs: data.durationNs,
      httpUrl: data.httpUrl,
      httpMethod: data.httpMethod,
      httpTarget: data.httpTarget,
      httpStatus: data.httpStatus,
      attributes: JSON.parse(data.attributes || "[]"),
      ingestionTime: data.ingestionTime,
      typeTrace: data.typeTrace,
    })
  }

  useEffect(() => {
    if (requestId)
      fetchRequestDetails(requestId)
  }, [requestId])

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Request Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            REQUEST LINE
          </p>
          <Card className="bg-background/50 border-border p-3 overflow-auto">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-sm">
                <Badge variant="outline" className="font-mono text-xs mr-2">
                  {requestDetails.httpMethod || "UNKNOWN"}
                </Badge>
                {requestDetails.httpUrl || ""}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(requestDetails.httpMethod + " " + requestDetails.httpUrl, "method")}
              >
                <Copy size={14} />
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            TRACE
          </p>
          <Card className="bg-background/50 border-border p-3 space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Trace ID</span>
                <div className="flex items-center gap-1">
                  {requestDetails.traceId && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => copyToClipboard(requestDetails.traceId, "traceId")}
                      >
                        <Copy size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs cursor-pointer"
                        onClick={openTraceLogs}
                      >
                        Ver trace completo
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <p className="break-all font-mono text-xs text-foreground">{requestDetails.traceId || "-"}</p>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Span ID</span>
                {requestDetails.spanId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => copyToClipboard(requestDetails.spanId, "spanId")}
                  >
                    <Copy size={14} />
                  </Button>
                )}
              </div>
              <p className="break-all font-mono text-xs text-foreground">{requestDetails.spanId || "-"}</p>
            </div>
          </Card>
        </div>

        {/* Response Status */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            RESPONSE
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status Code</span>
              <Badge className="bg-green-500/20 text-green-400">{requestDetails.httpStatus || "UNKNOWN"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Request Time</span>
              <span className="font-semibold">{formatNsToMsOrSeconds(+requestDetails.durationNs)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Request Size</span>
              <span className="font-semibold">{requestDetails?.attributes?.find(attr => attr.key === "http.request_content_length_uncompressed")?.value.intValue || "UNKNOWN"}</span>
            </div>
          </div>
        </div>

        {/* Headers */}
        {/* <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            REQUEST HEADERS
          </p>
          <Card className="bg-background/50 border-border p-3 text-xs font-mono space-y-1">
            {[
              "Host: api.example.com",
              "User-Agent: Mozilla/5.0 (Windows NT 10.0)",
              "Accept: application/json",
              "Authorization: Bearer <token>",
              "Content-Type: application/json",
              "X-Request-ID: req_12345",
            ].map((header, i) => (
              <div
                key={i}
                className="text-muted-foreground truncate"
                title={header}
              >
                {header}
              </div>
            ))}
          </Card>
        </div> */}

        {/* Response Headers */}
        {/* <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            RESPONSE HEADERS
          </p>
          <Card className="bg-background/50 border-border p-3 text-xs font-mono space-y-1">
            {[
              "Server: nginx/1.19.0",
              "Content-Type: application/json",
              "Content-Length: 12824",
              "Cache-Control: public, max-age=3600",
              "X-Response-Time: 145ms",
              "Vary: Accept-Encoding",
            ].map((header, i) => (
              <div
                key={i}
                className="text-muted-foreground truncate"
                title={header}
              >
                {header}
              </div>
            ))}
          </Card>
        </div> */}

        {/* Response Body */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            RESPONSE BODY
          </p>
          <Card className="bg-background/50 border-border p-3 text-xs font-mono max-h-40 overflow-auto">
            <pre className="text-muted-foreground">{
              requestDetails?.attributes?.find(attr => attr.key === "http.response_body")?.value?.stringValue ||
              requestDetails?.attributes?.find(e => e.key === 'status_text')?.value?.stringValue ||
              "No response body available"
            }</pre>
          </Card>
        </div>

        {/* Timing Breakdown */}
        {/* <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3">
            TIMING BREAKDOWN
          </p>
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
        </div> */}
      </div>
    </div>
  );
}
