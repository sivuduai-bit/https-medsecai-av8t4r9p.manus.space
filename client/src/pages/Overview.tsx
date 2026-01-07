import { 
  Shield, 
  Activity, 
  Server, 
  AlertTriangle, 
  CheckCircle2, 
  Lock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

// Mock Data
const trafficData = [
  { time: "00:00", inbound: 400, outbound: 240 },
  { time: "04:00", inbound: 300, outbound: 139 },
  { time: "08:00", inbound: 200, outbound: 980 },
  { time: "12:00", inbound: 278, outbound: 390 },
  { time: "16:00", inbound: 189, outbound: 480 },
  { time: "20:00", inbound: 239, outbound: 380 },
  { time: "24:00", inbound: 349, outbound: 430 },
];

const segmentHealthData = [
  { name: "Admin", value: 98, color: "var(--chart-1)" },
  { name: "Critical", value: 100, color: "var(--chart-2)" },
  { name: "Imaging", value: 95, color: "var(--chart-3)" },
  { name: "Lab", value: 92, color: "var(--chart-4)" },
];

export default function Overview() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring of network segmentation status and security metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Activity className="w-4 h-4" />
            Live View
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Security Score" 
          value="98/100" 
          change="+2.4%" 
          trend="up"
          icon={Shield}
          color="text-emerald-500"
        />
        <MetricCard 
          title="Active Segments" 
          value="3" 
          subtext="100% Operational"
          icon={Network}
          color="text-blue-500"
        />
        <MetricCard 
          title="Connected Devices" 
          value="12" 
          change="+1 New" 
          trend="up"
          icon={Server}
          color="text-purple-500"
        />
        <MetricCard 
          title="Active Alerts" 
          value="0" 
          subtext="System Healthy"
          icon={CheckCircle2}
          color="text-green-500"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Traffic Chart */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Network Traffic Analysis</CardTitle>
            <CardDescription>Real-time inbound vs outbound traffic across all segments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}MB`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
                    itemStyle={{ color: 'var(--popover-foreground)' }}
                  />
                  <Area type="monotone" dataKey="inbound" stroke="var(--chart-1)" strokeWidth={2} fillOpacity={1} fill="url(#colorInbound)" />
                  <Area type="monotone" dataKey="outbound" stroke="var(--chart-2)" strokeWidth={2} fillOpacity={1} fill="url(#colorOutbound)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Segment Health Status */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Segment Health</CardTitle>
            <CardDescription>Operational status by zone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {segmentHealthData.map((segment, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{segment.name} Network</span>
                  <span className="text-muted-foreground">{segment.value}%</span>
                </div>
                <Progress value={segment.value} className="h-2" style={{ "--progress-background": segment.color } as React.CSSProperties} />
              </div>
            ))}
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Compliance Status</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Compliant</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center">
                  <Lock className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Encryption</span>
                  <span className="text-sm font-bold">AES-256</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center">
                  <Shield className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Firewall</span>
                  <span className="text-sm font-bold">Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Log */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Latest system activities and security alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "10:42 AM", event: "New device detected in Imaging Network", type: "info", source: "Device Discovery" },
              { time: "09:15 AM", event: "Critical Care Network isolation verified", type: "success", source: "System Check" },
              { time: "08:30 AM", event: "Admin user login from 192.168.1.5", type: "info", source: "Auth Log" },
              { time: "03:45 AM", event: "Scheduled backup completed successfully", type: "success", source: "Backup Service" },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`mt-1 w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.event}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{log.source}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, change, trend, subtext, icon: Icon, color }: any) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg bg-background border border-border ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          {change && (
            <div className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {change}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

import { Network, FileText } from "lucide-react";
