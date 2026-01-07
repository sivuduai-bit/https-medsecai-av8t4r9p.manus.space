import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Bug, Search, Filter, TrendingUp, AlertTriangle, CheckCircle, Clock, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";
import { Streamdown } from "streamdown";

// Demo vulnerabilities data
const demoVulnerabilities = [
  { id: 1, cveId: "CVE-2024-1234", title: "Remote Code Execution in Medical Device Firmware", cvss: 9.8, severity: "critical", status: "open", device: "MRI Scanner #1", detectedAt: "2024-12-14" },
  { id: 2, cveId: "CVE-2024-2345", title: "Authentication Bypass in Web Interface", cvss: 8.5, severity: "high", status: "in_progress", device: "Patient Monitor #1", detectedAt: "2024-12-13" },
  { id: 3, cveId: "CVE-2024-3456", title: "SQL Injection in Database Module", cvss: 7.5, severity: "high", status: "open", device: "Lab Analyzer #1", detectedAt: "2024-12-12" },
  { id: 4, cveId: "CVE-2024-4567", title: "Unencrypted Data Transmission", cvss: 6.5, severity: "medium", status: "mitigated", device: "Infusion Pump #1", detectedAt: "2024-12-11" },
  { id: 5, cveId: "CVE-2024-5678", title: "Cross-Site Scripting in Admin Panel", cvss: 5.4, severity: "medium", status: "open", device: "Ventilator #1", detectedAt: "2024-12-10" },
  { id: 6, cveId: "CVE-2024-6789", title: "Denial of Service via Malformed Packets", cvss: 7.8, severity: "high", status: "resolved", device: "CT Scanner #1", detectedAt: "2024-12-09" },
  { id: 7, cveId: "CVE-2024-7890", title: "Privilege Escalation in Service Account", cvss: 8.1, severity: "high", status: "open", device: "X-Ray Machine #1", detectedAt: "2024-12-08" },
  { id: 8, cveId: "CVE-2024-8901", title: "Information Disclosure via Error Messages", cvss: 4.3, severity: "medium", status: "accepted", device: "ECG Monitor #1", detectedAt: "2024-12-07" },
  { id: 9, cveId: "CVE-2024-9012", title: "Buffer Overflow in Network Stack", cvss: 9.1, severity: "critical", status: "in_progress", device: "Defibrillator #1", detectedAt: "2024-12-06" },
  { id: 10, cveId: "CVE-2024-0123", title: "Weak Cryptographic Algorithm", cvss: 5.9, severity: "medium", status: "open", device: "Ultrasound #1", detectedAt: "2024-12-05" },
];

export default function Vulnerabilities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVuln, setSelectedVuln] = useState<typeof demoVulnerabilities[0] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // LLM analysis mutation
  const analyzeVuln = trpc.llmAnalysis.analyzeVulnerability.useMutation({
    onSuccess: (data) => {
      setAiAnalysis(typeof data.analysis === 'string' ? data.analysis : 'Analysis completed');
      setIsAnalyzing(false);
    },
    onError: () => {
      setIsAnalyzing(false);
    }
  });

  const handleAnalyze = (vulnId: number) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    analyzeVuln.mutate({ vulnerabilityId: vulnId });
  };

  // Vulnerability trend chart
  const trendOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      textStyle: { color: '#e2e8f0' }
    },
    legend: {
      data: ['Critical', 'High', 'Medium', 'Low'],
      textStyle: { color: '#94a3b8' },
      bottom: 0
    },
    grid: { top: 20, right: 20, bottom: 50, left: 50 },
    xAxis: {
      type: 'category',
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
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
      { name: 'Critical', type: 'bar', stack: 'total', data: [2, 3, 2, 4, 3, 2], itemStyle: { color: '#ef4444' } },
      { name: 'High', type: 'bar', stack: 'total', data: [5, 4, 6, 5, 4, 4], itemStyle: { color: '#f97316' } },
      { name: 'Medium', type: 'bar', stack: 'total', data: [8, 7, 9, 8, 7, 6], itemStyle: { color: '#eab308' } },
      { name: 'Low', type: 'bar', stack: 'total', data: [3, 4, 3, 2, 3, 2], itemStyle: { color: '#3b82f6' } }
    ]
  }), []);

  // CVSS distribution chart
  const cvssDistOptions = useMemo(() => ({
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
        { value: demoVulnerabilities.filter(v => v.cvss >= 9).length, name: 'Critical (9.0+)', itemStyle: { color: '#ef4444' } },
        { value: demoVulnerabilities.filter(v => v.cvss >= 7 && v.cvss < 9).length, name: 'High (7.0-8.9)', itemStyle: { color: '#f97316' } },
        { value: demoVulnerabilities.filter(v => v.cvss >= 4 && v.cvss < 7).length, name: 'Medium (4.0-6.9)', itemStyle: { color: '#eab308' } },
        { value: demoVulnerabilities.filter(v => v.cvss < 4).length, name: 'Low (<4.0)', itemStyle: { color: '#3b82f6' } }
      ],
      label: { color: '#94a3b8' },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  }), []);

  const getSeverityBadge = (severity: string) => {
    const classes: Record<string, string> = {
      critical: "badge-critical",
      high: "badge-high",
      medium: "badge-medium",
      low: "badge-low"
    };
    return <Badge className={classes[severity] || "badge-low"}>{severity}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { class: string; icon: React.ReactNode }> = {
      open: { class: "bg-red-500/20 text-red-400 border-red-500/30", icon: <AlertTriangle className="h-3 w-3" /> },
      in_progress: { class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: <Clock className="h-3 w-3" /> },
      mitigated: { class: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <CheckCircle className="h-3 w-3" /> },
      resolved: { class: "bg-green-500/20 text-green-400 border-green-500/30", icon: <CheckCircle className="h-3 w-3" /> },
      accepted: { class: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: <CheckCircle className="h-3 w-3" /> }
    };
    const { class: className, icon } = config[status] || config.open;
    return (
      <Badge className={`${className} border flex items-center gap-1`}>
        {icon}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredVulns = demoVulnerabilities.filter(vuln => {
    const matchesSearch = vuln.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vuln.cveId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || vuln.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || vuln.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const stats = {
    total: demoVulnerabilities.length,
    critical: demoVulnerabilities.filter(v => v.severity === 'critical').length,
    open: demoVulnerabilities.filter(v => v.status === 'open').length,
    resolved: demoVulnerabilities.filter(v => v.status === 'resolved').length
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
            <Bug className="h-7 w-7 text-primary" />
            Vulnerability Management
          </h1>
          <p className="text-muted-foreground mt-1">
            CVSS-based vulnerability tracking and remediation workflows
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Vulnerabilities", value: stats.total, color: "text-foreground" },
          { label: "Critical", value: stats.critical, color: "text-red-500" },
          { label: "Open", value: stats.open, color: "text-yellow-500" },
          { label: "Resolved", value: stats.resolved, color: "text-green-500" }
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Vulnerability Trend</CardTitle>
            <CardDescription>Weekly vulnerability detection by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={trendOptions} style={{ height: '250px' }} />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">CVSS Distribution</CardTitle>
            <CardDescription>Vulnerabilities by CVSS score range</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={cvssDistOptions} style={{ height: '250px' }} />
          </CardContent>
        </Card>
      </div>

      {/* Vulnerability List */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Vulnerability Queue</CardTitle>
              <CardDescription>Prioritized list of detected vulnerabilities</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search CVE or title..." 
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="mitigated">Mitigated</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredVulns.map((vuln) => (
              <Dialog key={vuln.id}>
                <DialogTrigger asChild>
                  <div 
                    className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer border border-border/30"
                    onClick={() => setSelectedVuln(vuln)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-primary">{vuln.cveId}</span>
                          {getSeverityBadge(vuln.severity)}
                          {getStatusBadge(vuln.status)}
                        </div>
                        <h3 className="font-medium mt-2">{vuln.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Affected: {vuln.device}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ 
                          color: vuln.cvss >= 9 ? '#ef4444' : vuln.cvss >= 7 ? '#f97316' : vuln.cvss >= 4 ? '#eab308' : '#3b82f6' 
                        }}>
                          {vuln.cvss}
                        </div>
                        <p className="text-xs text-muted-foreground">CVSS Score</p>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <span className="font-mono text-primary">{vuln.cveId}</span>
                      {getSeverityBadge(vuln.severity)}
                    </DialogTitle>
                    <DialogDescription>{vuln.title}</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="details" className="mt-4">
                    <TabsList className="bg-secondary">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="remediation">Remediation</TabsTrigger>
                      <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">CVSS Score</p>
                          <p className="text-2xl font-bold" style={{ 
                            color: vuln.cvss >= 9 ? '#ef4444' : vuln.cvss >= 7 ? '#f97316' : '#eab308' 
                          }}>{vuln.cvss}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <div className="mt-1">{getStatusBadge(vuln.status)}</div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Affected Device</p>
                          <p className="font-medium">{vuln.device}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Detected</p>
                          <p className="font-medium">{vuln.detectedAt}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Description</p>
                        <p className="text-sm">This vulnerability allows attackers to potentially compromise the affected medical device through the identified attack vector. Immediate attention is recommended based on the CVSS score.</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="remediation" className="mt-4 space-y-4">
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <p className="font-medium">1. Apply vendor patch</p>
                          <p className="text-sm text-muted-foreground">Contact the device manufacturer for the latest security patch.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <p className="font-medium">2. Network segmentation</p>
                          <p className="text-sm text-muted-foreground">Isolate the affected device on a separate network segment.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <p className="font-medium">3. Monitor for exploitation</p>
                          <p className="text-sm text-muted-foreground">Enable enhanced logging and monitoring for suspicious activity.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">Mark as In Progress</Button>
                        <Button variant="outline" className="flex-1">Mark as Resolved</Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="ai-analysis" className="mt-4">
                      {!aiAnalysis && !isAnalyzing && (
                        <div className="text-center py-8">
                          <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">Get AI-powered analysis and remediation recommendations</p>
                          <Button onClick={() => handleAnalyze(vuln.id)}>
                            Analyze with AI
                          </Button>
                        </div>
                      )}
                      {isAnalyzing && (
                        <div className="text-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                          <p className="text-muted-foreground">Analyzing vulnerability...</p>
                        </div>
                      )}
                      {aiAnalysis && (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <Streamdown>{aiAnalysis}</Streamdown>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
