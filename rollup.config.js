import uglify from "rollup-plugin-uglify";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import { minify } from 'uglify-es'

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
    uglify({}, minify)
  );
}

export default config;
