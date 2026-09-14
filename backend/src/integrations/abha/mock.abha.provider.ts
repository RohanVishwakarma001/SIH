/**
 * ABHA (Ayushman Bharat Health Account) identity check.
 *
 * There is no live ABDM gateway wired into this deployment (that requires an
 * NHA-issued HIP/HIU sandbox or production registration, which is an
 * organizational onboarding process, not an API key). Until real gateway
 * credentials are configured, this only validates the ABHA number format and
 * self-attests it — it does NOT verify identity against any government
 * record, and it never fabricates a patient's name/age/gender.
 */
export class SandboxAbhaProvider {
  public static normalizeAbhaId(abhaId: string): string {
    const digitsAndDashes = abhaId.replace(/[^0-9-]/g, '');
    const digitCount = digitsAndDashes.replace(/-/g, '').length;
    if (digitCount < 14) {
      throw new Error('Please enter a valid 14-digit ABHA number.');
    }
    return digitsAndDashes;
  }
}
