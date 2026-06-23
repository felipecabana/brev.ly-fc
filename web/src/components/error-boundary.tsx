import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './ui/button'

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

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8">
          <div className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-md bg-gray-100 px-5 py-12 md:px-12 md:py-16">
            <h1 className="text-center text-body-xl text-gray-600">
              Ocorreu um erro
            </h1>

            <p className="text-center text-body-md text-gray-500">
              Algo inesperado aconteceu. Tente voltar para a página inicial.
            </p>

            <a
              href="/"
              className="w-full max-w-[280px] rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-base"
            >
              <Button type="button">Voltar para a home</Button>
            </a>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
