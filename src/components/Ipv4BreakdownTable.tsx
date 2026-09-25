import React, { useState } from 'react';
import type { CalculationResult } from '../types';
import { ipToBinaryString } from '../utils/ipUtils';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Copy, Check, Binary, Table } from 'lucide-react';

interface BreakdownTableProps {
  result: CalculationResult;
}

export const Ipv4BreakdownTable: React.FC<BreakdownTableProps> = ({ result }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rows = [
    {
      field: 'IP Address',
      decimal: result.ipAddress,
      binary: ipToBinaryString(result.ipAddress),
      badge: result.ipClass
    },
    {
      field: 'Subnet Mask',
      decimal: result.subnetMask,
      binary: ipToBinaryString(result.subnetMask),
      badge: `/${result.cidr}`
    },
    {
      field: 'Network Address',
      decimal: result.networkAddress,
      binary: ipToBinaryString(result.networkAddress),
      badge: 'Network ID'
    },
    {
      field: 'Broadcast Address',
      decimal: result.broadcastAddress,
      binary: ipToBinaryString(result.broadcastAddress),
      badge: 'Broadcast'
    },
    {
      field: 'First Usable Host',
      decimal: result.firstUsableHost,
      binary: ipToBinaryString(result.firstUsableHost),
      badge: 'Start Range'
    },
    {
      field: 'Last Usable Host',
      decimal: result.lastUsableHost,
      binary: ipToBinaryString(result.lastUsableHost),
      badge: 'End Range'
    },
    {
      field: 'Usable Hosts',
      decimal: result.usableHosts.toLocaleString(),
      binary: `(2^(${32 - result.cidr}) - 2 = ${result.totalAddresses.toLocaleString()} - 2)`,
      badge: 'Capacity',
      isFormula: true
    }
  ];

  return (
    <Card className="overflow-hidden border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">IPv4 Decimal & Binary Breakdown</h3>
            <p className="text-xs text-slate-400">Detailed 32-bit binary octet alignment & calculation summary</p>
          </div>
        </div>
        <Badge variant="cyan" className="font-mono">
          <Binary className="w-3.5 h-3.5 mr-1" />
          32-Bit Representation
        </Badge>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-xs text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4 w-1/4">Field</th>
              <th className="py-3 px-4 w-1/4">Decimal</th>
              <th className="py-3 px-4 w-2/4">Binary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {rows.map((row, idx) => {
              const decimalCopyKey = `dec-${idx}`;
              const binaryCopyKey = `bin-${idx}`;

              return (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  {/* Field Name */}
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-200">
                    <div className="flex items-center gap-2">
                      <span>{row.field}</span>
                      {row.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {row.badge}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Decimal Value */}
                  <td className="py-3.5 px-4 text-cyan-300 font-semibold">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-100 group cursor-pointer hover:border-cyan-500/50"
                         onClick={() => handleCopy(row.decimal, decimalCopyKey)}
                    >
                      <span>{row.decimal}</span>
                      <button className="text-slate-500 group-hover:text-cyan-400 transition-colors ml-1" title="Copy Decimal">
                        {copiedKey === decimalCopyKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>

                  {/* Binary Value / Formula */}
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] group cursor-pointer hover:border-cyan-500/50 w-full sm:w-auto"
                         onClick={() => handleCopy(row.binary, binaryCopyKey)}
                    >
                      <span className={row.isFormula ? 'text-amber-300 font-sans font-medium' : 'text-slate-200 tracking-wider'}>
                        {row.binary}
                      </span>
                      <button className="text-slate-500 group-hover:text-cyan-400 transition-colors ml-auto" title="Copy Binary">
                        {copiedKey === binaryCopyKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
