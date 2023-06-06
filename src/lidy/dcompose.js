/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable comma-spacing */
/* eslint-disable key-spacing */
/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable space-infix-ops */
/* eslint-disable object-curly-newline */
/* eslint-disable object-curly-spacing */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
import { parse as parse_input } from 'lidy-js';

let rules={"main":"root","root":{"_oneOf":["docker-compose","service","volume","network"]},"docker-compose":{"_map":{"version":"string"},"_mapFacultative":{"services":{"_mapOf":{"string":"service"}},"volumes":{"_mapOf":{"string":"volume"}},"networks":{"_mapOf":{"string":"network"}}}},"service":{"_map":{"image":"string"},"_mapFacultative":{"build":{"_mapFacultative":{"context":"string","dockerfile":"string","args":{"_listOf":"string"}}},"depends_on":{"_mapOf":{"string":{"_mapFacultative":{"condition":"string"}}}},"healthcheck":{"_mapFacultative":{"test":"string","interval":"string","timeout":"string","retries":"int"}},"networks":{"_listOf":"string"},"volumes":{"_listOf":"string"},"stdin_open":"boolean","tty":"boolean","privileged":"boolean","command":"string","environment":{"_listOf":"string"},"ports":{"_listOf":"string"}}},"volume":{"_map":{"driver":"string"},"_mapFacultative":{"driver_opts":{"_listOf":"string"},"labels":{"_listOf":"string"},"external":"boolean"}},"network":{"_map":{"driver":"string"},"_mapFacultative":{"driver_opts":{"_listOf":"string"},"enable_ipv6":"boolean","ipam":{"_map":null,"driver":"string","_mapFacultative":{"subnet":"string","ip_range":"string","gateway":"string","aux_adresses":{"_listOf":"string"}}},"options":{"_listOf":"string"}}}};
export function parse(input) {
  input.rules = rules;
  return parse_input(input);
}
