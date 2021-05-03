import { entrypoints } from "uxp";
import { executeFrequencySeparation } from "../interface/pages/tools/frequency-separation";

entrypoints.setup({
    commands: {
        executeFrequencySeparation: () => {
            executeFrequencySeparation();
        }
    }
});