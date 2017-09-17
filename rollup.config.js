import uglify from "rollup-plugin-uglify";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";

var env = process.env.NODE_ENV;
var config = {
  format: "umd",
  moduleName: "Legendables",
  plugins: [
    typescript(),
    commonjs(),
    resolve()
  ]
};

if (env === "production") {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
