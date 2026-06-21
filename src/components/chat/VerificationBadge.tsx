"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { AppTheme } from "@/lib/types/theme";
import { useBlockchainVerify } from "@/hooks/blockchain/useBlockchainVerify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Loader2,
  RefreshCw,
  Clock,
  User,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

interface VerificationBadgeProps {
  sessionId?: string;
  appointmentId?: string;
  initialIpfsCid?: string | null;
  initialTxHash?: string | null;
}

const THEME_COLORS: Record<
  AppTheme,
  {
    badgeBg: string;
    badgeText: string;
    badgeIcon: string;
    accentBg: string;
    textMuted: string;
    btnClass: string;
  }
> = {
  calm_blue: {
    badgeBg: "bg-teal-50/80 hover:bg-teal-100/80 border-teal-100",
    badgeText: "text-teal-700 border",
    badgeIcon: "text-teal-500",
    accentBg: "bg-teal-50/50 border border-teal-100/50",
    textMuted: "text-teal-600/80",
    btnClass: "bg-teal-600 hover:bg-teal-700 text-white",
  },
  warm_yellow: {
    badgeBg: "bg-amber-50/80 hover:bg-amber-100/80 border-amber-100",
    badgeText: "text-amber-700 border",
    badgeIcon: "text-amber-500",
    accentBg: "bg-amber-50/50 border border-amber-100/50",
    textMuted: "text-amber-600/80",
    btnClass: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  alert_orange: {
    badgeBg: "bg-orange-50/80 hover:bg-orange-100/80 border-orange-100",
    badgeText: "text-orange-700 border",
    badgeIcon: "text-orange-500",
    accentBg: "bg-orange-50/50 border border-orange-100/50",
    textMuted: "text-orange-600/80",
    btnClass: "bg-orange-600 hover:bg-orange-700 text-white",
  },
  deep_purple: {
    badgeBg: "bg-purple-50/80 hover:bg-purple-100/80 border-purple-100",
    badgeText: "text-purple-700 border",
    badgeIcon: "text-purple-500",
    accentBg: "bg-purple-50/50 border border-purple-100/50",
    textMuted: "text-purple-600/80",
    btnClass: "bg-purple-600 hover:bg-purple-700 text-white",
  },
};

export default function VerificationBadge({
  sessionId,
  appointmentId,
  initialIpfsCid,
  initialTxHash,
}: VerificationBadgeProps) {
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme] || THEME_COLORS.calm_blue;
  const [isOpen, setIsOpen] = useState(false);

  // Use state or props for tracking CID/Hash. We accept initials, but TanStack Query fetches latest data.
  const [currentCid, setCurrentCid] = useState<string | null>(initialIpfsCid || null);
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(initialTxHash || null);

  // Query verification info from the API
  const {
    data: verifyResult,
    isLoading,
    isError,
    refetch,
  } = useBlockchainVerify({
    sessionId,
    appointmentId,
  });

  const hasBlockchainRecord = !!(currentCid || verifyResult?.data?.ipfsCid);

  // Sync state if query fetches new database data (e.g. from a real-time Pusher event update)
  React.useEffect(() => {
    if (verifyResult?.data?.ipfsCid) {
      setCurrentCid(verifyResult.data.ipfsCid);
    }
    if (verifyResult?.data?.txHash) {
      setCurrentTxHash(verifyResult.data.txHash);
    }
  }, [verifyResult]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      refetch();
    }
  };

  const getTruncatedHash = (hash: string | undefined | null) => {
    if (!hash) return "";
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  // If no CID/TxHash exists yet and the API also confirms it, display a sinking sync state
  if (!hasBlockchainRecord) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-400 select-none">
        <Loader2 className="h-3 w-3 animate-spin text-slate-300" />
        Sesi Sedang Disinkronisasikan...
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all duration-300 active:scale-95 ${colors.badgeBg} ${colors.badgeText}`}
          />
        }
      >
        <ShieldCheck className={`h-3.5 w-3.5 ${colors.badgeIcon}`} />
        Terverifikasi Aman (On-Chain)
      </DialogTrigger>
      
      <DialogContent className="max-w-md rounded-2xl border-slate-100 bg-white p-6 shadow-xl sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <ShieldCheck className="h-6.5 w-6.5 text-emerald-500 shrink-0" />
            Audit Transparansi On-Chain
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Pembuktian integritas data medis dan riwayat chat medis Verimind secara nir-ubah.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <Loader2 className={`h-10 w-10 animate-spin ${colors.badgeIcon}`} />
              <div>
                <p className="text-sm font-bold text-slate-600">Menghubungi Polygon Amoy & IPFS...</p>
                <p className="text-xs text-slate-400 mt-0.5">Membandingkan kecocokan kriptografis lokal dengan on-chain.</p>
              </div>
            </div>
          ) : isError || !verifyResult?.success ? (
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 space-y-3">
              <div className="flex gap-2.5">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-800">Gagal Melakukan Audit</h4>
                  <p className="text-xs text-rose-600/90 mt-0.5">
                    {verifyResult?.error || "Gagal memuat status verifikasi dari node blockchain."}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="w-full border-rose-200 text-rose-700 hover:bg-rose-100/50 h-8 text-xs font-semibold gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Coba Lagi
              </Button>
            </div>
          ) : (
            <>
              {/* Verification Result Alert */}
              {verifyResult.data.integrity === "match" && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5.5 w-5.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-800">Data Utuh & Terverifikasi</h4>
                      <p className="text-xs text-emerald-700/90 mt-1 leading-relaxed">
                        Integritas data terjamin 100%. Riwayat chat lokal Anda di database PostgreSQL cocok sempurna dengan salinan terenkripsi yang dikunci di IPFS.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verifyResult.data.integrity === "mismatch" && (
                <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5.5 w-5.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-extrabold text-rose-800">Manipulasi Terdeteksi!</h4>
                      <p className="text-xs text-rose-700/90 mt-1 leading-relaxed">
                        Peringatan: Terdapat ketidakcocokan antara riwayat chat saat ini dengan arsip kriptografis di blockchain.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verifyResult.data.integrity === "unchecked" && (
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                  <div className="flex gap-3">
                    <HelpCircle className="h-5.5 w-5.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-extrabold text-amber-800">Verifikasi On-Chain Parsial</h4>
                      <p className="text-xs text-amber-700/90 mt-1 leading-relaxed">
                        Koneksi IPFS lambat. Hash transaksi on-chain terkonfirmasi valid, namun pencocokan konten pesan dilewati demi performa.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Audit Log */}
              <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Log Audit Teknis</h5>
                
                {/* Transaction Hash */}
                <div className="flex items-start justify-between gap-4 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                    <RefreshCw className="h-3.5 w-3.5 text-slate-300" />
                    Tx Hash On-Chain
                  </span>
                  {currentTxHash && (
                    <a
                      href={`https://amoy.polygonscan.com/tx/${currentTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-semibold text-slate-600 hover:text-indigo-600 hover:underline flex items-center gap-1 shrink-0"
                    >
                      {getTruncatedHash(currentTxHash)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* IPFS CID */}
                <div className="flex items-start justify-between gap-4 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-300" />
                    IPFS Content ID
                  </span>
                  {currentCid && (
                    <a
                      href={verifyResult.data.ipfsUrl || `https://gateway.pinata.cloud/ipfs/${currentCid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-semibold text-slate-600 hover:text-indigo-600 hover:underline flex items-center gap-1 shrink-0"
                    >
                      {getTruncatedHash(currentCid)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Timestamp */}
                {verifyResult.data.timestamp && (
                  <div className="flex items-start justify-between gap-4 text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                      <Clock className="h-3.5 w-3.5 text-slate-300" />
                      Waktu Registrasi
                    </span>
                    <span className="font-semibold text-slate-600 text-right">
                      {new Date(Number(verifyResult.data.timestamp) * 1000).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}

                {/* Registered By (Admin Signer Wallet) */}
                {verifyResult.data.registeredBy && (
                  <div className="flex items-start justify-between gap-4 text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                      <User className="h-3.5 w-3.5 text-slate-300" />
                      Registrar
                    </span>
                    <span className="font-mono font-semibold text-slate-600 text-right">
                      {getTruncatedHash(verifyResult.data.registeredBy)}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            className={`w-full rounded-xl py-2.5 h-10 font-bold transition-all text-xs active:scale-95 ${colors.btnClass}`}
          >
            Tutup Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
