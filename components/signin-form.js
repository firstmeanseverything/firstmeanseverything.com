import { useReducer } from 'react'
import { FormContext, useForm } from 'react-hook-form'
import * as yup from 'yup'

import firebase from '../lib/firebase'
import { FormInput } from './form'

function reducer(state, { payload, type }) {
  switch (type) {
    case 'ERROR':
      return { ...state, formState: 'error', ...payload }
    case 'LOADING':
      return { ...state, formState: 'loading', ...payload }
    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

function SignInForm() {
  const { handleSubmit, ...methods } = useForm({
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required('Email address is required')
        .email('Email is not valid'),
      password: yup.string().required('Password is required'),
    }),
  })
  const [state, dispatch] = useReducer(reducer, {
    formState: null,
    message: null,
  })

  const signIn = async ({ email, password }) => {
    dispatch({
      type: 'LOADING',
      payload: { message: 'Signing you in' },
    })
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: { message: error.message },
      })
    }
  }

  return (
    <FormContext {...methods}>
      {state.formState === 'error' && <p>{state.message}</p>}
      <form onSubmit={handleSubmit(signIn)}>
        <div className="mb-4">
          <FormInput field="email" placeholder="Email address" />
        </div>
        <div className="mb-4">
          <FormInput field="password" type="password" placeholder="Password" />
        </div>
        <button type="submit">Go</button>
      </form>
    </FormContext>
  )
}

export default SignInForm
