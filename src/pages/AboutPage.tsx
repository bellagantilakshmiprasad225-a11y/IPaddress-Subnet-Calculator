import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BookOpen, ShieldCheck, Terminal } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const FORMULAS = [
    {
      name: 'Host Bits',
      formula: 'hostBits = 32 - prefixLength',
      description: 'Calculates the remaining number of bits allocated to identify host devices in a subnet.'
    },
    {
      name: 'Total Addresses',
      formula: 'totalAddresses = 2 ^ hostBits',
      description: 'Total number of IPv4 addresses contained within the subnet range.'
    },
    {
      name: 'Usable Hosts',
      formula: 'usableHosts = (2 ^ hostBits) - 2',
      description: 'Deduct network address (all 0s) and broadcast address (all 1s). Exception: /31 and /32 prefixes.'
    },
    {
      name: 'Network Address',
      formula: 'Network = IP & SubnetMask',
      description: 'Bitwise AND between 32-bit IP address and 32-bit Subnet Mask.'
    },
    {
      name: 'Broadcast Address',
      formula: 'Broadcast = Network | WildcardMask',
      description: 'Bitwise OR between 32-bit Network Address and 32-bit Wildcard Mask (~SubnetMask).'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-cyan-500/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">About NetCIDR & Networking Guide</h2>
            <p className="text-xs text-slate-400">Computer Networks Reference Documentation & RFC Standards</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          NetCIDR is a client-side computer networking dashboard built with React, TypeScript, and Tailwind CSS. It performs real-time IPv4 bitwise mathematics, subnet partition table generation, and VLSM allocations without relying on any external backend APIs.
        </p>
      </Card>

      {/* Networking Formulas */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          Subnetting Mathematical Formulas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORMULAS.map((item, idx) => (
            <Card key={idx} hoverable={false} className="border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-200">{item.name}</span>
                <Badge variant="cyan" size="sm">Formula</Badge>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 mb-2">
                {item.formula}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* RFC Standards Reference */}
      <Card className="border-slate-800 bg-slate-950/60">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          RFC Standards Implemented
        </h3>
        <ul className="space-y-3 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="font-mono text-cyan-400 font-bold">RFC 1918:</span>
            <span>Defines Private IPv4 address space (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) reserved for internal private networks.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-cyan-400 font-bold">RFC 3021:</span>
            <span>Allows 31-bit prefixes (/31) for point-to-point links, enabling 2 usable host addresses without wasting network/broadcast IDs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-cyan-400 font-bold">RFC 4632:</span>
            <span>Classless Inter-Domain Routing (CIDR) specification for flexible address aggregation and routing table reduction.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
