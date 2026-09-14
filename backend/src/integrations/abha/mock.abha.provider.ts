export interface AbhaVerificationResult {
  success: boolean;
  abhaId: string;
  abhaAddress: string;
  name: string;
  gender: string;
  age: number;
  phone: string;
  isVerified: boolean;
}

export class MockAbhaProvider {
  /**
   * Simulates ABHA 14-digit OTP verification with ABDM gateway.
   */
  public static async verifyAbhaOtp(abhaId: string, otp: string): Promise<AbhaVerificationResult> {
    // Standard test OTP 4829 or any 4-digit code in prototype mode
    const isValidOtp = otp === '4829' || otp.length === 4;
    if (!isValidOtp) {
      throw new Error('Invalid or expired ABHA OTP');
    }

    const cleanAbha = abhaId.replace(/[^0-9-]/g, '') || '91-4829-1029-4412';

    return {
      success: true,
      abhaId: cleanAbha,
      abhaAddress: `${cleanAbha.replace(/-/g, '')}@abdm`,
      name: 'Rameshwar Prasad Patel',
      gender: 'Male',
      age: 58,
      phone: '+91 98112 43210',
      isVerified: true,
    };
  }
}
