import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8">
      <Card variant="centered">
        <img
          src="/assets/404.svg"
          alt=""
          className="h-[72px] w-[164px] md:h-[85px] md:w-[194px]"
        />

        <h1 className="text-center text-body-xl text-gray-600">
          Link não encontrado
        </h1>

        <p className="text-center text-body-md text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma
          URL inválida. Saiba mais em{' '}
          <Link
            to="/"
            className="rounded-sm text-blue-base underline transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-base"
          >
            brev.ly
          </Link>
          .
        </p>

        <Link to="/" className="w-full max-w-[280px] focus-visible:outline-none">
          <Button type="button">Voltar para a home</Button>
        </Link>
      </Card>
    </main>
  )
}
