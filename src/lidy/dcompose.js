import { parse as parse_input } from 'lidy-js'
let rules={"main":"root","root":{"_oneOf":["docker-compose","service"]},"docker-compose":{"_map":{"version":"string","services":{"_mapOf":{"string":"service"}}}},"service":{"_map":{"image":"string"},"_mapFacultative":{"build":{"_mapFacultative":{"context":"string","dockerfile":"string","args":{"_listOf":"string"}}},"depends_on":{"_oneOf":[{"_listOf":"string"},{"_map":{"any":{"condition":"string"}}}]},"healthcheck":{"_map":{"test":"string","interval":"string","timeout":"string","retries":"int"}},"stdin_open":"boolean","tty":"boolean","privileged":"boolean","command":"string","environment":{"_listOf":"string"},"ports":{"_listOf":"string"}}}}
export function parse(input) { 
  input.rules = rules
  return parse_input(input)
}