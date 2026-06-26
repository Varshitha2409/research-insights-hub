/**
 * KnowledgeGraph — Interactive keyword/concept graph using SVG + force simulation.
 * No extra dependencies — pure SVG with a simple spring layout.
 */

import { useEffect, useRef, useState } from "react";
import { useLanguage, type TranslationKey } from "@/components/LanguageProvider";

interface Node { id: string; label: string; group: "keyword"|"author"|"concept"|"algorithm"|"dataset"; x: number; y: number; vx: number; vy: number; }
interface Edge { source: string; target: string; }

interface GraphData { nodes: Node[]; edges: Edge[]; }

const GROUP_COLOR: Record<Node["group"], string> = {
  keyword: "#818cf8",
  author: "#34d399",
  concept: "#f59e0b",
  algorithm: "#60a5fa",
  dataset: "#e879f9",
};

/** Extract entities from paper text for the graph */
export function buildGraphData(title: string, text: string): GraphData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const seen = new Set<string>();

  const addNode = (id: string, label: string, group: Node["group"]) => {
    if (seen.has(id)) return;
    seen.add(id);
    nodes.push({ id, label, group, x: Math.random()*600+100, y: Math.random()*400+80, vx:0, vy:0 });
  };

  // Title as central node
  const titleId = "title";
  addNode(titleId, title.slice(0, 30) + (title.length > 30 ? "…" : ""), "concept");

  // Known algorithm names
  const algos = ["CNN","RNN","LSTM","GRU","Transformer","BERT","GPT","ResNet","VGG","YOLO",
    "SVM","Random Forest","XGBoost","KNN","Naive Bayes","Attention","GAN","VAE","U-Net",
    "ViT","EfficientNet","MobileNet","CLIP","Diffusion","LoRA","Fine-tuning"];
  algos.forEach((a) => {
    if (new RegExp(`\\b${a}\\b`, "i").test(text)) {
      addNode(a, a, "algorithm");
      edges.push({ source: titleId, target: a });
    }
  });

  // Known datasets
  const datasets = ["ImageNet","COCO","MNIST","CIFAR","VOC","SQuAD","GLUE","SuperGLUE",
    "MS-COCO","Open Images","LibriSpeech","WMT","CommonVoice","ChestX-ray","MIMIC"];
  datasets.forEach((d) => {
    if (new RegExp(`\\b${d}\\b`, "i").test(text)) {
      addNode(d, d, "dataset");
      edges.push({ source: titleId, target: d });
    }
  });

  // Extract keywords using TF-IDF-like: frequent capitalised words
  const words = text.match(/\b[A-Z][a-zA-Z]{3,}\b/g) ?? [];
  const freq: Record<string, number> = {};
  words.forEach((w) => { const k = w.toLowerCase(); freq[k] = (freq[k]||0)+1; });
  const stopwords = new Set(["this","that","with","from","have","been","they","their",
    "which","when","where","there","these","those","also","both","each","more","than",
    "into","over","after","paper","using","based","model","method","results","table","figure"]);
  const topKw = Object.entries(freq)
    .filter(([w]) => !stopwords.has(w) && !seen.has(w))
    .sort(([,a],[,b]) => b-a)
    .slice(0, 8)
    .map(([w]) => w);
  topKw.forEach((kw) => {
    addNode(kw, kw, "keyword");
    edges.push({ source: titleId, target: kw });
  });

  // Authors: top-of-document names
  const authorLine = text.split("\n").slice(0,15)
    .find((l) => /^[A-Z][a-z]+ [A-Z][a-z]+/.test(l.trim()) && l.length < 100);
  if (authorLine) {
    authorLine.split(/[,;]|and /)
      .map((a) => a.trim())
      .filter((a) => /^[A-Z][a-z]+ [A-Z]/.test(a))
      .slice(0, 4)
      .forEach((a) => {
        addNode(a, a, "author");
        edges.push({ source: titleId, target: a });
      });
  }

  return { nodes, edges };
}

/** Simple force simulation step */
function simulate(nodes: Node[], edges: Edge[], iterations = 80) {
  const nodeMap: Record<string, Node> = {};
  nodes.forEach((n) => { nodeMap[n.id] = { ...n }; });
  const ns = Object.values(nodeMap);

  for (let iter = 0; iter < iterations; iter++) {
    const alpha = 1 - iter / iterations;
    // Repulsion
    for (let i = 0; i < ns.length; i++) {
      for (let j = i+1; j < ns.length; j++) {
        const dx = ns[j].x - ns[i].x, dy = ns[j].y - ns[i].y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const force = (3500 / (dist * dist)) * alpha;
        ns[i].vx -= (dx/dist)*force; ns[i].vy -= (dy/dist)*force;
        ns[j].vx += (dx/dist)*force; ns[j].vy += (dy/dist)*force;
      }
    }
    // Attraction
    edges.forEach(({ source, target }) => {
      const s = nodeMap[source], t = nodeMap[target];
      if (!s || !t) return;
      const dx = t.x-s.x, dy = t.y-s.y;
      const dist = Math.sqrt(dx*dx+dy*dy)||1;
      const force = (dist-120)*0.05*alpha;
      s.vx += (dx/dist)*force; s.vy += (dy/dist)*force;
      t.vx -= (dx/dist)*force; t.vy -= (dy/dist)*force;
    });
    // Center gravity
    ns.forEach((n) => { n.vx += (400-n.x)*0.01*alpha; n.vy += (280-n.y)*0.01*alpha; });
    // Apply velocity
    ns.forEach((n) => {
      n.x = Math.max(60, Math.min(740, n.x + n.vx));
      n.y = Math.max(40, Math.min(520, n.y + n.vy));
      n.vx *= 0.6; n.vy *= 0.6;
    });
    ns.forEach((n) => { nodeMap[n.id] = n; });
  }
  return ns;
}

interface KnowledgeGraphProps {
  title: string;
  extractedText: string;
}

export function KnowledgeGraph({ title, extractedText }: KnowledgeGraphProps) {
  const { t } = useLanguage();
  const raw = buildGraphData(title, extractedText);
  const [nodes] = useState(() => simulate(raw.nodes, raw.edges));
  const nodeMap: Record<string, Node> = {};
  nodes.forEach((n) => { nodeMap[n.id] = n; });
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);

  if (nodes.length < 2) return null;

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("knowledgeGraphTitle")}</h3>
      <div className="mb-2 flex flex-wrap gap-3 text-xs">
        {(Object.keys(GROUP_COLOR) as Array<keyof typeof GROUP_COLOR>).map((g) => (
          <span key={g} className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: GROUP_COLOR[g] }} />
            {t(g as TranslationKey)}
          </span>
        ))}
      </div>
      <div className="relative overflow-auto rounded-xl border border-border/40 bg-background/40">
        <svg ref={svgRef} viewBox="0 0 800 560" className="w-full" style={{ minHeight: 320 }}>
          {/* Edges */}
          {raw.edges.map((e, i) => {
            const s = nodeMap[e.source], t = nodeMap[e.target];
            if (!s || !t) return null;
            return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="oklch(1 0 0 / 12%)" strokeWidth={1} />;
          })}
          {/* Nodes */}
          {nodes.map((n) => (
            <g key={n.id} style={{ cursor: "pointer" }}
              onMouseEnter={(ev) => {
                const rect = svgRef.current?.getBoundingClientRect();
                if (rect) setTooltip({ x: ev.clientX - rect.left, y: ev.clientY - rect.top, label: n.label });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle cx={n.x} cy={n.y} r={n.id === "title" ? 20 : 12}
                fill={GROUP_COLOR[n.group]} fillOpacity={0.25}
                stroke={GROUP_COLOR[n.group]} strokeWidth={1.5} />
              <text x={n.x} y={n.y + (n.id === "title" ? 32 : 24)}
                textAnchor="middle" fontSize={n.id === "title" ? 11 : 9}
                fill="oklch(0.9 0.005 250)" fontWeight={n.id === "title" ? 600 : 400}>
                {n.label.slice(0, 14)}{n.label.length > 14 ? "…" : ""}
              </text>
            </g>
          ))}
        </svg>
        {tooltip && (
          <div className="pointer-events-none absolute z-10 rounded-lg border border-border bg-popover px-2 py-1 text-xs shadow-lg"
            style={{ left: tooltip.x + 8, top: tooltip.y - 20 }}>
            {tooltip.label}
          </div>
        )}
      </div>
    </div>
  );
}
