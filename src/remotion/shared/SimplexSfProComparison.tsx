import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FilmGrainOverlay } from "./FilmGrainOverlay";
import {
  FONT_FAMILY,
  TEXT_FINISH,
  TEXT_LAYOUT_DEFAULTS,
  TEXT_FINISH_SHADOW,
  useCornerGlow,
  useRadialVignette,
} from "./animations";

const INDIGO = "#5F6CDD";
const DARK_TEXT = "#0D0D16";
const HEADLINE_SPACING = {
  lineHeight: 0.98,
  letterSpacing: "-0.02em",
  wordSpacing: "-0.04em",
  fontKerning: "normal" as const,
};
const CTA_SPACING = {
  lineHeight: 0.96,
  letterSpacing: "-0.016em",
  wordSpacing: "-0.03em",
  fontKerning: "normal" as const,
};

export const SimplexSfProComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settledFrame = frame + 90;

  const [fontHandle] = useState(() =>
    delayRender("Loading SF Pro Display fonts"),
  );
  useEffect(() => {
    let mounted = true;

    const light = new FontFace(
      "SF Pro Display",
      `url(${staticFile("SF-Pro-Display-Light.otf")})`,
      { weight: "300" },
    );
    const regular = new FontFace(
      "SF Pro Display",
      `url(${staticFile("SF-Pro-Display-Regular.otf")})`,
      { weight: "400" },
    );
    const bold = new FontFace(
      "SF Pro Display",
      `url(${staticFile("SF-Pro-Display-Bold.otf")})`,
      { weight: "700" },
    );

    Promise.all([light.load(), regular.load(), bold.load()])
      .then(([l, r, b]) => {
        if (!mounted) {
          return;
        }
        document.fonts.add(l);
        document.fonts.add(r);
        document.fonts.add(b);
        continueRender(fontHandle);
      })
      .catch((error) => {
        console.error("Failed to load SF Pro Display fonts", error);
        if (mounted) {
          continueRender(fontHandle);
        }
      });

    return () => {
      mounted = false;
    };
  }, [fontHandle]);

  const backgroundStyle = useRadialVignette(settledFrame, fps, {
    colors: {
      center: "#F6F7FF",
      mid: "#E8EAF7",
      outer: "#D6D9EB",
    },
  });
  const glowStyle = useCornerGlow(settledFrame, fps, {
    position: "top-right",
    size: 72,
    targetOpacity: 0.05,
  });

  return (
    <AbsoluteFill style={{ ...TEXT_LAYOUT_DEFAULTS, ...TEXT_FINISH_SHADOW }}>
      <div style={backgroundStyle} />
      <FilmGrainOverlay intensity={8} />
      <div style={glowStyle} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "translateY(-26px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <span
              style={{
                ...TEXT_FINISH,
                ...HEADLINE_SPACING,
                fontFamily: FONT_FAMILY,
                fontSize: 72,
                fontWeight: 300,
                color: INDIGO,
              }}
            >
              Automate web workflows
            </span>
            <span
              style={{
                ...TEXT_FINISH,
                ...HEADLINE_SPACING,
                fontFamily: FONT_FAMILY,
                fontSize: 72,
                fontWeight: 400,
                color: DARK_TEXT,
              }}
            >
              for <span style={{ fontWeight: 700 }}>your</span>
            </span>
          </div>

          <span
            style={{
              ...TEXT_FINISH,
              ...HEADLINE_SPACING,
              marginTop: -3,
              fontFamily: FONT_FAMILY,
              fontSize: 68,
              fontWeight: 400,
              color: DARK_TEXT,
            }}
          >
            customers with
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              marginTop: 40,
            }}
          >
            <span
              style={{
                ...TEXT_FINISH,
                fontFamily: FONT_FAMILY,
                fontSize: 112,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.05em",
                color: INDIGO,
              }}
            >
              Simplex
            </span>
            <div
              style={{
                width: 142,
                height: 142,
                backgroundColor: INDIGO,
                WebkitMaskImage: `url(${staticFile("simplex-black.png")})`,
                maskImage: `url(${staticFile("simplex-black.png")})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 146,
              gap: 2,
            }}
          >
            <span
              style={{
                ...TEXT_FINISH,
                ...CTA_SPACING,
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 400,
                color: DARK_TEXT,
              }}
            >
              Try Simplex at
            </span>
            <span
              style={{
                ...TEXT_FINISH,
                ...CTA_SPACING,
                fontFamily: FONT_FAMILY,
                fontSize: 56,
                fontWeight: 400,
                color: INDIGO,
                borderBottom: `2px solid ${INDIGO}`,
                paddingBottom: 1,
              }}
            >
              https://simplex.sh
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
