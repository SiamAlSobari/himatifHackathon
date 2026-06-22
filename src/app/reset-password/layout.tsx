import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Buat kata sandi baru untuk mengamankan akun Verimind Anda.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
