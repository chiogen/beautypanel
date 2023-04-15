import { entrypoints } from 'uxp';
import { executeDodgeAndBurn } from '../modules/actions/dodge-and-burn';
import { executeFrequencySeparation } from '../modules/actions/frequency-separation';

entrypoints.setup({
    commands: {
        executeFrequencySeparation,
        executeDodgeAndBurn,
    }
});