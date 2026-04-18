"use client";

import { useOnboarding } from "@/hooks/use-onboarding";
import OnboardingModal from "@/components/onboarding-modal";

export default function OnboardingWrapper() {
  const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } =
    useOnboarding();

  return (
    <OnboardingModal
      isOpen={showOnboarding}
      onClose={handleOnboardingSkip}
      onComplete={handleOnboardingComplete}
    />
  );
}
