import { promises as fs } from 'fs';

/**
 * @param {{ include?: string[], exclude?: string[] }} options
 * @returns {import('rollup').Plugin}
 */
function css() {

    return {
        name: 'rollup-plugin-css',
        async load(id) {
            if (!id.endsWith('.css'))
                return null;

            let code = await fs.readFile(id, { encoding: 'utf-8' });
            code = `
                export default ${JSON.stringify(code)};
            `;

            return code;
        }
    }
}

export default css;