import { Composition, Folder } from "remotion";
// Shared components
import { Cursor } from "./shared/Cursor";
import { LogoRow } from "./shared/LogoRow";
import { LockReveal } from "./shared/LockReveal";
import { Outro } from "./shared/Outro";
import { AnimationReference } from "./shared/AnimationReference";
import { BackgroundExamples } from "./shared/BackgroundExamples";
import { SimplexBanner } from "./shared/SimplexBanner";
import { SimplexLogo } from "./shared/SimplexLogo";
import { SimplexLogoAnimated } from "./shared/SimplexLogoAnimated";
import { SimplexText } from "./shared/SimplexText";
import { SimplexSfProComparison } from "./shared/SimplexSfProComparison";
import { TaglineText } from "./shared/TaglineText";
import { Terminal } from "./shared/Terminal";

// SkillsInstall project
import { Master } from "./skills-install/Master";
import { Intro } from "./skills-install/Intro";
import { BrowserSection } from "./skills-install/BrowserSection";
import { SDKSection } from "./skills-install/SDKSection";
import { AgentBlind } from "./skills-install/AgentBlind";

// CLI Deep Dive project
import { CLIDeepDiveMaster, CLI_TOTAL_FRAMES } from "./cli-deep-dive/CLIDeepDiveMaster";
import { CLIIntro } from "./cli-deep-dive/CLIIntro";
import { CLIInstallSection } from "./cli-deep-dive/CLIInstallSection";
import { CLISendEventsSection } from "./cli-deep-dive/CLISendEventsSection";
import { CLIPauseResumeSection } from "./cli-deep-dive/CLIPauseResumeSection";
import { CLIRunSection } from "./cli-deep-dive/CLIRunSection";
import {
  CLIDeepDiveMaster as QuestionFeaturesMaster,
  CLI_TOTAL_FRAMES as QUESTION_FEATURES_TOTAL_FRAMES,
} from "./QuestionFeatures/CLIDeepDiveMaster";
import { CLIIntro as QuestionFeaturesIntro } from "./QuestionFeatures/CLIIntro";
import { CLIInstallSection as QuestionFeaturesInstallSection } from "./QuestionFeatures/CLIInstallSection";
import { CLISendEventsSection as QuestionFeaturesSendEventsSection } from "./QuestionFeatures/CLISendEventsSection";
import { CLIPauseResumeSection as QuestionFeaturesPauseResumeSection } from "./QuestionFeatures/CLIPauseResumeSection";
import { CLIRunSection as QuestionFeaturesRunSection } from "./QuestionFeatures/CLIRunSection";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="SkillsInstall">
        <Composition
          id="SkillsInstallMaster"
          component={Master}
          durationInFrames={1248}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-Intro"
          component={Intro}
          durationInFrames={340}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-BrowserSection"
          component={BrowserSection}
          durationInFrames={180}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-SDKSection"
          component={SDKSection}
          durationInFrames={180}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-AgentBlind"
          component={AgentBlind}
          durationInFrames={180}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-Outro"
          component={Outro}
          durationInFrames={150}
          fps={30}
          width={3072}
          height={1728}
        />
      </Folder>

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

      <Folder name="QuestionFeatures">
        <Composition
          id="QuestionFeaturesMaster"
          component={QuestionFeaturesMaster}
          durationInFrames={QUESTION_FEATURES_TOTAL_FRAMES}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="QuestionFeatures-Intro"
          component={QuestionFeaturesIntro}
          durationInFrames={210}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="QuestionFeatures-Install"
          component={QuestionFeaturesInstallSection}
          durationInFrames={280}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="QuestionFeatures-SendEvents"
          component={QuestionFeaturesSendEventsSection}
          durationInFrames={270}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="QuestionFeatures-PauseResume"
          component={QuestionFeaturesPauseResumeSection}
          durationInFrames={240}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="QuestionFeatures-Run"
          component={QuestionFeaturesRunSection}
          durationInFrames={180}
          fps={30}
          width={3072}
          height={1728}
        />
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
          id="SkillsInstall-SimplexBanner"
          component={SimplexBanner}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-SimplexLogo"
          component={SimplexLogo}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-SimplexLogoAnimated"
          component={SimplexLogoAnimated}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-SimplexText"
          component={SimplexText}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="Simplex-SFPro-Comparison"
          component={SimplexSfProComparison}
          durationInFrames={120}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-TaglineText"
          component={TaglineText}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-Terminal"
          component={Terminal}
          durationInFrames={300}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-LogoRow"
          component={LogoRow}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-Cursor"
          component={Cursor}
          durationInFrames={90}
          fps={30}
          width={3072}
          height={1728}
        />
        <Composition
          id="SkillsInstall-LockReveal"
          component={LockReveal}
          durationInFrames={120}
          fps={30}
          width={3072}
          height={1728}
        />
      </Folder>
    </>
  );
};
