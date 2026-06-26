/**
 * CitationPanel — Improved citation system.
 * Supports IEEE, APA, MLA, Chicago, Harvard, BibTeX, RIS.
 * Includes copy, download, DOI/metadata detection.
 */

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageProvider";

export interface PaperMeta {
  title: string;
  authors?: string[];
  year?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  publisher?: string;
  conference?: string;
}

function extractMeta(title: string, text: string): PaperMeta {
  // Best-effort metadata extraction from extracted PDF text
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Year: first 4-digit year found between 1990–2026
  const yearMatch = text.match(/\b(199[0-9]|200[0-9]|201[0-9]|202[0-6])\b/);
  const year = yearMatch?.[1];

  // DOI
  const doiMatch = text.match(/\b(10\.\d{4,}\/[^\s"<>]+)/i);
  const doi = doiMatch?.[1]?.replace(/[.,;)]+$/, "");

  // Authors: look for lines matching "Firstname Lastname" patterns near the top
  const authorLine = lines.slice(0, 20).find((l) =>
    /^[A-Z][a-z]+ [A-Z][a-z]+/.test(l) && l.length < 120 && !l.startsWith("Abstract"),
  );
  const authors = authorLine
    ? authorLine.split(/[,;]|and /).map((a) => a.trim()).filter((a) => a.length > 3 && /[A-Z]/.test(a))
    : undefined;

  // Journal / Conference
  const journalMatch = text.match(/(IEEE|ACM|Elsevier|Springer|Nature|MDPI|arXiv|IJCAI|CVPR|NeurIPS|ICML|AAAI)[^\n]*/i);
  const venue = journalMatch?.[0]?.slice(0, 80);

  // Pages
  const pagesMatch = text.match(/pp?\.\s*(\d+)[–\-](\d+)/i);
  const pages = pagesMatch ? `${pagesMatch[1]}–${pagesMatch[2]}` : undefined;

  return { title, authors, year, doi, journal: venue, pages };
}

function ieee(m: PaperMeta): string {
  const au = m.authors?.join(", ") ?? "Author(s)";
  const venue = m.conference ?? m.journal ?? "Journal/Conference";
  let s = `${au}, "${m.title}," ${venue}`;
  if (m.volume) s += `, vol. ${m.volume}`;
  if (m.issue) s += `, no. ${m.issue}`;
  if (m.pages) s += `, pp. ${m.pages}`;
  if (m.year) s += `, ${m.year}`;
  if (m.doi) s += `. doi: ${m.doi}`;
  return s + ".";
}

function apa(m: PaperMeta): string {
  const au = m.authors?.map((a) => {
    const parts = a.trim().split(" ");
    const last = parts.pop();
    return `${last}, ${parts.map((p) => p[0] + ".").join(" ")}`;
  }).join(", ") ?? "Author, A.";
  const venue = m.journal ?? m.conference ?? "Journal";
  let s = `${au} (${m.year ?? "n.d."}). ${m.title}. ${venue}`;
  if (m.volume) s += `, ${m.volume}`;
  if (m.issue) s += `(${m.issue})`;
  if (m.pages) s += `, ${m.pages}`;
  if (m.doi) s += `. https://doi.org/${m.doi}`;
  return s + ".";
}

function mla(m: PaperMeta): string {
  const au = m.authors?.[0] ?? "Author";
  const venue = m.journal ?? m.conference ?? "Journal";
  let s = `${au}. "${m.title}." ${venue}`;
  if (m.volume) s += `, vol. ${m.volume}`;
  if (m.issue) s += `, no. ${m.issue}`;
  if (m.year) s += `, ${m.year}`;
  if (m.pages) s += `, pp. ${m.pages}`;
  if (m.doi) s += `. DOI: ${m.doi}`;
  return s + ".";
}

function chicago(m: PaperMeta): string {
  const au = m.authors?.join(", ") ?? "Author(s)";
  const venue = m.journal ?? m.conference ?? "Journal";
  let s = `${au}. "${m.title}." ${venue}`;
  if (m.volume) s += ` ${m.volume}`;
  if (m.issue) s += `, no. ${m.issue}`;
  if (m.year) s += ` (${m.year})`;
  if (m.pages) s += `: ${m.pages}`;
  if (m.doi) s += `. https://doi.org/${m.doi}`;
  return s + ".";
}

function harvard(m: PaperMeta): string {
  const au = m.authors?.map((a) => {
    const parts = a.trim().split(" ");
    const last = parts.pop();
    return `${last}, ${parts.map((p) => p[0] + ".").join("")}`;
  }).join(", ") ?? "Author, A.";
  const venue = m.journal ?? m.conference ?? "Journal";
  let s = `${au} (${m.year ?? "n.d."}) '${m.title}', ${venue}`;
  if (m.volume) s += `, ${m.volume}`;
  if (m.issue) s += `(${m.issue})`;
  if (m.pages) s += `, pp. ${m.pages}`;
  if (m.doi) s += `. Available at: https://doi.org/${m.doi}`;
  return s + ".";
}

function bibtex(m: PaperMeta): string {
  const key = (m.authors?.[0]?.split(" ").pop() ?? "Author") + (m.year ?? "");
  const type = m.journal ? "article" : "inproceedings";
  let s = `@${type}{${key},\n`;
  s += `  title   = {${m.title}},\n`;
  if (m.authors) s += `  author  = {${m.authors.join(" and ")}},\n`;
  if (m.year) s += `  year    = {${m.year}},\n`;
  if (m.journal) s += `  journal = {${m.journal}},\n`;
  if (m.conference) s += `  booktitle = {${m.conference}},\n`;
  if (m.volume) s += `  volume  = {${m.volume}},\n`;
  if (m.pages) s += `  pages   = {${m.pages}},\n`;
  if (m.doi) s += `  doi     = {${m.doi}},\n`;
  s += `}`;
  return s;
}

function ris(m: PaperMeta): string {
  let s = `TY  - JOUR\nTI  - ${m.title}\n`;
  if (m.authors) m.authors.forEach((a) => { s += `AU  - ${a}\n`; });
  if (m.year) s += `PY  - ${m.year}\n`;
  if (m.journal) s += `JO  - ${m.journal}\n`;
  if (m.volume) s += `VL  - ${m.volume}\n`;
  if (m.issue) s += `IS  - ${m.issue}\n`;
  if (m.pages) { const [sp, ep] = m.pages.split("–"); s += `SP  - ${sp}\nEP  - ${ep ?? ""}\n`; }
  if (m.doi) s += `DO  - ${m.doi}\n`;
  s += `ER  - `;
  return s;
}

const FORMATS = ["IEEE","APA","MLA","Chicago","Harvard","BibTeX","RIS"] as const;
type CitationFormat = typeof FORMATS[number];

function generate(fmt: CitationFormat, m: PaperMeta): string {
  switch (fmt) {
    case "IEEE":    return ieee(m);
    case "APA":     return apa(m);
    case "MLA":     return mla(m);
    case "Chicago": return chicago(m);
    case "Harvard": return harvard(m);
    case "BibTeX":  return bibtex(m);
    case "RIS":     return ris(m);
  }
}

interface Props {
  title: string;
  extractedText?: string;
}

export function CitationPanel({ title, extractedText = "" }: Props) {
  const { t } = useLanguage();
  const meta = extractMeta(title, extractedText);
  const [copied, setCopied] = useState<CitationFormat | null>(null);

  function copy(fmt: CitationFormat) {
    const text = generate(fmt, meta);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(fmt);
      toast.success(`${fmt} ${t("citationCopied")}`);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function download(fmt: CitationFormat) {
    const text = generate(fmt, meta);
    const ext = fmt === "BibTeX" ? "bib" : fmt === "RIS" ? "ris" : "txt";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `citation.${ext}`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("citationPanel")}</h3>
        {meta.doi && (
          <a href={`https://doi.org/${meta.doi}`} target="_blank" rel="noopener noreferrer"
            className="text-xs text-primary hover:underline">
            DOI: {meta.doi.slice(0, 25)}{meta.doi.length > 25 ? "…" : ""}
          </a>
        )}
      </div>

      {/* Detected metadata */}
      <div className="mb-3 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
        {meta.authors && <span><b>{t("authors")}:</b> {meta.authors.slice(0,3).join(", ")}{meta.authors.length > 3 ? " et al." : ""}</span>}
        {meta.year    && <span><b>{t("year")}:</b> {meta.year}</span>}
        {meta.journal && <span className="col-span-2"><b>{t("venue")}:</b> {meta.journal.slice(0,60)}</span>}
        {meta.pages   && <span><b>{t("pages")}:</b> {meta.pages}</span>}
      </div>

      <Tabs defaultValue="IEEE">
        <TabsList className="mb-2 flex flex-wrap gap-1 h-auto">
          {FORMATS.map((f) => <TabsTrigger key={f} value={f} className="text-xs px-2 py-1">{f}</TabsTrigger>)}
        </TabsList>
        {FORMATS.map((fmt) => (
          <TabsContent key={fmt} value={fmt}>
            <pre className="mb-2 whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed">
              {generate(fmt, meta)}
            </pre>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={() => copy(fmt)}>
                {copied === fmt ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied === fmt ? t("copied") : t("copy")}
              </Button>
              <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={() => download(fmt)}>
                <Download className="h-3 w-3" /> {t("download")}
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
