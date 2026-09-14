import { GameWorld, refPackageId, world } from "@tabletop-playground/api";
import {
  BugCardHolderAssignment,
  BugSplatRemoteReporter,
  BugUniqueCards,
  DiceGroupCleanup,
  ErrorHandler,
  Find,
  FindTracking,
  GlobalInit,
  Hex,
  HEX_LAYOUT_POINTY, // TTPG inverts x/y axis
  IGlobal,
  LeaveSeat,
  locale,
  OnCardBecameSingletonOrDeck,
  Spawn,
  Timer,
  TurnOrder,
  WhisperReporter,
} from "ttpg-darrell";

import { ActivateSystem } from "ti4-ttpg-ts";
import { AgendaActivityMaybeResume } from "ti4-ttpg-ts";
import { AllBorders } from "ti4-ttpg-ts";
import { ApplyLocaleDescriptions } from "ti4-ttpg-ts";
import { AutoStreamerCamera } from "ti4-ttpg-ts";
import { Config } from "ti4-ttpg-ts";
import { ControlTokenSystem } from "ti4-ttpg-ts";
import { CreateAndAttachEndTurnButtonUI } from "ti4-ttpg-ts";
import { CreateAndAttachTurnOrderUI } from "ti4-ttpg-ts";
import { DiplomacySystem } from "ti4-ttpg-ts";
import { DraftActivityMaybeResume } from "ti4-ttpg-ts";
import { DraftActivityMaybeResumeTF } from "ti4-ttpg-ts";
import { FactionRegistry } from "ti4-ttpg-ts";
import { GameDataExport } from "ti4-ttpg-ts";
import { GameDataUpdator } from "ti4-ttpg-ts";
import { GAME_DATA_UPDATORS } from "ti4-ttpg-ts";
import { GlobalEvents } from "ti4-ttpg-ts";
import { GoalReporter } from "ti4-ttpg-ts";
import { HideMouseCursor } from "ti4-ttpg-ts";
import { HomebrewRegistry } from "ti4-ttpg-ts";
import { LastGameData } from "ti4-ttpg-ts";
import { NumpadKeyAll } from "ti4-ttpg-ts";
import { OnAgendaCard } from "ti4-ttpg-ts";
import { OnAgendaStateCreated } from "ti4-ttpg-ts";
import { OnChatMessage } from "ti4-ttpg-ts";
import { OnCombatClicked } from "ti4-ttpg-ts";
import { OnCombatResult } from "ti4-ttpg-ts";
import { OnFetchPlanetCardRequest } from "ti4-ttpg-ts";
import { OnGameEnd } from "ti4-ttpg-ts";
import { OnObjectFellThroughTable } from "ti4-ttpg-ts";
import { OnPlanetCardSingleton } from "ti4-ttpg-ts";
import { OnPlayerChangeColorRequest } from "ti4-ttpg-ts";
import { OnPlayerChangedColor } from "ti4-ttpg-ts";
import { OnSliceDraftRequest } from "ti4-ttpg-ts";
import { OnStrategyCardPlayed } from "ti4-ttpg-ts";
import { OnSystemActivated } from "ti4-ttpg-ts";
import { OnTurnStateChanged } from "ti4-ttpg-ts";
import { OnWhisper } from "ti4-ttpg-ts";
import { PlanetAttachmentRegistry } from "ti4-ttpg-ts";
import { PlayerActionPhaseTime } from "ti4-ttpg-ts";
import { PlayerColor } from "ti4-ttpg-ts";
import { PlayerName } from "ti4-ttpg-ts";
import { PlayerSeats } from "ti4-ttpg-ts";
import { RemoveRegistry } from "ti4-ttpg-ts";
import { ReportCommandTokenPutGet } from "ti4-ttpg-ts";
import { ReportRemaining } from "ti4-ttpg-ts";
import { RightClickAgenda } from "ti4-ttpg-ts";
import { RightClickCrisis } from "ti4-ttpg-ts";
import { RightClickExplore } from "ti4-ttpg-ts";
import { RightClickExtremeDuress } from "ti4-ttpg-ts";
import { RightClickFetchPlanetCard } from "ti4-ttpg-ts";
import { RightClickFracture } from "ti4-ttpg-ts";
import { RightClickGalvanizeToken } from "ti4-ttpg-ts";
import { RightClickGravleashManeuvers } from "ti4-ttpg-ts";
import { RightClickHotPotatoScore } from "ti4-ttpg-ts";
import { RightClickIihqModernization } from "ti4-ttpg-ts";
import { RightClickIihqModernizationBT } from "ti4-ttpg-ts";
import { RightClickInfantry2 } from "ti4-ttpg-ts";
import { RightClickLetaniWarrior2 } from "ti4-ttpg-ts";
import { RightClickMabanOmega } from "ti4-ttpg-ts";
import { RightClickMabanOmegaAlliance } from "ti4-ttpg-ts";
import { RightClickMageonImplants } from "ti4-ttpg-ts";
import { RightClickMercenaryContract } from "ti4-ttpg-ts";
import { RightClickNanoForge } from "ti4-ttpg-ts";
import { RightClickObsidianFirmament } from "ti4-ttpg-ts";
import { RightClickPirateContract } from "ti4-ttpg-ts";
import { RightClickPirateFleet } from "ti4-ttpg-ts";
import { RightClickPurge } from "ti4-ttpg-ts";
import { RightClickRider } from "ti4-ttpg-ts";
import { RightClickRift } from "ti4-ttpg-ts";
import { RightClickScorePrivate } from "ti4-ttpg-ts";
import { RightClickScorePublic } from "ti4-ttpg-ts";
import { RightClickSleeperToken } from "ti4-ttpg-ts";
import { RightClickSpecOps2 } from "ti4-ttpg-ts";
import { RightClickStellarConverter } from "ti4-ttpg-ts";
import { RightClickTheCavalry } from "ti4-ttpg-ts";
import { RightClickThundersEdge } from "ti4-ttpg-ts";
import { RunInjectScript } from "ti4-ttpg-ts";
import { RSwapSplitCombine } from "ti4-ttpg-ts";
import { ShuffleDecks } from "ti4-ttpg-ts";
import { SlashCommandRegistry } from "ti4-ttpg-ts";
import { StartGame } from "ti4-ttpg-ts";
import { StartGameWindow } from "ti4-ttpg-ts";
import { SystemAttachmentRegistry } from "ti4-ttpg-ts";
import { SystemRegistry } from "ti4-ttpg-ts";
import { TechRegistry } from "ti4-ttpg-ts";
import { ToggleAgenda } from "ti4-ttpg-ts";
import { ToggleActionPhaseTimes } from "ti4-ttpg-ts";
import { ToggleAllPlayersTech } from "ti4-ttpg-ts";
import { ToggleBorders } from "ti4-ttpg-ts";
import { ToggleCombatWindow } from "ti4-ttpg-ts";
import { ToggleHelp } from "ti4-ttpg-ts";
import { ToggleMapTool } from "ti4-ttpg-ts";
import { ToggleStats } from "ti4-ttpg-ts";
import { ToggleStratCards } from "ti4-ttpg-ts";
import { ToggleStreamerTool } from "ti4-ttpg-ts";
import { ToggleTechChooser } from "ti4-ttpg-ts";
import { UnitAttrsRegistry } from "ti4-ttpg-ts";
import { UnitModifierActiveIdle } from "ti4-ttpg-ts";
import { UnitModifierRegistry } from "ti4-ttpg-ts";
import { UnpackFactionContextMenuItem } from "ti4-ttpg-ts";
import { UpdatorHistory } from "ti4-ttpg-ts";
import { UseStreamerBuddy } from "ti4-ttpg-ts";
import { WhisperSpy } from "ti4-ttpg-ts";

// Events
import { RightClickAgeOfExploration } from "ti4-ttpg-ts";
import { RightClickMinorFactions } from "ti4-ttpg-ts";
import { OnStartThundersEdge } from "ti4-ttpg-ts";

// Breakthroughs
import { RightClickYinAscendant } from "ti4-ttpg-ts";

// Twilight's Fall
import { RightClickTFAbilitySplice } from "ti4-ttpg-ts";
import { RightClickTFDragonFreed } from "ti4-ttpg-ts";
import { RightClickTFGenomeSplice } from "ti4-ttpg-ts";
import { RightClickTFUnitUpgradeSplice } from "ti4-ttpg-ts";

import { LOCALE_CONTEXT_MENUS } from "ti4-ttpg-ts";

import { NSID_TO_TEMPLATE_ID } from "ti4-ttpg-ts";
import { OnStartTwilightsFall } from "ti4-ttpg-ts";
import { TFAhkSylFier } from "ti4-ttpg-ts";
import { TFAwakeningGeoform } from "ti4-ttpg-ts";
import { TFDimensionalTear } from "ti4-ttpg-ts";
import { TFHeliosEntity } from "ti4-ttpg-ts";
import { TFSingularityX } from "ti4-ttpg-ts";
import { TFSingularityY } from "ti4-ttpg-ts";
import { TFSingularityZ } from "ti4-ttpg-ts";
import { RightClickTFEdict } from "ti4-ttpg-ts";

import { TFTelepathicNaalu0 } from "ti4-ttpg-ts";
import { RightClickTFSupercharge } from "ti4-ttpg-ts";

import { HeroDimensionalAnchor } from "ti4-ttpg-ts";
import { HeroHelioCommandArray } from "ti4-ttpg-ts";
import { HeroMultiverseShift } from "ti4-ttpg-ts";

const packageId: string = refPackageId;
Find.ignoreOwnedCardHolderNsid("card-holder:base/player-scoring");

if (GameWorld.getExecutionReason() !== "unittest") {
  console.log("--- Welcome to TI4 ---");
}

export function registerErrorHandler() {
  if (GameWorld.getExecutionReason() !== "unittest") {
    // Initialize error handing when running in production.
    new ErrorHandler().init();
    new BugSplatRemoteReporter({
      database: "da_test",
      appName: "TI4-TTPG-TS",
      appVersion: "1",
    }).init();
  }
}
registerErrorHandler();

export class TI4Class {
  // Strings.
  public readonly locale = locale;

  // Events.
  public readonly events = Object.freeze(new GlobalEvents());

  // Libraries.
  public readonly autoStreamerCamera = new AutoStreamerCamera(
    "@auto-streamer-camera/ti4",
  );
  public readonly borders = new AllBorders();
  public readonly config = new Config("@config/ti4");
  public readonly hex = new Hex(HEX_LAYOUT_POINTY, 5.77735 * 1.5);
  public readonly factionRegistry = new FactionRegistry()
    .loadDefaultData()
    .loadDefaultRewriteNsid();
  public readonly findTracking = new FindTracking();
  public readonly gameDataUpdator = new GameDataUpdator(
    GAME_DATA_UPDATORS,
  ).startPeriodicUpdatesInProduction();
  public readonly goalReporter = new GoalReporter();
  public readonly hideMouseCursor = new HideMouseCursor(
    "@hide-mouse-cursor/ti4",
  );
  public readonly homebrewRegistry = new HomebrewRegistry();
  public readonly lastGameData = new LastGameData();
  public readonly systemAttachmentRegistry =
    new SystemAttachmentRegistry().loadDefaultData(); // do this BEFORE planet attachments so they can attach to system attachments (e.g. mirage)
  public readonly planetAttachmentRegistry =
    new PlanetAttachmentRegistry().loadDefaultData();
  public readonly playerActionPhaseTime = new PlayerActionPhaseTime(
    "@player-action-phase-time/ti4",
  );
  public readonly playerColor = new PlayerColor("@player-color/ti4");
  public readonly playerName = new PlayerName();
  public readonly playerSeats = new PlayerSeats();
  public readonly removeRegistry = new RemoveRegistry().loadDefaultData();
  public readonly slashCommandRegistry =
    new SlashCommandRegistry().loadDefaultData();
  public readonly spawn = __spawn.inject(NSID_TO_TEMPLATE_ID);
  public readonly systemRegistry = new SystemRegistry().loadDefaultData();
  public readonly techRegistry = new TechRegistry().loadDefaultData();
  public readonly timer = new Timer("@timer/ti4");
  public readonly turnOrder = new TurnOrder("@turn-order/ti4");
  public readonly unitAttrsRegistry = new UnitAttrsRegistry().loadDefaultData();
  public readonly unitModifierRegistry =
    new UnitModifierRegistry().loadDefaultData();
  public readonly useStreamerBuddy = new UseStreamerBuddy(
    "@use-streamer-buddy/ti4",
  );
  public readonly whisperSpy = new WhisperSpy("@whisper-spy/ti4");
}

// Also place "TI4" in the global namespace.
declare global {
  // eslint-disable-next-line no-var
  var TI4: TI4Class;
  var __spawn: Spawn;
}
globalThis.__spawn = new Spawn();

// Expose a reset function so tests can reset.
// ttpg-mock resets globalEvents after each test, breaking listeners here.
export function resetGlobalThisTI4(): TI4Class {
  globalThis.TI4 = new TI4Class();
  Object.freeze(globalThis.TI4);

  TI4.locale.inject(LOCALE_CONTEXT_MENUS);

  // Run any delayed initialization, things that need globalThis.TI4 to be set.
  // These are "init" functions in the class objects.
  const iGlobals: Array<IGlobal> = [
    new ActivateSystem(),
    new ApplyLocaleDescriptions(),
    new ControlTokenSystem(),
    new DiceGroupCleanup(),
    new DiplomacySystem(),
    // new DisplayPDSAdjacency(),
    new GameDataExport(),
    new HeroDimensionalAnchor(),
    new HeroHelioCommandArray(),
    new HeroMultiverseShift(),
    new LeaveSeat(),
    new NumpadKeyAll(),
    new OnAgendaCard(),
    new OnAgendaStateCreated(),
    new OnCardBecameSingletonOrDeck(),
    new OnChatMessage(),
    new OnCombatClicked(),
    new OnCombatResult(),
    new OnFetchPlanetCardRequest(),
    new OnGameEnd(),
    new OnObjectFellThroughTable(),
    new OnPlanetCardSingleton(),
    new OnPlayerChangeColorRequest(),
    new OnPlayerChangedColor(),
    new OnSliceDraftRequest(),
    new OnStartThundersEdge(),
    new OnStartTwilightsFall(),
    new OnStrategyCardPlayed(),
    new OnSystemActivated(),
    new OnTurnStateChanged(),
    new OnWhisper(),
    new ReportCommandTokenPutGet(),
    new ReportRemaining(),
    new RightClickAgenda(),
    new RightClickCrisis(),
    new RightClickExplore(),
    new RightClickExtremeDuress(),
    new RightClickFetchPlanetCard(),
    new RightClickFracture(),
    new RightClickGalvanizeToken(),
    new RightClickGravleashManeuvers(),
    new RightClickHotPotatoScore(),
    new RightClickIihqModernization(),
    new RightClickIihqModernizationBT(),
    new RightClickInfantry2(),
    new RightClickLetaniWarrior2(),
    new RightClickMabanOmega(),
    new RightClickMabanOmegaAlliance(),
    new RightClickMageonImplants(),
    new RightClickMercenaryContract(),
    new RightClickNanoForge(),
    new RightClickObsidianFirmament(),
    new RightClickPirateContract(1),
    new RightClickPirateContract(2),
    new RightClickPirateContract(3),
    new RightClickPirateContract(4),
    new RightClickPirateFleet(),
    new RightClickPurge(),
    new RightClickRider(),
    new RightClickRift(),
    new RightClickScorePrivate(),
    new RightClickScorePublic(),
    new RightClickSleeperToken(),
    new RightClickSpecOps2(),
    new RightClickStellarConverter(),
    new RightClickTheCavalry(),
    new RightClickTFAbilitySplice(),
    new RightClickTFDragonFreed(),
    new RightClickTFEdict(),
    new RightClickTFGenomeSplice(),
    new RightClickTFSupercharge(),
    new RightClickTFUnitUpgradeSplice(),
    new RightClickThundersEdge(),
    new RightClickYinAscendant(),
    new RSwapSplitCombine(),
    new RunInjectScript(),
    new ShuffleDecks(),
    new StartGame(),
    new StartGameWindow(),
    new TFAhkSylFier(),
    new TFAwakeningGeoform(),
    new TFDimensionalTear(),
    //new TFFactionRefCardUI(),
    new TFHeliosEntity(),
    new TFSingularityX(),
    new TFSingularityY(),
    new TFSingularityZ(),
    new TFTelepathicNaalu0(),
    new ToggleActionPhaseTimes(),
    new ToggleAgenda(),
    new ToggleAllPlayersTech(),
    new ToggleBorders(),
    new ToggleCombatWindow(),
    new ToggleHelp(),
    new ToggleMapTool(),
    new ToggleStats(),
    new ToggleStratCards(),
    new ToggleStreamerTool(),
    new ToggleTechChooser(),
    new UnitModifierActiveIdle(),
    new UnpackFactionContextMenuItem(),
    new WhisperReporter(),

    // Events.
    new RightClickAgeOfExploration(),
    new RightClickMinorFactions(),

    // Do these last to be below "real" right click options.
    //new RightClickDelete(),
  ];

  // Add UI and some bug workarounds to production runs.
  if (GameWorld.getExecutionReason() !== "unittest") {
    iGlobals.push(
      ...[
        new BugCardHolderAssignment("card-holder:base/player-hand"),
        ////new BugForceTransformUpdates(),
        new BugUniqueCards(),
        new CreateAndAttachEndTurnButtonUI(),
        new CreateAndAttachTurnOrderUI(),
      ],
    );
  }

  // Some game data updators need IGlobal.  This is a hack.
  for (const updator of GAME_DATA_UPDATORS) {
    if (updator instanceof UpdatorHistory) {
      iGlobals.push(updator);
    }
  }

  // Finally run any "after everything else" init functions.
  iGlobals.push(
    ...[
      new AgendaActivityMaybeResume(),
      new DraftActivityMaybeResume(),
      new DraftActivityMaybeResumeTF(),
    ],
  );

  for (const v of Object.values(globalThis.TI4)) {
    if (typeof v.init === "function") {
      iGlobals.push(v);
    }
  }
  GlobalInit.runGlobalInit(iGlobals);

  return globalThis.TI4;
}

// Unittests reset the globalThis.TI4 object before each test.
// Only the main TI4 mod creates the global TI4 variable, other
// mods using the ti4-ttpg-ts npm module share the same instance.
const isTest: boolean = GameWorld.getExecutionReason() === "unittest";
const devId: string = "F5DD9DEDA6C64881A2EEBBC273224D01";
const prdId: string = "F5DD9DEDA6C64881A2EEBBC273224D02";
const isMainMod: boolean = packageId === devId || packageId === prdId;
if (!isTest && isMainMod) {
  resetGlobalThisTI4();
  TI4.config.onConfigChanged.add(() => {
    BugSplatRemoteReporter.setEnabled(TI4.config.reportErrors);
  });
  BugSplatRemoteReporter.setEnabled(TI4.config.reportErrors);
}

world.setShowDiceRollMessages(false); // Disable default TTPG messages for dice rolls.
