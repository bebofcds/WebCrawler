// components/Header.tsx
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

interface HeaderProps {
  title: string;
  rootUrl: string | null;
}

export default function Header({ title, rootUrl }: HeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {rootUrl && (
          <div className="mt-2 text-sm text-gray-500">
            Root:{" "}
            <a
              href={rootUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline font-mono"
            >
              {rootUrl}
            </a>
          </div>
        )}
      </div>
      <Link
        to="/"
        className="text-blue-600 hover:text-indigo-800 flex items-center gap-2 transition"
      >
        <FaRegArrowAltCircleLeft />
        Back to home
      </Link>
    </div>
  );
}