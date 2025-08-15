import PQueue from 'p-queue'

// Create a singleton queue instance
let claimQueue: PQueue | null = null

export function getClaimQueue(): PQueue {
  if (!claimQueue) {
    claimQueue = new PQueue({
      // Process only 1 claim at a time to ensure sequential execution
      concurrency: 1,
      // Set interval between requests to prevent rate limiting
      interval: 1000, // 1 second
      intervalCap: 1, // 1 request per interval
      // Add timeout to prevent stuck requests
      timeout: 60000, // 60 seconds timeout per claim
      // Enable automatic retry with exponential backoff
      throwOnTimeout: true,
    })
  }
  return claimQueue
}

// Helper to get queue statistics
export function getQueueStats() {
  if (!claimQueue) {
    return {
      size: 0,
      pending: 0,
      isPaused: false,
    }
  }
  
  return {
    size: claimQueue.size,
    pending: claimQueue.pending,
    isPaused: claimQueue.isPaused,
  }
}

// Clear the queue (for emergency use)
export function clearClaimQueue() {
  if (claimQueue) {
    claimQueue.clear()
  }
}