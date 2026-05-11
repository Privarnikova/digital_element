import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";
import postcssPresetEnv from "postcss-preset-env";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    postcssImport(),
    postcssNested(),
    postcssPresetEnv({
      stage: 2,
      features: {
        "custom-properties": false,
        "nesting-rules": false,
      },
    }),
    autoprefixer(),
  ],
};
