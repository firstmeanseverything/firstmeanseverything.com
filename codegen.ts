import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema:
    'https://api-eu-central-1.graphcms.com/v2/ck9l9rsch25ku01wbbnd30c1s/master',
  documents: ['graphql/**/*.graphql'],
  generates: {
    './graphql/sdk.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request'
      ]
    }
  }
}

export default config
