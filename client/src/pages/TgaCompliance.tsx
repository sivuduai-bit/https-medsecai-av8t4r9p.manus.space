import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { FileCheck, CheckCircle, XCircle, AlertTriangle, Clock, FileText, Download, Shield } from "lucide-react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";

// TGA 12 Essential Principles
const TGA_PRINCIPLES = [
  { number: 1, name: "Clinical Performance", description: "Evidence of device safety and effectiveness", status: "compliant" },
  { number: 2, name: "Risk Management", description: "Comprehensive risk assessment and mitigation", status: "compliant" },
  { number: 3, name: "Software Lifecycle", description: "Proper software development and maintenance processes", status: "partial" },
  { number: 4, name: "Cybersecurity", description: "Protection against cyber threats and vulnerabilities", status: "non_compliant" },
  { number: 5, name: "Quality Management", description: "Documented quality management systems", status: "compliant" },
  { number: 6, name: "Clinical Evidence", description: "Supporting clinical data and literature", status: "compliant" },
  { number: 7, name: "Post-Market Surveillance", description: "Ongoing monitoring of device performance", status: "partial" },
  { number: 8, name: "Corrective Actions", description: "Procedures for addressing device issues", status: "compliant" },
  { number: 9, name: "Documentation", description: "Complete technical and clinical documentation", status: "pending" },
  { number: 10, name: "Traceability", description: "Ability to trace devices and components", status: "compliant" },
  { number: 11, name: "Training", description: "Appropriate training for device users", status: "partial" },
  { number: 12, name: "Incident Reporting", description: "Procedures for reporting adverse events", status: "compliant" }
];

// Standards mapping
const STANDARDS = [
  { name: "ISO 14971", description: "Risk management for medical devices", compliance: 85 },
  { name: "IEC 62304", description: "Medical device software lifecycle", compliance: 72 },
  { name: "ISO 27001", description: "Information security management", compliance: 68 },
  { name: "NIST CSF", description: "Cybersecurity Framework", compliance: 78 }
];

export default function TgaCompliance() {
  const [selectedDevice, setSelectedDevice] = useState("all");
  
  // Compliance stats
  const stats = useMemo(() => {
    const compliant = TGA_PRINCIPLES.filter(p => p.status === 'compliant').length;
    const partial = TGA_PRINCIPLES.filter(p => p.status === 'partial').length;
    const nonCompliant = TGA_PRINCIPLES.filter(p => p.status === 'non_compliant').length;
    const pending = TGA_PRINCIPLES.filter(p => p.status === 'pending').length;
    const score = Math.round((compliant + partial * 0.5) / TGA_PRINCIPLES.length * 100);
    return { compliant, partial, nonCompliant, pending, score };
  }, []);

  // Compliance radar chart
  const radarOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      textStyle: { color: '#e2e8f0' }
    },
    radar: {
      indicator: TGA_PRINCIPLES.map(p => ({ name: `P${p.number}`, max: 100 })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      splitArea: { areaStyle: { color: ['rgba(148, 163, 184, 0.05)', 'rgba(148, 163, 184, 0.1)'] } },
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: TGA_PRINCIPLES.map(p => {
          switch (p.status) {
            case 'compliant': return 100;
            case 'partial': return 60;
            case 'non_compliant': return 20;
            default: return 0;
          }
        }),
        name: 'Compliance',
        areaStyle: { color: 'rgba(34, 197, 94, 0.3)' },
        lineStyle: { color: '#22c55e', width: 2 },
        itemStyle: { color: '#22c55e' }
      }]
    }]
  }), []);

  // Standards compliance bar chart
  const standardsOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      textStyle: { color: '#e2e8f0' }
    },
    grid: { top: 20, right: 40, bottom: 40, left: 100 },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8', formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } }
    },
    yAxis: {
      type: 'category',
      data: STANDARDS.map(s => s.name),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      type: 'bar',
      data: STANDARDS.map(s => ({
        value: s.compliance,
        itemStyle: {
          color: s.compliance >= 80 ? '#22c55e' : s.compliance >= 60 ? '#eab308' : '#ef4444'
        }
      })),
      barWidth: 20,
      label: {
        show: true,
        position: 'right',
        color: '#94a3b8',
        formatter: '{c}%'
      }
    }]
  }), []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'non_compliant': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      compliant: "badge-success",
      partial: "badge-medium",
      non_compliant: "badge-critical",
      pending: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    };
    return <Badge className={`${config[status] || config.pending} border`}>{status.replace('_', ' ')}</Badge>;
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
            <FileCheck className="h-7 w-7 text-primary" />
            TGA Compliance
          </h1>
          <p className="text-muted-foreground mt-1">
            Automated compliance checking against TGA Essential Principles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="w-48 bg-secondary border-border/50">
              <SelectValue placeholder="Select Device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="mri">MRI Scanner #1</SelectItem>
              <SelectItem value="ct">CT Scanner #1</SelectItem>
              <SelectItem value="monitor">Patient Monitor #1</SelectItem>
            </SelectContent>
          </Select>
          <Button className="cyber-glow">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Compliance Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="md:col-span-2 bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
                <p className="text-5xl font-bold text-primary mt-2">{stats.score}%</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {stats.compliant} of {TGA_PRINCIPLES.length} principles fully compliant
                </p>
              </div>
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-secondary" />
                  <circle 
                    cx="48" cy="48" r="40" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray={`${stats.score * 2.51} 251`}
                    className="text-primary"
                  />
                </svg>
                <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {[
          { label: "Compliant", value: stats.compliant, color: "text-green-500", bg: "bg-green-500/20" },
          { label: "Partial", value: stats.partial, color: "text-yellow-500", bg: "bg-yellow-500/20" },
          { label: "Non-Compliant", value: stats.nonCompliant, color: "text-red-500", bg: "bg-red-500/20" }
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(stat.value / TGA_PRINCIPLES.length * 100)}% of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">TGA Principles Compliance</CardTitle>
            <CardDescription>Radar view of all 12 Essential Principles</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={radarOptions} style={{ height: '300px' }} />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Standards Mapping</CardTitle>
            <CardDescription>Compliance with international standards</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={standardsOptions} style={{ height: '300px' }} />
          </CardContent>
        </Card>
      </div>

      {/* Principles Detail */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">TGA Essential Principles</CardTitle>
          <CardDescription>Detailed compliance status for each principle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TGA_PRINCIPLES.map((principle) => (
              <div 
                key={principle.number}
                className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-primary">{principle.number}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{principle.name}</h3>
                        {getStatusBadge(principle.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{principle.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(principle.status)}
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 ml-14">
                  <Progress 
                    value={principle.status === 'compliant' ? 100 : principle.status === 'partial' ? 60 : principle.status === 'non_compliant' ? 20 : 0} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Audit Activity</CardTitle>
          <CardDescription>Compliance assessment history and documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Compliance assessment completed", user: "John Smith", time: "2 hours ago", principle: "P4 - Cybersecurity" },
              { action: "Evidence document uploaded", user: "Sarah Johnson", time: "5 hours ago", principle: "P9 - Documentation" },
              { action: "Status updated to Partial", user: "Mike Chen", time: "1 day ago", principle: "P3 - Software Lifecycle" },
              { action: "Audit report generated", user: "System", time: "2 days ago", principle: "Full Assessment" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.principle} • {item.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
