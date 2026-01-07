import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Gauge, TrendingUp, TrendingDown, AlertTriangle, Shield, Activity, RefreshCw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";
import { Streamdown } from "streamdown";

// Risk factors
const RISK_FACTORS = [
  { name: "Vulnerability Exposure", score: 72, weight: 0.3, trend: "up" },
  { name: "Compliance Gaps", score: 45, weight: 0.25, trend: "down" },
  { name: "Network Exposure", score: 58, weight: 0.2, trend: "stable" },
  { name: "Asset Criticality", score: 85, weight: 0.15, trend: "up" },
  { name: "Threat Intelligence", score: 62, weight: 0.1, trend: "down" }
];

// Device risk breakdown
const DEVICE_RISKS = [
  { name: "MRI Scanner #1", risk: 75, vulnerabilities: 8, compliance: 65 },
  { name: "Patient Monitor #1", risk: 82, vulnerabilities: 12, compliance: 58 },
  { name: "Infusion Pump #1", risk: 45, vulnerabilities: 3, compliance: 85 },
  { name: "CT Scanner #1", risk: 38, vulnerabilities: 2, compliance: 92 },
  { name: "Ventilator #1", risk: 68, vulnerabilities: 6, compliance: 72 }
];

export default function RiskAssessment() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Calculate overall risk
  const overallRisk = useMemo(() => {
    return Math.round(RISK_FACTORS.reduce((acc, f) => acc + f.score * f.weight, 0));
  }, []);

  // LLM risk explanation
  const explainRisk = trpc.llmAnalysis.explainRisk.useMutation({
    onSuccess: (data) => {
      const explanation = typeof data.explanation === 'string' ? data.explanation : 'Analysis completed';
      setAiExplanation(explanation);
      setIsAnalyzing(false);
    },
    onError: () => {
      setIsAnalyzing(false);
    }
  });

  const handleExplainRisk = () => {
    setIsAnalyzing(true);
    setAiExplanation(null);
    explainRisk.mutate({
      riskScore: overallRisk,
      context: `Organization has ${DEVICE_RISKS.length} medical devices with varying risk levels. Top risk factors: ${RISK_FACTORS.slice(0, 3).map(f => f.name).join(', ')}.`
    });
  };

  // Main risk gauge
  const gaugeOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      radius: '90%',
      center: ['50%', '55%'],
      axisLine: {
        lineStyle: {
          width: 25,
          color: [
            [0.3, '#22c55e'],
            [0.6, '#eab308'],
            [0.8, '#f97316'],
            [1, '#ef4444']
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '55%',
        width: 12,
        offsetCenter: [0, '-10%'],
        itemStyle: { color: '#e2e8f0' }
      },
      axisTick: {
        length: 10,
        lineStyle: { color: 'auto', width: 2 }
      },
      splitLine: {
        length: 15,
        lineStyle: { color: 'auto', width: 3 }
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 12,
        distance: -50
      },
      title: { show: false },
      detail: {
        fontSize: 48,
        fontWeight: 'bold',
        color: overallRisk > 70 ? '#ef4444' : overallRisk > 50 ? '#eab308' : '#22c55e',
        offsetCenter: [0, '30%'],
        formatter: '{value}'
      },
      data: [{ value: overallRisk }]
    }]
  }), [overallRisk]);

  // Risk trend chart
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
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } }
    },
    series: [{
      type: 'line',
      smooth: true,
      data: [78, 72, 68, 74, 65, overallRisk],
      lineStyle: { color: '#22c55e', width: 3 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0)' }
          ]
        }
      },
      itemStyle: { color: '#22c55e' },
      markLine: {
        silent: true,
        data: [
          { yAxis: 70, lineStyle: { color: '#ef4444', type: 'dashed' } },
          { yAxis: 50, lineStyle: { color: '#eab308', type: 'dashed' } }
        ]
      }
    }]
  }), [overallRisk]);

  // Risk distribution radar
  const radarOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    radar: {
      indicator: RISK_FACTORS.map(f => ({ name: f.name.split(' ')[0], max: 100 })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      splitArea: { areaStyle: { color: ['rgba(148, 163, 184, 0.05)', 'rgba(148, 163, 184, 0.1)'] } },
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: RISK_FACTORS.map(f => f.score),
        name: 'Risk Score',
        areaStyle: { color: 'rgba(239, 68, 68, 0.3)' },
        lineStyle: { color: '#ef4444', width: 2 },
        itemStyle: { color: '#ef4444' }
      }]
    }]
  }), []);

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { label: "Critical", color: "text-red-500", badge: "badge-critical" };
    if (score >= 60) return { label: "High", color: "text-orange-500", badge: "badge-high" };
    if (score >= 40) return { label: "Medium", color: "text-yellow-500", badge: "badge-medium" };
    return { label: "Low", color: "text-green-500", badge: "badge-success" };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-yellow-500" />;
    }
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
            <Gauge className="h-7 w-7 text-primary" />
            Risk Assessment
          </h1>
          <p className="text-muted-foreground mt-1">
            Dynamic security posture and device criticality scoring
          </p>
        </div>
        <Button className="cyber-glow">
          <RefreshCw className="h-4 w-4 mr-2" />
          Recalculate Risk
        </Button>
      </div>

      {/* Main Risk Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overall Risk Gauge */}
        <Card className="lg:col-span-1 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Overall Risk Score</CardTitle>
            <CardDescription>Aggregate security risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={gaugeOptions} style={{ height: '280px' }} />
            <div className="text-center mt-2">
              <Badge className={`${getRiskLevel(overallRisk).badge} border text-lg px-4 py-1`}>
                {getRiskLevel(overallRisk).label} Risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Risk Trend */}
        <Card className="lg:col-span-2 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Risk Trend</CardTitle>
            <CardDescription>Historical risk score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={trendOptions} style={{ height: '280px' }} />
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Factor Breakdown */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Risk Factors</CardTitle>
            <CardDescription>Contributing factors to overall risk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RISK_FACTORS.map((factor, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{factor.name}</span>
                      {getTrendIcon(factor.trend)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getRiskLevel(factor.score).color}`}>{factor.score}</span>
                      <span className="text-xs text-muted-foreground">({Math.round(factor.weight * 100)}% weight)</span>
                    </div>
                  </div>
                  <Progress 
                    value={factor.score} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Radar */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
            <CardDescription>Multi-dimensional risk analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={radarOptions} style={{ height: '280px' }} />
          </CardContent>
        </Card>
      </div>

      {/* Device Risk Table */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Device Risk Breakdown</CardTitle>
          <CardDescription>Individual device security posture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Device</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Risk Score</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Vulnerabilities</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Compliance</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {DEVICE_RISKS.map((device, i) => (
                  <tr key={i} className="border-t border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-medium">{device.name}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${device.risk}%`,
                              backgroundColor: device.risk > 70 ? '#ef4444' : device.risk > 50 ? '#eab308' : '#22c55e'
                            }}
                          />
                        </div>
                        <span className={`font-bold ${getRiskLevel(device.risk).color}`}>{device.risk}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary">{device.vulnerabilities} open</Badge>
                    </td>
                    <td className="p-3">
                      <span className={device.compliance >= 80 ? 'text-green-500' : device.compliance >= 60 ? 'text-yellow-500' : 'text-red-500'}>
                        {device.compliance}%
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge className={`${getRiskLevel(device.risk).badge} border`}>
                        {getRiskLevel(device.risk).label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Risk Explanation */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                AI Risk Analysis
              </CardTitle>
              <CardDescription>Natural language explanation of security risks</CardDescription>
            </div>
            <Button onClick={handleExplainRisk} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Explain Risk
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {aiExplanation ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <Streamdown>{aiExplanation}</Streamdown>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Click "Explain Risk" to get an AI-powered analysis of your current security posture
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
