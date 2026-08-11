/** Tokens espelham NORDLIBERTADESIGNSYSTEM.md */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // orange-700 = variante acessível p/ superfícies COM texto branco (AA 5.18:1).
        // #FA7A35 segue sendo a cor de ação da marca em preenchimentos sem texto.
        orange: { 500: '#FA7A35', 600: '#E06600', 700: '#C2410C' },
        peach: { 100: '#FFF3EB' },
        navy: { 900: '#20344C', 950: '#131F2E' },
        cream: { 50: '#FDFCFA', 100: '#F7F5F0' },
        score: { good: '#2E9E5B', medium: '#FA7A35', low: '#D64545' },
        ink: { DEFAULT: '#111111', body: '#555555', line: '#DDDDDD' },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        ui: ['"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '12px', module: '16px', btn: '11px', input: '8px' },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.04)',
        module: '0 4px 10px rgba(0,0,0,.08), 0 12px 28px rgba(0,0,0,.10)',
        float: '0 20px 50px rgba(0,0,0,.35)',
      },
    },
  },
  plugins: [],
};
