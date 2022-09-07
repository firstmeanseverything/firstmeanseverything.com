import { gql, GraphQLClient } from 'graphql-request'

import {
  CompetitionPageQuery,
  CompetitionsListQuery,
  CompetitionsPathsQuery
} from '@/queries/competition'
import {
  ProgramPageQuery,
  ProgramPreviewPageQuery,
  ProgramsPathsQuery,
  SampleProgramPageQuery
} from '@/queries/program'

const graphCmsClient = new GraphQLClient(
  'https://api-eu-central-1.graphcms.com/v2/ck9l9rsch25ku01wbbnd30c1s/master',
  {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN}`
    }
  }
)

export default graphCmsClient

const getCompetitionsList = async (args, preview) =>
  await graphCmsClient.request(CompetitionsListQuery, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    ...args
  })

const getCompetitionPage = async (args, preview) =>
  await graphCmsClient.request(CompetitionPageQuery, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    ...args
  })

const getCompetitionsPaths = async (args) =>
  await graphCmsClient.request(CompetitionsPathsQuery, args)

const getProgramPage = async (args, preview) =>
  await graphCmsClient.request(ProgramPageQuery, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    ...args
  })

const getProgramPreviewPage = async (id) =>
  await graphCmsClient.request(ProgramPreviewPageQuery, { id, stage: 'DRAFT' })

const getProgramsList = async (query, args, preview) =>
  await graphCmsClient.request(query, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    category: 'RX',
    ...args
  })

const getProgramsPaths = async (args) =>
  await graphCmsClient.request(ProgramsPathsQuery, args)

const getSampleProgramPage = async (args, preview) =>
  await graphCmsClient.request(SampleProgramPageQuery, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    free: true,
    ...args
  })

export {
  getCompetitionPage,
  getCompetitionsList,
  getCompetitionsPaths,
  getProgramPreviewPage,
  getProgramPage,
  getProgramsList,
  getProgramsPaths,
  getSampleProgramPage,
  gql
}
