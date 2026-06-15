export interface PasswordRule {
  label: string;
  met: boolean;
}

export interface PsychologistRegistrationData {
  email: string;
  name: string;
  roleTitle: string;
  specialty: string;
  experienceYears: number;
  imageUrl?: string;
  tags?: string[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}
