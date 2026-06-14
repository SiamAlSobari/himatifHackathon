import { Download, FileText, FolderOpen } from "lucide-react";
import { MedicalDocument } from "@/lib/types/profile";

interface MedicalDocumentsCardProps {
  title: string;
  documents: MedicalDocument[];
}

const FILE_ICON_STYLES: Record<MedicalDocument["fileType"], string> = {
  pdf: "bg-rose-50 text-rose-500",
  docx: "bg-sky-50 text-sky-500",
};

export default function MedicalDocumentsCard({
  title,
  documents,
}: MedicalDocumentsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <FolderOpen className="h-4.5 w-4.5 text-slate-400" />
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 transition-colors hover:border-teal-100 hover:bg-teal-50/30"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${FILE_ICON_STYLES[doc.fileType]}`}
              >
                <FileText className="h-4.5 w-4.5" />
              </span>
              <button
                type="button"
                aria-label={`Unduh ${doc.title}`}
                className="text-slate-300 transition-colors hover:text-teal-600"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                {doc.title}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{doc.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}