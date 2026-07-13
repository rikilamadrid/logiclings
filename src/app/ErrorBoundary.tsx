import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '../components/atoms/Button/Button'
import { Container } from '../components/atoms/Container/Container'
import { Heading } from '../components/atoms/Heading/Heading'
import { Text } from '../components/atoms/Text/Text'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled error in app shell', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false })
    window.location.assign('/')
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container padding="lg">
          <Heading level={1}>Something went wrong</Heading>
          <Text tone="muted">
            Logiclings hit an unexpected error. Try heading back home.
          </Text>
          <Button onClick={this.handleReset}>Back to home</Button>
        </Container>
      )
    }

    return this.props.children
  }
}
