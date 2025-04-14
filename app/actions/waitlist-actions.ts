'use server'

// Define the response type
type WaitlistResponse = {
  success: boolean
  message?: string
}

export async function registerForWaitlist(
  email: string,
): Promise<WaitlistResponse> {
  try {
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        message: 'Please provide a valid email address',
      }
    }

    // Mock successful registration (UI only version)
    console.log('Would register email:', email)

    // Simulate a slight delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error registering for waitlist:', error)
    return {
      success: false,
      message: 'Failed to register. Please try again later.',
    }
  }
}
