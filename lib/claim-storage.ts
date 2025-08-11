import fs from 'fs/promises'
import path from 'path'

export interface ClaimRecord {
  privyUserId: string
  walletAddress: string
  signature: string
  assetId?: string
  claimedAt: string
  network: string
}

// Storage file path - in production, use a database instead
const STORAGE_FILE = path.join(process.cwd(), 'data', 'claimed-nfts.json')

// Ensure the data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(STORAGE_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load all claim records
export async function loadClaimRecords(): Promise<ClaimRecord[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(STORAGE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty array
      return []
    }
    throw error
  }
}

// Save a new claim record
export async function saveClaimRecord(record: ClaimRecord): Promise<void> {
  await ensureDataDir()
  const records = await loadClaimRecords()
  
  // Check if already exists (shouldn't happen but just in case)
  const existing = records.find(r => 
    r.privyUserId === record.privyUserId || 
    r.walletAddress === record.walletAddress
  )
  
  if (existing) {
    throw new Error('Claim record already exists')
  }
  
  records.push(record)
  await fs.writeFile(STORAGE_FILE, JSON.stringify(records, null, 2))
}

// Check if a user has claimed
export async function hasUserClaimed(privyUserId: string): Promise<ClaimRecord | null> {
  const records = await loadClaimRecords()
  return records.find(r => r.privyUserId === privyUserId) || null
}

// Check if a wallet has claimed
export async function hasWalletClaimed(walletAddress: string): Promise<ClaimRecord | null> {
  const records = await loadClaimRecords()
  return records.find(r => r.walletAddress === walletAddress) || null
}

// Check if either user or wallet has claimed
export async function hasClaimedNFT(privyUserId?: string, walletAddress?: string, network?: string): Promise<ClaimRecord | null> {
  const records = await loadClaimRecords()
  
  // If network is specified, only check claims for that network
  const filteredRecords = network 
    ? records.filter(r => r.network === network)
    : records
  
  if (privyUserId) {
    const userRecord = filteredRecords.find(r => r.privyUserId === privyUserId)
    if (userRecord) return userRecord
  }
  
  if (walletAddress) {
    const walletRecord = filteredRecords.find(r => r.walletAddress === walletAddress)
    if (walletRecord) return walletRecord
  }
  
  return null
}

// Get all claim records (for admin/debugging)
export async function getAllClaimRecords(): Promise<ClaimRecord[]> {
  return loadClaimRecords()
}