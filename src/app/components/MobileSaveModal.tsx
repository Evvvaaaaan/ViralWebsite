import { motion } from "motion/react";
import { X } from "lucide-react";

interface MobileSaveModalProps {
  imageUrl: string;
  context: "instagram" | "save";
  onClose: () => void;
  zIndex?: string;
}

export default function MobileSaveModal({
  imageUrl,
  context,
  onClose,
  zIndex = "z-50",
}: MobileSaveModalProps) {
  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-black/95 backdrop-blur-md pointer-events-auto`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm rounded-3xl p-6 overflow-hidden flex flex-col items-center"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="text-center mt-2 mb-4">
          <h3 className="text-[18px] font-bold text-white mb-1">
            {context === "instagram"
              ? "인스타 스토리 공유하기"
              : "갤러리(사진첩)에 저장하기"}
          </h3>
          <p className="text-[12px] text-white/60">
            아래 이미지를 꾹 누르면 저장 메뉴가 나타납니다.
          </p>
        </div>

        <div className="relative w-full max-h-[55vh] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner flex items-center justify-center mb-4">
          <img
            src={imageUrl}
            alt="결과 화면"
            className="w-full h-auto max-h-[55vh] rounded-lg select-all object-contain"
            style={{ WebkitTouchCallout: "default" }}
          />
        </div>

        <div className="w-full text-center py-2 px-4 rounded-xl bg-white/5 border border-white/5 animate-pulse">
          <span className="text-[12px] text-red-400 font-semibold">
            {context === "instagram"
              ? "💡 이미지를 3초간 길게 눌러 저장 후, 인스타 스토리에 업로드하세요!"
              : "💡 이미지를 3초간 길게 눌러 사진 앱에 추가하세요"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
