import type { CalculationResult } from '../types';

/**
 * Validates IPv4 format (4 octets, each 0-255)
 */
export function isValidIPv4(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    if (!/^\d+$/.test(part)) return false;
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && (part === '0' || !part.startsWith('0'));
  });
}

/**
 * Validates CIDR prefix (0 - 32)
 */
export function isValidCIDR(prefix: number | string): boolean {
  const num = typeof prefix === 'string' ? parseInt(prefix, 10) : prefix;
  return !isNaN(num) && num >= 0 && num <= 32;
}

/**
 * Convert IPv4 string to 32-bit unsigned integer
 */
export function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

/**
 * Convert 32-bit unsigned integer to IPv4 string
 */
export function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255
  ].join('.');
}

/**
 * Convert 32-bit number to binary string with octet dots
 */
export function longToBinary(long: number): string {
  const bin = (long >>> 0).toString(2).padStart(32, '0');
  return `${bin.slice(0, 8)}.${bin.slice(8, 16)}.${bin.slice(16, 24)}.${bin.slice(24, 32)}`;
}

/**
 * Convert IPv4 address string directly to binary string with octet dots
 */
export function ipToBinaryString(ip: string): string {
  if (!isValidIPv4(ip)) return '00000000.00000000.00000000.00000000';
  return longToBinary(ipToLong(ip));
}

/**
 * Create CIDR subnet mask as 32-bit number
 */
export function cidrToMaskLong(prefix: number): number {
  if (prefix === 0) return 0;
  return ((0xFFFFFFFF << (32 - prefix)) >>> 0);
}

/**
 * Determine IPv4 Address Class (A, B, C, D, E)
 */
export function getIPClass(ip: string): string {
  const firstOctet = parseInt(ip.split('.')[0], 10);
  if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
  if (firstOctet === 127) return 'Class A (Loopback)';
  if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
  if (firstOctet >= 240 && firstOctet <= 255) return 'Class E (Experimental)';
  return 'Unknown';
}

/**
 * Determine Address Type (Public vs Private vs Loopback etc.)
 */
export function getAddressType(ip: string): 'Public' | 'Private' | 'Loopback' | 'Link-Local' | 'Multicast' | 'Reserved' {
  const octets = ip.split('.').map(n => parseInt(n, 10));
  const [o1, o2] = octets;

  if (o1 === 127) return 'Loopback';
  if (o1 === 10) return 'Private';
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return 'Private';
  if (o1 === 192 && o2 === 168) return 'Private';
  if (o1 === 169 && o2 === 254) return 'Link-Local';
  if (o1 >= 224 && o1 <= 239) return 'Multicast';
  if (o1 >= 240) return 'Reserved';
  return 'Public';
}

/**
 * Full IPv4 Calculation engine
 */
export function calculateIPv4(ip: string, cidr: number): CalculationResult {
  const ipLong = ipToLong(ip);
  const maskLong = cidrToMaskLong(cidr);
  const wildcardLong = (~maskLong) >>> 0;
  const netLong = (ipLong & maskLong) >>> 0;
  const bcastLong = (netLong | wildcardLong) >>> 0;

  const totalAddresses = Math.pow(2, 32 - cidr);
  
  // Usable host logic
  let usableHosts = 0;
  let firstHostLong = 0;
  let lastHostLong = 0;

  if (cidr === 32) {
    usableHosts = 1;
    firstHostLong = netLong;
    lastHostLong = netLong;
  } else if (cidr === 31) {
    usableHosts = 2; // RFC 3021 Point-to-Point
    firstHostLong = netLong;
    lastHostLong = bcastLong;
  } else {
    usableHosts = Math.max(0, totalAddresses - 2);
    firstHostLong = netLong + 1;
    lastHostLong = bcastLong - 1;
  }

  // Bit pattern string (N for Network bit, H for Host bit)
  const bitPatternParts: string[] = [];
  let bitCount = 0;
  for (let i = 0; i < 4; i++) {
    let octetPattern = '';
    for (let j = 0; j < 8; j++) {
      octetPattern += bitCount < cidr ? 'N' : 'H';
      bitCount++;
    }
    bitPatternParts.push(octetPattern);
  }

  return {
    id: `${ip}-${cidr}-${Date.now()}`,
    ipAddress: ip,
    cidr,
    subnetMask: longToIp(maskLong),
    wildcardMask: longToIp(wildcardLong),
    networkAddress: longToIp(netLong),
    broadcastAddress: longToIp(bcastLong),
    firstUsableHost: longToIp(firstHostLong),
    lastUsableHost: longToIp(lastHostLong),
    totalAddresses,
    usableHosts,
    ipClass: getIPClass(ip),
    addressType: getAddressType(ip),
    binaryRepresentation: {
      ipBinary: longToBinary(ipLong),
      maskBinary: longToBinary(maskLong),
      bitPattern: bitPatternParts.join('.')
    },
    timestamp: Date.now()
  };
}

const HISTORY_KEY = 'ip_subnet_calc_history';

export function getCalculationHistory(): CalculationResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load calculation history', e);
    return [];
  }
}

export function saveCalculationToHistory(result: CalculationResult): CalculationResult[] {
  try {
    const history = getCalculationHistory();
    // Prevent duplicate adjacent entries
    const filtered = history.filter(item => !(item.ipAddress === result.ipAddress && item.cidr === result.cidr));
    const updated = [result, ...filtered].slice(0, 50); // Keep top 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save calculation to history', e);
    return [];
  }
}

export function deleteHistoryItem(id: string): CalculationResult[] {
  try {
    const history = getCalculationHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete history item', e);
    return [];
  }
}

export function clearCalculationHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear calculation history', e);
  }
}

