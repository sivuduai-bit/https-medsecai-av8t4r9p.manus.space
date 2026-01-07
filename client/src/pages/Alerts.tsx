import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Search, CheckCircle, AlertTriangle, XCircle, Clock, Filter, Volume2, VolumeX, Eye, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";

// Demo alerts data
const DEMO_ALERTS = [
  { id: 1, title: "Unauthorized access attempt detected", description: "Multiple failed login attempts from IP 192.168.1.100 on MRI Scanner #1", severity: "critical", device: "MRI Scanner #1", timestamp: "2024-12-15 14:32:15", status: "new", category: "intrusion" },
  { id: 2, title: "Critical vulnerability detected", description: "CVE-2024-1234 found on Patient Monitor #1 - Remote code execution risk", severity: "critical", device: "Patient Monitor #1", timestamp: "2024-12-15 13:45:22", status: "new", category: "vulnerability" },
  { id: 3, title: "SSL certificate expiring", description: "Certificate for Infusion Pump #1 web interface expires in 7 days", severity: "high", device: "Infusion Pump #1", timestamp: "2024-12-15 12:20:00", status: "acknowledged", category: "compliance" },
  { id: 4, title: "Firmware update available", description: "Security patch available for Ventilator #1 - Version 2.n.2", severity: "medium", device: "Ventilator #1", timestamp: "2024-12-15 11:15:30", status: "new", category: "update" },
  { id: 5, title: "Network anomaly detected", description: "Unusual outbound traffic pattern from CT Scanner #1", severity: "high", device: "CT Scanner #1", timestamp: "2024-12-15 10:45:00", status: "investigating", category: "network" },
  { id: 6, title: "Configuration drift detected", description: "Security settings changed on Lab Analyzer #1 without authorization", severity: "medium", device: "Lab Analyzer #1", timestamp: "2024-12-15 09:30:45", status: "acknowledged", category: "compliance" },
  { id: 7, title: "Device offline", description: "X-Ray Machine #1 has been offline for more than 30 minutes", severity: "low", device: "X-Ray Machine #1", timestamp: "2024-12-15 08:00:00", status: "resolved", category: "availability" },
  { id: 8, title: "Weak encryption detected", description: "TLS 1.0 still enabled on ECG Monitor #1", severity: "medium", device: "ECG Monitor #1", timestamp: "2024-12-14 16:20:00", status: "new", category: "vulnerability" },
  { id: 9, title: "Compliance check failed", description: "TGA Principle 4 (Cybersecurity) requirements not met for Defibrillator #1", severity: "high", device: "Defibrillator #1", timestamp: "2024-12-14 14:00:00", status: "acknowledged", category: "compliance" },
  { id: 10, title: "Suspicious file detected", description: "Unknown executable found in Ultrasound #1 system directory", severity: "critical", device: "Ultrasound #1", timestamp: "2024-12-14 11:30:00", status: "investigating", category: "malware" }
];

export default function Alerts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Alert stats
  const stats = useMemo(() => ({
    total: DEMO_ALERTS.length,
    critical: DEMO_ALERTS.filter(a => a.severity === 'critical').length,
    new: DEMO_ALERTS.filter(a => a.status === 'new').length,
    resolved: DEMO_ALERTS.filter(a => a.status === 'resolved').length
  }), []);

  // Alert trend chart
  const trendOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      textStyle: { color: '#e2e8f0' }
    },
    grid: { top: 20, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } }
    },
    series: [
      { name: 'Critical', type: 'bar', stack: 'total', data: [2, 1, 3, 2, 4, 1, 3], itemStyle: { color: '#ef4444' } },
      { name: 'High', type: 'bar', stack: 'total', data: [4, 3, 5, 4, 3, 2, 3], itemStyle: { color: '#f97316' } },
      { name: 'Medium', type: 'bar', stack: 'total', data: [6, 5, 4, 7, 5, 4, 2], itemStyle: { color: '#eab308' } },
      { name: 'Low', type: 'bar', stack: 'total', data: [3, 2, 2, 3, 2, 1, 1], itemStyle: { color: '#3b82f6' } }
    ]
  }), []);

  // Category distribution
  const categoryOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      textStyle: { color: '#e2e8f0' }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: DEMO_ALERTS.filter(a => a.category === 'vulnerability').length, name: 'Vulnerability', itemStyle: { color: '#ef4444' } },
        { value: DEMO_ALERTS.filter(a => a.category === 'compliance').length, name: 'Compliance', itemStyle: { color: '#22c55e' } },
        { value: DEMO_ALERTS.filter(a => a.category === 'intrusion').length, name: 'Intrusion', itemStyle: { color: '#f97316' } },
        { value: DEMO_ALERTS.filter(a => a.category === 'network').length, name: 'Network', itemStyle: { color: '#3b82f6' } },
        { value: DEMO_ALERTS.filter(a => a.category === 'malware').length, name: 'Malware', itemStyle: { color: '#a855f7' } },
        { value: DEMO_ALERTS.filter(a => a.category === 'update').length, name: 'Update', itemStyle: { color: '#06b6d4' } },
        { value: DEMO_ALERTS.filter(a => a.category === 'availability').length, name: 'Availability', itemStyle: { color: '#64748b' } }
      ],
      label: { color: '#94a3b8', fontSize: 11 },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  }), []);

  const filteredAlerts = DEMO_ALERTS.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.device.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus;
    const matchesCategory = filterCategory === "all" || alert.category === filterCategory;
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const getSeverityBadge = (severity: string) => {
    const config: Record<string, { class: string; icon: React.ReactNode }> = {
      critical: { class: "badge-critical", icon: <XCircle className="h-3 w-3" /> },
      high: { class: "badge-high", icon: <AlertTriangle className="h-3 w-3" /> },
      medium: { class: "badge-medium", icon: <Clock className="h-3 w-3" /> },
      low: { class: "badge-low", icon: <CheckCircle className="h-3 w-3" /> }
    };
    const { class: className, icon } = config[severity] || config.low;
    return (
      <Badge className={`${className} border flex items-center gap-1`}>
        {icon}
        {severity}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      new: "bg-red-500/20 text-red-400 border-red-500/30",
      acknowledged: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      investigating: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      resolved: "bg-green-500/20 text-green-400 border-green-500/30"
    };
    return <Badge className={`${config[status] || config.new} border`}>{status}</Badge>;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-7 w-7 text-primary" />
            Security Alerts
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time security monitoring and incident response
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            <span className="text-sm text-muted-foreground">Sound</span>
          </div>
          <Button variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Alerts", value: stats.total, icon: Bell, color: "text-foreground" },
          { label: "Critical", value: stats.critical, icon: XCircle, color: "text-red-500" },
          { label: "New", value: stats.new, icon: AlertTriangle, color: "text-yellow-500" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-green-500" }
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Alert Trend</CardTitle>
            <CardDescription>Weekly alert distribution by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={trendOptions} style={{ height: '250px' }} />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Alert Categories</CardTitle>
            <CardDescription>Distribution by alert type</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={categoryOptions} style={{ height: '250px' }} />
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Alert Queue</CardTitle>
              <CardDescription>Active security alerts requiring attention</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search alerts..." 
                  className="pl-9 w-64 bg-secondary border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32 bg-secondary border-border/50">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36 bg-secondary border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-36 bg-secondary border-border/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vulnerability">Vulnerability</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="intrusion">Intrusion</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="malware">Malware</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border transition-colors ${
                  alert.severity === 'critical' && alert.status === 'new'
                    ? 'bg-red-500/10 border-red-500/30 pulse-critical'
                    : 'bg-secondary/30 border-border/30 hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                      <Badge variant="secondary" className="capitalize">{alert.category}</Badge>
                    </div>
                    <h3 className="font-medium mt-2">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Device: {alert.device}</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
