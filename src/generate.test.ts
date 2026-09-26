import {
  AbstractGen,
  GenExtDeck,
  GenExtPngToken,
  GenExtTokenSameFaceAndBack,
  generate,
} from "ti4-hb-helper";
import { homebrew } from "./homebrew";


it("generate", async () => {
  let abstractGen: AbstractGen;
  const errors: Array<string> = [];

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("axis-order")
    .setIsSharedBack(true);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("bannerhall")
    .setIsSharedBack(false);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("trap")
    .setIsSharedBack(true);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("policy")
    .setIsLandscape(true)
    .setIsSharedBack(false);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("celagrom")
    .setIsLandscape(true)
    .setIsSharedBack(false);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("lord")
    .setIsLandscape(true)
    .setIsSharedBack(false);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("legendary-planet")
    .setIsSharedBack(false);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("dhonraz")
    .setIsSharedBack(false);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("grove")
    .setIsSharedBack(false);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtDeck(homebrew)
    .setDeckType("olradin")
    .setIsSharedBack(false)
    .setIsLandscape(true);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtPngToken(homebrew)
    .setToken("celagrom-token")
    .setTokenExtraPath("celagrom")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtPngToken(homebrew)
    .setToken("lord-token")
    .setTokenExtraPath("lord")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("bentor-commodity-token")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("cultural-fragment-token")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("frontier-fragment-token")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("hazardous-fragment-token")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("industrial-fragment-token")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("bentor-commodity-token")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtPngToken(homebrew)
    .setTokenExtraPath("gledge/commodity")
    .setToken("gledge-commodity-token")
    .setWidth(2);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtPngToken(homebrew)
    .setToken("core-token")
    .setTokenExtraPath("gledge/core")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtPngToken(homebrew)
    .setToken("myko-commodity-token")
    .setTokenExtraPath("myko")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

    abstractGen = new GenExtPngToken(homebrew)
    .setTokenExtraPath("rohdhna")
    .setToken("rohdhna-commodity-token")
    .setWidth(2);
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("celdauri-space-dock")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("cheiran-dreadnought-token")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("cheiran-mech-token")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  abstractGen = new GenExtTokenSameFaceAndBack(homebrew)
    .setToken("nokar-destroyer-token")
  await abstractGen.generate(errors);
  await abstractGen.writeOutputFiles();

  await generate(homebrew);

  if (errors.length > 0) {
    throw new Error("ext gen:\n" + errors.join("\n"));
  }
}, 300000)
