import { parse as parse_input } from 'lidy-js'
let rules={"main":"root","root":{"_oneOf":["docker-compose","service"]},"docker-compose":{"_map":{"version":"string","services":{"_mapOf":{"string":"service"}}}},"service":{"_map":{"image":"string"},"_mapFacultative":{"stdin_open":"boolean","tty":"boolean","environment":{"_listOf":"string"},"ports":{"_listOf":"string"}}}}
export function parse(input) { 
  input.rules = rules
  return parse_input(input)
}