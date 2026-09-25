import React, { useState, useEffect } from 'react';
import type { VlsmDepartment, VlsmAllocation } from '../types';
import { 
  isValidIPv4, 
  isValidCIDR, 
  ipToLong, 
  longToIp, 
  cidrToMaskLong 
} from '../utils/ipUtils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GitMerge, Plus, Trash2, Zap, Table, Check, Copy } from 'lucide-react';

export const VlsmCalculator: React.FC = () => {
  const [baseIp, setBaseIp] = useState<string>('192.168.1.0');
  const [baseCidr, setBaseCidr] = useState<number>(24);
  const [departments, setDepartments] = useState<VlsmDepartment[]>([
    { id: '1', name: 'Engineering', hostsNeeded: 50 },
    { id: '2', name: 'Sales & Marketing', hostsNeeded: 25 },
    { id: '3', name: 'Human Resources', hostsNeeded: 10 },
    { id: '4', name: 'Management', hostsNeeded: 4 }
  ]);

  const [allocations, setAllocations] = useState<VlsmAllocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    handleCalculateVlsm();
  }, [baseIp, baseCidr, departments]);

  const handleAddDepartment = () => {
    const newDept: VlsmDepartment = {
      id: Date.now().toString(),
      name: `Department ${departments.length + 1}`,
      hostsNeeded: 10
    };
    setDepartments([...departments, newDept]);
  };

  const handleRemoveDepartment = (id: string) => {
    if (departments.length <= 1) return;
    setDepartments(departments.filter(d => d.id !== id));
  };

  const handleUpdateDepartment = (id: string, field: 'name' | 'hostsNeeded', value: string | number) => {
    setDepartments(departments.map(d => {
      if (d.id === id) {
        return { ...d, [field]: value };
      }
      return d;
    }));
  };

  const handleCalculateVlsm = () => {
    setError(null);
    if (!isValidIPv4(baseIp)) {
      setError('Please enter a valid base IPv4 address.');
      setAllocations([]);
      return;
    }
    if (!isValidCIDR(baseCidr)) {
      setError('Please select a valid base CIDR prefix.');
      setAllocations([]);
      return;
    }

    // Sort departments in descending order of required hosts (largest host count first for VLSM)
    const sorted = [...departments].sort((a, b) => b.hostsNeeded - a.hostsNeeded);
    let currentLong = ipToLong(baseIp) & cidrToMaskLong(baseCidr);

    const results: VlsmAllocation[] = [];

    for (const dept of sorted) {
      const needed = Math.max(1, dept.hostsNeeded);
      // Usable hosts formula = 2^(32 - prefix) - 2
      // So total addresses needed = hostsNeeded + 2
      let totalNeeded = needed + 2;
      let hostBits = Math.ceil(Math.log2(totalNeeded));
      if (hostBits < 2) hostBits = 2; // min /30 for point-to-point or small subnets
      
      const prefix = 32 - hostBits;
      const subnetSize = Math.pow(2, hostBits);
      const allocatedHosts = subnetSize - 2;

      const netLong = (currentLong) >>> 0;
      const bcastLong = (netLong + subnetSize - 1) >>> 0;
      const firstLong = netLong + 1;
      const lastLong = bcastLong - 1;

      results.push({
        department: dept.name,
        requiredHosts: dept.hostsNeeded,
        allocatedHosts,
        networkAddress: longToIp(netLong),
        cidr: prefix,
        subnetMask: longToIp(cidrToMaskLong(prefix)),
        firstHost: longToIp(firstLong),
        lastHost: longToIp(lastLong),
        broadcastAddress: longToIp(bcastLong)
      });

      // Move starting address for next department
      currentLong = (bcastLong + 1) >>> 0;
    }

    setAllocations(results);
  };

  const handleCopyAllocation = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <Card className="border-indigo-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100">VLSM Calculator</h1>
              <Badge variant="cyan">Variable Length Subnet Masking</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Efficiently allocate variable subnet sizes based on custom host requirements per department.
            </p>
          </div>
        </div>
      </Card>

      {/* Inputs Configuration & Department List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Base IP settings */}
        <Card className="border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            Major Network Block
          </h2>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Base Network Address</label>
              <input
                type="text"
                value={baseIp}
                onChange={(e) => setBaseIp(e.target.value)}
                placeholder="e.g. 192.168.1.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Base CIDR Prefix</label>
              <select
                value={baseCidr}
                onChange={(e) => setBaseCidr(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {Array.from({ length: 28 }, (_, i) => (
                  <option key={i} value={i}>
                    /{i} ({Math.pow(2, 32 - i).toLocaleString()} Total IPs)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
              {error}
            </div>
          )}
        </Card>

        {/* Department Host Requirements List */}
        <Card className="lg:col-span-2 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-indigo-400" />
              Department Host Requirements
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleAddDepartment}
            >
              Add Department
            </Button>
          </div>

          <div className="space-y-2.5">
            {departments.map((dept, index) => (
              <div key={dept.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-slate-500 w-6">#{index + 1}</span>
                <input
                  type="text"
                  value={dept.name}
                  onChange={(e) => handleUpdateDepartment(dept.id, 'name', e.target.value)}
                  placeholder="Department Name"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Needed Hosts:</span>
                  <input
                    type="number"
                    min="1"
                    value={dept.hostsNeeded}
                    onChange={(e) => handleUpdateDepartment(dept.id, 'hostsNeeded', parseInt(e.target.value, 10) || 1)}
                    className="w-20 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-mono text-right focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => handleRemoveDepartment(dept.id)}
                  disabled={departments.length <= 1}
                  className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                  title="Remove Department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* VLSM Allocation Results Table */}
      {allocations.length > 0 && (
        <Card className="border-indigo-500/30 overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-slate-100">
                VLSM Allocation Summary ({allocations.length} Subnets Allocated)
              </h2>
            </div>
            <Badge variant="cyan">Sorted by Host Count</Badge>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold font-sans">
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3 text-center">Req. Hosts</th>
                  <th className="py-3 px-3 text-center">Alloc. Hosts</th>
                  <th className="py-3 px-3">Network Address</th>
                  <th className="py-3 px-3">Subnet Mask</th>
                  <th className="py-3 px-3">Usable Host Range</th>
                  <th className="py-3 px-3">Broadcast Address</th>
                  <th className="py-3 px-3 text-center">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {allocations.map((alloc, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 font-sans font-bold text-slate-200">{alloc.department}</td>
                    <td className="py-3 px-3 text-center text-amber-300 font-bold">{alloc.requiredHosts}</td>
                    <td className="py-3 px-3 text-center text-emerald-300 font-bold">{alloc.allocatedHosts}</td>
                    <td className="py-3 px-3 text-cyan-300 font-bold">{alloc.networkAddress}/{alloc.cidr}</td>
                    <td className="py-3 px-3 text-purple-300">{alloc.subnetMask}</td>
                    <td className="py-3 px-3 text-slate-200">
                      {alloc.firstHost} - {alloc.lastHost}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{alloc.broadcastAddress}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleCopyAllocation(`${alloc.networkAddress}/${alloc.cidr}`, idx)}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 transition-colors"
                        title="Copy CIDR"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
