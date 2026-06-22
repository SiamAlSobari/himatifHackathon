import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password",
  description: "Setel ulang kata sandi akun Verimind Anda secara aman.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
