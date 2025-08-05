import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Header() {
  return (
    <header className="px-6 py-4" style={{ backgroundColor: "var(--slate-900)", borderBottom: "1px solid var(--slate-800)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Snowflake Observability Dashboard</h2>
          <p className="text-sm" style={{ color: "var(--slate-400)" }}>Monitor users, queries, and resource consumption</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--slate-800)" }}>
            <Calendar className="text-slate-400" size={16} />
            <Select defaultValue="7days" data-testid="date-range-select">
              <SelectTrigger className="border-none bg-transparent text-sm text-slate-300 p-0 h-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="15days">Last 15 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--blue-600)" }}
            data-testid="export-report-button"
          >
            <Download className="mr-2" size={16} />
            Export Report
          </Button>
        </div>
      </div>
    </header>
  );
}
