import { entrypoints } from 'uxp';
import { executeFrequencySeparation } from '../modules/actions/frequency-separation';

entrypoints.setup({
    commands: {
        executeFrequencySeparation: () => {
            executeFrequencySeparation();
        }
    }
});