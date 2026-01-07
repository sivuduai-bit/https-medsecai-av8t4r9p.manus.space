import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Shield, Server, Bug, FileCheck, AlertTriangle, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";

// Demo organization ID - in production this would come from user context
const DEMO_ORG_ID = 1;

export default function Home() {
  const [selectedTimeRange] = useState("7d");
  
  // Fetch dashboard stats
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery(
    { organizationId: DEMO_ORG_ID },
    { refetchInterval: 30000 }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Vulnerability trend chart options
  const vulnTrendOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
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
      {
        name: 'Critical',
        type: 'line',
        smooth: true,
        data: [4, 3, 5, 4, 6, 5, 4],
        lineStyle: { color: '#ef4444', width: 2 },
        itemStyle: { color: '#ef4444' },
        areaStyle: { color: 'rgba(239, 68, 68, 0.1)' }
      },
      {
        name: 'High',
        type: 'line',
        smooth: true,
        data: [12, 15, 11, 14, 13, 12, 10],
        lineStyle: { color: '#f97316', width: 2 },
        itemStyle: { color: '#f97316' },
        areaStyle: { color: 'rgba(249, 115, 22, 0.1)' }
      },
      {
        name: 'Medium',
        type: 'line',
        smooth: true,
        data: [25, 22, 28, 24, 26, 23, 21],
        lineStyle: { color: '#eab308', width: 2 },
        itemStyle: { color: '#eab308' },
        areaStyle: { color: 'rgba(234, 179, 8, 0.1)' }
      }
    ]
  }), []);

  // Device status pie chart
  const deviceStatusOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      textStyle: { color: '#e2e8f0' }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      data: [
        { value: stats?.devices.online || 45, name: 'Online', itemStyle: { color: '#22c55e' } },
        { value: stats?.devices.offline || 8, name: 'Offline', itemStyle: { color: '#64748b' } },
        { value: stats?.devices.critical || 3, name: 'Critical', itemStyle: { color: '#ef4444' } }
      ],
      label: { show: false },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }), [stats]);

  // Compliance gauge chart
  const complianceGaugeOptions = useMemo(() => {
    const complianceRate = stats?.compliance.total 
      ? Math.round((stats.compliance.compliant / stats.compliance.total) * 100) 
      : 78;
    return {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: '100%',
        center: ['50%', '70%'],
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.3, '#ef4444'],
              [0.7, '#eab308'],
              [1, '#22c55e']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '60%',
          width: 8,
          offsetCenter: [0, '-30%'],
          itemStyle: { color: '#22c55e' }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#e2e8f0',
          offsetCenter: [0, '10%'],
          formatter: '{value}%'
        },
        data: [{ value: complianceRate }]
      }]
    };
  }, [stats]);

  const statCards = [
    {
      title: "Total Devices",
      value: stats?.devices.total || 0,
      icon: Server,
      trend: "+12%",
      trendUp: true,
      color: "text-cyber-blue"
    },
    {
      title: "Open Vulnerabilities",
      value: stats?.vulnerabilities.open || 0,
      icon: Bug,
      trend: "-8%",
      trendUp: false,
      color: "text-cyber-orange"
    },
    {
      title: "Compliance Score",
      value: stats?.compliance.total ? `${Math.round((stats.compliance.compliant / stats.compliance.total) * 100)}%` : "78%",
      icon: FileCheck,
      trend: "+5%",
      trendUp: true,
      color: "text-cyber-green"
    },
    {
      title: "Active Alerts",
      value: stats?.alerts.new || 0,
      icon: AlertTriangle,
      trend: "-15%",
      trendUp: false,
      color: "text-cyber-red"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Security Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of your medical device security posture
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Live Monitoring</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-card border-border/50 cyber-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trendUp ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last week</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vulnerability Trend */}
        <Card className="lg:col-span-2 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Vulnerability Trends</CardTitle>
            <CardDescription>Weekly vulnerability detection by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={vulnTrendOptions} style={{ height: '280px' }} />
          </CardContent>
        </Card>

        {/* Device Status */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Device Status</CardTitle>
            <CardDescription>Current device health distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={deviceStatusOptions} style={{ height: '200px' }} />
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500" />
                <span className="text-sm text-muted-foreground">Offline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Critical</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* TGA Compliance Gauge */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">TGA Compliance</CardTitle>
            <CardDescription>Overall compliance score</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={complianceGaugeOptions} style={{ height: '200px' }} />
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="lg:col-span-2 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Security Alerts</CardTitle>
            <CardDescription>Latest security events requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { severity: 'critical', title: 'Unauthorized access attempt detected', device: 'MRI Scanner #3', time: '2 min ago' },
                { severity: 'high', title: 'Outdated firmware vulnerability', device: 'Patient Monitor #12', time: '15 min ago' },
                { severity: 'medium', title: 'SSL certificate expiring soon', device: 'Infusion Pump #7', time: '1 hour ago' },
                { severity: 'low', title: 'Configuration drift detected', device: 'CT Scanner #1', time: '3 hours ago' }
              ].map((alert, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className={`status-dot status-dot-${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'warning' : 'online'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.device}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
