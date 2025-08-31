import Image from "next/image";

export default function GitHubLink({ className = "absolute top-4 left-4 w-8 h-8 opacity-70 hover:opacity-100 transition-opacity" }) {
  return (
    <a
      href="https://github.com/fadykuzman/focushive"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title="View on GitHub"
    >
      <Image
        src="/github.svg"
        alt="GitHub"
        width={24}
        height={24}
        className="w-6 h-6"
      />
    </a>
  );
}