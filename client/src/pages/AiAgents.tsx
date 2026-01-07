import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Bot, Play, Pause, Square, Zap, Shield, Network, Bug, Lock, Key, FileCode, Cpu, Settings, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMemo, useState, useEffect } from "react";

// AI Agent definitions with icons
const AI_AGENTS = [
  { id: 1, name: "Network Scanner", type: "network_scanner", icon: Network, description: "Discovers and maps network topology, identifies open ports and services", capabilities: ["Port scanning", "Service detection", "Topology mapping"], status: "active" },
  { id: 2, name: "Vulnerability Assessor", type: "vulnerability_assessor", icon: Bug, description: "Identifies known vulnerabilities using CVE database", capabilities: ["CVE lookup", "Version detection", "Patch analysis"], status: "active" },
  { id: 3, name: "Web App Tester", type: "web_app_tester", icon: FileCode, description: "Tests web interfaces for common vulnerabilities", capabilities: ["XSS detection", "SQL injection", "CSRF testing"], status: "idle" },
  { id: 4, name: "API Tester", type: "api_tester", icon: Zap, description: "Analyzes API endpoints for security issues", capabilities: ["Endpoint fuzzing", "Auth bypass", "Rate limiting"], status: "idle" },
  { id: 5, name: "Authentication Tester", type: "authentication_tester", icon: Key, description: "Tests authentication mechanisms and credential handling", capabilities: ["Brute force", "Session analysis", "MFA testing"], status: "active" },
  { id: 6, name: "Encryption Analyzer", type: "encryption_analyzer", icon: Lock, description: "Evaluates encryption implementations and key management", capabilities: ["Cipher analysis", "Key strength", "Protocol testing"], status: "idle" },
  { id: 7, name: "Protocol Analyzer", type: "protocol_analyzer", icon: Activity, description: "Analyzes medical device communication protocols", capabilities: ["HL7 analysis", "DICOM testing", "FHIR validation"], status: "active" },
  { id: 8, name: "Firmware Analyzer", type: "firmware_analyzer", icon: Cpu, description: "Examines device firmware for vulnerabilities", capabilities: ["Binary analysis", "Hardcoded creds", "Update mechanism"], status: "idle" },
  { id: 9, name: "Configuration Auditor", type: "configuration_auditor", icon: Settings, description: "Reviews device configurations against best practices", capabilities: ["Baseline check", "Hardening audit", "Default creds"], status: "active" },
  { id: 10, name: "Compliance Checker", type: "compliance_checker", icon: Shield, description: "Validates compliance with regulatory requirements", capabilities: ["TGA check", "HIPAA audit", "GDPR validation"], status: "idle" },
  { id: 11, name: "Threat Modeler", type: "threat_modeler", icon: AlertTriangle, description: "Models potential attack scenarios and threat vectors", capabilities: ["Attack surface", "Threat mapping", "Risk scoring"], status: "active" },
  { id: 12, name: "Penetration Tester", type: "penetration_tester", icon: Bot, description: "Performs coordinated penetration testing", capabilities: ["Exploit testing", "Privilege escalation", "Lateral movement"], status: "idle" }
];

export default function AiAgents() {
  const [selectedAgents, setSelectedAgents] = useState<number[]>([1, 2, 5, 7, 9, 11]);
  const [intensity, setIntensity] = useState<number[]>([50]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Simulate test progress
  useEffect(() => {
    if (isRunning && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(p => Math.min(p + Math.random() * 5, 100));
        if (Math.random() > 0.7) {
          setTestResults(prev => [...prev, {
            agent: AI_AGENTS[Math.floor(Math.random() * AI_AGENTS.length)].name,
            finding: ["Port 443 open with valid SSL", "Weak cipher suite detected", "Default credentials found", "Missing security headers", "Outdated firmware version"][Math.floor(Math.random() * 5)],
            severity: ["info", "low", "medium", "high", "critical"][Math.floor(Math.random() * 5)],
            time: new Date().toLocaleTimeString()
          }]);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
    if (progress >= 100) {
      setIsRunning(false);
    }
  }, [isRunning, progress]);

  const handleStart = () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const toggleAgent = (agentId: number) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const getIntensityLabel = () => {
    if (intensity[0] < 33) return "Gentle";
    if (intensity[0] < 66) return "Moderate";
    return "Aggressive";
  };

  const getIntensityColor = () => {
    if (intensity[0] < 33) return "text-green-500";
    if (intensity[0] < 66) return "text-yellow-500";
    return "text-red-500";
  };

  // Agent activity chart
  const activityOptions = useMemo(() => ({
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
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } }
    },
    series: [{
      type: 'line',
      smooth: true,
      data: [12, 8, 15, 22, 18, 25],
      lineStyle: { color: '#22c55e', width: 2 },
      areaStyle: { color: 'rgba(34, 197, 94, 0.2)' },
      itemStyle: { color: '#22c55e' }
    }]
  }), []);

  const getSeverityBadge = (severity: string) => {
    const classes: Record<string, string> = {
      critical: "badge-critical",
      high: "badge-high",
      medium: "badge-medium",
      low: "badge-low",
      info: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    };
    return <Badge className={`${classes[severity] || classes.info} border`}>{severity}</Badge>;
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
            <Bot className="h-7 w-7 text-primary" />
            AI Agent Testing
          </h1>
          <p className="text-muted-foreground mt-1">
            12 specialized penetration testing agents with coordinated testing
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} className="cyber-glow" disabled={selectedAgents.length === 0}>
              <Play className="h-4 w-4 mr-2" />
              Start Test
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsRunning(false)}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button variant="destructive" onClick={handleStop}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Test Controls */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Test Configuration</CardTitle>
          <CardDescription>Configure test parameters and intensity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium mb-2">Selected Agents</p>
              <p className="text-3xl font-bold text-primary">{selectedAgents.length} / 12</p>
              <p className="text-sm text-muted-foreground">agents active</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Test Intensity</p>
              <Slider 
                value={intensity} 
                onValueChange={setIntensity} 
                max={100} 
                step={1}
                disabled={isRunning}
              />
              <p className={`text-sm mt-2 font-medium ${getIntensityColor()}`}>
                {getIntensityLabel()} ({intensity[0]}%)
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Target</p>
              <Select defaultValue="all" disabled={isRunning}>
                <SelectTrigger className="bg-secondary border-border/50">
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="critical">Critical Devices Only</SelectItem>
                  <SelectItem value="new">Newly Discovered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isRunning && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Test Progress</p>
                <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {AI_AGENTS.map((agent) => {
          const isSelected = selectedAgents.includes(agent.id);
          const Icon = agent.icon;
          
          return (
            <Card 
              key={agent.id}
              className={`bg-card border-border/50 transition-all cursor-pointer ${
                isSelected ? 'border-primary/50 cyber-glow' : 'hover:border-border'
              }`}
              onClick={() => !isRunning && toggleAgent(agent.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-secondary'}`}>
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <Switch 
                    checked={isSelected} 
                    onCheckedChange={() => !isRunning && toggleAgent(agent.id)}
                    disabled={isRunning}
                  />
                </div>
                <h3 className="font-medium mt-3">{agent.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{agent.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {agent.capabilities.slice(0, 2).map((cap, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{cap}</Badge>
                  ))}
                </div>
                {isRunning && isSelected && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-500">Running</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live Results */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Test Results
            </CardTitle>
            <CardDescription>Real-time findings from active agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isRunning ? "Waiting for results..." : "Start a test to see results"}
                </div>
              ) : (
                testResults.slice(-10).reverse().map((result, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{result.agent}</span>
                      {getSeverityBadge(result.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{result.finding}</p>
                    <p className="text-xs text-muted-foreground mt-1">{result.time}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agent Activity Chart */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Agent Activity</CardTitle>
            <CardDescription>Tests performed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={activityOptions} style={{ height: '300px' }} />
          </CardContent>
        </Card>
      </div>

      {/* Test History */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Test Sessions</CardTitle>
          <CardDescription>History of completed penetration tests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Full Network Scan", agents: 12, findings: 24, duration: "45 min", date: "Dec 15, 2024", status: "completed" },
              { name: "Critical Device Assessment", agents: 6, findings: 8, duration: "22 min", date: "Dec 14, 2024", status: "completed" },
              { name: "Web Interface Test", agents: 3, findings: 5, duration: "15 min", date: "Dec 13, 2024", status: "completed" },
              { name: "Authentication Audit", agents: 4, findings: 12, duration: "30 min", date: "Dec 12, 2024", status: "completed" }
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.agents} agents • {session.findings} findings • {session.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{session.date}</p>
                  <Badge className="badge-success border mt-1">Completed</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
