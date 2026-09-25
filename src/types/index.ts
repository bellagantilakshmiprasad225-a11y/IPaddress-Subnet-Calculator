export type ActiveView = 
  | 'dashboard' 
  | 'ipv4' 
  | 'subnet' 
  | 'vlsm' 
  | 'history' 
  | 'about';

export interface CalculationResult {
  id: string;
  ipAddress: string;
  cidr: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalAddresses: number;
  usableHosts: number;
  ipClass: string;
  addressType: 'Public' | 'Private' | 'Loopback' | 'Link-Local' | 'Multicast' | 'Reserved';
  binaryRepresentation: {
    ipBinary: string;
    maskBinary: string;
    bitPattern: string; // NNNNNNNN.HHHHHHHH...
  };
  timestamp: number;
}

export interface SubnetGeneratorRow {
  subnetNumber: number;
  networkAddress: string;
  cidr: number;
  subnetMask: string;
  firstHost: string;
  lastHost: string;
  broadcastAddress: string;
  usableHosts: number;
}

export interface VlsmDepartment {
  id: string;
  name: string;
  hostsNeeded: number;
}

export interface VlsmAllocation {
  department: string;
  requiredHosts: number;
  allocatedHosts: number;
  networkAddress: string;
  cidr: number;
  subnetMask: string;
  firstHost: string;
  lastHost: string;
  broadcastAddress: string;
}
