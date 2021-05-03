import * as path from 'path';

/**
 * @param {{ include?: string[], exclude?: string[] }} options
 * @returns {import('rollup').Plugin}
 */
function css() {

    return {
        name: 'rollup-plugin-css',
        transform(code, id) {
            if (!id.endsWith('.css'))
                return null;

            code = `
                // StyleAsset: ${path.relative(process.cwd(), id)}
                const styles = document.createElement('styles');
                styles.innerHTML = ${JSON.stringify(code)};
                document.head.appendChild(style);
                export default styles.innerHTML;
            `;

            return { code };
        }
    }
}

export default css;