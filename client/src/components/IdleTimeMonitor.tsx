import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockData = [
  {
    name: "WH_ANALYTICS",
    lastQuery: "2025-08-09 09:05",
    lastResume: "2025-08-09 09:00",
    lastSuspend: "2025-08-09 09:30",
    state: "POTENTIALLY_SUSPENDED",
    status: "ACTIVE",
  },
  {
    name: "WH_ETL",
    lastQuery: "2025-08-09 07:00",
    lastResume: "2025-08-09 06:55",
    lastSuspend: null,
    state: "POTENTIALLY_RUNNING",
    status: "IDLE (>30m)",
  },
  {
    name: "WH_STAGING",
    lastQuery: null,
    lastResume: "2025-08-01 10:00",
    lastSuspend: "2025-08-01 10:30",
    state: "POTENTIALLY_SUSPENDED",
    status: "NO_QUERIES",
  },
  {
    name: "WH_ADHOC",
    lastQuery: "2025-08-09 08:00",
    lastResume: "2025-08-09 07:55",
    lastSuspend: "2025-08-09 08:30",
    state: "POTENTIALLY_SUSPENDED",
    status: "IDLE (>30m)",
  },
  {
    name: "WH_DEV",
    lastQuery: "2025-08-09 09:25",
    lastResume: "2025-08-09 09:20",
    lastSuspend: null,
    state: "POTENTIALLY_RUNNING",
    status: "ACTIVE",
  },
];

export default function IdleTimeMonitor({ timeWindow }: { timeWindow: string }) {
  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Idle Time Monitor</h3>
        <div className="text-sm text-slate-400">Window: last {timeWindow} days</div>
      </div> */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockData.map((wh) => (
          <Card
            key={wh.name}
          className="bg-black border border-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-white">
                {wh.name}
                <Badge
                  variant={
                    wh.status.includes("IDLE") || wh.status === "NO_QUERIES"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {wh.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-300">
              <p>
                <strong className="text-white">Last Query:</strong> {wh.lastQuery || "—"}
              </p>
              <p>
                <strong className="text-white">Last Resume:</strong> {wh.lastResume || "—"}
              </p>
              <p>
                <strong className="text-white">Last Suspend:</strong> {wh.lastSuspend || "—"}
              </p>
              <p>
                <strong className="text-white">State:</strong> {wh.state}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
