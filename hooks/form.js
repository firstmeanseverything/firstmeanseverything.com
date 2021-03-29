import * as React from 'react'

function formReducer(state, { payload, type }) {
  switch (type) {
    case 'ERROR':
      return { ...state, status: 'error', ...payload }
    case 'LOADING':
      return { ...state, status: 'loading', ...payload }
    case 'SUCCESS':
      return { ...state, status: 'success', ...payload }
    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

function useFormReducer() {
  const [formState, formDispatch] = React.useReducer(formReducer, {
    status: null,
    message: null
  })

  const formError = formState.status === 'error'
  const formLoading = formState.status === 'loading'
  const formSuccess = formState.status === 'success'

  const setFormError = ({ message = 'Error' } = {}) =>
    formDispatch({
      type: 'ERROR',
      payload: { message }
    })

  const setFormLoading = ({ message = 'Loading' } = {}) =>
    formDispatch({
      type: 'LOADING',
      payload: { message }
    })

  const setFormSuccess = ({ message = 'Success' } = {}) =>
    formDispatch({
      type: 'SUCCESS',
      payload: { message }
    })

  return {
    formError,
    formLoading,
    formState,
    formSuccess,
    setFormError,
    setFormLoading,
    setFormSuccess
  }
}

export { useFormReducer }
