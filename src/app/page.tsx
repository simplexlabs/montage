"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { VIDEO_FPS } from "../../types/constants";
import { Spacing } from "../components/Spacing";
import { Tips } from "../components/Tips";
import { EditorShowcase } from "../remotion/shared/EditorShowcase";

const Home: NextPage = () => {
  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5 px-4">
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          <Player
            component={EditorShowcase}
            durationInFrames={300}
            fps={VIDEO_FPS}
            compositionHeight={1728}
            compositionWidth={3072}
            style={{ width: "100%" }}
            controls
            autoPlay
            loop
          />
        </div>
        <Spacing />
        <Spacing />
        <Tips />
      </div>
    </div>
  );
};

export default Home;
