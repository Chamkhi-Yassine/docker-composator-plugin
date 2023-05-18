/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable comma-spacing */
/* eslint-disable key-spacing */
/* eslint-disable object-curly-newline */
/* eslint-disable object-curly-spacing */
/* eslint-disable space-infix-ops */
/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
import { parse as parse_input } from 'lidy-js';

let rules={"main":"root","root":"docker-compose","docker-compose":{"_map":{"version":"string","services":{"_mapOf":{"any":"service"}}}},"service":{"_map":{"image":"string"},"_mapFacultative":{"stdin_open":"bool","tty":"bool","environment":{"_listOf":"string"},"ports":{"_listOf":"string"}}}};
export function parse(input) {
  input.rules = rules;
  return parse_input(input);
}
