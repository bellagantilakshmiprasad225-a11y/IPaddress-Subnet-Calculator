import React, { useState, useEffect } from 'react';
import type { CalculationResult } from '../types';
import { 
  getCalculationHistory, 
  deleteHistoryItem, 
  clearCalculationHistory 
} from '../utils/ipUtils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { History, Trash2 } from 'lucide-react';
import { Ipv4BreakdownTable } from '../components/Ipv4BreakdownTable';

interface HistoryPageProps {
  historyCount?: number;
}

export const HistoryPage: React.FC<HistoryPageProps> = () => {
  const [historyList, setHistoryList] = useState<CalculationResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<CalculationResult | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const list = getCalculationHistory();
    setHistoryList(list);
    if (list.length > 0 && !selectedItem) {
      setSelectedItem(list[0]);
    }
  };

  const handleDelete = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistoryList(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleClearAll = () => {
    clearCalculationHistory();
    setHistoryList([]);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <Card className="border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">Calculation History</h1>
                <Badge variant="cyan">{historyList.length} Saved Records</Badge>
              </div>
              <p className="text-xs text-slate-400">
                View, review breakdown tables, copy, and clear your previous calculations.
              </p>
            </div>
          </div>

          {historyList.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={handleClearAll}
            >
              Clear All History
            </Button>
          )}
        </div>
      </Card>

      {historyList.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No History Saved Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Calculations performed in the IPv4 Calculator will appear here when you click "Save Result".
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History List Side Column */}
          <Card className="border-slate-800 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Saved Calculations ({historyList.length})
            </h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {historyList.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const formattedDate = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-cyan-300">
                          {item.ipAddress}/{item.cidr}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {item.ipClass}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Net: {item.networkAddress} • Usable: {item.usableHosts.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">{formattedDate}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Selected Record Breakdown Detail View */}
          <div className="lg:col-span-2 space-y-6">
            {selectedItem && (
              <>
                <Card className="border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">Selected Target</span>
                      <h2 className="text-xl font-bold text-slate-100 font-mono text-cyan-300">
                        {selectedItem.ipAddress}/{selectedItem.cidr}
                      </h2>
                    </div>
                    <Badge variant="cyan">{selectedItem.addressType}</Badge>
                  </div>
                </Card>

                {/* Exact Decimal & Binary Breakdown Table Component */}
                <Ipv4BreakdownTable result={selectedItem} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
