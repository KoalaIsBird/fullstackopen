import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  concat,
  HttpLink,
  InMemoryCache
} from '@apollo/client'

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const headerLink = new ApolloLink((operation, forward) => {
  const localToken = localStorage.getItem('user-token')
  if (localToken) {
    operation.setContext(c => ({
      ...c,
      headers: { ...c.headers, authorization: localToken }
    }))
  }
  
  return forward(operation)
})

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: headerLink.concat(httpLink)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={apolloClient}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
)
