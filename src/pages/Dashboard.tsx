import React from 'react';
import type { ActiveView } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Calculator, 
  Network, 
  GitMerge, 
  History, 
  ArrowRight, 
  BookOpen, 
  Globe, 
  Layers, 
  Radio, 
  Binary, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: ActiveView) => void;
  historyCount?: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, historyCount = 0 }) => {
  const TOOL_CARDS = [
    {
      id: 'ipv4' as ActiveView,
      title: 'IPv4 Calculator',
      description: 'Calculate subnet mask, network address, broadcast address, first/last usable host range, address class & type.',
      icon: Calculator,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Core Tool',
      glow: 'cyan' as const
    },
    {
      id: 'subnet' as ActiveView,
      title: 'Subnet Table Generator',
      description: 'Divide any base IP network into multiple equal-sized subnets based on required subnets count.',
      icon: Network,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Generator',
      glow: 'blue' as const
    },
    {
      id: 'vlsm' as ActiveView,
      title: 'VLSM Calculator',
      description: 'Variable-Length Subnet Mask allocation based on custom host counts for multiple departments.',
      icon: GitMerge,
      color: 'from-indigo-500 to-purple-600',
      badge: 'Advanced',
      glow: 'cyan' as const
    },
    {
      id: 'history' as ActiveView,
      title: 'Calculation History',
      description: 'View, copy, filter, and manage your previously calculated IP subnets stored locally in your browser.',
      icon: History,
      color: 'from-slate-700 to-slate-800',
      badge: `${historyCount} Saved`,
      glow: 'blue' as const
    }
  ];

  const EDUCATIONAL_CONCEPTS = [
    {
      title: 'IPv4 Address',
      icon: Globe,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgColor: 'bg-cyan-950/30',
      summary: 'A 32-bit numerical label assigned to every device connected to a computer network that uses IPv4 protocol.',
      points: [
        'Formatted as 4 octets separated by dots (e.g. 192.168.1.1)',
        'Each octet contains 8 bits, ranging from 0 to 255',
        'Provides ~4.3 billion unique IP addresses globally'
      ]
    },
    {
      title: 'CIDR Notation',
      icon: Binary,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-950/30',
      summary: 'Classless Inter-Domain Routing replaces traditional Class A/B/C networks by denoting prefix length.',
      points: [
        'Written as a slash followed by prefix length (e.g., /24)',
        'Denotes the exact number of 1s in the subnet mask',
        'Allows flexible network sizing without wasteful static classes'
      ]
    },
    {
      title: 'Subnetting',
      icon: Layers,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-950/30',
      summary: 'The practice of logically partitioning a single physical IP network into multiple smaller subnetworks.',
      points: [
        'Reduces broadcast domain size to boost network performance',
        'Enhances security by isolating distinct departments/VLANs',
        'Maximizes IPv4 address space utilization efficiency'
      ]
    },
    {
      title: 'Network Address',
      icon: Radio,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-950/30',
      summary: 'The first address in a subnet, used to identify the entire network segment itself.',
      points: [
        'All host bits in the address are set to 0',
        'Calculated by performing bitwise AND between IP and Subnet Mask',
        'Cannot be assigned to individual host devices'
      ]
    },
    {
      title: 'Broadcast Address',
      icon: Sparkles,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-950/30',
      summary: 'The last address in a subnet, reserved to send data packets simultaneously to all hosts on the subnet.',
      points: [
        'All host bits in the address are set to 1',
        'Calculated by bitwise OR between Network Address and Wildcard Mask',
        'Reserved for network broadcast operations'
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Banner */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="cyan">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Network Engineering Tool
              </Badge>
              <Badge variant="blue">v1.0 Ready</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              IP Address & <span className="text-gradient-cyan">Subnet Calculator</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore interactive network calculations, equal-size subnetting, VLSM allocation, and binary bitwise visualizations. Designed for computer networks students and network administrators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={<Calculator className="w-5 h-5" />}
              onClick={() => onNavigate('ipv4')}
            >
              Open IPv4 Calculator
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<BookOpen className="w-5 h-5" />}
              onClick={() => onNavigate('about')}
            >
              Guide & Concepts
            </Button>
          </div>
        </div>
      </Card>

      {/* Tool Shortcut Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            Network Calculation Tools
          </h2>
          <span className="text-xs text-slate-400 font-mono">4 Modules Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOL_CARDS.map(tool => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                glow={tool.glow}
                className="flex flex-col justify-between group cursor-pointer"
                onClick={() => onNavigate(tool.id)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} text-slate-950 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="cyan" size="sm">{tool.badge}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:border-cyan-400/50"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Launch Module
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Computer Networking Concepts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Essential Computer Networking Concepts
          </h2>
          <Badge variant="blue">Educational Guide</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EDUCATIONAL_CONCEPTS.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <Card
                key={index}
                hoverable={true}
                className={`border ${concept.borderColor} ${concept.bgColor}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-slate-900/80 border ${concept.borderColor}`}>
                    <Icon className={`w-5 h-5 ${concept.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{concept.title}</h3>
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed font-normal">
                  {concept.summary}
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  {concept.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${concept.color}`} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
