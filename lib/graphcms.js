import { gql, GraphQLClient } from 'graphql-request'

import {
  ProgramPageQuery,
  ProgramPreviewPageQuery,
  ProgramsListQuery,
  ProgramsPathsQuery,
  SampleProgramPageQuery,
  SampleProgramsListQuery
} from '@/queries/program'

const graphCmsClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT,
  {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN}`
    }
  }
)

export default graphCmsClient

const getProgramPage = async (args, preview) =>
  await graphCmsClient.request(ProgramPageQuery, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    ...args
  })

const getProgramPreviewPage = async (id) =>
  await graphCmsClient.request(ProgramPreviewPageQuery, { id })

const getProgramsList = async (args, preview) =>
  await graphCmsClient.request(ProgramsListQuery, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    ...args
  })

const getProgramsPaths = async (args, preview) =>
  await graphCmsClient.request(ProgramsPathsQuery, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    ...args
  })

const getSampleProgramPage = async (args, preview) =>
  await graphCmsClient.request(SampleProgramPageQuery, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    ...args
  })

const getSampleProgramsList = async (args, preview) =>
  await graphCmsClient.request(SampleProgramsListQuery, {
    stage: preview ? 'DRAFT' : 'PUBLISHED',
    ...args
  })

export {
  getProgramPreviewPage,
  getProgramPage,
  getProgramsList,
  getProgramsPaths,
  getSampleProgramPage,
  getSampleProgramsList,
  gql
}
