import React, { useState, useEffect } from 'react';
import type { CalculationResult, ActiveView } from '../types';
import { 
  isValidIPv4, 
  isValidCIDR, 
  calculateIPv4, 
  saveCalculationToHistory 
} from '../utils/ipUtils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Ipv4BreakdownTable } from '../components/Ipv4BreakdownTable';
import { 
  Calculator, 
  RotateCcw, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Network, 
  Radio, 
  Users, 
  Layers, 
  Binary,
  ArrowRight,
  BookmarkPlus
} from 'lucide-react';

interface PageProps {
  onNavigate?: (view: ActiveView) => void;
  onHistoryUpdate?: () => void;
}

const COMMON_PRESETS = [
  { ip: '192.168.1.50', cidr: 24, label: 'Home LAN (192.168.1.50/24)' },
  { ip: '10.0.0.1', cidr: 16, label: 'Corporate Subnet (10.0.0.1/16)' },
  { ip: '172.16.10.5', cidr: 20, label: 'VPC Subnet (172.16.10.5/20)' },
  { ip: '8.8.8.8', cidr: 32, label: 'Single Host (8.8.8.8/32)' },
];

const QUICK_PREFIXES = [8, 16, 24, 27, 28, 29, 30, 31, 32];

export const Ipv4Calculator: React.FC<PageProps> = ({ onHistoryUpdate }) => {
  const [ipInput, setIpInput] = useState<string>('192.168.1.50');
  const [cidrInput, setCidrInput] = useState<number>(24);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  // Compute calculation when inputs change or on load
  useEffect(() => {
    handleCalculate(ipInput, cidrInput);
  }, []);

  const handleCalculate = (ip: string, cidr: number) => {
    setError(null);
    if (!isValidIPv4(ip)) {
      setError('Please enter a valid IPv4 address (e.g. 192.168.1.50).');
      setResult(null);
      return;
    }
    if (!isValidCIDR(cidr)) {
      setError('CIDR prefix must be between 0 and 32.');
      setResult(null);
      return;
    }

    const calcResult = calculateIPv4(ip.trim(), cidr);
    setResult(calcResult);
  };

  const handleSaveToHistory = () => {
    if (result) {
      saveCalculationToHistory(result);
      if (onHistoryUpdate) onHistoryUpdate();
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2500);
    }
  };

  const handlePresetSelect = (ip: string, cidr: number) => {
    setIpInput(ip);
    setCidrInput(cidr);
    handleCalculate(ip, cidr);
  };

  const handleReset = () => {
    setIpInput('192.168.1.50');
    setCidrInput(24);
    handleCalculate('192.168.1.50', 24);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <Card className="border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">IPv4 Subnet Calculator</h1>
                <Badge variant="cyan">Real-time Engine</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculate host address ranges, subnets, broadcast addresses, and 32-bit binary bitwise breakdown.
              </p>
            </div>
          </div>

          {result && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<BookmarkPlus className="w-4 h-4 text-cyan-400" />}
                onClick={handleSaveToHistory}
              >
                {savedNotification ? 'Saved to History!' : 'Save Result'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Input Configuration & Quick Presets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form Column */}
        <Card className="lg:col-span-2 border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Subnet Input Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* IP Address Field */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>IPv4 Address</span>
                <span className="text-[10px] text-slate-400 font-mono">Octets: 0-255</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setIpInput(val);
                    handleCalculate(val, cidrInput);
                  }}
                  placeholder="e.g. 192.168.1.50"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* CIDR Prefix Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>CIDR Prefix</span>
                <span className="text-[10px] text-cyan-400 font-mono">/{cidrInput}</span>
              </label>
              <select
                value={cidrInput}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setCidrInput(val);
                  handleCalculate(ipInput, val);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
              >
                {Array.from({ length: 33 }, (_, i) => (
                  <option key={i} value={i}>
                    /{i} ({Math.pow(2, 32 - i).toLocaleString()} IPs)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CIDR Prefix Slider & Quick Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Prefix Slider</span>
              <span className="text-cyan-400">/{cidrInput}</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={cidrInput}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setCidrInput(val);
                handleCalculate(ipInput, val);
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />

            {/* Quick CIDR Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Quick Masks:</span>
              {QUICK_PREFIXES.map((prefix) => (
                <button
                  key={prefix}
                  onClick={() => {
                    setCidrInput(prefix);
                    handleCalculate(ipInput, prefix);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs border transition-all ${
                    cidrInput === prefix
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  /{prefix}
                </button>
              ))}
            </div>
          </div>

          {/* Validation Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 font-medium">
              {error}
            </div>
          )}

          {/* Action Reset Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Inputs
            </button>
            <span className="text-[11px] text-slate-500 font-mono">Live calculation updated on input</span>
          </div>
        </Card>

        {/* Quick Presets Side Card */}
        <Card className="border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Sample Network Scenarios
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click any scenario to instantly calculate standard network topologies:
          </p>

          <div className="space-y-2">
            {COMMON_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetSelect(preset.ip, preset.cidr)}
                className="w-full text-left p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {preset.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  IP: {preset.ip} • Mask: /{preset.cidr}
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Top Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Network Address */}
            <Card className="p-4 border-slate-800 bg-slate-950/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Network Address</span>
                <Network className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-sm sm:text-base font-bold font-mono text-cyan-300 truncate" title={result.networkAddress}>
                {result.networkAddress}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">/{result.cidr} CIDR</span>
            </Card>

            {/* Broadcast Address */}
            <Card className="p-4 border-slate-800 bg-slate-950/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Broadcast Address</span>
                <Radio className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm sm:text-base font-bold font-mono text-blue-300 truncate" title={result.broadcastAddress}>
                {result.broadcastAddress}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Host bits = 1</span>
            </Card>

            {/* Subnet Mask */}
            <Card className="p-4 border-slate-800 bg-slate-950/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Subnet Mask</span>
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-sm sm:text-base font-bold font-mono text-purple-300 truncate" title={result.subnetMask}>
                {result.subnetMask}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Wildcard: {result.wildcardMask}</span>
            </Card>

            {/* Usable Hosts */}
            <Card className="p-4 border-slate-800 bg-slate-950/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Usable Hosts</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-sm sm:text-base font-bold font-mono text-emerald-300 truncate">
                {result.usableHosts.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Total: {result.totalAddresses.toLocaleString()}</span>
            </Card>

            {/* Address Class */}
            <Card className="p-4 border-slate-800 bg-slate-950/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Address Class</span>
                <Globe className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-sm sm:text-base font-bold text-amber-300 truncate">
                {result.ipClass}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Classful Spec</span>
            </Card>

            {/* Address Type */}
            <Card className="p-4 border-slate-800 bg-slate-950/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Address Type</span>
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-sm sm:text-base font-bold text-teal-300 truncate">
                {result.addressType}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">RFC Compliance</span>
            </Card>
          </div>

          {/* User Requested Decimal & Binary Breakdown Table */}
          <Ipv4BreakdownTable result={result} />

          {/* 32-Bit Binary Pattern Visualization Card */}
          <Card className="border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Binary className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Bit Pattern Allocation Visualizer</h3>
                  <p className="text-xs text-slate-400">Visualization of Network bits (N) vs Host bits (H)</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-cyan-500/40 border border-cyan-400"></span>
                  <span className="text-cyan-300">Network Bits ({result.cidr})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-amber-500/40 border border-amber-400"></span>
                  <span className="text-amber-300">Host Bits ({32 - result.cidr})</span>
                </div>
              </div>
            </div>

            {/* Binary Bit Boxes */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
              {/* Bit Labels 1..32 */}
              <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-400">
                <span>Octet 1 (Bits 1-8)</span>
                <span>Octet 2 (Bits 9-16)</span>
                <span>Octet 3 (Bits 17-24)</span>
                <span>Octet 4 (Bits 25-32)</span>
              </div>

              {/* Bit Blocks */}
              <div className="grid grid-cols-4 gap-2">
                {result.binaryRepresentation.bitPattern.split('.').map((octetPattern, octetIdx) => (
                  <div key={octetIdx} className="flex gap-1">
                    {octetPattern.split('').map((bitType, bitIdx) => {
                      const absoluteBitIndex = octetIdx * 8 + bitIdx;
                      const isNetworkBit = absoluteBitIndex < result.cidr;

                      return (
                        <div
                          key={bitIdx}
                          className={`flex-1 py-2 text-center rounded text-xs font-bold font-mono transition-all ${
                            isNetworkBit
                              ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                              : 'bg-amber-950/80 border border-amber-500/50 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                          }`}
                          title={`Bit ${absoluteBitIndex + 1}: ${isNetworkBit ? 'Network Bit (N)' : 'Host Bit (H)'}`}
                        >
                          {bitType}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
