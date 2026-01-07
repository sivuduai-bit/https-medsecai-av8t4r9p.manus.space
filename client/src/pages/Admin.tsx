import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, Users, Shield, Bot, Bell, Database, Activity, Plus, Edit, Trash2, Key, Lock, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// Demo users
const DEMO_USERS = [
  { id: 1, name: "John Smith", email: "john.smith@hospital.com", role: "admin", status: "active", lastLogin: "2024-12-15 14:30" },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@hospital.com", role: "security_analyst", status: "active", lastLogin: "2024-12-15 12:15" },
  { id: 3, name: "Mike Chen", email: "mike.chen@hospital.com", role: "compliance_officer", status: "active", lastLogin: "2024-12-14 16:45" },
  { id: 4, name: "Emily Davis", email: "emily.d@hospital.com", role: "viewer", status: "active", lastLogin: "2024-12-14 09:20" },
  { id: 5, name: "Robert Wilson", email: "r.wilson@hospital.com", role: "security_analyst", status: "inactive", lastLogin: "2024-12-10 11:00" }
];

// AI Agent configurations
const AI_AGENT_CONFIGS = [
  { id: 1, name: "Network Scanner", enabled: true, intensity: 50, schedule: "daily" },
  { id: 2, name: "Vulnerability Assessor", enabled: true, intensity: 75, schedule: "hourly" },
  { id: 3, name: "Web App Tester", enabled: false, intensity: 30, schedule: "weekly" },
  { id: 4, name: "API Tester", enabled: true, intensity: 60, schedule: "daily" },
  { id: 5, name: "Authentication Tester", enabled: true, intensity: 80, schedule: "daily" },
  { id: 6, name: "Encryption Analyzer", enabled: false, intensity: 40, schedule: "weekly" }
];

// Notification settings
const NOTIFICATION_SETTINGS = [
  { id: 1, type: "Critical Alerts", email: true, inApp: true, sms: true },
  { id: 2, type: "High Severity Alerts", email: true, inApp: true, sms: false },
  { id: 3, type: "Compliance Updates", email: true, inApp: true, sms: false },
  { id: 4, type: "Scan Completions", email: false, inApp: true, sms: false },
  { id: 5, type: "Weekly Reports", email: true, inApp: false, sms: false }
];

export default function Admin() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<typeof DEMO_USERS[0] | null>(null);

  // System usage chart
  const usageOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      textStyle: { color: '#e2e8f0' }
    },
    legend: {
      data: ['API Calls', 'Scans', 'Reports'],
      textStyle: { color: '#94a3b8' },
      bottom: 0
    },
    grid: { top: 20, right: 20, bottom: 50, left: 50 },
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
      { name: 'API Calls', type: 'line', smooth: true, data: [1200, 1350, 1100, 1450, 1300, 800, 600], lineStyle: { color: '#3b82f6' }, itemStyle: { color: '#3b82f6' } },
      { name: 'Scans', type: 'line', smooth: true, data: [45, 52, 48, 60, 55, 30, 25], lineStyle: { color: '#22c55e' }, itemStyle: { color: '#22c55e' } },
      { name: 'Reports', type: 'line', smooth: true, data: [8, 12, 10, 15, 11, 5, 3], lineStyle: { color: '#a855f7' }, itemStyle: { color: '#a855f7' } }
    ]
  }), []);

  const getRoleBadge = (role: string) => {
    const config: Record<string, { label: string; class: string }> = {
      admin: { label: "Administrator", class: "bg-red-500/20 text-red-400 border-red-500/30" },
      security_analyst: { label: "Security Analyst", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      compliance_officer: { label: "Compliance Officer", class: "bg-green-500/20 text-green-400 border-green-500/30" },
      viewer: { label: "Viewer", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" }
    };
    const { label, class: className } = config[role] || config.viewer;
    return <Badge className={`${className} border`}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="badge-success border">Active</Badge>
      : <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 border">Inactive</Badge>;
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
            <Settings className="h-7 w-7 text-primary" />
            Administration
          </h1>
          <p className="text-muted-foreground mt-1">
            System configuration, user management, and analytics
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: DEMO_USERS.length, icon: Users },
          { label: "Active Agents", value: AI_AGENT_CONFIGS.filter(a => a.enabled).length, icon: Bot },
          { label: "API Calls Today", value: "1,450", icon: Activity },
          { label: "Storage Used", value: "24.5 GB", icon: Database }
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-secondary">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList className="bg-secondary">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Agents
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <CardDescription>Manage user accounts and role-based access control</CardDescription>
                </div>
                <Button className="cyber-glow">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Last Login</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_USERS.map((demoUser) => (
                      <tr key={demoUser.id} className="border-t border-border/30 hover:bg-secondary/30 transition-colors">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{demoUser.name}</p>
                            <p className="text-xs text-muted-foreground">{demoUser.email}</p>
                          </div>
                        </td>
                        <td className="p-3">{getRoleBadge(demoUser.role)}</td>
                        <td className="p-3">{getStatusBadge(demoUser.status)}</td>
                        <td className="p-3 text-sm text-muted-foreground">{demoUser.lastLogin}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Key className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Role Permissions */}
              <div className="mt-6">
                <h3 className="font-medium mb-4">Role Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { role: "Administrator", permissions: ["Full system access", "User management", "Configuration", "All reports"] },
                    { role: "Security Analyst", permissions: ["View devices", "Run scans", "View vulnerabilities", "Generate reports"] },
                    { role: "Compliance Officer", permissions: ["View compliance", "Generate reports", "Audit trail access", "Read-only devices"] },
                    { role: "Viewer", permissions: ["View dashboard", "View devices", "View reports", "No modifications"] }
                  ].map((roleInfo, i) => (
                    <Card key={i} className="bg-secondary/30 border-border/30">
                      <CardContent className="p-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          {roleInfo.role}
                        </h4>
                        <ul className="mt-3 space-y-1">
                          {roleInfo.permissions.map((perm, j) => (
                            <li key={j} className="text-xs text-muted-foreground flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-primary" />
                              {perm}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Agents Tab */}
        <TabsContent value="agents" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">AI Agent Configuration</CardTitle>
              <CardDescription>Configure automated security testing agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {AI_AGENT_CONFIGS.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${agent.enabled ? 'bg-primary/20' : 'bg-secondary'}`}>
                        <Bot className={`h-5 w-5 ${agent.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Intensity: {agent.intensity}% • Schedule: {agent.schedule}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select defaultValue={agent.schedule}>
                        <SelectTrigger className="w-28 bg-secondary border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <Switch checked={agent.enabled} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Notification Settings</CardTitle>
              <CardDescription>Configure alert delivery preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Notification Type</th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                        <Bell className="h-4 w-4 inline mr-1" />
                        In-App
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                        <Activity className="h-4 w-4 inline mr-1" />
                        SMS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {NOTIFICATION_SETTINGS.map((setting) => (
                      <tr key={setting.id} className="border-t border-border/30">
                        <td className="p-3 font-medium">{setting.type}</td>
                        <td className="p-3 text-center">
                          <Switch checked={setting.email} />
                        </td>
                        <td className="p-3 text-center">
                          <Switch checked={setting.inApp} />
                        </td>
                        <td className="p-3 text-center">
                          <Switch checked={setting.sms} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Email Recipients */}
              <div className="mt-6">
                <h3 className="font-medium mb-4">Email Recipients</h3>
                <div className="space-y-2">
                  {["security-team@hospital.com", "compliance@hospital.com", "it-admin@hospital.com"].map((email, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <span className="text-sm">{email}</span>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recipient
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">System Usage</CardTitle>
                <CardDescription>Weekly platform activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ReactECharts option={usageOptions} style={{ height: '300px' }} />
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
                <CardDescription>Current system status and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "API Server", status: "healthy", latency: "45ms", uptime: "99.9%" },
                    { name: "Database", status: "healthy", latency: "12ms", uptime: "99.99%" },
                    { name: "AI Engine", status: "healthy", latency: "120ms", uptime: "99.5%" },
                    { name: "Storage", status: "healthy", latency: "8ms", uptime: "100%" }
                  ].map((service, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="status-dot status-dot-online" />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Latency: {service.latency}</span>
                        <span>Uptime: {service.uptime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Log */}
          <Card className="bg-card border-border/50 mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Recent Audit Log</CardTitle>
              <CardDescription>System activity and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { action: "User login", user: "John Smith", time: "2 min ago", ip: "192.168.1.50" },
                  { action: "Report generated", user: "Sarah Johnson", time: "15 min ago", ip: "192.168.1.51" },
                  { action: "Device scan initiated", user: "System", time: "30 min ago", ip: "localhost" },
                  { action: "Configuration updated", user: "Mike Chen", time: "1 hour ago", ip: "192.168.1.52" },
                  { action: "User role changed", user: "John Smith", time: "2 hours ago", ip: "192.168.1.50" }
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">by {log.user}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{log.time}</p>
                      <p>{log.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
