import { Composition, Folder } from "remotion";
// Shared components
import { Cursor } from "./shared/Cursor";
import { LogoRow } from "./shared/LogoRow";
import { Outro } from "./shared/Outro";
import { AnimationReference } from "./shared/AnimationReference";
import { BackgroundExamples } from "./shared/BackgroundExamples";
import { EditorShowcase } from "./shared/EditorShowcase";
import { EditorShowcase2 } from "./shared/EditorShowcase2";
import { SimplexBanner } from "./shared/SimplexBanner";
import { SimplexLogo } from "./shared/SimplexLogo";
import { SimplexLogoAnimated } from "./shared/SimplexLogoAnimated";
import { SimplexText } from "./shared/SimplexText";
import { TaglineText } from "./shared/TaglineText";
import { Terminal } from "./shared/Terminal";

// CLI Deep Dive project
import {
  CLIDeepDiveMaster,
  CLI_TOTAL_FRAMES,
} from "./Examples/cli-deep-dive/CLIDeepDiveMaster";
import { CLIIntro } from "./Examples/cli-deep-dive/CLIIntro";
import { CLIInstallSection } from "./Examples/cli-deep-dive/CLIInstallSection";
import { CLISendEventsSection } from "./Examples/cli-deep-dive/CLISendEventsSection";
import { CLIPauseResumeSection } from "./Examples/cli-deep-dive/CLIPauseResumeSection";
import { CLIRunSection } from "./Examples/cli-deep-dive/CLIRunSection";

// EditorFeature project
import {
  CLIDeepDiveMaster as EditorFeatureMaster,
  CLI_TOTAL_FRAMES as EDITOR_FEATURE_TOTAL_FRAMES,
} from "./Examples/EditorFeature/CLIDeepDiveMaster";
import { BrowserGrid as EditorFeatureBrowserGrid } from "./Examples/EditorFeature/BrowserGrid";
import { CLIIntro as EditorFeatureIntro } from "./Examples/EditorFeature/CLIIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Examples">
        <Folder name="CLI-Deep-Dive">
          <Composition
            id="CLIDeepDiveMaster"
            component={CLIDeepDiveMaster}
            durationInFrames={CLI_TOTAL_FRAMES}
            fps={30}
            width={3072}
            height={1728}
          />
          <Composition
            id="CLI-Intro"
            component={CLIIntro}
            durationInFrames={300}
            fps={30}
            width={3072}
            height={1728}
          />
          <Composition
            id="CLI-Install"
            component={CLIInstallSection}
            durationInFrames={280}
            fps={30}
            width={3072}
            height={1728}
          />
          <Composition
            id="CLI-SendEvents"
            component={CLISendEventsSection}
            durationInFrames={270}
            fps={30}
            width={3072}
            height={1728}
          />
          <Composition
            id="CLI-PauseResume"
            component={CLIPauseResumeSection}
            durationInFrames={240}
            fps={30}
            width={3072}
            height={1728}
          />
          <Composition
            id="CLI-Run"
            component={CLIRunSection}
            durationInFrames={180}
            fps={30}
            width={3072}
            height={1728}
          />
        </Folder>

        <Folder name="EditorFeature">
          <Composition
            id="EditorFeatureMaster"
            component={EditorFeatureMaster}
            durationInFrames={EDITOR_FEATURE_TOTAL_FRAMES}
            fps={30}
            width={3072}
            height={1728}
          />
          <Composition
            id="EditorFeature-Intro"
            component={EditorFeatureIntro}
            durationInFrames={868}
            fps={30}
            width={3072}
            height={1728}
          />
          <Composition
            id="EditorFeature-BrowserGrid"
            component={EditorFeatureBrowserGrid}
            durationInFrames={295}
            fps={30}
            width={3072}
            height={1728}
          />
        </Folder>
      </Folder>

      <Folder name="Shared">
        <Composition
          id="AnimationReference"
          component={AnimationReference}
          durationInFrames={2340}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="BackgroundExamples"
          component={BackgroundExamples}
          durationInFrames={450}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SimplexBanner"
          component={SimplexBanner}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SimplexLogo"
          component={SimplexLogo}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SimplexLogoAnimated"
          component={SimplexLogoAnimated}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SimplexText"
          component={SimplexText}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="TaglineText"
          component={TaglineText}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="Terminal"
          component={Terminal}
          durationInFrames={300}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="LogoRow"
          component={LogoRow}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="Cursor"
          component={Cursor}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="EditorShowcase"
          component={EditorShowcase}
          durationInFrames={300}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="EditorShowcase2"
          component={EditorShowcase2}
          durationInFrames={360}
          fps={30}
          width={3072}
          height={1728}
        />
      </Folder>
    </>
  );
};
