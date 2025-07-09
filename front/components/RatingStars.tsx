import React from "react";

interface RatingStarsProps {
  rating: number;
  onChange?: (value: number) => void;
  showNumber?: boolean;
  size?: number;
  disabled?: boolean;
}

export default function RatingStars({ rating, onChange, showNumber = false, size = 24, disabled = false }: RatingStarsProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const isInteractive = typeof onChange === "function" && !disabled;

  return (
    <div className="flex items-center gap-1 select-none">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ fontSize: size, cursor: isInteractive ? "pointer" : "default", transition: "color 0.2s" }}
          onMouseEnter={() => isInteractive && setHovered(star)}
          onMouseLeave={() => isInteractive && setHovered(null)}
          onClick={() => isInteractive && onChange && onChange(star)}
          className={
            (isInteractive ? "hover:scale-110 active:scale-95 " : "") +
            ((hovered !== null ? star <= hovered : star <= rating)
              ? "text-yellow-400"
              : "text-gray-300 dark:text-gray-600")
          }
        >
          ★
        </span>
      ))}
      {showNumber && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {typeof rating === "number" ? rating.toFixed(1) : "N/A"}
        </span>
      )}
    </div>
  );
}
