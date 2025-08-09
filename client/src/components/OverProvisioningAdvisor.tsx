import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, AlertTriangle, CheckCircle } from "lucide-react";

type OverProvRow = {
  name: string;
  currentSize: string;
  avgRunningRatio: number; // 0..1
  avgQueuedLoad: number; // 0..1
  recommendation: string;
};

/**
 * OverProvisioningAdvisor
 * Props:
 *  - timeWindow: "7" | "15" | "20" (string) — currently used only for the header label / future hook
 */
export default function OverProvisioningAdvisor({
  timeWindow,
}: {
  timeWindow: string;
}) {
  // Mock dataset (matches your provided values)
  const data: OverProvRow[] = [
    {
      name: "WH_STAGING",
      currentSize: "X-Small",
      avgRunningRatio: 0.03,
      avgQueuedLoad: 0.0,
      recommendation: "🔽 Downsizing by 2 steps (very low utilization)",
    },
    {
      name: "WH_ETL",
      currentSize: "Medium",
      avgRunningRatio: 0.12,
      avgQueuedLoad: 0.02,
      recommendation: "🔽 Downsizing by 1 step (low utilization)",
    },
    {
      name: "WH_ADHOC",
      currentSize: "Small",
      avgRunningRatio: 0.2,
      avgQueuedLoad: 0.18,
      recommendation:
        "⚠️ Investigate query queuing — consider upsizing or optimizing queries",
    },
    {
      name: "WH_ANALYTICS",
      currentSize: "Large",
      avgRunningRatio: 0.45,
      avgQueuedLoad: 0.05,
      recommendation: "✅ No immediate action suggested",
    },
    {
      name: "WH_DEV",
      currentSize: "UNKNOWN",
      avgRunningRatio: 0.28,
      avgQueuedLoad: 0.01,
      recommendation: "✅ No immediate action suggested",
    },
  ];

  // Visual helpers
  const sizePillClasses = (size: string) => {
    switch (size.toLowerCase()) {
      case "x-small":
        return "bg-emerald-100 text-emerald-800";
      case "small":
        return "bg-lime-100 text-lime-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "large":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const recIcon = (rec: string) => {
    if (rec.includes("Downsizing")) return <ArrowDown className="w-4 h-4" />;
    if (rec.includes("Investigate") || rec.includes("⚠️"))
      return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Over-Provisioning Advisor</h3>
        <div className="text-sm text-muted-foreground">Window: last {timeWindow} days</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((row) => (
          <Card
            key={row.name}
            className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-medium">{row.name}</CardTitle>
                  <div className="mt-1 text-xs text-gray-500">{row.currentSize}</div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${sizePillClasses(
                      row.currentSize
                    )}`}
                  >
                    {row.currentSize}
                  </span>
                  <Badge>{pct(row.avgRunningRatio)}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-3">
              {/* Running Ratio bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Avg running ratio</span>
                  <span>{pct(row.avgRunningRatio)}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    aria-hidden
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round(row.avgRunningRatio * 100))}%`,
                      background:
                        row.avgRunningRatio > 0.4
                          ? "linear-gradient(90deg,#ef4444,#f97316)"
                          : row.avgRunningRatio > 0.15
                          ? "linear-gradient(90deg,#f59e0b,#f97316)"
                          : "linear-gradient(90deg,#10b981,#34d399)",
                    }}
                  />
                </div>
              </div>

              {/* Queued load */}
              <div className="mb-3 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Avg queued load</div>
                  <div className="text-sm font-medium">{row.avgQueuedLoad.toFixed(2)}</div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{recIcon(row.recommendation)}</div>
                <div className="text-sm">
                  <div className="font-medium">{row.recommendation.replace(/^🔽|⚠️|✅\s*/g, "").trim()}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {row.recommendation.startsWith("🔽") ? "Low utilization detected" : ""}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
