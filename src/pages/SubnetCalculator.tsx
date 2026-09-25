import React, { useState, useEffect } from 'react';
import type { SubnetGeneratorRow } from '../types';
import { 
  isValidIPv4, 
  isValidCIDR, 
  ipToLong, 
  longToIp, 
  cidrToMaskLong 
} from '../utils/ipUtils';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Network, Zap, Table, Copy, Check } from 'lucide-react';

export const SubnetCalculator: React.FC = () => {
  const [baseIp, setBaseIp] = useState<string>('192.168.1.0');
  const [baseCidr, setBaseCidr] = useState<number>(24);
  const [numSubnets, setNumSubnets] = useState<number>(4);
  const [subnetsList, setSubnetsList] = useState<SubnetGeneratorRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    handleGenerateSubnets(baseIp, baseCidr, numSubnets);
  }, []);

  const handleGenerateSubnets = (ip: string, cidr: number, count: number) => {
    setError(null);
    if (!isValidIPv4(ip)) {
      setError('Please enter a valid base IPv4 address (e.g. 192.168.1.0).');
      setSubnetsList([]);
      return;
    }
    if (!isValidCIDR(cidr)) {
      setError('CIDR prefix must be between 0 and 30.');
      setSubnetsList([]);
      return;
    }

    // Calculate additional bits needed for `count` subnets
    const bitsNeeded = Math.ceil(Math.log2(Math.max(1, count)));
    const newCidr = cidr + bitsNeeded;

    if (newCidr > 32) {
      setError(`Cannot divide /${cidr} network into ${count} subnets (requires /${newCidr} which exceeds 32 bits).`);
      setSubnetsList([]);
      return;
    }

    const actualSubnetsCount = Math.pow(2, bitsNeeded);
    const subnetAddressesCount = Math.pow(2, 32 - newCidr);
    const baseLong = ipToLong(ip);
    const baseMask = cidrToMaskLong(cidr);
    const networkBaseLong = (baseLong & baseMask) >>> 0;

    const rows: SubnetGeneratorRow[] = [];

    for (let i = 0; i < actualSubnetsCount; i++) {
      const netLong = (networkBaseLong + i * subnetAddressesCount) >>> 0;
      const bcastLong = (netLong + subnetAddressesCount - 1) >>> 0;
      
      let usable = 0;
      let first = netLong;
      let last = bcastLong;

      if (newCidr === 32) {
        usable = 1;
      } else if (newCidr === 31) {
        usable = 2;
      } else {
        usable = Math.max(0, subnetAddressesCount - 2);
        first = netLong + 1;
        last = bcastLong - 1;
      }

      rows.push({
        subnetNumber: i + 1,
        networkAddress: longToIp(netLong),
        cidr: newCidr,
        subnetMask: longToIp(cidrToMaskLong(newCidr)),
        firstHost: longToIp(first),
        lastHost: longToIp(last),
        broadcastAddress: longToIp(bcastLong),
        usableHosts: usable
      });
    }

    setSubnetsList(rows);
  };

  const handleCopySubnet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100">Subnet Table Generator</h1>
              <Badge variant="blue">Equal Subnet Partitioning</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Divide any parent network into equal subnetworks based on target subnet counts or prefix borrowing.
            </p>
          </div>
        </div>
      </Card>

      {/* Input Configuration Card */}
      <Card className="border-slate-800 space-y-5">
        <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          Base Network Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Base IP */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Base Network Address</label>
            <input
              type="text"
              value={baseIp}
              onChange={(e) => {
                const val = e.target.value;
                setBaseIp(val);
                handleGenerateSubnets(val, baseCidr, numSubnets);
              }}
              placeholder="e.g. 192.168.1.0"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Base CIDR */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Base CIDR Prefix</label>
            <select
              value={baseCidr}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setBaseCidr(val);
                handleGenerateSubnets(baseIp, val, numSubnets);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {Array.from({ length: 30 }, (_, i) => (
                <option key={i} value={i}>
                  /{i} ({Math.pow(2, 32 - i).toLocaleString()} Total IPs)
                </option>
              ))}
            </select>
          </div>

          {/* Number of Subnets required */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Subnets Count</label>
            <select
              value={numSubnets}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setNumSubnets(val);
                handleGenerateSubnets(baseIp, baseCidr, val);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {[2, 4, 8, 16, 32, 64, 128, 256].map((num) => (
                <option key={num} value={num}>
                  {num} Subnets (+{Math.log2(num)} bits)
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

      {/* Generated Subnets Table */}
      {subnetsList.length > 0 && (
        <Card className="border-blue-500/30 overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-slate-100">
                Generated Subnets ({subnetsList.length} Equal Subnets)
              </h2>
            </div>
            <Badge variant="blue" className="font-mono">
              New Prefix: /{subnetsList[0].cidr}
            </Badge>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold font-sans">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Network Address</th>
                  <th className="py-3 px-3">CIDR</th>
                  <th className="py-3 px-3">Subnet Mask</th>
                  <th className="py-3 px-3">Usable Host Range</th>
                  <th className="py-3 px-3">Broadcast Address</th>
                  <th className="py-3 px-3 text-right">Usable Hosts</th>
                  <th className="py-3 px-3 text-center">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {subnetsList.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-sans font-bold">{sub.subnetNumber}</td>
                    <td className="py-3 px-3 text-cyan-300 font-bold">{sub.networkAddress}</td>
                    <td className="py-3 px-3 text-slate-300">/{sub.cidr}</td>
                    <td className="py-3 px-3 text-purple-300">{sub.subnetMask}</td>
                    <td className="py-3 px-3 text-emerald-300">
                      {sub.firstHost} - {sub.lastHost}
                    </td>
                    <td className="py-3 px-3 text-amber-300">{sub.broadcastAddress}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-200">
                      {sub.usableHosts.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleCopySubnet(`${sub.networkAddress}/${sub.cidr}`, idx)}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
                        title="Copy Subnet CIDR"
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
