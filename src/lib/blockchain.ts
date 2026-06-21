import { ethers } from "ethers";
import { BlockchainSessionRecord, BlockchainSessionType } from "./types/blockchain";

/**
 * Blockchain Client Service for communicating with the SessionRegistry smart contract on Polygon Amoy.
 */

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "https://rpc-amoy.polygon.technology";
const CONTRACT_ADDRESS = process.env.BLOCKCHAIN_CONTRACT_ADDRESS || process.env.CONSULTATION_REGISTRY_ADDRESS;

const PRIVATE_KEYS: string[] = [];
if (process.env.BLOCKCHAIN_PRIVATE_KEYS) {
  PRIVATE_KEYS.push(...process.env.BLOCKCHAIN_PRIVATE_KEYS.split(",").map(k => k.trim()).filter(Boolean));
} else if (process.env.BLOCKCHAIN_PRIVATE_KEY) {
  PRIVATE_KEYS.push(process.env.BLOCKCHAIN_PRIVATE_KEY);
}

// ABI matching the SessionRegistry solidity contract
const CONTRACT_ABI = [
  "function registerSession(string calldata sessionId, uint8 sessionType, string calldata ipfsCid) external",
  "function getSession(string calldata sessionId) external view returns (string memory id, uint8 sessionType, string memory ipfsCid, uint256 timestamp, address registeredBy)",
  "function isSessionRegistered(string calldata sessionId) external view returns (bool)"
];

/**
 * Creates a standard JSON-RPC provider connected to the target network.
 * @returns JSON-RPC Provider
 */
export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL);
}

/**
 * Creates a Wallet signer using the configured backend private key.
 * @param provider The RPC provider to link to the wallet
 * @param privateKey Optional specific private key to use
 * @returns Wallet Signer instance
 */
export function getSigner(provider: ethers.JsonRpcProvider, privateKey?: string): ethers.Wallet {
  const key = privateKey || PRIVATE_KEYS[0];
  if (!key) {
    throw new Error("No blockchain private key configured. Define BLOCKCHAIN_PRIVATE_KEY or BLOCKCHAIN_PRIVATE_KEYS.");
  }
  return new ethers.Wallet(key, provider);
}

/**
 * Creates a read-only contract instance connected to the provider.
 * @param provider The RPC provider
 * @returns Contract Instance
 */
export function getReadOnlyContract(provider: ethers.JsonRpcProvider): ethers.Contract {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Smart contract address (BLOCKCHAIN_CONTRACT_ADDRESS / CONSULTATION_REGISTRY_ADDRESS) is not configured.");
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

/**
 * Creates a write-enabled contract instance connected to the wallet signer.
 * @param signer The signed wallet instance
 * @returns Contract Instance
 */
export function getSignedContract(signer: ethers.Wallet): ethers.Contract {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Smart contract address (BLOCKCHAIN_CONTRACT_ADDRESS / CONSULTATION_REGISTRY_ADDRESS) is not configured.");
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

/**
 * Submits a transaction to register a session's audit log (IPFS CID) on the blockchain.
 * Uses the admin wallet for zero-gas fee user transactions (gasless).
 * @param sessionId The unique ID of the session or appointment in database
 * @param sessionType The type of session (AI = 0, Psychologist = 1)
 * @param ipfsCid The CID returned from Pinata
 * @returns The blockchain transaction hash
 */
export async function registerSessionOnChain(
  sessionId: string,
  sessionType: BlockchainSessionType,
  ipfsCid: string
): Promise<string> {
  const provider = getProvider();

  if (PRIVATE_KEYS.length === 0) {
    throw new Error("No blockchain private keys available for signing transactions.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lastError: any = null;

  // Try each private key in the pool sequentially (Wallet Rotation Failover)
  for (let i = 0; i < PRIVATE_KEYS.length; i++) {
    const key = PRIVATE_KEYS[i];
    try {
      console.log(`Attempting on-chain registration with Wallet ${i + 1}/${PRIVATE_KEYS.length}...`);
      const signer = getSigner(provider, key);
      
      // Proactively check balance (prevents out-of-gas reverts)
      const balance = await provider.getBalance(signer.address);
      if (balance === BigInt(0)) {
        console.warn(`Wallet ${i + 1} (${signer.address}) has 0 MATIC. Skipping to next wallet...`);
        continue;
      }

      const contract = getSignedContract(signer);

      // Call contract function
      const tx = await contract.registerSession(sessionId, sessionType, ipfsCid);
      
      // Wait for the transaction to be mined (1 confirmation)
      const receipt = await tx.wait();
      
      if (!receipt || receipt.status !== 1) {
        throw new Error(`Transaction reverted on-chain. Hash: ${tx.hash}`);
      }

      console.log(`Successfully registered session on-chain using Wallet ${i + 1}! Hash: ${receipt.hash}`);
      return receipt.hash;
    } catch (error) {
      console.warn(`Wallet ${i + 1} transaction failed:`, (error as Error).message);
      lastError = error;
      // Loop continues to attempt with the next wallet key
    }
  }

  // If we reach here, all wallets failed
  console.error(`All ${PRIVATE_KEYS.length} wallets failed to register session ${sessionId} on Polygon Amoy.`);
  throw lastError || new Error("Failed to register session using any of the configured wallets.");
}

/**
 * Reads a registered session record from the smart contract ledger.
 * @param sessionId The database ID of the session
 * @returns The BlockchainSessionRecord data, or null if not registered
 */
export async function getSessionFromChain(
  sessionId: string
): Promise<BlockchainSessionRecord | null> {
  try {
    const provider = getProvider();
    const contract = getReadOnlyContract(provider);

    // Check presence first to prevent revert errors
    const isRegistered = await contract.isSessionRegistered(sessionId);
    if (!isRegistered) {
      return null;
    }

    const result = await contract.getSession(sessionId);
    
    return {
      id: result[0],
      sessionType: Number(result[1]) as BlockchainSessionType,
      ipfsCid: result[2],
      timestamp: BigInt(result[3]),
      registeredBy: result[4],
    };
  } catch (error) {
    console.error(`Failed to retrieve session ${sessionId} from smart contract:`, error);
    throw error;
  }
}

/**
 * Verifies if a session has been logged on-chain.
 * @param sessionId The database ID of the session
 * @returns boolean indicating registration status
 */
export async function isSessionRegisteredOnChain(sessionId: string): Promise<boolean> {
  try {
    const provider = getProvider();
    const contract = getReadOnlyContract(provider);
    return await contract.isSessionRegistered(sessionId);
  } catch (error) {
    console.error(`Failed to check session registration status for ${sessionId}:`, error);
    return false;
  }
}
