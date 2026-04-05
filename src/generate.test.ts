import { generate } from "ti4-hb-helper";
import { homebrew } from "./homebrew";

it("generate", async () => {
  await generate(homebrew);
})
