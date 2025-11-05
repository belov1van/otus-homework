import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

export default function ElementPage() {
  const { id } = useParams();
  const [element, setElement] = useState(null);
  const [docsContent, setDocsContent] = useState(null);
  const [docsType, setDocsType] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/elements/${id}`);
        if (!res.ok) throw new Error("Element not found");
        const data = await res.json();
        setElement(data);

        
        if (data.docsUrl) {
          try {
            
            const docsSrc = data.docsUrl.startsWith("http") ? data.docsUrl : `${API_BASE}${data.docsUrl}`;

            const docsRes = await fetch(docsSrc);
            if (!docsRes.ok) throw new Error("Docs fetch failed");

            const contentType = docsRes.headers.get("content-type") || "";

            const text = await docsRes.text();

            if (contentType.includes("markdown") || contentType.includes("text/plain") || docsSrc.endsWith(".md")) {
              setDocsType("markdown");
              setDocsContent(text);
            } else if (contentType.includes("html") || docsSrc.endsWith(".html")) {
              setDocsType("html");
              setDocsContent(docsSrc);
            } else {
              
              if (text.trim().length < 4000) {
                setDocsType("markdown");
                setDocsContent(text);
              } else {
                setDocsType("external");
                setDocsContent(docsSrc);
              }
            }
          } catch (err) {
            
            setDocsType("external");
            const fallback = data.docsUrl.startsWith("http") ? data.docsUrl : `${API_BASE}${data.docsUrl}`;
            setDocsContent(fallback);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!element) return <div className="p-6">Element not found</div>;

  const demoSrc = element.demoUrl
    ? element.demoUrl.startsWith("http")
      ? element.demoUrl
      : `${API_BASE}${element.demoUrl}`
    : null;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-sm text-slate-600 hover:underline">← Back</Link>
          <h1 className="text-2xl font-bold mt-2">{element.name}</h1>
          <p className="text-sm text-slate-500">{element.framework}</p>
        </div>
        <div className="flex gap-2 items-center">
          {demoSrc && (
            <a
              href={demoSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-slate-100 px-3 py-1 rounded hover:bg-slate-200"
            >
              Open demo
            </a>
          )}
          {element.docsUrl && (
            <a
              href={element.docsUrl.startsWith("http") ? element.docsUrl : `${API_BASE}${element.docsUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Open docs
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded shadow p-3">
          <div className="text-sm text-slate-500 mb-2">Live preview</div>
          {demoSrc ? (
            <div className="w-full h-[60vh] border rounded overflow-hidden">
              <iframe
                src={demoSrc}
                title={`${element.name}-preview`}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          ) : (
            <div className="p-6 text-slate-500">No demo available</div>
          )}
        </div>

        <aside className="bg-white rounded shadow p-4">
          <div className="text-sm text-slate-500 mb-2">Documentation</div>

          {element.docsUrl ? (
            <>
              {docsType === "markdown" && docsContent ? (
                <div className="prose max-w-none">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{docsContent}</ReactMarkdown>
                </div>
              ) : docsType === "html" && docsContent ? (
                <div className="w-full h-96 border rounded overflow-hidden">
                  <iframe src={docsContent} title="docs" className="w-full h-full" />
                </div>
              ) : docsType === "external" && docsContent ? (
                <div>
                  <p className="text-sm text-slate-600 mb-2">Docs are external — open in new tab:</p>
                  <a href={docsContent} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    {docsContent}
                  </a>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No documentation available</div>
              )}
            </>
          ) : (
            <div className="text-sm text-slate-500">No documentation provided</div>
          )}
        </aside>
      </div>
    </div>
  );
}
