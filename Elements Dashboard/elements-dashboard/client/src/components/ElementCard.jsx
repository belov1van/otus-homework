import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";

const cardVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  hover: { scale: 1.02, y: -4, boxShadow: "0px 16px 40px rgba(16,24,40,0.12)" },
};

const ElementCard = ({ element }) => {
  const { _id, name, framework, rating = 0, demoUrl, docsUrl, description } = element;

  const demoSrc = demoUrl
    ? demoUrl.startsWith("http")
      ? demoUrl
      : `http://localhost:4000${demoUrl}`
    : null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="cursor-pointer"
    >
      <Card className="overflow-hidden flex flex-col h-full">
        <div className="relative w-full h-48 bg-slate-50 border-b">
          {demoSrc ? (
            <iframe
              src={demoSrc}
              title={name}
              className="w-full h-full rounded-t-lg"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
              No demo
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold leading-tight">{name}</h3>
                <p className="text-xs text-slate-500 mt-1">{framework}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-yellow-500 text-sm">
                  <Star size={16} /> <span className="ml-1 text-slate-700">{Number(rating).toFixed(1)}</span>
                </div>
              </div>
            </div>

            {description && <p className="text-sm text-slate-600 mt-3 line-clamp-3">{description}</p>}
          </div>

          <div className="flex items-center justify-between gap-3 mt-3">
            <Link
              to={`/element/${_id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Open
            </Link>

            {demoSrc ? (
              <a
                href={demoSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-slate-100 px-3 py-1 rounded-md hover:bg-slate-200"
                title="Open demo in a new tab"
              >
                Live
              </a>
            ) : (
              <span className="text-xs text-slate-400">—</span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ElementCard;
