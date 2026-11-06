/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
// PNG nos frames intermediários: o deck é área chapada + tipografia pesada +
// fios de 1,5px, e o JPEG deixava ringing na borda das letras e risco de
// banding nos fundos verdes antes mesmo do H.264 entrar.
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);
