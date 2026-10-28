import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/kinematic/ui/input-otp"

export default function InputOTPDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <InputOTP maxLength={6} aria-label="Verification code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-muted-foreground">Enter the 6-digit code we sent to your email.</p>
    </div>
  )
}
